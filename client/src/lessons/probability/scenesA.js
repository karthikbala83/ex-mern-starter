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
function txt(s,x,y,o){o=o||{};ctx.save();ctx.globalAlpha*=o.alpha==null?1:o.alpha;ctx.font=`${o.weight||600} ${o.size||28}px ${FONT}`;ctx.fillStyle=o.color||C.ink;ctx.textAlign=o.align||'left';ctx.textBaseline=o.base||'alphabetic';ctx.fillText(s,x,y);ctx.restore();}
function line(x1,y1,x2,y2,col,lw,dash){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw||2;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function arrow(x1,y,x2,col,a){ctx.save();ctx.globalAlpha*=a;line(x1,y,x2,y,col,3);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x2+2,y);ctx.lineTo(x2-12,y-8);ctx.lineTo(x2-12,y+8);ctx.fill();ctx.restore();}
function paper(){ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);for(let x=0;x<=W;x+=20){ctx.strokeStyle=x%100===0?C.gridMajor:C.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,H);ctx.stroke();}for(let y=0;y<=H;y+=20){ctx.strokeStyle=y%100===0?C.gridMajor:C.grid;ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(W,y+.5);ctx.stroke();}}
function die(cx,cy,s,rot,n){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);box(-s/2,-s/2,s,s,s*.18,C.white,C.ink,4);const p={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[n];ctx.fillStyle=C.ink;p.forEach(([a,b])=>{ctx.beginPath();ctx.arc(a*s*.27,b*s*.27,s*.08,0,7);ctx.fill();});ctx.restore();}
function bday(n){let q=1;for(let k=0;k<n;k++)q*=(365-k)/365;return 1-q;}




  const draws = [
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  box(450,40,380,640,44,C.white,C.ink,4);box(590,58,100,14,7,C.ink);
  const m=[['Bank','Your OTP is 4821. Do not share.'],['+91 90xxx xxx21','WIN ₹50,000 FREE!!! Click now'],['CSE HoD','Lab moved to 2 pm today'],['Amma','Saaptiya? Call me']];
  m.forEach((r,i)=>{const a=ease((P(0)-i*.18)/.4);if(a<=0)return;const x=475+(1-a)*160,y=100+i*135;ctx.save();ctx.globalAlpha=a;
   const spam=i===1&&b>=1;box(x,y,330,114,14,spam?'#FBEDEA':'#F1F5FB',spam?C.coral:C.gridMajor,spam?3:2);
   txt(r[0],x+18,y+36,{size:22,weight:700});txt(r[1],x+18,y+66,{size:19,weight:500,color:C.muted});
   if(i===1&&b>=1){const v=P(1);box(x+18,y+82,290,12,6,'#F2D6CF');box(x+18,y+82,Math.max(12,290*.97*v),12,6,C.coral);txt(Math.round(97*v)+'% spam',x+312,y+36,{size:20,weight:700,color:C.coral,align:'right'});}
   ctx.restore();});
  const s=P(2);if(s>0){ctx.save();ctx.globalAlpha=s;ctx.translate(230,330);ctx.rotate(-.12);const k=.7+.3*ease(s*1.5);ctx.scale(k,k);box(-170,-50,340,100,12,'rgba(255,255,255,.9)',C.coral,5);txt('P(spam) = 0.97',0,16,{size:44,weight:800,color:C.coral,align:'center'});ctx.restore();
   txt('Not 100% sure.',870,320,{size:36,weight:700,alpha:s});txt('Just very likely.',870,370,{size:36,weight:700,alpha:ease(s*1.5-.3),color:C.coral});}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;const a=P(0);
  txt('In code: same input, same output',120,100,{size:30,weight:700,alpha:ease(a*3)});
  for(let r=0;r<3;r++){const v=ease((a-r*.25)/.35);if(v<=0)continue;const y=130+r*68;ctx.save();ctx.globalAlpha=v;
   box(120,y,170,50,10,C.white,C.ink,2);txt('x = 5',205,y+34,{size:24,align:'center'});arrow(300,y+25,400,C.ink,1);
   box(410,y,230,50,10,'#EAF0FA',C.ink,2);txt('f(x) = 2x',525,y+34,{size:24,align:'center',weight:700});arrow(650,y+25,750,C.ink,1);
   box(760,y,110,50,10,C.white,C.green,3);txt('10',815,y+34,{size:26,weight:800,align:'center',color:C.green});
   if(r===2)txt('always 10',900,y+34,{size:24,color:C.green,weight:700});ctx.restore();}
  const q=P(1);if(q>0){ctx.save();ctx.globalAlpha=ease(q*2);line(80,360,1200,360,C.gridMajor,2,[8,8]);
   txt('In the real world: packets get lost',120,420,{size:30,weight:700});
   box(120,470,200,110,14,C.white,C.ink,3);txt('Your phone',220,532,{size:24,align:'center',weight:700});
   box(960,470,200,110,14,C.white,C.ink,3);txt('Server',1060,532,{size:24,align:'center',weight:700});
   for(let i=0;i<10;i++){const f=((t/6000)+i*.1)%1;const drop=i===3||i===7;let x=330+f*620,y=525;
    if(drop&&f>.5){x=640;y=525+(f-.5)*300;ctx.globalAlpha=ease(q*2)*clamp(1-(f-.5)*2.2);box(x-18,y-14,36,28,6,'#FBEDEA',C.coral,2);line(x-8,y-6,x+8,y+6,C.coral,3);line(x+8,y-6,x-8,y+6,C.coral,3);ctx.globalAlpha=ease(q*2);}
    else box(x-18,y-14,36,28,6,'#EAF0FA',C.ink,2);}
   txt('2 of every 10 lost, so P(loss) ≈ 0.2',640,660,{size:26,weight:700,align:'center',color:C.coral});ctx.restore();}
  const s=P(2);if(s>0){ctx.save();ctx.globalAlpha=.88*ease(s*2);ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);ctx.restore();
   ctx.save();ctx.globalAlpha=ease(s*2);box(230,200,820,300,20,C.white,C.ink,4);
   txt('P(A)  =',300,370,{size:52,weight:800});line(520,352,980,352,C.ink,4);
   txt('favourable outcomes',750,320,{size:38,weight:700,align:'center',color:C.green});txt('total outcomes',750,410,{size:38,weight:700,align:'center'});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const gx=190,gy=140,cs=74;
  die(110,95,56,-.2,3);die(180,82,56,.18,4);
  for(let i=0;i<6;i++){txt(String(i+1),gx+i*cs+cs/2,gy-14,{size:22,align:'center',color:C.muted,weight:700});txt(String(i+1),gx-22,gy+i*cs+cs/2+8,{size:22,align:'center',color:C.muted,weight:700});}
  const n=Math.ceil(P(0)*36);const k7=Math.ceil(P(1)*6);
  for(let r=0;r<6;r++)for(let c=0;c<6;c++){const idx=r*6+c;if(idx>=n)continue;const sum=r+c+2;const is7=sum===7&&r<k7&&b>=1;
   box(gx+c*cs+3,gy+r*cs+3,cs-6,cs-6,8,is7?C.goldSoft:C.white,is7?C.gold:C.gridMajor,is7?3:2);txt(String(sum),gx+c*cs+cs/2,gy+r*cs+cs/2+9,{size:26,align:'center',weight:is7?800:600,color:is7?'#7A600A':C.ink});}
  txt('Rows: die 1. Columns: die 2. Each cell shows the sum.',gx,gy+6*cs+40,{size:20,color:C.muted});
  const X=760;txt('Outcomes',X,200,{size:26,color:C.muted});txt(String(n),X,270,{size:72,weight:800});
  if(b>=1){txt('Sum = 7',X,350,{size:26,color:C.muted,alpha:ease(P(1)*3)});txt(String(k7),X,420,{size:72,weight:800,color:C.gold,alpha:ease(P(1)*3)});}
  const s=P(2);if(s>0){txt('P(sum = 7) = 6 / 36 ≈ 16.7%',X,520,{size:40,weight:800,alpha:ease(s*2)});txt('That\'s why you learn',X,580,{size:26,color:C.muted,alpha:ease(s*2-.4)});txt('permutations and combinations',X,615,{size:26,weight:700,color:C.green,alpha:ease(s*2-.4)});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const dates=['12 Mar','28 Jan','03 Sep','17 Nov','09 Feb','21 Jun','04 Jul','30 Oct','15 Apr','08 Dec','26 May','11 Aug','19 Jan','02 Mar','23 Sep','14 Feb','06 Nov','04 Jul','27 Apr','10 Oct','31 Dec','18 Jun','05 May'];
  const fade=1-ease(P(2)*2);
  if(fade>0){ctx.save();ctx.globalAlpha=fade;txt('23 students',110,112,{size:30,weight:700});
   const hi=b>=1?ease(P(1)*2):0;
   const pos=i=>[150+(i%5)*105,175+Math.floor(i/5)*102];
   if(hi>0){const [x1,y1]=pos(6),[x2,y2]=pos(17);ctx.save();ctx.globalAlpha*=hi;line(x1,y1,x2,y2,C.gold,4,[10,8]);ctx.restore();}
   dates.forEach((d,i)=>{const [x,y]=pos(i);const dup=(i===6||i===17)&&hi>0;ctx.beginPath();ctx.arc(x,y,40,0,7);ctx.fillStyle=dup?'#F8EFCF':C.white;ctx.fill();ctx.lineWidth=dup?4:2;ctx.strokeStyle=dup?C.gold:C.ink;ctx.stroke();txt(d,x,y+7,{size:18,align:'center',weight:dup?800:600,color:dup?'#7A600A':C.ink});});
   ctx.restore();}
  if(b===0)txt('?',960,470,{size:240,weight:800,align:'center',color:C.gridMajor});
  if(b>=1){const a=ease(P(1)*3);const ox=720,oy=600,w=480,h=400;ctx.save();ctx.globalAlpha=a;
   txt('Chance of a shared birthday',ox,150,{size:28,weight:700});line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);
   [0,.5,1].forEach(v=>{txt(Math.round(v*100)+'%',ox-12,oy-v*h+7,{size:18,align:'right',color:C.muted});line(ox,oy-v*h,ox+w,oy-v*h,C.grid,1);});
   [0,23,60].forEach(v=>txt(String(v),ox+v/60*w,oy+28,{size:18,align:'center',color:C.muted}));txt('people in the room',ox+w,oy+56,{size:18,align:'right',color:C.muted});
   const nMax=b>1?60:60*P(1);ctx.beginPath();for(let n=0;n<=nMax;n+=.5){const x=ox+n/60*w,y=oy-bday(Math.floor(n))*h;n===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
   if(nMax>=23){const x=ox+23/60*w,y=oy-bday(23)*h;line(x,oy,x,y,C.gold,2,[6,6]);line(ox,y,x,y,C.gold,2,[6,6]);ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fillStyle=C.gold;ctx.fill();txt('23 people → 50.7%',x+16,y-14,{size:24,weight:800,color:'#7A600A'});}
   ctx.restore();}
  const s=P(2);if(s>0){ctx.save();ctx.globalAlpha=ease(s*2);txt('Hash table with 8 slots',110,112,{size:30,weight:700});
   for(let i=0;i<8;i++){box(110,140+i*58,70,48,8,C.white,C.gridMajor,2);txt(String(i),145,172+i*58,{size:22,align:'center',color:C.muted,weight:700});}
   const keys=[['cat',2],['sun',5],['dog',3],['ram',0],['key',6],['map',3]];const cnt={};
   keys.forEach(([k,sl],j)=>{const v=ease((s-.1-j*.12)/.15);const c=cnt[sl]||0;cnt[sl]=c+1;if(v<=0)return;const x=200+c*120,y=140+sl*58-(1-v)*120;const col=c>0;
    ctx.save();ctx.globalAlpha*=v;box(x,y,100,48,8,col?'#FBEDEA':'#EAF0FA',col?C.coral:C.ink,col?3:2);txt(k,x+50,y+32,{size:22,align:'center',weight:700,color:col?C.coral:C.ink});ctx.restore();
    if(col&&v>.9){box(110,140+sl*58,70,48,8,null,C.coral,3);txt('Collision!',450,y+32,{size:24,weight:800,color:C.coral});}});
   ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const gx=110,gy=130,st=54,cz=46;
  const freeG=[27,45,63,88];const isFree=i=>i<16||freeG.includes(i);const order=[...Array(16).keys(),...freeG];
  box(gx,gy-44,22,22,4,C.coral);txt('spam',gx+30,gy-26,{size:20,weight:700});box(gx+110,gy-44,22,22,4,C.light,C.ink,1.5);txt('genuine',gx+140,gy-26,{size:20,weight:700});
  if(b>=1)box(gx+260,gy-46,26,26,4,null,C.gold,4),txt('contains FREE',gx+296,gy-26,{size:20,weight:700,color:'#7A600A'});
  const n=Math.ceil(P(0)*100);const kf=Math.ceil(P(1)*20);const dim=b>=2?1-.85*ease(P(2)*1.5):1;
  for(let i=0;i<n;i++){const r=Math.floor(i/10),c=i%10,x=gx+c*st,y=gy+r*st;const f=isFree(i);const shown=f&&b>=1&&order.indexOf(i)<kf;
   ctx.save();ctx.globalAlpha=(f&&b>=2)?1:(b>=2?dim:1);box(x,y,cz,cz,6,i<20?C.coral:C.light,i<20?null:C.ink,1.5);if(shown)box(x-3,y-3,cz+6,cz+6,8,null,C.gold,4);ctx.restore();}
  const X=730;txt('100 emails',X,170,{size:34,weight:800});txt('20 spam, 80 genuine',X,210,{size:24,color:C.muted});
  if(b>=1){const a=ease(P(1)*2);txt('Emails with FREE:',X,280,{size:26,weight:700,alpha:a});txt('16 spam',X,320,{size:26,weight:800,color:C.coral,alpha:a});txt('4 genuine',X+140,320,{size:26,weight:800,alpha:a});}
  if(b>=2){const a=ease(P(2)*2);txt('P(spam | FREE)',X,400,{size:32,weight:800,alpha:a});txt('= 16 / 20 = 80%',X,445,{size:40,weight:800,color:C.coral,alpha:a});txt('Bayes\' theorem, with counts',X,482,{size:22,color:C.muted,alpha:a});}
  if(b>=3){const a=ease(P(3)*2);txt('Example word scores, P(spam | word)',X,540,{size:22,weight:700,alpha:a});
   [['WIN',.9],['FREE',.8],['OTP',.1],['meeting',.05]].forEach(([w,v],i)=>{const y=560+i*36;txt(w,X,y+22,{size:20,weight:700,alpha:a});box(X+100,y+6,300,20,5,'#E7ECF4');box(X+100,y+6,Math.max(6,300*v*ease(P(3)*1.5)),20,5,v>.5?C.coral:C.green);txt(Math.round(v*100)+'%',X+410,y+22,{size:18,weight:700,alpha:a});});}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;const cx=640,cy=370;
  const items=[['Machine learning','every prediction is P(y | x)',0],['Randomized algorithms','random pivot in quicksort',1],['Networks','packet loss and retries',2],['Cryptography','unguessable random keys',2],['Load balancing','spreading traffic',2],['Testing','A/B experiments',2],['Games','loot drop rates',2]];
  let g2=0;items.forEach((it,i)=>{const ang=-Math.PI/2+i*2*Math.PI/items.length;const x=cx+Math.cos(ang)*430,y=cy+Math.sin(ang)*255;
   let a;if(it[2]<2)a=ease(P(it[2])*2);else{a=ease(P(2)*5-g2*.8);g2++;}if(a<=0)return;
   ctx.save();ctx.globalAlpha=a;line(cx+Math.cos(ang)*105,cy+Math.sin(ang)*105,x-Math.cos(ang)*60,y-Math.sin(ang)*38,C.gridMajor,3);
   box(x-135,y-38,270,76,14,C.white,C.ink,2.5);txt(it[0],x,y-4,{size:24,weight:800,align:'center'});txt(it[1],x,y+24,{size:18,align:'center',color:C.muted});ctx.restore();});
  ctx.beginPath();ctx.arc(cx,cy,100,0,7);ctx.fillStyle=C.ink;ctx.fill();txt('Probability',cx,cy+10,{size:30,weight:800,align:'center',color:C.white});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('What you learned',160,150,{size:44,weight:800});
  ['Probability = favourable outcomes / total outcomes','Counting, Bayes and randomness power ML, hashing, networks','Next: the quiz, then explain it in your own words'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;
   ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(190,y-10,26,0,7);ctx.fillStyle=C.green;ctx.fill();ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(178,y-10);ctx.lineTo(187,y);ctx.lineTo(204,y-22);ctx.stroke();
   txt(s,240,y,{size:32,weight:700});ctx.restore();});
 }
  ];
function titleFrame(){paper();txt('Why do CSE students need',120,270,{size:54,weight:700});txt('Probability?',120,370,{size:96,weight:800});
 txt('A visual lesson in Tamil and English',120,440,{size:28,color:C.muted});die(1000,250,120,-.25,5);die(1090,390,120,.2,2);
 box(120,480,280,6,3,C.gold);}


  return { draws, titleFrame, paper };
}
