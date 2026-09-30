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
  const panel=(x,sway,label)=>{ctx.save();rr(x,90,540,520,20);ctx.clip();const g=ctx.createLinearGradient(0,90,0,610);g.addColorStop(0,'#1A2744');g.addColorStop(1,'#34507F');ctx.fillStyle=g;ctx.fillRect(x,90,540,520);
   RAIN.slice(0,80).forEach(d=>{const y=90+((d.y+t*d.v)%500);const dx=(d.x-80)/1120*520+x+10;const s=sway*(22*Math.sin(t/650+d.ph));const tl=sway*8*Math.cos(t/650+d.ph);line(dx+s,y,dx+s-tl,y+d.l,'rgba(190,215,255,.8)',2);});
   ctx.restore();txt(label,x+270,650,{size:26,weight:800,align:'center'});};
  panel(70,0,'straight lines: robot rain');
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;panel(670,1,'sways with sin(time): real rain');ctx.restore();}
  else{box(670,90,540,520,20,'#E7ECF4');txt('?',940,380,{size:160,weight:800,align:'center',color:C.gridMajor});}
  if(b>=2)banner('Games · electricity · heartbeat · scanners · data',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const cx=190,cy=360,R=110,th=(t/1200)%TAU;const px=cx+R*Math.cos(th),py=cy-R*Math.sin(th);
  ring(cx,cy,R,C.ink,3);line(cx,cy,px,py,C.ink,3);dot(px,py,10,C.gold);
  const x0=360,len=860,k=len/(TAU*2);line(x0,cy,x0+len,cy,C.gridMajor,2);line(px,py,x0,py,C.gold,2,[6,6]);
  const A=b>=2?R*(0.75+0.35*Math.sin(t/1500)):R,fm=b>=2?1+0.5*(1+Math.sin(t/2100)):1;
  ctx.beginPath();for(let x=0;x<=len;x+=3){const y=cy-A*Math.sin(th*fm-x/k*fm);x?ctx.lineTo(x0+x,y):ctx.moveTo(x0+x,y);}ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.stroke();
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;const ax=x0+len-60;line(ax,cy,ax,cy-A,C.coral,4);txt('amplitude',ax-10,cy-A-14,{size:22,weight:800,align:'right',color:C.coral});
   const pw=TAU*k/fm;line(x0+40,cy+R+40,x0+40+pw,cy+R+40,C.green,4);line(x0+40,cy+R+28,x0+40,cy+R+52,C.green,4);line(x0+40+pw,cy+R+28,x0+40+pw,cy+R+52,C.green,4);
   txt('period (one full swing)',x0+40+pw/2,cy+R+84,{size:22,weight:800,align:'center',color:C.green});txt('frequency = 1 ÷ period',x0+40,130,{size:28,weight:800});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(360,160,620,70,12,'#16294F');ctx.font=`700 28px ${MONO}`;ctx.fillStyle='#fff';ctx.fillText('y = A × sin(2π × f × t)',384,206);ctx.restore();
   txt(`A = ${(A/R).toFixed(2)}   f = ${fm.toFixed(2)}`,384,270,{size:24,weight:800,font:MONO,color:'#7A600A',alpha:a});}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  ctx.save();rr(60,60,1160,600,20);ctx.clip();const g=ctx.createLinearGradient(0,60,0,660);g.addColorStop(0,'#1A2744');g.addColorStop(1,'#34507F');ctx.fillStyle=g;ctx.fillRect(60,60,1160,600);
  ctx.fillStyle='#22365A';ctx.fillRect(60,560,1160,100);
  const wind=b>=1?ease(P(1)*2):0;
  RAIN.forEach(d=>{const y=60+((d.y+t*d.v)%500);const sway=wind*(26*Math.sin(t/650+d.ph)+30);const x=d.x+sway;const tilt=wind*10*Math.cos(t/650+d.ph);line(x,y,x-tilt,y+d.l,'rgba(190,215,255,.75)',2);});
  if(b>=2){const a=ease(P(2)*2);[[260,600],[520,625],[780,595],[1010,630],[400,640],[900,610]].forEach(([x,y],i)=>{for(let k=0;k<3;k++){const r=((t/12+i*37+k*25)%75);ctx.save();ctx.globalAlpha=a*(1-r/75);ctx.beginPath();ctx.ellipse(x,y,r,r*.3,0,0,TAU);ctx.strokeStyle='#BFD7FF';ctx.lineWidth=2;ctx.stroke();ctx.restore();}});}
  ctx.restore();
  let x=90;x+=chip('gravity',x,80,1,C.ink)+10;if(b>=1)x+=chip('+ wind: sin(t)',x,80,ease(P(1)*3),'#547B5C')+10;if(b>=2)chip('+ ripples: sin(d − t)',x,80,ease(P(2)*3),'#C9A21F');
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const ox=90,oy=380,w=1100,Amp=190;
  txt('Home electricity: 230 V, 50 Hz',ox,120,{size:32,weight:800});line(ox,oy,ox+w,oy,C.gridMajor,2);
  ctx.beginPath();for(let x=0;x<=w;x+=2){const y=oy-Amp*Math.sin((x/w)*TAU*5-t/300);x?ctx.lineTo(ox+x,y):ctx.moveTo(ox+x,y);}ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.stroke();
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;line(ox,oy-Amp,ox+w,oy-Amp,C.coral,2,[6,6]);line(ox,oy+Amp,ox+w,oy+Amp,C.coral,2,[6,6]);
   txt('+325 V',ox+w,oy-Amp-10,{size:22,weight:800,align:'right',color:C.coral});txt('−325 V',ox+w,oy+Amp+28,{size:22,weight:800,align:'right',color:C.coral});
   const pw=w/5;line(ox,oy+Amp+60,ox+pw,oy+Amp+60,C.green,4);txt('one wave = 20 ms',ox+pw+14,oy+Amp+68,{size:24,weight:800,color:C.green});
   line(ox,oy-Amp*.707,ox+w,oy-Amp*.707,'#7A600A',2,[3,5]);txt('230 V effective',ox+10,oy-Amp*.707-10,{size:20,weight:800,color:'#7A600A'});ctx.restore();}
  if(b>=2)banner('Fans · motors · transformers: all designed around sin',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const irr=b>=2;box(90,110,1100,420,20,'#0F1D33');heart(180,190,1.6,C.coral);txt(irr?'irregular':b>=1?'75 bpm':'…',230,205,{size:40,weight:800,color:'#fff'});
  const x0=120,x1=1160,base=390,W0=260;const gaps=irr?[230,170,300,190,280,160,250,210]:[260];
  const shape=u=>{if(u>.40&&u<.44)return -(u-.40)/.04*170;if(u>=.44&&u<.48)return -170+(u-.44)/.04*210;if(u>=.48&&u<.51)return 40-(u-.48)/.03*40;if(u>.62&&u<.75)return -30*Math.sin((u-.62)/.13*Math.PI);return 0;};
  const starts=[];let acc=-((t/4)%2000)-300,i=0;while(acc<x1+300){starts.push(acc);acc+=gaps[i%gaps.length];i++;}
  ctx.beginPath();for(let x=x0;x<=x1;x+=2){const rel=x-x0;let y=0;for(const st of starts){const u=(rel-st)/W0;if(u>=0&&u<1){const v=shape(u);if(v!==0)y=v;}}const Y=base+y;x===x0?ctx.moveTo(x,Y):ctx.lineTo(x,Y);}
  ctx.strokeStyle=irr?'#F2B35E':'#5EE38F';ctx.lineWidth=3;ctx.stroke();
  if(b===1){const a=ease(P(1)*2);txt('time between peaks = 0.8 s',640,165,{size:24,weight:800,align:'center',color:'#fff',alpha:a});txt('60 ÷ 0.8 = 75 beats per minute',640,590,{size:30,weight:800,align:'center',alpha:a});}
  if(irr)txt('Uneven gaps → irregular rhythm → worth a doctor\'s check',640,590,{size:28,weight:800,align:'center',color:C.coral,alpha:ease(P(2)*2)});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cx=300,cy=380,pts=[[-70,-40,C.gold],[60,50,C.coral]];const ang=b===0?TAU*ease(p*1.1):TAU;
  ctx.beginPath();ctx.ellipse(cx,cy,190,150,0,0,TAU);ctx.fillStyle='#F3E3DA';ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  pts.forEach(([x,y,c])=>dot(cx+x,cy+y,11,c));
  if(b===0){const sx=cx+250*Math.cos(ang),sy=cy+250*Math.sin(ang);dot(sx,sy,16,C.ink);txt('X-ray',sx,sy-24,{size:18,weight:800,align:'center'});line(sx,sy,cx-250*Math.cos(ang),cy-250*Math.sin(ang),'rgba(30,62,123,.35)',30);}
  const ox=620,oy=380,w=560,h=260;box(ox,oy-h/2-20,w,h+40,12,'#0F1D33');txt('Sinogram',ox,oy-h/2-40,{size:26,weight:800});txt('scanner angle θ →',ox+w,oy+h/2+50,{size:20,weight:700,align:'right',color:C.muted});
  pts.forEach(([x,y,c])=>{ctx.beginPath();for(let a=0;a<=ang;a+=.03){const s=x*Math.cos(a)+y*Math.sin(a);const X=ox+a/TAU*w,Y=oy-s*1.3;a?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.strokeStyle=c;ctx.lineWidth=4;ctx.stroke();});
  if(b===1)txt('detector position = x·cos θ + y·sin θ',ox,oy+h/2+100,{size:26,weight:800,font:MONO,alpha:ease(p*2)});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;arrow(ox+w/2+60,oy+h/2+90,ox+w/2-120,C.green,1);txt('run it backwards → rebuild the image',ox+w/2+80,oy+h/2+98,{size:22,weight:800,color:C.green});
   pts.forEach(([x,y,c])=>ring(cx+x,cy+y,24,c,4));txt('found!',cx+60,cy+100,{size:24,weight:800,color:C.coral});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=130,oy=590,w=1040,h=420,t0=23,t1=35;const X=m=>ox+(m-.5)/24*w,Y=v=>oy-(v-t0)/(t1-t0)*h;
  line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);[25,30,35].forEach(v=>{txt(v+'°C',ox-12,Y(v)+6,{size:18,align:'right',color:C.muted});line(ox,Y(v),ox+w,Y(v),C.grid,1);});
  for(let m=1;m<=24;m++)txt(MONTHS[(m-1)%12],X(m),oy+28,{size:18,align:'center',color:m>12?C.gridMajor:C.muted,weight:700});
  txt('This year',X(6.5),oy+56,{size:18,align:'center',weight:800});txt('Next year (predicted)',X(18.5),oy+56,{size:18,align:'center',weight:800,color:C.muted});
  txt('Chennai: approximate monthly average temperature',ox,110,{size:24,weight:800});
  const n=Math.ceil(12*ease(P(0)*1.2));
  if(b>=2){const a=ease(P(2)*2);TEMPS.forEach((v,i)=>{ctx.save();ctx.globalAlpha=a;line(X(i+1),Y(v),X(i+1),Y(fitT(i+1)),C.coral,3);ctx.restore();});}
  if(b>=1){const a=ease(P(1)*1.5);ctx.beginPath();for(let m=.5;m<=.5+24*a;m+=.1){const x=X(m),y=Y(fitT(m));m===.5?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.stroke();
   txt('fitted: 29 + 3.6·cos(2π(m − 6.2)/12)',X(13)+10,Y(34.3),{size:22,weight:800,font:MONO,color:'#7A600A',alpha:ease(P(1)*3-1.5)});}
  TEMPS.slice(0,n).forEach((v,i)=>dot(X(i+1),Y(v),9,C.ink));
  if(b>=2)txt('coral lines = how far reality strays from the model',ox+w,oy-h-10,{size:20,weight:800,align:'right',color:C.coral,alpha:ease(P(2)*3)});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=90,w=1100;const f=[[1,90,C.gold],[3,40,C.green],[5,24,C.coral]];
  txt(b>=1?'Fourier transform: split it back into simple waves':'One messy wave = a sum of simple sine waves',ox,110,{size:30,weight:800});
  ctx.beginPath();for(let x=0;x<=w;x+=2){const y=230-f.reduce((s,[k,A])=>s+A*Math.sin(k*x/w*TAU*2),0);x?ctx.lineTo(ox+x,y):ctx.moveTo(ox+x,y);}ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
  f.forEach(([k,A,c],i)=>{const yy=390+i*95;const a=b===0?ease(P(0)*2-i*.3):1;ctx.save();ctx.globalAlpha=a;ctx.beginPath();for(let x=0;x<=w;x+=2){const y=yy-A*.8*Math.sin(k*x/w*TAU*2);x?ctx.lineTo(ox+x,y):ctx.moveTo(ox+x,y);}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();
   if(b>=1)txt(`${k}×`,ox-40,yy+8,{size:22,weight:800,color:c});ctx.restore();});
  if(b>=2)banner('Fourier: our next lesson',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Part C: remember three things',160,150,{size:44,weight:800});
  ['Wave = sin over time: amplitude, frequency.','Rain, power, heartbeat, CT, data seasons.','Every messy wave = simple waves added.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;
   ctx.save();ctx.globalAlpha=a;dot(190,y-10,26,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(178,y-10);ctx.lineTo(187,y);ctx.lineTo(204,y-22);ctx.stroke();txt(s,240,y,{size:34,weight:700});ctx.restore();});
  if(b>=2)banner('🎮 Mission: rainSway(x0, time, wind, phase)',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('sin & cos',120,260,{size:120,weight:800});txt('Part C: waves everywhere',120,340,{size:40,weight:700,color:C.coral});
 txt('About 6 minutes. Tamil and English.',120,400,{size:26,color:C.muted});
 [[1,C.gold,70],[3,C.green,30],[5,C.coral,18]].forEach(([k,c,A],i)=>{ctx.beginPath();for(let x=0;x<=500;x+=3){const y=520+i*0-A*Math.sin(k*x/80);x?ctx.lineTo(700+x,y):ctx.moveTo(700+x,y);}ctx.strokeStyle=c;ctx.lineWidth=4;ctx.stroke();});}

  return { draws, titleFrame, paper };
}
