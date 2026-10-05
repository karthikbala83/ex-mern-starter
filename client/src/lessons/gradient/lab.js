// Gradient descent code lab: experiments (JavaScript + Python) with their chart drawings.
// `libs` = JS packages injected by CodeLab (mathjs → `math`); `pyPackages` = loaded into Pyodide first (numpy).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "descend": "RATE = 0.01    # try 0.001, then 0.02, then 0.03\nSTEPS = 10\nkm = [2, 4, 5, 8, 10]\nfare = [60, 115, 140, 230, 285]\n\n# slope of the average squared error for the model fare = w × km\nslope = lambda w: 2 / len(km) * sum((w * x - y) * x for x, y in zip(km, fare))\nerror = lambda w: sum((w * x - y) ** 2 for x, y in zip(km, fare)) / len(km)\n\nw = 0\npath = [w]\nfor step in range(1, STEPS + 1):\n    w = w - RATE * slope(w)          # the whole of gradient descent\n    path.append(w)\n    print(f\"step {step}: w = ₹{w:.2f} per km, error {error(w):.1f}\")\nresult = {\"path\": path, \"RATE\": RATE, \"errors\": [error(v) for v in path]}",
  "rates": "RATES = [0.001, 0.01, 0.03]\nSTEPS = 15\nkm = [2, 4, 5, 8, 10]\nfare = [60, 115, 140, 230, 285]\nbest = 5970 / 209          # the true bottom: ₹28.56 per km\nslope = lambda w: 2 / len(km) * sum((w * x - y) * x for x, y in zip(km, fare))\n\nruns = []\nfor rate in RATES:\n    w = 0\n    gap = [abs(w - best)]\n    for _ in range(STEPS):\n        w -= rate * slope(w)\n        gap.append(abs(w - best))\n    print(f\"rate {rate}: after {STEPS} steps, off by ₹{gap[STEPS]:.3f}\")\n    runs.append({\"rate\": rate, \"gap\": gap})\nresult = {\"runs\": runs, \"STEPS\": STEPS}",
  "twoParams": "import numpy as np\nRATE = 0.012\nSTEPS = 2000      # b learns slowly here: try 100 and see\nkm = [2, 4, 5, 8, 10]\nfare = [60, 115, 140, 230, 285]\nn = len(km)\n\nw = b = 0.0\nfor _ in range(STEPS):\n    gw = gb = 0.0                      # slope in each direction\n    for x, y in zip(km, fare):\n        miss = w * x + b - y\n        gw += 2 / n * miss * x\n        gb += 2 / n * miss\n    w -= RATE * gw\n    b -= RATE * gb\n\nwx, bx = np.polyfit(km, fare, 1)      # the exact answer, from the package\nprint(f\"gradient descent: w = {w:.2f}, b = {b:.2f}\")\nprint(f\"exact (numpy):    w = {wx:.2f}, b = {bx:.2f}\")\nresult = {\"w\": w, \"b\": b, \"wx\": float(wx), \"bx\": float(bx)}",
  "derivative": "import math\nH = 0.0001      # a tiny step: try 1, then 0.1\nX = 1\n\nslope_at = lambda f, x: (f(x + H) - f(x - H)) / (2 * H)    # numerical slope\n\ntests = [\n    (\"x²\", lambda x: x * x, lambda x: 2 * x),\n    (\"x³\", lambda x: x ** 3, lambda x: 3 * x * x),\n    (\"sin x\", math.sin, math.cos),            # calculus: the slope of sin is cos\n]\nrows = []\nfor name, f, exact in tests:\n    num = slope_at(f, X)\n    print(f\"{name} at x = {X}: tiny-step slope {num:.6f}, calculus {exact(X):.6f}\")\n    rows.append({\"name\": name, \"num\": num, \"exact\": exact(X)})\nresult = {\"rows\": rows, \"H\": H}",
  "dips": "import math\nSTARTS = [1.5, 5, 8, 11, 13]   # try your own\nRATE, STEPS = 0.12, 200\n\nf = lambda x: 0.05 * (x - 9) ** 2 + 0.8 * math.sin(1.7 * x) + 1.6   # a bumpy valley\nslope = lambda x: (f(x + 1e-4) - f(x - 1e-4)) / 2e-4\n\nends = []\nfor x0 in STARTS:\n    x = x0\n    for _ in range(STEPS):\n        x -= RATE * slope(x)\n    print(f\"start {x0} → ends at x = {x:.2f}, height {f(x):.3f}\")\n    ends.append({\"x0\": x0, \"x\": x, \"h\": f(x)})\nbest = min(ends, key=lambda e: e[\"h\"])\nprint(f\"best: start {best['x0']} → height {best['h']:.3f}\")\nresult = {\"ends\": ends, \"best\": best}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'descend',title:{en:'Watch the AI learn the price',ta:'AI விலையை கத்துக்கிறதை பாருங்க'},
 why:{en:'Gradient descent in ten lines: start at zero, feel the slope, step downhill, repeat. Change the rate and watch how learning speeds up, slows down or breaks.',ta:'பத்து lines-ல gradient descent: zero-ல ஆரம்பிச்சு, slope-ஐ உணர்ந்து, கீழ இறங்கி, திரும்ப திரும்ப. Rate-ஐ மாத்தி, learning வேகமாகுதா, மெதுவாகுதா, உடையுதான்னு பாருங்க.'},
 code:`const RATE = 0.01;    // try 0.001, then 0.02, then 0.03
const STEPS = 10;
const km = [2, 4, 5, 8, 10], fare = [60, 115, 140, 230, 285];

// slope of the average squared error for the model fare = w × km
const slope = (w) => 2 / km.length * km.reduce((s, x, i) => s + (w * x - fare[i]) * x, 0);
const error = (w) => km.reduce((s, x, i) => s + (w * x - fare[i]) ** 2, 0) / km.length;

let w = 0;
const path = [w];
for (let step = 1; step <= STEPS; step++) {
  w = w - RATE * slope(w);          // the whole of gradient descent
  path.push(w);
  print("step " + step + ": w = ₹" + w.toFixed(2) + " per km, error " + error(w).toFixed(1));
}
return { path, RATE, errors: path.map(error) };`,
 viz(r,a){title('Learning the price per km (rate '+r.RATE+')');const ox=50,oy=430,w=700,h=360;const E=v=>[2,4,5,8,10].reduce((s,x,i)=>s+(v*x-[60,115,140,230,285][i])**2,0)/5;
  const X=v=>ox+(v+10)/70*w,Y=e=>oy-Math.min(e,40000)/40000*h;line(ox,oy,ox+w,oy,C.light,2);ctx.beginPath();for(let i=0;i<=140;i++){const v=-10+i/2;i?ctx.lineTo(X(v),Y(E(v))):ctx.moveTo(X(v),Y(E(v)));}ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  const n=Math.ceil(r.path.length*ease(a));for(let i=0;i<n;i++){const v=r.path[i];if(X(v)<ox||X(v)>ox+w||E(v)>40000)continue;if(i>0&&E(r.path[i-1])<=40000)line(X(r.path[i-1]),Y(E(r.path[i-1])),X(v),Y(E(v)),C.gold,2);ctx.beginPath();ctx.arc(X(v),Y(E(v)),6,0,7);ctx.fillStyle=i===n-1?C.green:C.gold;ctx.fill();}
  const last=r.path[r.path.length-1];txt(isFinite(last)&&Math.abs(last)<1e6?'w = ₹'+last.toFixed(2):'w exploded!',ox,470,{size:20,weight:800,color:Math.abs(last-28.56)<0.5?C.green:C.coral});},
 ch:{en:'The rate limit for this data is about 0.024. Try 0.02 and 0.025. What changes between "just under" and "just over" the limit?',ta:'இந்த data-க்கு rate limit சுமார் 0.024. 0.02, 0.025 try பண்ணுங்க. Limit-க்கு "கொஞ்சம் கீழ"-க்கும் "கொஞ்சம் மேல"-க்கும் என்ன வித்தியாசம்?'},
 ans:{en:'At 0.02 it zig-zags across the valley, but each zig is smaller, so given a few more steps it settles at ₹28.56 (after 10 steps it is at ₹28.03). At 0.025 each zig is bigger than the last and it flies away. Tiny changes in the rate can decide whether an AI learns or breaks.',ta:'0.02-ல பள்ளத்தாக்கை கடந்து zig-zag பண்ணுது, ஆனா ஒவ்வொரு zig-உம் சின்னதாகுது, அதனால இன்னும் சில steps-ல ₹28.56-ல settle ஆகும் (10 steps-க்கு அப்புறம் ₹28.03). 0.025-ல ஒவ்வொரு zig-உம் முந்தையதை விட பெருசு, பறந்து போயிடுது. Rate-ல சின்ன மாற்றம் கூட ஒரு AI கத்துக்குமா உடையுமான்னு தீர்மானிக்கும்.'}},
{id:'rates',title:{en:'Three learners, three step sizes',ta:'மூணு learners, மூணு step sizes'},
 why:{en:'Run three learners side by side and plot how far each is from the right answer after every step.',ta:'மூணு learners-ஐ பக்கத்து பக்கத்துல ஓட்டி, ஒவ்வொரு step-க்கு அப்புறமும் சரியான answer-ல இருந்து எவ்வளவு தூரத்துல இருக்குன்னு plot பண்ணுங்க.'},
 code:`const RATES = [0.001, 0.01, 0.03];
const STEPS = 15;
const km = [2, 4, 5, 8, 10], fare = [60, 115, 140, 230, 285];
const best = 5970 / 209;       // the true bottom: ₹28.56 per km
const slope = (w) => 2 / km.length * km.reduce((s, x, i) => s + (w * x - fare[i]) * x, 0);

const runs = RATES.map((rate) => {
  let w = 0;
  const gap = [Math.abs(w - best)];
  for (let s = 0; s < STEPS; s++) { w -= rate * slope(w); gap.push(Math.abs(w - best)); }
  print("rate " + rate + ": after " + STEPS + " steps, off by ₹" + gap[STEPS].toFixed(3));
  return { rate, gap };
});
return { runs, STEPS };`,
 viz(r,a){title('Distance from the right answer (₹ per km)');const ox=60,oy=420,w=680,h=330;line(ox,oy,ox+w,oy,C.light,2);line(ox,oy,ox,oy-h,C.light,2);const cols=[C.ink,C.green,C.coral];
  r.runs.forEach((run,j)=>{ctx.beginPath();const n=Math.ceil(run.gap.length*ease(a));for(let i=0;i<n;i++){const x=ox+i/r.STEPS*w,y=oy-Math.min(run.gap[i],60)/60*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=cols[j];ctx.lineWidth=3;ctx.stroke();
   txt('rate '+run.rate,ox+10+j*200,455,{size:18,weight:800,color:cols[j]});});txt('(capped at ₹60 off)',ox+w,oy-h-6,{size:14,color:C.muted,align:'right'});},
 ch:{en:'Which rate is closest after 15 steps? If you could only afford 3 steps (a very big model), which rate would you choose?',ta:'15 steps-க்கு அப்புறம் எந்த rate ரொம்ப பக்கத்துல? 3 steps மட்டும் தான் முடியும்னா (ரொம்ப பெரிய model), எந்த rate-ஐ தேர்ந்தெடுப்பீங்க?'},
 ans:{en:'0.01 gets almost exactly there; 0.001 is still far away; 0.03 explodes. Even with only 3 steps, 0.01 is best. Real AI teams spend a lot of time tuning this one number, often making it smaller as training goes on.',ta:'0.01 கிட்டத்தட்ட சரியா போய் சேருது; 0.001 இன்னும் ரொம்ப தூரம்; 0.03 வெடிக்குது. 3 steps மட்டும் இருந்தாலும் 0.01 தான் best. Real AI teams இந்த ஒரு number-ஐ tune பண்ண நிறைய நேரம் செலவழிக்கிறாங்க, training போக போக அதை சின்னதாக்குவாங்க.'}},
{id:'twoParams',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Two numbers at once: per-km price and base fare',ta:'ஒரே நேரத்துல ரெண்டு numbers: km விலையும் base fare-உம்'},
 why:{en:'Learn w and b together by feeling the slope in both directions. Then check: does gradient descent reach the same answer as the exact formula from a package?',ta:'ரெண்டு திசைகள்லயும் slope-ஐ உணர்ந்து w, b-ஐ ஒண்ணா கத்துக்கோங்க. அப்புறம் check பண்ணுங்க: package-ல இருக்கிற exact formula-வோட அதே answer-க்கு gradient descent வருதா?'},
 code:`const RATE = 0.012;
const STEPS = 2000;      // b learns slowly here: try 100 and see
const km = [2, 4, 5, 8, 10], fare = [60, 115, 140, 230, 285];
const n = km.length;

let w = 0, b = 0;
for (let s = 0; s < STEPS; s++) {
  let gw = 0, gb = 0;                       // slope in each direction
  km.forEach((x, i) => { const miss = w * x + b - fare[i]; gw += 2 / n * miss * x; gb += 2 / n * miss; });
  w -= RATE * gw;
  b -= RATE * gb;
}
// the exact answer, solved by the package (same as Polynomials)
const X = km.map((x) => [1, x]), Xt = math.transpose(X);
const [bx, wx] = math.lusolve(math.multiply(Xt, X), math.multiply(Xt, fare)).map((r) => r[0]);

print("gradient descent: w = " + w.toFixed(2) + ", b = " + b.toFixed(2));
print("exact (mathjs):   w = " + wx.toFixed(2) + ", b = " + bx.toFixed(2));
return { w, b, wx, bx };`,
 viz(r,a){title('fare = w × km + b');const ox=60,oy=420,w=680,h=330,X=k=>ox+k/11*w,Y=v=>oy-v/320*h;line(ox,oy,ox+w,oy,C.light,2);
  [2,4,5,8,10].forEach((k,i)=>{ctx.beginPath();ctx.arc(X(k),Y([60,115,140,230,285][i]),7,0,7);ctx.fillStyle=C.ink;ctx.fill();});
  const e=ease(a);line(X(0),Y(r.bx),X(11*e),Y(r.bx+r.wx*11*e),C.green,6);line(X(0),Y(r.b),X(11*e),Y(r.b+r.w*11*e),C.gold,2);
  txt('gold: gradient descent   green: exact',ox,455,{size:16,weight:800,color:C.muted});},
 ch:{en:'Set STEPS to 100. Why is w nearly right (about 28.14) but b still far off (about 3.08 instead of 1.67)? What does that tell you about real AI training?',ta:'STEPS-ஐ 100-ஆ வைங்க. ஏன் w கிட்டத்தட்ட சரி (சுமார் 28.14), ஆனா b இன்னும் ரொம்ப தூரம் (1.67-க்கு பதிலா சுமார் 3.08)? Real AI training பத்தி அது என்ன சொல்லுது?'},
 ans:{en:'The valley is long and narrow in the b direction: the slope there is gentle, so b creeps slowly while w races ahead. Real training has the same problem across millions of numbers, which is why engineers rescale data and use smarter optimisers (variants such as momentum or Adam).',ta:'b திசையில பள்ளத்தாக்கு நீளமா, குறுகலா இருக்கு: அங்க slope மெதுவா இருக்கிறதால, w வேகமா போகும் போது b மெதுவா நகருது. Real training-ல லட்சக்கணக்கான numbers-லயும் இதே பிரச்சனை, அதனால engineers data-வை rescale பண்ணி, smart optimisers (momentum, Adam மாதிரி variants) use பண்றாங்க.'}},
{id:'derivative',title:{en:'Find any slope with a tiny step',ta:'ஒரு சின்ன அடி வெச்சு எந்த slope-ஐயும் கண்டுபிடிங்க'},
 why:{en:'You don\'t need formulas to find a slope: move a tiny bit and see how much the value changes. Compare with the calculus answer, including sin, whose slope is cos.',ta:'Slope கண்டுபிடிக்க formulas தேவையில்ல: கொஞ்சம் நகர்ந்து, value எவ்வளவு மாறுதுன்னு பாருங்க. Calculus answer-ஓட compare பண்ணுங்க, sin உட்பட: அதோட slope cos.'},
 code:`const H = 0.0001;      // a tiny step: try 1, then 0.1
const X = 1;

const slopeAt = (f, x) => (f(x + H) - f(x - H)) / (2 * H);   // numerical slope

const tests = [
  ["x²", (x) => x * x, (x) => 2 * x],
  ["x³", (x) => x ** 3, (x) => 3 * x * x],
  ["sin x", Math.sin, Math.cos],                // calculus: the slope of sin is cos
];
const rows = tests.map(([name, f, exact]) => {
  const num = slopeAt(f, X);
  print(name + " at x = " + X + ": tiny-step slope " + num.toFixed(6) + ", calculus " + exact(X).toFixed(6));
  return { name, num, exact: exact(X) };
});
return { rows, H };`,
 viz(r,a){title('Tiny-step slope vs calculus (h = '+r.H+')');r.rows.forEach((row,i)=>{const y=110+i*110;txt(row.name,40,y+20,{size:22,weight:800});
  const sc=200/Math.max(3.5,...r.rows.map(q=>Math.max(Math.abs(q.num),Math.abs(q.exact))));box(220,y,Math.max(4,row.num*sc*ease(a)),26,6,C.gold);box(220,y+32,Math.max(4,row.exact*sc*ease(a)),26,6,C.green);
  txt(row.num.toFixed(4),230+row.num*sc,y+20,{size:16,weight:800});txt(row.exact.toFixed(4),230+row.exact*sc,y+52,{size:16,weight:800,color:C.green});});
  txt('gold: tiny step   green: calculus',40,460,{size:16,weight:800,color:C.muted});},
 ch:{en:'Set H to 1, then 0.1. How does the accuracy change? Why do AI libraries not use this method for billions of numbers?',ta:'H-ஐ 1, அப்புறம் 0.1-ஆ வைங்க. Accuracy எப்படி மாறுது? AI libraries ஏன் கோடிக்கணக்கான numbers-க்கு இந்த method use பண்றதில்ல?'},
 ans:{en:'Smaller steps give more accurate slopes (with H = 1 the x³ slope comes out as 4 instead of 3). But this method needs two calculations per number; for a billion numbers that is far too slow. Libraries like PyTorch and TensorFlow use automatic differentiation, which gets every slope exactly in one backward pass.',ta:'சின்ன steps இன்னும் accurate slopes தரும் (H = 1-ல x³ slope 3-க்கு பதிலா 4 வருது). ஆனா இந்த method-க்கு ஒவ்வொரு number-க்கும் ரெண்டு calculations வேணும்; கோடிக்கணக்கான numbers-க்கு அது ரொம்ப slow. PyTorch, TensorFlow மாதிரி libraries automatic differentiation use பண்ணுது, அது ஒரே backward pass-ல ஒவ்வொரு slope-ஐயும் சரியா கண்டுபிடிக்கும்.'}},
{id:'dips',title:{en:'Stuck in a dip? Start somewhere else',ta:'பள்ளத்துல மாட்டிக்கிச்சா? வேற இடத்துல ஆரம்பிங்க'},
 why:{en:'On a bumpy landscape the starting point decides where you end up. Try several starts and keep the best: a simple trick real engineers use.',ta:'மேடு பள்ளமான நிலப்பரப்புல, ஆரம்பிக்கிற இடம் தான் எங்க போய் சேருவீங்கன்னு தீர்மானிக்கும். பல starts try பண்ணி best-ஐ வெச்சுக்கோங்க: real engineers use பண்ற ஒரு simple trick.'},
 code:`const STARTS = [1.5, 5, 8, 11, 13];   // try your own
const RATE = 0.12, STEPS = 200;

const f = (x) => 0.05 * (x - 9) ** 2 + 0.8 * Math.sin(1.7 * x) + 1.6;   // a bumpy valley
const slope = (x) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;

const ends = STARTS.map((x0) => {
  let x = x0;
  for (let s = 0; s < STEPS; s++) x -= RATE * slope(x);
  print("start " + x0 + " → ends at x = " + x.toFixed(2) + ", height " + f(x).toFixed(3));
  return { x0, x, h: f(x) };
});
const best = ends.reduce((m, e) => (e.h < m.h ? e : m));
print("best: start " + best.x0 + " → height " + best.h.toFixed(3));
return { ends, best };`,
 viz(r,a){title('Where each start ends up');const ox=40,oy=420,w=720,h=330,f=x=>0.05*(x-9)**2+0.8*Math.sin(1.7*x)+1.6;const X=x=>ox+x/14*w,Y=y=>oy-y/6*h;
  ctx.beginPath();for(let i=0;i<=280;i++){const x=i/20;i?ctx.lineTo(X(x),Y(f(x))):ctx.moveTo(X(x),Y(f(x)));}ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  r.ends.forEach(e=>{const x=e.x0+(e.x-e.x0)*ease(a);ctx.beginPath();ctx.arc(X(x),Y(f(x))-10,9,0,7);ctx.fillStyle=e===r.best?C.green:C.coral;ctx.fill();});},
 ch:{en:'Which starts get stuck, and where? If you could run only two starts, how would you place them?',ta:'எந்த starts மாட்டிக்குது, எங்க? ரெண்டு starts மட்டும் ஓட்ட முடியும்னா, அவற்றை எங்க வைப்பீங்க?'},
 ans:{en:'Starts at 1.5 and 13 settle in shallow dips; 5 and 8 both end in the middle dip near x = 6.6; only 11 reaches the deepest point near x = 10. With two starts, spread them out (say one on each half) so they explore different valleys. Big AI models also add randomness and momentum to escape shallow dips.',ta:'1.5, 13-ல ஆரம்பிச்சவை ஆழமில்லாத பள்ளங்கள்ல நின்னுடுது; 5, 8 ரெண்டும் x = 6.6 பக்கத்துல நடு பள்ளத்துல; 11 மட்டும் தான் x = 10 பக்கத்துல இருக்கிற ரொம்ப ஆழமான இடத்துக்கு போகுது. ரெண்டு starts-ன்னா, அவற்றை தூர தூரமா வைங்க (ஒவ்வொரு பாதியிலும் ஒண்ணு), அப்போ வேற வேற பள்ளத்தாக்குகளை தேடும். பெரிய AI models-உம் ஆழமில்லாத பள்ளங்கள்ல இருந்து தப்பிக்க randomness, momentum சேர்க்குது.'}}
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
