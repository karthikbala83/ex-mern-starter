// Vectors & matrices code lab: experiments (JavaScript + Python) with their chart drawings.
// `libs` = JS packages injected by CodeLab (mathjs → `math`); `pyPackages` = loaded into Pyodide first (numpy).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "vectors": "import math\nA = [3, 1]\nB = [1, 3]\nK = 2            # stretch factor: try -1 (it flips!)\n\nadd = lambda u, v: [x + y for x, y in zip(u, v)]\nscale = lambda k, u: [k * x for x in u]\nlength = lambda u: math.hypot(*u)          # Pythagoras for any number of parts\n\ns, stretched = add(A, B), scale(K, A)\nprint(f\"A + B = {s}, length {length(s):.2f}\")\nprint(f\"{K} × A = {stretched}, length {length(stretched):.2f}\")\nresult = {\"A\": A, \"B\": B, \"sum\": s, \"stretched\": stretched}",
  "rotate": "import math\nimport numpy as np\nANGLE = 45     # degrees, anticlockwise: try 90, 180, -30\nshape = [[-1, -1], [1, -1], [1, 0.6], [0, 1.5], [-1, 0.6]]   # a little building\n\nr = math.radians(ANGLE)\nby_hand = [[x * math.cos(r) - y * math.sin(r), x * math.sin(r) + y * math.cos(r)] for x, y in shape]\n\nR = np.array([[math.cos(r), -math.sin(r)], [math.sin(r), math.cos(r)]])\nby_matrix = (R @ np.array(shape).T).T.tolist()     # rotate every corner in one go\n\nprint(\"first corner by hand: \", [round(v, 3) for v in by_hand[0]])\nprint(\"first corner by numpy:\", [round(v, 3) for v in by_matrix[0]])\nresult = {\"shape\": shape, \"rotated\": by_matrix, \"ANGLE\": ANGLE}",
  "order": "import math\nimport numpy as np\nANGLE = 45\nSTRETCH_X = 1.8     # try 1: then order stops mattering. Why?\n\nr = math.radians(ANGLE)\nR = np.array([[math.cos(r), -math.sin(r)], [math.sin(r), math.cos(r)]])\nS = np.array([[STRETCH_X, 0], [0, 1]])\n\nrotate_then_stretch = S @ R     # the RIGHT-most matrix acts first\nstretch_then_rotate = R @ S\n\nshape = np.array([[-1, -1], [1, -1], [1, 0.6], [0, 1.5], [-1, 0.6]]).T\nprint(\"rotate → stretch:\", np.round(rotate_then_stretch, 2).tolist())\nprint(\"stretch → rotate:\", np.round(stretch_then_rotate, 2).tolist())\nresult = {\"a\": (rotate_then_stretch @ shape).T.tolist(), \"b\": (stretch_then_rotate @ shape).T.tolist()}",
  "image": "import numpy as np\nFILTER = \"blur\"    # try \"bright\", \"contrast\", \"invert\", \"blur\"\nimg = np.array([\n    [ 40,  40, 200, 200, 200, 200,  40,  40],\n    [ 40, 200, 200, 200, 200, 200, 200,  40],\n    [200, 200,  30, 200, 200,  30, 200, 200],\n    [200, 200, 200, 200, 200, 200, 200, 200],\n    [200,  60, 200, 200, 200, 200,  60, 200],\n    [200, 200,  60,  60,  60,  60, 200, 200],\n    [ 40, 200, 200, 200, 200, 200, 200,  40],\n    [ 40,  40, 200, 200, 200, 200,  40,  40],\n], dtype=float)\n\nif FILTER == \"bright\":\n    out = img + 60\nelif FILTER == \"contrast\":\n    out = (img - 128) * 1.8 + 128\nelif FILTER == \"invert\":\n    out = 255 - img\nelse:                                   # blur: average of the 3 × 3 neighbourhood\n    p = np.pad(img, 1, mode=\"edge\")     # edges repeat\n    out = sum(p[1 + a:9 + a, 1 + b:9 + b] for a in (-1, 0, 1) for b in (-1, 0, 1)) / 9\nout = np.clip(np.round(out), 0, 255).astype(int)\nprint(f\"{FILTER}: top-left pixel {int(img[0, 0])} → {out[0, 0]}, eye pixel {int(img[2, 2])} → {out[2, 2]}\")\nresult = {\"img\": img.astype(int).tolist(), \"out\": out.tolist(), \"FILTER\": FILTER}",
  "similar": "import numpy as np\n#        coding music sports art\nME    = [5,     1,    0,     4]      # change your own interests (0–5)\nCLUBS = {\n    \"Coding club\":   [5, 0, 0, 1],\n    \"Music club\":    [0, 5, 0, 2],\n    \"Sports club\":   [0, 1, 5, 0],\n    \"Design club\":   [3, 1, 0, 5],\n}\ncosine = lambda a, b: float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nscores = sorted(({\"name\": n, \"score\": cosine(ME, v)} for n, v in CLUBS.items()), key=lambda s: -s[\"score\"])\nfor s in scores:\n    print(f\"{s['name']:<12} {s['score']:.3f}\")\nprint(\"Recommended:\", scores[0][\"name\"])\nresult = {\"scores\": scores}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'vectors',title:{en:'Vectors: add, stretch, measure',ta:'Vectors: கூட்டு, நீட்டு, அளவு'},
 why:{en:'The three moves every game makes each frame: add a step, stretch by speed, measure the distance with Pythagoras.',ta:'ஒவ்வொரு game-உம் ஒவ்வொரு frame-லயும் பண்ற மூணு வேலைகள்: ஒரு step கூட்டுறது, speed-ஆல நீட்டுறது, Pythagoras வெச்சு தூரம் அளக்கிறது.'},
 code:`const A = [3, 1];
const B = [1, 3];
const K = 2;            // stretch factor: try -1 (it flips!)

const add = (u, v) => u.map((x, i) => x + v[i]);
const scale = (k, u) => u.map((x) => k * x);
const length = (u) => Math.hypot(...u);           // Pythagoras for any number of parts

const sum = add(A, B), stretched = scale(K, A);
print("A + B = [" + sum + "], length " + length(sum).toFixed(2));
print(K + " × A = [" + stretched + "], length " + length(stretched).toFixed(2));
return { A, B, sum, stretched };`,
 viz(r,a){title('A (green) + B (gold) = sum (coral)');const cx=200,cy=400,s=45;const V=(u,col,x0=cx,y0=cy)=>{const e=ease(a);line(x0,y0,x0+u[0]*s*e,y0-u[1]*s*e,col,4);ctx.beginPath();ctx.arc(x0+u[0]*s*e,y0-u[1]*s*e,6,0,7);ctx.fillStyle=col;ctx.fill();};
  line(40,cy,760,cy,C.light,1);line(cx,40,cx,470,C.light,1);V(r.A,C.green);V(r.B,C.gold,cx+r.A[0]*s,cy-r.A[1]*s);V(r.sum,C.coral);V(r.stretched,C.ink,cx,cy+0.01);txt('navy = stretched A',560,450,{size:16,weight:800});},
 ch:{en:'Set K = −1. What happens to the arrow? Where would a game use a negative stretch?',ta:'K = −1 வைங்க. Arrow என்ன ஆகுது? ஒரு game எங்க negative stretch use பண்ணும்?'},
 ans:{en:'The arrow flips to point the opposite way, with the same length. Games use it to bounce: when a ball hits a wall, its speed vector is flipped in one direction.',ta:'Arrow அதே நீளத்தோட எதிர் திசையில திரும்புது. Games bounce-க்கு இதை use பண்ணும்: ball சுவர்ல பட்டா, அதோட speed vector ஒரு திசையில flip ஆகுது.'}},
{id:'rotate',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Rotate a shape with the rotation matrix',ta:'Rotation matrix வெச்சு ஒரு shape-ஐ சுழற்றுங்க'},
 why:{en:'Rotate every corner of a shape by hand with cos and sin, then with a real matrix multiply from mathjs or numpy. Same answer, the second is how 3D engines do it.',ta:'ஒரு shape-ஓட ஒவ்வொரு மூலையையும் cos, sin வெச்சு கையால சுழற்றி, அப்புறம் mathjs அல்லது numpy-ல real matrix multiply வெச்சு பாருங்க. அதே answer, ரெண்டாவது தான் 3D engines பண்ற முறை.'},
 code:`const ANGLE = 45;     // degrees, anticlockwise: try 90, 180, -30
const shape = [[-1, -1], [1, -1], [1, 0.6], [0, 1.5], [-1, 0.6]];   // a little building

const r = ANGLE * Math.PI / 180;
// by hand: x' = x·cos − y·sin,  y' = x·sin + y·cos
const byHand = shape.map(([x, y]) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]);

// with a matrix: R × point, for every corner
const R = math.matrix([[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]);
const byMatrix = shape.map((p) => math.multiply(R, p).toArray());

print("first corner by hand:   [" + byHand[0].map((v) => v.toFixed(3)) + "]");
print("first corner by mathjs: [" + byMatrix[0].map((v) => v.toFixed(3)) + "]");
return { shape, rotated: byMatrix, ANGLE };`,
 viz(r,a){title('Rotated by '+r.ANGLE+'°');const cx=400,cy=270,s=85;line(40,cy,760,cy,C.light,1);line(cx,30,cx,470,C.light,1);
  const poly=(pts,col,fill)=>{ctx.beginPath();pts.forEach(([x,y],i)=>{i?ctx.lineTo(cx+x*s,cy-y*s):ctx.moveTo(cx+x*s,cy-y*s);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();};
  poly(r.shape,C.light,'rgba(203,215,234,.3)');const e=ease(a),ang=r.ANGLE*Math.PI/180*e;poly(r.shape.map(([x,y])=>[x*Math.cos(ang)-y*Math.sin(ang),x*Math.sin(ang)+y*Math.cos(ang)]),C.coral,'rgba(200,85,61,.15)');},
 ch:{en:'Rotate by 90° twice (change the code to rotate the result again). What single rotation gives the same answer?',ta:'90° ரெண்டு தடவை சுழற்றுங்க (result-ஐ மறுபடியும் சுழற்ற code-ஐ மாத்துங்க). எந்த ஒரே rotation அதே answer தரும்?'},
 ans:{en:'180°. Rotations add up: rotating by a then by b equals rotating by a + b. In matrix terms R(90) × R(90) = R(180), which is why game engines combine all the moves into one matrix before drawing.',ta:'180°. Rotations கூடும்: a, அப்புறம் b சுழற்றுறது a + b சுழற்றுறதுக்கு சமம். Matrix-ல R(90) × R(90) = R(180), அதனால தான் game engines வரையுறதுக்கு முன்னாடி எல்லா moves-ஐயும் ஒரே matrix-ஆ சேர்க்குது.'}},
{id:'order',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Does order matter? Rotate vs stretch',ta:'Order முக்கியமா? Rotate vs stretch'},
 why:{en:'Combine two moves into one matrix in both orders and compare. This is the classic surprise of matrices.',ta:'ரெண்டு moves-ஐ ரெண்டு order-லயும் ஒரே matrix-ஆ சேர்த்து compare பண்ணுங்க. இது matrices-ஓட classic ஆச்சரியம்.'},
 code:`const ANGLE = 45;
const STRETCH_X = 1.8;     // try 1: then order stops mattering. Why?

const r = ANGLE * Math.PI / 180;
const R = math.matrix([[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]);
const S = math.matrix([[STRETCH_X, 0], [0, 1]]);

const rotateThenStretch = math.multiply(S, R);   // the RIGHT-most matrix acts first
const stretchThenRotate = math.multiply(R, S);

const shape = [[-1, -1], [1, -1], [1, 0.6], [0, 1.5], [-1, 0.6]];
const a = shape.map((p) => math.multiply(rotateThenStretch, p).toArray());
const b = shape.map((p) => math.multiply(stretchThenRotate, p).toArray());
print("rotate → stretch: " + JSON.stringify(math.round(rotateThenStretch, 2).toArray()));
print("stretch → rotate: " + JSON.stringify(math.round(stretchThenRotate, 2).toArray()));
return { a, b };`,
 viz(r,a){title('Navy: rotate → stretch   Coral: stretch → rotate');const poly=(pts,cx,col)=>{ctx.beginPath();pts.forEach(([x,y],i)=>{const X=cx+x*70*ease(a),Y=260-y*70*ease(a);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.closePath();ctx.fillStyle='rgba(201,162,31,.15)';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();};
  poly(r.a,220,C.ink);poly(r.b,580,C.coral);},
 ch:{en:'Set STRETCH_X = 1. Do the two orders still differ? Why not?',ta:'STRETCH_X = 1 வைங்க. ரெண்டு orders இன்னும் வேறுபடுதா? ஏன் இல்ல?'},
 ans:{en:'They become identical. A stretch of 1 is no stretch at all, and a uniform scale (same in x and y) commutes with rotation. Only uneven stretches care about order, which is why 3D engines are careful to apply scale, then rotate, then move, in a fixed order.',ta:'ரெண்டும் ஒண்ணாகிடும். 1 stretch-ன்னா stretch-ஏ இல்ல, x, y ரெண்டுலயும் சமமான scale rotation-ஓட commute ஆகும். சமமில்லாத stretches மட்டும் தான் order-ஐ பொருட்படுத்தும், அதனால தான் 3D engines scale, rotate, move-ஐ ஒரு fixed order-ல கவனமா apply பண்ணுது.'}},
{id:'image',pyPackages:['numpy'],title:{en:'Photo filters are matrix maths',ta:'Photo filters-ன்னா matrix maths'},
 why:{en:'An 8 × 8 photo is a matrix of brightness values. Write the filters yourself: brighten, contrast, invert, blur.',ta:'ஒரு 8 × 8 photo-ன்னா brightness values-ஓட ஒரு matrix. Filters-ஐ நீங்களே எழுதுங்க: brighten, contrast, invert, blur.'},
 code:`const FILTER = "blur";    // try "bright", "contrast", "invert", "blur"
const img = [
  [ 40,  40, 200, 200, 200, 200,  40,  40],
  [ 40, 200, 200, 200, 200, 200, 200,  40],
  [200, 200,  30, 200, 200,  30, 200, 200],
  [200, 200, 200, 200, 200, 200, 200, 200],
  [200,  60, 200, 200, 200, 200,  60, 200],
  [200, 200,  60,  60,  60,  60, 200, 200],
  [ 40, 200, 200, 200, 200, 200, 200,  40],
  [ 40,  40, 200, 200, 200, 200,  40,  40],
];
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const at = (i, j) => img[Math.max(0, Math.min(7, i))][Math.max(0, Math.min(7, j))];   // edges repeat

const out = img.map((row, i) => row.map((v, j) => {
  if (FILTER === "bright") return clamp(v + 60);
  if (FILTER === "contrast") return clamp((v - 128) * 1.8 + 128);
  if (FILTER === "invert") return 255 - v;
  let s = 0;                                         // blur: average of the 3 × 3 neighbourhood
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) s += at(i + a, j + b);
  return clamp(s / 9);
}));
print(FILTER + ": top-left pixel " + img[0][0] + " → " + out[0][0] + ", eye pixel " + img[2][2] + " → " + out[2][2]);
return { img, out, FILTER };`,
 viz(r,a){title('Before → after: '+r.FILTER);[[r.img,60],[r.out,430]].forEach(([g,x0],k)=>{g.forEach((row,i)=>row.forEach((v,j)=>{const val=k?Math.round(r.img[i][j]+(v-r.img[i][j])*ease(a)):v;ctx.fillStyle=`rgb(${val},${val},${val})`;ctx.fillRect(x0+j*38,70+i*38,36,36);}));});},
 ch:{en:'Apply "blur" twice (blur the output again). What happens to the eyes and mouth? Why do phone cameras avoid too much blurring when removing noise?',ta:'"blur"-ஐ ரெண்டு தடவை apply பண்ணுங்க (output-ஐ மறுபடியும் blur பண்ணுங்க). கண்கள், வாய் என்ன ஆகுது? Noise-ஐ நீக்கும் போது phone cameras ஏன் அதிகமா blur பண்றதில்ல?'},
 ans:{en:'The dark eyes and mouth spread out and fade into grey, and the face loses its details. Blur removes noise but also removes edges, so camera software uses smarter, edge-aware filters, and modern phones use AI-learned ones.',ta:'கருப்பான கண்கள், வாய் பரவி grey-ஆ மங்குது, முகம் details-ஐ இழக்குது. Blur noise-ஐ நீக்கும், ஆனா edges-ஐயும் நீக்கும், அதனால camera software edges-ஐ பார்த்து smart-ஆ filter பண்ணும், modern phones AI கத்துக்கிட்ட filters use பண்ணுது.'}},
{id:'similar',libs:['mathjs'],pyPackages:['numpy'],title:{en:'Recommend a club with cosine similarity',ta:'Cosine similarity வெச்சு ஒரு club-ஐ recommend பண்ணுங்க'},
 why:{en:'Students and clubs become vectors of interests. The club pointing in the most similar direction wins. This is the core of recommendation engines and AI search.',ta:'Students-உம் clubs-உம் interests-ஓட vectors-ஆ மாறுது. ரொம்ப ஒத்த திசையில point பண்ற club ஜெயிக்கும். Recommendation engines, AI search-ஓட மையம் இது தான்.'},
 code:`//            coding music sports art
const ME    = [5,     1,    0,     4];      // change your own interests (0–5)
const CLUBS = {
  "Coding club":   [5, 0, 0, 1],
  "Music club":    [0, 5, 0, 2],
  "Sports club":   [0, 1, 5, 0],
  "Design club":   [3, 1, 0, 5],
};
const cosine = (a, b) => math.dot(a, b) / (math.norm(a) * math.norm(b));   // by package
const cosineByHand = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0) / (Math.hypot(...a) * Math.hypot(...b));

const scores = Object.entries(CLUBS).map(([name, v]) => ({ name, score: cosine(ME, v), hand: cosineByHand(ME, v) }));
scores.sort((x, y) => y.score - x.score);
scores.forEach((s) => print(s.name.padEnd(12) + " " + s.score.toFixed(3) + "  (by hand " + s.hand.toFixed(3) + ")"));
print("Recommended: " + scores[0].name);
return { scores };`,
 viz(r,a){title('Club match for you');r.scores.forEach((s,i)=>{const y=90+i*90;txt(s.name,40,y+24,{size:20,weight:800});box(260,y+4,460,30,15,'#E7ECF4');box(260,y+4,Math.max(20,460*s.score*ease(a)),30,15,i===0?C.green:C.light);txt(s.score.toFixed(2),730,y+26,{size:18,weight:800,color:i===0?C.green:C.ink});});
  txt('★ recommended: '+r.scores[0].name,40,460,{size:22,weight:800,color:C.green});},
 ch:{en:'Double every number in ME (e.g. [10, 2, 0, 8]). Do the scores change? Why is that useful for comparing a very active student with a quieter one?',ta:'ME-ல ஒவ்வொரு number-ஐயும் ரெட்டிப்பாக்குங்க (உதாரணமா [10, 2, 0, 8]). Scores மாறுதா? ரொம்ப active-ஆன ஒரு student-ஐ அமைதியான ஒருத்தரோட compare பண்ண அது ஏன் useful?'},
 ans:{en:'The scores stay exactly the same: doubling a vector changes its length but not its direction, and cosine similarity only looks at direction. So a student who rates everything high and one who rates everything low can still be matched by what they like, not how loudly they say it.',ta:'Scores சரியா அப்படியே இருக்கும்: vector-ஐ ரெட்டிப்பாக்கினா நீளம் மாறும், திசை மாறாது, cosine similarity திசையை மட்டும் தான் பார்க்கும். அதனால எல்லாத்துக்கும் அதிக rating கொடுக்கிறவரும், குறைவா கொடுக்கிறவரும், எவ்வளவு சத்தமா சொல்றாங்கன்னு இல்லாம, என்ன பிடிக்குதுன்னு வெச்சு match ஆகலாம்.'}}
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
