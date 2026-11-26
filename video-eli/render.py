import subprocess, numpy as np, math
from PIL import Image, ImageFilter
W,H,FPS=1080,1920,30
subprocess.run(["ffmpeg","-y","-loglevel","error","-i","audio.m4a","-ac","1","-ar","16000","audio.wav"],check=True)
raw=subprocess.run(["ffmpeg","-loglevel","error","-i","audio.wav","-f","s16le","-"],capture_output=True).stdout
a=np.frombuffer(raw,dtype=np.int16).astype(np.float32)/32768
n=int(len(a)/16000*FPS)
env=np.array([np.sqrt(np.mean(a[int(i*16000/FPS):int((i+1)*16000/FPS)]**2)+1e-9) for i in range(n)])
env=env/np.percentile(env,95); env=np.clip(env,0,1.2)
sm=np.zeros_like(env)
for i in range(n): sm[i]=0.6*sm[i-1]+0.4*env[i] if i else env[i]
img=Image.open("eli.webp").convert("RGB")
bg=img.resize((W,H*1)).filter(ImageFilter.GaussianBlur(30))
fw=W; fh=int(img.height*W/img.width)
base=img.resize((fw,fh),Image.LANCZOS)
p=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-i","audio.m4a","-c:v","libx264","-pix_fmt","yuv420p","-crf","20","-c:a","aac","-shortest","preview.mp4"],stdin=subprocess.PIPE)
for i in range(n):
    t=i/FPS; e=sm[i]
    s=1.0+0.045*e+0.01*math.sin(t*2)
    rot=math.sin(t*1.6)*1.2+ (e*1.5)*math.sin(t*9)
    f=base.resize((int(fw*s),int(fh*s)),Image.BICUBIC).rotate(rot,resample=Image.BICUBIC,expand=False)
    fr=bg.copy()
    y=(H-f.height)//2 - int(e*14)
    fr.paste(f,((W-f.width)//2,y))
    p.stdin.write(fr.tobytes())
p.stdin.close(); p.wait(); print("ok",n)
