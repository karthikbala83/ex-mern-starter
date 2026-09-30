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
  const cx=460,cy=370;box(90,70,740,600,20,'#E4EEDC',C.green,3);
  [[200,160,60],[680,560,80],[300,560,50],[720,170,45]].forEach(([x,y,r])=>dot(x,y,r,'#CFE0C3'));
  const r=290-150*((t/7000)%1);
  ctx.save();ctx.beginPath();rr(90,70,740,600,20);ctx.clip();ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(cx,cy,r,0,TAU,true);ctx.fillStyle='rgba(79,123,192,.28)';ctx.fill('evenodd');ctx.restore();
  ring(cx,cy,r,'#FFFFFF',6);ring(cx,cy,r,C.ink,2);
  const px=cx+230,py=cy-120;const d=Math.hypot(px-cx,py-cy);const inside=d<r;
  dot(px,py,14,inside?C.green:C.coral);ring(px,py,14,'#fff',3);
  box(870,110,330,30,15,'#E7ECF4');box(870,110,Math.max(30,330*(inside?1:clamp(.35+.65*(r-150)/(d-150)))),30,15,inside?C.green:C.coral);
  txt('Health',870,98,{size:22,weight:800});txt(inside?'Inside the zone':'Outside: losing health',870,180,{size:26,weight:800,color:inside?C.green:C.coral});
  if(b>=1){const a=ease(P(1)*2);txt('sin θ',1035,330,{size:84,weight:800,align:'center',color:C.gold,alpha:a});txt('cos θ',1035,430,{size:84,weight:800,align:'center',color:C.green,alpha:a});}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(860,470,370,200,16,C.white,C.ink,2);
   [['Part A','Games and code',C.gold],['Part B','The Earth and maps',C.ink],['Part C','Waves everywhere',C.ink]].forEach(([h,s2,c],i)=>{txt(h,880,506+i*58,{size:22,weight:800,color:c});txt(s2,970,506+i*58,{size:20,weight:700,color:C.muted});});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const th=30*DEG;const k=b>=3?1+.32*Math.sin(t/650):1;const Hy=420*k*ease(Math.max(P(0)*1.5,b>0?1:0));
  const ox=110,oy=580,adj=Hy*Math.cos(th),opp=Hy*Math.sin(th);
  ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+adj,oy);ctx.lineTo(ox+adj,oy-opp);ctx.closePath();ctx.fillStyle='rgba(201,162,31,.10)';ctx.fill();
  const hl=b>=1;line(ox,oy,ox+adj,oy-opp,C.ink,hl?6:4);line(ox,oy,ox+adj,oy,hl?C.green:C.ink,hl?6:4);line(ox+adj,oy,ox+adj,oy-opp,hl?C.gold:C.ink,hl?6:4);
  box(ox+adj-24,oy-24,24,24,0,null,C.ink,2);ctx.beginPath();ctx.arc(ox,oy,60,-th,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();txt('θ',ox+74,oy-12,{size:30,weight:800,color:C.coral});
  if(b>=1){const a=ease(P(1)*2);txt('hypotenuse',ox+adj/2-40,oy-opp/2-24,{size:24,weight:800,alpha:a});txt('adjacent',ox+adj/2,oy+36,{size:24,weight:800,align:'center',color:C.green,alpha:a});txt('opposite',ox+adj+14,oy-opp/2,{size:24,weight:800,color:'#7A600A',alpha:a});}
  const X=720;
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(X-20,110,540,220,16,C.white,C.ink,2);
   txt('sin θ = opposite ÷ hypotenuse',X,165,{size:28,weight:800,color:'#7A600A'});txt('cos θ = adjacent ÷ hypotenuse',X,225,{size:28,weight:800,color:C.green});txt('tan θ = opposite ÷ adjacent',X,285,{size:28,weight:800});ctx.restore();}
  if(b>=3){const a=ease(P(3)*2);ctx.save();ctx.globalAlpha=a;const o=opp/42,h=Hy/42;
   readout('opposite ÷ hypotenuse',`${o.toFixed(2)} ÷ ${h.toFixed(2)} = ${(o/h).toFixed(2)}`,X,400,'#7A600A');txt('Any size. Same answer: sin 30° = 0.5',X,510,{size:28,weight:800,color:C.coral});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const cx=260,cy=380,R=170,th=(t/1400)%TAU;const px=cx+R*Math.cos(th),py=cy-R*Math.sin(th);
  line(cx-R-40,cy,cx+R+40,cy,C.gridMajor,2);line(cx,cy-R-40,cx,cy+R+40,C.gridMajor,2);ring(cx,cy,R,C.ink,4);
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,cy);ctx.lineTo(px,py);ctx.closePath();ctx.fillStyle='rgba(201,162,31,.18)';ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,44,0,-th,true);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();
  txt('θ',cx+60*Math.cos(th/2),cy-60*Math.sin(th/2)+10,{size:28,weight:800,color:C.coral,align:'center'});
  line(cx,cy,px,py,C.ink,4);dot(px,py,13,C.ink);txt('hypotenuse = 1',cx-R,cy+R+70,{size:22,color:C.muted,weight:700});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;line(px,cy,px,py,C.gold,6);line(cx,cy,px,cy,C.green,6);
   txt('sin θ = '+Math.sin(th).toFixed(2)+'  (height)',60,80,{size:30,weight:800,color:'#7A600A'});txt('cos θ = '+Math.cos(th).toFixed(2)+'  (sideways)',60,122,{size:30,weight:800,color:C.green});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;const x0=500,len=700,k=len/(TAU*2);
   line(x0,cy,x0+len,cy,C.gridMajor,2);line(px,py,x0,py,C.gold,2,[6,6]);
   ctx.beginPath();for(let x=0;x<=len*ease(P(2)*1.3);x+=3){const y=cy-R*Math.sin(th-x/k);x?ctx.lineTo(x0+x,y):ctx.moveTo(x0+x,y);}ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.stroke();
   dot(x0,py,9,C.gold);txt('the sine wave',x0+len-10,cy+R+60,{size:26,weight:800,align:'right',color:'#7A600A'});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const gy=560,ex=200,tx=800,top=gy-346;
  line(60,gy,1220,gy,C.ink,4);person(ex,gy,C.ink);
  [[762,284,778,gy],[838,284,822,gy]].forEach(([a,b1,c,d])=>line(a,b1,c,d,C.ink,5));line(770,420,830,420,C.ink,3);
  box(740,top,120,70,10,'#DCE6F2',C.ink,3);txt('water tank',800,top-14,{size:20,weight:800,align:'center',color:C.muted});
  line(ex,gy-60,tx,top,C.coral,3,[10,8]);ctx.beginPath();ctx.arc(ex,gy-60,80,-30*DEG,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();txt('30°',ex+92,gy-66,{size:26,weight:800,color:C.coral});
  line(ex,gy+30,tx,gy+30,C.green,3);txt('30 m',(ex+tx)/2,gy+60,{size:26,weight:800,align:'center',color:C.green});
  line(tx+90,top,tx+90,gy,'#7A600A',3,[6,6]);txt(b>=1?'h ≈ 17.3 m':'h = ?',tx+104,(top+gy)/2,{size:30,weight:800,color:'#7A600A'});
  txt('(eye height ignored)',ex-40,gy+100,{size:18,color:C.muted});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(60,80,560,190,16,C.white,C.ink,2);
   lines(['tan θ = opposite ÷ adjacent','h = 30 × tan 30°','  = 30 × 0.577 ≈ 17.3 m'],84,130,52,{size:28,weight:800,font:MONO});ctx.restore();}
  if(b>=2)banner('One distance + one angle = the height, without climbing',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=380,cy=370;
  let n=6,r=230;if(b===1)n=6+Math.floor(58*ease(p*1.2));if(b>=2){n=64;r=230-90*((t/5000)%1);}
  const shown=b===0?Math.ceil(n*ease(p*1.3)):n;
  const pts=Array.from({length:n},(_,i)=>[cx+r*Math.cos(i*TAU/n),cy+r*Math.sin(i*TAU/n)]);
  if(shown>1){ctx.beginPath();pts.slice(0,shown).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(shown===n)ctx.closePath();ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();}
  pts.slice(0,shown).forEach(([x,y])=>dot(x,y,n>20?4:9,C.gold));dot(cx,cy,7,C.ink);txt('centre',cx,cy+32,{size:18,weight:700,align:'center',color:C.muted});
  if(b===0&&shown>0){const [x,y]=pts[shown-1];line(cx,cy,x,y,C.coral,3);}
  const X=720;
  txt('x = cx + r·cos θ',X,170,{size:36,weight:800,font:MONO});txt('y = cy + r·sin θ',X,220,{size:36,weight:800,font:MONO});
  if(b>=1)txt(`points: ${n}`,X,300,{size:40,weight:800,color:n>30?C.green:C.coral,alpha:ease(P(1)*3)});
  if(b===1)txt(n<12?'looks like a hexagon…':'looks like a circle!',X,345,{size:26,weight:700,color:C.muted});
  if(b>=2){const a=ease(P(2)*2);const px=cx+170,py=cy-110;const d=Math.hypot(px-cx,py-cy);const inside=d<r;ctx.save();ctx.globalAlpha=a;
   line(cx,cy,px,py,inside?C.green:C.coral,3,[8,6]);dot(px,py,13,inside?C.green:C.coral);
   txt('d = √(dx² + dy²) = '+d.toFixed(0),X,420,{size:28,weight:800,font:MONO});txt('r = '+r.toFixed(0),X,465,{size:28,weight:800,font:MONO});
   txt(inside?'d < r → safe':'d > r → losing health',X,525,{size:34,weight:800,color:inside?C.green:C.coral});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const gx=110,gy=600;line(60,gy,1220,gy,C.ink,4);person(gx-40,gy,C.ink);dot(gx,gy-40,10,'#B3372F');
  if(b===0||(b>=1&&P(1)<.2)){const a=b===0?ease(p*2):1-ease(P(1)*5);const th=Math.PI/4,L=260,oy=gy-40;
   ctx.save();ctx.globalAlpha=a;ctx.translate(gx,oy);ctx.rotate(-th);arrow(0,0,L,C.ink,1);ctx.restore();
   ctx.save();ctx.globalAlpha=a;line(gx,oy,gx+L*Math.cos(th),oy,C.green,6);line(gx+L*Math.cos(th),oy,gx+L*Math.cos(th),oy-L*Math.sin(th),C.gold,6,[10,6]);
   txt('v cos θ  (forward)',gx+20,oy+36,{size:26,weight:800,color:C.green});txt('v sin θ  (up)',gx+L*Math.cos(th)+18,oy-L*Math.sin(th)/2,{size:26,weight:800,color:'#7A600A'});ctx.restore();}
  if(b>=1){const Rm=1000;[30,60,80,45].forEach((deg,i)=>{const th=deg*DEG,R=Rm*Math.sin(2*th),Hh=R*Math.tan(th)/4;const best=deg===45;
    const s=ease(P(1)*2.2-i*.3);if(s<=0)return;ctx.beginPath();for(let k=0;k<=s;k+=.01){const x=gx+R*k,y=gy-40-4*Hh*k*(1-k)+40*k;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.strokeStyle=best?C.gold:'#9DB3D6';ctx.lineWidth=best?6:3;ctx.stroke();});
   if(P(1)>.8){txt('30° & 60°',gx+Rm*Math.sin(60*DEG),gy+34,{size:22,weight:800,align:'center',color:C.muted});txt('80°',gx+Rm*Math.sin(160*DEG),gy+34,{size:22,weight:800,align:'center',color:C.muted});txt('45°',gx+Rm,gy+34,{size:28,weight:800,align:'center',color:'#7A600A'});}
   txt('45° goes farthest',760,140,{size:40,weight:800,color:'#7A600A',alpha:ease(P(1)*3-2)});txt('range = v² · sin(2θ) ÷ g',760,190,{size:28,weight:800,font:MONO,alpha:ease(P(1)*3-2)});}
  if(b>=2)banner('Same maths: sprinklers, fountains, rockets',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  box(60,110,600,b>=2?300:170,16,'#16294F');const L=[['> Math.sin(90)','#FFFFFF'],['0.8939966636005579','#F28B76']];if(b>=2)L.push(['> Math.sin(90 * Math.PI / 180)','#FFFFFF'],['1','#7EE0A1']);
  L.forEach(([s,c],i)=>{ctx.save();ctx.font=`600 24px ${MONO}`;ctx.fillStyle=c;ctx.fillText(s,84,160+i*52);ctx.restore();});
  if(b===0)txt('Expected 1. Got 0.894?!',60,340,{size:34,weight:800,color:C.coral,alpha:ease(p*2-.5)});
  if(b>=1){const a=ease(P(1)*2);const cx=930,cy=390,R=190;ctx.save();ctx.globalAlpha=a;ring(cx,cy,R,C.ink,3);line(cx,cy,cx+R,cy,C.ink,4);line(cx,cy,cx+R*Math.cos(-1),cy+R*Math.sin(-1),C.ink,4);
   ctx.beginPath();ctx.arc(cx,cy,R,-1,0);ctx.strokeStyle=C.gold;ctx.lineWidth=9;ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,40,-1,0);ctx.strokeStyle=C.coral;ctx.lineWidth=4;ctx.stroke();
   txt('radius',cx+R/2,cy+30,{size:22,weight:800,align:'center'});txt('gold arc = radius',cx,cy-R-24,{size:24,weight:800,align:'center',color:'#7A600A'});txt('1 rad ≈ 57.3°',cx+50,cy-20,{size:22,weight:800,color:C.coral});
   txt('180° = π rad     360° = 2π rad',cx,cy+R+60,{size:26,weight:800,align:'center',font:MONO});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);txt('radians = degrees × π ÷ 180',60,480,{size:32,weight:800,color:C.green,font:MONO,alpha:a});txt('arc = radius × angle   (only in radians)',60,530,{size:26,weight:800,alpha:a});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const x=Math.PI/6;
  txt('sin 30° using only × and +',70,110,{size:36,weight:800});txt('x = 30 × π ÷ 180 = 0.5236',70,165,{size:30,weight:800,font:MONO,color:C.green,alpha:ease(P(0)*2-.4)});
  const rows=[['Step 1','x','+0.523599',x],['Step 2','− x³ ÷ 6','−0.023925',x-x**3/6],['Step 3','+ x⁵ ÷ 120','+0.000328',x-x**3/6+x**5/120]];
  const shown=b<1?0:b>1?3:Math.ceil(3*ease(p*1.2));
  box(70,200,640,60+shown*70,14,C.white,C.ink,2);['Step','Term','Adds','Running total'].forEach((h,i)=>txt(h,[95,210,380,540][i],240,{size:22,weight:800,color:C.muted}));
  rows.slice(0,shown).forEach(([s1,t1,v,tot],i)=>{const y=300+i*70;txt(s1,95,y,{size:24,weight:800});txt(t1,210,y,{size:26,weight:800,font:MONO});txt(v,380,y,{size:24,weight:700,font:MONO,color:C.muted});txt(tot.toFixed(4),540,y,{size:28,weight:800,font:MONO,color:i===2?C.green:C.ink});});
  const bx=800,by=620,bh=400,bw=110;line(bx-20,by,bx+bw*3+60,by,C.ink,2);const tgt=by-.5*bh/.55;line(bx-20,tgt,bx+bw*3+60,tgt,C.coral,2,[8,6]);txt('true sin 30° = 0.5',bx+bw*3+60,tgt-10,{size:20,weight:800,align:'right',color:C.coral});
  rows.slice(0,shown).forEach(([s1,,,tot],i)=>{const h=tot*bh/.55;box(bx+i*(bw+15),by-h,bw,h,8,i===2?C.green:'#9DB3D6');txt(s1,bx+i*(bw+15)+bw/2,by+28,{size:20,weight:800,align:'center'});});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(70,560,660,120,14,'#FBF5E1',C.gold,3);txt('sin x ≈ x − x³/6 + x⁵/120 − …',95,610,{size:30,weight:800,font:MONO});txt('powers of x added together = a polynomial',95,655,{size:24,weight:800,color:'#7A600A'});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const a0=ease(P(0)*2);ctx.save();ctx.globalAlpha=a0;box(70,120,340,440,20,'#F5ECD7',C.gold,3);
  for(let i=0;i<6;i++){box(100,170+i*62,280,40,8,'#E9D6A8');line(115,190+i*62,365,190+i*62,'#B8955A',2);}
  txt('Madhava',240,600,{size:34,weight:800,align:'center'});txt('Kerala · 1300s',240,640,{size:24,weight:800,align:'center',color:C.muted});ctx.restore();
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(460,120,360,440,20,'#101B33');
   for(let i=0;i<40;i++){const sx=480+(i*67)%320,sy=140+(i*41)%400;dot(sx,sy,1.6,'#fff');}
   dot(640,300,54,'#F2C14E');dot(640+18*Math.sin(t/900),300,50,'#101B33');ring(640,300,54,'#F2C14E',2);
   dot(520,480,10,'#E8845C');dot(760,200,7,'#9FC5F8');txt('planets, eclipses,',640,470,{size:24,weight:800,align:'center',color:'#fff'});txt('calendar dates',640,505,{size:24,weight:800,align:'center',color:'#fff'});
   txt('needed accurate sine',640,600,{size:26,weight:800,align:'center'});ctx.restore();arrow(420,340,450,C.gold,a);}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(870,120,340,440,20,C.white,C.ink,2);
   [['Calculators','🧮'],['Phones','📱'],['Game engines','🎮'],['GPS chips','📍']].forEach(([s1,e],i)=>{txt(e,910,200+i*95,{size:40});txt(s1,970,195+i*95,{size:28,weight:800});});
   txt('today',1040,600,{size:26,weight:800,align:'center'});ctx.restore();arrow(830,340,860,C.gold,a);}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Part A: remember three things',160,150,{size:44,weight:800});
  ['Ratios of a triangle. Only the angle matters.','Circle: sin θ = height, cos θ = sideways.','Machines: radians + a fast polynomial.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;
   ctx.save();ctx.globalAlpha=a;dot(190,y-10,26,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(178,y-10);ctx.lineTo(187,y);ctx.lineTo(204,y-22);ctx.stroke();txt(s,240,y,{size:34,weight:700});ctx.restore();});
  if(b>=2)banner('🎮 Mission: moveToward(x, y, angle, speed)',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('sin & cos',120,260,{size:120,weight:800});txt('Part A: from zero, to games and code',120,340,{size:40,weight:700,color:C.coral});
 txt('About 6 minutes. Tamil and English.',120,400,{size:26,color:C.muted});
 ctx.beginPath();for(let x=0;x<=460;x+=3){const y=540-60*Math.sin(x/60);x?ctx.lineTo(120+x,y):ctx.moveTo(120+x,y);}ctx.strokeStyle=C.gold;ctx.lineWidth=6;ctx.stroke();
 ctx.beginPath();ctx.moveTo(820,560);ctx.lineTo(1160,560);ctx.lineTo(1160,360);ctx.closePath();ctx.fillStyle='rgba(201,162,31,.15)';ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=5;ctx.stroke();}

  return { draws, titleFrame, paper };
}
