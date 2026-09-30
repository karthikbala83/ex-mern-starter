// Generated from the pilot artifact. Canvas drawing code for each scene, in order.
// Narration text lives in narration.json (same scene order). Edit visuals here, words there.
// The player calls paper() to clear the stage before every frame.
export const W = 1280, H = 720;

export default function createScenes(ctx) {
const W=1280,H=720;
const C={paper:'#F7F9FC',grid:'#E3E9F3',gridMajor:'#CBD7EA',ink:'#1E3E7B',gold:'#C9A21F',goldSoft:'rgba(201,162,31,.25)',green:'#547B5C',coral:'#C8553D',muted:'#6B7A93',white:'#FFFFFF',light:'#D7E1F0'};

const FONT='Catamaran, "Noto Sans Tamil", system-ui, sans-serif';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return 1-Math.pow(1-x,3)};

function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
function box(x,y,w,h,r,fill,stroke,lw){rr(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function txt(s,x,y,o){o=o||{};ctx.save();ctx.globalAlpha*=o.alpha==null?1:o.alpha;ctx.font=`${o.weight||600} ${o.size||28}px ${o.font||FONT}`;ctx.fillStyle=o.color||C.ink;ctx.textAlign=o.align||'left';ctx.textBaseline=o.base||'alphabetic';ctx.fillText(s,x,y);ctx.restore();}
function line(x1,y1,x2,y2,col,lw,dash){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw||2;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function arrow(x1,y,x2,col,a){ctx.save();ctx.globalAlpha*=a;line(x1,y,x2,y,col,3);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x2+2,y);ctx.lineTo(x2-12,y-8);ctx.lineTo(x2-12,y+8);ctx.fill();ctx.restore();}
function paper(){ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);for(let x=0;x<=W;x+=20){ctx.strokeStyle=x%100===0?C.gridMajor:C.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,H);ctx.stroke();}for(let y=0;y<=H;y+=20){ctx.strokeStyle=y%100===0?C.gridMajor:C.grid;ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(W,y+.5);ctx.stroke();}}
function die(cx,cy,s,rot,n){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);box(-s/2,-s/2,s,s,s*.18,C.white,C.ink,4);const p={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[n];ctx.fillStyle=C.ink;p.forEach(([a,b])=>{ctx.beginPath();ctx.arc(a*s*.27,b*s*.27,s*.08,0,7);ctx.fill();});ctx.restore();}
function bday(n){let q=1;for(let k=0;k<n;k++)q*=(365-k)/365;return 1-q;}



const MONO='ui-monospace, Menlo, Consolas, "Courier New", monospace';
const TAU=Math.PI*2, DEG=Math.PI/180;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function dot(x,y,r,col){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=col;ctx.fill();}
function ring(x,y,r,col,lw,dash){ctx.save();if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.arc(x,y,Math.max(0.1,r),0,TAU);ctx.strokeStyle=col;ctx.lineWidth=lw||2;ctx.stroke();ctx.restore();}
function banner(s,a,col){ctx.save();ctx.globalAlpha=a;box(100,600,1080,76,16,'#FBF5E1',C.gold,4);txt(s,640,650,{size:30,weight:800,align:'center',color:col||C.ink});ctx.restore();}
function chip(s,x,y,a,col){ctx.save();ctx.globalAlpha=a;ctx.font=`800 22px ${FONT}`;const w=ctx.measureText(s).width+28;box(x,y,w,40,20,col||C.ink);txt(s,x+14,y+28,{size:22,weight:800,color:'#fff'});ctx.restore();return w;}
function heart(x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,12);ctx.bezierCurveTo(-26,-6,-14,-28,0,-14);ctx.bezierCurveTo(14,-28,26,-6,0,12);ctx.fillStyle=col;ctx.fill();ctx.restore();}
function pin(x,y,col,label){ctx.beginPath();ctx.arc(x,y-26,14,Math.PI*0.85,Math.PI*2.15);ctx.lineTo(x,y);ctx.closePath();ctx.fillStyle=col;ctx.fill();dot(x,y-26,5,'#fff');if(label)txt(label,x,y+30,{size:22,weight:800,align:'center'});}
function person(x,y,col){dot(x,y-70,14,col);line(x,y-56,x,y-20,col,5);line(x,y-20,x-12,y,col,5);line(x,y-20,x+12,y,col,5);line(x,y-44,x-16,y-30,col,5);line(x,y-44,x+16,y-30,col,5);}
function lines(arr,x,y,gap,o){arr.forEach((s,i)=>txt(s,x,y+i*gap,o));}
function readout(label,val,x,y,col){txt(label,x,y,{size:24,weight:700,color:C.muted});txt(val,x,y+40,{size:36,weight:800,color:col||C.ink,font:MONO});}
const RAIN=(()=>{const r=mulberry(21);return Array.from({length:150},()=>({x:80+r()*1120,y:r()*540,v:.45+r()*.35,ph:r()*TAU,l:18+r()*14}));})();
const TEMPS=[25,26.5,28.5,31,33,32.5,31,30.5,30,28.5,26.5,25];
const MONTHS=['J','F','M','A','M','J','J','A','S','O','N','D'];
const fitT=m=>29+3.6*Math.cos(TAU*(m-6.2)/12);
function globe(cx,cy,R){const g=ctx.createRadialGradient(cx-R*.35,cy-R*.35,R*.15,cx,cy,R);g.addColorStop(0,'#D5E7F8');g.addColorStop(1,'#7FA6D6');dot(cx,cy,R,g);ring(cx,cy,R,C.ink,3);}


  const draws = [
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(120,70,340,600,44,C.white,C.ink,4);box(250,88,80,12,6,C.ink);txt('CampusOps',290,150,{size:28,weight:800,align:'center'});
  const far=b<2;box(160,480,260,70,35,far?'#D3DBE8':C.green);txt(far?'Mark Present':'Mark Present ✓',290,524,{size:26,weight:800,align:'center',color:far?'#7B879C':'#fff'});
  txt(far?'You are 420 m from campus':'You are on campus',290,590,{size:20,weight:800,align:'center',color:far?C.coral:C.green});
  dot(290,300,70,'#E4EEDC');ring(290,300,70,C.green,3,[6,5]);box(282,292,16,16,3,C.ink);dot(290+(far?100:30),300-(far?60:20),9,far?C.coral:C.green);
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(560,150,600,180,16,'#16294F');
   [['GPS says:','#9FB6DE'],['latitude  11.2931° N','#fff'],['longitude 77.6104° E','#fff']].forEach(([s,c],i)=>{ctx.font=`700 30px ${MONO}`;ctx.fillStyle=c;ctx.fillText(s,590,205+i*48);});
   txt('Two angles. No kilometres.',560,380,{size:32,weight:800,color:C.coral});txt('angles → distance needs sin & cos',560,430,{size:30,weight:800,color:C.green});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;['1. north part','2. east part (with cos)','3. Pythagoras','4. when to use a package'].forEach((s,i)=>txt(s,560,510+i*42,{size:26,weight:800,alpha:ease(P(2)*4-i*.6)}));ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=380,cy=390,R=240;globe(cx,cy,R);
  for(let la=-60;la<=60;la+=30){const y=cy-R*Math.sin(la*DEG),rx=R*Math.cos(la*DEG);ctx.beginPath();ctx.ellipse(cx,y,rx,rx*.12,0,0,TAU);ctx.strokeStyle='rgba(30,62,123,.35)';ctx.lineWidth=la===0?3:1.5;ctx.stroke();}
  for(let lo=-60;lo<=60;lo+=30){ctx.beginPath();ctx.ellipse(cx,cy,Math.abs(R*Math.sin(lo*DEG)),R,0,0,TAU);ctx.strokeStyle='rgba(30,62,123,.25)';ctx.lineWidth=1.5;ctx.stroke();}
  if(b===0){pin(cx+120,cy-90,C.coral);box(700,160,470,170,16,'#16294F');lines(['GPS says:','latitude  13.0827° N','longitude 80.2707° E'],730,210,44,{size:28,weight:800,color:'#fff',font:MONO});txt('Chennai: two angles, no km',700,380,{size:28,weight:800,color:C.coral,alpha:ease(p*2-.4)});}
  if(b>=1){const a=ease(P(1)*2);const phi=35*DEG;ctx.save();ctx.globalAlpha=a;const ex=cx+R,px=cx+R*Math.cos(phi),py=cy-R*Math.sin(phi);
   line(cx,cy,ex,cy,C.ink,3);line(cx,cy,px,py,C.coral,4);dot(cx,cy,7,C.ink);dot(px,py,11,C.coral);ctx.beginPath();ctx.arc(cx,cy,80,-phi,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();
   txt('latitude',cx+90,cy-20,{size:24,weight:800,color:C.coral});txt('equator',cx-R+20,cy+34,{size:20,weight:800,color:C.muted});
   if(b===1){lines(['Latitude: tilt north/south','of the equator, from the centre','','Longitude: turn east/west','of Greenwich, London'],700,180,40,{size:28,weight:800});}ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;const ox=700,oy=160;txt('Flatten an orange peel?',ox,oy,{size:30,weight:800});
   for(let i=0;i<6;i++){const x=ox+40+i*78,y=oy+150,sp=18*ease(P(2)*2);ctx.beginPath();ctx.ellipse(x+(i-2.5)*sp,y,30,110,0,0,TAU);ctx.fillStyle='#F2A65A';ctx.fill();ctx.strokeStyle='#C77A2B';ctx.lineWidth=2;ctx.stroke();}
   txt('Gaps appear: a flat grid can\'t cover a ball',ox,oy+310,{size:24,weight:800,color:C.coral});txt('Angles work everywhere → need sin & cos',ox,oy+350,{size:24,weight:800,color:C.green});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=360,cy=400,R=240;globe(cx,cy,R);const w=12*DEG;
  line(cx,cy,cx+R,cy,C.ink,3);line(cx,cy,cx+R*Math.cos(w),cy-R*Math.sin(w),C.ink,3);dot(cx,cy,7,C.ink);txt('R = 6,371 km',cx-40,cy+36,{size:24,weight:800,align:'center'});
  ctx.beginPath();ctx.arc(cx,cy,R,-w,0);ctx.strokeStyle=C.gold;ctx.lineWidth=10;ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,60,-w,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();
  txt('1°',cx+72,cy-4,{size:22,weight:800,color:C.coral});txt('(angle drawn larger to be visible)',cx,cy+R+44,{size:18,color:C.muted,align:'center'});txt('arc',cx+R+18,cy-20,{size:24,weight:800,color:'#7A600A'});
  const X=700;txt('arc = R × angle (in radians)',X,160,{size:30,weight:800,font:MONO});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;lines(['1° = π ÷ 180 rad','1° latitude = 6,371 × π ÷ 180','            ≈ 111 km'],X,230,46,{size:28,weight:800,font:MONO});
   box(X,400,500,110,14,'#FBF5E1',C.gold,3);txt('Coimbatore → Chennai: 2.07° north',X+20,445,{size:24,weight:800});txt('2.07 × 111 ≈ 230 km northward',X+20,485,{size:24,weight:800,color:'#7A600A'});ctx.restore();}
  if(b>=2)txt('Only works in radians!',X,580,{size:34,weight:800,color:C.coral,alpha:ease(P(2)*2)});
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=360,cy=390,R=240;globe(cx,cy,R);
  if(b===0){for(let lo=-75;lo<=75;lo+=15){ctx.beginPath();ctx.ellipse(cx,cy,Math.abs(R*Math.sin(lo*DEG)),R,0,0,TAU);ctx.strokeStyle='rgba(30,62,123,.35)';ctx.lineWidth=lo===0||lo===15?3:1.5;ctx.stroke();}
   dot(cx,cy-R,8,C.coral);dot(cx,cy+R,8,C.coral);const w0=R*Math.sin(15*DEG);line(cx,cy,cx+w0,cy,C.gold,6);txt('wide here',cx+w0+10,cy+8,{size:22,weight:800,color:'#7A600A'});
   const yy=cy-R*.85,w1=R*Math.sin(15*DEG)*Math.cos(Math.asin(.85));line(cx,yy,cx+w1,yy,C.gold,6);txt('narrow here',cx+w1+10,yy+8,{size:22,weight:800,color:'#7A600A'});txt('all meet at the poles',700,200,{size:30,weight:800,alpha:ease(p*2)});return;}
  const phi=b===1?(20+30*(0.5+0.5*Math.sin(t/1600)))*DEG:40*DEG;const y=cy-R*Math.sin(phi),r=R*Math.cos(phi);
  line(cx,cy-R-20,cx,cy+R+20,C.ink,2,[6,6]);ctx.beginPath();ctx.ellipse(cx,y,r,r*.14,0,0,TAU);ctx.strokeStyle=C.green;ctx.lineWidth=4;ctx.stroke();
  line(cx,cy,cx+r,y,C.ink,3);line(cx,y,cx+r,y,C.green,7);line(cx,cy,cx+R,cy,C.gridMajor,2);ctx.beginPath();ctx.arc(cx,cy,56,-phi,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();
  txt('φ',cx+66,cy-10,{size:26,weight:800,color:C.coral});txt('R',cx+r/2-24,(cy+y)/2+4,{size:24,weight:800});txt('R·cos φ',cx+r/2,y-16,{size:24,weight:800,align:'center',color:C.green});
  const X=700;txt('1° longitude = 111 × cos φ km',X,160,{size:30,weight:800,font:MONO});
  if(b===1)txt(`φ = ${(phi/DEG).toFixed(0)}° → ${(111.2*Math.cos(phi)).toFixed(0)} km`,X,220,{size:32,weight:800,color:C.green,font:MONO});
  if(b>=2){const rows=[['Equator',0],['Chennai',13.08],['London',51.5],['North Pole',90]];rows.forEach(([n,la],i)=>{const a=ease(P(2)*4-i*.6);if(a<=0)return;const v=111.2*Math.cos(la*DEG),yy=230+i*92;
   ctx.save();ctx.globalAlpha=a;txt(`${n} (${la}°)`,X,yy,{size:24,weight:800});box(X,yy+14,420,26,13,'#E7ECF4');if(v>.5)box(X,yy+14,420*v/111.2,26,13,C.green);txt(`${v.toFixed(0)} km`,X+500,yy+36,{size:24,weight:800,align:'right',color:C.green});ctx.restore();});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ax=150,ay=560,s=1.35;const ex=ax+360*s,ny=ay-230*s;
  box(90,90,720,560,20,'#EEF2EA',C.gridMajor,2);
  const l1=ease(P(0)*1.6);line(ax+360*s,ay,ax+360*s,ay-230*s*l1,C.gold,7);if(b>=0&&l1>.5)txt('230 km north',ex+16,(ay+ny)/2,{size:26,weight:800,color:'#7A600A'});
  if(b>=1){const l=ease(P(1)*1.6);line(ax,ay,ax+360*s*l,ay,C.green,7);if(l>.5)txt('360 km east',ax+180*s,ay+40,{size:26,weight:800,align:'center',color:C.green});}
  if(b>=2){const l=ease(P(2)*1.6);line(ax,ay,ax+(ex-ax)*l,ay+(ny-ay)*l,C.coral,6,[12,8]);if(l>.6)txt('≈ 427 km',(ax+ex)/2-60,(ay+ny)/2-16,{size:32,weight:800,color:C.coral});box(ex-26,ay-26,26,26,0,null,C.ink,2);}
  pin(ax,ay,C.ink,'Coimbatore');pin(ex,ny,C.coral,'Chennai');
  const X=860;txt('Coimbatore → Chennai',X,140,{size:28,weight:800});
  const rows=[['north','2.07° × 111.2','230 km',0],['east','3.31° × 111.2 × cos 12°','360 km',1],['straight','√(230² + 360²)','427 km',2]];
  rows.forEach(([n,f,v,k])=>{if(b<k)return;const a=ease(P(k)*2);const y=210+k*120;ctx.save();ctx.globalAlpha=a;txt(n,X,y,{size:24,weight:800,color:C.muted});txt(f,X,y+36,{size:22,weight:800,font:MONO});txt(v,X,y+74,{size:34,weight:800,color:k===2?C.coral:k===1?C.green:'#7A600A'});ctx.restore();});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=340,cy=480,R=250;
  ctx.save();ctx.beginPath();ctx.rect(40,80,640,600);ctx.clip();globe(cx,cy,R);ctx.restore();
  const a0=-Math.PI/2,tx=cx,ty=cy-R;line(tx-300,ty,tx+320,ty,C.coral,4);txt('flat map (a straight ruler)',tx-290,ty-16,{size:20,weight:800,color:C.coral});
  const sh=.22;ctx.beginPath();ctx.arc(cx,cy,R,a0-sh,a0);ctx.strokeStyle=C.green;ctx.lineWidth=9;ctx.stroke();dot(tx,ty,9,C.ink);
  const sx=cx+R*Math.cos(a0-sh),sy=cy+R*Math.sin(a0-sh);dot(sx,sy,7,C.green);txt('short trip:',sx-40,ty+56,{size:20,weight:800,align:'right',color:C.green});txt('ruler ≈ curve',sx-40,ty+80,{size:20,weight:800,align:'right',color:C.green});
  if(b>=1){const a=ease(P(1)*2);const lg=.8;ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(cx,cy,R,a0,a0+lg);ctx.strokeStyle=C.gold;ctx.lineWidth=9;ctx.stroke();
   const ex=cx+R*Math.cos(a0+lg),ey=cy+R*Math.sin(a0+lg);dot(ex,ey,8,'#7A600A');const fx=tx+R*Math.tan(lg);line(ex,ey,fx,ty,'#7A600A',3,[7,6]);dot(fx,ty,7,C.coral);
   txt('long trip: the Earth',ex-12,ey+40,{size:20,weight:800,align:'right',color:'#7A600A'});txt('curves away → big gap',ex-12,ey+64,{size:20,weight:800,align:'right',color:'#7A600A'});ctx.restore();}
  const X=700;const rows=[['Coimbatore → Chennai',427,427,0],['Chennai → London',8682,8211,1],['Chennai → New York',15605,13473,1]];
  txt('Step method vs truth',X,140,{size:28,weight:800});
  rows.forEach(([n,st,tr,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i===2?.8:0));if(a<=0)return;const y=200+i*120,err=(st-tr)/tr*100;ctx.save();ctx.globalAlpha=a;
   txt(n,X,y,{size:24,weight:800});txt(`step ${st.toLocaleString('en-IN')} km   true ${tr.toLocaleString('en-IN')} km`,X,y+34,{size:20,weight:700,color:C.muted});
   txt(`error ${err.toFixed(1)}%`,X,y+72,{size:30,weight:800,color:err<1?C.green:C.coral});ctx.restore();});
  if(b>=2)banner('Short trips: our method. Long trips: haversine, via a package.',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['JavaScript · geolib',"geolib.getPreciseDistance(cbe, maa)",'427183  (metres)'],['JavaScript · Turf.js',"distance(cbe, maa, { units: 'kilometers' })",'427.4'],['Python · geopy',"geodesic(cbe, maa).km",'427.2']];
  cards.forEach(([h,c,o],i)=>{const a=ease(P(0)*3-i*.5);if(a<=0)return;const y=100+i*150;ctx.save();ctx.globalAlpha=a;box(70,y,760,125,14,'#16294F');
   txt(h,95,y+36,{size:22,weight:800,color:'#9FB6DE'});ctx.font=`600 22px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText(c,95,y+76);
   if(b>=1){ctx.fillStyle='#7EE0A1';ctx.font=`800 24px ${MONO}`;ctx.fillText('→ '+o,95,y+110);}ctx.restore();});
  if(b>=1)txt('All agree: ≈ 427 km',70,590,{size:34,weight:800,color:C.green,alpha:ease(P(1)*2)});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;txt('Also in geolib:',880,130,{size:26,weight:800});
   [['getCompassDirection','→ "ENE"'],['isPointWithinRadius','→ true / false'],['findNearest','→ closest point'],['getCenter','→ middle of many points']].forEach(([f,r],i)=>{box(880,160+i*110,340,90,12,C.white,C.ink,2);txt(f,900,198+i*110,{size:22,weight:800,font:MONO});txt(r,900,232+i*110,{size:20,weight:800,color:C.muted});});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const px=420,py=420;const ang=Math.PI*.3+Math.sin(t/2200)*0.9;const D=230;
  const ex=px+D*Math.sin(ang),ey=py-D*Math.cos(ang);
  box(90,150,660,540,20,'#EEF2EA',C.gridMajor,2);txt('Fest ground',110,185,{size:20,weight:800,color:C.muted});
  dot(px,py,18,C.ink);ctx.save();ctx.translate(px,py);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,-44);ctx.lineTo(-12,-24);ctx.lineTo(12,-24);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.restore();txt('you',px,py+44,{size:20,weight:700,align:'center',color:C.muted});
  dot(ex,ey,14,C.green);[0,1].forEach(i=>ring(ex,ey,18+((t/20+i*20)%40),'rgba(84,123,92,'+(0.5-((t/20+i*20)%40)/80)+')',2));txt('friend',ex,ey-28,{size:20,weight:800,align:'center',color:C.green});
  if(b===0)txt('Arrow points to your friend',790,220,{size:30,weight:800,alpha:ease(p*2)});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;line(px,py,ex,py,C.green,4,[8,6]);line(ex,py,ex,ey,C.gold,4,[8,6]);line(px,py,ex,ey,C.coral,3);
   txt('dx',(px+ex)/2,py+30,{size:22,weight:800,color:C.green,align:'center'});txt('dy',ex+14,(py+ey)/2,{size:22,weight:800,color:'#7A600A'});
   txt('angle = atan2(dy, dx)',790,230,{size:30,weight:800,font:MONO});txt('distance = √(dx² + dy²)',790,280,{size:30,weight:800,font:MONO});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;lines(['Also steering:','• drones','• delivery robots','• self-driving cars'],790,380,42,{size:26,weight:800});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=380,cy=390,s=1.3;
  box(80,90,600,600,20,'#EEF2EA',C.gridMajor,2);ring(cx,cy,150*s,C.ink,3,[10,8]);box(cx-12,cy-12,24,24,4,C.ink);txt('gate',cx+18,cy+8,{size:20,weight:800});txt('150 m',cx+150*s-70,cy-12,{size:20,weight:800,color:C.muted});
  let pres=0;for(let i=0;i<22;i++){const d=25+((i*47)%200),ang=i*1.1+t/5000;const x=cx+d*s*Math.cos(ang),y=cy-d*s*Math.sin(ang);const ok=d<=150;if(ok)pres++;
   const show=b>=1?1:ease(P(0)*2);dot(x,y,9,b>=1?(ok?C.green:C.coral):'#A9B7CE');}
  const X=740;txt('distance = √(north² + east²)',X,160,{size:26,weight:800,font:MONO});txt('Present if distance ≤ 150 m',X,210,{size:26,weight:800,alpha:ease(P(0)*2)});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;txt(`Present: ${pres}   Not on campus: ${22-pres}`,X,280,{size:26,weight:800,color:C.green});
   ['Delivery zones','Field-staff attendance','Campus-only features'].forEach((s2,i)=>txt('• '+s2,X,350+i*42,{size:26,weight:800}));ctx.restore();}
  if(b>=2)banner('🏢 Mission: isInsideCampus(student, gate, radius)',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Part B: remember three things',160,150,{size:44,weight:800});
  ['1° lat ≈ 111 km. 1° long = 111 × cos(lat).','North + east + Pythagoras. Long trips: haversine.','Real apps: geolib, Turf.js, geopy.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;
   ctx.save();ctx.globalAlpha=a;dot(190,y-10,26,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(178,y-10);ctx.lineTo(187,y);ctx.lineTo(204,y-22);ctx.stroke();txt(s,240,y,{size:34,weight:700});ctx.restore();});
 }
  ];
function titleFrame(){paper();txt('sin & cos',120,260,{size:120,weight:800});txt('Part B: on the Earth, in every map',120,340,{size:40,weight:700,color:C.coral});
 txt('About 6 minutes. Tamil and English.',120,400,{size:26,color:C.muted});globe(1000,430,170);ring(1000,430,170,C.ink,4);
 ctx.beginPath();ctx.ellipse(1000,430,170,26,0,0,TAU);ctx.strokeStyle='rgba(30,62,123,.4)';ctx.lineWidth=2;ctx.stroke();pin(1060,380,C.coral);}

  return { draws, titleFrame, paper };
}
