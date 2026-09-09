function ctrlnumero(o,minimo,massimo){
 var s=o.value;
 var r=parseInt(s,10);
 if (isNaN(r)) r=minimo;
 if (r<minimo) r=minimo;
 if (r>massimo) r=massimo;
 o.value=r;
 return true;
}

function ctrlvaluta(o){
 var s=o.value;
 s+=".0.00";
 var c="";
 var meno=false;
 var punto=false;
 var numero=false;
 var i=0;
 var d=0;
 var r="";
 for (i=0;i<s.length;i++){
  if (d>=2) break;
  c=s.charAt(i);
  if (c=="-" && !meno && !numero) {
   meno=true;
   r+=c;
   continue;
  }
  if ((c=="," || c==".") && !punto && numero) {
   punto=true;
   var n=parseInt(r,10);
   r=n+".";
   continue;
  }
  if (c>="0" && c<="9" && d<2) {
   numero=true;
   r+=c;
   if (punto) d++;
  }
 }
 o.value=r;
 return true;
}

function ctrldata(o){
 var s=o.value;
 if (s=="00/00/0000") return true;
 var oggi=new Date();
 var min2cifre=oggi.getFullYear()-95;
 var max2cifre=min2cifre+99;
 var mat=new Array(""+oggi.getDate(),""+(oggi.getMonth()+1),""+oggi.getFullYear());
 var indice=0;
 var flag=0;
 var i=0;
 var c="";
 for (i=0;i<s.length;i++){
  c=s.charAt(i);
  if ((c>="0")&&(c<="9")){
   if ((flag==0)){
    flag=1;
    mat[indice]="";
   }
   mat[indice]+=c;
  } else {
   if (flag==1) {
    indice++;
    flag=0;
   }
  }
  if (indice>2) break;
 }
 var d=parseInt(mat[0],10);
 var m=parseInt(mat[1],10);
 var y=parseInt(mat[2],10);
 if (mat[2].length<3)
  y=((y-(min2cifre%100))<0)?(y+max2cifre-(max2cifre%100)):(y+min2cifre-(min2cifre%100));
 oggi=new Date(y,m-1,d);
 var dd=oggi.getDate();
 var mm=oggi.getMonth()+1;
 var yy=oggi.getFullYear();
 mat[0]=('0'+dd).slice(-2);
 mat[1]=('0'+mm).slice(-2);
 mat[2]=('000'+yy).slice(-4);
 o.value=mat[0]+"/"+mat[1]+"/"+mat[2];
 if(yy==y && mm==m && dd==d){
  return true;
 }else{
  alert("Ricontrollare la data digitata!");
  return false;
 }
}

function ctrlanno(o){
 var s=o.value;
 var oggi=new Date();
 var min2cifre=oggi.getFullYear()-99;
 var max2cifre=min2cifre+99;
 var mat="";
 var i=0;
 var c="";
 for (i=0;i<s.length;i++){
  c=s.charAt(i);
  if ((c>="0")&&(c<="9")){
   mat+=c;
  }
 }
 if (mat.length==0)
  mat=""+max2cifre;
 var y=parseInt(mat,10);
 if (mat.length<3)
  y=((y-(min2cifre%100))<0)?(y+max2cifre-(max2cifre%100)):(y+min2cifre-(min2cifre%100));
 if (y>max2cifre)
  y=max2cifre;
 o.value=y;
 return true;
}

function maiusc(o) {
 var s = trim(o.value);
 o.value = s.toUpperCase();
 return true;
}

function ctrltime(o){
 var s=o.value;
 if (s=="0:00") return true;
 var mat=new Array("","");
 var indice=0;
 var flag=0;
 var i=0;
 var c="";
 for (i=0;i<s.length;i++){
  c=s.charAt(i);
  if ((c>="0")&&(c<="9")){
   if (flag==0) flag=1;
   mat[indice]+=c;
  } else {
   if (flag==1) {
    indice++;
    flag=0;
   }
  }
  if (indice>1) break;
 }
 mat[0]="0"+mat[0];
 mat[1]=mat[1]+"00";
 var h=parseInt(mat[0],10);
 var m=parseInt(mat[1].substring(0,2),10);
 if ((h>23)||(m>59)) {
  alert("Orario non valido.");
  o.focus();
  return false;
 }
 mat[0]=(''+h);
 mat[1]=('0'+m).slice(-2);
 o.value=mat[0]+":"+mat[1];
 return true;
}

function solonumeri(o) {
 var s=o.value.replace(/[^\d]/g,'');
 if (s!=o.value)
  o.value=s;
 return true;
}

function trim(stringToTrim){
 return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function ltrim(stringToTrim){
 return stringToTrim.replace(/^\s+/,"");
}

function rtrim(stringToTrim){
 return stringToTrim.replace(/\s+$/,"");
}

function novirgole(o){
 var v=o.value;
 o.value=v.replace(/,/g,'');
}