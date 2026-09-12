const sosp=['to11','to12','to21','to22','to23','tos1','tos2','tos3','hcc1','hcc2'];

var gara,modEl;

$(document).ready(function(){
 if ($('table.squadre').height()-$('div.corporef').height()>1){//errore su iPad
  $('div.corporef').height($('table.squadre').height());
 }
 refiniz();
 if (localStorage.ricarica){//sicuramente esiste anche localStorage.refertofip
  localStorage.removeItem('ricarica');
  refload();
 } else {
  openMod('modPres');
  if (localStorage.refertofip){
   alert('Trovata gara iniziata, la ricarico');
   refload();
  }
 }
});

// inizio gestione moduli
$('.mod-ol').on('click',function(ev){
	if ($(ev.target).is(modEl)) clsMod();
});
$('.mod-cls').on('click',clsMod);
$(document).on('keydown',function(ev){
 if (ev.key==='Escape') clsMod();
});
function clsMod(){
 modEl.removeClass('show');
}
function openMod(s){
 modEl=$('#'+s);
 modEl.addClass('show');
}
// fine gestione moduli

// inizio eventi entrate
$('.enta,.entb').on('click',function(){
 if (gara.stato==0){
  modentinizopen(this.className);
  return;
 } else {
  //gestione durante partita
  entgest(this.id);
  return;
 }
});
$(document.entiniz).on('submit',function(){
 return modentinizsave();
});
function modentinizopen(classi){
 var h,i,n,p,s,sqm;
 sq='ab'.charAt((classi.indexOf('entb')>=0)?1:0);
 sqm=sq.toUpperCase();
 s=(sq=='a')?0:1;
 $('#meiord').text(sqm);
 h='';
 for (i=1;i<=12;i++){
  n=$('#x'+sq+i+'num').text();
  if (n.length>0){
   p='eicb'+sq+i;
   h+='<tr>';
   h+='<td>'+$('#x'+sq+i+'cogn').text();
   h+=' '+$('#x'+sq+i+'cap').text();
   h+=' '+$('#x'+sq+i+'nome').text()+'</td>';
   h+='<td>'+n+'</td>';
   h+='<td><input type="checkbox" name="'+p+'" value="'+sqm+n+'"';
   if (gara.entiniz[s].indexOf(sqm+n)>=0) h+=' checked';
   h+='></td>';
   h+='</tr>';
  }
 }
 $('#modEntIniz table').html(h);
 openMod('modEntIniz');
}
function modentinizsave(){
 var ar,cella,e,i,s,sq,sqm;
 sqm=$('#meiord').text();
 sq=sqm.toLowerCase();
 s=(sq=='a')?0:1;
 ar=[];
 for (i=0;i<document.entiniz.length-1;i++){
  e=document.entiniz.elements[i];
  if (e.checked) ar.push(e.value);
 }
 if (ar.length==5){
  clsMod();
  $('td.ent'+sq).empty();
  gara.entiniz[s]=ar;
  voceset('dentiniz',JSON.stringify(gara.entiniz));
  refsaveall();
  for (i=0;i<5;i++){
   e=gara.numerimaglia[s].indexOf(ar[i]);
   cella=$('#n'+sq+(e+1)+'ent');
   cella.html('<img src="croceb.png" style="position:absolute;top:'+cella.position().top+'px;left:'+(100*15/22)+'%;width:'+(100/22)+'%;height:13.5px;">');
  }
 } else alert('Entrate '+((ar.length>5)?'maggiori':'minori')+' di 5!');
 return false;
}
function entgest(t){
 var cella,n,r,s;
 if (gara.stato!=1){
  if (gara.stato==3) alert('Gara chiusa!');
  else alert('Iniziare un tempo di gioco!');
  return;
 }
 cella=$('#'+t);
 if (cella.html().length>0){
  alert('Entrata già immessa!');
  return;
 }
 s='ab'.indexOf(t.charAt(1));
 r=parseInt(t.slice(2),10)-1;
 if (gara.numerimaglia[s].length<=r){
  alert('Giocatore non disponibile!');
  return;
 }
 n=gara.numerimaglia[s][r];
 n+=' ENT';
 interprete(n);
}
// fine eventi entrate

// inizio eventi modCaricaGS
$('#fileInput').on('change',function(event){
 modcargssave(event);
});
function modcargsopen(){
 openMod('modCaricaGS');
}
function modcargssave(event){
 var file,reader;
 file=event.target.files[0];
 if (!file) return;
 reader=new FileReader();
 reader.onload=function(e){
  var t=e.target.result;
  clsMod();
  if (t.substring(0,7)!='<voci>\n'){
   alert('Questo non è un file referto fip valido!');
  } else {
   gara.ref=t;
   refsaveall();
   rileggi();
  }
 };
 reader.readAsText(file); // Legge il file come testo
}
// fine eventi modCaricaGS

// inizio eventi modFalli
$('.fa').on('click',function(){
 modfalopen(this.id);
});
$(document.falform).on('submit',function(){
 return modfalsave();
});
function modfalopen(t){
 var e,f,giocnum,giocref,i,numf,s;
 if (gara.stato!=1){
  if (gara.stato==3) alert('Gara chiusa!');
  else alert('Iniziare un tempo di gioco!');
  return;
 }
 s='ab'.indexOf(t.charAt(1));
 g=t.slice(1,-2);
 e=$('#x'+g+'num');
 giocref=g.toUpperCase();
 giocnum='';
 if ((e.length>0)&&(e.text()>0)){//il giocatore c'è
  giocnum=(t.charAt(1)+e.text()).toUpperCase();
 } else {//cerca nello staff
  e=gara.staff[s].indexOf(giocref);
  if (e>=0) giocnum=giocref;
 }
 if (giocnum.length==0){
  alert('Fallo non accettabile!');
  return;
 }
 document.falform.giocref.value=giocnum;
 $('#mfasq').text(giocnum.charAt(s));
 $('#mfagioc').text(giocnum.substring(1));
 numf=parseInt(t.slice(-1),10)||0;
 //controlla se quel numero di fallo è accettabile
 if ($('#'+t).text().length==0){//cerco un fallo libero prima
  i=numf;
  for (f=numf-1;f>0;f--){
   e=$('#'+t.slice(0,-1)+f);
   if(e.text().length>0) break;
   i=f;
  }
  if (i<numf) numf=i;
 } else {//cerco un fallo libero dopo
  i=numf;
  for (f=numf+1;f<=6;f++){
   e=$('#'+t.slice(0,-1)+f);
   if (e.length==0) break;
   if (e.text().length==0){
    i=f;
    break;
   }
  }
  if (i>numf) numf=i;
 }
 e=$('#'+t.slice(0,-1)+numf);
 if (e.html().length>0){
  alert('Impossibile assegnare altri falli!');
  return;
 }
 $('#mfaord').text(numf);
 if (giocnum.length>3){
  document.falform.tipof.value=(giocnum.substring(1)=='ALL')?'C':'B';
  document.falform.disq.checked=false;
  document.falform.tiporis.checked=false;
  document.falform.pedice.value='1';
  document.falform.cerchiato.checked=true;
 } else {
  document.falform.tipof.value='P';
  document.falform.disq.checked=true;
  document.falform.tiporis.checked=false;
  document.falform.pedice.value=(gara.fallisq[s]>=4)?'2':'';
  document.falform.cerchiato.checked=false;
 }
 openMod('modFalli');
}
function modfalsave(){
 var cerchiato,disq,fallo,giocref,pedice,tipof,tiporis;
 tiporis=document.falform.tiporis.checked;
 tipof=document.falform.tipof.value;
 if ((tipof!='D')&&(tiporis)){
  alert('(F) può essere aggiunto solo a (D)!');
  tiporis=false;
 }
 cerchiato=document.falform.cerchiato.checked;
 if (cerchiato){
  if (['P','DI','D','GD'].indexOf(tipof)>=0){
   alert('('+tipof+') non va cerchiato!');
   cerchiato=false;
  }
 } else {
  if (['C','B','FL'].indexOf(tipof)>=0){
   alert('('+tipof+') va cerchiato!');
   cerchiato=true;
  }
 }
 disq=document.falform.disq.checked;
 giocref=document.falform.giocref.value;
 pedice=document.falform.pedice.value;
 if (disq){
  if (['C','B','BD','GD'].indexOf(tipof)>=0){
   alert('('+tipof+') non è di squadra!');
   disq=false;
  }
 } else {
  if (['P','T','DI','FL'].indexOf(tipof)>=0){
   alert('('+tipof+') è di squadra!');
   disq=true;
  }
 }
 fallo=giocref+' F,'+tipof+','+pedice+',';
 fallo+=(tiporis?'F':'')+',';
 fallo+=(cerchiato?'C':'')+','+(disq?'SQ':'');
 clsMod();
 interprete(fallo);
 return false;
}
// fine eventi modFalli

// inizio eventi modFirmaG
$('#fgcan').on('click',function(){
 bottonecancella();
 return false;
});
$('#fgind').on('click',function(){
 bottoneindietro();
 return false;
});
$(document.fg).on('submit',function(){
 var d;
 bottoneinvio();
 clsMod();
 voceset(dovesalvo.id,dovesalvo.value);
 refsaveall();
 disegnoset($('#c'+dovesalvo.id));
 if (dovesalvo.value.length>0){
  if (dovesalvo.id.slice(0,4)=='fall'){
   puntic=(JSON.parse(dovesalvo.value)).map(function(o){
    var p={};
    p.x=o.y;
    p.y=600-o.x;
    p.t=o.t;
    p.m=o.m;
    return p;
   });
  } else puntic=JSON.parse(dovesalvo.value);
  ctx.scale(80/600,80/600);
  ridisegna();
 }
 return false;
});
$('.firma-all-c, .firma-all-a, .firma-all-b').on('click',function(ev){
 var e,sq;
 sq=$(this).data('sq');
 $('#mfgord').text('Allenatore '+sq.toUpperCase());
 e=document.getElementById('fall'+sq);
 apriFirma(e);
});
$('.farb, .fudc, .frecl2').on('click',function(ev){
 var e;
 e=$(this).find('input').get(0);
 $('#mfgord').text(['1º Arbitro','2º Arbitro','3º Arbitro','Cronometrista','Segnapunti','Addetto 24″','Capitano per reclamo'][['farb1','farb2','farb3','fcrono','fsegna','fadd24','frecl'].indexOf(e.id)]);
 apriFirma(e);
});
function apriFirma(e){
 disegnoset($('#firmadis'));
 disegnostart(e);
 openMod('modFirmaG');
}
// fine eventi modFirmaG

// inizio eventi modMenu
$('#logofip').on('click',function(){
 modmenuopen();
});
$('#modMenu p button').on('click',function(){
 var ar,d,v;
 clsMod();
 switch (this.id){
  case 'menu05'://annulla ultimo
   ar=refgetrighe();
   ar=ar.split('\n');
   d=ar.length-2;
   ar.splice(d,1);
   ar=ar.join('\n');
   refsetrighe(ar);
   refsaveall();
   rileggi();
   break;
  case 'menu10'://chiudi primo timeout q4
   interprete('TO Q4');
   break;
  case 'menu15'://inizio suppl.
   interprete('INIZ '+(gara.tempo+1));
   break;
  case 'menu20'://fine suppl.
   d=new Date();
   v=d.getHours()+':'+('0'+d.getMinutes()).slice(-2);
   $('#dora5f').text(v);
   voceset('dora5f',v);
   interprete('FINE '+gara.tempo);
   break;
  case 'menu25':
   if (ar=prompt('NOTA','')) interprete('NOTA '+trim(ar).toUpperCase());
   break;
  case 'menu30'://chiude gara
   ar=$('#dora'+(gara.tempo>5?5:gara.tempo)+'f');
   if (ar.text().length==0){
    d=new Date();
    v=d.getHours()+':'+('0'+d.getMinutes()).slice(-2);
    ar.text(v);
    voceset(ar.selector.substring(1),v);
   }
   interprete('STOP');
   break;
  case 'menu35'://salva
   ar='data:application/octet-stream,'+encodeURIComponent(gara.ref);
   v=document.createElement("a");
   v.href=ar;
   v.download='refertofip'+$('#ngara').text()+'.txt';
   document.body.appendChild(v);
   v.click();
   document.body.removeChild(v);
   break;
  case 'menu40'://carica gara salvata
   modcargsopen();
   break;
  case 'menu45'://stampa
   setTimeout(function(){window.print();},500);
   break;
  case 'menu50'://lista referto
   modrigherefopen();
   break;
  case 'menu55':
   sfondo('bianco');
   break;
  case 'menu60':
   sfondo('verde');
   break;
  case 'menu65':
   sfondo('rosa');
   break;
  case 'menu70':
   sfondo('giallo');
   break;
  case 'menu80':
   if (confirm('Sei sicuro di voler creare una nuova gara?')){
    localStorage.refertofip='';
    rileggi();
   }
   break;
 }
});
function modmenuopen(){
 var ar,e;
 ar=refgetrighe();
 e=$('#menu05');
 if (ar.length>0){
  e.attr('disabled',false);
  ar=ar.split('\n');
  $('#ultimariga').text(ar.length-2);
  $('#ultimodato').text(ar[ar.length-2]);
 } else e.attr('disabled',true);
 e=$('#menu10');
 if ((gara.stato==1)&&(gara.tempo==4)&&(($('#to21a').html().length==0)||($('#to21b').html().length==0))) e.attr('disabled',false);
 else e.attr('disabled',true);
 e=$('#menu15');
 if (((gara.stato&1)>0)||(gara.tempo<5)) e.attr('disabled',true);
 else e.attr('disabled',false);
 e=$('#menu20');
 if ((gara.stato>=2)||(gara.tempo<=5)) e.attr('disabled',true);
 else e.attr('disabled',false);
 e=$('#menu30');
 if (gara.stato==3) e.attr('disabled',true);
 else e.attr('disabled',false);
 openMod('modMenu');
}
// fine eventi modMenu

// inizio eventi modHeader1
$(document.hea1.ingara).on('blur',function(){
 solonumeri(this);
 ctrlnumero(this,1,999999);
});
$('.header1 td').on('click',function(){
 modheader1open();
});
$(document.hea1).on('submit',function(){
 return modheader1save();
});
function modheader1open(){
 var e,i,n,s;
 for(i=0;i<document.hea1.elements.length-1;i++){
  e=document.hea1.elements[i];
  n=e.name;
  s=n.substring(1);
  e.value=$('#'+s).text();
 }
 openMod('modHeader1');
}
function modheader1save(){
 var e,i,n,s,v;
 clsMod();
 for (i=0;i<document.hea1.elements.length-1;i++){
  e=document.hea1.elements[i];
  if (i==0){
   ctrlnumero(e,1,999999);
   document.title='RefertoFIP'+e.value;
  } else maiusc(e);
  n=e.name;
  s=n.substring(1);
  v=e.value;
  $('#'+s).text(v);
  voceset(s,v);
 }
 refsaveall();
 return false;
}
// fine eventi modHeader1

// inizio eventi modHeader2
$(document.hea2.indata).on('blur',function(){
 ctrldata(this);
});
$('.no-si,.header2 td').on('click',function(){
 modheader2open();
});
$(document.hea2).on('submit',function(){
 return modheader2save();
});
function modheader2open(){
 var e,i,n,s;
 for(i=0;i<document.hea2.elements.length-3;i++){
  e=document.hea2.elements[i];
  n=e.name;
  s=n.substring(1);
  e.value=$('#'+s).text();
 }
 document.hea2.inpaga.checked=$('#paga_no').hasClass('fondonero');
 document.hea2.idhcc.checked=(gara.hcc==1);
 openMod('modHeader2');
}
function modheader2save(){
 var e,i,img,n,s,v;
 clsMod();
 for (i=0;i<document.hea2.elements.length-3;i++){
  e=document.hea2.elements[i];
  switch (i){
   case 2:
    ctrldata(e);
    break;
   case 5:
    ctrltime(e);
    break;
   default:
    maiusc(e);
  }
  n=e.name;
  s=n.substring(1);
  v=e.value;
  $('#'+s).text(v);
  voceset(s,v);
 }
 $('.no-si').removeClass('fondonero');
 if (document.hea2.inpaga.checked){
  $('#paga_no').addClass('fondonero');
  voceset('dpaga',1);
 } else {
  $('#paga_si').addClass('fondonero');
  voceset('dpaga',0);
 }
 gara.hcc=(document.hea2.idhcc.checked)?1:0;
 voceset('dhcc',gara.hcc);
 refsaveall();
 return false;
}
// fine eventi modHeader2

// inizio eventi modListaN
$('#modListaN ul').on('click','li>button',function(){
 clsMod();
 modrigaref(this);
});
function modrigherefopen(){
 var ar,h,i,ul;
 ul=$('#modListaN ul');
 h='';
 ar=refgetrighe().split('\n');
 for (i=ar.length-2;i>=0;i--) h+='<li><button data-riga="'+i+'">Modifica</button> '+i+': '+ar[i]+'</li>';
 ul.html(h);
 openMod('modListaN');
}
function modrigaref(t){
 var ar,p,riga,v;
 riga=parseInt($(t).data('riga'),10)||0;
 ar=refgetrighe().split('\n');
 v=ar[riga];
 if (confirm('Questa azione può compromettere tutto il referto,\n'+
  'converrebbe prima salvare la gara.\n'+
  'SEI SICURO?')){
  p=prompt('Modifica di '+v,v);
  if (p!==null){
   p=p.replace(/\\n/g,'\n');
   ar[riga]=trim(p).toUpperCase();
   refsetrighe(ar.join('\n'));
   refsaveall();
   rileggi();
  }
 }
}
// fine eventi modListaN

// inizio eventi modOrario
$('.tora').on('click',function(){
 modorarioopen(this.id);
});
$(document.oraform).on('submit',function(){
 return modorariosave();
});
function modorarioopen(t){
 var d,e,h,i,inizio,n,prima,tempo,v;
 if (gara.stato>2){
  alert('Gara chiusa!');
  return;
 }
 inizio=(t.slice(-1)=='i')?1:0;
 tempo=parseInt(t.slice(-2,-1),10);
 if ((inizio==0)||(tempo>1)){
  prima='dora'+(tempo-inizio)+'if'.charAt(inizio);//se è un inizio cerca il tempo prima, poi cambia inizio-fine
  v=$('#'+prima).html();
  if (v.length==0){
   alert('Inserire gli orari precedenti');
   return;
  }
 }
 $('#morario').text(tempo);
 $('#modOrario span.oratipo').text(['Fine','Inizio'][inizio]);
 h='';
 if (gara.stato==0){
  h='<caption>Controllo Entrate Iniziali</caption>';
  for (i=0;i<=1;i++){
   if (!gara.entiniz[i][0]){
    alert('Prima inserire le entrate');
    return;
   }
   h+='<tr>';
   h+='<th>Squadra '+('AB'.charAt(i))+'</th>';
   for (e=0;e<=4;e++) h+='<td class="tac">&nbsp;'+(gara.entiniz[i][e]).substring(1)+'&nbsp;</td>';
   h+='</tr>';
  }
 }
 $('#modOrario table').html(h);
 document.oraform.riforario.value=t;
 v=$('#'+t).text();
 if (v.length==0){
  d=new Date();
  v=d.getHours()+':'+('0'+d.getMinutes()).slice(-2);
 }
 document.oraform.iorario.value=v;
 openMod('modOrario');
}
function modorariosave(){
 var inizio,r,t,tempo,v;
 ctrltime(document.oraform.iorario);
 t=document.oraform.riforario.value;
 inizio=(t.slice(-1)=='i')?1:0;
 tempo=parseInt(t.slice(-2,-1));
 v=document.oraform.iorario.value;
 $('#'+t).text(v);
 voceset(t,v);
 clsMod();
 r='\n'+refgetrighe();
 v=['FINE','INIZ'][inizio]+' '+tempo;
 refsaveall();
 if (r.indexOf('\n'+v+'\n')<0) interprete(v);//azione da registrare se non c'era
 return false;
}
// fine eventi modOrario

// inizio eventi modPunti
$('table.punti').on('click','td.punt',function(){
 modpunopen(this.id);
});
$(document.punform).on('submit',function(){
 return modpunsave();
});
function modpunopen(t){
 var d,h,i,n,p,s,selsq,sq,v;
 if (gara.stato!=1){
  if (gara.stato==3) alert('Gara chiusa!');
  else alert('Iniziare un tempo di gioco!');
  return;
 }
 sq=t.charAt(1+1*(t.charAt(0)=='g'));
 selsq='ab'.indexOf(sq);
 $('#mpuord').text(sq.toUpperCase());
 p=parseInt(t.substring(2+1*(t.charAt(0)=='g')),10);
 d=p-gara.ris[selsq];
 d=(d>3)?3:((d<1)?d=1:d);
 n=gara.numerimaglia[selsq].length;
 h='<tr class="tac"><th>Gioc.</th>';
 for (i=0;i<=n;i++){
  if (i<n) v=gara.numerimaglia[selsq][i];
  else v=(sq+'t').toUpperCase();
  h+='<td><label>'+v.substring(1)+'<br>';
  h+='<input type="radio" name="giocp" value="'+v+'">';
  h+='</label><br>&nbsp;</td>';
 }
 h+='</tr>';
 h+='<tr class="tac"><th>Punti</th>';
 for (i=1;i<=3;i++){
  h+='<td><label>'+i+'<br>';
  h+='<input type="radio" name="puntp" value="P'+i+'"'+((i==d)? ' checked':'')+'>';
  h+='</label><br>&nbsp;</td>';
 }
 h+='</tr>';
 $('#modPunti table').html(h);
 openMod('modPunti');
}
function modpunsave(){
 var g,p
 clsMod();
 g=document.punform.giocp.value;
 v=document.punform.puntp.value;
 if (g==''){
  alert('Giocatore non immesso!');
  return false;
 }
 interprete(g+' '+v);
 return false;
}
// fine eventi modPunti

// inizio eventi modSq
$('.sqa,.sqb').on('click',function(){
 modsqopen(this.className);
});
$('#modSq table input.ima').on('blur',function(ev){
 novirgole(this);
 maiusc(this);
 ev.stopImmediatePropagation(); // per bloccare l'evento generale
});
$('#modSq table input.ian').on('blur',function(){
 solonumeri(this);
 if (this.value.length>0) this.value=('0'+this.value).slice(-2);
});
$('#modSq table input.inm').on('blur',function(){
 solonumeri(this);
});
$(document.sqform).on('submit',function(){
 return modsqsave();
});
function modsqopen(classi){
 var sq;
 sq='ab'.charAt((classi.indexOf('sqb')>=0)?1:0);
 $('#msord').text(sq.toUpperCase());
 $(document.sqform.laddcogn).closest('tr').attr('hidden',(sq=='b'));
 document.sqform.insq.value=$('#nsq'+sq).text();
 document.sqform.incolsq.value=$('#ncolsq'+sq).text();
 $('#modSq table input').each(function(index){
  var dato,nome;
  nome=this.name;
  if (nome=='jcap'){
   dato='x'+sq+this.value+'cap';
   document.sqform.jcap[1*this.value-1].checked=($('#'+dato).text()=='CAP');
  } else {
   dato=('xyz'.charAt('jkl'.indexOf(nome.charAt(0))))+sq+nome.substring(1);
   this.value=$('#'+dato).text();
  }
 });
 openMod('modSq');
}
function modsqsave(){
 var ar,e,dato,i,idold,idnew,nome,r,s,sq,sqm,v;
 sqm=$('#msord').text();
 sq=sqm.toLowerCase();
 s='ab'.indexOf(sq);
 r='';
 c=0;
 for (i=0;i<document.sqform.elements.length-2;i++){
  e=document.sqform.elements[i];
  switch (e.className){
   case 'ima':
    novirgole(e);
    maiusc(e);
    if (e.value.length>2*e.size){
     alert('Valore troppo lungo: correggerlo!');
     e.focus();
     return false;
    }
    break;
   case 'ian':
    solonumeri(e);
    if (e.value.length>0) e.value=('0'+e.value).slice(-2);
    break;
   case 'inm':
    solonumeri(e);
    if (e.value.length>1) e.value=(e.value).slice(-2);
    if (e.value.length>0){
     v=' '+e.value+' ';
     if (r.indexOf(v)>=0){
      alert('Numero di maglia esistente!');
      e.focus();
      return false;
     }
     r+=v;
    }
    break;
   case 'int':
    solonumeri(e);
    if (e.value.length>0) ctrlnumero(e,1,999999);
    break;
   default:
  }
 }
 c=1*document.sqform.jcap.value;
 if (c==0){
  alert('Indicare il capitano!');
  return false;
 }
 if ((r.length>0)&&(document.sqform.elements[c*5+1].value=='')){
  alert('Il capitano deve avere il numero maglia!');
  return false;
 }
 c=0;
 ar=new Array();
 for (i=2;i<62;i++){
  e=document.sqform.elements[i];
  if (c==0) r=new Array();
  if (c==2) v=(e.checked)?1:0;
  else v=e.value;
  r.push(v);
  c++;
  if (c>4){
   c=0;
   ar.push(r);
  }
 }
 ar.sort(function(a,b){
  var av,bv,al,bl;
  av=(a[4].length>0)?(' '+a[4]).slice(-2):'zz';
  bv=(b[4].length>0)?(' '+b[4]).slice(-2):'zz';
  al=(a[0]+a[1]+a[3]+(a[2]==0?'':'1')).length;
  bl=(b[0]+b[1]+b[3]+(b[2]==0?'':'1')).length;
  return ((av==bv)?((al==bl)?0:((al>bl)?-1:1)):((av>bv)?1:-1));
 });
 gara.numerimaglia[s]=new Array();
 gara.staff[s]=new Array();
 for (i=0;i<12;i++){
  if (ar[i][4].length>0) gara.numerimaglia[s].push(sqm+ar[i][4]);
 }
 r=c=0;
 for (i=2;i<62;i++){
  e=document.sqform.elements[i];
  if (c==2) e.checked=(ar[r][c]==1);
  else e.value=ar[r][c];
  c++;
  if (c>4){
   c=0;
   r++;
  }
 }
 nome='nsq'+sq;
 v=document.sqform.insq.value;
 $('#'+nome).text(v);
 voceset(nome,v);
 nome='ncolsq'+sq;
 v=document.sqform.incolsq.value;
 $('#'+nome).text(v);
 voceset(nome,v);
 idold='';
 $('#modSq table input').each(function(index){
  idnew=$(this).closest('tr').attr('id');
  if (idnew!=idold){
   if (idold.length>0){
    if (!((sq=='b')&&(idold=='ladd'))){
     dato=('xyz'.charAt('jkl'.indexOf(idold.charAt(0))))+sq+idold.substring(1);
     voceset(dato,r.join(','));
     if (idold.charAt(0)>'j'){//non è un giocatore
      gara.staff[s].push((((r[0]+r[1]).length>0)?'':'-')+sqm+idold.substring(1).toUpperCase());
     }
    }
   }
   r=new Array();
   idold=idnew;
  }
  nome=this.name;
  if (nome=='jcap'){
   dato='x'+sq+this.value+'cap';
   v=document.sqform.jcap[1*this.value-1].checked;
   r.push(v?1:0);
   $('#'+dato).text(v?'CAP':'');
  } else {
   dato=('xyz'.charAt('jkl'.indexOf(nome.charAt(0))))+sq+nome.substring(1);
   $('#'+dato).text(this.value);
   r.push(this.value);
  }
 });
 dato=('xyz'.charAt('jkl'.indexOf(idold.charAt(0))))+sq+idold.substring(1);
 voceset(dato,r.join(','));
 if (idold.charAt(0)>'j'){
  gara.staff[s].push((((r[0]+r[1]).length>0)?'':'-')+sqm+idold.substring(1).toUpperCase());
 }
 clsMod();
 refsaveall();
 rileggi();
 return false;
}
// fine eventi modSq

// inizio eventi modTessArb
$('.tarb').on('click',function(){
 modtarbopen();
});
$(document.tarbform).on('submit',function(){
 clsMod();
 return modtarbsave();
});
function modtarbopen(){
 $('#lnarb1').text($('#narb1').text());
 $('#lnarb2').text($('#narb2').text());
 $('#lnarb3').text($('#narb3').text());
 document.tarbform.intarb1.value=$('#ntarb1').text();
 document.tarbform.intarb2.value=$('#ntarb2').text();
 document.tarbform.intarb3.value=$('#ntarb3').text();
 openMod('modTessArb');
}
function modtarbsave(){
 var e,i,n,s,v;
 clsMod();
 for (i=0;i<document.tarbform.elements.length-1;i++){
  e=document.tarbform.elements[i];
  solonumeri(e);
  if (e.value.length>0) ctrlnumero(e,1,999999);
  n=e.name;
  s=n.substring(1);
  v=e.value;
  $('#'+s).text(v);
  voceset(s,v);
 }
 refsaveall();
 return false;
}
// fine eventi modTessArb

// inizio eventi modUdC
$('.udc').on('click',function(){
 modudcopen();
});
$(document.udcform).on('submit',function(){
 clsMod();
 return modudcsave();
});
function modudcopen(){
 document.udcform.incrono.value=$('#ncrono').text();
 document.udcform.intcrono.value=$('#ntcrono').text();
 document.udcform.insegna.value=$('#nsegna').text();
 document.udcform.intsegna.value=$('#ntsegna').text();
 document.udcform.inadd24.value=$('#nadd24').text();
 document.udcform.intadd24.value=$('#ntadd24').text();
 openMod('modUdC');
}
function modudcsave(){
 var e,i,n,s,v;
 clsMod();
 for (i=0;i<document.udcform.elements.length-1;i++){
  e=document.udcform.elements[i];
  switch (e.className){
   case 'ima':
    maiusc(e);
    if (e.value.length>2*e.size){
     alert('Valore troppo lungo: correggerlo!');
     e.focus();
     return false;
    }
    break;
   case 'int':
    solonumeri(e);
    if (e.value.length>0) ctrlnumero(e,1,999999);
    break;
   default:
  }
  n=e.name;
  s=n.substring(1);
  v=e.value;
  $('#'+s).text(v);
  voceset(s,v);
 }
 refsaveall();
 return false;
}
// fine eventi modUdC

//inizio eventi reclami
$('.frecl1').on('click',function(){
 var ar,t,v;
 ar=['',voceget('nsqa'),voceget('nsqb')];
 t=$('#nsqrecl');
 v=ar.indexOf(t.text());
 v=(v+1)%3;
 t.text(ar[v]);
});
//fine eventi reclami

// inizio eventi timeout hcc
$('#modTO .imi').on('blur',function(){
 solonumeri(this);
 ctrlnumero(this,0,((gara.tempo<5)?10:5));
});
$('.timeout').on('click',function(){
 modtoopen(this.id);
});
$(document.toform).on('submit',function(){
 return modtosave();
});
function modtoopen(t){
 var e,i,n,sq,trovato;
 if (gara.stato!=1){
  if (gara.stato==3) alert('Gara chiusa!');
  else alert('Iniziare un tempo di gioco!');
  return;
 }
 e=$('#'+t);
 if ((gara.hcc==1)&&(e.hasClass('hcc'))){
  modhccopen(t);
  return;
 }
 sq=t.slice(-1);
 //elabora tempo gara per trovare un timeout vuoto
 trovato='';
 for (i=2*(gara.tempo>=2)+(gara.tempo-2)*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
  i<=1*(gara.tempo<=2)+4*(gara.tempo<=4)+gara.tempo*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
  i++){
  n=sosp[i]+sq
  e=$('#'+n);
  if (e.html().length==0){
   trovato=n;
   break;
  }
 }
 if (trovato.length==0){
  alert('Timeout finiti!');
  return;
 }
 //chiedi il minuto
 $('#mtoord').text('Timeout '+sq.toUpperCase());
 document.toform.tosq.value=sq;
 openMod('modTO');
}
function modhccopen(t){
 var n,sq;
 sq=t.slice(-1);
 n='hcc1'+sq;
 if ($('#'+n).text().length>0){
  alert('HCC già usato!');
  return;
 }
 //chiedi il minuto
 $('#mtoord').text('HCC '+sq.toUpperCase());
 document.toform.tosq.value=sq;
 openMod('modTO');
}
function modtosave(){
 var m,sq;
 clsMod();
 if ($('#mtoord').text().charAt(0)=='H'){
  modhccsave();
  return false;
 }
 m=document.toform.tomin.value;
 sq=document.toform.tosq.value;
 interprete('TO '+sq.toUpperCase()+','+m);
 return false;
}
function modhccsave(){
 m=document.toform.tomin.value;
 sq=document.toform.tosq.value;
 interprete('HCC '+sq.toUpperCase()+','+m);
 return false;
}
// fine eventi timeout hcc

// inizio eventi generali
$('input.ima').on('blur',function(){
 maiusc(this);
});
$('input.int').on('blur',function(){
 solonumeri(this);
 if (this.value.length>0) ctrlnumero(this,1,999999);
});
$('input.ior').on('blur',function(){
 ctrltime(this);
});
// fine eventi generali

//inizio funzioni generali
function annullarighesq(s){//s = squadra 0..1
 var cella,g,h,img,riga,sq;
 sq='ab'.charAt(s);
 img='lineaob.png';
 for (g=0;g<=1;g++){
  riga=['sq','colsq'][g];
  cella=$('#n'+riga+sq);
  if (cella.text().length==0){
   cella=cella.closest('td');
   h='<img src="'+img+'" style="position:absolute;height:1px;';
   h+='top:'+(cella.position().top+8.5)+'px;left:0;width:+'+(100*16/22)+'%">';
   cella.append(h);
  }
 }
 for (g=gara.numerimaglia[s].length;g<12;g++){
  riga='r'+sq+(g+1);
  cella=$('#'+riga+' td').first();
  h='<img src="'+img+'" style="position:absolute;height:1px;';
  h+='top:'+(cella.position().top+6.25)+'px;left:0;width:100%">';
  cella.append(h);
 }
 for (g=0;g<gara.staff[s].length;g++){
  riga=gara.staff[s][g];
  if (riga.charAt(0)=='-'){
   cella=$('#r'+riga.substring(1).toLowerCase()+ ' td').first();
   h='<img src="'+img+'" style="position:absolute;height:1px;';
   h+='top:'+(cella.position().top+6.25)+'px;left:0;width:100%">';
   cella.append(h);
  }
 }
}

function chiudifallilg(s){//linea greca del Q2 s = squadra 0..1
 var cella,dis,frp,g,h,img,n,riga,sq,t;
 sq='ab'.charAt(s);
 dis=$('#lg'+sq);
 h='1';//testo in dis
 frp=0;
 for (g=0;g<gara.numerimaglia[s].length;g++){
  riga=g+1;
  for (f=1;f<=6;f++){//cerca la prima vuota o con f
   n='#n'+sq+riga+'f'+f;
   cella=$(n);
   t=cella.text();
   if ((t.length==0)||(t=='F')) break;
  }
  f=f-1;
  frp=(g==0)?f:frp;//per evitare lineao sopra all'inizio
  n='#n'+sq+riga+'f1';//prima cella della riga
  cella=$(n);
  //lineav
  img='lineavb.png';
  h+='<img src="'+img+'" style="position:absolute;width:2px;height:13.5px;';
  h+='top:'+cella.position().top+'px;left:'+(100*(16+f)/22)+'%;">';
  //lineao sopra
  img='lineaob.png';
  if (f!=frp){//la riga va fatta
   h+='<img src="'+img+'" style="position:absolute;height:2px;';
   h+='top:'+cella.position().top+'px;left:'+(100*(16+((f>frp)?frp:f))/22)+'%;width:'+(100*Math.abs(f-frp)/22)+'%">';
  }
  //lineao sotto per l'ultimo
  if ((f>0)&&(g==gara.numerimaglia[s].length-1)){
   h+='<img src="'+img+'" style="position:absolute;height:2px;';
   h+='top:'+(cella.position().top+13.5)+'px;left:'+(100*16/22)+'%;width:'+(100*f/22)+'%">';
  }
  frp=f;
 }
 //passiamo allo staff
 frp=0;
 for (g=0;g<gara.staff[s].length;g++){
  riga=gara.staff[s][g];
  if (riga.charAt(0)=='-'){
   f=0;
   n='#n'+riga.toLowerCase().substring(1)+'f1';//prima cella della riga
  } else {
   for (f=1;f<=4-3*(g>1);f++){//cerca la prima vuota o con f
    n='#n'+riga.toLowerCase()+'f'+f;
    cella=$(n);
    t=cella.text();
    if ((t.length==0)||(t=='F')) break;
   }
   f=f-1;
   n='#n'+riga.toLowerCase()+'f1';//prima cella della riga
  }
  cella=$(n);
  //lineav
  if (riga.charAt(0)!='-'){
   img='lineavb.png';
   h+='<img src="'+img+'" style="position:absolute;width:2px;height:13.5px;';
   h+='top:'+cella.position().top+'px;left:'+(100*(18+3*(g>1)+f)/22)+'%;">';
  }
  //lineao sopra
  img='lineaob.png';
  if (f!=frp){//la riga va fatta
   h+='<img src="'+img+'" style="position:absolute;height:2px;';
   h+='top:'+cella.position().top+'px;left:'+(100*(18+3*(g>1)+((f>frp)?frp:f))/22)+'%;width:'+(100*Math.abs(f-frp)/22)+'%">';
  }
  //lineao sotto per l'ultimo
  if ((f>0)&&(g==gara.staff[s].length-1)){
   h+='<img src="'+img+'" style="position:absolute;height:2px;';
   h+='top:'+(cella.position().top+13.5)+'px;left:'+(100*(18+3*(g>1))/22)+'%;width:'+(100*f/22)+'%">';
  }
  frp=f-3*(g==1);
 }
 dis.html(h);
}

function chiudifalli(s,t,c){//s=squadra(0 o 1), t=riga dei falli (num o all aall ecc.), c=iniziale colore
 var cella,i,m,nome,sq,v;
 sq='ab'.charAt(s);
 nome='#n'+sq+t+'f';
 m=1;//cerco anche l'ultimo fallo della riga
 v=0;
 for (i=1;i<=6;i++){
  cella=$(nome+i);
  if (cella.length>0){//esiste la cella del fallo
   m=i;
   if ((cella.html().length==0)&&(v==0)) v=i;
  } else break;
 }//m=massimo, v=il primo libero
 if (v>0){
  for (i=v;i<=m;i++){
   cella=$(nome+i);
   img='<img src="lineao'+c+'.png" style="position:absolute;height:1px;'+
    'top:'+(cella.position().top+6.25)+'px;width:'+(100/22)+'%;right:'+(100*(m-i)/22)+'%;">';
   cella.html(img);
  }
 }
}

function chiudifallisq(s,t,r){//s=squadra(0 o 1), t=tempo di gioco (1..4), r=righe (1..2)
 var c,cella,d,h,img,top;
 d=4-gara.fallisq[s];
 if (d>0){
  cella=$('#sq'+('ab'.charAt(s))+'t'+t+'f4');
  top=cella.position().top;
  c=gara.colore.charAt(0);
  img='<img src="lineao'+c+'.png" style="position:absolute;height:1px;right:'+(100/22)+'%;';
  img+='width:'+(d*20*5/22)+'%;';
  h='4'+img+'top:'+(top+6.25-2.25*(r==2))+'px;">';
  if (r==2) h+=img+'top:'+(top+8.5)+'px;">';
  cella.html(h);
 }
}

function chiudiparz(sq,nome,tempo){
 var c,cella,h,l,img,p,t,w;
 cella=$('#'+nome+tempo+sq);
 c=(cella.hasClass('blu'))?'b':'r';
 t=cella.position().top;
 l=cella.position().left+2;
 w=cella.width();
 p=cella.closest('div').width()+8;
 img='<img src="lineao'+c+'.png" style="position:absolute;height:1px;left:'+(100*l/p)+'%;';
 img+='width:'+(100*w/p)+'%;';
// h=img+'top:'+(t+4)+'px;">';
// h+=img+'top:'+(t+8.5)+'px;">';
 h=img+'top:'+(t+6.25)+'px;">';
 cella.html(h);
}

function chiudipun(s,r){//s=squadra(1..2), r=righe(&1rigacherchio,&2seconda riga,&3 entrambi)
 var cella,img,h,p,sq;
 sq='ab'.charAt(s);
 if ((r&1)&&(gara.ris[s]>0)){
  cella=$('#gp'+sq+gara.ris[s]);
  img='lineao'+gara.colore.charAt(0)+'.png';
  h='<img src="'+img+'" style="position:absolute;';
  h+=['left','right'][s]+':0;width:50%;height:2px;';
  h+='top:'+(cella.position().top+18.2-2)+'px;">';
  img='cerchio'+gara.colore.charAt(0)+'.png';
  h+='<img src="'+img+'" style="position:absolute;';
  h+=['left','right'][s]+':23%;width:27%;height:18.2px;';
  h+='top:'+(cella.position().top)+'px;">';
  cella.append(h);
 }
 if (r&2){
  cella=$('#gp'+sq+(gara.ris[s]+1));
  if (cella.length==0){
   alert('Il punteggio '+(gara.ris[s]+1)+' non esiste!\nNon disegno la seconda riga.');
  } else {
   img='lineao'+gara.colore.charAt(0)+'.png';
   h='<img src="'+img+'" style="position:absolute;';
   h+=['left','right'][s]+':0;width:50%;height:2px;';
   h+='top:'+(cella.position().top+4)+'px;">';
   cella.append(h);
  }
 }
}

function chiudito(sq,t,n,r){//sq=squadra(a o b), t=tempo di gioco (1,2,s,c), n=numsuppl, r=righe (1,2)
 var c,d,cella,h,img,left,nome,top;
 d=['1','2','s','c'].indexOf(t);
 left=n+1+4*(d>0)+5*(d>1)+3*(d>2);
 if (t=='c') nome='hcc'+n+sq;
 else nome='to'+t+n+sq;
 if (t=='s') nome=$('#'+nome).closest('td').attr('id');
 cella=$('#'+nome);
 top=cella.position().top;
 c=gara.colore.charAt(0);
 img='<img src="lineao'+c+'.png" style="position:absolute;height:1px;left:'+(100*left/22)+'%;';
 img+='width:'+(100/22)+'%;';
 h=img+'top:'+(top+6.25-2.25*(r==2))+'px;">';
 if (r==2) h+=img+'top:'+(top+8.5)+'px;">';
 cella.append(h);
}

function ctrlpagina2(f){//bit 1 annotaz, bit 2 estensione
 var d;
 d=$('#newpage');
 if ((f>0)&&(d.hasClass('hidden'))) d.removeClass('hidden');
 d=$('#annotaz');
 if (((f&1)!=0)&&(d.hasClass('hidden'))) d.removeClass('hidden');
 d=$('#estens');
 if (((f&2)!=0)&&(d.hasClass('hidden'))) d.removeClass('hidden');
}

function interprete(testo){
 var cella,dato,giocnum,giocsel,h,i,img,m,numeri,p,puntisi,r,result,riga,righe,s,selsq,sep,sint,sp,sq,panc,tdc,tmp,v,virg;
 result=new Array();
 numeri=gara.numerimaglia[0].concat(gara.numerimaglia[1]);
 panc=gara.staff[0].concat(gara.staff[1]);
 righe=testo.split('\n');
 r=0;
 while (r<righe.length){
  riga=righe[r]+' ';
  if (trim(riga).length==0){
   r++;
   continue;
  }
  while (riga.length>0){
   sp=riga.indexOf(' ');
   virg=riga.indexOf(',');
   if ((virg>=0)&&(virg<sp)) sep=virg;
   else sep=sp;
   //imposta il testo da cercare
   tdc=trim(riga.substring(0,sep));
   sint=-1;
   //cerca un giocatore di entrambe le squadre
   if ((dato=numeri.indexOf(tdc))>=0){
    selsq='AB'.indexOf(tdc.charAt(0));
    giocsel=gara.numerimaglia[selsq].indexOf(tdc);
    puntisi=true;
   } else if ((dato=panc.indexOf(tdc))>=0){//cerca uno dello staff
    selsq='AB'.indexOf(tdc.charAt(0));
    giocsel=gara.staff[selsq].indexOf(tdc);
    puntisi=false;
   } else if ((dato=['AT','BT'].indexOf(tdc))>=0){//cerca un autocanestro provvisorio
    selsq='AB'.indexOf(tdc.charAt(0));
    giocsel=-1;
    puntisi=true;
   }
   if (dato>=0){
    sint=0;
    giocnum=tdc.substring(1);
   }

   //cerca azione del giocatore
   if (sint==-1){
    v=('P1 P2 P3 F  ENT').indexOf((tdc+'  ').substring(0,3));
    dato=Math.floor(v/3);
    if ((v%3)==0){
     sint=0;
     switch (dato){

      case 0://p1
      case 1://p2
      case 2://p3
       if(puntisi){
        sq='ab'.charAt(selsq);
        p=gara.ris[selsq]+=dato+1;
        if (p>=160){//dobbiamo usare l'estensione oltre 160 punti
         if ($('#estens').hasClass('hidden')){//prima volta che si usa
          alert('Attivata l\'estensione oltre 160 punti.');
          ctrlpagina2(2);//mostra l'estensione
          m=161;
         } else {
          //trovo il (massimo + 2) come inizio delle nuove righe di punteggio
          i=gara.ris[selsq]-dato-1;
          h=gara.ris[1-selsq];
          m=((i>=h)?i:h)+2;
         }
         h='';
         for (i=m;i<=p+1;i++){//arrivo a p+1 per poter inserire la seconda riga di chiusura partita
          h+='<tr>';
          h+='<td id="gpa'+i+'" class="punt f10i"></td>';
          h+='<td id="pa'+i+'" class="punt"><div>'+i+'</div></td>';
          h+='<td id="pb'+i+'" class="punt"><div>'+i+'</div></td>';
          h+='<td id="gpb'+i+'" class="punt f10i"></td>';
          h+='</tr>';
         }
         $('#punteggio5 table.punti tbody').append(h);
        }
        cella=$('#gp'+sq+p);
        cella.addClass(gara.colore);
        h=giocnum;
        if (dato==2){//tiro da 3
         img='cerchio'+gara.colore.charAt(0)+'.png';
         h+='<img class="w23" src="'+img+'" style="position:absolute;';
         h+=['left','right'][selsq];
         h+=':0;top:'+cella.position().top+'px;';
         h+='height:18.2px;">';
        }
        if (dato==0) img='punto';
        else img='diago';
        img+=gara.colore.charAt(0)+'.png';
        h+='<img class="w27" src="'+img+'" style="position:absolute;';
        h+=['left','right'][selsq];
        h+=':23%;top:'+cella.position().top+'px;';
        h+='height:18.2px;">';
        cella.html(h);
       }
       break

      case 3://f
       //cerco dove va il fallo
       s='#n'+('ab'.charAt(selsq)+((puntisi)?(giocsel+1):giocnum)).toLowerCase()+'f';
       m=1;//cerco anche l'ultimo fallo della riga
       v=0;
       for (i=1;i<=6;i++){
        p=$(s+i);
        if (p.length>0){//esiste la cella del fallo
         m=i;
         if ((p.html().length==0)&&(v==0)) v=i;
        } else break;
       }
       cella=$(s+v);
       p=(trim(riga)).split(',');
       h=p[1];//tipo
       h+=(p[2].length>0)?'<small>'+p[2]+'</small>':'';
       if(p[3]=='F'){
        if (v==m) h+=p[3];//espulsione + rissa in ultima colonna
       }
       if (p[4]=='C'){
        img='cerchio'+gara.colore.charAt(0)+'.png';
        h+='<img src="'+img+'" style="position:absolute;';
        h+='top:'+cella.position().top+'px;';
        h+='right:'+(100*(m-v)/22)+'%;width:'+(100/22)+'%;height: 13.5px;">';
       }
       cella.addClass(gara.colore);
       cella.html(h);
       //chiude i falli per f
       if (p[3]=='F'){
        for (i=v+1;i<=m;i++){
         cella=$(s+i);
         cella.addClass(gara.colore);
         cella.text('F');
        }
       }
       //chiude i falli per d o gd
       if ((['D','GD'].indexOf(p[1])>=0)&&(p[3].length==0)){
        chiudifalli(selsq,((puntisi)?(''+(giocsel+1)):giocnum).toLowerCase(),gara.colore.charAt(0));
       }
       //fallo di squadra
       if (p[5]=='SQ'){
        gara.fallisq[selsq]++;
        if (gara.fallisq[selsq]<=4){
         h=(gara.tempo>4)?4:gara.tempo;
         cella=$('#sq'+('ab'.charAt(selsq))+'t'+h+'f'+gara.fallisq[selsq]);
         img='croce'+gara.colore.charAt(0)+'.png';
         h='<img src="'+img+'" style="position:absolute;';
         h+='top:'+cella.position().top+'px;';
         h+='right:'+(100*(5-gara.fallisq[selsq])/22)+'%;width:'+(100/22)+'%; height: 13.5px;">';
         cella.append(h);
        }
       }
       break;

      case 4://ent
       if(puntisi){
        cella=$('#n'+'ab'.charAt(selsq)+(giocsel+1)+'ent');
        img='croce'+gara.colore.charAt(0)+'.png';
        h='<img src="'+img+'" style="position:absolute;';
        h+='top:'+cella.position().top+'px;';
        h+='left:'+(100*15/22)+'%;width:'+(100/22)+'%; height: 13.5px;">';
        cella.html(h);
       }
       break;

     }
    }
   }

   //altri dati
   if (sint==-1){
    v=('INIZFINETO  HCC STOPNOTA').indexOf((tdc+'    ').substring(0,4));
    dato=Math.floor(v/4);
    if ((v%4)==0){
     sint=0;
     switch (dato){

      case 0://iniz
      case 1://fine
       s=riga.slice(sep+1);
       p=parseInt(s,10);
       sp=riga.indexOf(' ',sp+1);

       //INIZ
       if (dato==0){
        gara.tempo=p;
        gara.colore=['blu','rosso'][(p&1)*(p<5)];
        gara.stato=1;
        if (p<5){
         gara.fallisq=[0,0];
        }
        if (p==1){//inizio gara
         //cerchiare le entrate iniziali
         for (s=0;s<=1;s++){
          //annulla righe vuote
          annullarighesq(s);
          sq='ab'.charAt(s);
          for (i=0;i<=4;i++){
           v=gara.numerimaglia[s].indexOf(gara.entiniz[s][i]);
           if (v>=0){
            cella=$('#n'+sq+(v+1)+'ent');
            cella.append('<img src="cerchior.png" style="position:absolute;top:'+cella.position().top+'px;left:'+(100*15/22)+'%;width:'+(100/22)+'%;height:13.5px;">');
           }
          }
         }
        }
       } else {//dato==1
        //FINE
        gara.stato=2;
        for (s=0;s<=1;s++){
         sq='ab'.charAt(s);
         //registra parziale
         h=(gara.tempo>5)?5:gara.tempo;
         $('#nrq'+h+sq).text(gara.ris[s]-gara.ultimoris[s]);
         if (h<5) gara.ultimoris[s]=gara.ris[s];
         //chiusura tempo
         //punteggio fine quarto una riga e cerchiare il punteggio
         chiudipun(s,1);
         //falli di squadra non commessi una riga ma aspetta per il q4
         if (gara.tempo<4) chiudifallisq(s,gara.tempo,1);
         //chiusura quarto 2
         //linea greca
         if (gara.tempo==2) chiudifallilg(s);
         //chiusura timeout due righe
         for (i=1*(gara.tempo==2)+4*(gara.tempo==4)+gara.tempo*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
          i>=1-1*(gara.tempo==2)+1*(gara.tempo==4)+(gara.tempo-1)*(gara.tempo>=5);
          i--){
          if ($('#'+sosp[i]+sq).text().length==0) chiudito(sq,sosp[i].charAt(2),parseInt(sosp[i].charAt(3),10),2);
          else break;
         }
        }
       }
       break;

      case 2://to (A o B),minuto
       s=riga.slice(sep+1);
       sp=riga.indexOf(' ',sp+1);
       p=s.split(',');
       if (rtrim(p[0])=='Q4'){
        for (i=0;i<=1;i++){
         sq='ab'.charAt(i);
         cella=$('#to21'+sq);
         if (cella.html().length==0) chiudito(sq,'2',1,2);
        }
       } else {
        p[1]=parseInt(p[1],10)||0;
        sq=p[0].toLowerCase();
        if (gara.tempo>7+2*(gara.hcc!=1)){
         alert('Dato accettato ma impossibile scriverlo per mancanza di spazio!\nAggiungere una nota.');
         break;
        }
        m='';
        for (i=2*(gara.tempo>=3)+(gara.tempo-2)*(gara.tempo>=5);
         i<=1*(gara.tempo<=2)+4*(gara.tempo<=4)+gara.tempo*(gara.tempo<=7+2*(gara.hcc!=1));
         i++){
         h=sosp[i]+sq;
         cella=$('#'+h);
         s=(h.charAt(2)=='s')?cella.text():cella.html();
         if (s.length==0){
          if ((i==2)&&(p[1]>8)&&(gara.tempo==4)){
           //inserisce nel referto due righe, uno spazio e TO Q4, segnalando errore sintassi
           sint=-1;
           righe.splice(r,0,' ','TO Q4');
           break;
          } else {
           m=h;
           break;
          }
         }
        }
        if (m.length>0){
         cella=$('#'+m);
         if ('12c'.indexOf(m.charAt(2))>=0) cella.addClass(gara.colore);
         if (m.charAt(2)=='c'){
          if (($('#hcc1'+sq).text().length==0)&&($('#hcc2'+sq).text().length==0)){
           //riga su HCC
           i=$('td.chcc').eq('ab'.indexOf(sq));
           h='HCC';
           h+='<img src="lineaob.png" style="position:absolute;height:2px;width:'+(200/22)+'%;';
           h+='left:'+(1400/22)+'%;top:'+(i.position().top+5.75)+'px;">';
           i.html(h);
          }
         }
         cella.text(p[1]);
        }
       }
       break;

      case 3://hcc
       s=riga.slice(sep+1);
       sp=riga.indexOf(' ',sp+1);
       p=s.split(',');
       sq=p[0].toLowerCase();
       h=(gara.tempo<5)?''+gara.tempo+'Q':'S'+(gara.tempo-4);
       cella=$('#hcc1'+sq);
       cella.addClass(gara.colore);
       cella.text(h);
       cella=$('#hcc2'+sq);
       cella.addClass(gara.colore);
       cella.text(p[1]);
       break;

      case 4://stop
       switch (gara.stato){

        case 0:
         for (s=0;s<=1;s++){
          sq='ab'.charAt(s);
          annullarighesq(s);
          //chiude i falli
          for (i=0;i<gara.numerimaglia[s].length;i++) chiudifalli(s,''+(i+1),'b');
          for (i=0;i<gara.staff[s].length;i++) if (gara.staff[s][i].charAt(0)!='-') chiudifalli(s,gara.staff[s][i].substring(1).toLowerCase(),'b');
          //chiude falli sq 2 righe
          for (i=1;i<=4;i++){
           chiudifallisq(s,i,2);
          }
          //chiude timeout 1 riga
          for (i=0;i<sosp.length;i++) chiudito(sq,p.charAt(2),parseInt(p.charAt(3),10),1);
         }
         break;

        case 1:
         // gara terminata prima del normale epilogo
         //registra l'orario finale
         h=(gara.tempo>5)?5:gara.tempo;
         i=new Date();
         v=i.getHours()+':'+('0'+i.getMinutes()).slice(-2);
         $('#dora'+h+'f').text(v);
         voceset('dora'+h+'f',v);
         for (s=0;s<=1;s++){
          sq='ab'.charAt(s);
          //registra parziale
          $('#nrq'+h+sq).text(gara.ris[s]-gara.ultimoris[s]);
          //chiudi punteggio 2 righe
          chiudipun(s,3);
          //falli di squadra non commessi una riga
          chiudifallisq(s,(gara.tempo>4)?4:gara.tempo,1);
          //chiusura timeout due righe
          for (i=1*(gara.tempo<=2)+4*(gara.tempo<=4)+gara.tempo*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
           i>=1-1*(gara.tempo<=2)+1*(gara.tempo<=4)+(gara.tempo-1)*(gara.tempo>=5);
           i--){
           if ($('#'+sosp[i]+sq).text().length==0) chiudito(sq,sosp[i].charAt(2),parseInt(sosp[i].charAt(3),10),2);
           else break;
          }
         }
         gara.colore='blu';
         for (s=0;s<=1;s++){
          sq='ab'.charAt(s);
          //squadre nel risultato, noris nosqvin
          $('#nrsq'+sq).text($('#nsq'+sq).text());
          //hcc una riga se c'era
          if ((gara.hcc==1)&&($('#hcc1'+sq).text().length==0)) for (i=8;i<=9;i++) chiudito(sq,'c',i-7,1);
          //chiude i falli individuali
          for (i=0;i<gara.numerimaglia[s].length;i++) chiudifalli(s,''+(i+1),'b');
          for (i=0;i<gara.staff[s].length;i++) if (gara.staff[s][i].charAt(0)!='-') chiudifalli(s,gara.staff[s][i].substring(1).toLowerCase(),'b');
          //chiusura del non giocato
          //chiude timeout 1 riga
          for (i=2+3*(gara.tempo>=3)+(gara.tempo-4)*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
           i<=7+2*(gara.hcc!=1);
           i++){
           chiudito(sq,sosp[i].charAt(2),parseInt(sosp[i].charAt(3),10),1);
          }
          //falli di squadra 2 righe
          for(i=gara.tempo+1;i<=4;i++) chiudifallisq(s,i,2);
          //chiude ris parz
          for(i=gara.tempo+1;i<=5;i++) chiudiparz(sq,'nrq',i);
          //orario finale lo metti quando premi il bottone stop
          //chiude orari
          for(i=gara.tempo+1;i<=5;i++) chiudiparz('if'.charAt(s),'dora',i);
         }
         break;

        case 2:
         //ha già fatto le chiusure fine tempo
         //squadra vincente
         if (gara.ris[0]!=gara.ris[1]){
          sq='ab'.charAt((gara.ris[0]-gara.ris[1]>0)?0:1);
          s=$('#nsponsor'+sq).text();
          s=$('#nsoc'+sq).text()+(s.length>0?'<br>'+s:'');
          $('#nsqvin').html(s);
         }
         for (s=0;s<=1;s++){
          sq='ab'.charAt(s);
          //squadre nel risultato
          $('#nrsq'+sq).text($('#nsq'+sq).text());
          //punti nel risultato
          $('#npsq'+sq).text(gara.ris[s]);
          //hcc una riga se c'era
          if ((gara.hcc==1)&&($('#hcc1'+sq).text().length==0)) for (i=8;i<=9;i++) chiudito(sq,'c',i-7,1);
          //chiude i falli individuali
          for (i=0;i<gara.numerimaglia[s].length;i++) chiudifalli(s,''+(i+1),'b');
          for (i=0;i<gara.staff[s].length;i++) if (gara.staff[s][i].charAt(0)!='-') chiudifalli(s,gara.staff[s][i].substring(1).toLowerCase(),'b');
          //chiusura del non giocato
          //chiudi punteggio seconda riga
          chiudipun(s,2);
          //chiude timeout 1 riga
          for (i=2+3*(gara.tempo>=3)+(gara.tempo-4)*((gara.tempo>=5)&&(gara.tempo<=7+2*(gara.hcc!=1)));
           i<=7+2*(gara.hcc!=1);
           i++){
           chiudito(sq,sosp[i].charAt(2),parseInt(sosp[i].charAt(3),10),1);
          }
          //falli di squadra q4 1 riga
          chiudifallisq(s,4,1);
          //chiude ris parz
          for(i=gara.tempo+1;i<=5;i++) chiudiparz(sq,'nrq',i);
          //orario finale lo metti quando premi il bottone stop
          //chiude orari
          for(i=gara.tempo+1;i<=5;i++) chiudiparz('if'.charAt(s),'dora',i);
         }
         break;
        default:
         sint=-1;
       }
       gara.stato=3;
       break;

      case 5://nota
       sp=riga.lastIndexOf(' ');
       $('#npnote ul').append('<li class="'+gara.colore+'">'+trim(riga.substring(4))+'</li>');
       ctrlpagina2(1);
       break;
     }
    }
   }
   //taglia la parte della riga già elaborata
   riga=ltrim(riga.substring(sp+1));
  }
  //registra la riga
  if (sint==0) result.push(righe[r]);
  //incrementa il contatore di righe
  r++;
 }
 tmp=result.join('\n')+((result.length)>0?'\n':'');
 //aggiorna il referto in memoria
 gara.ref+=tmp;
 //aggiorna il referto su disco
 localStorage.refertofip+=tmp;
 return tmp;
}

function refgetrighe(){
 var r='\n</voci>\n';
 r=gara.ref.indexOf(r)+r.length;
 return gara.ref.substring(r);
}

function refiniz(){
 var n,s;
 gara={
  ref:'',
  ris:[0,0],
  ultimoris:[0,0],
  fallisq:[0,0],
  tempo:0,
  stato:0,
  hcc:0,
  colore:'rosso',
  numerimaglia:[[],[]],
  staff:[[],[]],
  entiniz:[new Array(5),new Array(5)]
 };
 n='\n';
 s='<voci>'+n;
 s+='ngara='+n;
 s+='nsoca='+n;
 s+='nsponsora='+n;
 s+='nusponsora='+n;
 s+='nsocb='+n;
 s+='nsponsorb='+n;
 s+='nusponsorb='+n;
 s+='ncampio='+n;
 s+='nlocal='+n;
 s+='ndata='+n;
 s+='ngir='+n;
 s+='ncampo='+n;
 s+='nore='+n;
 s+='narb1='+n;
 s+='narb2='+n;
 s+='narb3='+n;
 s+='dpaga='+n;
 s+='dhcc='+n;
 s+='nsqrecl='+n;
 s+='dora1i='+n;
 s+='dora1f='+n;
 s+='dora2i='+n;
 s+='dora2f='+n;
 s+='dora3i='+n;
 s+='dora3f='+n;
 s+='dora4i='+n;
 s+='dora4f='+n;
 s+='dora5i='+n;
 s+='dora5f='+n;
 s+='ncrono='+n;
 s+='nsegna='+n;
 s+='nadd24='+n;
 s+='ntcrono='+n;
 s+='ntsegna='+n;
 s+='ntadd24='+n;
 s+='ntarb1='+n;
 s+='ntarb2='+n;
 s+='ntarb3='+n;
 s+='dentiniz='+n;
 s+='nsqa='+n;
 s+='ncolsqa='+n;
 s+='xa1='+n;
 s+='xa2='+n;
 s+='xa3='+n;
 s+='xa4='+n;
 s+='xa5='+n;
 s+='xa6='+n;
 s+='xa7='+n;
 s+='xa8='+n;
 s+='xa9='+n;
 s+='xa10='+n;
 s+='xa11='+n;
 s+='xa12='+n;
 s+='yaall='+n;
 s+='yaaall='+n;
 s+='zaacc='+n;
 s+='zamed='+n;
 s+='zaadd='+n;
 s+='za2dir='+n;
 s+='zamass='+n;
 s+='ya2aall='+n;
 s+='ya3aall='+n;
 s+='yaprep='+n;
 s+='nsqb='+n;
 s+='ncolsqb='+n;
 s+='xb1='+n;
 s+='xb2='+n;
 s+='xb3='+n;
 s+='xb4='+n;
 s+='xb5='+n;
 s+='xb6='+n;
 s+='xb7='+n;
 s+='xb8='+n;
 s+='xb9='+n;
 s+='xb10='+n;
 s+='xb11='+n;
 s+='xb12='+n;
 s+='yball='+n;
 s+='ybaall='+n;
 s+='zbacc='+n;
 s+='zbmed='+n;
 s+='zb2dir='+n;
 s+='zbmass='+n;
 s+='yb2aall='+n;
 s+='yb3aall='+n;
 s+='ybprep='+n;
 s+='falla='+n;
 s+='fallb='+n;
 s+='frecl='+n;
 s+='fcrono='+n;
 s+='fsegna='+n;
 s+='fadd24='+n;
 s+='farb1='+n;
 s+='farb2='+n;
 s+='farb3='+n;
 s+='</voci>'+n;
 gara.ref=s;
}

function refload(){
 var ar,c,cella,d,foot,i,r,ref,refprog,s,sq,t,voce,v;
 ref=localStorage.refertofip;
 i='\n</voci>\n';
 foot=ref.indexOf(i);
 d=ref.substring('<voci>\n'.length,foot);
 refprog=ref.substring(foot+i.length);
 ar=d.split('\n');
 for (i=0;i<ar.length;i++){
  d=ar[i].indexOf('=');
  t=ar[i].slice(0,1);
  voce=ar[i].substring(1,d);
  v=ar[i].slice(d+1);
  voceset(t+voce,v);
  switch (t){
   case 'f':
    if (v.length>0){
     document.getElementById(t+voce).value=v;
     disegnoset($('#c'+t+voce));
     if (voce.slice(0,3)=='all'){
      puntic=(JSON.parse(v)).map(function(o){
       var p={};
       p.x=o.y;
       p.y=600-o.x;
       p.t=o.t;
       p.m=o.m;
       return p;
      });
     } else puntic=JSON.parse(v);
     ctx.scale(80/600,80/600);
     ridisegna();
    }
    break;
   case 'n':
    $('#n'+voce).text(v);
    break;
   case 'd':
    switch (voce.substring(0,3)){
     case 'ent'://entiniz
      if (v.length>0) gara.entiniz=JSON.parse(v);
      break;
     case 'pag'://paga
      $('.no-si').removeClass('fondonero');
      if (v=='1') $('#paga_no').addClass('fondonero');
      else $('#paga_si').addClass('fondonero');
      break;
     case 'hcc':
      gara.hcc=parseInt(v,10)||0;
      /*
      $('td.chcc').each(function(index){
       var h,t;
       t=$(this);
       h='HCC';
       if (gara.hcc==0){
        h+='<img src="lineaob.png" style="position:absolute;height:2px;width:'+(200/22)+'%;';
        h+='left:'+(1400/22)+'%;top:'+(t.position().top+5.75)+'px;">';
       }
       t.html(h);
      });
      */
      break;
     case 'ora':
      if (v.length>0){
       c='\n'+['INIZ ','FINE ']['if'.indexOf(voce.slice(-1))]+voce.slice(-2,-1)+'\n';
       if (('\n'+refprog).indexOf(c)>=0){
        $('#'+t+voce).text(v);
        voceset(t+voce,v);
       } else voceset(t+voce,'');
      }
      break;
    }
    break;
   case 'x':
    r=v.split(',');
    $('#x'+voce+'anno').text(r[0]);
    $('#x'+voce+'cogn').text(r[1]);
    $('#x'+voce+'cap').text((r[2]==1)?'CAP':'');
    $('#x'+voce+'nome').text(r[3]);
    $('#x'+voce+'num').text(r[4]);
    break;
   case 'y':
    r=v.split(',');
    $('#y'+voce+'cogn').text(r[0]);
    $('#y'+voce+'nome').text(r[1]);
    $('#y'+voce+'tess').text(r[2]);
    s='ab'.indexOf(voce.charAt(0));
    gara.staff[s].push((((r[0]+r[1]).length>0)?'':'-')+voce.toUpperCase());
    break;
   case 'z':
    r=v.split(',');
    $('#z'+voce+'cogn').text(r[0]);
    $('#z'+voce+'nome').text(r[1]);
    s='ab'.indexOf(voce.charAt(0));
    gara.staff[s].push((((r[0]+r[1]).length>0)?'':'-')+voce.toUpperCase());
    break;
   default:
  }
 }
 gara.numerimaglia=[[],[]];
 for (s=0;s<=1;s++){
  sq='ab'.charAt(s);
  sqm=sq.toUpperCase();
  for (i=1;i<=12;i++){
   v=$('#x'+sq+i+'num').text();
   if (v.length>0){
    gara.numerimaglia[s].push(sqm+v);
    if (gara.entiniz[s].indexOf(sqm+v)>=0){
     cella=$('#n'+sq+i+'ent');
     cella.html('<img src="croceb.png" style="position:absolute;top:'+cella.position().top+'px;left:'+(100*15/22)+'%;width:'+(100/22)+'%;height:13.5px;">');
    }
   }
  }
 }
 document.title='RefertoFIP'+voceget('ngara');
 localStorage.refertofip=gara.ref;
 //chiama l'interprete
 interprete(refprog);
}

function refsaveall(){
 localStorage.refertofip=gara.ref;
}

function refsetrighe(v){
 var r='\n</voci>\n';
 r=gara.ref.indexOf(r)+r.length;
 gara.ref=gara.ref.substring(0,r)+v;
 return;
}

function rileggi(){
 localStorage.ricarica='1';
 location.reload();
}

function sfondo(n){
 var c;
 document.body.className=n;
 c=[
  '1)&nbsp;Copia&nbsp;per&nbsp;l\'Ente&nbsp;Organizzatore',
  '2)&nbsp;Copia&nbsp;per&nbsp;il&nbsp;1&ordm;&nbsp;arbitro',
  '3)&nbsp;Copia&nbsp;per&nbsp;la&nbsp;squadra&nbsp;vincente',
  '4)&nbsp;Copia&nbsp;per&nbsp;la&nbsp;squadra&nbsp;perdente'
 ][['bianco','verde','rosa','giallo'].indexOf(n)];
 $('#copia').html(c);
}

function voceget(voce){
 var d,p,r,result,v;
 p=gara.ref.indexOf('</voci>');
 if (p<0) return result;
 d=gara.ref.substring(0,p);
 voce='\n'+voce+'=';
 v=voce.length;
 p=d.indexOf(voce);
 if (p>=0){
  r=d.indexOf('\n',p+v);
  result=d.substring(p+v,r);
 }
 return result;
}

function voceset(voce,valore){
 var d,foot,p,r,v;
 foot=gara.ref.indexOf('</voci>\n');
 d=gara.ref.substring(0,foot);
 voce='\n'+voce+'=';
 v=voce.length;
 p=d.indexOf(voce);
 if (p>=0){
  r=d.indexOf('\n',p+v);
  d=d.substring(0,p+v)+valore+d.substring(r);
  gara.ref=d+gara.ref.substring(foot);
 }
}
//fine funzioni generali