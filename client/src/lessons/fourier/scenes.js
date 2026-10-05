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

const NOTES=[[262,'C',C.gold],[330,'E',C.green],[392,'G',C.coral]];
const chordAt=t=>NOTES.reduce((s,[f])=>s+Math.sin(TAU*f*t),0);
const matchAvg=(f,T=0.1,R=8000)=>{let s=0;const n=Math.round(T*R);for(let i=0;i<n;i++){const t=i/R;s+=chordAt(t)*Math.sin(TAU*f*t);}return s/n;};
const SPEC=(()=>{const out=[];for(let f=150;f<=500;f+=2){let re=0,im=0;const R=4000,N=4000;for(let i=0;i<N;i+=2){const t=i/R,v=chordAt(t);re+=v*Math.cos(TAU*f*t);im+=v*Math.sin(TAU*f*t);}out.push([f,2/(N/2)*Math.hypot(re,im)]);}return out;})();
function tick(x,y,a){ctx.save();ctx.globalAlpha=a;dot(x,y,22,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-3,y+9);ctx.lineTo(x+12,y-10);ctx.stroke();ctx.restore();}
function wave(fn,x0,x1,yc,amp,col,lw,t0,t1){ctx.beginPath();for(let i=0;i<=400;i++){const x=x0+(x1-x0)*i/400,t=t0+(t1-t0)*i/400,y=yc-amp*fn(t);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.stroke();}
function speaker(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=C.ink;ctx.fillRect(-20,-14,16,28);ctx.beginPath();ctx.moveTo(-4,-14);ctx.lineTo(18,-34);ctx.lineTo(18,34);ctx.lineTo(-4,14);ctx.closePath();ctx.fill();
 [30,48].forEach(r=>{ctx.beginPath();ctx.arc(18,0,r,-.7,.7);ctx.strokeStyle=C.ink;ctx.lineWidth=5;ctx.stroke();});ctx.restore();}


  const draws = [
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(70,90,560,420,20,C.white,C.ink,2);speaker(150,220,1.4);txt('noisy canteen',150,330,{size:20,weight:800,align:'center',color:C.muted});
  wave(x=>chordAt(x)*.33+.25*Math.sin(TAU*1700*x+3)*Math.sin(TAU*7*x),240,600,220,70,'#9DB3D6',2,t/4000,t/4000+.02);
  box(250,380,150,100,14,C.ink);txt('🎵',325,442,{size:40,align:'center'});box(430,380,170,100,14,'#E5EFE7',C.green,3);txt('Found it!',515,440,{size:26,weight:800,align:'center',color:C.green,alpha:ease(P(0)*2-.6)});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(660,90,560,420,20,C.white,C.ink,2);ring(800,260,80,C.ink,6);for(let i=0;i<6;i++){const an=i*TAU/6+t/700;dot(800+55*Math.cos(an),260+55*Math.sin(an),10,C.ink);}
   txt('motor hum',800,380,{size:20,weight:800,align:'center',color:C.muted});wave(x=>Math.sin(TAU*25*x)*.6+.3*Math.sin(TAU*157*x),900,1190,260,60,'#9DB3D6',2,t/4000,t/4000+.12);txt('bearing will fail soon',940,440,{size:24,weight:800,color:C.coral});ctx.restore();}
  if(b>=2)banner('Any messy sound = simple sine waves. Fourier, 1822, studying heat.',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const x0=150,x1=1180,T0=t/30000,T1=T0+0.012;
  if(b===0){const a=ease(p*2);ctx.save();ctx.globalAlpha=a;wave(x=>Math.sin(TAU*330*x),x0,x1,360,150,C.green,5,T0,T1);line(x0,360,x1,360,C.gridMajor,2);line(1100,360,1100,210,C.coral,4);txt('amplitude',1090,200,{size:22,weight:800,align:'right',color:C.coral});txt('frequency = swings per second',x0,140,{size:28,weight:800});ctx.restore();return;}
  NOTES.forEach(([f,n,c],i)=>{const a=ease(P(1)*3-i*.4);if(a<=0)return;const yc=170+i*120;ctx.save();ctx.globalAlpha=a;txt(`${n}  ${f} Hz`,60,yc+8,{size:24,weight:800,color:c});wave(x=>Math.sin(TAU*f*x),x0+40,x1,yc,40,c,3,T0,T1);ctx.restore();});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;txt('C + E + G =',60,590,{size:24,weight:800});wave(chordAt,x0+40,x1,580,32,C.ink,4,T0,T1);ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(60,110,520,240,16,C.white,C.gridMajor,2);txt('time (what the mic hears)',80,150,{size:22,weight:800});wave(chordAt,80,560,250,28,C.ink,3,t/30000,t/30000+.015);
  arrow(600,230,690,C.gold,1);txt('?',640,210,{size:30,weight:800,align:'center',color:'#7A600A'});
  box(700,110,520,480,16,C.white,C.gridMajor,2);txt('frequency (the spectrum)',720,150,{size:22,weight:800});const ox=740,oy=540,w=460,h=330,X=f=>ox+(f-150)/350*w;line(ox,oy,ox+w,oy,C.ink,2);
  [200,300,400,500].forEach(f=>txt(f+'',X(f),oy+24,{size:16,align:'center',color:C.muted}));txt('Hz',ox+w,oy+44,{size:16,align:'right',color:C.muted});
  if(b>=1){const a=ease(P(1)*1.5);ctx.beginPath();SPEC.forEach(([f,m],i)=>{const x=X(f),y=oy-m*h*.9*a;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
   NOTES.forEach(([f,n,c])=>{txt(`${n} ${f}`,X(f),oy-h*.9*a-12,{size:20,weight:800,align:'center',color:c,alpha:a});});}
  if(b>=2)banner('Fourier transform: wave over time → list of frequencies',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const f=b>=2?300:330,T1=0.1;const x0=110,x1=1170;   // same 0.1 s window as the average
  txt('chord',40,178,{size:20,weight:800,color:C.muted});wave(chordAt,x0,x1,170,30,C.ink,3,0,T1);
  txt(f+' Hz test',20,288,{size:20,weight:800,color:b>=2?C.coral:C.green});wave(x=>Math.sin(TAU*f*x),x0,x1,280,30,b>=2?C.coral:C.green,3,0,T1);
  if(b>=1){const a=ease(P(b>=2?2:1)*2);ctx.save();ctx.globalAlpha=a;txt('product',30,428,{size:20,weight:800,color:C.muted});const yc=430;line(x0,yc,x1,yc,C.gridMajor,2);
   for(let i=0;i<1200;i++){const tt=i/1200*T1,v=chordAt(tt)*Math.sin(TAU*f*tt);const x=x0+(x1-x0)*i/1200;ctx.fillStyle=v>=0?'rgba(84,123,92,.6)':'rgba(200,85,61,.6)';ctx.fillRect(x,v>=0?yc-v*22:yc,(x1-x0)/1200+.6,Math.abs(v)*22);}
   const avg=matchAvg(f);box(380,540,520,90,16,C.white,avg>0.2?C.green:C.coral,3);txt(`average = ${avg.toFixed(2)}`,640,598,{size:36,weight:800,align:'center',font:MONO,color:avg>0.2?C.green:C.coral});
   txt(avg>0.2?'→ 330 Hz is in the chord':'→ 300 Hz is not',640,668,{size:24,weight:800,align:'center',color:avg>0.2?C.green:C.coral});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const ox=100,oy=560,w=640,h=380,X=f=>ox+(f-150)/350*w;
  line(ox,oy,ox+w,oy,C.ink,2);[200,300,400,500].forEach(f=>txt(f+' Hz',X(f),oy+26,{size:16,align:'center',color:C.muted}));txt('strength',ox,oy-h-14,{size:18,weight:800,color:C.muted});
  const n=Math.ceil(SPEC.length*ease(P(0)*1.1));ctx.beginPath();SPEC.slice(0,n).forEach(([f,m],i)=>{i?ctx.lineTo(X(f),oy-m*h*.9):ctx.moveTo(X(f),oy-m*h*.9);});ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  if(n>0&&n<SPEC.length){const [f]=SPEC[n-1];line(X(f),oy,X(f),oy-h,C.gold,2,[5,5]);txt(f+' Hz',X(f),oy-h-6,{size:16,weight:800,align:'center',color:'#7A600A'});}
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;const cx=980,cy=330;box(800,140,400,420,16,C.white,C.gridMajor,2);txt('match with both',820,180,{size:22,weight:800});
   const sp=180*Math.cos(.6),cp=180*Math.sin(.6);line(cx-120,cy+100,cx-120+sp,cy+100,C.gold,6);line(cx-120+sp,cy+100,cx-120+sp,cy+100-cp,C.green,6);txt('sin part',cx-120+sp/2,cy+130,{size:20,weight:800,align:'center',color:'#7A600A'});txt('cos part',cx-120+sp+10,cy+100-cp/2,{size:20,weight:800,color:C.green});
   if(b>=2){line(cx-120,cy+100,cx-120+sp,cy+100-cp,C.coral,6);txt('strength',cx-80,cy-10,{size:22,weight:800,color:C.coral});txt('√(sin² + cos²)',1000,520,{size:28,weight:800,align:'center',font:MONO,color:C.coral});}ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const rows=[['one by one','N × N','1,000,000,000,000',C.coral,1],['FFT (1965)','N × log₂N','≈ 20,000,000',C.green,20e6/1e12]];
  txt('Steps for N = 1,000,000 samples',100,140,{size:30,weight:800});
  rows.forEach(([n,f,v,c,frac],i)=>{if(i===1&&b<1)return;const a=ease(P(i)*2);const y=220+i*150;ctx.save();ctx.globalAlpha=a;txt(n,100,y,{size:28,weight:800});txt(f,100,y+40,{size:24,weight:700,font:MONO,color:C.muted});
   box(420,y-30,700,50,12,'#E7ECF4');box(420,y-30,Math.max(6,700*frac),50,12,c);txt(v,420+Math.max(6,700*frac)+(i?14:-14),y+4,{size:24,weight:800,align:i?'left':'right',color:i?C.green:'#fff'});ctx.restore();});
  if(b>=1)txt('50,000 times faster',420,470,{size:32,weight:800,color:C.green,alpha:ease(P(1)*2)});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(100,520,540,110,14,'#16294F');ctx.font=`700 24px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('np.fft.rfft(signal)   # Python',124,565);ctx.fillText('math.fft(signal)      // JS',124,605);ctx.restore();
   txt('music · noise cancelling · 4G/5G · Wi-Fi',680,580,{size:24,weight:800,alpha:a});}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const modes=[[1,1.0],[3,.55],[7,.35]];
  const profile=(x,time,alpha)=>0.45+modes.reduce((s,[k,a])=>s+a*Math.exp(-alpha*k*k*time)*Math.sin(Math.PI*k*x)*.35,0);
  const col=v=>{const c=Math.max(0,Math.min(1,v));return `rgb(${Math.round(60+195*c)},${Math.round(90+40*(1-Math.abs(c-.5)*2))},${Math.round(200-170*c)})`;};
  const rod=(y,time,alpha,label)=>{for(let i=0;i<200;i++){const x=i/200;ctx.fillStyle=col(profile(x,time,alpha));ctx.fillRect(140+i*5,y,6,50);}ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.strokeRect(140,y,1000,50);txt(label,140,y-14,{size:22,weight:800});
   ctx.beginPath();for(let i=0;i<=200;i++){const x=i/200,yy=y+150-profile(x,time,alpha)*120;i?ctx.lineTo(140+i*5,yy):ctx.moveTo(140+i*5,yy);}ctx.strokeStyle=C.coral;ctx.lineWidth=3;ctx.stroke();};
  const time=b===0?0:((t/1000)%6);
  if(b===0){rod(200,0,0.05,'temperature along a rod');for(let i=0;i<=200;i++){}ctx.beginPath();for(let i=0;i<=200;i++){const x=i/200,y=520-profile(x,0,0)*260;i?ctx.lineTo(140+i*5,y):ctx.moveTo(140+i*5,y);}ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
   modes.forEach(([k,a],i)=>{const al=ease(p*3-1-i*.4);if(al<=0)return;ctx.save();ctx.globalAlpha=al;ctx.beginPath();for(let j=0;j<=200;j++){const x=j/200,y=520-0.45*260-a*.35*Math.sin(Math.PI*k*x)*260;j?ctx.lineTo(140+j*5,y):ctx.moveTo(140+j*5,y);}ctx.strokeStyle=[C.gold,C.green,C.coral][i];ctx.lineWidth=3;ctx.stroke();ctx.restore();});
   txt('= sum of sine shapes',1140,650,{size:24,weight:800,align:'right',color:'#7A600A',alpha:ease(p*2-1)});return;}
  if(b===1){rod(180,time,0.3,`time ${time.toFixed(1)} s: sharp wiggles fade first`);txt('wiggle twice as tight → fades 4× faster',640,650,{size:26,weight:800,align:'center',color:C.coral});return;}
  rod(130,time,0.35,'copper');rod(360,time,0.037,'ordinary steel');   // same 9.5× ratio as real copper vs steeltxt(`time ${time.toFixed(1)} s`,1140,140,{size:22,weight:800,align:'right',color:C.muted});
  banner('Copper evens out heat ≈ 9× faster than steel',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['🎵 Music & Shazam','song fingerprints',0],['📷 JPEG & video','drop invisible detail',0],['🏥 ECG & MRI','waves of the body',1],['📶 4G · 5G · Wi-Fi','data in radio waves',1],['🏭 Factories','hear a failing bearing',2],['🎮🏢 Missions','music + machines',2]];
  cards.forEach(([h,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%2)*.5);if(a<=0)return;const x=90+(i%3)*375,y=130+Math.floor(i/3)*240;ctx.save();ctx.globalAlpha=a;
   box(x,y,345,200,18,i===5?'#FBF5E1':C.white,i===5?C.gold:C.ink,i===5?3:2);txt(h,x+24,y+70,{size:28,weight:800});txt(s,x+24,y+130,{size:22,weight:700,color:C.muted});ctx.restore();});
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const fault=b>=1?ease(P(1)*2)*.25:0;const sig=x=>Math.sin(TAU*25*x)+fault*Math.sin(TAU*157*x)+.08*Math.sin(TAU*311*x+1);
  box(60,100,1160,220,16,C.white,C.gridMajor,2);txt('vibration over time',80,140,{size:22,weight:800});wave(sig,80,1200,220,60,C.ink,2,t/8000,t/8000+.2);
  const ox=100,oy=620,w=1080,h=230,X=f=>ox+f/350*w;line(ox,oy,ox+w,oy,C.ink,2);[0,50,100,150,200,250,300,350].forEach(f=>txt(f+'',X(f),oy+24,{size:16,align:'center',color:C.muted}));txt('Hz',ox+w,oy+44,{size:16,align:'right',color:C.muted});txt('spectrum',80,370,{size:22,weight:800});
  [[25,1,C.ink,'motor 25 Hz'],[157,fault,C.coral,'bearing 157 Hz'],[311,.08,C.muted,'']].forEach(([f,m,c,l])=>{if(m<=0)return;const hh=m*h;box(X(f)-8,oy-hh,16,hh,4,c);if(l)txt(l,X(f)+14,oy-hh+20,{size:20,weight:800,color:c});});
  if(b>=2)banner('Alert on the 157 Hz peak → fix it in a planned stop, not a breakdown',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Messy wave = sum of simple sine waves.','Match with sin + cos, combine with Pythagoras.','FFT: fast. From heat to Shazam to factories.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;tick(190,y-10,a);txt(s,240,y,{size:32,weight:700,alpha:a});});
  if(b>=2)banner('🎮 waveStrength   ·   🏢 dominantFrequency',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('Fourier',120,250,{size:110,weight:800});txt('From heat to Shazam',120,330,{size:44,weight:700,color:C.coral});txt('About 6 minutes. Tamil and English.',120,390,{size:26,color:C.muted});
 wave(chordAt,700,1180,250,40,C.ink,4,0,.012);NOTES.forEach(([f,n,c],i)=>wave(x=>Math.sin(TAU*f*x),700,1180,390+i*80,22,c,3,0,.012));}

  return { draws, titleFrame, paper };
}
