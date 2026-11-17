#!/usr/bin/env python3
"""Editor automático de videos estilo CapCut.

Uso:
  python3 autoedit.py            # vigila inbox/ y edita cada video que llegue
  python3 autoedit.py --once     # edita lo que hay en inbox/ y termina

Para cada video:
  - quita los silencios largos (corte tipo "jump cut")
  - agrega subtítulos palabra por palabra (resaltado amarillo, como CapCut)
  - pone un título en pantalla al inicio
  - hace un zoom de impacto sincronizado con cada frase
  - agrega efectos de sonido (pop en cada zoom, whoosh en el título)
  - mezcla música de fondo opcional, bajando su volumen cuando hay voz
  - aplica un retoque de color (contraste y saturación)
"""
from __future__ import annotations

import argparse
import array
import json
import math
import random
import re
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
import wave
from dataclasses import dataclass
from pathlib import Path

HERE = Path(__file__).resolve().parent
VIDEO_EXTS = {".mp4", ".mov", ".mkv", ".webm", ".m4v"}
AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".aac", ".ogg"}
SR = 44100
MAX_PULSES = 140
MAX_CUTS = 400


@dataclass
class Options:
    inbox: Path = HERE / "inbox"
    outbox: Path = HERE / "outputs"
    assets: Path = HERE / "assets"
    language: str = "es"
    model: str = "small"
    width: int = 1080
    height: int = 1920
    cut_silence: bool = True
    zoom: bool = True
    sfx: bool = True
    subtitles: bool = True
    title: bool = True
    font: str = "DejaVu Sans"
    zoom_amount: float = 0.10


# ---------- utilidades ----------

def run(cmd: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess:
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if result.returncode != 0:
        tail = "\n".join(result.stderr.strip().splitlines()[-15:])
        raise RuntimeError(f"Falló {cmd[0]} (código {result.returncode}):\n{tail}")
    return result


def probe(path: Path) -> dict:
    out = run([
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_streams", "-show_format", str(path),
    ]).stdout
    info = json.loads(out)
    video = next(s for s in info["streams"] if s["codec_type"] == "video")
    return {
        "duration": float(info["format"]["duration"]),
        "has_audio": any(s["codec_type"] == "audio" for s in info["streams"]),
        "width": int(video["width"]),
        "height": int(video["height"]),
    }


# ---------- análisis de audio ----------

_whisper = None


def transcribe(wav: Path, opts: Options) -> list[dict]:
    """Devuelve una lista de frases: {"start", "end", "words": [{"start","end","word"}]}."""
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel  # import pesado: solo si hace falta
        _whisper = WhisperModel(opts.model, device="cpu", compute_type="int8")
    segments, _ = _whisper.transcribe(
        str(wav), language=opts.language, word_timestamps=True, vad_filter=True,
    )
    sentences = []
    for seg in segments:
        words = [
            {"start": w.start, "end": w.end, "word": w.word.strip()}
            for w in (seg.words or []) if w.word.strip()
        ]
        if words:
            sentences.append({"start": seg.start, "end": seg.end, "words": words})
    return sentences


def detect_silences(wav: Path, duration: float, min_silence: float = 0.45) -> list[tuple[float, float]]:
    err = run([
        "ffmpeg", "-hide_banner", "-nostats", "-i", str(wav),
        "-af", f"silencedetect=noise=-32dB:d={min_silence}", "-f", "null", "-",
    ]).stderr
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", err)]
    if len(starts) > len(ends):  # silencio que llega hasta el final
        ends.append(duration)
    return list(zip(starts, ends))


def speech_segments(duration: float, silences, pad: float = 0.12, min_len: float = 0.25):
    """Invierte los silencios para obtener los tramos con voz, con un margen a cada lado."""
    raw, cursor = [], 0.0
    for s, e in silences:
        if s > cursor:
            raw.append((cursor, s))
        cursor = e
    if cursor < duration:
        raw.append((cursor, duration))

    merged: list[tuple[float, float]] = []
    for s, e in raw:
        s, e = max(0.0, s - pad), min(duration, e + pad)
        if e - s < min_len:
            continue
        if merged and s <= merged[-1][1]:
            merged[-1] = (merged[-1][0], e)
        else:
            merged.append((s, e))
    return merged or [(0.0, duration)]


def make_remap(segments):
    """Convierte un instante del video original al instante del video ya cortado."""
    def remap(t: float) -> float:
        offset = 0.0
        for s, e in segments:
            if t < s:
                return offset
            if t <= e:
                return offset + (t - s)
            offset += e - s
        return offset
    return remap


# ---------- subtítulos y título (ASS) ----------

def ass_time(t: float) -> str:
    cs = int(round(max(0.0, t) * 100))
    h, rem = divmod(cs, 360000)
    m, rem = divmod(rem, 6000)
    s, cs = divmod(rem, 100)
    return f"{h}:{m:02}:{s:02}.{cs:02}"


def ass_escape(text: str) -> str:
    return text.replace("{", "(").replace("}", ")").replace("\n", " ")


def group_words(words, max_words=3, max_dur=2.4, max_gap=0.6):
    chunks, current = [], []
    for w in words:
        if current and (
            len(current) >= max_words
            or w["end"] - current[0]["start"] > max_dur
            or w["start"] - current[-1]["end"] > max_gap
        ):
            chunks.append(current)
            current = []
        current.append(w)
    if current:
        chunks.append(current)
    return chunks


def build_ass(opts: Options, words, title: str | None, duration: float) -> str:
    W, H = opts.width, opts.height
    sub_size = round(W * 0.075)
    title_size = round(W * 0.105)
    lines = [
        "[Script Info]", "ScriptType: v4.00+",
        f"PlayResX: {W}", f"PlayResY: {H}", "WrapStyle: 0", "ScaledBorderAndShadow: yes", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
        "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, "
        "Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        # Subtítulos: sin resaltar en blanco, la palabra que suena se pone amarilla. Abajo, en la zona segura.
        f"Style: Sub,{opts.font},{sub_size},&H0000FFFF,&H00FFFFFF,&H00000000,&H80000000,"
        f"-1,0,0,0,100,100,0,0,1,7,2,2,80,80,{round(H * 0.20)},1",
        # Título: arriba, con borde grueso.
        f"Style: Title,{opts.font},{title_size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,"
        f"-1,0,0,0,100,100,0,0,1,8,0,8,70,70,{round(H * 0.12)},1",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    if title:
        end = min(3.2, duration)
        lines.append(
            f"Dialogue: 1,{ass_time(0)},{ass_time(end)},Title,,0,0,0,,"
            f"{{\\fad(250,300)\\fscx80\\fscy80\\t(0,160,\\fscx100\\fscy100)}}{ass_escape(title)}"
        )
    for chunk in group_words(words):
        start, end = chunk[0]["start"], chunk[-1]["end"]
        parts = []
        for w in chunk:
            cs = max(1, round((w["end"] - w["start"]) * 100))
            parts.append(f"{{\\k{cs}}}{ass_escape(w['word'].upper())}")
        text = " ".join(parts)
        # Pequeño "rebote" al aparecer cada bloque de palabras.
        lines.append(
            f"Dialogue: 0,{ass_time(start)},{ass_time(end + 0.15)},Sub,,0,0,0,,"
            f"{{\\fscx85\\fscy85\\t(0,110,\\fscx100\\fscy100)}}{text}"
        )
    return "\n".join(lines) + "\n"


# ---------- efectos de sonido sintetizados ----------

def _synth_pop() -> array.array:
    n = int(0.25 * SR)
    out, phase = array.array("d"), 0.0
    for i in range(n):
        t = i / SR
        phase += 2 * math.pi * (160 + 900 * math.exp(-22 * t)) / SR
        out.append(math.sin(phase) * math.exp(-16 * t) * 0.9)
    return out


def _synth_whoosh(duration: float = 0.7) -> array.array:
    rnd = random.Random(7)
    n = int(duration * SR)
    out, lp = array.array("d"), 0.0
    for i in range(n):
        t = i / n
        lp += (rnd.uniform(-1, 1) - lp) * (0.02 + 0.25 * t)  # el filtro se abre: sonido de barrido
        out.append(lp * math.sin(math.pi * t) ** 2 * 1.6)
    return out


def write_sfx_track(path: Path, duration: float, pulses: list[float], with_title: bool) -> None:
    total = int((duration + 1.0) * SR)
    track = array.array("d", bytes(8 * total))  # silencio

    def add(sound, at, gain):
        i0 = int(at * SR)
        for j, v in enumerate(sound):
            k = i0 + j
            if k >= total:
                break
            track[k] += v * gain

    if pulses:
        pop = _synth_pop()
        for p in pulses:
            add(pop, p, 0.5)
    if with_title:
        add(_synth_whoosh(), 0.0, 0.6)

    peak = max(max(track), -min(track), 1e-9)
    scale = 0.7 / peak if peak > 0.7 else 1.0
    mono = [int(max(-1.0, min(1.0, v * scale)) * 32767) for v in track]
    stereo = array.array("h", [0]) * (2 * total)
    stereo[0::2] = array.array("h", mono)
    stereo[1::2] = array.array("h", mono)
    if sys.byteorder == "big":
        stereo.byteswap()

    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(stereo.tobytes())


# ---------- render con ffmpeg ----------

def zoom_crop_filter(pulses: list[float], amount: float) -> str:
    """Filtro crop cuyo zoom sube en cada pulso y vuelve a bajar en ~0.3 s."""
    bumps = "+".join(
        f"if(gte(t,{p:.3f}),exp(-7*(t-{p:.3f})),0)" for p in pulses
    )
    z = f"min(1+{amount}*({bumps}),{1 + 2 * amount:.3f})"
    return f"crop=w='iw/({z})':h='ih/({z})':x='(iw-ow)/2':y='(ih-oh)/2'"


def render(src: Path, dst: Path, work: Path, plan: dict, opts: Options) -> None:
    W, H = opts.width, opts.height
    inputs = ["-i", str(src), "-i", str(work / "sfx.wav")]
    music = plan["music"]
    if music:
        inputs += ["-stream_loop", "-1", "-i", str(music)]

    g: list[str] = []
    segments, has_audio = plan["segments"], plan["has_audio"]

    # 1) Cortes de silencios: trim + concat.
    if plan["cut"]:
        n = len(segments)
        g.append("[0:v]split={}{}".format(n, "".join(f"[sv{i}]" for i in range(n))))
        if has_audio:
            g.append("[0:a]asplit={}{}".format(n, "".join(f"[sa{i}]" for i in range(n))))
        parts = []
        for i, (s, e) in enumerate(segments):
            g.append(f"[sv{i}]trim=start={s:.3f}:end={e:.3f},setpts=PTS-STARTPTS[v{i}]")
            parts.append(f"[v{i}]")
            if has_audio:
                g.append(f"[sa{i}]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS[a{i}]")
                parts.append(f"[a{i}]")
        g.append("".join(parts) + f"concat=n={n}:v=1:a={int(has_audio)}"
                 + ("[vcut][acut]" if has_audio else "[vcut]"))
        vlab, alab = "[vcut]", "[acut]"
    else:
        vlab, alab = "[0:v]", "[0:a]"

    # 2) Video: formato vertical/horizontal, color, zoom y subtítulos.
    video = (f"{vlab}scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
             "eq=contrast=1.06:saturation=1.12")
    if plan["pulses"]:
        video += f",{zoom_crop_filter(plan['pulses'], opts.zoom_amount)},scale={W}:{H}"
    if plan["ass"]:
        video += ",ass=subs.ass"
    g.append(f"{video},setsar=1[vout]")

    # 3) Audio: voz + efectos + música con ducking.
    sfx = "[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo[sfx]"
    g.append(sfx)
    mix_inputs = []
    if has_audio:
        g.append(f"{alab}aformat=sample_fmts=fltp:channel_layouts=stereo"
                 + (",asplit=2[vo][vsc]" if music else "[vo]"))
        mix_inputs.append("[vo]")
    if music:
        g.append("[2:a]aformat=sample_fmts=fltp:channel_layouts=stereo,volume=0.16[mu]")
        if has_audio:
            g.append("[mu][vsc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[mduck]")
            mix_inputs.append("[mduck]")
        else:
            mix_inputs.append("[mu]")
    mix_inputs.append("[sfx]")
    if len(mix_inputs) == 1:
        g.append(f"{mix_inputs[0]}alimiter=limit=0.95[aout]")
    else:
        g.append("".join(mix_inputs)
                 + f"amix=inputs={len(mix_inputs)}:duration=first:dropout_transition=0:normalize=0,"
                 "alimiter=limit=0.95[aout]")

    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs,
           "-filter_complex", ";".join(g),
           "-map", "[vout]", "-map", "[aout]", "-t", f"{plan['duration']:.3f}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dst)]
    run(cmd, cwd=work)  # subs.ass se referencia por nombre relativo


# ---------- flujo principal ----------

def find_music(opts: Options) -> Path | None:
    folder = opts.assets / "music"
    if not folder.is_dir():
        return None
    found = next((p for p in sorted(folder.iterdir()) if p.suffix.lower() in AUDIO_EXTS), None)
    return found.resolve() if found else None


def pick_pulses(sentences, remap, duration: float) -> list[float]:
    """Un zoom al empezar cada frase. Si no hay voz, uno cada 2.5 s."""
    if sentences:
        candidates = [remap(s["start"]) for s in sentences]
    else:
        candidates = [i * 2.5 for i in range(int(duration // 2.5))]
    pulses, last = [], -10.0
    for t in candidates:
        if t < 0.5 or t >= duration - 0.2 or t - last < 1.2:
            continue
        pulses.append(t)
        last = t
        if len(pulses) >= MAX_PULSES:
            break
    return pulses


def title_for(src: Path) -> str:
    sidecar = src.with_suffix(".txt")  # inbox/mi_video.txt sobreescribe el título
    if sidecar.exists():
        first = sidecar.read_text(encoding="utf-8").strip().splitlines()
        if first and first[0].strip():
            return first[0].strip()
    pretty = re.sub(r"[_\-]+", " ", src.stem).strip()
    return pretty[:1].upper() + pretty[1:]


def process(src: Path, opts: Options) -> Path:
    src = src.resolve()  # ffmpeg corre desde una carpeta temporal: necesita rutas absolutas
    info = probe(src)
    duration, has_audio = info["duration"], info["has_audio"]
    dst = (opts.outbox / f"{src.stem}_editado.mp4").resolve()
    print(f"  duración {duration:.1f}s, audio: {'sí' if has_audio else 'no'}")

    with tempfile.TemporaryDirectory(prefix="autoedit_") as tmp:
        work = Path(tmp)
        sentences, silences = [], []
        if has_audio:
            wav = work / "audio.wav"
            run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(src),
                 "-vn", "-ac", "1", "-ar", "16000", str(wav)])
            if opts.subtitles or opts.zoom:
                try:
                    print("  transcribiendo voz…")
                    sentences = transcribe(wav, opts)
                except Exception as exc:  # sin modelo, seguimos sin subtítulos
                    print(f"  AVISO: no se pudo transcribir ({exc}). Sigo sin subtítulos.")
            if opts.cut_silence:
                silences = detect_silences(wav, duration)

        segments = speech_segments(duration, silences) if silences else [(0.0, duration)]
        cut = segments != [(0.0, duration)] and len(segments) <= MAX_CUTS
        if not cut:
            segments = [(0.0, duration)]
        remap = make_remap(segments)
        new_duration = sum(e - s for s, e in segments)
        if cut:
            print(f"  silencios quitados: {duration - new_duration:.1f}s")

        words = [
            {"start": remap(w["start"]), "end": remap(w["end"]), "word": w["word"]}
            for s in sentences for w in s["words"]
        ]
        title = title_for(src) if opts.title else None
        pulses = pick_pulses(sentences, remap, new_duration) if opts.zoom else []
        music = find_music(opts)

        write_sfx_track(work / "sfx.wav", new_duration,
                        pulses if opts.sfx else [], with_title=bool(title and opts.sfx))
        ass = (opts.subtitles and bool(words)) or bool(title)
        if ass:
            (work / "subs.ass").write_text(
                build_ass(opts, words if opts.subtitles else [], title, new_duration),
                encoding="utf-8")

        plan = {
            "duration": new_duration, "segments": segments, "cut": cut,
            "has_audio": has_audio, "pulses": pulses, "ass": ass, "music": music,
        }
        render(src, dst, work, plan, opts)
    return dst


def is_stable(path: Path) -> bool:
    """El archivo ya terminó de copiarse: su tamaño no cambia en dos segundos."""
    first = path.stat().st_size
    time.sleep(2)
    return path.stat().st_size == first


def load_state(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def main() -> int:
    parser = argparse.ArgumentParser(description="Editor automático de videos estilo CapCut")
    parser.add_argument("--once", action="store_true", help="procesar lo que hay y salir")
    parser.add_argument("--redo", action="store_true", help="volver a procesar aunque ya esté hecho")
    parser.add_argument("--inbox", type=Path, default=HERE / "inbox")
    parser.add_argument("--outbox", type=Path, default=HERE / "outputs")
    parser.add_argument("--idioma", default="es", help="código de idioma para los subtítulos")
    parser.add_argument("--modelo", default="small", help="tiny, base, small, medium o large-v3")
    parser.add_argument("--formato", choices=["vertical", "horizontal"], default="vertical")
    parser.add_argument("--sin-cortes", action="store_true", help="no quitar silencios")
    parser.add_argument("--sin-zoom", action="store_true")
    parser.add_argument("--sin-sonido", action="store_true")
    parser.add_argument("--sin-subtitulos", action="store_true")
    parser.add_argument("--sin-titulo", action="store_true")
    args = parser.parse_args()

    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        print("Falta ffmpeg. Instalalo (en Ubuntu: sudo apt install ffmpeg; en Mac: brew install ffmpeg).")
        return 1

    width, height = (1080, 1920) if args.formato == "vertical" else (1920, 1080)
    opts = Options(
        inbox=args.inbox, outbox=args.outbox, language=args.idioma, model=args.modelo,
        width=width, height=height, cut_silence=not args.sin_cortes, zoom=not args.sin_zoom,
        sfx=not args.sin_sonido, subtitles=not args.sin_subtitulos, title=not args.sin_titulo,
    )
    opts.inbox.mkdir(parents=True, exist_ok=True)
    opts.outbox.mkdir(parents=True, exist_ok=True)
    opts.assets.mkdir(parents=True, exist_ok=True)
    state_path = opts.outbox / ".procesados.json"
    done = {} if args.redo else load_state(state_path)

    print(f"Carpeta de entrada: {opts.inbox}")
    print(f"Carpeta de salida:  {opts.outbox}")
    print("Esperando videos…" if not args.once else "Procesando lo que hay en la carpeta…")

    while True:
        for src in sorted(opts.inbox.iterdir()):
            if src.suffix.lower() not in VIDEO_EXTS or src.name.startswith("."):
                continue
            key = f"{src.name}:{src.stat().st_size}"
            if key in done or not is_stable(src):
                continue
            print(f"\n→ {src.name}")
            try:
                dst = process(src, opts)
                done[key] = dst.name
                print(f"  listo: {dst}")
            except Exception as exc:
                done[key] = f"ERROR: {exc}"
                print(f"  ERROR procesando {src.name}:\n{traceback.format_exc(limit=1)}{exc}")
            state_path.write_text(json.dumps(done, indent=2, ensure_ascii=False), encoding="utf-8")
        if args.once:
            return 0
        time.sleep(5)


if __name__ == "__main__":
    sys.exit(main())
