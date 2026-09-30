// sin & cos Part B code lab: experiments (JavaScript + Python) with their chart drawings.
// Experiments may list `libs` (JS packages injected by CodeLab: mathjs → `math`, geolib → `geolib`)
// and `pyPackages` (loaded into Pyodide before running: numpy via loadPackage, geopy via micropip).
// createLab(ctx) returns the experiment list; viz(result, progress) draws on ctx.
// Pass null when you only need the text and code.
export const LAB_W = 800, LAB_H = 500;

const PY = {
  "steps": "import math\nA = [11.0168, 76.9558]   # Coimbatore [lat, lng]\nB = [13.0827, 80.2707]   # Chennai. Try Madurai: [9.9252, 78.1198]\nKM_PER_DEG = 111.2\n\nnorth = (B[0] - A[0]) * KM_PER_DEG\nmid_lat = (A[0] + B[0]) / 2\neast = (B[1] - A[1]) * KM_PER_DEG * math.cos(math.radians(mid_lat))   # longitude shrinks with cos\nstraight = math.hypot(north, east)                                  # Pythagoras\n\nprint(f\"north:    {north:.1f} km\")\nprint(f\"east:     {east:.1f} km\")\nprint(f\"straight: {straight:.1f} km\")\nresult = {\"north\": north, \"east\": east, \"straight\": straight}",
  "packages": "import math\nfrom geopy.distance import geodesic\n\nplaces = {\n    \"Coimbatore\": (11.0168, 76.9558), \"Madurai\": (9.9252, 78.1198), \"Chennai\": (13.0827, 80.2707),\n    \"Delhi\": (28.6139, 77.2090), \"London\": (51.5074, -0.1278), \"NewYork\": (40.7128, -74.0060),\n}\ntrips = [(\"Coimbatore\", \"Chennai\"), (\"Madurai\", \"Chennai\"), (\"Chennai\", \"Delhi\"), (\"Chennai\", \"London\"), (\"Chennai\", \"NewYork\")]\n\ndef step_km(a, b):\n    north = (b[0] - a[0]) * 111.2\n    east = (b[1] - a[1]) * 111.2 * math.cos(math.radians((a[0] + b[0]) / 2))\n    return math.hypot(north, east)\n\nrows = []\nfor f, t in trips:\n    a, b = places[f], places[t]\n    step = step_km(a, b)\n    pkg = geodesic(a, b).km\n    print(f\"{f} → {t}: step {step:.0f} km, geopy {pkg:.0f} km\")\n    rows.append({\"name\": f + \"→\" + t, \"step\": step, \"pkg\": pkg, \"err\": (step - pkg) / pkg * 100})\nresult = {\"rows\": rows}",
  "direction": "import math\nme = (13.0827, 80.2707)\nfriend = (13.0835, 80.2716)      # move your friend around!\n\n# by hand: metres east and north, then atan2\nnorth = (friend[0] - me[0]) * 111200\neast = (friend[1] - me[1]) * 111200 * math.cos(math.radians(me[0]))\nangle_from_east = math.degrees(math.atan2(north, east))\nbearing = (90 - angle_from_east + 360) % 360      # compass style: 0° = north, clockwise\nwords = [\"N\", \"NNE\", \"NE\", \"ENE\", \"E\", \"ESE\", \"SE\", \"SSE\", \"S\", \"SSW\", \"SW\", \"WSW\", \"W\", \"WNW\", \"NW\", \"NNW\"]\nword = words[round(bearing / 22.5) % 16]\nprint(f\"by hand: {bearing:.1f}° from north ({word}), {math.hypot(north, east):.0f} m away\")\nresult = {\"bearing\": bearing, \"word\": word, \"dist\": math.hypot(north, east)}",
  "geofence": "import math\nfrom geopy.distance import geodesic\nRADIUS = 150                     # metres. Try 100 and 250\ngate = (11.2892, 77.6073)\n\nstudents = []\nfor i in range(30):              # 30 phones around campus\n    d, b = 20 + (i * 37) % 260, i * 0.7\n    students.append((gate[0] + d * math.cos(b) / 111200,\n                     gate[1] + d * math.sin(b) / (111200 * math.cos(math.radians(gate[0])))))\n\nby_hand = by_package = 0\nmarks = []\nfor s in students:\n    north = (s[0] - gate[0]) * 111200\n    east = (s[1] - gate[1]) * 111200 * math.cos(math.radians(gate[0]))\n    inside = math.hypot(north, east) <= RADIUS\n    by_hand += inside\n    by_package += geodesic(s, gate).m <= RADIUS\n    marks.append({\"north\": north, \"east\": east, \"inside\": inside})\nprint(\"Present (by hand): \", by_hand, \"/ 30\")\nprint(\"Present (by geopy):\", by_package, \"/ 30\")\nresult = {\"marks\": marks, \"RADIUS\": RADIUS, \"byHand\": by_hand, \"byPackage\": by_package}"
};

export default function createLab(ctx) {
const C={paper:'#F7F9FC',grid:'#E3E9F3',ink:'#1E3E7B',gold:'#C9A21F',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',light:'#D7E1F0'};
const FONT='Catamaran, system-ui, sans-serif';const W=800,H=500;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const ease=x=>1-Math.pow(1-clamp(x),3);

const labs=[
{id:'steps',title:{en:'Distance step by step',ta:'Step by step distance'},
 why:{en:'The method from the lesson: north part, east part with cos, then Pythagoras. Only Math, no packages.',ta:'Lesson-ல பார்த்த method: வடக்கு பகுதி, cos வெச்சு கிழக்கு பகுதி, அப்புறம் Pythagoras. Math மட்டும், packages இல்ல.'},
 code:`const A = [11.0168, 76.9558];   // Coimbatore [lat, lng]
const B = [13.0827, 80.2707];   // Chennai. Try Madurai: [9.9252, 78.1198]
const KM_PER_DEG = 111.2;

const toRad = (d) => d * Math.PI / 180;
const north = (B[0] - A[0]) * KM_PER_DEG;
const midLat = (A[0] + B[0]) / 2;
const east = (B[1] - A[1]) * KM_PER_DEG * Math.cos(toRad(midLat));   // longitude shrinks with cos
const straight = Math.hypot(north, east);                           // Pythagoras

print("north:    " + north.toFixed(1) + " km");
print("east:     " + east.toFixed(1) + " km");
print("straight: " + straight.toFixed(1) + " km");
return { north, east, straight };`,
 viz(r,a){title('North + east + Pythagoras');const sc=Math.min(300/Math.max(1,Math.abs(r.north)),560/Math.max(1,Math.abs(r.east)));const ax=120,ay=420,ex=ax+r.east*sc*ease(a),ny=ay-r.north*sc*ease(a);
  line(ax,ay,ex,ay,C.green,6);line(ex,ay,ex,ny,C.gold,6);line(ax,ay,ex,ny,C.coral,4);
  txt(r.east.toFixed(0)+' km east',(ax+ex)/2,ay+30,{size:20,weight:800,align:'center',color:C.green});txt(r.north.toFixed(0)+' km north',ex+10,(ay+ny)/2,{size:20,weight:800,color:'#7A600A'});
  txt('≈ '+r.straight.toFixed(0)+' km',(ax+ex)/2-40,(ay+ny)/2-12,{size:24,weight:800,color:C.coral});},
 ch:{en:'Change B to Madurai [9.9252, 78.1198]. Is the north part positive or negative now? Does the straight distance care?',ta:'B-ஐ Madurai [9.9252, 78.1198]-ஆ மாத்துங்க. இப்போ north part positive-ஆ negative-ஆ? Straight distance அதை பொருட்படுத்துமா?'},
 ans:{en:'Madurai is south of Coimbatore, so north becomes negative (about −121 km). Pythagoras squares it, so the straight distance (about 176 km) comes out positive either way. Negative just means the other direction.',ta:'Madurai, Coimbatore-க்கு தெற்கு, அதனால north negative (சுமார் −121 km). Pythagoras square பண்றதால, straight distance (சுமார் 176 km) எப்படியும் positive-ஆ தான் வரும். Negative-ன்னா எதிர் திசை, அவ்வளவு தான்.'}},

{id:'packages',libs:['geolib'],pyPackages:['geopy'],title:{en:'Our method vs the package',ta:'நம்ம method vs package'},
 why:{en:'Compare the step method with geolib (JavaScript) or geopy (Python) on short and long trips, and see exactly where our method stops being good enough.',ta:'Step method-ஐ geolib (JavaScript), geopy (Python)-ஓட சின்ன, நீண்ட பயணங்கள்ல compare பண்ணுங்க. நம்ம method எங்க போதாதுன்னு சரியா பாருங்க.'},
 code:`const places = {
  Coimbatore: [11.0168, 76.9558], Madurai: [9.9252, 78.1198], Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090], London: [51.5074, -0.1278], NewYork: [40.7128, -74.0060],
};
const trips = [['Coimbatore', 'Chennai'], ['Madurai', 'Chennai'], ['Chennai', 'Delhi'], ['Chennai', 'London'], ['Chennai', 'NewYork']];

function stepKm(a, b) {
  const north = (b[0] - a[0]) * 111.2;
  const east = (b[1] - a[1]) * 111.2 * Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180);
  return Math.hypot(north, east);
}

const rows = trips.map(([from, to]) => {
  const a = places[from], b = places[to];
  const step = stepKm(a, b);
  const pkg = geolib.getPreciseDistance({ latitude: a[0], longitude: a[1] }, { latitude: b[0], longitude: b[1] }) / 1000;
  print(from + " → " + to + ": step " + step.toFixed(0) + " km, geolib " + pkg.toFixed(0) + " km");
  return { name: from + '→' + to, step, pkg, err: (step - pkg) / pkg * 100 };
});
return { rows };`,
 viz(r,a){title('How wrong is the step method?');const mx=Math.max(20,...r.rows.map(x=>Math.abs(x.err)));
  r.rows.forEach((x,i)=>{const y=80+i*76;txt(x.name,30,y+22,{size:18,weight:800});const w=Math.max(4,420*Math.abs(x.err)/mx*ease(a));box(300,y+4,w,28,6,Math.abs(x.err)<1?C.green:Math.abs(x.err)<5?C.gold:C.coral);
   txt(x.err.toFixed(1)+'%',310+w,y+26,{size:18,weight:800});});txt('green: fine · gold: careful · coral: use the package',30,470,{size:16,weight:800,color:C.muted});},
 ch:{en:'Which trips have more than 1% error? Add Bengaluru [12.9716, 77.5946] and Mumbai [19.0760, 72.8777] and check them too.',ta:'எந்த trips-க்கு 1%-க்கு மேல error? Bengaluru [12.9716, 77.5946], Mumbai [19.0760, 72.8777] சேர்த்து அவற்றையும் check பண்ணுங்க.'},
 ans:{en:'Every trip inside India stays under about 0.5%: even Chennai–Delhi (about 1,750 km) is only 0.4% off, and Chennai–Bengaluru and Chennai–Mumbai are closer still. The big errors come with other continents: London about 5.7%, New York about 16%. Rule of thumb: within a country, the step method is fine; across continents, use the package.',ta:'இந்தியாவுக்குள்ள எல்லா trips-உம் சுமார் 0.5%-க்கு கீழ தான்: Chennai–Delhi (சுமார் 1,750 km) கூட 0.4% தான் தப்பு. Chennai–Bengaluru, Chennai–Mumbai இன்னும் நெருக்கம். பெரிய errors வேற கண்டங்களுக்கு தான்: London சுமார் 5.7%, New York சுமார் 16%. Rule of thumb: ஒரு நாட்டுக்குள்ள step method போதும்; கண்டங்களுக்கு இடையே package use பண்ணுங்க.'}},

{id:'direction',libs:['geolib'],title:{en:'Which way is my friend?',ta:'என் friend எந்த பக்கம்?'},
 why:{en:'atan2 turns an east/north difference into an angle. geolib turns it into a compass word. Map apps show you both.',ta:'atan2 கிழக்கு/வடக்கு வித்தியாசத்தை angle-ஆ மாத்துது. geolib அதை compass வார்த்தையா மாத்துது. Map apps ரெண்டையும் காட்டும்.'},
 code:`const me = { latitude: 13.0827, longitude: 80.2707 };
const friend = { latitude: 13.0835, longitude: 80.2716 };   // move your friend around!

// by hand: metres east and north, then atan2
const north = (friend.latitude - me.latitude) * 111200;
const east = (friend.longitude - me.longitude) * 111200 * Math.cos(me.latitude * Math.PI / 180);
const angleFromEast = Math.atan2(north, east) * 180 / Math.PI;
const bearing = (90 - angleFromEast + 360) % 360;         // compass style: 0° = north, clockwise

print("by hand: " + bearing.toFixed(1) + "° from north, " + Math.hypot(north, east).toFixed(0) + " m away");
print("geolib:  " + geolib.getGreatCircleBearing(me, friend).toFixed(1) + "°, " + geolib.getCompassDirection(me, friend));
return { bearing, word: geolib.getCompassDirection(me, friend), dist: Math.hypot(north, east) };`,
 viz(r,a){title('Arrow to your friend');const cx=400,cy=270,R=170;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  [['N',0],['E',90],['S',180],['W',270]].forEach(([l,d])=>{const rd=d*Math.PI/180;txt(l,cx+(R+22)*Math.sin(rd),cy-(R+22)*Math.cos(rd)+7,{size:20,weight:800,align:'center'});});
  const rd=r.bearing*Math.PI/180*ease(a);line(cx,cy,cx+(R-20)*Math.sin(rd),cy-(R-20)*Math.cos(rd),C.coral,6);ctx.beginPath();ctx.arc(cx,cy,8,0,7);ctx.fillStyle=C.ink;ctx.fill();
  txt(r.word+' · '+r.dist.toFixed(0)+' m',cx,cy+R+50,{size:24,weight:800,align:'center',color:C.coral});},
 ch:{en:'Put your friend exactly south of you. What bearing and compass word do you expect before running?',ta:'உங்க friend-ஐ சரியா உங்களுக்கு தெற்க வைங்க. Run பண்றதுக்கு முன்னாடி என்ன bearing, என்ன compass வார்த்தை வரும்னு expect பண்றீங்க?'},
 ans:{en:'180° and "S". Keep longitude the same and make the friend\'s latitude smaller. Notice atan2 measures from east, anticlockwise, while compasses measure from north, clockwise: that one line of conversion is a classic interview question.',ta:'180°, "S". Longitude-ஐ அப்படியே வெச்சு, friend-ஓட latitude-ஐ குறைங்க. atan2 கிழக்குல இருந்து anticlockwise அளக்குது, compass வடக்குல இருந்து clockwise: அந்த ஒரு line conversion ஒரு classic interview question.'}},

{id:'geofence',libs:['geolib'],pyPackages:['geopy'],title:{en:'Geofenced attendance for a whole class',ta:'முழு class-க்கும் geofence attendance'},
 why:{en:'The same check your mission uses, run for 30 students at once, by hand and with geolib.isPointWithinRadius. Enterprise field-staff apps do exactly this.',ta:'உங்க mission use பண்ற அதே check, ஒரே நேரத்துல 30 students-க்கு, கையாலயும் geolib.isPointWithinRadius வெச்சும். Enterprise field-staff apps இதையே தான் பண்ணுது.'},
 code:`const RADIUS = 150;                                   // metres. Try 100 and 250
const gate = { latitude: 11.2892, longitude: 77.6073 };

const students = [];
for (let i = 0; i < 30; i++) {                         // 30 phones around campus
  const d = 20 + ((i * 37) % 260), b = i * 0.7;
  students.push({ latitude: gate.latitude + (d * Math.cos(b)) / 111200,
                  longitude: gate.longitude + (d * Math.sin(b)) / (111200 * Math.cos(gate.latitude * Math.PI / 180)) });
}
let byHand = 0, byPackage = 0;
const marks = students.map((s) => {
  const north = (s.latitude - gate.latitude) * 111200;
  const east = (s.longitude - gate.longitude) * 111200 * Math.cos(gate.latitude * Math.PI / 180);
  const inside = Math.hypot(north, east) <= RADIUS;
  if (inside) byHand++;
  if (geolib.isPointWithinRadius(s, gate, RADIUS)) byPackage++;
  return { north, east, inside };
});
print("Present (by hand):   " + byHand + " / 30");
print("Present (by geolib): " + byPackage + " / 30");
return { marks, RADIUS, byHand, byPackage };`,
 viz(r,a){title('Present: '+r.byHand+' / 30   (radius '+r.RADIUS+' m)');const cx=400,cy=270,s=0.8;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(cx,cy,r.RADIUS*s,0,7);ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
  box(cx-8,cy-8,16,16,3,C.ink);const n=Math.ceil(r.marks.length*ease(a));r.marks.slice(0,n).forEach(m=>{ctx.beginPath();ctx.arc(cx+m.east*s,cy-m.north*s,7,0,7);ctx.fillStyle=m.inside?C.green:C.coral;ctx.fill();});},
 ch:{en:'Do the hand method and geolib ever disagree? Try moving one student to exactly the edge of the circle. What should a real app do at the edge?',ta:'கையால பண்ற method-உம் geolib-உம் எப்பவாவது வேறுபடுதா? ஒரு student-ஐ சரியா circle ஓரத்துக்கு நகர்த்தி பாருங்க. Real app ஓரத்துல என்ன பண்ணணும்?'},
 ans:{en:'At campus scale they agree except within a few centimetres of the edge, where tiny rounding differences decide. GPS itself is only accurate to a few metres, so real apps add a margin (say 10–20 m) or ask for a second reading instead of trusting the exact edge.',ta:'Campus அளவுல ரெண்டும் ஒத்துப்போகும், ஓரத்துல சில centimetres-க்குள்ள மட்டும் rounding வித்தியாசம் வரலாம். GPS-ஏ சில metres accuracy தான், அதனால real apps ஒரு margin (10–20 m) சேர்க்கும், இல்லன்னா இன்னொரு reading கேக்கும்.'}}
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
