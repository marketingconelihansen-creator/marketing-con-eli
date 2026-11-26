import subprocess, numpy as np, math, wave, random
from PIL import Image, ImageFilter, ImageDraw
W,H,FPS,SR=1080,1920,30,44100
random.seed(4); np.random.seed(4)
w=wave.open("mezcla.wav"); N=w.getnframes(); mix=np.frombuffer(w.readframes(N),dtype=np.int16).astype(np.float32)/32768; w.close()
w=wave.open("voz_limpia.wav"); voz=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; w.close()
n=int(N/SR*FPS)
env=np.array([np.sqrt(np.mean(voz[int(i*SR/FPS):int((i+1)*SR/FPS)]**2)+1e-9) for i in range(n)])
env=np.clip(env/np.percentile(env,95),0,1.2)
sm=np.zeros(n)
for i in range(n): sm[i]=0.6*sm[i-1]+0.4*env[i] if i else env[i]
# --- cortes de escena en las pausas de la voz
bounds=[0]; quiet=0
for i in range(n):
    quiet=quiet+1 if env[i]<0.07 else 0
    if quiet==8 and i-bounds[-1]>int(2.4*FPS): bounds.append(i)
    elif i-bounds[-1]>int(4.6*FPS) and env[i]<0.2: bounds.append(i)
bounds.append(n+1)
print("cortes en seg:",[round(b/FPS,1) for b in bounds[1:-1]])
# --- escena base: fondo borroso + dibujo nítido
img=Image.open("eli.webp").convert("RGB")
bg=img.resize((W,H)).filter(ImageFilter.GaussianBlur(35))
fh=int(img.height*W/img.width); sc=bg.copy(); sc.paste(img.resize((W,fh),Image.LANCZOS),(0,(H-fh)//2))
presets=[((540,960),1.04),((477,690),2.1),((756,1060),1.9),((700,470),1.7),((560,900),1.4),((300,830),1.8)]
# --- efectos de sonido (whoosh) en cada corte
def whoosh(d=0.45):
    m=int(d*SR); t=np.arange(m)/SR; x=np.random.randn(m)
    # filtro barrido: promedio móvil que se va abriendo
    y=np.zeros(m); k=0.02
    for i in range(1,m):
        k=0.02+0.5*(i/m); y[i]=y[i-1]+k*(x[i]-y[i-1])
    e=np.sin(np.pi*np.clip(t/d,0,1))**1.5
    return (y*e*3.0).astype(np.float32)
sfx=np.zeros(N,dtype=np.float32)
for b in bounds[1:-1]:
    s=int(b/FPS*SR)-int(0.12*SR); wv=whoosh(); s=max(0,s); sfx[s:s+len(wv)]+=wv[:max(0,N-s)]
final=np.tanh((mix+sfx*0.35)*1.05)*0.95
o=wave.open("final.wav","wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((final*32767).astype(np.int16).tobytes()); o.close()
# --- nieve
flakes=[[random.uniform(0,W),random.uniform(0,H),random.uniform(2,6),random.uniform(40,120),random.uniform(0,6)] for _ in range(90)]
p=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-i","final.wav","-c:v","libx264","-pix_fmt","yuv420p","-crf","20","-c:a","aac","-b:a","192k","-shortest","eli_video.mp4"],stdin=subprocess.PIPE)
seg=0
for i in range(n):
    t=i/FPS; e=sm[i]
    while i>=bounds[seg+1]: seg+=1
    (cx,cy),z=presets[seg%len(presets)]
    local=(i-bounds[seg])/FPS
    z=z*(1+0.05*min(local/4,1))          # empuje lento
    punch=max(0,1-local/0.28)            # golpe de zoom al cambiar de escena
    z*=1+0.16*punch**2
    z*=1+0.035*e+0.008*math.sin(t*2.1)   # late con la voz
    cx+=math.sin(t*1.3)*10; cy+=math.cos(t*1.7)*8-e*10
    bw,bh=W/z,H/z
    x0=min(max(cx-bw/2,0),W-bw); y0=min(max(cy-bh/2,0),H-bh)
    fr=sc.transform((W,H),Image.EXTENT,(x0,y0,x0+bw,y0+bh),Image.BICUBIC)
    # nieve cayendo
    ov=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(ov)
    for f in flakes:
        f[1]=(f[1]+f[3]/FPS)%H; f[0]=(f[0]+math.sin(t+f[4])*0.8)%W
        d.ellipse((f[0],f[1],f[0]+f[2],f[1]+f[2]),fill=(255,255,255,170))
    fr=Image.alpha_composite(fr.convert("RGBA"),ov)
    # destello blanco en el cambio de escena
    if punch>0:
        fl=Image.new("RGBA",(W,H),(255,255,255,int(150*punch**2))); fr=Image.alpha_composite(fr,fl)
    p.stdin.write(fr.convert("RGB").tobytes())
p.stdin.close(); p.wait(); print("listo")
