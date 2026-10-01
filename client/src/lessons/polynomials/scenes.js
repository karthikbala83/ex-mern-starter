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

const FEST=[300,440,610,905,1215];const DAYS=[1,2,3,4,5];
function polyfit(xs,ys,deg){const n=deg+1;const A=[...Array(n)].map((_,i)=>[...Array(n)].map((_,j)=>xs.reduce((s,x)=>s+x**(i+j),0)));const B=[...Array(n)].map((_,i)=>xs.reduce((s,x,k)=>s+ys[k]*x**i,0));
 for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];[B[c],B[p]]=[B[p],B[c]];for(let r=c+1;r<n;r++){const f=A[r][c]/A[c][c];for(let k=c;k<n;k++)A[r][k]-=f*A[c][k];B[r]-=f*B[c];}}
 const x=new Array(n).fill(0);for(let r=n-1;r>=0;r--){let s=B[r];for(let k=r+1;k<n;k++)s-=A[r][k]*x[k];x[r]=s/A[r][r];}return x;}
const evalp=(c,x)=>c.reduce((s,a,i)=>s+a*x**i,0);
const FIT1=polyfit(DAYS,FEST,1),FIT2=polyfit(DAYS,FEST,2),FIT4=polyfit(DAYS,FEST,4);
const OV_Y=[37,15,38,37,42,49,43,59];const OV_X=[1,2,3,4,5,6,7,8];const OV7=polyfit(OV_X.map(x=>x/8),OV_Y,7),OV1=polyfit(OV_X.map(x=>x/8),OV_Y,1);
function plotFn(f,x0,x1,X,Y,col,lw,clipY){ctx.save();if(clipY){ctx.beginPath();ctx.rect(clipY[0],clipY[1],clipY[2],clipY[3]);ctx.clip();}ctx.beginPath();for(let x=x0,i=0;x<=x1+1e-9;x+=(x1-x0)/200,i++){const px=X(x),py=Y(f(x));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.stroke();ctx.restore();}
function tick(x,y,a){ctx.save();ctx.globalAlpha=a;dot(x,y,22,C.green);ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-3,y+9);ctx.lineTo(x+12,y-10);ctx.stroke();ctx.restore();}
function festAxes(ox,oy,w,h,maxD,maxY){line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);for(let d=1;d<=maxD;d++)txt('Day '+d,ox+d/(maxD+.5)*w,oy+26,{size:16,align:'center',color:C.muted,weight:700});
 [0,500,1000,1500,2000].filter(v=>v<=maxY).forEach(v=>{txt(String(v),ox-8,oy-v/maxY*h+5,{size:15,align:'right',color:C.muted});line(ox,oy-v/maxY*h,ox+w,oy-v/maxY*h,C.grid,1);});
 return [d=>ox+d/(maxD+.5)*w,v=>oy-v/maxY*h];}


  const draws = [
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=120,oy=580,w=820,h=430;const [X,Y]=festAxes(ox,oy,w,h,6,2000);
  txt('Fest footfall',ox,120,{size:30,weight:800});
  FEST.forEach((v,i)=>{const a=ease(P(0)*3-i*.3);if(a<=0)return;const hh=(oy-Y(v))*a;box(X(i+1)-34,oy-hh,68,hh,8,'#9DB3D6');txt(String(v),X(i+1),oy-hh-10,{size:20,weight:800,align:'center'});});
  box(X(6)-34,Y(1600),68,oy-Y(1600),8,null,C.coral,3);txt('?',X(6),Y(1600)+(oy-Y(1600))/2+20,{size:60,weight:800,align:'center',color:C.coral});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;line(X(.6),Y(evalp(FIT1,.6)),X(6),Y(evalp(FIT1,6)),C.ink,4,[12,8]);txt('straight ruler',X(3.2),Y(evalp(FIT1,3.2))+44,{size:22,weight:800});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;plotFn(x=>evalp(FIT2,x),.6,6,X,Y,C.gold,6);txt('a curve that bends',X(4.7),Y(evalp(FIT2,4.7))-28,{size:22,weight:800,color:'#7A600A',align:'right'});
   box(980,150,250,150,16,'#FBF5E1',C.gold,3);txt('sin x ≈',1000,200,{size:24,weight:800});txt('x − x³/6 + …',1000,240,{size:24,weight:800,font:MONO});txt('a polynomial!',1000,280,{size:22,weight:800,color:'#7A600A'});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const terms=[['a',C.ink],[' + b·x',C.green],[' + c·x²','#7A600A'],[' + d·x³',C.coral]];let x=100;txt('y =',x,170,{size:52,weight:800,font:MONO});x+=130;
  terms.forEach(([s,c],i)=>{const a=ease(P(0)*4-i*.6);ctx.save();ctx.globalAlpha=Math.max(0,a);txt(s,x,170,{size:52,weight:800,font:MONO,color:c});ctx.restore();ctx.font=`800 52px ${MONO}`;x+=ctx.measureText(s).width;});
  if(b===0)txt('a, b, c, d = coefficients',100,240,{size:28,weight:800,color:C.muted,alpha:ease(p*2-1)});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(100,260,1080,170,16,C.white,C.ink,2);txt('degree = highest power   (here: 2)',130,310,{size:28,weight:800});
   txt('x = 4:   2 + 3×4 + 4²  =  2 + 12 + 16  =  30',130,380,{size:32,weight:800,font:MONO,color:C.green});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(100,460,1080,190,16,'#FBF5E1',C.gold,3);txt('x = 10:   2 + 3×10 + 10²  =  2 + 30 + 100  =  132',130,520,{size:32,weight:800,font:MONO});
   [['1','hundreds = 10²',C.coral],['3','tens = 10',C.green],['2','ones',C.ink]].forEach(([d,l,c],i)=>{txt(d,200+i*320,615,{size:56,weight:800,color:c});txt(l,250+i*320,605,{size:20,weight:800,color:C.muted});});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const fs=[[x=>.6,'degree 0','flat',0],[x=>.2+.6*x,'degree 1','straight',0],[x=>2.4*(x-.5)**2+.15,'degree 2','1 bend',1],[x=>.5+2.6*(x-.5)**3-.9*(x-.5)+.0*x,'degree 3','2 bends',1]];
  fs.forEach(([f,l,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%2)*.5);if(a<=0)return;const x0=80+i*290,y0=180,w=250,h=260;ctx.save();ctx.globalAlpha=a;box(x0,y0,w,h+60,16,C.white,C.gridMajor,2);
   plotFn(f,0,1,x=>x0+20+x*(w-40),y=>y0+h-20-y*(h-60),[C.ink,C.green,'#7A600A',C.coral][i],5,[x0,y0,w,h]);txt(l,x0+w/2,y0+h+20,{size:24,weight:800,align:'center'});txt(s,x0+w/2,y0+h+48,{size:20,weight:700,align:'center',color:C.muted});ctx.restore();});
  if(b>=2)banner('degree n → at most n − 1 bends',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(70,100,540,500,20,'#E4EEDC',C.green,2);const gy=520;line(90,gy,590,gy,C.ink,3);const T=1.6,tt=((t/1000)%2.2);const jt=Math.min(tt,T);const hgt=8*jt-5*jt*jt;const px=130+jt/T*380;
  plotFn(s=>8*s-5*s*s,0,T,s=>130+s/T*380,h=>gy-h*110,'rgba(201,162,31,.6)',3);dot(px,gy-hgt*110-18,18,C.ink);txt('h = v·t − ½·g·t²',100,150,{size:26,weight:800,font:MONO});txt('degree 2',100,185,{size:22,weight:800,color:'#7A600A'});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(670,100,540,500,20,C.white,C.ink,2);
   const P0=[760,500],P1=[760,170],P2=[1120,170],P3=[1120,500];ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(...P0);ctx.lineTo(...P1);ctx.lineTo(...P2);ctx.lineTo(...P3);ctx.strokeStyle=C.gridMajor;ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
   [P0,P1,P2,P3].forEach(q=>dot(q[0],q[1],8,C.coral));ctx.beginPath();ctx.moveTo(...P0);ctx.bezierCurveTo(...P1,...P2,...P3);ctx.strokeStyle=C.ink;ctx.lineWidth=7;ctx.stroke();
   txt('Bézier curve (degree 3)',700,150,{size:24,weight:800});txt('letters · icons · logos · animations',940,560,{size:20,weight:800,align:'center',color:C.muted});ctx.restore();}
  if(b>=2)banner('🎮 Mission: jumpHeight(v, g, t)',ease(P(2)*2));
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const ox=100,oy=560,w=700,h=420;const [X,Y]=festAxes(ox,oy,w,h,5,1500);
  const stage=b===0?0:b===1?ease(p):1;const guess=[200,150,0];const c=guess.map((g,i)=>g+(FIT2[i]-g)*(b>=2?1:stage*.6+(b>=1?.2*Math.sin(t/400)*(1-stage):0)));
  plotFn(x=>evalp(c,x),.6,5.4,X,Y,b>=2?C.gold:C.coral,5);let sse=0;
  FEST.forEach((v,i)=>{const fy=evalp(c,i+1);sse+=(fy-v)**2;line(X(i+1),Y(v),X(i+1),Y(fy),C.coral,3);dot(X(i+1),Y(v),10,C.ink);if(b>=1){const s=Math.min(60,Math.abs(fy-v)/6);ctx.save();ctx.globalAlpha=.25;box(X(i+1),Math.min(Y(v),Y(fy)),s,s,2,C.coral);ctx.restore();}});
  const X0=860;txt('error (sum of squared misses)',X0,170,{size:22,weight:800});box(X0,190,360,30,15,'#E7ECF4');box(X0,190,Math.max(20,360*Math.min(1,sse/60000)),30,15,b>=2?C.green:C.coral);txt(Math.round(sse).toLocaleString('en-IN'),X0,260,{size:40,weight:800,font:MONO,color:b>=2?C.green:C.coral});
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;box(X0,320,360,150,14,'#16294F');ctx.font=`700 22px ${MONO}`;ctx.fillStyle='#9FB6DE';ctx.fillText('# Python',X0+20,360);ctx.fillStyle='#fff';ctx.fillText('np.polyfit(days,',X0+20,400);ctx.fillText('  footfall, 2)',X0+20,435);ctx.restore();txt('least squares',X0,520,{size:28,weight:800,color:'#7A600A',alpha:a});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const fits=[[FIT1,'Straight line',C.ink,'16,067'],[FIT2,'Degree 2',C.gold,'623'],[FIT4,'Degree 4','#B3372F','0']];
  fits.forEach(([c,l,col,err],i)=>{const x0=60+i*400,y0=110,w=370,h=420;box(x0,y0,w,h+90,16,i===1&&b>=2?'#FBF5E1':C.white,i===1&&b>=2?C.gold:C.gridMajor,2);
   const X=d=>x0+25+(d-.5)/6*(w-50),Y=v=>y0+h-10-v/2000*(h-40);plotFn(x=>evalp(c,x),.6,b>=1?6.2:5.3,X,Y,col,4,[x0,y0,w,h]);FEST.forEach((v,k)=>dot(X(k+1),Y(v),7,C.ink));
   txt(l,x0+20,y0+40,{size:24,weight:800,color:col});txt('error '+err,x0+20,y0+72,{size:20,weight:700,color:C.muted});
   if(b>=1){const v=evalp(c,6);dot(X(6),Y(v),10,C.coral);txt('day 6: '+Math.round(v).toLocaleString('en-IN'),x0+20,y0+h+50,{size:26,weight:800,color:i===2?'#B3372F':C.ink,alpha:ease(P(1)*2)});}});
  if(b>=2)banner('Perfect on the past ≠ good at the future: overfitting',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=110,oy=560,w=1000,h=400,X=x=>ox+x/9.6*w,Y=v=>oy-v/180*h;
  line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);for(let d=1;d<=9;d++)txt('Day '+d,X(d),oy+26,{size:16,align:'center',color:C.muted,weight:700});[0,50,100,150].forEach(v=>txt(String(v),ox-8,Y(v)+5,{size:15,align:'right',color:C.muted}));
  OV_Y.forEach((v,i)=>{const a=ease(P(0)*3-i*.2);if(a>0){ctx.save();ctx.globalAlpha=a;dot(X(i+1),Y(v),10,C.ink);ctx.restore();}});
  plotFn(x=>evalp(OV1,x/8),.7,9.2,X,Y,C.green,4,[ox,oy-h,w,h]);if(b===0)txt('trend',X(8.6),Y(evalp(OV1,8.6/8))-14,{size:22,weight:800,color:C.green});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;plotFn(x=>evalp(OV7,x/8),.8,9.05,X,Y,'#B3372F',4,[ox,oy-h-20,w+40,h+20]);dot(X(9),Y(163),12,'#B3372F');txt('degree 7: 163 on day 9',X(9)-14,Y(163)+8,{size:22,weight:800,align:'right',color:'#B3372F'});dot(X(9),Y(evalp(OV1,9/8)),10,C.green);txt('trend ≈ 60',X(9)-14,Y(evalp(OV1,9/8))+34,{size:22,weight:800,align:'right',color:C.green});ctx.restore();}
  if(b>=2)banner('Simplest curve that explains the pattern. Test on unseen data.',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const ox=110,oy=580,w=1040,h=450,mD=15,mY=9000,X=d=>ox+d/(mD+.5)*w,Y=v=>oy-v/mY*h;
  line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);for(let d=1;d<=mD;d+=2)txt('Day '+d,X(d),oy+26,{size:15,align:'center',color:C.muted,weight:700});[0,2000,4000,6000,8000].forEach(v=>txt(v.toLocaleString('en-IN'),ox-8,Y(v)+5,{size:14,align:'right',color:C.muted}));
  FEST.forEach((v,i)=>dot(X(i+1),Y(v),8,C.ink));const end=5+10*ease(P(0)*1.2);plotFn(x=>evalp(FIT2,x),.6,end,X,Y,C.gold,5);
  if(P(0)>.8)txt('day 15: '+Math.round(evalp(FIT2,15)).toLocaleString('en-IN'),X(15)-10,Y(evalp(FIT2,15))+30,{size:24,weight:800,align:'right',color:'#7A600A'});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(200,85,61,.10)';ctx.fillRect(ox,oy-h,w,Y(2000)-(oy-h));line(ox,Y(2000),ox+w,Y(2000),C.coral,4,[10,8]);txt('ground capacity: 2,000',ox+16,Y(2000)-12,{size:24,weight:800,color:C.coral});ctx.restore();}
  if(b>=2)banner('Predict near your data. Check against the real world.',ease(P(2)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const cards=[['📈 Forecasting','canteen, power, seats',0],['📊 Excel','polynomial trendline',0],['🌡️ Sensors','voltage → °C',1],['🎮 Games & fonts','jumps, curves, easing',1],['🤖 ML','learn a pattern, predict',2],['🏢 Mission','predictFootfall',2]];
  cards.forEach(([h,s,k],i)=>{if(b<k)return;const a=ease(P(k)*3-(i%2)*.5);if(a<=0)return;const x=90+(i%3)*375,y=130+Math.floor(i/3)*240;ctx.save();ctx.globalAlpha=a;
   box(x,y,345,200,18,i===5?'#FBF5E1':C.white,i===5?C.gold:C.ink,i===5?3:2);txt(h,x+24,y+70,{size:30,weight:800});txt(s,x+24,y+130,{size:24,weight:700,color:C.muted});ctx.restore();});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Polynomial = powers × coefficients. Degree = bends + 1.','Least squares: smallest total of squared misses.','Simplest curve, no overfitting, predict near data.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;tick(190,y-10,a);txt(s,240,y,{size:32,weight:700,alpha:a});});
  if(b>=2)banner('🎮 jumpHeight   ·   🏢 predictFootfall',ease(P(2)*2-.5));
 }
  ];
function titleFrame(){paper();txt('Polynomials',120,260,{size:110,weight:800});txt('How data learns a curve',120,340,{size:44,weight:700,color:C.coral});txt('About 6 minutes. Tamil and English.',120,400,{size:26,color:C.muted});
 const X=d=>720+d*80,Y=v=>600-v/1400*360;FEST.forEach((v,i)=>dot(X(i+1),Y(v),9,C.ink));plotFn(x=>evalp(FIT2,x),.6,5.6,X,Y,C.gold,6);}

  return { draws, titleFrame, paper };
}
