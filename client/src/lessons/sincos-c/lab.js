// sin & cos Part C code lab: experiments (JavaScript + Python) with their chart drawings.
// Experiments may list `libs` (JS packages injected by CodeLab: mathjs → `math`, geolib → `geolib`)
// and `pyPackages` (loaded into Pyodide before running: numpy via loadPackage, geopy via micropip).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "wave": "import math\nA = 1        # amplitude: try 0.5, 2\nF = 2        # frequency in swings per second: try 1, 5\nSECONDS = 2\n\nsamples = []\nfor i in range(401):\n    t = i / 400 * SECONDS\n    samples.append([t, A * math.sin(2 * math.pi * F * t)])\nprint(f\"amplitude {A}, frequency {F} Hz, period {1 / F:.3f} s\")\nprint(\"swings shown:\", F * SECONDS)\nresult = {\"samples\": samples, \"A\": A, \"F\": F}",
  "rain": "import math, random\nDROPS = 120\nWIND = 30      # try 0, then 30, then 80\nTIME = 2.0     # seconds since the rain started\n\ndrops = []\nfor i in range(DROPS):\n    start_x = random.random() * 800\n    start_y = random.random() * 500\n    speed = 180 + random.random() * 120                # falling speed\n    phase = random.random() * 2 * math.pi              # each drop sways differently\n    y = (start_y + speed * TIME) % 500                  # wrap back to the top\n    x = start_x + WIND * math.sin(TIME * 2 + phase)    # wind sway\n    tilt = WIND * 0.3 * math.cos(TIME * 2 + phase)     # slant follows the sway\n    drops.append([x, y, tilt])\nprint(DROPS, \"drops drawn with wind\", WIND)\nresult = {\"drops\": drops, \"WIND\": WIND}",
  "heartRate": "import math\nBEAT_EVERY = 0.8     # seconds between beats: try 0.6, 1.0\nRATE = 100           # samples per second\nsignal = []\nfor i in range(6 * RATE):                      # 6 seconds of signal\n    t = i / RATE\n    phase = (t % BEAT_EVERY) / BEAT_EVERY\n    spike = math.sin(phase / 0.05 * math.pi) if phase < 0.05 else 0   # the sharp peak\n    signal.append(spike + 0.05 * math.sin(2 * math.pi * 0.3 * t))      # plus slow drift\n\npeaks = [i / RATE for i in range(1, len(signal) - 1)\n         if signal[i] > 0.6 and signal[i] > signal[i - 1] and signal[i] >= signal[i + 1]]\ngaps = [b - a for a, b in zip(peaks, peaks[1:])]\navg_gap = sum(gaps) / len(gaps)\nprint(\"peaks found:\", len(peaks))\nprint(f\"average gap: {avg_gap:.2f} s  →  {60 / avg_gap:.0f} bpm\")\nresult = {\"signal\": signal, \"peaks\": peaks, \"RATE\": RATE, \"bpm\": 60 / avg_gap}",
  "power": "import numpy as np\nPEAK = 325       # volts\nHZ = 50\nN = 1000         # samples over one full wave\n\nt = np.arange(N) / N / HZ                    # one wave lasts 1/50 s\nv = PEAK * np.sin(2 * np.pi * HZ * t)\nrms = float(np.sqrt(np.mean(v ** 2)))        # numpy: Root of the Mean of the Squares, one line\n\nprint(\"peak:\", PEAK, \"V\")\nprint(f\"RMS (effective): {rms:.1f} V\")\nprint(f\"peak ÷ RMS = {PEAK / rms:.3f}  (that is √2)\")\nresult = {\"samples\": v.tolist(), \"rms\": rms, \"PEAK\": PEAK}",
  "season": "import math\n# Approximate Chennai monthly average temperatures (°C), January to December\nTEMPS = [25, 26.5, 28.5, 31, 33, 32.5, 31, 30.5, 30, 28.5, 26.5, 25]\n\n# Try many waves: mean + size·cos(2π(month − peak)/12). Keep the one with the smallest error.\n# (Steps of 0.2 because Python in the browser is slower than JavaScript.)\nbest = None\nfor mi in range(21):\n    mean = 27 + mi * 0.2\n    for si in range(21):\n        size = 2 + si * 0.2\n        for pi_ in range(56):\n            peak = 1 + pi_ * 0.2\n            err = 0\n            for i, t in enumerate(TEMPS):\n                model = mean + size * math.cos(2 * math.pi * ((i + 1) - peak) / 12)\n                err += (t - model) ** 2\n            if best is None or err < best[\"err\"]:\n                best = {\"mean\": mean, \"size\": size, \"peak\": peak, \"err\": err}\nprint(f\"Best wave: {best['mean']:.1f} + {best['size']:.1f}·cos(2π(m − {best['peak']:.1f})/12)\")\nprint(\"Hottest month ≈\", round(best[\"peak\"]))\nresult = {\"TEMPS\": TEMPS, **best}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'wave',title:{en:'Build a wave',ta:'ஒரு wave-ஐ build பண்ணுங்க'},
 why:{en:'y = A × sin(2π × f × t) is the formula behind sound, electricity and every animation that bounces. Change A and f and watch what happens.',ta:'y = A × sin(2π × f × t) தான் sound, electricity, bounce ஆகுற ஒவ்வொரு animation-க்கு பின்னாடியும் இருக்கிற formula. A, f-ஐ மாத்தி என்ன ஆகுதுன்னு பாருங்க.'},
 code:`const A = 1;      // amplitude: try 0.5, 2
const F = 2;      // frequency in swings per second: try 1, 5
const SECONDS = 2;

const samples = [];
for (let i = 0; i <= 400; i++) {
  const t = (i / 400) * SECONDS;
  samples.push([t, A * Math.sin(2 * Math.PI * F * t)]);
}
print("amplitude " + A + ", frequency " + F + " Hz, period " + (1 / F).toFixed(3) + " s");
print("swings shown: " + F * SECONDS);
return { samples, A, F };`,
 viz(r,a){title('y = '+r.A+' × sin(2π × '+r.F+' × t)');const ox=40,oy=260,w=720,h=90;line(ox,oy,ox+w,oy,C.light,2);
  ctx.beginPath();const n=Math.ceil(r.samples.length*ease(a));r.samples.slice(0,n).forEach(([t,y],i)=>{const X=ox+t/r.samples[r.samples.length-1][0]*w,Y=oy-Math.max(-2.3,Math.min(2.3,y))*h;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  txt('time →',ox+w,oy+200,{size:16,weight:800,align:'right',color:C.muted});},
 ch:{en:'Set F = 50. How many swings would one second show? Why does the plot start to look like a solid block?',ta:'F = 50 வெச்சா ஒரு second-ல எத்தனை ஆட்டம்? Plot ஏன் ஒரு solid block மாதிரி தெரிய ஆரம்பிக்குது?'},
 ans:{en:'50 swings per second, which is your home electricity. With only 400 samples over 2 seconds there are just 4 samples per swing, too few to draw a smooth curve: that is called under-sampling, a key idea in ECE and in the Fourier lesson.',ta:'ஒரு second-ல 50 ஆட்டம், அது தான் உங்க வீட்டு electricity. 2 seconds-க்கு 400 samples மட்டும்னா, ஒரு ஆட்டத்துக்கு 4 samples தான், smooth curve-க்கு போதாது: இதுக்கு பேர் under-sampling, ECE-லயும் Fourier lesson-லயும் முக்கியமான idea.'}},

{id:'rain',title:{en:'Make it rain',ta:'மழையை உருவாக்குங்க'},
 why:{en:'Gravity makes drops fall. sin(time) makes them sway in the wind. Change WIND from 0 to a storm.',ta:'Gravity drops-ஐ விழ வைக்குது. sin(time) wind-ல ஆட வைக்குது. WIND-ஐ 0-ல இருந்து புயல் வரைக்கும் மாத்துங்க.'},
 code:`const DROPS = 120;
const WIND = 30;      // try 0, then 30, then 80
const TIME = 2.0;     // seconds since the rain started

const drops = [];
for (let i = 0; i < DROPS; i++) {
  const startX = Math.random() * 800;
  const startY = Math.random() * 500;
  const speed = 180 + Math.random() * 120;              // falling speed
  const phase = Math.random() * 2 * Math.PI;            // each drop sways differently
  const y = (startY + speed * TIME) % 500;               // wrap back to the top
  const x = startX + WIND * Math.sin(TIME * 2 + phase); // wind sway
  const tilt = WIND * 0.3 * Math.cos(TIME * 2 + phase); // slant follows the sway
  drops.push([x, y, tilt]);
}
print(DROPS + " drops drawn with wind " + WIND);
return { drops, WIND };`,
 viz(r,a){const g=ctx.createLinearGradient(0,0,0,500);g.addColorStop(0,'#1A2744');g.addColorStop(1,'#34507F');ctx.fillStyle=g;ctx.fillRect(0,0,800,500);ctx.fillStyle='#22365A';ctx.fillRect(0,440,800,60);
  const n=Math.ceil(r.drops.length*ease(a));r.drops.slice(0,n).forEach(([x,y,tl])=>{if(y>440)return;line(x,y,x-tl,y+22,'rgba(190,215,255,.8)',2);});
  [[120,465],[330,478],[560,462],[700,480]].forEach(([x,y],i)=>{for(let k=1;k<=3;k++){ctx.save();ctx.globalAlpha=.6/k;ctx.beginPath();ctx.ellipse(x,y,k*16,k*5,0,0,7);ctx.strokeStyle='#BFD7FF';ctx.lineWidth=2;ctx.stroke();ctx.restore();}});
  txt('wind = '+r.WIND,20,36,{size:24,weight:800,color:'#fff'});},
 ch:{en:'Set WIND to 0, then 80. What changes? If you wanted ripples on the ground, which function would you use?',ta:'WIND-ஐ 0, அப்புறம் 80 வெச்சு பாருங்க. என்ன மாறுது? தரையில ripples வேணும்னா எந்த function use பண்ணுவீங்க?'},
 ans:{en:'At 0 the rain falls straight down; at 80 it sways and slants like a storm. For ripples, each ring\'s height is sin(distance − time), so the rings spread outwards from where a drop lands.',ta:'0-ல மழை நேரா விழுது; 80-ல புயல் மாதிரி ஆடி சாய்ஞ்சு விழுது. Ripples-க்கு, ஒவ்வொரு ring-ஓட உயரம் sin(distance − time). அதனால drop விழுந்த இடத்துல இருந்து rings வெளிய பரவுது.'}},

{id:'heartRate',title:{en:'Find the heart rate in a signal',ta:'Signal-ல heart rate கண்டுபிடிங்க'},
 why:{en:'Smartwatches do this every few seconds: find the peaks, measure the gaps, turn them into beats per minute.',ta:'Smartwatches இதை சில seconds-க்கு ஒரு தடவை பண்ணும்: peaks கண்டுபிடிச்சு, gaps அளந்து, நிமிஷத்துக்கு beats-ஆ மாத்தும்.'},
 code:`const BEAT_EVERY = 0.8;      // seconds between beats: try 0.6, 1.0
const RATE = 100;            // samples per second
const signal = [];
for (let i = 0; i < 6 * RATE; i++) {          // 6 seconds of signal
  const t = i / RATE, phase = (t % BEAT_EVERY) / BEAT_EVERY;
  const spike = phase < 0.05 ? Math.sin(phase / 0.05 * Math.PI) : 0;   // the sharp peak
  signal.push(spike + 0.05 * Math.sin(2 * Math.PI * 0.3 * t));         // plus slow drift
}

// find peaks: a sample higher than both neighbours and above a threshold
const peaks = [];
for (let i = 1; i < signal.length - 1; i++)
  if (signal[i] > 0.6 && signal[i] > signal[i - 1] && signal[i] >= signal[i + 1]) peaks.push(i / RATE);

const gaps = peaks.slice(1).map((p, i) => p - peaks[i]);
const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;
print("peaks found: " + peaks.length);
print("average gap: " + avgGap.toFixed(2) + " s  →  " + (60 / avgGap).toFixed(0) + " bpm");
return { signal, peaks, RATE, bpm: 60 / avgGap };`,
 viz(r,a){title('Heart rate: '+r.bpm.toFixed(0)+' bpm');ctx.fillStyle='#0F1D33';ctx.fillRect(20,60,760,380);const ox=30,oy=330,w=740;const n=Math.ceil(r.signal.length*ease(a));
  ctx.beginPath();r.signal.slice(0,n).forEach((v,i)=>{const X=ox+i/r.signal.length*w,Y=oy-v*200;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.strokeStyle='#5EE38F';ctx.lineWidth=2;ctx.stroke();
  if(a>.9)r.peaks.forEach(pk=>{const X=ox+pk*r.RATE/r.signal.length*w;ctx.beginPath();ctx.arc(X,oy-200,7,0,7);ctx.fillStyle=C.coral;ctx.fill();});},
 ch:{en:'Lower the threshold from 0.6 to 0.02. What goes wrong with the heart rate? What does that teach you about signals from real sensors?',ta:'Threshold-ஐ 0.6-ல இருந்து 0.02-க்கு குறைங்க. Heart rate-ல என்ன தப்பு ஆகுது? Real sensors-ல இருந்து வர்ற signals பத்தி அது என்ன சொல்லுது?'},
 ans:{en:'The slow drift wave now counts as peaks too, so you find far more "beats" and the bpm becomes nonsense. Real sensor data is noisy; choosing thresholds and filtering out noise is most of the work, and Fourier methods help separate the heartbeat from the drift.',ta:'இப்போ slow drift wave-உம் peaks-ஆ count ஆகுது, அதனால நிறைய "beats" வருது, bpm அர்த்தமில்லாம போகுது. Real sensor data noisy-ஆ இருக்கும்; threshold தேர்ந்தெடுக்கிறதும், noise-ஐ filter பண்றதும் தான் பெரும்பாலான வேலை. Heartbeat-ஐ drift-ல இருந்து பிரிக்க Fourier methods உதவும்.'}},

{id:'power',pyPackages:['numpy'],title:{en:'Why 230 V, when the peak is 325 V?',ta:'Peak 325 V-ன்னா ஏன் 230 V-ன்னு சொல்றோம்?'},
 why:{en:'Sample the mains wave and compute its effective value (RMS) yourself: square, average, square root. In Python, numpy does it in one line.',ta:'Mains wave-ஐ sample பண்ணி, அதோட effective value (RMS)-ஐ நீங்களே calculate பண்ணுங்க: square, average, square root. Python-ல numpy ஒரே line-ல பண்ணும்.'},
 code:`const PEAK = 325;       // volts
const HZ = 50;
const N = 1000;         // samples over one full wave

let sumSquares = 0;
const samples = [];
for (let i = 0; i < N; i++) {
  const t = i / N / HZ;                              // one wave lasts 1/50 s
  const v = PEAK * Math.sin(2 * Math.PI * HZ * t);
  samples.push(v);
  sumSquares += v * v;
}
const rms = Math.sqrt(sumSquares / N);               // Root of the Mean of the Squares
print("peak: " + PEAK + " V");
print("RMS (effective): " + rms.toFixed(1) + " V");
print("peak ÷ RMS = " + (PEAK / rms).toFixed(3) + "  (that is √2)");
return { samples, rms, PEAK };`,
 viz(r,a){title('Peak '+r.PEAK+' V, effective '+r.rms.toFixed(0)+' V');const ox=40,oy=260,w=720,h=0.6;line(ox,oy,ox+w,oy,C.light,2);
  ctx.beginPath();const n=Math.ceil(r.samples.length*ease(a));r.samples.slice(0,n).forEach((v,i)=>{const X=ox+i/r.samples.length*w,Y=oy-v*h;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  [[r.PEAK,C.coral,'peak'],[r.rms,C.green,'effective (RMS)']].forEach(([v,c,l])=>{ctx.setLineDash([6,6]);line(ox,oy-v*h,ox+w,oy-v*h,c,2);ctx.setLineDash([]);txt(l+' '+v.toFixed(0)+' V',ox+w,oy-v*h-8,{size:18,weight:800,align:'right',color:c});});},
 ch:{en:'Why not just take the average voltage? Change the code to print the plain average of the samples and explain what you see.',ta:'ஏன் சாதாரண average voltage எடுக்கக்கூடாது? Samples-ஓட plain average-ஐ print பண்ணுங்க, என்ன தெரியுதுன்னு explain பண்ணுங்க.'},
 ans:{en:'The plain average is about 0, because the positive and negative halves cancel. Squaring makes every value positive, so RMS measures the wave\'s real heating power: 325 V peak does the same work as a steady 230 V.',ta:'Plain average சுமார் 0 வரும், ஏன்னா positive, negative பாதிகள் ஒண்ணை ஒண்ணு cancel பண்ணுது. Square பண்ணா எல்லாமே positive ஆகும், அதனால RMS wave-ஓட உண்மையான power-ஐ அளக்குது: 325 V peak, ஒரு steady 230 V செய்யுற அதே வேலையை செய்யுது.'}},

{id:'season',title:{en:'Find the season in data',ta:'Data-ல season-ஐ கண்டுபிடிங்க'},
 why:{en:'Data analysts fit waves to repeating data to forecast it. Here the computer tries thousands of waves and keeps the one closest to Chennai\'s temperatures.',ta:'Data analysts திரும்ப வர்ற data-க்கு wave fit பண்ணி forecast பண்றாங்க. இங்க computer ஆயிரக்கணக்கான waves try பண்ணி, Chennai temperature-க்கு ரொம்ப பக்கத்துல இருக்கிற wave-ஐ எடுத்துக்குது.'},
 code:`// Approximate Chennai monthly average temperatures (°C), January to December
const TEMPS = [25, 26.5, 28.5, 31, 33, 32.5, 31, 30.5, 30, 28.5, 26.5, 25];

// Try many waves: mean + size·cos(2π(month − peak)/12). Keep the one with the smallest error.
let best = null;
for (let mean = 27; mean <= 31; mean += 0.1)
  for (let size = 2; size <= 6; size += 0.1)
    for (let peak = 1; peak <= 12; peak += 0.1) {
      let err = 0;
      TEMPS.forEach((t, i) => {
        const model = mean + size * Math.cos(2 * Math.PI * ((i + 1) - peak) / 12);
        err += (t - model) ** 2;
      });
      if (!best || err < best.err) best = { mean, size, peak, err };
    }
print("Best wave: " + best.mean.toFixed(1) + " + " + best.size.toFixed(1) + "·cos(2π(m − " + best.peak.toFixed(1) + ")/12)");
print("Hottest month ≈ " + Math.round(best.peak));
return { TEMPS, ...best };`,
 viz(r,a){title('Chennai temperature and the fitted wave');const ox=60,oy=420,w=700,h=320,t0=23,t1=35;const X=m=>ox+(m-.5)/12*w,Y=v=>oy-(v-t0)/(t1-t0)*h;
  line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);[25,30,35].forEach(v=>txt(v+'°',ox-8,Y(v)+6,{size:15,align:'right',color:C.muted}));
  'JFMAMJJASOND'.split('').forEach((m,i)=>txt(m,X(i+1),oy+22,{size:15,align:'center',color:C.muted,weight:700}));
  const f=m=>r.mean+r.size*Math.cos(2*Math.PI*(m-r.peak)/12);
  r.TEMPS.forEach((v,i)=>{line(X(i+1),Y(v),X(i+1),Y(f(i+1)),C.coral,2);});
  ctx.beginPath();for(let m=.5;m<=.5+12*ease(a);m+=.05){m===.5?ctx.moveTo(X(m),Y(f(m))):ctx.lineTo(X(m),Y(f(m)));}ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  r.TEMPS.forEach((v,i)=>{ctx.beginPath();ctx.arc(X(i+1),Y(v),6,0,7);ctx.fillStyle=C.ink;ctx.fill();});
  txt('peak month ≈ '+r.peak.toFixed(1),ox+w,oy-h-6,{size:18,weight:800,align:'right',color:'#7A600A'});},
 ch:{en:'Which month does the wave say is hottest? Where do the real points stray furthest from the wave, and what could explain it?',ta:'Wave-படி எந்த மாசம் அதிக வெயில்? Real points wave-ல இருந்து எங்க அதிகமா விலகுது? அதுக்கு என்ன காரணமா இருக்கலாம்?'},
 ans:{en:'The wave peaks around month 6 (June), while the data\'s hottest month is May. The coral gaps are the part the simple wave cannot explain, such as clouds, sea breeze and monsoon rain. Real forecasting starts with this wave, then models the leftovers. These temperatures are approximate, for learning.',ta:'Wave சுமார் month 6 (June)-ல peak ஆகுது, ஆனா data-ல அதிக வெயில் May-ல. Coral gaps தான் simple wave explain பண்ண முடியாத பகுதி: மேகம், கடல் காத்து, monsoon மழை. Real forecasting இந்த wave-ல ஆரம்பிச்சு, மீதியை model பண்ணும். இந்த temperatures கத்துக்கிறதுக்கான approximate values.'}}
];

/* drawing helpers (per canvas) */

function rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
function box(x,y,w,h,r,fill,stroke,lw){if(w<=0||h<=0)return;rr(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function txt(s,x,y,o){o=o||{};ctx.save();ctx.font=`${o.weight||600} ${o.size||22}px ${FONT}`;ctx.fillStyle=o.color||C.ink;ctx.textAlign=o.align||'left';ctx.fillText(s,x,y);ctx.restore();}
function line(x1,y1,x2,y2,c,w){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function dash(x1,y1,x2,y2,c){ctx.save();ctx.setLineDash([8,8]);line(x1,y1,x2,y2,c,2);ctx.restore();}
function title(s){txt(s,30,44,{size:24,weight:800});}
function paper(){ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);ctx.strokeStyle=C.grid;ctx.lineWidth=1;for(let x=0;x<=W;x+=25){ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,H);ctx.stroke();}for(let y=0;y<=H;y+=25){ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(W,y+.5);ctx.stroke();}}


  labs.forEach((l) => { l.py = PY[l.id]; });
  return { labs, paper, txt };
}
