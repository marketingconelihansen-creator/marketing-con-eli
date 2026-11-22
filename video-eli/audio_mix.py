import subprocess, numpy as np, wave
SR=44100
def sh(*a): subprocess.run(a,check=True)
# 1) Voz limpia: pasa-altos, quita ruido, compresor, normaliza
sh("ffmpeg","-y","-loglevel","error","-i","audio.m4a","-ar",str(SR),"-ac","1",
   "-af","highpass=f=90,afftdn=nr=18:nf=-35,lowpass=f=12000,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=9","voz_limpia.wav")
w=wave.open("voz_limpia.wav"); n=w.getnframes(); voz=np.frombuffer(w.readframes(n),dtype=np.int16).astype(np.float32)/32768; w.close()
dur=n/SR; t=np.arange(n)/SR
# 2) Musiquita tranqui: acordes suaves (Am - F - C - G), 4 s cada uno
prog=[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]]
mus=np.zeros(n,dtype=np.float32)
for i in range(int(dur//4)+1):
    s,e=int(i*4*SR),min(n,int((i+1)*4*SR))
    if s>=n: break
    tt=t[s:e]-i*4
    env=np.minimum(1,tt/1.2)*np.minimum(1,(4-tt)/1.2)
    for f in prog[i%4]:
        mus[s:e]+=(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*2*tt+1))*env*0.06
    mus[s:e]+=np.sin(2*np.pi*prog[i%4][0]/2*tt)*env*0.05
mus*=0.9
# 3) La música baja cuando hablás (ducking)
frame=int(SR*0.05); env=np.array([np.sqrt(np.mean(voz[i:i+frame]**2)) for i in range(0,n,frame)])
env=np.convolve(env,np.ones(8)/8,mode="same"); env=np.clip(env/ (np.percentile(env,90)+1e-6),0,1)
duck=np.repeat(1-0.55*env,frame)[:n]; duck=np.pad(duck,(0,n-len(duck)),constant_values=1)
mix=voz*1.0+mus*duck*0.7
mix=np.tanh(mix*1.1)*0.95
out=wave.open("mezcla.wav","wb"); out.setnchannels(1); out.setsampwidth(2); out.setframerate(SR); out.writeframes((mix*32767).astype(np.int16).tobytes()); out.close()
print("dur",round(dur,1))
