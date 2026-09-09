const spessoremax=10,spessoremin=2,velmolti=.7;
var bordo,ctx,dis,dovesalvo,mouseX,mouseY,puntic,scrive,spessore,toccoidx,velox;

bordo=mouseX=mouseY=spessore=toccoidx=velox=0;

function disegnoset(c){//c deve essere un $('canvas')
 var d;
 dis=c;
 d=dis.get(0);
 ctx=d.getContext("2d");
 ctx.setTransform(1,0,0,1,0,0);
 ctx.clearRect(0,0,d.width,d.height);
 scrive=-1;
 puntic=new Array();
}

function disegnostart(f){//input hidden dove salvare i puntic
 dovesalvo=f;
 if (dovesalvo.value.length>0){
  puntic=JSON.parse(dovesalvo.value);
  ridisegna();
 }

 dis
  .on('touchstart',function(e){
   orienta();
   $(this).on('touchmove',function(eve){
    eve.preventDefault();
    var ev=eve.originalEvent;
    if (ev.changedTouches.length>1) return false;
    toccomove(ev.changedTouches[0].pageX,ev.changedTouches[0].pageY);
   });
   e.preventDefault();
   var ev=e.originalEvent;
   if (ev.touches.length>1) return false;
   toccostart(ev.touches[0].pageX,ev.touches[0].pageY);
   $(document).one('touchend',function(event){
    dis.off('touchmove');
    event.preventDefault();
    var ev=event.originalEvent;
    if (ev.changedTouches.length>1) return false;
    toccoend(ev.changedTouches[0].pageX,ev.changedTouches[0].pageY);
   });
  })
  .on('mousedown',function(e){
   orienta();
   $(this).on('mousemove',function(eve){
    eve.preventDefault();
    toccomove(eve.pageX,eve.pageY);
   });
   e.preventDefault();
   toccostart(e.pageX,e.pageY);
   $(document).one('mouseup',function(event){
    dis.off('mousemove');
    event.preventDefault();
    toccoend(event.pageX,event.pageY);
   });
  });
}

function bottonecancella(){
 var d=dis.get(0);
 ctx.clearRect(0,0,d.width,d.height);
 puntic=new Array();
}

function bottoneindietro(){
 var d,i,l;
 d=dis.get(0);
 ctx.clearRect(0,0,d.width,d.height);
 l=(puntic.map(function(o){return o.m;})).lastIndexOf('m');
 if (l>=0){
  i=puntic;
  puntic=i.slice(0,l);
 }
 ridisegna();
}

function bottoneinvio(){
 if (puntic.length==0){
  alert('Firma vuota!');
  dovesalvo.value='';
 } else dovesalvo.value=JSON.stringify(puntic);
 dis.off();
}

function orienta(){
 bordo=dis.offset();
}

function toccostart(x,y){
 var p;
 velox=0;
 x-=bordo.left;
 y-=bordo.top;
 mouseX=x;
 mouseY=y;
 toccoidx=puntic.length;
 if (scrive<0){
  puntic.push({x:x,y:y,t:Date.now(),m:'m'});
  scrive=toccoidx;//indice di inizio tocco
  dispunto(toccoidx);
 }
}

function toccomove(x,y){
 var dx,dy;
 x-=bordo.left;
 y-=bordo.top;
 dx=x-mouseX;
 dy=y-mouseY;
 if (Math.sqrt(dx*dx+dy*dy)<4){
  return;
 }
 if (scrive>-1){
  toccoidx=puntic.length;
  puntic.push({x:x,y:y,t:Date.now(),m:'l'});
  if (toccoidx-scrive>1){//se è maggiore di inizio tocco
   discurva(toccoidx-1);
  }
 }
 mouseX=x;
 mouseY=y;
}

function toccoend(x,y){
 x-=bordo.left;
 y-=bordo.top;
 if ((scrive>-1)&&(toccoidx>scrive)){//se è maggiore di inizio tocco
  discurva(toccoidx);
 }
 scrive=-1;
 mouseX=x;
 mouseY=y;
}

function dispunto(idx){
 spessore=(spessoremax+spessoremin)/2;
 ctx.beginPath();
 ctx.arc(puntic[idx].x,puntic[idx].y,spessore/2,0,2*Math.PI,false);
 ctx.fillStyle='blue';
 ctx.fill();
}

function discurva(idx){
 var d01={},d12={},d23={},d02={},d13={},c012={},c123={};
 var l01,l12,l23,r012,r123;
 var p=new Array(4);
 var s,v;
 var nofine=(idx+1<puntic.length)&&(puntic[idx+1].m=='l');
 if (idx-scrive<2){
  p[1]=puntic[scrive];
  p[2]=puntic[idx];
  if (nofine){
   p[3]=puntic[idx+1];
   p[0]=p[1];
  } else {
   p[3]=p[2];
   p[0]=p[1];
  }
 } else {
  p[0]=puntic[idx-2];
  p[1]=puntic[idx-1];
  p[2]=puntic[idx];
  p[3]=(nofine)?puntic[idx+1]:p[2];
 }
 //trova i valori per i coefficienti angolari delle corde
 d01.x=p[1].x-p[0].x;
 d01.y=p[1].y-p[0].y;
 d12.x=p[2].x-p[1].x;
 d12.y=p[2].y-p[1].y;
 d23.x=p[3].x-p[2].x;
 d23.y=p[3].y-p[2].y;
 d02.x=p[2].x-p[0].x;
 d02.y=p[2].y-p[0].y;
 d13.x=p[3].x-p[1].x;
 d13.y=p[3].y-p[1].y;
 //trova la lunghezza delle corde
 l01=Math.sqrt(d01.x*d01.x+d01.y*d01.y);
 l12=Math.sqrt(d12.x*d12.x+d12.y*d12.y);
 l23=Math.sqrt(d23.x*d23.x+d23.y*d23.y);
 //trova il rapporto tra una corda e la somma con l'adiacente verso il punto di controllo
 r012=(l01+l12)/(l01+l12+l23)/4;
 r123=(l12+l23)/(l01+l12+l23)/4;
 //trova i punti di controllo
 c012.x=p[1].x+(d02.x*r012);
 c012.y=p[1].y+(d02.y*r012);
 c123.x=p[2].x-(d13.x*r123);
 c123.y=p[2].y-(d13.y*r123);
 //velocità
 velox=l12/(p[2].t-p[1].t)*velmolti+velox*(1-velmolti);
 s=Math.max(spessoremax/(velox+1),spessoremin);
 //trova la differenza tra nuovo e vecchio spessore
 v=s-spessore;
 if (Math.abs(v)<.5){
  spessore=s;
 } else {
  spessore=spessore+Math.sign(v)*.5;
  velox=spessoremax/spessore-1;
 }
 //disegna
 ctx.beginPath();
 ctx.moveTo(p[1].x,p[1].y);
 ctx.bezierCurveTo(c012.x,c012.y,c123.x,c123.y,p[2].x,p[2].y)
 ctx.lineWidth=spessore;
 ctx.strokeStyle='blue';
 ctx.stroke();
}

function ridisegna(){
 var i;
 for (i=0;i<puntic.length;i++){
  if (puntic[i].m=='m'){
   spessore=(spessoremax+spessoremin)/2;
   dispunto(i);
   scrive=i;
  } else {
   discurva(i);
  }
 }
 scrive=-1;
}