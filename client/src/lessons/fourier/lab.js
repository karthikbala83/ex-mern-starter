// Fourier code lab: experiments (JavaScript + Python) with their chart drawings.
// `libs` = JS packages injected by CodeLab (mathjs → `math`); `pyPackages` = loaded into Pyodide first (numpy).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "chord": "import math\nNOTES = [[262, 1], [330, 1], [392, 1]]   # [frequency in Hz, loudness]: try [[262, 1], [524, 0.5]]\nRATE = 8000          # samples per second\nSECONDS = 0.02       # a short slice so you can see the shape\n\nsamples = []\nfor i in range(int(RATE * SECONDS)):\n    t = i / RATE\n    samples.append(sum(a * math.sin(2 * math.pi * f * t) for f, a in NOTES))   # add the simple waves\nprint(len(NOTES), \"notes added into\", len(samples), \"samples\")\nprint(f\"loudest point: {max(abs(v) for v in samples):.2f}\")\nresult = {\"samples\": samples, \"NOTES\": NOTES}",
  "match": "import math\nTESTS = [200, 262, 300, 330, 392, 450]   # try your own frequencies\nRATE, SECONDS = 8000, 1\nchord = lambda t: math.sin(2*math.pi*262*t) + math.sin(2*math.pi*330*t) + math.sin(2*math.pi*392*t)\n\nresults = []\nfor f in TESTS:\n    n = RATE * SECONDS\n    avg = sum(chord(i / RATE) * math.sin(2 * math.pi * f * i / RATE) for i in range(n)) / n\n    print(f\"{f} Hz → average {avg:.3f}\" + (\"   ✓ inside the chord\" if avg > 0.2 else \"\"))\n    results.append({\"f\": f, \"avg\": avg})\nresult = {\"results\": results}",
  "spectrum": "import math, time\nimport numpy as np\nRATE, N = 1000, 1000          # 1 second of sound, so frequencies land on whole Hz\nsignal = [math.sin(2*math.pi*262*n/RATE) + math.sin(2*math.pi*330*n/RATE) + 0.5*math.sin(2*math.pi*392*n/RATE) for n in range(N)]\n\nt0 = time.time()\nby_hand = []\nfor f in range(RATE // 2):            # the matching trick, with sin AND cos\n    re = sum(s * math.cos(2 * math.pi * f * n / RATE) for n, s in enumerate(signal))\n    im = sum(s * math.sin(2 * math.pi * f * n / RATE) for n, s in enumerate(signal))\n    by_hand.append(2 / N * math.hypot(re, im))   # Pythagoras gives the strength\nhand_ms = (time.time() - t0) * 1000\n\nt0 = time.time()\nfft = (2 / N * np.abs(np.fft.rfft(signal)))[:N // 2].tolist()\nfft_ms = (time.time() - t0) * 1000\n\ntop = lambda arr: \", \".join(f\"{f} Hz ({v:.2f})\" for f, v in sorted(enumerate(arr), key=lambda x: -x[1])[:3])\nprint(f\"by hand: {top(by_hand)}   [{hand_ms:.0f} ms]\")\nprint(f\"numpy:   {top(fft)}   [{fft_ms:.1f} ms]\")\nresult = {\"byHand\": by_hand, \"fft\": fft}",
  "vibration": "import math\nFAULT = True           # try False: a healthy machine\nRATE, N = 1000, 1000\nseed = 7\ndef rand():                         # repeatable noise\n    global seed\n    seed = (seed * 16807) % 2147483647\n    return seed / 2147483647 - 0.5\n\nsignal = []\nfor n in range(N):\n    t = n / RATE\n    v = math.sin(2 * math.pi * 25 * t)                  # motor turning 25 times a second\n    if FAULT:\n        v += 0.25 * math.sin(2 * math.pi * 157 * t)     # a worn bearing adds 157 Hz\n    signal.append(v + 0.3 * rand())                    # factory noise\n\ndef strength(f):\n    re = sum(s * math.cos(2 * math.pi * f * n / RATE) for n, s in enumerate(signal))\n    im = sum(s * math.sin(2 * math.pi * f * n / RATE) for n, s in enumerate(signal))\n    return 2 / N * math.hypot(re, im)\n\nspectrum = [strength(f) for f in range(301)]\nALERT = spectrum[157] > 0.1\nprint(f\"motor peak at 25 Hz: {spectrum[25]:.2f}\")\nprint(f\"bearing band at 157 Hz: {spectrum[157]:.2f}\" + (\"   ⚠ ALERT: schedule bearing replacement\" if ALERT else \"   ✓ healthy\"))\nresult = {\"spectrum\": spectrum, \"ALERT\": ALERT}",
  "heat": "import math\nMETALS = {\"copper\": 1.11e-4, \"steel\": 1.17e-5}   # heat diffusivity, m²/s\nLENGTH = 0.1            # a 10 cm rod\nT = 20                  # seconds after heating: try 5, 60\nMODES = [[1, 30], [3, 15], [7, 10]]   # [shape number k, starting strength in °C]\n\n# Each sine shape k fades like exp(−α·(kπ/L)²·t): tighter shapes fade much faster.\nprofiles = {}\nfor name, alpha in METALS.items():\n    left = [a * math.exp(-alpha * (k * math.pi / LENGTH) ** 2 * T) for k, a in MODES]\n    profiles[name] = left\n    print(f\"{name} after {T} s: main hot spot {left[0]:.1f} °C, sharp wiggle {left[2]:.2f} °C\")\nresult = {\"profiles\": profiles, \"MODES\": MODES, \"T\": T}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'chord',title:{en:'Build a chord from sine waves',ta:'Sine waves-ல இருந்து ஒரு chord-ஐ build பண்ணுங்க'},
 why:{en:'Add three pure notes and see the complicated wave your ear actually receives. Change the notes and loudness.',ta:'மூணு pure notes-ஐ கூட்டி, உங்க காது உண்மையில கேக்கிற சிக்கலான wave-ஐ பாருங்க. Notes-ஐயும் சத்தத்தையும் மாத்துங்க.'},
 code:`const NOTES = [[262, 1], [330, 1], [392, 1]];   // [frequency in Hz, loudness]: try [[262, 1], [524, 0.5]]
const RATE = 8000;          // samples per second
const SECONDS = 0.02;       // a short slice so you can see the shape

const samples = [];
for (let i = 0; i < RATE * SECONDS; i++) {
  const t = i / RATE;
  let y = 0;
  for (const [f, a] of NOTES) y += a * Math.sin(2 * Math.PI * f * t);   // add the simple waves
  samples.push(y);
}
print(NOTES.length + " notes added into " + samples.length + " samples");
print("loudest point: " + Math.max(...samples.map(Math.abs)).toFixed(2));
return { samples, NOTES };`,
 viz(r,a){title('The wave your ear receives');const ox=40,oy=250,w=720,h=70;line(ox,oy,ox+w,oy,C.light,2);
  ctx.beginPath();const n=Math.ceil(r.samples.length*ease(a));r.samples.slice(0,n).forEach((v,i)=>{const x=ox+i/r.samples.length*w,y=oy-v*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  r.NOTES.forEach(([f,amp],i)=>txt(f+' Hz × '+amp,ox+i*180,440,{size:18,weight:800,color:[C.gold,C.green,C.coral,C.ink][i%4]}));},
 ch:{en:'Try NOTES = [[262, 1], [524, 1]] (a note and its octave). Why does the shape repeat so neatly?',ta:'NOTES = [[262, 1], [524, 1]] (ஒரு note-உம் அதோட octave-உம்) try பண்ணுங்க. Shape ஏன் இவ்வளவு அழகா repeat ஆகுது?'},
 ans:{en:'524 is exactly 2 × 262, so the second wave fits exactly twice into every swing of the first. Notes whose frequencies form simple ratios (2:1, 3:2) repeat neatly and sound pleasant together: that is the maths behind harmony.',ta:'524 சரியா 2 × 262, அதனால ரெண்டாவது wave முதல் wave-ஓட ஒவ்வொரு ஆட்டத்துக்குள்ளயும் சரியா ரெண்டு தடவை பொருந்துது. Simple ratios (2:1, 3:2) உள்ள notes அழகா repeat ஆகி, சேர்ந்து இனிமையா ஒலிக்கும்: harmony-க்கு பின்னாடி இருக்கிற maths இது தான்.'}},
{id:'match',title:{en:'The matching trick, by hand',ta:'Matching trick, கையால'},
 why:{en:'Multiply the chord by a test wave and average. Frequencies inside the chord give a big number; others give about zero.',ta:'Chord-ஐ ஒரு test wave-ஆல பெருக்கி average எடுங்க. Chord-க்குள்ள இருக்கிற frequencies பெரிய number தரும்; மத்தவை கிட்டத்தட்ட zero.'},
 code:`const TESTS = [200, 262, 300, 330, 392, 450];   // try your own frequencies
const RATE = 8000, SECONDS = 1;
const chord = (t) => Math.sin(2 * Math.PI * 262 * t) + Math.sin(2 * Math.PI * 330 * t) + Math.sin(2 * Math.PI * 392 * t);

const results = TESTS.map((f) => {
  let sum = 0;
  const n = RATE * SECONDS;
  for (let i = 0; i < n; i++) { const t = i / RATE; sum += chord(t) * Math.sin(2 * Math.PI * f * t); }
  const avg = sum / n;
  print(f + " Hz → average " + avg.toFixed(3) + (avg > 0.2 ? "   ✓ inside the chord" : ""));
  return { f, avg };
});
return { results };`,
 viz(r,a){title('Average after multiplying');const ox=60,oy=300,w=680;line(ox,oy,ox+w,oy,C.ink,2);const bw=w/r.results.length-16;
  r.results.forEach((q,i)=>{const hh=q.avg/0.5*200*ease(a);const x=ox+i*(bw+16)+8;box(x,hh>=0?oy-hh:oy,bw,Math.max(2,Math.abs(hh)),6,q.avg>0.2?C.green:C.light);txt(q.f+' Hz',x+bw/2,oy+28,{size:16,weight:800,align:'center'});txt(q.avg.toFixed(2),x+bw/2,(hh>=0?oy-hh:oy)-8,{size:15,weight:800,align:'center'});});},
 ch:{en:'Shift one note in time: change the 330 term to Math.cos(2 * Math.PI * 330 * t). What happens to the 330 Hz average, and why does the real Fourier transform also use cos?',ta:'ஒரு note-ஐ time-ல நகர்த்துங்க: 330 term-ஐ Math.cos(2 * Math.PI * 330 * t)-ஆ மாத்துங்க. 330 Hz average என்ன ஆகுது? உண்மையான Fourier transform ஏன் cos-ஐயும் use பண்ணுது?'},
 ans:{en:'It drops to about zero even though 330 Hz is still there: a cos wave and a sin wave of the same frequency cancel when multiplied and averaged. That is why the real method matches against both sin and cos, then combines them with Pythagoras.',ta:'330 Hz இன்னும் இருந்தாலும் கிட்டத்தட்ட zero-க்கு குறையுது: ஒரே frequency-ஓட cos wave-உம் sin wave-உம் பெருக்கி average எடுத்தா cancel ஆகும். அதனால தான் உண்மையான method sin, cos ரெண்டோடயும் match பண்ணி, Pythagoras வெச்சு சேர்க்குது.'}},
{id:'spectrum',libs:['mathjs'],pyPackages:['numpy'],title:{en:'The full spectrum: by hand vs FFT',ta:'முழு spectrum: கையால vs FFT'},
 why:{en:'Match every frequency from 0 to 500 Hz with sin and cos, then compare with the FFT from mathjs (JavaScript) or numpy (Python), and time both.',ta:'0-ல இருந்து 500 Hz வரை ஒவ்வொரு frequency-ஐயும் sin, cos-ஓட match பண்ணி, mathjs (JavaScript) அல்லது numpy (Python) FFT-ஓட compare பண்ணுங்க, ரெண்டுக்கும் நேரம் அளங்க.'},
 code:`const RATE = 4096, N = 4096;          // 1 second, so frequencies land on whole Hz. 4096 = 2¹²: FFTs are fastest on powers of two
const signal = [];
for (let n = 0; n < N; n++) {
  const t = n / RATE;
  signal.push(Math.sin(2 * Math.PI * 262 * t) + Math.sin(2 * Math.PI * 330 * t) + 0.5 * Math.sin(2 * Math.PI * 392 * t));
}

let t0 = Date.now();
const byHand = [];
for (let f = 0; f < RATE / 2; f++) {             // the matching trick, with sin AND cos
  let re = 0, im = 0;
  for (let n = 0; n < N; n++) { const ang = 2 * Math.PI * f * n / RATE; re += signal[n] * Math.cos(ang); im += signal[n] * Math.sin(ang); }
  byHand.push(2 / N * Math.hypot(re, im));      // Pythagoras gives the strength
}
const handMs = Date.now() - t0;

math.fft(signal.slice(0, 64));        // warm-up: the first call does one-time setup, so don't time it
t0 = Date.now();
const fft = math.fft(signal).slice(0, N / 2).map((c) => 2 / N * math.abs(c));
const fftMs = Date.now() - t0;

const top = (arr) => arr.map((v, f) => [f, v]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, v]) => f + " Hz (" + v.toFixed(2) + ")");
print("by hand: " + top(byHand).join(", ") + "   [" + handMs + " ms]");
print("mathjs:  " + top(fft).join(", ") + "   [" + fftMs + " ms]");
return { byHand, fft };`,
 viz(r,a){title('Spectrum: by hand (gold) and FFT (green dots)');const ox=40,oy=420,w=720,h=320;line(ox,oy,ox+w,oy,C.ink,2);
  ctx.beginPath();const n=Math.ceil(501*ease(a));r.byHand.slice(0,n).forEach((v,f)=>{const x=ox+f/500*w,y=oy-v*h;f?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=C.gold;ctx.lineWidth=3;ctx.stroke();
  r.fft.forEach((v,f)=>{if(v>0.2&&f<n&&f<=500){ctx.beginPath();ctx.arc(ox+f/500*w,oy-v*h,6,0,7);ctx.fillStyle=C.green;ctx.fill();}});[0,100,200,300,400,500].forEach(f=>txt(f+'',ox+f/500*w,oy+22,{size:15,align:'center',color:C.muted}));},
 ch:{en:'Both find 262, 330 and 392 with strengths 1, 1 and 0.5. Look at the timings. If you doubled N, roughly how much slower would each method get?',ta:'ரெண்டுமே 262, 330, 392-ஐ 1, 1, 0.5 strengths-ஓட கண்டுபிடிக்குது. Timings-ஐ பாருங்க. N-ஐ ரெட்டிப்பாக்கினா, ஒவ்வொரு method-உம் தோராயமா எவ்வளவு slow ஆகும்?'},
 ans:{en:'By hand, the work grows like N × N, so doubling N makes it about 4 times slower. The FFT grows like N × log N, only a little more than double. For a song with millions of samples, that difference is seconds versus days.',ta:'கையால பண்ணா வேலை N × N மாதிரி வளரும், அதனால N ரெட்டிப்பானா சுமார் 4 மடங்கு slow. FFT N × log N மாதிரி வளரும், ரெட்டிப்பை விட கொஞ்சம் அதிகம் மட்டும். கோடிக்கணக்கான samples உள்ள ஒரு பாட்டுக்கு, அந்த வித்தியாசம் seconds vs நாட்கள்.'}},
{id:'vibration',title:{en:'Machine health check',ta:'Machine health check'},
 why:{en:'A real predictive-maintenance check: compute the vibration spectrum, look for a peak at the bearing\'s fault frequency, and raise an alert.',ta:'ஒரு உண்மையான predictive-maintenance check: vibration spectrum-ஐ calculate பண்ணி, bearing-ஓட fault frequency-ல peak இருக்கான்னு பார்த்து, alert எழுப்புங்க.'},
 code:`const FAULT = true;           // try false: a healthy machine
const RATE = 1000, N = 1000;
let seed = 7; const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;   // repeatable noise

const signal = [];
for (let n = 0; n < N; n++) {
  const t = n / RATE;
  let v = Math.sin(2 * Math.PI * 25 * t);                      // motor turning 25 times a second
  if (FAULT) v += 0.25 * Math.sin(2 * Math.PI * 157 * t);      // a worn bearing adds 157 Hz
  signal.push(v + 0.3 * rand());                                // factory noise
}
const strength = (f) => {
  let re = 0, im = 0;
  for (let n = 0; n < N; n++) { const a = 2 * Math.PI * f * n / RATE; re += signal[n] * Math.cos(a); im += signal[n] * Math.sin(a); }
  return 2 / N * Math.hypot(re, im);
};
const spectrum = [];
for (let f = 0; f <= 300; f++) spectrum.push(strength(f));
const ALERT = spectrum[157] > 0.1;
print("motor peak at 25 Hz: " + spectrum[25].toFixed(2));
print("bearing band at 157 Hz: " + spectrum[157].toFixed(2) + (ALERT ? "   ⚠ ALERT: schedule bearing replacement" : "   ✓ healthy"));
return { spectrum, ALERT };`,
 viz(r,a){title(r.ALERT?'⚠ Bearing fault detected':'✓ Machine healthy');const ox=40,oy=420,w=720,h=320;line(ox,oy,ox+w,oy,C.ink,2);
  ctx.beginPath();const n=Math.ceil(r.spectrum.length*ease(a));r.spectrum.slice(0,n).forEach((v,f)=>{const x=ox+f/300*w,y=oy-Math.min(v,1.1)/1.1*h;f?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.stroke();
  const x=ox+157/300*w;ctx.setLineDash([5,5]);line(x,oy-h,x,oy,r.ALERT?C.coral:C.green,2);ctx.setLineDash([]);txt('157 Hz watch line',x+6,oy-h+16,{size:15,weight:800,color:r.ALERT?C.coral:C.green});
  [0,50,100,150,200,250,300].forEach(f=>txt(f+'',ox+f/300*w,oy+22,{size:15,align:'center',color:C.muted}));},
 ch:{en:'Set FAULT = false. Is the time signal noticeably different? Is the spectrum? Now raise the noise from 0.3 to 1.5: does the alert still work?',ta:'FAULT = false வைங்க. Time signal கண்ணுக்கு தெரியுற அளவு வேறுபடுதா? Spectrum? இப்போ noise-ஐ 0.3-ல இருந்து 1.5-க்கு உயர்த்துங்க: alert இன்னும் வேலை செய்யுதா?'},
 ans:{en:'In time, the fault is buried in noise and hard to see; in the spectrum it stands out as a clear peak. Even with much more noise the 157 Hz peak usually survives, because random noise spreads thinly across all frequencies while the fault concentrates at one. That is why factories trust spectra.',ta:'Time-ல fault noise-க்குள்ள புதைஞ்சு, பார்க்க கஷ்டம்; spectrum-ல ஒரு தெளிவான peak-ஆ தனியா தெரியுது. நிறைய noise இருந்தாலும் 157 Hz peak பெரும்பாலும் தப்பிக்கும், ஏன்னா random noise எல்லா frequencies-லயும் மெல்லிசா பரவும், fault ஒரே இடத்துல குவியும். அதனால தான் factories spectra-வை நம்புது.'}},
{id:'heat',title:{en:'Fourier\'s heat: copper vs steel',ta:'Fourier-ஓட வெப்பம்: copper vs steel'},
 why:{en:'Fourier\'s original idea in code: break a rod\'s temperature into sine shapes, let each fade at its own speed, and compare two metals.',ta:'Fourier-ஓட original idea code-ல: ஒரு rod-ஓட temperature-ஐ sine shapes-ஆ பிரிச்சு, ஒவ்வொண்ணையும் அதோட சொந்த வேகத்துல மங்க விட்டு, ரெண்டு உலோகங்களை compare பண்ணுங்க.'},
 code:`const METALS = { copper: 1.11e-4, steel: 1.17e-5 };   // heat diffusivity, m²/s
const LENGTH = 0.1;            // a 10 cm rod
const T = 20;                  // seconds after heating: try 5, 60
const MODES = [[1, 30], [3, 15], [7, 10]];   // [shape number k, starting strength in °C]

// Each sine shape k fades like exp(−α·(kπ/L)²·t): tighter shapes fade much faster.
const profiles = {};
for (const [name, alpha] of Object.entries(METALS)) {
  const left = MODES.map(([k, a]) => a * Math.exp(-alpha * (k * Math.PI / LENGTH) ** 2 * T));
  profiles[name] = left;
  print(name + " after " + T + " s: main hot spot " + left[0].toFixed(1) + " °C, sharp wiggle " + left[2].toFixed(2) + " °C");
}
return { profiles, MODES, T };`,
 viz(r,a){title('Temperature above room, after '+r.T+' s');const ox=40,w=720,h=130;[['copper',150,C.coral],['steel',350,C.ink]].forEach(([nm,yc,c])=>{txt(nm,ox,yc-90,{size:20,weight:800});line(ox,yc,ox+w,yc,C.light,2);
  ctx.beginPath();for(let i=0;i<=200;i++){const x=i/200;const v=r.MODES.reduce((s,[k],j)=>s+r.profiles[nm][j]*Math.sin(Math.PI*k*x),0)*ease(a);const px=ox+x*w,py=yc-v/55*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();});},
 ch:{en:'At T = 20 s, how much of the main hot spot is left in copper vs steel? Which metal would you use for the base of a cooking pan, and why?',ta:'T = 20 s-ல, copper-லயும் steel-லயும் main hot spot எவ்வளவு மிச்சம்? சமையல் pan-ஓட அடிக்கு எந்த உலோகத்தை use பண்ணுவீங்க, ஏன்?'},
 ans:{en:'Copper has spread most of its hot spot out (about 3 °C of 30 left), while steel still holds about 24 °C of it. For a pan base you want heat to spread evenly so food does not burn in one spot, so copper or aluminium layers are used. Engines and heat sinks are designed with the same numbers.',ta:'Copper தன் hot spot-ஐ பெரும்பாலும் பரப்பிடுச்சு (30-ல சுமார் 3 °C மிச்சம்), steel-ல இன்னும் சுமார் 24 °C இருக்கு. Pan அடியில வெப்பம் சீரா பரவணும், அப்போ சாப்பாடு ஒரே இடத்துல கருகாது, அதனால copper அல்லது aluminium layers use பண்றாங்க. Engines, heat sinks-உம் இதே numbers வெச்சு தான் design பண்றாங்க.'}}
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
