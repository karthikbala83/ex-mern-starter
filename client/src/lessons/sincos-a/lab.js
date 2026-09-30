// sin & cos Part A code lab: experiments (JavaScript + Python) with their chart drawings.
// Experiments may list `libs` (JS packages injected by CodeLab: mathjs → `math`, geolib → `geolib`)
// and `pyPackages` (loaded into Pyodide before running: numpy via loadPackage, geopy via micropip).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "zone": "import math\nPOINTS = 6        # try 6, then 12, then 64\nR = 1            # zone radius\nCX, CY = 0, 0    # zone centre\n\npts = []\nfor i in range(POINTS):\n    theta = 2 * math.pi * i / POINTS\n    pts.append([CX + R * math.cos(theta), CY + R * math.sin(theta)])\n\n# Is the player inside? Pythagoras.\nplayer = [0.6, 0.5]\nd = math.hypot(player[0] - CX, player[1] - CY)\nprint(\"Points drawn:\", POINTS)\nprint(f\"Player distance: {d:.2f}\", \"→ inside, safe\" if d < R else \"→ outside, taking damage\")\nresult = {\"pts\": pts, \"player\": player, \"R\": R, \"inside\": d < R}",
  "throw": "import math\nSPEED = 20    # metres per second\nG = 9.8       # gravity\n\nthrows = []\nfor angle in range(15, 76, 15):\n    vx = SPEED * math.cos(math.radians(angle))   # forward speed\n    vy = SPEED * math.sin(math.radians(angle))   # upward speed\n    time = 2 * vy / G                            # time in the air\n    rng = vx * time                              # distance travelled\n    throws.append({\"angle\": angle, \"range\": rng, \"height\": vy * vy / (2 * G)})\n    print(f\"{angle}° → {rng:.1f} m\")\nresult = {\"throws\": throws}",
  "radians": "import math\nimport numpy as np\nANGLE = 90   # try 30, 45, 180\n\nplain = math.sin(ANGLE)                          # ANGLE radians, not degrees: the bug\nconverted = math.sin(math.radians(ANGLE))        # convert first: the fix\nwith_package = float(np.sin(np.deg2rad(ANGLE)))  # numpy: used across data science\n\nprint(f\"math.sin({ANGLE})              = {plain:.4f}\")\nprint(f\"math.sin(math.radians({ANGLE})) = {converted:.4f}\")\nprint(f\"np.sin(np.deg2rad({ANGLE}))    = {with_package:.4f}\")\nresult = {\"plain\": plain, \"converted\": converted, \"withPackage\": with_package, \"ANGLE\": ANGLE}",
  "mysin": "TERMS = 2      # try 1, 2, 3, then 6\nimport math\n\n# sin x = x − x³/3! + x⁵/5! − x⁷/7! + ...\ndef my_sin(x):\n    total, term = 0, x\n    for n in range(TERMS):\n        total += term\n        term *= (-x * x) / ((2 * n + 2) * (2 * n + 3))   # next term from the previous one\n    return total\n\nfor deg in [0, 30, 45, 60, 90]:\n    x = math.radians(deg)                                  # radians!\n    print(f\"{deg}°  mine: {my_sin(x):.6f}   math.sin: {math.sin(x):.6f}\")\n\ncurve = [[x / 20, my_sin(x / 20), math.sin(x / 20)] for x in range(-80, 81)]\nresult = {\"curve\": curve, \"TERMS\": TERMS}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'zone',title:{en:'Draw the safe zone',ta:'Safe zone-ஐ வரைங்க'},
 why:{en:'Every circle on a screen is really many straight lines placed with cos and sin. Change POINTS and watch a hexagon turn into a circle.',ta:'Screen-ல தெரியுற ஒவ்வொரு circle-உம் cos, sin வெச்சு வெச்ச நிறைய straight lines தான். POINTS-ஐ மாத்தி, hexagon circle-ஆ மாறுறதை பாருங்க.'},
 code:`const POINTS = 6;        // try 6, then 12, then 64
const R = 1;             // zone radius
const CX = 0, CY = 0;    // zone centre

const pts = [];
for (let i = 0; i < POINTS; i++) {
  const theta = (2 * Math.PI * i) / POINTS;
  pts.push([CX + R * Math.cos(theta), CY + R * Math.sin(theta)]);
}

// Is the player inside? Pythagoras.
const player = [0.6, 0.5];
const d = Math.hypot(player[0] - CX, player[1] - CY);
print("Points drawn: " + POINTS);
print("Player distance: " + d.toFixed(2) + (d < R ? "  → inside, safe" : "  → outside, taking damage"));
return { pts, player, R, inside: d < R };`,
 viz(r,a){title('Safe zone with '+r.pts.length+' points');const cx=400,cy=270,s=170;
  const n=Math.max(1,Math.ceil(r.pts.length*ease(a)));ctx.beginPath();r.pts.slice(0,n).forEach(([x,y],i)=>{const X=cx+x*s,Y=cy-y*s;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});if(n===r.pts.length)ctx.closePath();
  ctx.fillStyle='rgba(84,123,92,.10)';ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
  r.pts.slice(0,n).forEach(([x,y])=>{ctx.beginPath();ctx.arc(cx+x*s,cy-y*s,r.pts.length>24?3:7,0,7);ctx.fillStyle=C.gold;ctx.fill();});
  const [px,py]=r.player;ctx.beginPath();ctx.arc(cx+px*s,cy-py*s,11,0,7);ctx.fillStyle=r.inside?C.green:C.coral;ctx.fill();
  ctx.save();ctx.setLineDash([6,6]);line(cx,cy,cx+px*s,cy-py*s,r.inside?C.green:C.coral,2);ctx.restore();
  txt(r.inside?'inside: safe':'outside: damage',cx+px*s+16,cy-py*s-12,{size:20,weight:800,color:r.inside?C.green:C.coral});},
 ch:{en:'How many points until it looks like a circle? Move the player to [0.9, 0.5]. Inside or outside? Check with Pythagoras by hand first.',ta:'எத்தனை points-ல அது circle மாதிரி தெரியுது? Player-ஐ [0.9, 0.5]-க்கு மாத்துங்க. உள்ளயா வெளியயா? முதல்ல Pythagoras வெச்சு கையால check பண்ணுங்க.'},
 ans:{en:'Around 24 to 32 points already looks round at this size; big on-screen circles need more. For (0.9, 0.5): d = √(0.81 + 0.25) = √1.06 ≈ 1.03, just outside a zone of radius 1.',ta:'இந்த size-க்கு 24-ல இருந்து 32 points-லயே round-ஆ தெரியும்; பெரிய circles-க்கு இன்னும் நிறைய வேணும். (0.9, 0.5)-க்கு d = √(0.81 + 0.25) = √1.06 ≈ 1.03, radius 1 zone-க்கு கொஞ்சம் வெளிய.'}},

{id:'throw',title:{en:'The cricket throw: find the best angle',ta:'Cricket throw: best angle எது?'},
 why:{en:'A fielder\'s throw splits into v·cos θ forward and v·sin θ upward. Physics does the rest. Engineers use the same split for sprinklers, fountains and rockets.',ta:'Fielder-ஓட throw முன்னாடி v·cos θ, மேல v·sin θ-ன்னு பிரியுது. மீதியை physics பார்த்துக்கும். Sprinklers, fountains, rockets-க்கும் engineers இதே மாதிரி பிரிப்பாங்க.'},
 code:`const SPEED = 20;     // metres per second
const G = 9.8;        // gravity
const toRad = (deg) => deg * Math.PI / 180;

const throws = [];
for (let angle = 15; angle <= 75; angle += 15) {
  const vx = SPEED * Math.cos(toRad(angle));   // forward speed
  const vy = SPEED * Math.sin(toRad(angle));   // upward speed
  const time = 2 * vy / G;                     // time in the air
  const range = vx * time;                     // distance travelled
  throws.push({ angle, range, height: vy * vy / (2 * G) });
  print(angle + "° → " + range.toFixed(1) + " m");
}
return { throws };`,
 viz(r,a){title('Where each throw lands');const gx=50,gy=430;line(30,gy,780,gy,C.ink,3);const mx=Math.max(...r.throws.map(t=>t.range))||1;const sc=680/mx;
  const best=r.throws.reduce((b,t)=>t.range>b.range?t:b,r.throws[0]);
  r.throws.forEach(t=>{const R=t.range*sc,Hh=t.height*sc;const isB=t===best;ctx.beginPath();for(let k=0;k<=ease(a);k+=.01){const x=gx+R*k,y=gy-4*Hh*k*(1-k);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}
   ctx.strokeStyle=isB?C.gold:'#9DB3D6';ctx.lineWidth=isB?5:3;ctx.stroke();});
  if(a>.9){const groups={};r.throws.forEach(t=>{const k=Math.round(t.range*10);(groups[k]=groups[k]||[]).push(t);});
   Object.values(groups).forEach(g=>{const isB=g.includes(best);txt(g.map(t=>t.angle+'°').join(' & '),gx+g[0].range*sc,gy+26,{size:isB?22:17,weight:800,align:'center',color:isB?'#7A600A':C.muted});});}
  txt('Best: '+best.angle+'° → '+best.range.toFixed(1)+' m',500,90,{size:24,weight:800,color:'#7A600A'});},
 ch:{en:'Which pairs of angles land in exactly the same place? Why?',ta:'எந்த ரெண்டு angles சரியா ஒரே இடத்துல விழுது? ஏன்?'},
 ans:{en:'15° and 75°, and 30° and 60°. Range depends on sin(2θ), and sin(30°) = sin(150°), sin(60°) = sin(120°). Any two angles that add up to 90° give the same range. 45° sits in the middle, where sin(2θ) = 1, so it goes farthest.',ta:'15°, 75° ஒரு pair; 30°, 60° இன்னொரு pair. Range sin(2θ)-ஐ பொறுத்தது. sin(30°) = sin(150°), sin(60°) = sin(120°). கூட்டினா 90° வர்ற ரெண்டு angles ஒரே range தரும். 45° நடுவுல இருக்கு, அங்க sin(2θ) = 1, அதனால அதிக தூரம் போகுது.'}},

{id:'radians',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Degrees or radians? Three ways to get sin 90°',ta:'Degrees-ஆ radians-ஆ? sin 90°-க்கு மூணு வழி'},
 why:{en:'Machines work in radians. See the classic bug, the manual fix, and how packages like mathjs (JavaScript) and numpy (Python) handle degrees for you.',ta:'Machines radians-ல வேலை செய்யும். Classic bug, manual fix, அப்புறம் mathjs (JavaScript), numpy (Python) மாதிரி packages degrees-ஐ எப்படி handle பண்ணுதுன்னு பாருங்க.'},
 code:`const ANGLE = 90;   // try 30, 45, 180

const plain = Math.sin(ANGLE);                       // ANGLE radians, not degrees: the bug
const converted = Math.sin(ANGLE * Math.PI / 180);   // convert first: the fix
const withPackage = math.sin(math.unit(ANGLE, 'deg'));   // mathjs understands degrees

print("Math.sin(" + ANGLE + ")           = " + plain.toFixed(4));
print("Math.sin(" + ANGLE + " × π / 180) = " + converted.toFixed(4));
print("math.sin(" + ANGLE + " deg)       = " + withPackage.toFixed(4));
return { plain, converted, withPackage, ANGLE };`,
 viz(r,a){title('sin '+r.ANGLE+'°: three ways');const rows=[['Math.sin(ANGLE)  ✗ radians!',r.plain,C.coral],['converted to radians  ✓',r.converted,C.green],['mathjs with degrees  ✓',r.withPackage,C.gold]];
  const ox=400;line(ox,70,ox,420,C.ink,2);txt('0',ox,445,{size:16,align:'center',color:C.muted});txt('1',ox+300,445,{size:16,align:'center',color:C.muted});txt('−1',ox-300,445,{size:16,align:'center',color:C.muted});
  rows.forEach(([l,v,c],i)=>{const y=100+i*110;txt(l,40,y,{size:22,weight:800});const w=300*v*ease(a);box(Math.min(ox,ox+w),y+18,Math.abs(w)||2,34,8,c);txt(v.toFixed(4),ox+(v>=0?w+10:w-10),y+44,{size:20,weight:800,align:v>=0?'left':'right',color:c});});},
 ch:{en:'Set ANGLE to 30. Which line is wrong and by how much? Why can a bug like this hide in a real game for weeks?',ta:'ANGLE-ஐ 30-ஆ மாத்துங்க. எந்த line தப்பு, எவ்வளவு? இந்த மாதிரி bug ஒரு real game-ல ஏன் வாரக்கணக்குல ஒளிஞ்சிருக்க முடியும்?'},
 ans:{en:'Math.sin(30) gives −0.988 instead of 0.5: completely wrong, even the sign. Such bugs hide because the program never crashes; it just moves things in slightly strange directions. Using a package that takes explicit units, or converting in one helper function, prevents it.',ta:'Math.sin(30) 0.5-க்கு பதிலா −0.988 தருது: sign கூட தப்பு. Program crash ஆகாது, பொருட்கள் கொஞ்சம் விசித்திரமான திசையில நகரும், அதனால இந்த bugs ஒளிஞ்சிருக்கும். Units-ஐ தெளிவா எடுத்துக்கிற package, இல்லன்னா ஒரே helper function-ல convert பண்றது இதை தடுக்கும்.'}},

{id:'mysin',title:{en:'Build your own Math.sin',ta:'உங்க சொந்த Math.sin-ஐ build பண்ணுங்க'},
 why:{en:'Math.sin has no lookup table: it adds up a series found by Madhava of Sangamagrama in the 1300s. Add terms one by one and watch your version match the real one.',ta:'Math.sin-க்கு lookup table இல்ல: 1300-களில Sangamagrama Madhava கண்டுபிடிச்ச series-ஐ கூட்டுது. ஒவ்வொரு term-ஆ சேர்த்து, உங்க version உண்மையானதோட match ஆகுறதை பாருங்க.'},
 code:`const TERMS = 2;     // try 1, 2, 3, then 6

// sin x = x − x³/3! + x⁵/5! − x⁷/7! + ...
function mySin(x) {
  let sum = 0, term = x;
  for (let n = 0; n < TERMS; n++) {
    sum += term;
    term *= (-x * x) / ((2 * n + 2) * (2 * n + 3));   // next term from the previous one
  }
  return sum;
}

for (const deg of [0, 30, 45, 60, 90]) {
  const x = deg * Math.PI / 180;                     // radians!
  print(deg + "°  mine: " + mySin(x).toFixed(6) + "   Math.sin: " + Math.sin(x).toFixed(6));
}
const curve = [];
for (let x = -4; x <= 4; x += 0.05) curve.push([x, mySin(x), Math.sin(x)]);
return { curve, TERMS };`,
 viz(r,a){title('Your sin (coral) vs Math.sin (gold), '+r.TERMS+' term'+(r.TERMS>1?'s':''));const ox=400,oy=270,sx=90,sy=120;const Y=v=>oy-Math.max(-1.9,Math.min(1.9,v))*sy;
  line(ox-4*sx,oy,ox+4*sx,oy,C.light,2);line(ox,oy-1.9*sy,ox,oy+1.9*sy,C.light,2);
  [[2,C.gold,6],[1,C.coral,3]].forEach(([k,c,w])=>{ctx.beginPath();const n=Math.ceil(r.curve.length*ease(a));r.curve.slice(0,n).forEach((pt,i)=>{const X=ox+pt[0]*sx,Yv=Y(pt[k]);i?ctx.lineTo(X,Yv):ctx.moveTo(X,Yv);});ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();});
  txt('−π',ox-Math.PI*sx,oy+24,{size:16,weight:800,align:'center',color:C.muted});txt('π',ox+Math.PI*sx,oy+24,{size:16,weight:800,align:'center',color:C.muted});},
 ch:{en:'How many terms until 90° matches Math.sin to 6 decimals? Now try x = 20 (radians). Why does your version go wrong there?',ta:'எத்தனை terms-ல 90° Math.sin-ஓட 6 decimals வரை match ஆகுது? இப்போ x = 20 (radians) try பண்ணுங்க. அங்க ஏன் உங்க version தப்பா போகுது?'},
 ans:{en:'About 6 terms for angles up to 90°. For a big x like 20, the terms grow huge before they shrink, so a few terms are nowhere near enough. That is why real libraries first reduce the angle into a small range (sin repeats every 2π), then use a short polynomial.',ta:'90° வரைக்கும் சுமார் 6 terms. 20 மாதிரி பெரிய x-க்கு, terms சுருங்குறதுக்கு முன்னாடி ரொம்ப பெருசா வளருது, அதனால சில terms போதாது. அதனால தான் real libraries முதல்ல angle-ஐ சின்ன range-க்குள்ள கொண்டு வருது (sin ஒவ்வொரு 2π-க்கும் திரும்ப வருது), அப்புறம் ஒரு சின்ன polynomial use பண்ணுது.'}}
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
