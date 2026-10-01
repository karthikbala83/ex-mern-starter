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

const PKG=[3.2,3.5,3.5,3.6,3.8,4.0,4.2,4.5,5.0,45];
const sum=a=>a.reduce((s,x)=>s+x,0),mean=a=>sum(a)/a.length,med=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
const SECA=[55,57,58,59,60,60,61,62,63,65],SECB=[20,30,45,55,60,60,65,75,90,100];
const sd=a=>{const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)));};
const LAT=(()=>{const r=mulberry(5);return Array.from({length:1000},()=>Math.round(120*Math.exp(1.15*Math.sqrt(-2*Math.log(r()+1e-9))*Math.cos(TAU*r())*0.55+0.4)));})();
const LATS=[...LAT].sort((a,b)=>a-b),LATMEAN=mean(LAT),P95=LATS[Math.floor(0.95*LAT.length)];
const BELL=(()=>{const r=mulberry(11);const c=new Array(51).fill(0);const raw=[];for(let s=0;s<2000;s++){let k=0;for(let q=0;q<50;q++)if(r()<0.6)k++;c[k]++;raw.push(k);}const m=mean(raw),d=sd(raw);const within=raw.filter(x=>Math.abs(x-m)<=d).length/raw.length;return {c,m,d,within};})();
function card(x,y,w,h,v,hi,col){box(x,y,w,h,10,hi?'#FBF5E1':C.white,hi?C.gold:C.gridMajor,hi?3:2);txt(String(v),x+w/2,y+h/2+10,{size:26,weight:800,align:'center',color:col||C.ink});}
function tick(x,y,a){ctx.save();ctx.globalAlpha=a;dot(x,y,22,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-3,y+9);ctx.lineTo(x+12,y-10);ctx.stroke();ctx.restore();}


  const draws = [
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  box(70,90,420,520,20,'#16294F');txt('PLACEMENTS 2026',280,160,{size:30,weight:800,align:'center',color:'#9FB6DE'});txt('Average package',280,250,{size:30,weight:800,align:'center',color:'#fff'});
  txt('₹8 LPA',280,350,{size:96,weight:800,align:'center',color:'#F2C14E'});txt('★ ★ ★ ★ ★',280,430,{size:30,align:'center',color:'#F2C14E'});txt('Join us!',280,520,{size:28,weight:800,align:'center',color:'#fff'});
  if(b>=1){const a=ease(P(1)*2);const ox=560,oy=600,bw=58,sc=470/45;ctx.save();ctx.globalAlpha=a;txt('Actual offers (₹ lakh per year)',ox,110,{size:24,weight:800});
   PKG.forEach((v,i)=>{const h=v*sc*ease(P(1)*3-i*.15);box(ox+i*(bw+8),oy-h,bw,h,6,v>10?C.coral:'#9DB3D6');txt(String(v),ox+i*(bw+8)+bw/2,oy-h-8,{size:18,weight:800,align:'center',color:v>10?C.coral:C.ink});});
   line(ox-10,oy,ox+10*(bw+8),oy,C.ink,2);ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);const ox=560,sc=470/45;ctx.save();ctx.globalAlpha=a;
   [[mean(PKG),C.coral,'mean 8.03',-10],[med(PKG),C.green,'median 3.9',26]].forEach(([v,c,l,dy])=>{const y=600-v*sc;line(ox-10,y,ox+10*66,y,c,3,[8,6]);txt(l,ox+150,y+dy,{size:22,weight:800,color:c});});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=100,w=1080,X=v=>ox+v/50*w,ly=420;
  txt('mean = sum ÷ count = 80.3 ÷ 10 = 8.03',100,140,{size:34,weight:800,font:MONO,alpha:ease(P(0)*2)});
  const stack={};PKG.forEach(v=>{const k=Math.round(v);stack[k]=(stack[k]||0)+1;const y=ly-14-(stack[k]-1)*28;dot(X(v),y,12,v>10?C.coral:C.ink);});
  if(b>=1){const a=ease(P(1)*2);const m=b>=2?mean(PKG):mean(PKG.slice(0,9));const tilt=b>=2?0:0;ctx.save();ctx.globalAlpha=a;line(ox-20,ly,ox+w+20,ly,'#8B6B3D',8);
   ctx.beginPath();ctx.moveTo(X(m),ly+4);ctx.lineTo(X(m)-30,ly+60);ctx.lineTo(X(m)+30,ly+60);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();
   txt('balance point',X(m),ly+95,{size:22,weight:800,align:'center',color:'#7A600A'});ctx.restore();}
  [0,10,20,30,40,50].forEach(v=>txt(v+'',X(v),ly+140,{size:18,align:'center',color:C.muted}));txt('₹ lakh',ox+w,ly+170,{size:18,align:'right',color:C.muted});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;const m9=mean(PKG.slice(0,9));line(X(m9),ly-120,X(m9),ly+10,C.green,3,[6,6]);txt('without the 45: 3.9',X(m9),ly-130,{size:22,weight:800,align:'center',color:C.green});
   arrow(X(m9)+20,ly-60,X(mean(PKG))-10,C.coral,1);txt('with it: 8.03',X(mean(PKG))+20,ly-50,{size:24,weight:800,color:C.coral});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const big=b>=2&&P(2)>.3?100:45;const arr=[...PKG.slice(0,9),big];
  const ox=90,cw=100,gap=10,y=230;txt('Sorted offers (₹ lakh)',ox,170,{size:26,weight:800});
  arr.forEach((v,i)=>{const mid=b>=1&&(i===4||i===5);card(ox+i*(cw+gap),y,cw,80,v,mid,v>10?C.coral:C.ink);});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;const cx=ox+5*(cw+gap)-gap/2;line(cx,y-20,cx,y+110,C.green,4);txt('middle',cx,y-30,{size:20,weight:800,align:'center',color:C.green});
   txt('median = (3.8 + 4.0) ÷ 2 = 3.9',ox,420,{size:34,weight:800,font:MONO,color:C.green});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(ox,470,1100,150,16,C.white,C.ink,2);
   txt(`top offer: ${big}`,ox+30,520,{size:28,weight:800,color:C.coral});txt(`mean: ${mean(arr).toFixed(2)}`,ox+400,520,{size:28,weight:800,color:C.coral});txt(`median: ${med(arr).toFixed(1)}`,ox+720,520,{size:28,weight:800,color:C.green});
   txt('The median does not move. That is why salaries are reported as medians.',ox+30,585,{size:24,weight:800});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const sizes=[['S',12],['M',38],['L',27],['XL',9]];const ox=140,oy=580,bw=150,sc=10;
  txt('Fest T-shirt orders (86 students)',ox,130,{size:28,weight:800});line(ox-20,oy,ox+4*(bw+40),oy,C.ink,2);
  sizes.forEach(([s,n],i)=>{const h=n*sc*ease(P(0)*2-i*.2);const isM=b>=1&&s==='M';const x=ox+i*(bw+40);
   ctx.beginPath();ctx.moveTo(x+30,oy-h);ctx.lineTo(x+bw-30,oy-h);ctx.lineTo(x+bw,oy-h+30);ctx.lineTo(x+bw-20,oy-h+50);ctx.lineTo(x+bw-20,oy);ctx.lineTo(x+20,oy);ctx.lineTo(x+20,oy-h+50);ctx.lineTo(x,oy-h+30);ctx.closePath();
   ctx.fillStyle=isM?C.gold:'#9DB3D6';if(h>40)ctx.fill();txt(s,x+bw/2,oy+36,{size:28,weight:800,align:'center'});if(h>40)txt(String(n),x+bw/2,oy-h-12,{size:24,weight:800,align:'center',color:isM?'#7A600A':C.ink});});
  if(b>=1)txt('mode = M',980,250,{size:44,weight:800,color:'#7A600A',alpha:ease(P(1)*2)});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(900,320,320,170,16,'#FBEDEA',C.coral,3);txt('mean size = M.4 ?',925,370,{size:28,weight:800,color:C.coral});txt('No such T-shirt!',925,415,{size:26,weight:800});txt('Categories → mode',925,460,{size:26,weight:800,color:C.green});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=120,w=1040,X=v=>ox+v/100*w;
  [[SECA,'Section A',250,C.green],[SECB,'Section B',470,C.coral]].forEach(([arr,name,y,c],r)=>{txt(name,ox,y-70,{size:28,weight:800});line(ox,y,ox+w,y,C.gridMajor,3);
   const st={};arr.forEach((v,i)=>{const a=ease(P(0)*3-i*.12);if(a<=0)return;st[v]=(st[v]||0)+1;ctx.save();ctx.globalAlpha=a;dot(X(v),y-14-(st[v]-1)*26,11,c);ctx.restore();});
   line(X(60),y-80,X(60),y+18,C.ink,3,[6,6]);txt('mean 60',X(60),y+44,{size:20,weight:800,align:'center'});
   if(b>=1){const a=ease(P(1)*2);const lo=Math.min(...arr),hi=Math.max(...arr);ctx.save();ctx.globalAlpha=a;line(X(lo),y+70,X(hi),y+70,c,4);txt(`range ${hi-lo}`,X(hi)+12,y+78,{size:22,weight:800,color:c});ctx.restore();}
   if(b>=2){const a=ease(P(2)*2);const d=sd(arr);ctx.save();ctx.globalAlpha=a*.25;box(X(60-d),y-60,X(60+d)-X(60-d),70,8,c);ctx.restore();txt(`SD ≈ ${d.toFixed(1)}`,X(60+d)+12,y-30,{size:22,weight:800,color:c,alpha:a});}});
  [0,20,40,60,80,100].forEach(v=>txt(String(v),X(v),640,{size:18,align:'center',color:C.muted}));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const vals=[68,72,75,78,80,81,83,85,86,88,90,92,95,12];const ox=100,w=880,X=v=>ox+v/100*w,y=380;
  txt('Attendance % for one class',ox,150,{size:28,weight:800});line(ox,y,ox+w,y,C.gridMajor,3);[0,25,50,75,100].forEach(v=>txt(v+'%',X(v),y+40,{size:18,align:'center',color:C.muted}));
  vals.forEach((v,i)=>{const isOut=v===12;dot(X(v),y-16,12,isOut&&b>=2?'#E8A33C':C.ink);});
  box(1020,y-60,180,90,14,b>=1?'#FBEDEA':C.white,C.coral,3);txt('750%',1110,y-5,{size:36,weight:800,align:'center',color:C.coral});arrow(ox+w+10,y-16,1015,C.coral,1);
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;txt('mistake → typo for 75%',1110,y+70,{size:22,weight:800,align:'center',color:C.coral});txt('fix it',1110,y+100,{size:22,weight:800,align:'center',color:C.coral});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;txt('12%: real? hospital?',X(12),y-60,{size:22,weight:800,align:'center',color:'#B87A1F'});txt('investigate, keep it',X(12),y-32,{size:22,weight:800,align:'center',color:'#B87A1F'});
   box(ox,500,880,110,14,C.white,C.ink,2);txt('Mistake → fix.  Real but rare → keep, report the median.',ox+24,565,{size:26,weight:800});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  if(b===0){const a=ease(p*2);const ox=100,w=1080,y=380;ctx.save();ctx.globalAlpha=a;txt('Model exam: 60 students, sorted by marks',ox,150,{size:28,weight:800});
   for(let i=0;i<60;i++){const x=ox+i*(w/60);const you=i===54;box(x,y-(20+i*3.4),w/60-4,20+i*3.4,3,i<54?'#9DB3D6':you?C.gold:'#C9D6EA');}
   const xm=ox+54*(w/60);txt('you: 72 marks',xm,y-230,{size:24,weight:800,align:'center',color:'#7A600A'});txt('higher than 54 of 60 = 90th percentile',640,y+70,{size:30,weight:800,align:'center'});ctx.restore();return;}
  const ox=100,oy=560,w=1060,h=360,maxv=1400,bins=35;const c=new Array(bins).fill(0);LAT.forEach(v=>{const k=Math.min(bins-1,Math.floor(v/maxv*bins));c[k]++;});const mc=Math.max(...c);
  txt('1,000 response times (ms)',ox,130,{size:28,weight:800});line(ox,oy,ox+w,oy,C.ink,2);
  c.forEach((n,i)=>{const hh=n/mc*h*ease(P(1)*2);const x=ox+i*w/bins;box(x,oy-hh,w/bins-3,hh,3,(i+.5)/bins*maxv>P95?C.coral:'#9DB3D6');});
  [0,200,400,600,800,1000,1200,1400].forEach(v=>txt(String(v),ox+v/maxv*w,oy+26,{size:16,align:'center',color:C.muted}));
  [[LATMEAN,C.green,`mean ${Math.round(LATMEAN)} ms`],[P95,C.coral,`p95 ${P95} ms`]].forEach(([v,col,l],i)=>{const x=ox+v/maxv*w;line(x,oy-h-10,x,oy,col,3,[6,6]);txt(l,x+8,oy-h+10+i*34,{size:24,weight:800,color:col});});
  if(b>=2)banner('Alert on p95 / p99, not the mean: the slowest users leave',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=120,oy=560,w=1040,h=380,lo=15,hi=45;const mc=Math.max(...BELL.c);const X=v=>ox+(v-lo)/(hi-lo)*w;
  txt('2,000 students, 50 questions, 60% chance each',ox,120,{size:28,weight:800});line(ox,oy,ox+w,oy,C.ink,2);
  const grow=ease(P(0)*1.5);for(let k=lo;k<=hi;k++){const n=BELL.c[k];const hh=n/mc*h*grow;const inBand=b>=2&&Math.abs(k-BELL.m)<=BELL.d;box(X(k)-w/(hi-lo)/2+2,oy-hh,w/(hi-lo)-4,hh,3,inBand?C.green:'#9DB3D6');}
  for(let k=lo;k<=hi;k+=5)txt(String(k),X(k),oy+26,{size:16,align:'center',color:C.muted});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;ctx.beginPath();for(let v=lo;v<=hi;v+=.2){const y=oy-h*Math.exp(-((v-BELL.m)**2)/(2*BELL.d**2));v===lo?ctx.moveTo(X(v),y):ctx.lineTo(X(v),y);}ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.stroke();ctx.restore();}
  if(b>=2)txt(`within 1 SD (${(BELL.m-BELL.d).toFixed(0)}–${(BELL.m+BELL.d).toFixed(0)}): ${(BELL.within*100).toFixed(0)}% of students`,ox+w,170,{size:26,weight:800,align:'right',color:C.green,alpha:ease(P(2)*2)});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['🏏 Cricket','average vs strike rate',0],['💼 Placements','median, not mean',1],['📋 Attendance','below 75% flagged',1],['⚡ App speed','p95, p99 alerts',1],['🤖 ML','scale by mean and SD',1],['🎮 Leaderboard','the typical player',2]];
  cards.forEach(([h,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%3)*.4);if(a<=0)return;const x=90+(i%3)*375,y=130+Math.floor(i/3)*240;ctx.save();ctx.globalAlpha=a;
   box(x,y,345,200,18,k===2?'#FBF5E1':C.white,k===2?C.gold:C.ink,k===2?3:2);txt(h,x+24,y+70,{size:32,weight:800});txt(s,x+24,y+130,{size:24,weight:700,color:C.muted});ctx.restore();});
  if(b>=2)banner('🎮 leaderboardStats   ·   🏢 attendanceReport',ease(P(2)*2-.4));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Mean drifts, median stays, mode for categories.','Spread: range and standard deviation.','Percentiles and p95: where you stand.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;tick(190,y-10,a);txt(s,240,y,{size:34,weight:700,alpha:a});});
 }
  ];
function titleFrame(){paper();txt('Statistics',120,260,{size:110,weight:800});txt('Why the average lies',120,340,{size:44,weight:700,color:C.coral});txt('About 6 minutes. Tamil and English.',120,400,{size:26,color:C.muted});
 const xs=[20,24,27,29,30,31,33,36,40];xs.forEach((v,i)=>box(760+i*48,560-Math.exp(-((v-30)**2)/40)*260,40,Math.exp(-((v-30)**2)/40)*260,6,i===4?C.gold:'#9DB3D6'));}

  return { draws, titleFrame, paper };
}
