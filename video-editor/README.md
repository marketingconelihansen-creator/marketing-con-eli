# Editor automático de videos (estilo CapCut)

Pones tus videos en la carpeta `inbox/` y el programa los edita solo y los deja en `outputs/`.

Cada video sale con:

- **Cortes de silencios**: se quitan las pausas largas (como un editor que corta tus "eeeh" y silencios).
- **Subtítulos palabra por palabra**: en mayúsculas, con la palabra que suena resaltada en amarillo.
- **Título en pantalla** al inicio (sale del nombre del archivo).
- **Zoom de impacto**: la imagen hace un "pulso" de zoom al empezar cada frase.
- **Efectos de sonido**: un "pop" en cada zoom y un "whoosh" al aparecer el título.
- **Música de fondo** (opcional): baja de volumen automáticamente cuando hablás.
- **Retoque de color**: un poco más de contraste y saturación.
- **Formato vertical 1080×1920** (Reels, TikTok, Shorts). Con `--formato horizontal` sale 1920×1080.

## Instalación (una sola vez)

1. **Python 3.10 o más nuevo** y **ffmpeg**:
   - Mac: `brew install ffmpeg`
   - Windows: instalá ffmpeg (por ejemplo con `winget install ffmpeg`) y Python desde python.org.
   - Ubuntu/Debian: `sudo apt install ffmpeg python3-pip`
2. Desde esta carpeta, instalá la librería de voz:

   ```bash
   pip install -r requirements.txt
   ```

La primera vez que hay voz, el programa descarga el modelo de reconocimiento (unos 500 MB con el modelo `small`). Después queda guardado en tu computadora.

## Uso

**Modo automático** (recomendado): dejá esto corriendo y arrastrá videos a `inbox/`:

```bash
python3 autoedit.py
```

Cada video que aparece en `inbox/` se edita solo. Cuando termina, el resultado está en `outputs/` con el nombre `<nombre>_editado.mp4`. Los videos ya procesados no se vuelven a editar.

**Una sola pasada**: procesa lo que haya en `inbox/` y termina.

```bash
python3 autoedit.py --once
```

### Opciones útiles

| Opción | Qué hace |
|---|---|
| `--formato horizontal` | Sale en 16:9 en vez de vertical |
| `--modelo tiny` / `base` / `small` / `medium` | Más grande = subtítulos más precisos, pero más lento |
| `--idioma en` | Idioma de los subtítulos (por defecto `es`) |
| `--sin-cortes` | No quita silencios |
| `--sin-zoom` / `--sin-sonido` / `--sin-subtitulos` / `--sin-titulo` | Apaga ese efecto |
| `--redo` | Vuelve a editar todo aunque ya esté hecho (útil después de cambiar opciones) |

### Cambiar el título de un video

Por defecto el título es el nombre del archivo (`mi_video_1.mp4` → "Mi video 1"). Para poner otro, creá un archivo de texto con el mismo nombre y la extensión `.txt` junto al video:

```
inbox/mi_video_1.txt   →   Cómo ahorrar $100 por mes
```

### Música de fondo

Poné un archivo de música (`.mp3`, `.wav`, `.m4a`) en `assets/music/`. Se usa el primero que encuentre. Se repite si el video es más largo que la canción.

## Cómo funciona (por si querés tocarlo)

Todo está en `autoedit.py`:

- `transcribe()`: reconocimiento de voz con faster-whisper, da el tiempo exacto de cada palabra.
- `detect_silences()` / `speech_segments()`: detecta las pausas con ffmpeg y arma los tramos con voz.
- `build_ass()`: genera los subtítulos y el título en formato ASS (el mismo que usan los editores profesionales).
- `write_sfx_track()`: sintetiza los efectos de sonido (no hace falta descargar nada).
- `zoom_crop_filter()`: el zoom de impacto, con una curva que sube y baja en cada frase.
- `render()`: arma todo en un solo comando de ffmpeg.

Si el reconocimiento de voz no se puede usar (por ejemplo, sin internet la primera vez), el programa avisa y sigue sin subtítulos ni cortes por voz, pero con zoom, sonido y título.

## Límites conocidos

- Los efectos de sonido son sintéticos (pop y whoosh). Para usar tus propios sonidos hay que editar `_synth_pop()` y `_synth_whoosh()`.
- Los cortes se hacen por volumen, así que en un lugar con mucho ruido de fondo puede cortar de más. Se puede desactivar con `--sin-cortes`.
- No hay interfaz gráfica: se maneja desde la terminal y la carpeta.
