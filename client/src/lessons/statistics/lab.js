// Statistics code lab: experiments (JavaScript + Python) with their chart drawings.
// `libs` = JS packages injected by CodeLab (mathjs → `math`); `pyPackages` = loaded into Pyodide first.
// Python's `statistics` module is built in: no install needed.
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "meanMedian": "import statistics      # built into Python: no install needed\nTOP_OFFER = 45         # try 100, then 6\noffers = [3.2, 3.5, 3.5, 3.6, 3.8, 4.0, 4.2, 4.5, 5.0, TOP_OFFER]   # ₹ lakh\n\n# by hand\nmean = sum(offers) / len(offers)\ns = sorted(offers)                     # sorted() returns a copy\nn = len(s)\nmedian = s[(n - 1) // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2\n\nprint(f\"by hand:    mean {mean:.2f}, median {median:.2f}\")\nprint(f\"statistics: mean {statistics.mean(offers):.2f}, median {statistics.median(offers):.2f}\")\nresult = {\"offers\": offers, \"mean\": mean, \"median\": median}",
  "mode": "import statistics\norders = ['M','L','M','S','M','XL','L','M','L','S','M','M','L','XL','M','S','L','M']\n\ncounts = {}\nfor size in orders:                    # count by hand, like GROUP BY\n    counts[size] = counts.get(size, 0) + 1\nby_hand = max(counts, key=counts.get)\n\nprint(\"counts:\", counts)\nprint(\"mode by hand:\", by_hand)\nprint(\"statistics.mode:\", statistics.mode(orders))\nresult = {\"counts\": counts, \"mode\": by_hand}",
  "spread": "import math, statistics\nimport numpy as np\nA = [55, 57, 58, 59, 60, 60, 61, 62, 63, 65]\nB = [20, 30, 45, 55, 60, 60, 65, 75, 90, 100]\n\ndef sd(arr):                          # by hand: divide by n\n    m = sum(arr) / len(arr)\n    return math.sqrt(sum((x - m) ** 2 for x in arr) / len(arr))\n\nfor name, arr in [(\"A\", A), (\"B\", B)]:\n    print(f\"Section {name}: by hand {sd(arr):.2f}, numpy {np.std(arr):.2f}, \"\n          f\"statistics.pstdev {statistics.pstdev(arr):.2f}, statistics.stdev {statistics.stdev(arr):.2f}\")\nresult = {\"A\": A, \"B\": B, \"sdA\": sd(A), \"sdB\": sd(B)}",
  "percentile": "import random\nimport numpy as np\nN = 1000\nSLOW_CHANCE = 0.08    # chance a request hits a slow database: try 0.01, 0.2\n\ntimes = []\nfor i in range(N):\n    normal = 150 + random.random() * 150                       # 150–300 ms\n    times.append(normal + 600 + random.random() * 900 if random.random() < SLOW_CHANCE else normal)\ns = sorted(times)\npct = lambda p: s[min(N - 1, int(p / 100 * N))]                  # by hand\n\nmean = sum(times) / N\nprint(f\"mean:   {mean:.0f} ms\")\nprint(f\"median: {pct(50):.0f} ms\")\nprint(f\"p95:    {pct(95):.0f} ms   (numpy: {np.percentile(times, 95):.0f})\")\nprint(f\"p99:    {pct(99):.0f} ms\")\nresult = {\"times\": times, \"mean\": mean, \"p50\": pct(50), \"p95\": pct(95), \"p99\": pct(99)}",
  "bell": "import random, math\nSTUDENTS = 2000\nQUESTIONS = 50     # try 10, then 200\nCHANCE = 0.6       # chance of getting each question right\n\nscores = [sum(random.random() < CHANCE for _ in range(QUESTIONS)) for _ in range(STUDENTS)]\nmean = sum(scores) / STUDENTS\nsd = math.sqrt(sum((x - mean) ** 2 for x in scores) / STUDENTS)\nwithin = sum(abs(x - mean) <= sd for x in scores) / STUDENTS\nprint(f\"mean {mean:.1f}, SD {sd:.2f}\")\nprint(f\"within 1 SD: {within * 100:.1f}% of students\")\nresult = {\"scores\": scores, \"mean\": mean, \"sd\": sd, \"QUESTIONS\": QUESTIONS}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'meanMedian',libs:['mathjs'],title:{en:'Mean vs median: the placement brochure',ta:'Mean vs median: placement brochure'},
 why:{en:'Calculate both by hand, then with mathjs. Change the top offer and watch which number moves.',ta:'ரெண்டையும் கையால calculate பண்ணி, அப்புறம் mathjs வெச்சு பாருங்க. Top offer-ஐ மாத்தி, எந்த number நகருதுன்னு பாருங்க.'},
 code:`const TOP_OFFER = 45;    // try 100, then 6
const offers = [3.2, 3.5, 3.5, 3.6, 3.8, 4.0, 4.2, 4.5, 5.0, TOP_OFFER];   // ₹ lakh

// by hand
const mean = offers.reduce((s, x) => s + x, 0) / offers.length;
const sorted = [...offers].sort((a, b) => a - b);          // copy first: never sort someone else's array
const n = sorted.length;
const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

print("by hand: mean " + mean.toFixed(2) + ", median " + median.toFixed(2));
print("mathjs:  mean " + math.mean(offers).toFixed(2) + ", median " + math.median(offers).toFixed(2));
return { offers, mean, median };`,
 viz(r,a){title('Offers (₹ lakh): mean vs median');const ox=60,oy=430,bw=60,mx=Math.max(...r.offers),sc=330/mx;
  r.offers.forEach((v,i)=>{const h=v*sc*ease(a);box(ox+i*(bw+8),oy-h,bw,h,5,v>10?C.coral:C.light);txt(String(v),ox+i*(bw+8)+bw/2,oy-h-6,{size:14,weight:800,align:'center'});});
  [[r.mean,C.coral,'mean '+r.mean.toFixed(2)],[r.median,C.green,'median '+r.median.toFixed(2)]].forEach(([v,c,l],i)=>{const y=oy-v*sc;ctx.setLineDash([6,5]);line(ox-10,y,ox+10*68,y,c,2);ctx.setLineDash([]);txt(l,ox+5,y-6-i*0,{size:18,weight:800,color:c});});},
 ch:{en:'Set TOP_OFFER to 6. Now how far apart are the mean and median? When is it fair to use the mean?',ta:'TOP_OFFER-ஐ 6-ஆ வைங்க. இப்போ mean-க்கும் median-க்கும் எவ்வளவு வித்தியாசம்? எப்போ mean use பண்றது நியாயம்?'},
 ans:{en:'With 6, the mean is about 4.13 and the median 3.9: almost the same. When there are no extreme values, mean and median agree and the mean is fine. When a few values are extreme (salaries, prices, response times), report the median.',ta:'6-ன்னா mean சுமார் 4.13, median 3.9: கிட்டத்தட்ட ஒண்ணு. Extreme values இல்லன்னா mean-உம் median-உம் ஒத்துப்போகும், mean போதும். சில values extreme-ஆ இருந்தா (salaries, விலைகள், response times), median-ஐ report பண்ணுங்க.'}},
{id:'mode',title:{en:'Mode: order the right T-shirts',ta:'Mode: சரியான T-shirts order பண்ணுங்க'},
 why:{en:'Count every size with a plain object, the way a database GROUP BY works. Then let the package find the most common one.',ta:'ஒரு plain object வெச்சு ஒவ்வொரு size-ஐயும் எண்ணுங்க, database GROUP BY மாதிரி. அப்புறம் package அதிகமா வர்றதை கண்டுபிடிக்கட்டும்.'},
 libs:['mathjs'],
 code:`const orders = ['M','L','M','S','M','XL','L','M','L','S','M','M','L','XL','M','S','L','M'];

// count by hand: { S: 3, M: 8, ... }
const counts = {};
for (const size of orders) counts[size] = (counts[size] || 0) + 1;
const byHand = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];

print("counts: " + JSON.stringify(counts));
print("mode by hand: " + byHand);
print("mode by mathjs: " + math.mode(orders));
return { counts, mode: byHand };`,
 viz(r,a){title('T-shirt orders: mode = '+r.mode);const keys=['S','M','L','XL'].filter(k=>r.counts[k]);const mx=Math.max(...Object.values(r.counts));
  keys.forEach((k,i)=>{const h=r.counts[k]/mx*300*ease(a);const x=110+i*160;box(x,420-h,110,h,8,k===r.mode?C.gold:C.light);txt(k,x+55,450,{size:22,weight:800,align:'center'});txt(String(r.counts[k]),x+55,412-h,{size:20,weight:800,align:'center'});});},
 ch:{en:'Add three more "L" orders. What happens when two sizes tie for the most? What should the fest team do?',ta:'இன்னும் மூணு "L" orders சேருங்க. ரெண்டு sizes சமமா அதிகம் இருந்தா என்ன ஆகும்? Fest team என்ன பண்ணணும்?'},
 ans:{en:'With a tie, there are two modes (mathjs returns both). That is a real answer, not an error: print plenty of both sizes. A single "average" would hide this.',ta:'Tie-ன்னா ரெண்டு modes (mathjs ரெண்டையும் தரும்). அது தப்பு இல்ல, உண்மையான answer: ரெண்டு sizes-லயும் நிறைய print பண்ணுங்க. ஒரே ஒரு "average" இதை மறைச்சிடும்.'}},
{id:'spread',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Spread: same mean, different sections',ta:'Spread: ஒரே mean, வேற sections'},
 why:{en:'Compute the standard deviation by hand, then with a package. Surprise: packages disagree by default, and a good engineer knows why.',ta:'Standard deviation-ஐ கையால, அப்புறம் package வெச்சு calculate பண்ணுங்க. ஆச்சரியம்: packages default-ஆ ஒத்துப்போகாது, ஏன்னு ஒரு நல்ல engineer-க்கு தெரியும்.'},
 code:`const A = [55, 57, 58, 59, 60, 60, 61, 62, 63, 65];
const B = [20, 30, 45, 55, 60, 60, 65, 75, 90, 100];

function sd(arr) {                                   // by hand: divide by n
  const m = arr.reduce((s, x) => s + x, 0) / arr.length;
  const avgSq = arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(avgSq);
}
print("Section A: by hand " + sd(A).toFixed(2) + ", mathjs " + math.std(A).toFixed(2) + ", mathjs 'uncorrected' " + math.std(A, 'uncorrected').toFixed(2));
print("Section B: by hand " + sd(B).toFixed(2) + ", mathjs " + math.std(B).toFixed(2) + ", mathjs 'uncorrected' " + math.std(B, 'uncorrected').toFixed(2));
return { A, B, sdA: sd(A), sdB: sd(B) };`,
 viz(r,a){title('Same mean (60), different spread');const ox=60,w=680,X=v=>ox+v/100*w;
  [[r.A,'A',170,C.green,r.sdA],[r.B,'B',360,C.coral,r.sdB]].forEach(([arr,n,y,c,d])=>{txt('Section '+n,ox,y-70,{size:20,weight:800});line(ox,y,ox+w,y,C.light,2);
   ctx.save();ctx.globalAlpha=.25*ease(a);box(X(60-d),y-50,X(60+d)-X(60-d),60,6,c);ctx.restore();const st={};arr.forEach(v=>{st[v]=(st[v]||0)+1;ctx.beginPath();ctx.arc(X(v),y-10-(st[v]-1)*18,8,0,7);ctx.fillStyle=c;ctx.fill();});
   txt('SD '+d.toFixed(1),X(60+d)+8,y-20,{size:18,weight:800,color:c});});},
 ch:{en:'Why does mathjs give 2.94 for Section A when your hand calculation gives 2.79? Which one is "right"?',ta:'Section A-க்கு உங்க கை calculation 2.79, mathjs 2.94 தருது. ஏன்? எது "சரி"?'},
 ans:{en:'mathjs divides by n − 1 by default (the "sample" standard deviation), used when your data is a sample from a bigger population. Dividing by n (the "population" SD) is right when you have everyone, like this whole section. numpy divides by n by default, Python\'s statistics.stdev by n − 1. Always check which one a package uses.',ta:'mathjs default-ஆ n − 1-ஆல வகுக்குது ("sample" SD), உங்க data ஒரு பெரிய population-ஓட sample-ஆ இருக்கும் போது use பண்றது. இந்த முழு section மாதிரி எல்லாரும் இருந்தா n-ஆல வகுக்கிறது ("population" SD) சரி. numpy default-ஆ n-ஆல, Python statistics.stdev n − 1-ஆல வகுக்கும். ஒரு package எதை use பண்ணுதுன்னு எப்பவும் check பண்ணுங்க.'}},
{id:'percentile',libs:['mathjs'],pyPackages:['numpy'],title:{en:'p95: how slow is the slowest 5%?',ta:'p95: slow-ஆன 5% எவ்வளவு slow?'},
 why:{en:'Generate 1,000 app response times, then find the mean, median, p95 and p99. This is exactly what monitoring dashboards at every tech company show.',ta:'1,000 app response times உருவாக்கி, mean, median, p95, p99 கண்டுபிடிங்க. ஒவ்வொரு tech company-லயும் monitoring dashboards இதை தான் காட்டுது.'},
 code:`const N = 1000;
const SLOW_CHANCE = 0.08;   // chance a request hits a slow database: try 0.01, 0.2

const times = [];
for (let i = 0; i < N; i++) {
  const normal = 150 + Math.random() * 150;                       // 150–300 ms
  times.push(Math.random() < SLOW_CHANCE ? normal + 600 + Math.random() * 900 : normal);
}
const sorted = [...times].sort((a, b) => a - b);
const pct = (p) => sorted[Math.min(N - 1, Math.floor(p / 100 * N))];   // by hand

const mean = times.reduce((s, x) => s + x, 0) / N;
print("mean:   " + mean.toFixed(0) + " ms");
print("median: " + pct(50).toFixed(0) + " ms");
print("p95:    " + pct(95).toFixed(0) + " ms   (mathjs: " + math.quantileSeq(times, 0.95).toFixed(0) + ")");
print("p99:    " + pct(99).toFixed(0) + " ms");
return { times, mean, p50: pct(50), p95: pct(95), p99: pct(99) };`,
 viz(r,a){title('Response times (ms)');const ox=40,oy=410,w=720,h=300,mx=1800,bins=40;const c=new Array(bins).fill(0);r.times.forEach(v=>c[Math.min(bins-1,Math.floor(v/mx*bins))]++);const mc=Math.max(...c);
  c.forEach((n,i)=>{const hh=n/mc*h*ease(a);box(ox+i*w/bins,oy-hh,w/bins-2,hh,2,(i+.5)/bins*mx>r.p95?C.coral:C.light);});
  [[r.mean,C.green,'mean'],[r.p95,C.coral,'p95'],[r.p99,'#8B2E1F','p99']].forEach(([v,c2,l],i)=>{const x=ox+v/mx*w;ctx.setLineDash([5,5]);line(x,oy-h-10,x,oy,c2,2);ctx.setLineDash([]);txt(l+' '+Math.round(v),x+4,oy-h+i*22,{size:16,weight:800,color:c2});});},
 ch:{en:'Set SLOW_CHANCE to 0.01, then 0.2. Which number reacts most: the median, the mean or p95? Which would you put on an alert?',ta:'SLOW_CHANCE-ஐ 0.01, அப்புறம் 0.2-ஆ வைங்க. எது அதிகமா மாறுது: median, mean, p95? Alert-ல எதை வைப்பீங்க?'},
 ans:{en:'The median barely moves, because most requests are still fast. The mean moves a little. p95 jumps the moment more than 5% of requests are slow. Alerts go on p95 or p99, because they catch the users who suffer.',ta:'Median கிட்டத்தட்ட நகராது, ஏன்னா பெரும்பாலான requests இன்னும் வேகம். Mean கொஞ்சம் நகரும். 5%-க்கு மேல slow ஆனவுடனே p95 தாவும். Alerts p95, p99-ல தான், ஏன்னா கஷ்டப்படுற users-ஐ அவை தான் பிடிக்கும்.'}},
{id:'bell',title:{en:'Make a bell curve appear',ta:'Bell curve-ஐ உருவாக்குங்க'},
 why:{en:'Simulate a whole batch of students answering a test, count the scores, and watch the bell shape appear from pure randomness.',ta:'ஒரு முழு batch students test எழுதுறதை simulate பண்ணி, scores-ஐ எண்ணி, வெறும் randomness-ல இருந்து bell shape தோன்றுறதை பாருங்க.'},
 code:`const STUDENTS = 2000;
const QUESTIONS = 50;     // try 10, then 200
const CHANCE = 0.6;       // chance of getting each question right

const scores = [];
for (let s = 0; s < STUDENTS; s++) {
  let right = 0;
  for (let q = 0; q < QUESTIONS; q++) if (Math.random() < CHANCE) right++;
  scores.push(right);
}
const mean = scores.reduce((a, b) => a + b, 0) / STUDENTS;
const sd = Math.sqrt(scores.reduce((a, x) => a + (x - mean) ** 2, 0) / STUDENTS);
const within = scores.filter((x) => Math.abs(x - mean) <= sd).length / STUDENTS;
print("mean " + mean.toFixed(1) + ", SD " + sd.toFixed(2));
print("within 1 SD: " + (within * 100).toFixed(1) + "% of students");
return { scores, mean, sd, QUESTIONS };`,
 viz(r,a){title('Scores of '+r.scores.length+' students');const c=new Array(r.QUESTIONS+1).fill(0);r.scores.forEach(s=>c[s]++);const mc=Math.max(...c);const ox=40,oy=420,w=720,h=320;
  c.forEach((n,k)=>{const hh=n/mc*h*ease(a);const inB=Math.abs(k-r.mean)<=r.sd;box(ox+k/(r.QUESTIONS+1)*w,oy-hh,Math.max(1,w/(r.QUESTIONS+1)-2),hh,2,inB?C.green:C.light);});
  txt('green = within 1 SD of the mean',ox,460,{size:16,weight:800,color:C.green});},
 ch:{en:'Try QUESTIONS = 10, then 200. Does the bell keep its shape? What happens to the share of students within 1 SD?',ta:'QUESTIONS = 10, அப்புறம் 200 try பண்ணுங்க. Bell shape அப்படியே இருக்கா? 1 SD-க்குள்ள இருக்கிற students-ஓட பங்கு என்ன ஆகுது?'},
 ans:{en:'The bell keeps its shape (smoother with more questions), and roughly two-thirds stay within 1 SD each time, varying a bit with few questions. Adding up many small random effects produces this shape, which is why it appears so often in real data.',ta:'Bell shape அப்படியே இருக்கு (கேள்விகள் அதிகமானா smooth-ஆ), ஒவ்வொரு தடவையும் கிட்டத்தட்ட மூணுல ரெண்டு பங்கு 1 SD-க்குள்ள, கேள்விகள் கம்மியானா கொஞ்சம் மாறும். நிறைய சின்ன random effects கூடுறதால இந்த shape வருது, அதனால தான் real data-ல இது அடிக்கடி தெரியுது.'}}
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
