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

const HOUSE=[[-1,-1],[1,-1],[1,0.6],[0,1.5],[-1,0.6]];
const rot=(p,deg)=>{const r=deg*DEG;return [p[0]*Math.cos(r)-p[1]*Math.sin(r),p[0]*Math.sin(r)+p[1]*Math.cos(r)];};
const mul=(M,p)=>[M[0][0]*p[0]+M[0][1]*p[1],M[1][0]*p[0]+M[1][1]*p[1]];
const PEOPLE={Priya:[5,1,0,4],Arun:[4,0,1,5],Kavin:[0,5,5,0]};const TAGS=['coding','music','sports','art'];
const cosSim=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0)/Math.hypot(...a)/Math.hypot(...b);
function tick(x,y,a){ctx.save();ctx.globalAlpha=a;dot(x,y,22,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-3,y+9);ctx.lineTo(x+12,y-10);ctx.stroke();ctx.restore();}
function vec(x0,y0,x1,y1,col,lw){line(x0,y0,x1,y1,col,lw||5);const a=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-18*Math.cos(a-.4),y1-18*Math.sin(a-.4));ctx.lineTo(x1-18*Math.cos(a+.4),y1-18*Math.sin(a+.4));ctx.closePath();ctx.fillStyle=col;ctx.fill();}
function grid2(cx,cy,s,n){for(let i=-n;i<=n;i++){line(cx+i*s,cy-n*s,cx+i*s,cy+n*s,i===0?C.gridMajor:'rgba(203,215,234,.5)',i===0?2:1);line(cx-n*s,cy+i*s,cx+n*s,cy+i*s,i===0?C.gridMajor:'rgba(203,215,234,.5)',i===0?2:1);}}
function shape(pts,cx,cy,s,fill,stroke){ctx.beginPath();pts.forEach(([x,y],i)=>{const X=cx+x*s,Y=cy-y*s;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=stroke||C.ink;ctx.lineWidth=4;ctx.stroke();}
function matrixBox(x,y,M,col,dec){box(x,y,dec?320:230,130,12,'#16294F');ctx.font=`700 ${dec?26:30}px ${MONO}`;ctx.fillStyle=col||'#fff';const f=v=>(dec?v.toFixed(dec):String(v)).padStart(dec?5:2,' ');ctx.fillText(`[ ${f(M[0][0])}  ${f(M[0][1])} ]`,x+16,y+52);ctx.fillText(`[ ${f(M[1][0])}  ${f(M[1][1])} ]`,x+16,y+102);}


  const draws = [
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(70,100,360,440,18,C.white,C.ink,2);txt('game character',250,140,{size:22,weight:800,align:'center'});const ang=t/30;
  const pts=[...Array(14)].map((_,i)=>rot([Math.cos(i/14*TAU)*1.2,Math.sin(i/14*TAU)*.6+((i%3)-1)*.4],ang));pts.forEach(([x,y])=>dot(250+x*110,330-y*110,7,C.gold));shape(rot([0,0],0)&&HOUSE.map(q=>rot(q,ang)),250,330,60,'rgba(201,162,31,.12)');
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(460,100,360,440,18,C.white,C.ink,2);txt('photo',640,140,{size:22,weight:800,align:'center'});
   for(let i=0;i<8;i++)for(let j=0;j<8;j++){const v=Math.round(120+80*Math.sin(i*.7+j*.5));const br=Math.min(255,v+60*(.5+.5*Math.sin(t/800)));ctx.fillStyle=`rgb(${br},${br},${br})`;ctx.fillRect(500+j*36,170+i*36,34,34);}
   box(850,100,360,440,18,C.white,C.ink,2);txt('"students like you…"',1030,140,{size:22,weight:800,align:'center'});[['Priya',C.gold],['Arun',C.green],['Kavin',C.coral]].forEach(([n,c],i)=>{txt(n,900,220+i*100,{size:24,weight:800,color:c});txt('['+PEOPLE[n].join(', ')+']',1010,220+i*100,{size:24,weight:800,font:MONO});});ctx.restore();}
  if(b>=2)banner('Vectors + matrices = sin, cos and Pythagoras at work',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=200,cy=520,s=75;grid2(cx+150,cy-150,s,5);
  const a=ease(P(0)*2);vec(cx,cy,cx+3*s*a,cy-4*s*a,C.ink,6);if(a>.9){line(cx,cy,cx+3*s,cy,C.green,4,[8,6]);line(cx+3*s,cy,cx+3*s,cy-4*s,C.gold,4,[8,6]);txt('3 east',cx+1.5*s,cy+30,{size:22,weight:800,align:'center',color:C.green});txt('4 north',cx+3*s+12,cy-2*s,{size:22,weight:800,color:'#7A600A'});}
  if(b>=1)txt('length = √(3² + 4²) = 5',cx+20,cy-4*s-30,{size:28,weight:800,color:C.coral,alpha:ease(P(1)*2)});
  const X=760;txt('[3, 4]',X,180,{size:56,weight:800,font:MONO,alpha:a});
  if(b>=2){const al=ease(P(2)*2);ctx.save();ctx.globalAlpha=al;[['position','[x, y]'],['speed','[vx, vy]'],['colour','[R, G, B]'],['interests','[coding, music, sports, art]']].forEach(([l,v],i)=>{txt(l,X,270+i*80,{size:24,weight:800,color:C.muted});txt(v,X,305+i*80,{size:24,weight:800,font:MONO});});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=140,cy=560,s=70;grid2(cx+210,cy-210,s,4);
  const a=ease(P(0)*2);vec(cx,cy,cx+3*s*a,cy-1*s*a,C.green,5);if(a>.5)vec(cx+3*s,cy-s,cx+3*s+1*s*ease(a*2-1),cy-s-3*s*ease(a*2-1),C.gold,5);if(a>.9){vec(cx,cy,cx+4*s,cy-4*s,C.coral,3);txt('[3,1] + [1,3] = [4,4]',cx,cy-5*s,{size:26,weight:800,font:MONO,color:C.coral});}
  if(b>=1){const al=ease(P(1)*2);ctx.save();ctx.globalAlpha=al;const X=720;vec(X,520,X+2*70,520-1*70,C.ink,5);vec(X,600,X+4*70,600-2*70,C.coral,5);txt('[2, 1]',X+150,450,{size:24,weight:800,font:MONO});txt('2 × [2, 1] = [4, 2]',X+290,470,{size:24,weight:800,font:MONO,color:C.coral});ctx.restore();}
  if(b>=2){const al=ease(P(2)*2);ctx.save();ctx.globalAlpha=al;box(690,120,540,150,16,'#16294F');ctx.font=`700 24px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('pos = pos + speed × dt',716,175);ctx.fillStyle='#9FB6DE';ctx.fillText('// every object, every frame',716,220);
   const bx=720+((t/6)%460);dot(bx,320,16,C.gold);vec(bx+20,320,bx+80,320,C.gold,3);ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=330,cy=380,s=70;grid2(cx,cy,s,4);
  const k=b>=2?1+ease(P(2)*1.5):1;const M=[[k,0],[0,k]];shape(HOUSE.map(q=>mul(M,q)),cx,cy,s,'rgba(201,162,31,.18)',C.ink);HOUSE.forEach(q=>{const [x,y]=mul(M,q);dot(cx+x*s,cy-y*s,7,C.coral);});
  matrixBox(720,140,b>=2?[[2,0],[0,2]]:[['a','b'],['c','d']].map(r=>r),C.gold);
  if(b>=1){const al=ease(P(1)*2);ctx.save();ctx.globalAlpha=al;txt('new x = a·x + b·y',720,350,{size:30,weight:800,font:MONO});txt('new y = c·x + d·y',720,400,{size:30,weight:800,font:MONO});ctx.restore();}
  if(b>=2)txt('every corner × matrix → 2× bigger',720,490,{size:26,weight:800,color:C.coral,alpha:ease(P(2)*2)});
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=330,cy=380,s=150;grid2(cx,cy,s/2,4);
  const deg=b===2?90*ease(p*1.4):b>=1?40+40*Math.sin(t/1500):35;const r=deg*DEG;ring(cx,cy,s,C.gridMajor,2,[6,6]);
  shape(HOUSE.map(q=>rot([q[0]*.45,q[1]*.45],deg)),cx,cy,s,'rgba(84,123,92,.15)',C.green);
  const [px,py]=rot([1,0],deg);vec(cx,cy,cx+s,cy,C.gridMajor,3);vec(cx,cy,cx+px*s,cy-py*s,C.coral,5);dot(cx+px*s,cy-py*s,10,C.coral);
  if(b>=1){line(cx+px*s,cy,cx+px*s,cy-py*s,C.gold,4,[6,5]);line(cx,cy,cx+px*s,cy,C.green,4,[6,5]);}
  txt(`θ = ${deg.toFixed(0)}°`,cx-s,cy-s-20,{size:26,weight:800,color:C.coral});
  matrixBox(720,140,[[Math.cos(r),-Math.sin(r)],[Math.sin(r),Math.cos(r)]],'#fff',2);txt('[ cos θ   −sin θ ]',720,330,{size:24,weight:800,font:MONO,color:'#7A600A'});txt('[ sin θ    cos θ ]',720,365,{size:24,weight:800,font:MONO,color:'#7A600A'});
  txt(`(1, 0) → (${px.toFixed(2)}, ${py.toFixed(2)})`,720,450,{size:30,weight:800,font:MONO,color:C.coral});
  if(b>=2)txt('games · maps · screen rotation',720,520,{size:24,weight:800,color:C.muted,alpha:ease(P(2)*2)});
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const S=[[1.8,0],[0,1]];
  const panel=(x0,label,f,col)=>{box(x0,110,540,420,16,C.white,C.gridMajor,2);txt(label,x0+20,150,{size:22,weight:800,color:col});const cx=x0+270,cy=330;grid2(cx,cy,30,6);shape(HOUSE.map(f),cx,cy,60,'rgba(201,162,31,.18)',col);};
  if(b===0){panel(60,'rotate 45°, then stretch x by 1.8',q=>mul(S,rot(q,45)),C.ink);const a=ease(p*2);ctx.save();ctx.globalAlpha=a;box(660,180,560,280,16,'#16294F');ctx.font=`700 26px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('Stretch × Rotate = One matrix',690,240);ctx.fillStyle='#F2D27A';ctx.fillText('apply once to every point',690,300);ctx.restore();return;}
  if(b===1){panel(60,'rotate, then stretch',q=>mul(S,rot(q,45)),C.ink);panel(680,'stretch, then rotate',q=>rot(mul(S,q),45),C.coral);txt('different shapes!',640,600,{size:30,weight:800,align:'center',color:C.coral,alpha:ease(p*2)});return;}
  const n=Math.ceil(400*ease(p*1.2));const ang=t/40;for(let i=0;i<n;i++){const u=(i*137.5)%360,rr=Math.sqrt(i/400);const [x,y]=rot([Math.cos(u*DEG)*rr,Math.sin(u*DEG)*rr*.6],ang);dot(330+x*230,360-y*230,3,C.gold);}
  box(700,180,520,300,16,'#FBF5E1',C.gold,3);txt('GPU: one matrix,',730,250,{size:32,weight:800});txt('millions of points',730,300,{size:32,weight:800,color:C.coral});txt('at the same time',730,350,{size:32,weight:800});txt('graphics → and now AI',730,420,{size:26,weight:800,color:C.muted});
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const IMG=[...Array(10)].map((_,i)=>[...Array(10)].map((_,j)=>{const d=Math.hypot(i-4.5,j-4.5);let v=d<4.4?210:40;if((i===3&&(j===3||j===6)))v=30;if(i===6&&j>=3&&j<=6)v=60;return v;}));
  const mode=b===0?'raw':b===1?['bright','contrast','gray'][Math.floor(t/1800)%3]:'blur';
  const val=(i,j)=>{const v=IMG[i][j];if(mode==='bright')return Math.min(255,v+60);if(mode==='contrast')return Math.max(0,Math.min(255,(v-128)*1.8+128));if(mode==='blur'){let s=0,n=0;for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++){const r=i+a,q=j+c;if(r>=0&&r<10&&q>=0&&q<10){s+=IMG[r][q];n++;}}return s/n;}return v;};
  for(let i=0;i<10;i++)for(let j=0;j<10;j++){const v=Math.round(val(i,j));ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(100+j*44,120+i*44,42,42);if(b===0&&p>.4&&i%3===0&&j%3===0)txt(String(v),100+j*44+21,120+i*44+28,{size:14,weight:800,align:'center',color:v>128?C.ink:'#fff'});}
  const X=640;txt(mode==='raw'?'a grid of numbers 0–255':mode==='bright'?'brighten: + 60':mode==='contrast'?'contrast: × 1.8':mode==='gray'?'grayscale: 0.299R + 0.587G + 0.114B':'blur: average of neighbours',X,160,{size:28,weight:800});
  if(b===1&&mode==='gray'){txt('green counts most:',X,220,{size:24,weight:800,color:C.green});txt('our eyes are most sensitive to it',X,256,{size:22,weight:700,color:C.muted});}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(X,220,560,180,16,'#16294F');ctx.font=`700 22px ${MONO}`;ctx.fillStyle='#fff';['[1/9 1/9 1/9]','[1/9 1/9 1/9]','[1/9 1/9 1/9]'].forEach((r,i)=>ctx.fillText(r,X+24,268+i*40));ctx.fillStyle='#F2D27A';ctx.fillText('← a blur "kernel"',X+260,308);ctx.restore();
   txt('AI learns its own kernels: edges, eyes, faces',X,460,{size:22,weight:800,color:C.coral,alpha:a});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=200,cy=560,L=380;
  const ang={Priya:60,Arun:42,Kavin:-24};const cols={Priya:C.gold,Arun:C.green,Kavin:C.coral};
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;Object.entries(ang).forEach(([n,d])=>{const r=(d+30)*DEG;vec(cx,cy,cx+L*Math.cos(r),cy-L*Math.sin(r),cols[n],6);txt(n,cx+(L+30)*Math.cos(r),cy-(L+30)*Math.sin(r),{size:24,weight:800,color:cols[n],align:'center'});});
   ctx.beginPath();ctx.arc(cx,cy,140,-(ang.Priya+30)*DEG,-(ang.Arun+30)*DEG);ctx.strokeStyle=C.green;ctx.lineWidth=4;ctx.stroke();txt('18°',cx+160,cy-200,{size:24,weight:800,color:C.green});
   ctx.beginPath();ctx.arc(cx,cy,90,-(ang.Priya+30)*DEG,-(ang.Kavin+30)*DEG);ctx.strokeStyle=C.coral;ctx.lineWidth=3;ctx.stroke();txt('84°',cx+100,cy-30,{size:22,weight:800,color:C.coral});ctx.restore();}
  const X=700;txt(TAGS.join(' · '),X,150,{size:20,weight:800,color:C.muted});Object.keys(PEOPLE).forEach((n,i)=>{const a=ease(P(0)*3-i*.4);txt(n,X,210+i*56,{size:26,weight:800,color:cols[n],alpha:a});txt('['+PEOPLE[n].join(', ')+']',X+140,210+i*56,{size:26,weight:800,font:MONO,alpha:a});});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(X,400,520,210,16,'#FBF5E1',C.gold,3);txt('similarity = cos(angle)',X+24,445,{size:26,weight:800});txt('= a·b ÷ (|a| × |b|)',X+24,485,{size:24,weight:800,font:MONO});
   txt(`Priya–Arun  ${cosSim(PEOPLE.Priya,PEOPLE.Arun).toFixed(2)}`,X+24,540,{size:26,weight:800,color:C.green});txt(`Priya–Kavin ${cosSim(PEOPLE.Priya,PEOPLE.Kavin).toFixed(2)}`,X+24,582,{size:26,weight:800,color:C.coral});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['🎮 Games & 3D','rotate, move, animate',0],['📱 Phones','rotation, AR filters, maps',0],['🧠 Neural networks','layers = matrix multiply',1],['🔎 AI search & chat','words as vectors',1],['🌉 Structures','bridges, buildings',2],['🎮🏢 Missions','windmill + club match',2]];
  cards.forEach(([h,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%2)*.5);if(a<=0)return;const x=90+(i%3)*375,y=130+Math.floor(i/3)*240;ctx.save();ctx.globalAlpha=a;
   box(x,y,345,200,18,i===5?'#FBF5E1':C.white,i===5?C.gold:C.ink,i===5?3:2);txt(h,x+24,y+70,{size:28,weight:800});txt(s,x+24,y+130,{size:22,weight:700,color:C.muted});ctx.restore();});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Vector = arrow = list of numbers. Length = Pythagoras.','Matrix moves every point. Rotation = sin & cos.','Photo = matrix. Similarity = cos of the angle.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;tick(190,y-10,a);txt(s,240,y,{size:32,weight:700,alpha:a});});
  if(b>=2)banner('🏆 World 1 complete · 🎮 rotateSprite · 🏢 clubMatch',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('Vectors & matrices',120,250,{size:88,weight:800});txt('Rotating the world',120,330,{size:44,weight:700,color:C.coral});txt('About 6 minutes. Tamil and English.',120,390,{size:26,color:C.muted});
 const cx=960,cy=480;grid2(cx,cy,30,5);shape(HOUSE,cx,cy,60,'rgba(157,179,214,.25)',C.gridMajor);shape(HOUSE.map(q=>rot(q,35)),cx,cy,60,'rgba(201,162,31,.25)',C.ink);}

  return { draws, titleFrame, paper };
}
