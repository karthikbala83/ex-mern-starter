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

const KM=[2,4,5,8,10],FARE=[60,115,140,230,285],BEST=5970/209;
const ERR=w=>KM.reduce((s,x,i)=>s+(w*x-FARE[i])**2,0)/KM.length,GRAD=w=>2/KM.length*KM.reduce((s,x,i)=>s+(w*x-FARE[i])*x,0);
const path=(r,n,w0=0)=>{const p=[w0];let w=w0;for(let i=0;i<n;i++){w=w-r*GRAD(w);p.push(w);}return p;};
const PGOOD=path(0.01,8),PSLOW=path(0.001,8),PBIG=path(0.03,5);
function tick(x,y,a){ctx.save();ctx.globalAlpha=a;dot(x,y,22,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-3,y+9);ctx.lineTo(x+12,y-10);ctx.stroke();ctx.restore();}
function plotF(f,x0,x1,X,Y,col,lw,clip){ctx.save();if(clip){ctx.beginPath();ctx.rect(...clip);ctx.clip();}ctx.beginPath();for(let i=0;i<=200;i++){const x=x0+(x1-x0)*i/200;const px=X(x),py=Y(f(x));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.stroke();ctx.restore();}
// the error valley, drawn on a standard panel
function valley(ox,oy,w,h,wMin,wMax,eMax){const X=v=>ox+(v-wMin)/(wMax-wMin)*w,Y=e=>oy-Math.min(e,eMax*1.08)/eMax*h;line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);
 plotF(ERR,wMin,wMax,X,Y,C.ink,4,[ox,oy-h-6,w+4,h+8]);txt('price per km (w)',ox+w,oy+44,{size:18,align:'right',color:C.muted,weight:700});txt('error',ox-10,oy-h-10,{size:18,color:C.muted,weight:700});
 [0,10,20,30,40,50].filter(v=>v>=wMin&&v<=wMax).forEach(v=>txt('₹'+v,X(v),oy+24,{size:16,align:'center',color:C.muted}));return [X,Y];}
function ball(x,y,col){dot(x,y-14,14,col||C.coral);ring(x,y-14,14,'#fff',3);}


  const draws = [
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const a0=ease(P(0)*2);ctx.save();ctx.globalAlpha=a0*(b>=2?.35:1);box(80,110,520,420,18,C.white,C.ink,2);txt('Try every line',110,160,{size:28,weight:800});
  for(let i=0;i<40;i++){const ang=-.2+((i*37)%40)/40*.9;line(130,470,130+420*Math.cos(ang),470-420*Math.sin(ang)*.6,'rgba(157,179,214,.5)',2);}txt('24,321 tries',110,510,{size:24,weight:800,color:C.coral});ctx.restore();
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a*(b>=2?.35:1);box(660,110,540,420,18,'#FBEDEA',C.coral,3);txt('An AI model',690,160,{size:28,weight:800});txt('1,000,000,000+',930,280,{size:50,weight:800,align:'center',color:C.coral});txt('numbers to learn',930,330,{size:26,weight:800,align:'center'});txt('try every combination? ✗',930,430,{size:26,weight:800,align:'center',color:C.coral});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(240,190,800,300,22,C.white,C.gold,4);const vy=i=>440-150*((i-55)/50)**2;ctx.beginPath();for(let i=0;i<=100;i++){const x=300+i*6.8;i?ctx.lineTo(x,vy(i)):ctx.moveTo(x,vy(i));}ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
   const s=ease((t/2200)%1),i=6+s*49,x=300+i*6.8;ball(x,vy(i));txt('Gradient descent: walk downhill',640,240,{size:30,weight:800,align:'center',color:'#7A600A'});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const ox=90,oy=560,w=500,h=400,X=k=>ox+k/11*w,Y=v=>oy-v/320*h;line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);txt('fare (₹)',ox,oy-h-14,{size:18,color:C.muted,weight:700});txt('km',ox+w,oy+44,{size:18,align:'right',color:C.muted,weight:700});
  KM.forEach((k,i)=>{const a=ease(P(0)*3-i*.3);if(a<=0)return;ctx.save();ctx.globalAlpha=a;dot(X(k),Y(FARE[i]),10,C.ink);txt('₹'+FARE[i],X(k)+12,Y(FARE[i])-8,{size:18,weight:800});ctx.restore();txt(k+'',X(k),oy+24,{size:16,align:'center',color:C.muted});});
  if(b>=1){const wTry=b===1?10+30*(.5+.5*Math.sin(t/1400)):BEST;line(X(0),Y(0),X(11),Y(wTry*11),b>=2?C.green:C.gold,4);KM.forEach((k,i)=>line(X(k),Y(FARE[i]),X(k),Y(wTry*k),C.coral,2));
   txt(`w = ₹${wTry.toFixed(2)} per km`,ox+10,140,{size:26,weight:800,color:b>=2?C.green:'#7A600A'});txt(`error ${Math.round(ERR(wTry)).toLocaleString('en-IN')}`,ox+10,175,{size:22,weight:800,color:C.coral});
   const [VX,VY]=valley(700,560,500,400,0,50,30000);dot(VX(wTry),VY(ERR(wTry)),11,b>=2?C.green:C.coral);
   if(b>=2){txt('bottom: ₹28.56/km',VX(BEST),VY(0)-20,{size:22,weight:800,align:'center',color:C.green,alpha:ease(P(2)*2)});}}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const g=ctx.createLinearGradient(0,60,0,660);g.addColorStop(0,'#DCE6EE');g.addColorStop(1,'#C7D8C0');ctx.fillStyle=g;ctx.fillRect(60,60,1160,600);
  const hill=x=>620-0.0005*(x-760)**2;ctx.beginPath();ctx.moveTo(60,660);for(let x=60;x<=1220;x+=6)ctx.lineTo(x,hill(x));ctx.lineTo(1220,660);ctx.closePath();ctx.fillStyle='#8DAA7E';ctx.fill();
  const steps=b===0?0:b===1?Math.floor(ease(p)*4)+1:8;let x=160;const pts=[x];for(let i=0;i<steps;i++){const slope=0.001*(x-760);x=x-slope*230;pts.push(x);}
  pts.forEach((px,i)=>{if(i>0)line(pts[i-1],hill(pts[i-1])-6,px,hill(px)-6,C.gold,4);dot(px,hill(px)-6,6,C.gold);});
  const fx=pts[pts.length-1];person(fx,hill(fx)-4,C.ink);
  ctx.save();ctx.globalAlpha=.55;for(let i=0;i<7;i++){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(200+i*170+30*Math.sin(t/2000+i),220+40*Math.sin(i),160,50,0,0,7);ctx.fill();}ctx.restore();
  if(b>=1)txt('feel the slope → step downhill → repeat',640,120,{size:30,weight:800,align:'center',alpha:ease(P(1)*2)});
  if(b>=2){txt('steep → big steps',300,620,{size:24,weight:800,color:C.ink});txt('flat → tiny steps',820,620,{size:24,weight:800,color:C.ink});}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const [X,Y]=valley(110,580,700,450,0,50,30000);
  const w=b===0?40:BEST+(b===1?18*Math.sin(t/1600):14*Math.sin(t/1600));const e=ERR(w),s=GRAD(w);const dx=6;
  const sx=(X(w+dx)-X(w-dx)),sy=(Y(e+s*dx)-Y(e-s*dx));const L=Math.hypot(sx,sy);line(X(w)-sx/L*150,Y(e)-sy/L*150,X(w)+sx/L*150,Y(e)+sy/L*150,C.coral,4);ball(X(w),Y(e),C.gold);
  const X0=860;txt('slope here',X0,170,{size:24,weight:800,color:C.muted});txt((s>=0?'+':'')+s.toFixed(0),X0,230,{size:56,weight:800,color:s>0?C.coral:C.green,font:MONO});
  txt(Math.abs(s)<60?'≈ flat: the bottom':s>0?'positive → walk LEFT':'negative → walk RIGHT',X0,280,{size:26,weight:800,color:Math.abs(s)<60?C.green:C.ink});
  if(b>=0)txt('slope = derivative',X0,120,{size:30,weight:800,color:'#7A600A',alpha:ease(P(0)*2)});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(X0-20,340,400,110,14,'#16294F');ctx.font=`700 26px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('slope = 83.6·w − 2388',X0,404);ctx.restore();txt('computers find this automatically',X0,490,{size:22,weight:800,color:C.muted,alpha:a});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const [X,Y]=valley(110,580,700,450,0,50,36000);
  box(860,110,370,90,14,'#16294F');ctx.font=`700 24px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('w = w − rate × slope',880,165);
  const n=b===0?0:b===1?Math.min(6,Math.floor(ease(p)*7)):6;
  for(let i=0;i<=n;i++){const w=PGOOD[i];if(i>0)line(X(PGOOD[i-1]),Y(ERR(PGOOD[i-1])),X(w),Y(ERR(w)),C.gold,3,[6,5]);dot(X(w),Y(ERR(w)),i===n?12:7,i===n?C.green:C.gold);}
  if(b>=1)PGOOD.slice(0,n+1).forEach((w,i)=>txt(`step ${i}: ₹${w.toFixed(2)}`,880,250+i*42,{size:24,weight:800,font:MONO,color:i===n?C.green:C.ink}));
  if(b>=2)banner('Steps shrink by themselves near the bottom. No one gave the answer.',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const sets=[[PSLOW,'rate 0.001: too slow',C.ink],[PGOOD,'rate 0.01: just right',C.green],[PBIG,'rate 0.03: too big','#B3372F']];
  sets.forEach(([pth,l,col],i)=>{const x0=60+i*400,y0=110,w=370,h=430;box(x0,y0,w,h+80,16,i===1&&b>=1?'#E5EFE7':i===2&&b>=2?'#FBEDEA':C.white,C.gridMajor,2);
   const X=v=>x0+20+(v+40)/180*(w-40),Y=e=>y0+h-10-e/80000*(h-60);plotF(ERR,-40,140,X,Y,C.ink,3,[x0,y0,w,h]);
   const show=b===0?1:i===0||i===1?(b>=1?pth.length:1):(b>=2?Math.ceil(pth.length*ease(P(2)*1.3)):1);
   for(let k=0;k<Math.min(show,pth.length);k++){const v=pth[k];if(k>0){ctx.save();ctx.beginPath();ctx.rect(x0,y0,w,h);ctx.clip();line(X(pth[k-1]),Y(ERR(pth[k-1])),X(v),Y(ERR(v)),col,3);ctx.restore();}if(X(v)>x0&&X(v)<x0+w&&Y(ERR(v))>y0)dot(X(v),Y(ERR(v)),6,col);}
   txt(l,x0+20,y0+40,{size:22,weight:800,color:col});if(b>=1&&i<2||b>=2)txt(i===0?'after 8 steps: ₹14.36':i===1?'after 5 steps: ₹28.56':'72 → −36 → 127 → −119 …',x0+20,y0+h+50,{size:20,weight:800,color:col});});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=420,cy=380;
  for(let r=1;r<=8;r++){ctx.beginPath();ctx.ellipse(cx,cy,r*38,r*20,-.5,0,7);ctx.strokeStyle=`rgba(30,62,123,${.15+r*.06})`;ctx.lineWidth=2;ctx.stroke();}dot(cx,cy,8,C.green);
  txt('w (price per km)',cx+300,cy+210,{size:18,weight:700,color:C.muted,align:'right'});txt('b (base fare)',cx-310,cy-200,{size:18,weight:700,color:C.muted});
  if(b>=1){const a=ease(P(1)*1.5);const pts=[[-260,-60],[-120,20],[-70,-30],[-30,8],[-15,-6],[-5,2],[0,0]];const n=Math.ceil(pts.length*a);
   for(let i=0;i<n;i++){const [x,y]=pts[i];if(i>0)line(cx+pts[i-1][0],cy+pts[i-1][1],cx+x,cy+y,C.gold,3);dot(cx+x,cy+y,7,C.gold);}
   txt('gradient descent: w ≈ 28.33, b ≈ 1.67',760,300,{size:22,weight:800,color:'#7A600A',alpha:a});txt('exact (Polynomials): w = 28.33, b = 1.67',760,345,{size:22,weight:800,color:C.green,alpha:a});}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(820,410,400,170,16,'#FBF5E1',C.gold,3);txt('AI language models:',845,455,{size:24,weight:800});txt('billions of numbers',845,495,{size:26,weight:800,color:C.coral});txt('same idea, on GPUs',845,540,{size:24,weight:800,color:C.muted});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const f=x=>0.05*(x-9)**2+0.8*Math.sin(1.7*x)+1.6;const df=x=>(f(x+1e-3)-f(x-1e-3))/2e-3;
  const ox=100,oy=580,w=1080,h=420,X=x=>ox+x/14*w,Y=y=>oy-y/7*h;plotF(f,0,14,X,Y,C.ink,5);
  const run=(x0,n)=>{let x=x0;const ps=[x];for(let i=0;i<n;i++){x-=0.12*df(x);ps.push(x);}return ps;};
  if(b>=1){const a=ease(P(1)*1.4);[[run(1.5,60),C.coral,'stuck in a small dip'],[run(11,60),C.green,'true bottom']].forEach(([ps,col,l])=>{const n=Math.max(1,Math.ceil(ps.length*a));const x=ps[n-1];ball(X(x),Y(f(x)),col);if(a>.9)txt(l,X(x),Y(f(x))+48,{size:22,weight:800,align:'center',color:col});});}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(820,110,380,150,16,C.white,C.ink,2);txt('Tricks:',845,150,{size:24,weight:800});txt('• start from several places',845,190,{size:22,weight:800});txt('• add momentum',845,228,{size:22,weight:800});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['💬 AI chatbots','learned from text',0],['📸 Photo filters','learned from images',0],['🎙️ Voice typing','Tamil speech → text',0],['💰 Pricing','learn price per km',1],['🛡️ Fraud','spot odd payments',1],['🎮 Missions','price + difficulty',2]];
  cards.forEach(([h,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%3)*.4);if(a<=0)return;const x=90+(i%3)*375,y=130+Math.floor(i/3)*240;ctx.save();ctx.globalAlpha=a;
   box(x,y,345,200,18,i===5?'#FBF5E1':C.white,i===5?C.gold:C.ink,i===5?3:2);txt(h,x+24,y+70,{size:30,weight:800});txt(s,x+24,y+130,{size:22,weight:700,color:C.muted});ctx.restore();});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Learning = finding the bottom of the error valley.','Slope (derivative): w = w − rate × slope.','Rate: too small is slow, too big flies away.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;tick(190,y-10,a);txt(s,240,y,{size:32,weight:700,alpha:a});});
  if(b>=2)banner('🏢 gradientStep   ·   🎮 tuneDifficulty',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('Gradient descent',120,250,{size:96,weight:800});txt('How AI learns',120,330,{size:44,weight:700,color:C.coral});txt('About 6 minutes. Tamil and English.',120,390,{size:26,color:C.muted});
 const X=w=>760+w*8,Y=e=>560-Math.min(e,30000)/30000*300;plotF(ERR,0,50,X,Y,C.ink,5);PGOOD.slice(0,5).forEach((w,i)=>dot(X(w),Y(ERR(w)),i===4?11:7,i===4?C.green:C.gold));}

  return { draws, titleFrame, paper };
}
