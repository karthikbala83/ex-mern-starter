// Code lab experiments (JavaScript + Python) with their chart drawings.
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "coin": "import random\nN = 10   # try 10, then 100, then 100000\n\nheads = 0\nseq = \"\"\nfor i in range(N):\n    is_heads = random.random() < 0.5   # 50% chance\n    if is_heads:\n        heads += 1\n    if N <= 40:\n        seq += \"H \" if is_heads else \"T \"\nif seq:\n    print(\"Tosses:\", seq)\nprint(f\"Heads: {heads / N * 100:.1f}%\")\nresult = {\"heads\": heads, \"N\": N}",
  "dice": "import random\nN = 10000   # number of rolls\n\ncount = {s: 0 for s in range(2, 13)}\nfor i in range(N):\n    d1 = random.randint(1, 6)\n    d2 = random.randint(1, 6)\n    count[d1 + d2] += 1\nprint(f\"Sum 7 came {count[7] / N * 100:.1f}% of the time\")\nprint(f\"Sum 2 came {count[2] / N * 100:.1f}% of the time\")\nresult = {\"count\": count, \"N\": N}",
  "otp": "import random\nDIGITS = 2        # try 2, then 4, then 6\nATTEMPTS = 3      # tries before the account locks\nTRIALS = 20000    # Python in the browser is slower, so fewer thieves\n\ntotal = 10 ** DIGITS\nbroken = 0\nfor t in range(TRIALS):\n    otp = random.randrange(total)\n    for a in range(ATTEMPTS):\n        if random.randrange(total) == otp:\n            broken += 1\n            break\nprint(f\"Possible OTPs: {total:,}\")\nprint(f\"Thieves who got in: {broken} out of {TRIALS:,}\")\nresult = {\"rate\": broken / TRIALS, \"total\": total, \"ATTEMPTS\": ATTEMPTS}",
  "hash": "import random\nSLOTS = 365    # table size (or days in a year)\nKEYS = 23      # keys inserted (or people in a room)\nTRIALS = 3000\n\ncollided = 0\nfor t in range(TRIALS):\n    used = set()\n    for k in range(KEYS):\n        slot = random.randrange(SLOTS)   # our \"hash\"\n        if slot in used:\n            collided += 1\n            break\n        used.add(slot)\nprint(f\"Collision happened in {collided / TRIALS * 100:.1f}% of trials\")\nresult = {\"rate\": collided / TRIALS, \"SLOTS\": SLOTS, \"KEYS\": KEYS}",
  "pi": "import random\nN = 2000   # darts; try 100, then 50000\n\ninside = 0\npoints = []\nfor i in range(N):\n    x, y = random.random(), random.random()\n    hit = x * x + y * y <= 1   # inside the quarter circle?\n    if hit:\n        inside += 1\n    if len(points) < 4000:\n        points.append([x, y, hit])\n# area ratio: quarter circle / square = pi / 4\npi = 4 * inside / N\nprint(f\"Estimated pi = {pi:.4f}   (real pi = 3.1416)\")\nresult = {\"points\": points, \"pi\": pi, \"N\": N}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'coin',title:{en:'Flip a coin',ta:'Coin flip பண்ணுங்க'},
 why:{en:'Small samples lie, big samples tell the truth. This is why a company never trusts 10 users, and why ML needs lots of data.',ta:'சின்ன sample பொய் சொல்லும், பெரிய sample உண்மை சொல்லும். அதனால தான் company 10 users-ஐ வெச்சு முடிவு எடுக்காது, ML-க்கு நிறைய data தேவைப்படுது.'},
 code:`const N = 10;   // try 10, then 100, then 100000

let heads = 0, seq = "";
for (let i = 0; i < N; i++) {
  const isHeads = Math.random() < 0.5;   // 50% chance
  if (isHeads) heads++;
  if (N <= 40) seq += isHeads ? "H " : "T ";
}
if (seq) print("Tosses: " + seq);
print("Heads: " + (heads / N * 100).toFixed(1) + "%");
return { heads, N };`,
 viz(r,a){const h=r.heads/r.N,t=1-h;title('Heads vs Tails after '+r.N.toLocaleString('en-IN')+' tosses');
  const base=430,top=90,bw=180;[[h,'Heads',C.green,180],[t,'Tails',C.coral,440]].forEach(([v,l,c,x])=>{const hh=(base-top)*v*ease(a);box(x,base-hh,bw,hh,8,c);txt(l,x+bw/2,base+32,{size:24,weight:800,align:'center'});txt((v*100).toFixed(1)+'%',x+bw/2,base-hh-12,{size:26,weight:800,align:'center',color:c});});
  const y=base-(base-top)*.5;dash(140,y,680,y,C.gold);txt('50%',690,y+6,{size:20,weight:800,color:'#7A600A'});},
 ch:{en:'Run N = 10 five times and write down the Heads %. Then run N = 100000 five times. Which one stays close to 50%? Why?',ta:'N = 10 வெச்சு ஐந்து தடவை run பண்ணி Heads % எழுதுங்க. அப்புறம் N = 100000 ஐந்து தடவை. எது 50%-க்கு பக்கத்துல இருக்கு? ஏன்?'},
 ans:{en:'With 10 tosses you might see 30% or 70% easily. With 1 lakh tosses you get 49.8% to 50.2%. This is the Law of Large Numbers: the more trials, the closer you get to the true probability.',ta:'10 tosses-ல 30% அல்லது 70% கூட சுலபமா வரும். 1 லட்சம் tosses-ல 49.8%-ல இருந்து 50.2% தான் வரும். இது Law of Large Numbers: trials அதிகமாக ஆக, உண்மையான probability-க்கு பக்கத்துல போவோம்.'}},

{id:'dice',title:{en:'Roll two dice',ta:'ரெண்டு dice உருட்டுங்க'},
 why:{en:'Some results are more likely because more combinations produce them. Board games, game design and network traffic all follow this idea.',ta:'சில results அதிகமா வரும், ஏன்னா அதை உருவாக்க நிறைய combinations இருக்கு. Board games, game design, network traffic எல்லாமே இந்த idea தான்.'},
 code:`const N = 10000;   // number of rolls

const count = {};
for (let s = 2; s <= 12; s++) count[s] = 0;

for (let i = 0; i < N; i++) {
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  count[d1 + d2]++;
}
print("Sum 7 came " + (count[7] / N * 100).toFixed(1) + "% of the time");
print("Sum 2 came " + (count[2] / N * 100).toFixed(1) + "% of the time");
return { count, N };`,
 viz(r,a){title('How often each sum came up ('+r.N.toLocaleString('en-IN')+' rolls)');const ways=[0,0,1,2,3,4,5,6,5,4,3,2,1];
  let mx=0;for(let s=2;s<=12;s++)mx=Math.max(mx,r.count[s]/r.N,ways[s]/36);const base=420,hmax=300,bw=48,gap=14,x0=60;
  for(let s=2;s<=12;s++){const v=r.count[s]/r.N;const hh=hmax*v/mx*ease(a);const x=x0+(s-2)*(bw+gap);box(x,base-hh,bw,hh,6,s===7?C.gold:C.ink);txt(String(s),x+bw/2,base+28,{size:20,weight:800,align:'center'});
   const ey=base-hmax*(ways[s]/36)/mx;ctx.beginPath();ctx.arc(x+bw/2,ey,6,0,7);ctx.fillStyle=C.coral;ctx.fill();}
  txt('Bars: your simulation',470,470,{size:18,weight:700,color:C.ink});ctx.beginPath();ctx.arc(660,464,6,0,7);ctx.fillStyle=C.coral;ctx.fill();txt('Dots: maths (ways ÷ 36)',672,470,{size:18,weight:700,color:C.coral});},
 ch:{en:'Why is 7 the most common sum, and 2 the rarest? List every pair of dice that makes 7.',ta:'ஏன் 7 தான் அதிகமா வருது, 2 ரொம்ப கம்மியா வருது? 7 வர்ற எல்லா dice pairs-ஐயும் list பண்ணுங்க.'},
 ans:{en:'7 comes from six pairs: (1,6) (2,5) (3,4) (4,3) (5,2) (6,1), so 6/36 ≈ 16.7%. 2 comes only from (1,1), so 1/36 ≈ 2.8%. More ways means more likely. The simulation dots match the maths.',ta:'7 ஆறு pairs-ல வரும்: (1,6) (2,5) (3,4) (4,3) (5,2) (6,1), அதனால 6/36 ≈ 16.7%. 2 ஒரே ஒரு pair (1,1)-ல தான், அதனால 1/36 ≈ 2.8%. வழிகள் அதிகம்னா chance அதிகம். Simulation dots, maths-ஓட match ஆகுது.'}},

{id:'otp',title:{en:'Can a thief guess your OTP?',ta:'திருடன் உங்க OTP-ஐ guess பண்ண முடியுமா?'},
 why:{en:'Security engineers choose OTP length and attempt limits using exactly this calculation. Change DIGITS and watch the thief fail.',ta:'Security engineers OTP length-ஐயும், எத்தனை attempts-ன்னும் இதே calculation வெச்சு தான் முடிவு பண்றாங்க. DIGITS-ஐ மாத்தி, திருடன் தோக்குறதை பாருங்க.'},
 code:`const DIGITS = 2;        // try 2, then 4, then 6
const ATTEMPTS = 3;      // tries before the account locks
const TRIALS = 100000;   // how many thieves we simulate

const total = 10 ** DIGITS;
let broken = 0;
for (let t = 0; t < TRIALS; t++) {
  const otp = Math.floor(Math.random() * total);
  for (let a = 0; a < ATTEMPTS; a++) {
    const guess = Math.floor(Math.random() * total);
    if (guess === otp) { broken++; break; }
  }
}
print("Possible OTPs: " + total.toLocaleString("en-IN"));
print("Thieves who got in: " + broken + " out of " + TRIALS.toLocaleString("en-IN"));
return { rate: broken / TRIALS, total, ATTEMPTS };`,
 viz(r,a){title('Chance a thief gets in with '+r.ATTEMPTS+' tries');const theory=Math.min(1,r.ATTEMPTS/r.total);
  const rows=[['Your simulation',r.rate,C.coral],['Maths: attempts ÷ OTPs',theory,C.ink]];
  rows.forEach(([l,v,c],i)=>{const y=160+i*130;txt(l,60,y,{size:24,weight:800});box(60,y+18,680,40,20,'#E7ECF4');const w=680*Math.min(1,v/.05)*ease(a);if(v>0)box(60,y+18,Math.max(40,w),40,20,c);txt((v*100).toPrecision(2)+'%',740,y,{size:24,weight:800,align:'right',color:c});});
  txt('Bar scale: full bar = 5% chance',60,440,{size:18,color:C.muted,weight:700});
  txt(r.rate===0?'Nobody got in. That\'s the point.':'Too many thieves got in!',60,475,{size:24,weight:800,color:r.rate===0?C.green:C.coral});},
 ch:{en:'With DIGITS = 6, why does the simulation usually show 0 thieves even after 1 lakh tries? What would happen if there were no attempt limit?',ta:'DIGITS = 6 வெச்சா, 1 லட்சம் tries-லயும் ஏன் பெரும்பாலும் 0 திருடர்கள் தான் வர்றாங்க? Attempt limit இல்லன்னா என்ன ஆகும்?'},
 ans:{en:'The chance per thief is 3 in 10,00,000. Across 1 lakh thieves you expect only about 0.3 successes, so you usually see 0. Without a limit, a program could try all 10 lakh OTPs and always get in. The lock is what makes the probability tiny.',ta:'ஒரு திருடனுக்கு chance 10 லட்சத்துல 3. 1 லட்சம் திருடர்கள்-ல சராசரியா 0.3 பேர் தான் ஜெயிப்பாங்க, அதனால பெரும்பாலும் 0 வருது. Limit இல்லன்னா, ஒரு program 10 லட்சம் OTP-யையும் try பண்ணி கண்டிப்பா உள்ள போயிடும். Lock தான் probability-ஐ சின்னதா வெச்சிருக்கு.'}},

{id:'hash',title:{en:'Hash collisions (the birthday problem)',ta:'Hash collisions (birthday problem)'},
 why:{en:'Put keys into a hash table and two will land in the same slot much sooner than you expect. Every HashMap, database index and Git commit ID is designed around this.',ta:'Hash table-ல keys போட்டா, ரெண்டு keys ஒரே slot-ல நீங்க நினைக்கிறதை விட ரொம்ப சீக்கிரம் விழும். ஒவ்வொரு HashMap, database index, Git commit ID-உம் இதை மனசுல வெச்சு தான் design பண்றாங்க.'},
 code:`const SLOTS = 365;    // table size (or days in a year)
const KEYS = 23;      // keys inserted (or people in a room)
const TRIALS = 10000;

let collided = 0;
for (let t = 0; t < TRIALS; t++) {
  const used = new Set();
  for (let k = 0; k < KEYS; k++) {
    const slot = Math.floor(Math.random() * SLOTS);   // our "hash"
    if (used.has(slot)) { collided++; break; }
    used.add(slot);
  }
}
print("Collision happened in " + (collided / TRIALS * 100).toFixed(1) + "% of trials");
return { rate: collided / TRIALS, SLOTS, KEYS };`,
 viz(r,a){title('Chance of at least one collision, '+r.SLOTS+' slots');const maxK=Math.max(60,Math.min(r.SLOTS+1,Math.ceil(r.KEYS*1.6)));
  const ox=80,oy=420,w=660,h=300;line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);[0,.5,1].forEach(v=>{txt(v*100+'%',ox-10,oy-v*h+6,{size:16,align:'right',color:C.muted});});
  txt('0',ox,oy+24,{size:16,align:'center',color:C.muted});txt(String(maxK),ox+w,oy+24,{size:16,align:'center',color:C.muted});txt('keys inserted',ox+w,oy+48,{size:16,align:'right',color:C.muted});
  const th=k=>{let q=1;for(let i=0;i<k;i++)q*=(r.SLOTS-i)/r.SLOTS;return 1-q;};ctx.beginPath();const lim=maxK*ease(a);for(let k=0;k<=lim;k++){const x=ox+k/maxK*w,y=oy-th(k)*h;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  if(a>.8){const x=ox+Math.min(r.KEYS,maxK)/maxK*w,y=oy-r.rate*h;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fillStyle=C.gold;ctx.fill();txt('You: '+r.KEYS+' keys → '+(r.rate*100).toFixed(1)+'%',x>520?x-12:x+14,y-14,{size:20,weight:800,color:'#7A600A',align:x>520?'right':'left'});}
  txt('Line: maths. Dot: your simulation.',ox,480,{size:17,color:C.muted,weight:700});},
 ch:{en:'How many keys does it take to reach a 50% collision chance in a 365-slot table? Try SLOTS = 1000. Does it scale as you expected?',ta:'365-slot table-ல 50% collision chance வர எத்தனை keys வேணும்? SLOTS = 1000 try பண்ணுங்க. நீங்க expect பண்ண மாதிரி வருதா?'},
 ans:{en:'About 23 keys for 365 slots, and roughly 38 for 1000 slots. It grows like the square root of the table size, not linearly. That is why real hash tables resize early and why hash outputs (like SHA-256) are so long.',ta:'365 slots-க்கு சுமார் 23 keys, 1000 slots-க்கு சுமார் 38. இது table size-ஓட square root மாதிரி வளருது, linear-ஆ இல்ல. அதனால தான் real hash tables சீக்கிரமே resize ஆகுது, SHA-256 மாதிரி hash outputs ரொம்ப நீளமா இருக்கு.'}},

{id:'pi',title:{en:'Calculate π by throwing random darts',ta:'Random darts வீசி π-ஐ கண்டுபிடிங்க'},
 why:{en:'Randomness can compute real answers. This trick, called Monte Carlo simulation, is used in finance, weather models, games and AI.',ta:'Randomness வெச்சே real answers கண்டுபிடிக்கலாம். இந்த trick-க்கு பேர் Monte Carlo simulation. Finance, weather models, games, AI எல்லாத்துலயும் use ஆகுது.'},
 code:`const N = 2000;   // darts; try 100, then 200000

let inside = 0;
const points = [];
for (let i = 0; i < N; i++) {
  const x = Math.random(), y = Math.random();
  const hit = x * x + y * y <= 1;   // inside the quarter circle?
  if (hit) inside++;
  if (points.length < 4000) points.push([x, y, hit]);
}
// area ratio: quarter circle / square = π / 4
const pi = 4 * inside / N;
print("Estimated π = " + pi.toFixed(4) + "   (real π = 3.1416)");
return { points, pi, N };`,
 viz(r,a){title('π ≈ '+r.pi.toFixed(4)+' from '+r.N.toLocaleString('en-IN')+' darts');const s=360,ox=60,oy=80;box(ox,oy,s,s,0,'#FFFFFF',C.ink,2);
  ctx.beginPath();ctx.moveTo(ox,oy+s);ctx.arc(ox,oy+s,s,-Math.PI/2,0);ctx.closePath();ctx.fillStyle='rgba(84,123,92,.08)';ctx.fill();ctx.strokeStyle=C.green;ctx.lineWidth=2;ctx.stroke();
  const n=Math.floor(r.points.length*clamp(a*1.1));for(let i=0;i<n;i++){const [x,y,h]=r.points[i];ctx.fillStyle=h?C.green:C.coral;ctx.fillRect(ox+x*s-1.5,oy+s-y*s-1.5,3,3);}
  txt('Green: inside the circle',460,160,{size:22,weight:800,color:C.green});txt('Red: outside',460,200,{size:22,weight:800,color:C.coral});
  txt('π ≈ 4 × green ÷ all',460,280,{size:26,weight:800});txt('Error: '+Math.abs(r.pi-Math.PI).toFixed(4),460,330,{size:22,weight:700,color:C.muted});},
 ch:{en:'Why does 4 × (inside ÷ total) give π? Hint: compare the area of the quarter circle with the area of the square.',ta:'4 × (inside ÷ total) ஏன் π தருது? Hint: quarter circle area-வையும் square area-வையும் compare பண்ணுங்க.'},
 ans:{en:'The square has area 1. The quarter circle of radius 1 has area π/4. A random dart lands inside with probability (π/4) ÷ 1, so inside ÷ total ≈ π/4, and multiplying by 4 gives π. More darts, better estimate.',ta:'Square area 1. Radius 1 உள்ள quarter circle area π/4. Random dart உள்ள விழ probability (π/4) ÷ 1, அதனால inside ÷ total ≈ π/4. 4-ஆல பெருக்கினா π. Darts அதிகமானா, answer இன்னும் accurate-ஆ வரும்.'}}
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
