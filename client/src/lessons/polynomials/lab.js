// Polynomials code lab: experiments (JavaScript + Python) with their chart drawings.
// `libs` = JS packages injected by CodeLab (mathjs → `math`); `pyPackages` = loaded into Pyodide first (numpy).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "evaluate": "import numpy as np\nCOEFFS = [2, 3, 1]   # a, b, c → 2 + 3x + x²   (try [7, 4, 2] at x = 10)\nX = 4\n\nnaive, muls_naive = 0, 0\nfor k, c in enumerate(COEFFS):         # naive: compute every power separately\n    power = 1\n    for _ in range(k):\n        power *= X\n        muls_naive += 1\n    naive += c * power\n    muls_naive += 1\n\nhorner, muls_horner = 0, 0\nfor c in reversed(COEFFS):            # Horner: one multiply per coefficient\n    horner = horner * X + c\n    muls_horner += 1\n\nprint(f\"naive:  {naive}  ({muls_naive} multiplications)\")\nprint(f\"Horner: {horner}  ({muls_horner} multiplications)\")\nprint(\"numpy.polyval:\", np.polyval(COEFFS[::-1], X), \" (numpy wants the HIGHEST power first!)\")\nresult = {\"COEFFS\": COEFFS, \"X\": X, \"value\": horner, \"mulsNaive\": muls_naive, \"mulsHorner\": muls_horner}",
  "fitLine": "days = [1, 2, 3, 4, 5]\nfootfall = [300, 440, 610, 905, 1215]\n\nbest, tried = None, 0\nfor a in range(-200, 401, 5):          # starting value\n    for b in range(100, 301):          # growth per day\n        err = sum((f - (a + b * d)) ** 2 for d, f in zip(days, footfall))\n        tried += 1\n        if best is None or err < best[\"err\"]:\n            best = {\"a\": a, \"b\": b, \"err\": err}\nprint(\"tried\", tried, \"lines\")\nprint(f\"best: footfall = {best['a']} + {best['b']}·day   (error {best['err']})\")\nprint(\"day 6 prediction:\", best[\"a\"] + best[\"b\"] * 6)\nresult = {\"days\": days, \"footfall\": footfall, **best}",
  "fitCurve": "import numpy as np\nDEGREE = 2   # try 1, 2, 3\ndays = [1, 2, 3, 4, 5]\nfootfall = [300, 440, 610, 905, 1215]\n\nc_high_first = np.polyfit(days, footfall, DEGREE)    # least squares in one line\ncoeffs = [float(c) for c in c_high_first[::-1]]      # reverse to a, b, c order\npredict = lambda d: sum(c * d ** k for k, c in enumerate(coeffs))\nerr = sum((f - predict(d)) ** 2 for d, f in zip(days, footfall))\nprint(\"coefficients:\", \", \".join(f\"{c:.2f}\" for c in coeffs))\nprint(f\"error: {err:.0f}   day 6: {predict(6):.0f}\")\nresult = {\"days\": days, \"footfall\": footfall, \"coeffs\": coeffs, \"err\": err, \"d6\": predict(6)}",
  "overfit": "import numpy as np\ny = [37, 15, 38, 37, 42, 49, 43, 59]       # 8 days, noisy\ntrain, test = y[:7], y[7]                  # hide day 8 from the model\nxs = [(i + 1) / 8 for i in range(7)]       # scale x to 0..1 for stable maths\n\nresults = []\nfor deg in [1, 2, 6]:\n    c = [float(v) for v in np.polyfit(xs, train, deg)[::-1]]\n    f = lambda x: sum(a * x ** k for k, a in enumerate(c))\n    train_err = sum((t - f(x)) ** 2 for x, t in zip(xs, train))\n    guess = f(8 / 8)\n    print(f\"degree {deg}: train error {train_err:.1f}, predicts day 8 = {guess:.1f} (real {test})\")\n    results.append({\"deg\": deg, \"c\": c, \"trainErr\": train_err, \"guess\": guess})\nresult = {\"y\": y, \"results\": results}",
  "jump": "V = 8     # jump speed (m/s): try 10\nG = 10    # gravity (m/s²): Earth ≈ 9.8, Moon ≈ 1.6: try it!\n\nheight = lambda t: V * t - 0.5 * G * t * t     # a degree-2 polynomial in t\nlanding = 2 * V / G                             # solve height(t) = 0\npeak_time = V / G\npeak = height(peak_time)\n\narc = [[landing * i / 60, height(landing * i / 60)] for i in range(61)]\nprint(f\"peak height {peak:.2f} m at t = {peak_time:.2f} s\")\nprint(f\"lands at t = {landing:.2f} s\")\nresult = {\"arc\": arc, \"peak\": peak, \"landing\": landing, \"V\": V, \"G\": G}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'evaluate',title:{en:'Evaluate a polynomial: the fast way',ta:'Polynomial-ஐ evaluate பண்ணுங்க: வேகமான வழி'},pyPackages:['numpy'],
 why:{en:'Two ways to compute the same polynomial. Horner\'s method needs far fewer multiplications, which is how real libraries evaluate polynomials like Math.sin.',ta:'ஒரே polynomial-ஐ calculate பண்ண ரெண்டு வழி. Horner method-க்கு ரொம்ப குறைவான பெருக்கல்கள் போதும். Math.sin மாதிரி polynomials-ஐ real libraries இப்படி தான் evaluate பண்ணுது.'},
 code:`const COEFFS = [2, 3, 1];   // a, b, c → 2 + 3x + x²   (try [7, 4, 2] at x = 10)
const X = 4;

// naive: compute every power separately
let naive = 0, mulsNaive = 0;
COEFFS.forEach((c, k) => {
  let power = 1;
  for (let i = 0; i < k; i++) { power *= X; mulsNaive++; }
  naive += c * power; mulsNaive++;
});

// Horner: ((c)·x + b)·x + a  — one multiply per coefficient
let horner = 0, mulsHorner = 0;
for (let k = COEFFS.length - 1; k >= 0; k--) { horner = horner * X + COEFFS[k]; mulsHorner++; }

print("naive:  " + naive + "  (" + mulsNaive + " multiplications)");
print("Horner: " + horner + "  (" + mulsHorner + " multiplications)");
return { COEFFS, X, value: horner, mulsNaive, mulsHorner };`,
 viz(r,a){title('y = '+r.COEFFS.map((c,k)=>k===0?c:c+'x'+(k>1?'^'+k:'')).join(' + '));const ox=60,oy=380,w=680,h=300;const f=x=>r.COEFFS.reduce((s,c,k)=>s+c*x**k,0);
  const xmax=Math.max(5,r.X*1.3),ymax=Math.max(...[0,1,2,3,4,5,6,7,8].map(i=>f(i/8*xmax)))||1;line(ox,oy,ox+w,oy,C.light,2);
  ctx.beginPath();for(let i=0;i<=100*ease(a);i++){const x=i/100*xmax;const px=ox+x/xmax*w,py=oy-f(x)/ymax*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  const px=ox+r.X/xmax*w,py=oy-r.value/ymax*h;ctx.beginPath();ctx.arc(px,py,9,0,7);ctx.fillStyle=C.coral;ctx.fill();txt('x = '+r.X+' → '+r.value,px+12,py-8,{size:18,weight:800,color:C.coral});
  txt('multiplications: naive '+r.mulsNaive+' · Horner '+r.mulsHorner,ox,440,{size:18,weight:800,color:C.muted});},
 ch:{en:'Use a degree-6 polynomial, e.g. COEFFS = [1, 1, 1, 1, 1, 1, 1]. How many multiplications does each method need now? Why does this matter inside a phone?',ta:'ஒரு degree-6 polynomial use பண்ணுங்க, உதாரணமா COEFFS = [1, 1, 1, 1, 1, 1, 1]. இப்போ ஒவ்வொரு method-க்கும் எத்தனை பெருக்கல்கள்? Phone-க்குள்ள இது ஏன் முக்கியம்?'},
 ans:{en:'Naive needs 28 (it recomputes every power), Horner only 7. Inside a phone, Math.sin and graphics run millions of times a second, so fewer multiplications means faster apps and less battery.',ta:'Naive-க்கு 28 (ஒவ்வொரு power-ஐயும் மறுபடி calculate பண்ணுது), Horner-க்கு 7 மட்டும். Phone-க்குள்ள Math.sin, graphics ஒவ்வொரு second-உம் லட்சக்கணக்கான தடவை ஓடுது, அதனால குறைவான பெருக்கல்-ன்னா வேகமான apps, குறைவான battery.'}},
{id:'fitLine',title:{en:'Learn a line by trying',ta:'முயற்சி பண்ணி ஒரு line-ஐ கத்துக்கோங்க'},
 why:{en:'The computer tries thousands of lines and keeps the one with the smallest total of squared misses. This is least squares, done the slow, honest way.',ta:'Computer ஆயிரக்கணக்கான lines-ஐ try பண்ணி, squared misses total ரொம்ப குறைவா இருக்கிறதை வெச்சுக்குது. இது least squares, மெதுவான, நேர்மையான வழியில.'},
 code:`const days = [1, 2, 3, 4, 5];
const footfall = [300, 440, 610, 905, 1215];

let best = null, tried = 0;
for (let a = -200; a <= 400; a += 5)          // starting value
  for (let b = 100; b <= 300; b += 1) {       // growth per day
    let err = 0;
    days.forEach((d, i) => { err += (footfall[i] - (a + b * d)) ** 2; });
    tried++;
    if (!best || err < best.err) best = { a, b, err };
  }
print("tried " + tried + " lines");
print("best: footfall = " + best.a + " + " + best.b + "·day   (error " + best.err + ")");
print("day 6 prediction: " + (best.a + best.b * 6));
return { days, footfall, ...best };`,
 viz(r,a){title('Best straight line: '+r.a+' + '+r.b+'·day');const ox=60,oy=420,w=680,h=340,X=d=>ox+d/6.5*w,Y=v=>oy-v/1600*h;line(ox,oy,ox+w,oy,C.light,2);
  r.days.forEach((d,i)=>{const fy=r.a+r.b*d;line(X(d),Y(r.footfall[i]),X(d),Y(fy),C.coral,2);ctx.beginPath();ctx.arc(X(d),Y(r.footfall[i]),7,0,7);ctx.fillStyle=C.ink;ctx.fill();});
  line(X(.5),Y(r.a+r.b*.5),X(.5+5.7*ease(a)),Y(r.a+r.b*(.5+5.7*ease(a))),C.gold,4);txt('error '+r.err.toLocaleString('en-IN'),ox,455,{size:18,weight:800,color:C.coral});},
 ch:{en:'The best line still misses day 5 by a lot. Look at the coral gaps: is there a pattern in them? What does that tell you?',ta:'Best line கூட day 5-ஐ நிறைய miss பண்ணுது. Coral gaps-ஐ பாருங்க: அதுல ஏதாவது pattern இருக்கா? அது என்ன சொல்லுது?'},
 ans:{en:'The misses go above, then below for the middle days, then above again: a curve-shaped pattern. When the leftovers have a shape, the model is too simple. A degree-2 curve removes that shape, and the error drops from about 16,000 to about 600.',ta:'Misses முதல்ல மேல, நடு நாட்கள்ல கீழ, அப்புறம் மறுபடியும் மேல: ஒரு curve shape pattern. மீதி gaps-க்கு ஒரு shape இருந்தா, model ரொம்ப simple. Degree-2 curve அந்த shape-ஐ நீக்குது, error சுமார் 16,000-ல இருந்து சுமார் 600-க்கு குறையுது.'}},
{id:'fitCurve',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Fit a curve in one line',ta:'ஒரே line-ல curve fit பண்ணுங்க'},
 why:{en:'The professional way: solve the least-squares equations directly. In JavaScript we use mathjs matrices; in Python, the famous numpy.polyfit.',ta:'Professional வழி: least-squares equations-ஐ நேரடியா solve பண்றது. JavaScript-ல mathjs matrices; Python-ல பிரபலமான numpy.polyfit.'},
 code:`const DEGREE = 2;   // try 1, 2, 3
const days = [1, 2, 3, 4, 5];
const footfall = [300, 440, 610, 905, 1215];

// each row is [1, d, d², ...]; solve (XᵀX)·c = Xᵀy for the coefficients c
const X = days.map((d) => Array.from({ length: DEGREE + 1 }, (_, k) => d ** k));
const Xt = math.transpose(X);
const coeffs = math.lusolve(math.multiply(Xt, X), math.multiply(Xt, footfall)).map((row) => row[0]);

const predict = (d) => coeffs.reduce((s, c, k) => s + c * d ** k, 0);
const err = days.reduce((s, d, i) => s + (footfall[i] - predict(d)) ** 2, 0);
print("coefficients: " + coeffs.map((c) => c.toFixed(2)).join(", "));
print("error: " + err.toFixed(0) + "   day 6: " + predict(6).toFixed(0));
return { days, footfall, coeffs, err, d6: predict(6) };`,
 viz(r,a){title('Degree '+(r.coeffs.length-1)+' fit: day 6 ≈ '+Math.round(r.d6));const ox=60,oy=420,w=680,h=340,X=d=>ox+d/6.5*w,Y=v=>oy-v/2000*h;const f=d=>r.coeffs.reduce((s,c,k)=>s+c*d**k,0);line(ox,oy,ox+w,oy,C.light,2);
  ctx.beginPath();for(let i=0;i<=100*ease(a);i++){const d=.6+i/100*5.6;i?ctx.lineTo(X(d),Y(f(d))):ctx.moveTo(X(d),Y(f(d)));}ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  r.days.forEach((d,i)=>{ctx.beginPath();ctx.arc(X(d),Y(r.footfall[i]),7,0,7);ctx.fillStyle=C.ink;ctx.fill();});ctx.beginPath();ctx.arc(X(6),Y(r.d6),9,0,7);ctx.fillStyle=C.coral;ctx.fill();},
 ch:{en:'Try DEGREE = 3. Does the error go down? Does the day-6 prediction still make sense? Now try 4.',ta:'DEGREE = 3 try பண்ணுங்க. Error குறையுதா? Day-6 prediction இன்னும் அர்த்தமுள்ளதா இருக்கா? இப்போ 4 try பண்ணுங்க.'},
 ans:{en:'Error falls with every degree and reaches 0 at degree 4, because 5 points can always be hit exactly by a degree-4 curve. But the day-6 prediction stops growing at degree 4 (about 1,225). Lower error on the past does not mean a better forecast.',ta:'ஒவ்வொரு degree-க்கும் error குறையுது, degree 4-ல 0 ஆகுது, ஏன்னா 5 points-ஐ degree-4 curve எப்பவும் சரியா தொடும். ஆனா degree 4-ல day-6 prediction வளர்றதை நிறுத்திடுது (சுமார் 1,225). கடந்த காலத்துல குறைவான error-ன்னா நல்ல forecast-ன்னு அர்த்தமில்ல.'}},
{id:'overfit',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Catch an overfit',ta:'Overfit-ஐ பிடிங்க'},
 why:{en:'Hold back the last day, train on the rest, and see which degree predicts the held-back day best. This is how every ML engineer tests a model.',ta:'கடைசி நாளை தனியா வெச்சு, மீதியில train பண்ணி, எந்த degree அந்த நாளை சிறப்பா predict பண்ணுதுன்னு பாருங்க. ஒவ்வொரு ML engineer-உம் ஒரு model-ஐ இப்படி தான் test பண்றாங்க.'},
 code:`const y = [37, 15, 38, 37, 42, 49, 43, 59];       // 8 days, noisy
const train = y.slice(0, 7), test = y[7];            // hide day 8 from the model
const xs = train.map((_, i) => (i + 1) / 8);         // scale x to 0..1 for stable maths

function fit(deg) {
  const X = xs.map((x) => Array.from({ length: deg + 1 }, (_, k) => x ** k));
  const Xt = math.transpose(X);
  return math.lusolve(math.multiply(Xt, X), math.multiply(Xt, train)).map((r) => r[0]);
}
const results = [1, 2, 6].map((deg) => {
  const c = fit(deg);
  const f = (x) => c.reduce((s, a, k) => s + a * x ** k, 0);
  const trainErr = xs.reduce((s, x, i) => s + (train[i] - f(x)) ** 2, 0);
  const guess = f(8 / 8);
  print("degree " + deg + ": train error " + trainErr.toFixed(1) + ", predicts day 8 = " + guess.toFixed(1) + " (real " + test + ")");
  return { deg, c, trainErr, guess };
});
return { y, results };`,
 viz(r,a){title('Train on days 1–7, test on day 8');const ox=60,oy=410,w=680,h=320,X=d=>ox+d/8.6*w,Y=v=>oy-Math.max(-10,Math.min(110,v))/110*h;line(ox,oy,ox+w,oy,C.light,2);
  const cols=[C.green,C.gold,C.coral];r.results.forEach((res,j)=>{const f=x=>res.c.reduce((s,q,k)=>s+q*x**k,0);ctx.beginPath();for(let i=0;i<=120*ease(a);i++){const d=.8+i/120*7.4;i?ctx.lineTo(X(d),Y(f(d/8))):ctx.moveTo(X(d),Y(f(d/8)));}ctx.strokeStyle=cols[j];ctx.lineWidth=3;ctx.stroke();
   txt('degree '+res.deg+': day 8 → '+res.guess.toFixed(0),ox+10+j*230,450,{size:16,weight:800,color:cols[j]});});
  r.y.forEach((v,i)=>{ctx.beginPath();ctx.arc(X(i+1),Y(v),7,0,7);ctx.fillStyle=i===7?C.coral:C.ink;ctx.fill();});},
 ch:{en:'Which degree has the lowest training error? Which predicts day 8 best? What does that tell you about judging a model only by its training error?',ta:'எந்த degree-க்கு training error ரொம்ப குறைவு? எது day 8-ஐ சிறப்பா predict பண்ணுது? Training error-ஐ மட்டும் வெச்சு ஒரு model-ஐ judge பண்றது பத்தி அது என்ன சொல்லுது?'},
 ans:{en:'Degree 6 has the lowest training error (it passes through all 7 training points) but its day-8 guess is far off. A simple line or degree 2 predicts day 8 much better. Always judge a model on data it has not seen: that is called a test set.',ta:'Degree 6-க்கு training error ரொம்ப குறைவு (7 training points வழியாவும் போகுது), ஆனா அதோட day-8 guess ரொம்ப தூரம். Simple line அல்லது degree 2, day 8-ஐ ரொம்ப நல்லா predict பண்ணுது. ஒரு model-ஐ அது பார்க்காத data-ல தான் judge பண்ணணும்: அதுக்கு பேர் test set.'}},
{id:'jump',title:{en:'Design the perfect jump',ta:'Perfect jump-ஐ design பண்ணுங்க'},
 why:{en:'Game designers tune jumps with a degree-2 polynomial. Change the jump speed and gravity, and calculate the peak and landing exactly.',ta:'Game designers degree-2 polynomial வெச்சு jumps-ஐ tune பண்றாங்க. Jump speed-ஐயும் gravity-ஐயும் மாத்தி, உச்சியையும் தரையிறங்கும் நேரத்தையும் சரியா calculate பண்ணுங்க.'},
 code:`const V = 8;     // jump speed (m/s): try 10
const G = 10;    // gravity (m/s²): Earth ≈ 9.8, Moon ≈ 1.6: try it!

const height = (t) => V * t - 0.5 * G * t * t;   // a degree-2 polynomial in t
const landing = 2 * V / G;                         // solve height(t) = 0
const peakTime = V / G;
const peak = height(peakTime);

const arc = [];
for (let i = 0; i <= 60; i++) { const t = landing * i / 60; arc.push([t, height(t)]); }
print("peak height " + peak.toFixed(2) + " m at t = " + peakTime.toFixed(2) + " s");
print("lands at t = " + landing.toFixed(2) + " s");
return { arc, peak, landing, V, G };`,
 viz(r,a){title('Jump: peak '+r.peak.toFixed(2)+' m, lands at '+r.landing.toFixed(2)+' s');const ox=60,oy=420,w=680,h=320;const mx=Math.max(4,r.peak*1.15),mt=Math.max(2,r.landing);line(ox,oy,ox+w,oy,C.ink,2);
  ctx.beginPath();r.arc.slice(0,Math.ceil(r.arc.length*ease(a))).forEach(([t,hh],i)=>{const x=ox+t/mt*w,y=oy-hh/mx*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();
  const n=Math.max(0,Math.ceil(r.arc.length*ease(a))-1);const [t,hh]=r.arc[n];ctx.beginPath();ctx.arc(ox+t/mt*w,oy-hh/mx*h-14,14,0,7);ctx.fillStyle=C.ink;ctx.fill();},
 ch:{en:'Set G to 1.6 (the Moon). How much higher and longer is the jump? Why do game designers often use a stronger gravity than real life?',ta:'G-ஐ 1.6 (நிலா) ஆக்குங்க. Jump எவ்வளவு உயரமா, நீளமா ஆகுது? Game designers ஏன் அடிக்கடி real life-ஐ விட அதிக gravity use பண்றாங்க?'},
 ans:{en:'With G = 1.6 the peak is 20 m and the jump lasts 10 s, over six times higher and longer than on Earth. Real gravity often feels "floaty" on screen, so designers increase G (and the jump speed) to make jumps snappy and easy to control.',ta:'G = 1.6-ல உச்சி 20 m, jump 10 s நீடிக்குது, பூமியை விட ஆறு மடங்குக்கு மேல உயரம், நீளம். Screen-ல real gravity "மிதக்கிற" மாதிரி தெரியும், அதனால designers G-ஐயும் jump speed-ஐயும் அதிகமாக்கி, jumps-ஐ snappy-ஆவும், control பண்ண சுலபமாவும் ஆக்குவாங்க.'}}
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
