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
function cloud(x,y,s,col){ctx.fillStyle=col;[[0,0,1],[-.62,.18,.7],[.62,.18,.75],[.22,-.32,.72]].forEach(([dx,dy,r])=>{ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s*.55,0,7);ctx.fill();});}
function drops(x,y,n,gap){for(let i=0;i<n;i++)line(x+i*gap,y,x+i*gap-8,y+26,'#4F7BC0',4);}
function sun(x,y,r){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=5;for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3);ctx.lineTo(x+Math.cos(a)*r*1.7,y+Math.sin(a)*r*1.7);ctx.stroke();}ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=C.gold;ctx.fill();ctx.restore();}
function coin(x,y,r,sx,label,ring){ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.04,sx),1);ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fillStyle='#E9C75A';ctx.fill();ctx.lineWidth=6;ctx.strokeStyle='#9A7A12';ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.78,0,7);ctx.lineWidth=2;ctx.stroke();txt(label,0,r*.28,{size:r*.8,weight:800,align:'center',color:'#7A600A'});ctx.restore();
 if(ring){ctx.beginPath();ctx.arc(x,y,r+22,0,7);ctx.strokeStyle=C.green;ctx.lineWidth=6;ctx.stroke();}}
function person(x,y,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,38,0,7);ctx.fill();rr(x-58,y+48,116,110,40);ctx.fill();}
function bar(x,y,w,h,v,col){box(x,y,w,h,h/2,'#E7ECF4');if(v>0)box(x,y,Math.max(h,w*v),h,h/2,col);}
function banner(s,a,col){ctx.save();ctx.globalAlpha=a;box(100,585,1080,86,16,'#FBF5E1',C.gold,4);txt(s,640,641,{size:36,weight:800,align:'center',color:col||C.ink});ctx.restore();}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const R=mulberry(7);const FLIPS=[];for(let i=0;i<1000;i++)FLIPS.push(R()<.5);
const RUN=[];{let h=0;FLIPS.forEach((f,i)=>{if(f)h++;RUN.push(h/(i+1));});}
const CODE=['function toss() {','  return Math.random() < 0.5 ? "Heads" : "Tails";','}','','let heads = 0;','for (let i = 0; i < 1000; i++) {','  if (toss() === "Heads") heads++;','}','console.log(heads / 1000);  // close to 0.5'];


  const draws = [
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const c1=1-ease(P(1)*2);if(c1>0){ctx.save();ctx.globalAlpha=c1;box(400,90,480,380,28,C.white,C.ink,4);txt('Weather',440,145,{size:26,weight:700,color:C.muted});txt('Tomorrow',440,185,{size:32,weight:800});
   cloud(560,300,90,'#9DB3D6');drops(510,360,5,26);txt('70%',840,320,{size:96,weight:800,align:'right'});txt('chance of rain',840,368,{size:26,align:'right',color:C.muted});
   txt('What does 70% really mean?',640,560,{size:40,weight:800,align:'center',alpha:ease(P(0)*2-.6),color:C.coral});ctx.restore();}
  const ta=b===1?ease(P(1)*2):b>1?1-ease(P(2)*2):0;
  if(ta>0){ctx.save();ctx.globalAlpha=ta;for(let i=0;i<10;i++){const v=b>1?1:ease((P(1)*1.5-i*.08)/.2);if(v<=0)continue;const x=170+(i%5)*190,y=110+Math.floor(i/5)*190;ctx.save();ctx.globalAlpha*=v;
    if(i<7){box(x,y,160,160,16,'#EAF0FA',C.ink,2);cloud(x+80,y+62,50,'#9DB3D6');drops(x+48,y+98,4,22);}else{box(x,y,160,160,16,'#FBF5E1',C.gold,2);sun(x+80,y+72,26);}
    txt('Day '+(i+1),x+80,y+148,{size:18,align:'center',color:C.muted,weight:700});ctx.restore();}
   txt('7 rainy days out of 10   =   7 / 10   =   0.7   =   70%',640,560,{size:34,weight:800,align:'center',alpha:ease(P(1)*3-1.8)});ctx.restore();}
  const s=P(2);if(s>0){ctx.save();ctx.globalAlpha=ease(s*2);txt('Every chance is a number from 0 to 1',640,150,{size:40,weight:800,align:'center'});
   line(140,400,1140,400,C.ink,6);[[0,'0'],[.5,'0.5'],[1,'1']].forEach(([v,l])=>{const x=140+v*1000;line(x,386,x,414,C.ink,4);txt(l,x,448,{size:24,weight:800,align:'center'});});
   txt('Impossible',140,480,{size:22,color:C.muted,align:'center'});txt('Certain',1140,480,{size:22,color:C.muted,align:'center'});
   const mk=[[1,'Sun rises tomorrow',-1,C.green,'right'],[.02,'Lottery jackpot (almost 0)',-1,C.coral,'left'],[.5,'Coin shows Heads',1,C.gold,'center'],[.7,'Rain tomorrow',1,'#4F7BC0','center']];
   mk.forEach(([v,l,dir,col,al],i)=>{const a=ease(s*5-1-i*.6);if(a<=0)return;const x=140+v*1000;ctx.save();ctx.globalAlpha*=a;const y2=dir<0?290:(i===3?600:545);line(x,400,x,dir<0?305:y2-30,col,3);ctx.beginPath();ctx.arc(x,400,11,0,7);ctx.fillStyle=col;ctx.fill();
    txt(l,al==='right'?1160:al==='left'?120:x,y2,{size:24,weight:800,align:al,color:col});ctx.restore();});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  if(b===0){txt('Captain calls: Heads',640,130,{size:40,weight:800,align:'center'});const c=Math.cos(t/160);coin(640,340,120,Math.abs(c),c>0?'H':'T');txt('Chance to win the toss = ?',640,570,{size:36,weight:800,align:'center',color:C.coral,alpha:ease(p*2-.8)});}
  if(b>=1){const a=b===1?ease(P(1)*2):1-.8*ease(P(2)*2);ctx.save();ctx.globalAlpha=a;txt('Only 2 possible ways',640,130,{size:40,weight:800,align:'center'});
   coin(450,330,110,1,'H',true);coin(830,330,110,1,'T');txt('Heads: what we want',450,520,{size:28,weight:800,align:'center',color:C.green});txt('Tails',830,520,{size:28,weight:700,align:'center',color:C.muted});ctx.restore();}
  const s=P(2);if(s>0){ctx.save();ctx.globalAlpha=ease(s*2);box(200,170,880,380,22,C.white,C.ink,4);
   txt('Chance  =',260,320,{size:48,weight:800});line(520,302,1010,302,C.ink,4);txt('ways you want',765,270,{size:38,weight:800,align:'center',color:C.green});txt('all possible ways',765,356,{size:38,weight:800,align:'center'});
   txt('=  1 / 2  =  50%',640,470,{size:52,weight:800,align:'center',color:C.gold,alpha:ease(s*3-1)});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  box(90,100,540,460,20,C.white,C.ink,3);txt('Q7. Which gate gives output 1',120,160,{size:27,weight:800});txt('only when both inputs are 1?',120,196,{size:27,weight:800});
  [['A','OR'],['B','AND'],['C','XOR'],['D','NOR']].forEach(([k,o],i)=>{const y=240+i*74;const cut=i>=2&&b>=2;const ca=cut?ease(P(2)*2):0;ctx.save();ctx.globalAlpha=1-.55*ca;
   box(120,y,480,56,12,'#F1F5FB',C.gridMajor,2);txt(k,150,y+38,{size:26,weight:800,color:C.muted});txt(o,200,y+38,{size:26,weight:700});ctx.restore();if(ca>0)line(130,y+28,130+460*ca,y+28,C.coral,5);});
  const X=700;
  if(b===0)txt('?',930,420,{size:240,weight:800,align:'center',color:C.gridMajor});
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;txt('Blind guess: 1 / 4 = 25%',X,160,{size:32,weight:800});bar(X,180,460,30,.25*ease(P(1)*2),C.coral);
   const fa=b>=2?1-.7*ease(P(2)*2):1;ctx.globalAlpha=a*fa;txt('Guess all 10 questions:',X,270,{size:24,weight:700,color:C.muted});
   for(let i=0;i<10;i++){const v=ease(P(1)*3-1-i*.1);if(v<=0)continue;const x=X+i*46,y=290,ok=i===3||i===7;ctx.save();ctx.globalAlpha*=v;box(x,y,38,38,8,ok?'#E5EFE7':'#FBEDEA',ok?C.green:C.coral,2);txt(ok?'✓':'✗',x+19,y+28,{size:22,weight:800,align:'center',color:ok?C.green:C.coral});ctx.restore();}
   txt('About 2 or 3 right. That\'s a fail.',X,375,{size:26,weight:800,color:C.coral,alpha:ease(P(1)*3-2)});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;txt('Studied a little: cut 2 options',X,450,{size:28,weight:800,color:C.green});txt('1 / 2 = 50%',X,492,{size:32,weight:800,color:C.green});bar(X,510,460,30,.5*ease(P(2)*2-.3),C.green);ctx.restore();}
  if(b>=3)banner('Studying literally changes your probability.',ease(P(3)*2),C.ink);
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  const a0=1-ease(P(1)*3);if(a0>0){ctx.save();ctx.globalAlpha=a0;txt('Your bank OTP',640,150,{size:40,weight:800,align:'center'});
   for(let i=0;i<6;i++){const x=640-3*100+i*100+10;box(x,200,80,100,14,C.white,C.ink,3);txt(String(Math.floor((t/90+i*37)%10)),x+40,270,{size:52,weight:800,align:'center',font:MONO});}
   txt('Why 6 digits? Why not 2?',640,420,{size:44,weight:800,align:'center',color:C.coral,alpha:ease(P(0)*2-.5)});ctx.restore();}
  function panel(x,n,sz,title,comb,res,col,a){ctx.save();ctx.globalAlpha=a;txt(title,x,140,{size:34,weight:800});for(let i=0;i<n;i++){box(x+i*(sz+10),170,sz,sz*1.2,10,C.white,C.ink,2.5);txt(String(Math.floor((t/110+i*53)%10)),x+i*(sz+10)+sz/2,170+sz*.85,{size:sz*.6,weight:800,align:'center'});}
   txt(comb,x,330,{size:30,weight:800});txt('Thief gets 3 tries',x,375,{size:24,color:C.muted,weight:700});txt(res,x,440,{size:40,weight:800,color:col});ctx.restore();}
  if(b>=1)panel(130,2,70,'2-digit OTP','100 combinations','3 / 100 = 3%',C.coral,ease(P(1)*2));
  if(b>=1){ctx.save();ctx.globalAlpha=ease(P(1)*3-1.5);txt('Too risky',130,490,{size:26,weight:800,color:C.coral});ctx.restore();}
  if(b>=2){panel(680,6,62,'6-digit OTP','10,00,000 combinations','3 in 10 lakh',C.green,ease(P(2)*2));ctx.save();ctx.globalAlpha=ease(P(2)*3-1.5);txt('= 0.0003%, then account locks',680,490,{size:26,weight:800,color:C.green});ctx.restore();line(640,130,640,500,C.gridMajor,2,[8,8]);}
  if(b>=3)banner('6 digits + only 3 attempts: an engineer\'s probability decision',ease(P(3)*2));
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  if(b===0){txt('Apps guess.',640,320,{size:80,weight:800,align:'center',alpha:ease(p*2)});txt('All day long.',640,410,{size:80,weight:800,align:'center',color:C.coral,alpha:ease(p*2-.6)});return;}
  txt('Every app you use is guessing',640,80,{size:34,weight:800,align:'center'});
  const cards=[['Cricket app','Win chance for the chasing team',.64,'64%',C.ink],['Maps','Reach in 25 min: very likely',.8,'likely',C.ink],['Instagram','You will watch this reel',.82,'82%',C.ink],['Bank','This payment looks like fraud',.91,'91%, blocked',C.coral]];
  cards.forEach((c,i)=>{const beat=i<2?1:2;if(b<beat)return;const a=ease(P(beat)*3-(i%2)*.8);if(a<=0)return;const x=i%2?660:120,y=i<2?120:390;ctx.save();ctx.globalAlpha=a;
   box(x,y,500,240,18,C.white,C.ink,2.5);txt(c[0],x+30,y+52,{size:30,weight:800});txt(c[1],x+30,y+96,{size:24,color:C.muted,weight:600});bar(x+30,y+160,440,30,c[2]*a,c[4]);txt(c[3],x+470,y+145,{size:24,weight:800,align:'right',color:c[4]});ctx.restore();});
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;
  const a0=ease(P(0)*2);ctx.save();ctx.globalAlpha=a0*(b>=1?.55+.45*(1-ease(P(1))):1);txt('Uses the app',340,110,{size:36,weight:800,align:'center',color:C.muted});person(340,200,'#A9B7CE');box(385,265,34,58,6,C.ink);
   ['Watches reels','Books a cab','Checks the score'].forEach((s,i)=>txt(s,340,430+i*48,{size:26,weight:700,align:'center',color:C.muted}));ctx.restore();
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a;box(700,70,480,530,22,'#FBF5E1',C.gold,4);txt('Builds the app',940,120,{size:36,weight:800,align:'center'});person(940,200,C.ink);box(870,300,140,16,4,'#6B7A93');
   ['Designs the reel feed','Predicts cab arrival','Builds the win predictor'].forEach((s,i)=>txt(s,940,430+i*48,{size:26,weight:800,align:'center',alpha:ease(P(1)*3-1-i*.4)}));ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);ctx.save();ctx.globalAlpha=a;arrow(420,650,860,C.gold,1);txt('Probability',640,635,{size:30,weight:800,align:'center',color:'#7A600A'});ctx.restore();}
 },
    function draw(b,p,t){const P=k=>b>k?1:b===k?p:0;
  box(50,90,650,520,18,'#16294F');const total=CODE.join('\n').length;let left=Math.floor(total*ease(P(0)*1.2));
  if(b>=1){ctx.save();ctx.globalAlpha=.35;box(62,146,626,40,6,C.gold);ctx.restore();}
  CODE.forEach((l,i)=>{const s=l.slice(0,Math.max(0,left));left-=l.length+1;const col=l.trim().startsWith('console')?'#F2D27A':(l.includes('//')?'#9FB6DE':'#FFFFFF');
   ctx.save();ctx.font=`500 19px ${MONO}`;ctx.fillStyle=col;ctx.fillText(s,78,135+i*50);ctx.restore();});
  const X=760;
  if(b>=1){const a=ease(P(1)*2);ctx.save();ctx.globalAlpha=a*(b>=2?.9:1);txt('Math.random()',X,150,{size:30,weight:800,font:MONO});
   line(X,250,1200,250,C.ink,4);box(X,242,220,16,8,'rgba(84,123,92,.35)');box(X+220,242,220,16,8,'rgba(200,85,61,.3)');[[0,'0'],[.5,'0.5'],[1,'1']].forEach(([v,l])=>{txt(l,X+v*440,290,{size:20,weight:800,align:'center'});});
   txt('Heads',X+110,325,{size:22,weight:800,align:'center',color:C.green});txt('Tails',X+330,325,{size:22,weight:800,align:'center',color:C.coral});
   const k=Math.floor(t/800);const v=mulberry(k+11)();const x=X+v*440;ctx.beginPath();ctx.arc(x,250,13,0,7);ctx.fillStyle=v<.5?C.green:C.coral;ctx.fill();
   txt(v.toFixed(2)+(v<.5?'  → Heads':'  → Tails'),X,205,{size:26,weight:800,color:v<.5?C.green:C.coral});ctx.restore();}
  if(b>=2){const a=ease(P(2)*2);const ox=X,oy=610,w=440,h=220;ctx.save();ctx.globalAlpha=a;
   line(ox,oy,ox+w,oy,C.ink,2);line(ox,oy,ox,oy-h,C.ink,2);line(ox,oy-h/2,ox+w,oy-h/2,C.gold,2,[6,6]);txt('50%',ox-8,oy-h/2+6,{size:18,align:'right',weight:800,color:'#7A600A'});txt('100%',ox-8,oy-h+6,{size:16,align:'right',color:C.muted});txt('0',ox-8,oy+6,{size:16,align:'right',color:C.muted});
   const n=Math.max(1,Math.floor(1000*ease(P(2)*1.2)));ctx.beginPath();for(let i=0;i<n;i++){const x=ox+i/999*w,y=oy-RUN[i]*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
   txt(`After ${n} tosses: ${(RUN[n-1]*100).toFixed(1)}% Heads`,ox,oy+40,{size:24,weight:800});ctx.restore();}
 },
    function draw(b,p){const P=k=>b>k?1:b===k?p:0;txt('Remember three things',160,150,{size:44,weight:800});
  ['Probability = ways you want ÷ all ways (0 to 1)','Studying raises your chances. Literally.','Every app runs on it. Learn it, build them.'].forEach((s,i)=>{const a=ease(P(i)*2.5);if(a<=0)return;const y=270+i*110;
   ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(190,y-10,26,0,7);ctx.fillStyle=C.green;ctx.fill();ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(178,y-10);ctx.lineTo(187,y);ctx.lineTo(204,y-22);ctx.stroke();
   txt(s,240,y,{size:34,weight:700});ctx.restore();});
 }
  ];
function titleFrame(){paper();txt('Probability.',120,300,{size:110,weight:800});txt('Why should I even study this?',120,380,{size:48,weight:700,color:C.coral});
 txt('Starts from zero. Tamil and English.',120,450,{size:28,color:C.muted});coin(1010,280,100,1,'H');cloud(1010,470,70,'#9DB3D6');drops(975,520,4,24);}


  return { draws, titleFrame, paper };
}
