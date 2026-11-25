/* AM Nutrition — Coach Ahmed Maher */
(function(){
"use strict";
var WA="971562723518";
var SUPPS=window.AM_SUPPS||[], SUP={}; SUPPS.forEach(function(x){SUP[x.id]=x;});
var FOODS=(window.AM_FOODS||[]).slice(), VAULT=window.AM_VAULT||{}, ITER=window.AM_VAULT_ITER||200000, LINKS=window.AM_LINKS||{};
var F={}; FOODS.forEach(function(x){F[x.id]=x;});

/* ---------- language ---------- */
var NL=window.NL||{}, ORDER=["ar","en","ur","hi","ml","fil","fr","de","ru"].filter(function(k){return NL[k];});
var LANG=(function(){var s=null;try{s=localStorage.getItem("amw-lang");}catch(e){} if(s&&NL[s]) return s; var n=(navigator.language||"ar").toLowerCase(); var m={ar:"ar",ur:"ur",hi:"hi",ml:"ml",fil:"fil",tl:"fil",fr:"fr",de:"de",ru:"ru",en:"en"}; return m[n.slice(0,3)]||m[n.slice(0,2)]||"ar";})();
function T(k,v){var L=NL[LANG]||{}, s=L[k]!=null?L[k]:(NL.en&&NL.en[k]!=null?NL.en[k]:(NL.ar[k]!=null?NL.ar[k]:k)); if(v) for(var x in v) s=String(s).split("{"+x+"}").join(v[x]); return s;}
function FN(f){if(f.nl) return f.nl[LANG]||f.nl.en||f.n; var m=(NL[LANG]||{}).foods; if(m&&m[f.id]) return m[f.id]; if(LANG!=="ar"&&/^SP\d/.test(f.id)){var e=f.n.replace(/[\u0600-\u06FF][\s\S]*$/,"").trim(); if(e) return e;} return f.n;}
function ST(s){var m=(NL[LANG]||{}).states; return (m&&m[s])||s;}
function SUPT(x){var m=((NL[LANG]||{}).supp||{})[x.id]||{}; var o={}; for(var k in x) o[k]=x[k]; for(var j in m) o[j]=m[j]; return o;}
function match(f,q){q=q.toLowerCase(); return FN(f).toLowerCase().indexOf(q)>-1||f.n.toLowerCase().indexOf(q)>-1||(NL.en&&NL.en.foods&&(NL.en.foods[f.id]||"").toLowerCase().indexOf(q)>-1);}
function applyLang(){
  var L=NL[LANG]; document.documentElement.lang=LANG; document.documentElement.dir=L._dir||"ltr";
  $$("[data-i18n]").forEach(function(el){el.innerHTML=T(el.dataset.i18n);});
  $$("[data-i18n-ph]").forEach(function(el){el.placeholder=T(el.dataset.i18nPh);});
  $$("[data-i18n-aria]").forEach(function(el){el.setAttribute("aria-label",T(el.dataset.i18nAria));});
  $$(".langsel").forEach(function(sel){sel.innerHTML=ORDER.map(function(k){return '<option value="'+k+'"'+(k===LANG?' selected':'')+'>'+NL[k]._name+'</option>';}).join("");});
}
function setLang(l){ if(!NL[l]) return; LANG=l; try{localStorage.setItem("amw-lang",l);}catch(e){} applyLang(); if(S.client){ S.client=locC(S.client0); renderApp(); } }
/* a client's own texts (meal names, notes, tips…) follow the chosen language when the plan carries translations */
function locC(o){ if(!o||!o.i18n) return o; var d=o.i18n[LANG]||{};
  return (function m(v){ if(typeof v==="string") return d[v]!=null?d[v]:v; if(Array.isArray(v)) return v.map(m);
    if(v&&typeof v==="object"){ var r={}; for(var k in v) r[k]=(k==="i18n"||k==="extraFoods")?v[k]:m(v[k]); return r; } return v; })(o); }

/* ---------- helpers ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function r1(n){return Math.round(n*10)/10;}
function r0(n){return Math.round(n);}
function num(v){var n=parseFloat(String(v).replace(",","."));return isFinite(n)&&n>=0?n:0;}
function roundG(g){ if(g>=50) return Math.round(g/5)*5; if(g>=10) return Math.round(g); return Math.round(g*2)/2; }
function store(k,v){try{ if(v===undefined){var s=localStorage.getItem(k);return s?JSON.parse(s):null;} localStorage.setItem(k,JSON.stringify(v)); }catch(e){return null;}}
function pad(n){return (n<10?"0":"")+n;}
function today(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function unit(f){return f.u==="ml"?T("uMl"):T("uG");}
function mac(f,g){return {k:f.k*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100};}
var KEY={p:"p",c:"c",f:"f",k:"k"};
function BN(b){return T("b_"+b);}
function defBasis(f){
  var g=f.g;
  if(g==="بروتين"||g==="بروتين مكمل") return "p";
  if(g==="كارب"||g==="فاكهة"||g==="كارب مكمل"||g==="كارب سائل") return "c";
  if(g==="دهون") return "f";
  return "k";
}
var PIECES={FD0042:[50,"pcEgg"],FD0045:[10,"pcQegg"],FD0133:[28,"pcSlice"],FD0134:[28,"pcSlice"],FD0141:[9,"pcPiece"],FD0192:[8,"pcDate"],FD0191:[12,"pcRdate"],FD0161:[118,"pcBanana"],FD0162:[180,"pcApple"],FD0164:[150,"pcOrange"],FD0165:[75,"pcMand"],FD0176:[70,"pcKiwi"]};
/* household measures for carbs: grams per spoon / piece (approximate, the grams stay the reference) */
var MEAS={FD0116:[8,"pcSpoon"],FD0117:[8,"pcSpoon"],FD0118:[28,"pcCup"],FD0119:[14,"pcCup"],FD0120:[12,"pcSpoon"],FD0121:[12,"pcSpoon"],FD0123:[12,"pcSpoon"],FD0124:[12,"pcSpoon"],
  FD0125:[8,"pcSpoon"],FD0126:[8,"pcSpoon"],FD0127:[8,"pcSpoon"],FD0128:[10,"pcSpoon"],FD0129:[8,"pcSpoon"],
  FD0130:[90,"pcLoaf"],FD0131:[60,"pcLoaf"],FD0132:[60,"pcLoaf"],FD0135:[35,"pcSlice"],FD0136:[40,"pcSlice"],FD0137:[100,"pcPiece"],FD0138:[45,"pcLoaf"],FD0139:[26,"pcLoaf"],FD0140:[32,"pcSlice"],
  FD0142:[150,"pcPotato"],FD0143:[170,"pcPotato"],FD0144:[130,"pcSweetP"],FD0145:[115,"pcSweetP"],
  FD0154:[4,"pcTsp"],FD0155:[4,"pcTsp"],FD0156:[21,"pcSpoon"],FD0157:[20,"pcSpoon"],FD0158:[20,"pcSpoon"],FD0159:[20,"pcSpoon"],FD0160:[20,"pcSpoon"]};
var SPOON_SG={"أرز وحبوب مطهية":15,"مكرونة ونودلز":15,"بقوليات مطهية":15};
function measure(id){ if(PIECES[id]) return PIECES[id]; if(MEAS[id]) return MEAS[id]; var f=F[id]; if(f&&SPOON_SG[f.sg]) return [SPOON_SG[f.sg],"pcSpoon"]; return null; }
function pieceTxt(id,g,shop){var p=measure(id); if(!p) return ""; if(shop&&/^pc(Spoon|Tsp|Cup)$/.test(p[1])) return "";
  var x=g/p[0], n=(p[1]==="pcSpoon"&&x>=5)?Math.round(x):Math.round(x*2)/2; if(n<=0) return ""; return "≈ "+n+" "+T(p[1]);}
function dietOk(d,food){
  d=d||"all"; if(d==="all") return true;
  if(d==="vegan") return food.d==="vegan";
  if(d==="vegetarian") return food.d==="vegan"||food.d==="vegetarian";
  if(d==="pescatarian") return food.d!=="omnivore";
  return true;
}
function share(f,b){ if(!f.k) return 0; if(b==="p") return f.p*4/f.k; if(b==="c") return f.c*4/f.k; if(b==="f") return f.f*9/f.k; return 1; }

/* ---------- crypto (client data opens only with its code) ---------- */
var te=new TextEncoder();
function unb64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(x){return ("0"+x.toString(16)).slice(-2);}).join("");}
function openVault(code){
  if(!(window.crypto&&crypto.subtle)) return Promise.reject(new Error("nocrypto"));
  return crypto.subtle.digest("SHA-256",te.encode("amn-v1:"+code)).then(function(h){
    var e=VAULT[hex(h)]; if(!e) return null;
    return crypto.subtle.importKey("raw",te.encode(code),"PBKDF2",false,["deriveKey"]).then(function(base){
      return crypto.subtle.deriveKey({name:"PBKDF2",salt:unb64(e.s),iterations:ITER,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["decrypt"]);
    }).then(function(key){
      return crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(e.i)},key,unb64(e.d));
    }).then(function(pt){ return JSON.parse(new TextDecoder().decode(pt)); });
  });
}

/* ---------- state ---------- */
var S={gender:null,code:null,client:null,dayType:"train",swaps:{},grams:{},manual:{},labels:{},opt:{},log:{},fu:{},closed:{},reports:[],tab:"plan"};
var EXCL={};
function skey(){return "amn:"+S.code;}
function save(){store(skey(),{dayType:S.dayType,swaps:S.swaps,grams:S.grams,manual:S.manual,labels:S.labels,opt:S.opt,log:S.log,fu:S.fu,closed:S.closed,reports:S.reports});}
function load(){var s=store(skey())||{};
  S.dayType=s.dayType||"train"; S.swaps=s.swaps||{}; S.grams=s.grams||{}; S.manual=s.manual||{}; S.labels=s.labels||{}; S.opt=s.opt||{}; S.log=s.log||{}; S.fu=s.fu||{};
  var keys=Object.keys(S.log).sort(); while(keys.length>14){delete S.log[keys.shift()];}
  S.closed=s.closed||{}; S.reports=s.reports||[];
  var ck=Object.keys(S.closed).sort(); while(ck.length>21){delete S.closed[ck.shift()];}
}
function dayLog(){var t=today(); if(!S.log[t]) S.log[t]={meals:{},water:0,supp:{}}; return S.log[t];}
function rawDay(){var d=S.client.days||{}; return d[S.dayType]||d.train||d[Object.keys(d)[0]];}
function varSel(mi){var v=bucket(S.opt)["v"+mi]; return v==null?0:+v;}
function dayPlan(){   // a meal can offer variants (breakfast A / B): the chosen one becomes the meal's items
  var p=rawDay(); if(!(p.meals||[]).some(function(m){return m.variants;})) return p;
  var o={}; for(var k in p) o[k]=p[k];
  o.meals=p.meals.map(function(m,mi){ if(!m.variants) return m; var vi=Math.min(varSel(mi),m.variants.length-1), v=m.variants[vi], r={};
    for(var x in m) r[x]=m[x]; r.items=v.items; r.vi=vi; if(v.note) r.note=v.note; return r; });
  return o;
}
function bucket(o){return o[S.dayType]||(o[S.dayType]={});}
function excluded(f){return !!EXCL[f.id];}

/* ---------- alternatives ---------- */
function alternatives(src,grams,opt){
  opt=opt||{};
  var b=opt.basis||defBasis(src), target=src[KEY[b]]*grams/100, srcK=src.k*grams/100, pool;
  if(opt.ids&&opt.ids.length){ pool=opt.ids.map(function(i){return F[i];}).filter(Boolean); }
  else{
    var minShare=b==="k"?0:Math.min(0.45,share(src,b)*0.6);
    pool=FOODS.filter(function(x){
      if(x.id===src.id) return false;
      if(opt.scope&&opt.scope!=="near"){
        if(opt.scope==="supp"){ if(x.cat!=="مكمل") return false; } else if(opt.scope!=="all" && x.g!==opt.scope) return false;
      } else {
        var sameFam = src.cat==="مكمل" ? (x.cat==="مكمل" && x.g.split(" ")[0]===src.g.split(" ")[0]) : (x.cat!=="مكمل" && x.g===src.g);
        if(!sameFam) return false;
        if(x.sg==="سكر ومحليات طبيعية" && src.sg!==x.sg) return false;
        if(/دقيق|نشا/.test(x.n) && src.sg!==x.sg) return false;
        if(x.sg==="حبوب ودقيق جاف" && src.sg!==x.sg) return false;
        if(share(x,b)<minShare) return false;
      }
      if(b==="p" && (x.id==="SP008"||x.nc)) return false;
      return true;
    });
  }
  pool=pool.filter(function(x){return x.id!==src.id && !excluded(x) && dietOk(S.client&&S.client.diet,x) && x[KEY[b]]>0;});
  var list=pool.map(function(x){
    var gr=roundG(target/x[KEY[b]]*100), m=mac(x,gr), dk=srcK?(m.k-srcK)/srcK:0;
    return {f:x,g:gr,m:m,dk:dk,big:gr>Math.max(grams*3,400)};
  });
  list.sort(function(a,c){ return (a.big-c.big) || Math.abs(a.dk)-Math.abs(c.dk); });
  return {basis:b,target:target,list:list};
}
function diffHtml(dk,srcK,altK){
  var d=r0(altK-srcK), a=Math.abs(dk), cls=a<=0.12?"ok":(a<=0.3?"mid":"bad");
  return '<span class="diff '+cls+'">'+(d>0?"+":"")+d+" "+T("kcal")+"</span>";
}

/* ---------- effective item ---------- */
function effItem(mi,ii,item){
  var k=mi+"-"+ii;
  if(item.type==="manual"){
    var v=bucket(S.manual)[k]||{k:item.k||0,p:item.p||0,c:item.c||0,f:item.f||0};
    return {kind:"manual",m:{k:num(v.k),p:num(v.p),c:num(v.c),f:num(v.f)},v:v};
  }
  if(item.type==="label"){
    var on=!!bucket(S.opt)[k], L=S.labels[item.key]||presetLabel(item);
    if(!on) return {kind:"label",on:false,m:{k:0,p:0,c:0,f:0}};
    if(!L) return {kind:"label",on:true,noLabel:true,m:{k:0,p:0,c:0,f:0}};
    var sv=num(L.servings)||1;
    return {kind:"label",on:true,L:L,m:{k:num(L.k)*sv,p:num(L.p)*sv,c:num(L.c)*sv,f:num(L.f)*sv}};
  }
  var src=F[item.id]; if(!src) return null;
  var gOv=bucket(S.grams)[k], g=(gOv!=null&&S.client.editable)?gOv:item.g;
  var sw=bucket(S.swaps)[k];
  if(sw && F[sw]){
    var b=item.basis||defBasis(src), t=src[KEY[b]]*g/100, f=F[sw];
    if(f[KEY[b]]>0){ var g2=roundG(t/f[KEY[b]]*100); return {kind:"food",f:f,g:g2,m:mac(f,g2),src:src,srcG:g,swapped:true,edited:gOv!=null}; }
  }
  return {kind:"food",f:src,g:g,m:mac(src,g),src:src,srcG:g,swapped:false,edited:gOv!=null&&gOv!==item.g};
}

function presetLabel(item){ var p=item.preset&&SUP[item.preset]; if(!p||!p.mac) return null; return {sg:p.mac.sg,k:p.mac.k,p:p.mac.p,c:p.mac.c,f:p.mac.f,brand:p.name+" — "+p.brand,servings:1,preset:true,est:!!p.est}; }
function suppInfo(s){ var r=s.ref&&SUP[s.ref]; if(r) r=SUPT(r); if(!r) return {name:s.name,brand:s.brand||"",dose:s.dose,note:s.note}; return {name:r.name,brand:r.brand,dose:s.dose||(r.serving+(r.dir?" — "+r.dir:"")),note:s.note||r.note||"",per:r.per,est:r.est}; }

/* ---------- gate ---------- */
function setGender(g){
  S.gender=g; document.body.classList.toggle("female",g==="female");
  $$(".gender").forEach(function(b){b.classList.toggle("on",b.dataset.g===g);});
  var m=document.querySelector('meta[name=theme-color]'); if(m) m.content=g==="female"?"#1a0f22":"#07110c";
  store("amn:gender",g);
}
$$(".gender").forEach(function(b){b.addEventListener("click",function(){setGender(b.dataset.g); $("#gateErr").textContent=""; $("#codeIn").focus();});});
$("#codeForm").addEventListener("submit",function(e){e.preventDefault(); tryLogin($("#codeIn").value);});
var busy=false;
function tryLogin(code,silent){
  var c=String(code||"").toUpperCase().replace(/[^A-Z0-9-]/g,""), err=$("#gateErr");
  if(busy) return;
  if(!S.gender){ if(!silent) err.textContent=T("errGender"); return; }
  if(!c){ if(!silent) err.textContent=T("errCode"); return; }
  busy=true; err.textContent=""; $("#goBtn").textContent=T("wait");
  openVault(c).then(function(cl){
    busy=false; $("#goBtn").textContent=T("enter");
    if(cl && cl.gender && S.gender && cl.gender!==S.gender) cl=null;   // a man's code doesn't open under "woman" and the reverse
    if(!cl){ if(!silent) err.textContent=T("errNF"); return; }
    S.code=c; S.client0=cl; S.client=locC(cl); EXCL={};
    (cl.extraFoods||[]).forEach(function(x){ if(!F[x.id]){F[x.id]=x; FOODS.push(x);} });
    (cl.exclude||[]).forEach(function(id){EXCL[id]=1;});
    load(); store("amn:code",c);
    var wd=["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]; if(cl.days&&cl.days[wd]) S.dayType=wd;   // weekly plans open on today
    $("#gate").classList.add("hidden"); $("#app").classList.remove("hidden"); window.scrollTo(0,0);
    renderApp();
  }).catch(function(){ busy=false; $("#goBtn").textContent=T("enter"); if(!silent) err.textContent=T("errFail"); });
}
$("#logout").addEventListener("click",function(){ location.href="../index.html"; });

/* ---------- app ---------- */
function renderApp(){
  var c=S.client;
  $("#hi").textContent=T("hi",{name:c.name||""});
  $("#goal").textContent=c.goal||"";
  $("#updated").textContent=c.updated?T("updated",{d:c.updated}):"";
  $("#bodyTab").classList.toggle("hidden",!c.body);
  var days=c.days||{}, keys=Object.keys(days), dt=$("#dayToggle");
  if(keys.indexOf(S.dayType)<0) S.dayType=keys[0];
  if(keys.length>1){
    dt.classList.remove("hidden");
    dt.innerHTML=keys.map(function(k){return '<button type="button" data-d="'+k+'" class="'+(k===S.dayType?"on":"")+'">'+esc(days[k].label||k)+'</button>';}).join("");
    $$("button",dt).forEach(function(b){b.onclick=function(){S.dayType=b.dataset.d; save(); renderApp();};});
  } else dt.classList.add("hidden");
  if(S.tab==="body"&&!c.body) S.tab="plan";
  renderPlan(); renderTotals(); renderSupp(); renderBody(); renderShop(); renderCalc(); renderMore();
  showTab(S.tab);
}
function planTotals(onlyEaten){
  var p=dayPlan(), t={k:0,p:0,c:0,f:0}, log=dayLog();
  (p.meals||[]).forEach(function(m,mi){
    if(onlyEaten && !log.meals[S.dayType+":"+mi]) return;
    m.items.forEach(function(it,ii){var e=effItem(mi,ii,it); if(e){t.k+=e.m.k;t.p+=e.m.p;t.c+=e.m.c;t.f+=e.m.f;}});
  });
  return t;
}
function renderTotals(){
  var t=planTotals(false), e=planTotals(true), TG=dayPlan().targets||S.client.targets;
  function card(cls,key,label){
    if(TG){
      var tv=TG[key], pv=t[key], off=Math.abs(pv-tv)>tv*0.05;
      return '<div class="metric '+cls+'"><span class="num">'+r0(tv)+'</span><small>'+label+'</small><span class="tgt'+(off?' off':'')+'">'+T("yourPlan",{n:r0(pv)})+'</span></div>';
    }
    return '<div class="metric '+cls+'"><span class="num">'+r0(t[key])+'</span><small>'+label+'</small></div>';
  }
  $("#totals").innerHTML=card("kcal","k",T("kcal"))+card("pro","p",T("mPro"))+card("","c",T("mCarb"))+card("","f",T("mFat"));
  var line="";
  if(TG){
    var tn=dayPlan().targets_note||S.client.targets_note; line=(tn?esc(tn)+"<br>":"");
    if(e.k>0) line+=T("eatenLeft",{k:"<b style='color:var(--gold)'>"+r0(e.k)+"</b>",lk:r0(TG.k-e.k),lp:r0(TG.p-e.p),lc:r0(TG.c-e.c),lf:r0(TG.f-e.f)});
    else line+=T("eatenHint");
  } else line= e.k>0 ? T("eatenSoFar",{k:"<b style='color:var(--gold)'>"+r0(e.k)+"</b>",p:r0(e.p)}) : T("eatenHint2");
  $("#eatenLine").innerHTML=line;
  $$("[data-mealk]").forEach(function(el){
    var mi=+el.dataset.mealk, m=dayPlan().meals[mi], k=0;
    m.items.forEach(function(it,ii){var x=effItem(mi,ii,it); if(x) k+=x.m.k;});
    el.textContent=r0(k)+" "+T("kcal");
  });
}
function metaHtml(e){
  return '<span class="badge state">'+esc(ST(e.f.s))+'</span>'+(e.f.est?'<span class="tag est">'+T("est")+'</span>':'')+'<i>'+r0(e.m.k)+' '+T("kcal")+'</i><i>'+T("aP")+' '+r1(e.m.p)+'</i><i>'+T("aC")+' '+r1(e.m.c)+'</i><i>'+T("aF")+' '+r1(e.m.f)+'</i>';
}
function itemRow(mi,ii,it){
  var k=mi+"-"+ii, e=effItem(mi,ii,it);
  if(!e) return '<div class="row"><div class="info muted">'+T("missing",{id:esc(it.id)})+'</div></div>';
  if(e.kind==="manual"){
    return '<div class="row"><div class="info"><div class="nm">✍️ '+esc(it.name)+'</div>'+(it.note?'<div class="note">'+esc(it.note)+'</div>':'')+
      '<div class="mgrid">'+[["k",T("lK")],["p",T("lP")],["c",T("lC")],["f",T("lF")]].map(function(x){return '<div><label>'+x[1]+'</label><input type="number" min="0" step="1" inputmode="decimal" data-man="'+k+'" data-mk="'+x[0]+'" value="'+(num(e.v[x[0]])||"")+'" placeholder="0"></div>';}).join("")+'</div></div></div>';
  }
  if(e.kind==="label"){
    var h='<div class="row"><div class="info"><div class="nm">🥤 '+esc(it.name)+(it.optional?' <span class="badge">'+T("optional")+'</span>':'')+'</div>'+(it.note?'<div class="note">'+esc(it.note)+'</div>':'');
    if(!e.on) h+='<button type="button" class="btn secondary" style="margin-top:6px;padding:7px 12px" data-opt="'+k+'">'+T("addToday")+'</button>';
    else {
      var L=S.labels[it.key]||presetLabel(it)||{};
      if(e.noLabel||S._editLabel===it.key){
        h+='<div class="muted" style="margin-top:6px">'+T("labelHint")+'</div><div class="lbl-form">'+
          [["sg",T("lSg")],["k",T("lK")],["p",T("lP")],["c",T("lC")],["f",T("lF")]].map(function(x){return '<div><label>'+x[1]+'</label><input type="number" min="0" step="0.1" inputmode="decimal" data-lb="'+esc(it.key)+'" data-lk="'+x[0]+'" value="'+(L[x[0]]!=null?L[x[0]]:"")+'"></div>';}).join("")+
          '</div><input type="text" placeholder="'+T("brandPh")+'" data-lb="'+esc(it.key)+'" data-lk="brand" value="'+esc(L.brand||"")+'" style="margin-top:6px">'+
          '<div style="display:flex;gap:6px;margin-top:6px"><button type="button" class="btn primary" style="padding:7px 12px" data-lsave="'+esc(it.key)+'">'+T("saveB")+'</button><button type="button" class="btn ghost" style="padding:7px 12px" data-opt="'+k+'">'+T("removeB")+'</button></div>';
      } else {
        h+='<div class="meta" style="margin-top:3px"><span class="badge state">'+esc(L.brand||T("fromLabel"))+' • '+esc(L.sg||"?")+' '+T("uG")+'</span>'+(L.est?'<span class="tag est">'+T("est")+'</span>':'')+'<i>'+r0(e.m.k)+' '+T("kcal")+'</i><i>'+T("aP")+' '+r1(e.m.p)+'</i><i>'+T("aC")+' '+r1(e.m.c)+'</i><i>'+T("aF")+' '+r1(e.m.f)+'</i></div>'+
           '<div style="display:flex;gap:6px;margin-top:6px"><button type="button" class="btn ghost" style="padding:6px 11px" data-ledit="'+esc(it.key)+'">'+T("editLabel")+'</button><button type="button" class="btn ghost" style="padding:6px 11px" data-opt="'+k+'">'+T("removeB")+'</button></div>';
      }
    }
    return h+'</div></div>';
  }
  var pc=pieceTxt(e.f.id,e.g), ed=S.client.editable && !e.swapped;
  var qty= ed ? '<div class="qty"><input class="qin" type="number" min="0" step="5" inputmode="decimal" data-g="'+k+'" value="'+e.g+'"><small>'+unit(e.f)+'</small>'+(pc?'<small data-pc="'+k+'">'+pc+'</small>':'<small data-pc="'+k+'"></small>')+(e.edited?'<a class="reset" data-greset="'+k+'">'+T("origG",{g:it.g})+'</a>':'')+'</div>'
             : '<div class="qty"><b>'+e.g+'</b><small>'+unit(e.f)+'</small>'+(pc?'<small>'+pc+'</small>':'')+'</div>';
  return '<div class="row">'+qty+
    '<div class="info"><div class="nm">'+esc(FN(e.f))+(it.taste?' <span class="badge">'+T("taste")+'</span>':'')+'</div>'+
      '<div class="meta" data-meta="'+k+'">'+metaHtml(e)+'</div>'+
      (e.swapped?'<div class="swapped-tag">'+T("swappedFor",{g:e.srcG,u:unit(e.src),n:esc(FN(e.src))})+'<a data-reset="'+k+'">'+T("restore")+'</a></div>':'')+
      (it.note&&!e.swapped?'<div class="note">'+esc(it.note)+'</div>':'')+
    '</div>'+
    '<button class="swapbtn" type="button" data-swap="'+k+'">'+T("swapB")+'</button>'+
  '</div>';
}
function rerenderAll(){ renderPlan(); renderTotals(); renderShop(); }
/* ---------- finished days + automatic weekly report ---------- */
function snapDay(){   // what the client actually did today, saved when they tap "finish today"
  var p=dayPlan(), log=dayLog(), TG=p.targets||S.client.targets||null, eat={k:0,p:0,c:0,f:0}, meals=[], sw=[];
  (p.meals||[]).forEach(function(m,mi){
    var on=!!log.meals[S.dayType+":"+mi], t={k:0,p:0,c:0,f:0};
    m.items.forEach(function(it,ii){var e=effItem(mi,ii,it); if(!e) return; t.k+=e.m.k;t.p+=e.m.p;t.c+=e.m.c;t.f+=e.m.f; if(e.swapped&&e.src) sw.push([e.src.id,e.f.id]);});
    if(on){eat.k+=t.k;eat.p+=t.p;eat.c+=t.c;eat.f+=t.f;}
    meals.push({mi:mi,n:m.name,e:on?1:0});
  });
  return {d:today(),dk:S.dayType,eat:{k:r0(eat.k),p:r0(eat.p),c:r0(eat.c),f:r0(eat.f)},tg:TG?{k:TG.k,p:TG.p,c:TG.c,f:TG.f}:null,meals:meals,sw:sw,w:S.client.water_cups?(log.water||0):null};
}
function pendingDays(){ var used={}; S.reports.forEach(function(r){r.days.forEach(function(x){used[x.d]=1;});}); return Object.keys(S.closed).sort().filter(function(d){return !used[d];}); }
function closeDay(){
  S.closed[today()]=snapDay();
  var pend=pendingDays();
  if(pend.length>=7){
    var days=pend.slice(0,7).map(function(d){return S.closed[d];});
    S.reports.push({days:days}); while(S.reports.length>6) S.reports.shift();
    S._rep=S.reports.length-1;
  }
  save(); renderPlan(); window.scrollTo({top:$("#t-plan").offsetTop-10,behavior:"smooth"});
}
function mealName(x){ var d=(S.client.days||{})[x.dk], m=d&&d.meals&&d.meals[x.mi]; return (m&&m.name)||x.n; }
function repStats(r){
  var D=r.days, st={n:D.length,from:D[0].d,to:D[D.length-1].d,eaten:0,total:0,avg:{k:0,p:0,c:0,f:0},tg:null,swaps:{},missed:{},protLow:0,kcalHigh:0,kcalLow:0,water:null,best:null,weak:null};
  var tgs=D.filter(function(x){return x.tg;}), wsum=0, wn=0;
  D.forEach(function(x){
    var e=x.meals.filter(function(m){return m.e;}).length; st.eaten+=e; st.total+=x.meals.length;
    ["k","p","c","f"].forEach(function(k){st.avg[k]+=x.eat[k]/D.length;});
    x.meals.forEach(function(m){ if(!m.e){var nm=mealName({dk:x.dk,mi:m.mi,n:m.n}); st.missed[nm]=(st.missed[nm]||0)+1;} });
    x.sw.forEach(function(s){var k=s[0]+">"+s[1]; st.swaps[k]=(st.swaps[k]||0)+1;});
    if(x.tg){ if(x.eat.p<x.tg.p*0.9) st.protLow++; if(x.eat.k>x.tg.k*1.1) st.kcalHigh++; if(e>0&&x.eat.k<x.tg.k*0.8) st.kcalLow++; }
    if(x.w!=null){wsum+=x.w;wn++;}
    x._score=(x.meals.length?e/x.meals.length:0)-(x.tg?Math.abs(x.eat.k-x.tg.k)/x.tg.k*0.5:0);
  });
  if(tgs.length){ st.tg={k:0,p:0,c:0,f:0}; tgs.forEach(function(x){["k","p","c","f"].forEach(function(k){st.tg[k]+=x.tg[k]/tgs.length;});}); }
  if(wn) st.water=r1(wsum/wn*0.25);
  var sorted=D.slice().sort(function(a,b){return b._score-a._score;}); st.best=sorted[0]; st.weak=sorted[sorted.length-1];
  st.pct=st.total?Math.round(st.eaten/st.total*100):0;
  st.topSwaps=Object.keys(st.swaps).sort(function(a,b){return st.swaps[b]-st.swaps[a];}).slice(0,3).map(function(k){var a=k.split(">");return {a:F[a[0]],b:F[a[1]],n:st.swaps[k]};}).filter(function(x){return x.a&&x.b;});
  var mk=Object.keys(st.missed).sort(function(a,b){return st.missed[b]-st.missed[a];}); st.topMissed=mk.length?{n:mk[0],c:st.missed[mk[0]]}:null;
  return st;
}
function fmtD(d,l){ try{ return new Date(d+"T00:00:00").toLocaleDateString(l==="ar"?"ar-EG":l,{weekday:"short",day:"numeric",month:"short"}); }catch(e){ return d; } }
function ARW(l){ return ((NL[l]||{})._dir==="rtl")?" ← ":" → "; }
function TL(l,k,v){ var o=LANG; LANG=l; var s=T(k,v); LANG=o; return s; }
function repNotes(st,l){
  var n=[];
  if(st.protLow) n.push(TL(l,"nProtLow",{n:st.protLow}));
  if(st.kcalHigh) n.push(TL(l,"nKcalHigh",{n:st.kcalHigh}));
  if(st.kcalLow) n.push(TL(l,"nKcalLow",{n:st.kcalLow}));
  if(st.water!=null) n.push(TL(l,"nWater",{l:st.water}));
  if(st.pct>=85&&!st.protLow&&!st.kcalHigh&&!st.kcalLow) n.push(TL(l,"nGreat"));
  return n;
}
function repText(st){   // message to the coach: Arabic if the client uses Arabic, otherwise English
  var l=LANG==="ar"?"ar":"en", L=[];
  L.push("📊 "+TL(l,"repT")+" — "+(S.client.name||"")+" ("+S.code+")");
  L.push(TL(l,"repPeriod",{a:fmtD(st.from,l),b:fmtD(st.to,l),n:st.n}));
  L.push("✅ "+TL(l,"repAdh")+": "+st.eaten+"/"+st.total+" ("+st.pct+"%)");
  var a=st.avg, t=st.tg;
  L.push("🍽️ "+TL(l,"repAvg")+": "+r0(a.k)+(t?"/"+r0(t.k):"")+" "+TL(l,"kcal")+" · "+TL(l,"aP")+" "+r0(a.p)+(t?"/"+r0(t.p):"")+" · "+TL(l,"aC")+" "+r0(a.c)+(t?"/"+r0(t.c):"")+" · "+TL(l,"aF")+" "+r0(a.f)+(t?"/"+r0(t.f):""));
  if(st.topSwaps.length) L.push("🔄 "+TL(l,"repSwaps")+": "+st.topSwaps.map(function(x){var o=LANG;LANG=l;var s=FN(x.a)+ARW(l)+FN(x.b)+" ×"+x.n;LANG=o;return s;}).join(" | "));
  if(st.topMissed) L.push("⚠️ "+TL(l,"repMissed")+": "+st.topMissed.n+" ×"+st.topMissed.c);
  L.push("⭐ "+TL(l,"repBest")+": "+fmtD(st.best.d,l)+" · "+TL(l,"repWeak")+": "+fmtD(st.weak.d,l));
  repNotes(st,l).forEach(function(x){L.push("• "+x);});
  return L.join("\n");
}
function repHtml(i){
  var r=S.reports[i]; if(!r) return ""; var st=repStats(r), a=st.avg, t=st.tg;
  function row(lbl,k,u){ var v=r0(a[k]), tv=t?r0(t[k]):null, off=t&&Math.abs(v-tv)>tv*0.1; return '<div class="rrow"><span>'+lbl+'</span><b'+(off?' class="off"':'')+'>'+v+(tv!=null?' <small>/ '+tv+'</small>':'')+' '+u+'</b></div>'; }
  return '<div class="card report"><div class="meal-head"><h3>📊 '+T("repT")+'</h3><button type="button" class="eat" data-repclose>'+T("repClose")+'</button></div>'+
    '<div class="muted">'+esc(T("repPeriod",{a:fmtD(st.from,LANG),b:fmtD(st.to,LANG),n:st.n}))+'</div>'+
    '<div class="rbig"><b>'+st.pct+'%</b><span>'+T("repAdh")+' · '+st.eaten+'/'+st.total+'</span><i style="width:'+st.pct+'%"></i></div>'+
    '<h4>'+T("repAvg")+'</h4>'+row(T("kcal"),"k","")+row(T("mPro"),"p","")+row(T("mCarb"),"c","")+row(T("mFat"),"f","")+
    '<h4>'+T("repSwaps")+'</h4>'+(st.topSwaps.length?st.topSwaps.map(function(x){return '<div class="rrow"><span>'+esc(FN(x.a))+ARW(LANG)+esc(FN(x.b))+'</span><b>×'+x.n+'</b></div>';}).join(""):'<div class="muted">'+T("repNoSwaps")+'</div>')+
    (st.topMissed?'<h4>'+T("repMissed")+'</h4><div class="rrow"><span>'+esc(st.topMissed.n)+'</span><b>×'+st.topMissed.c+'</b></div>':'')+
    '<div class="rrow"><span>⭐ '+T("repBest")+'</span><b>'+esc(fmtD(st.best.d,LANG))+'</b></div><div class="rrow"><span>💪 '+T("repWeak")+'</span><b>'+esc(fmtD(st.weak.d,LANG))+'</b></div>'+
    '<h4>'+T("repNotes")+'</h4><ul class="rnotes">'+repNotes(st,LANG).map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>'+
    '<a class="btn wa-send" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent(repText(st))+'">'+T("repSend")+'</a></div>';
}
function dayCardHtml(){
  var done=!!S.closed[today()], n=pendingDays().length;
  var h='<div class="card daycard"><div class="meal-head"><h3>'+(done?T("daySaved"):T("dayDoneT"))+'</h3><span class="meal-kcal">'+T("weekProg",{n:n})+'</span></div>'+
    '<div class="dots">'+[0,1,2,3,4,5,6].map(function(i){return '<i class="'+(i<n?"on":"")+'"></i>';}).join("")+'</div>';
  h+= done ? (pendingDays().indexOf(today())>-1?'<button type="button" class="eat" data-reopen>'+T("dayReopen")+'</button>':'')
           : '<p class="muted" style="margin:8px 0">'+T("dayDoneHint")+'</p><button type="button" class="btn daybtn" data-closeday>'+T("dayDone")+'</button>';
  if(S.reports.length) h+='<button type="button" class="eat" style="margin-inline-start:8px" data-repview>'+T("repView")+'</button>';
  return h+'</div>';
}
function renderPlan(){
  var p=dayPlan(), log=dayLog(), h="";
  if(S.client.editable) h+='<div class="muted" style="margin:4px 2px 0">'+T("editHint")+'</div>';
  h+='<div class="muted" style="margin:4px 2px 0">'+T("spoonHint")+'</div>';
  (p.meals||[]).forEach(function(m,mi){
    var done=!!log.meals[S.dayType+":"+mi];
    h+='<div class="card'+(done?' done':'')+'"><div class="meal-head"><div class="t"><h3>'+esc(m.name)+'</h3>'+(m.time?'<span class="meal-time">🕒 '+esc(m.time)+'</span>':'')+'<span class="meal-kcal" data-mealk="'+mi+'"></span></div>'+
       '<button type="button" class="eat'+(done?' on':'')+'" data-eat="'+mi+'">'+(done?T("eatOn"):T("eatOff"))+'</button></div>'+
       (m.variants?'<div class="variants">'+m.variants.map(function(v,vi){return '<button type="button" class="pill'+(vi===m.vi?' on':'')+'" data-var="'+mi+':'+vi+'">'+esc(v.label)+'</button>';}).join("")+'</div>':'')+
       m.items.map(function(it,ii){return itemRow(mi,ii,it);}).join("")+
       (m.note?'<div class="note" style="margin-top:6px">💡 '+esc(m.note)+'</div>':'')+'</div>';
  });
  if(S.client.water_cups){
    var cups=S.client.water_cups, w=log.water||0, cupsH="";
    for(var i=0;i<cups;i++) cupsH+='<button type="button" class="cup'+(i<w?' on':'')+'" data-cup="'+i+'" aria-label="'+T("cup",{n:i+1})+'"></button>';
    h+='<div class="card"><div class="meal-head"><h3>'+T("waterT")+'</h3><span class="meal-kcal">'+T("waterL",{w:w,c:cups,l:r1(w*0.25)})+'</span></div><div class="water">'+cupsH+'</div></div>';
  }
  h+=dayCardHtml();
  if(S._rep!=null&&S.reports[S._rep]) h=repHtml(S._rep)+h;
  var el=$("#t-plan"); el.innerHTML=h;
  $$("[data-closeday]",el).forEach(function(b){b.onclick=closeDay;});
  $$("[data-reopen]",el).forEach(function(b){b.onclick=function(){ var used=pendingDays().indexOf(today())>-1; if(used){delete S.closed[today()]; save(); renderPlan();} };});
  $$("[data-repview]",el).forEach(function(b){b.onclick=function(){S._rep=S.reports.length-1; renderPlan(); window.scrollTo({top:$("#t-plan").offsetTop-10,behavior:"smooth"});};});
  $$("[data-repclose]",el).forEach(function(b){b.onclick=function(){S._rep=null; renderPlan();};});
  $$("[data-eat]",el).forEach(function(b){b.onclick=function(){var k=S.dayType+":"+b.dataset.eat, l=dayLog(); if(l.meals[k]) delete l.meals[k]; else l.meals[k]=1; save(); renderPlan(); renderTotals();};});
  $$("[data-swap]",el).forEach(function(b){b.onclick=function(){var a=b.dataset.swap.split("-"); openSwap(+a[0],+a[1]);};});
  $$("[data-var]",el).forEach(function(b){b.onclick=function(){
    var a=b.dataset.var.split(":"), mi=a[0];
    [S.swaps,S.grams].forEach(function(o){var bk=bucket(o); Object.keys(bk).forEach(function(k){ if(k.split("-")[0]===mi) delete bk[k]; });});   // a swap or gram change belonged to the other variant
    bucket(S.opt)["v"+mi]=+a[1]; save(); rerenderAll();
  };});
  $$("[data-reset]",el).forEach(function(b){b.onclick=function(){delete bucket(S.swaps)[b.dataset.reset]; save(); rerenderAll();};});
  $$("[data-greset]",el).forEach(function(b){b.onclick=function(){delete bucket(S.grams)[b.dataset.greset]; save(); rerenderAll();};});
  $$("[data-cup]",el).forEach(function(b){b.onclick=function(){var l=dayLog(), i=+b.dataset.cup; l.water=(l.water===i+1)?i:i+1; save(); renderPlan();};});
  $$("[data-g]",el).forEach(function(inp){
    inp.addEventListener("input",function(){
      var k=inp.dataset.g, a=k.split("-"), it=dayPlan().meals[+a[0]].items[+a[1]];
      bucket(S.grams)[k]=num(inp.value); save();
      var e=effItem(+a[0],+a[1],it); $('[data-meta="'+k+'"]').innerHTML=metaHtml(e);
      var pcEl=$('[data-pc="'+k+'"]'); if(pcEl) pcEl.textContent=pieceTxt(e.f.id,e.g);
      renderTotals();
    });
    inp.addEventListener("change",function(){rerenderAll();});
  });
  $$("[data-man]",el).forEach(function(inp){
    inp.addEventListener("input",function(){
      var k=inp.dataset.man, a=k.split("-"), it=dayPlan().meals[+a[0]].items[+a[1]], b=bucket(S.manual);
      if(!b[k]) b[k]={k:it.k||0,p:it.p||0,c:it.c||0,f:it.f||0};
      b[k][inp.dataset.mk]=num(inp.value); save(); renderTotals();
    });
  });
  $$("[data-opt]",el).forEach(function(b){b.onclick=function(){var o=bucket(S.opt),k=b.dataset.opt; if(o[k]) delete o[k]; else o[k]=1; S._editLabel=null; save(); rerenderAll();};});
  $$("[data-ledit]",el).forEach(function(b){b.onclick=function(){S._editLabel=b.dataset.ledit; renderPlan(); renderTotals();};});
  $$("[data-lsave]",el).forEach(function(b){b.onclick=function(){
    var key=b.dataset.lsave, L={};
    $$('[data-lb="'+key+'"]',el).forEach(function(i){L[i.dataset.lk]=i.dataset.lk==="brand"?i.value.trim():num(i.value);});
    if(!L.sg||!(L.k||L.p)){ alert2(T("labelErr")); return; }
    L.servings=1; S.labels[key]=L; S._editLabel=null; save(); rerenderAll();
  };});
}
function alert2(t){ var w=$("#t-plan .warn.tmp"); if(w) w.remove(); var d=document.createElement("div"); d.className="warn tmp"; d.style.margin="10px 0"; d.textContent=t; $("#t-plan").prepend(d); d.scrollIntoView({behavior:"smooth",block:"center"}); }

/* ---------- swap modal ---------- */
var M={mi:0,ii:0};
function curSrc(){ var it=dayPlan().meals[M.mi].items[M.ii], e=effItem(M.mi,M.ii,it); return {it:it,src:e.src,g:e.srcG}; }
function openSwap(mi,ii){
  M.mi=mi;M.ii=ii;
  var o=curSrc(), it=o.it, src=o.src; if(!src) return;
  var b=it.basis||defBasis(src), sm=mac(src,o.g);
  $("#mTitle").textContent=o.g+" "+unit(src)+" "+FN(src);
  $("#mBasis").innerHTML=T("mBasis",{b:BN(b),v:r1(sm[b])+(b==="k"?" "+T("kcal"):" "+T("uG"))});
  $("#mSearch").value="";
  renderSwapList();
  $("#modal").classList.remove("hidden"); document.body.style.overflow="hidden";
}
function closeSwap(){ $("#modal").classList.add("hidden"); document.body.style.overflow=""; }
$("#mClose").onclick=closeSwap;
$("#modal").addEventListener("click",function(e){ if(e.target.id==="modal") closeSwap(); });
document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeSwap(); });
$("#mSearch").addEventListener("input",renderSwapList);
function altBtn(a,srcK,cur){
  var pc=pieceTxt(a.f.id,a.g);
  return '<button type="button" class="alt'+(cur===a.f.id?' cur':'')+'" data-pick="'+a.f.id+'"><div class="qty"><b>'+a.g+'</b><small>'+unit(a.f)+'</small>'+(pc?'<small>'+pc+'</small>':'')+'</div><div class="info"><div class="nm">'+esc(FN(a.f))+'</div><div class="macros"><span class="badge state">'+esc(ST(a.f.s))+'</span>'+(a.f.est?'<span class="tag est">'+T("est")+'</span>':'')+'<span>'+r0(a.m.k)+' '+T("kcal")+'</span><span>'+T("aP")+' '+r1(a.m.p)+'</span><span>'+T("aC")+' '+r1(a.m.c)+'</span><span>'+T("aF")+' '+r1(a.m.f)+'</span></div>'+
    '<div>'+diffHtml(a.dk,srcK,a.m.k)+(a.big?' <span class="diff bad">'+T("bigQ")+'</span>':'')+'</div></div></button>';
}
function renderSwapList(){
  var o=curSrc(), it=o.it, src=o.src, q=$("#mSearch").value.trim();
  var res=alternatives(src,o.g,{basis:it.basis,ids:it.alts,diet:S.client.diet});
  var cur=bucket(S.swaps)[M.mi+"-"+M.ii]||src.id, srcK=src.k*o.g/100, sm=mac(src,o.g);
  var list=res.list; if(q) list=list.filter(function(a){return match(a.f,q);});
  var h='<button type="button" class="alt'+(cur===src.id?' cur':'')+'" data-pick="'+src.id+'"><div class="qty"><b>'+o.g+'</b><small>'+unit(src)+'</small></div><div class="info"><div class="nm">'+esc(FN(src))+' <span class="badge">'+T("origBadge")+'</span></div><div class="macros"><span>'+r0(sm.k)+' '+T("kcal")+'</span><span>'+T("aP")+' '+r1(sm.p)+'</span><span>'+T("aC")+' '+r1(sm.c)+'</span><span>'+T("aF")+' '+r1(sm.f)+'</span></div></div></button>';
  h+=list.slice(0,40).map(function(a){return altBtn(a,srcK,cur);}).join("");
  if(it.alts&&it.alts.length&&!q){
    var more=alternatives(src,o.g,{basis:it.basis,diet:S.client.diet}).list.filter(function(a){return it.alts.indexOf(a.f.id)<0;});
    if(more.length) h+='<div class="slot-title" style="margin-top:14px">'+T("moreAlts")+'</div>'+more.slice(0,25).map(function(a){return altBtn(a,srcK,cur);}).join("");
  }
  if(!list.length&&q) h+='<p class="muted" style="text-align:center;padding:20px">'+T("noMatch")+'</p>';
  h+='<p class="muted" style="margin-top:12px">'+T("legend")+'</p>';
  var body=$("#mBody"); body.innerHTML=h;
  $$("[data-pick]",body).forEach(function(b){b.onclick=function(){
    var s=bucket(S.swaps), k=M.mi+"-"+M.ii;
    if(b.dataset.pick===src.id) delete s[k]; else s[k]=b.dataset.pick;
    save(); closeSwap(); rerenderAll();
  };});
}

/* ---------- supplements ---------- */
var SLOTS=[["morning","🌅","slMorning"],["breakfast","🍳","slBreakfast"],["pre","⚡","slPre"],["post","💪","slPost"],["lunch","🍽️","slLunch"],["dinner","🌙","slDinner"],["night","😴","slNight"],["any","🕒","slAny"]];
function renderSupp(){
  var list=S.client.supplements||[], log=dayLog(), h="";
  if(!list.length) h+='<div class="card"><p class="muted" style="margin:0">'+T("noSupp")+'</p></div>';
  SLOTS.forEach(function(sl){
    var items=list.map(function(s,i){return {s:s,i:i};}).filter(function(o){return (o.s.time||"any")===sl[0];});
    if(!items.length) return;
    h+='<div class="card"><div class="slot-title">'+sl[1]+' '+T(sl[2])+'</div>'+items.map(function(o){
      var on=!!log.supp[o.i], I=suppInfo(o.s);
      return '<div class="supp"><div class="ico">💊</div><div class="info"><b>'+esc(I.name)+(I.brand?' <span class="badge">'+esc(I.brand)+'</span>':'')+'</b><span class="muted">'+esc(I.dose||"")+'</span>'+(I.per?'<div class="muted" style="font-size:.78rem">'+esc(I.per)+'</div>':'')+(I.note?'<div class="note">'+esc(I.note)+'</div>':'')+'</div><button type="button" class="eat'+(on?' on':'')+'" data-supp="'+o.i+'">'+(on?T("tookOn"):T("tookOff"))+'</button></div>';
    }).join("")+'</div>';
  });
  if(list.length) h+='<div class="warn">'+T("suppWarn")+'</div>';
  if(SUPPS.length){
    h+='<div class="card"><h2>'+T("guideT")+'</h2><p class="muted">'+T("guideP")+'</p><input type="search" id="supQ" placeholder="'+T("guidePh")+'"><div id="supList"></div></div>';
  }
  var el=$("#t-supp"); el.innerHTML=h;
  $$("[data-supp]",el).forEach(function(b){b.onclick=function(){var l=dayLog(),i=b.dataset.supp; if(l.supp[i]) delete l.supp[i]; else l.supp[i]=1; save(); renderSupp();};});
  if(SUPPS.length){
    var draw=function(){
      var q=$("#supQ").value.trim().toLowerCase();
      var arr=SUPPS.filter(function(x){return !q||(x.name+" "+x.brand+" "+(x.type||"")+" "+(x.flavor||"")).toLowerCase().indexOf(q)>-1;});
      $("#supList").innerHTML=arr.map(function(x){
        x=SUPT(x); return '<div class="supp"><div class="ico">🧴</div><div class="info"><b>'+esc(x.name)+' <span class="badge">'+esc(x.brand)+'</span>'+(x.est?' <span class="tag est">'+T("est")+'</span>':'')+'</b>'+
          '<div class="muted" style="font-size:.8rem">'+esc(x.type||"")+(x.form?' • '+esc(x.form):'')+(x.flavor?' • '+esc(x.flavor):'')+'</div>'+
          '<div style="font-size:.85rem">'+T("serving",{s:esc(x.serving)})+'</div>'+(x.per?'<div class="muted" style="font-size:.8rem">'+esc(x.per)+'</div>':'')+
          (x.mac?'<div class="meta" style="color:var(--sub);font-size:.78rem;display:flex;gap:10px;flex-wrap:wrap"><span>'+x.mac.k+' '+T("kcal")+'</span><span>'+T("aP")+' '+x.mac.p+'</span><span>'+T("aC")+' '+x.mac.c+'</span><span>'+T("aF")+' '+x.mac.f+'</span></div>':'')+
          (x.dir?'<div style="font-size:.8rem">📋 '+esc(x.dir)+'</div>':'')+(x.note?'<div class="note">'+esc(x.note)+'</div>':'')+'</div></div>';
      }).join("")||'<p class="muted">'+T("noRes")+'</p>';
    };
    $("#supQ").addEventListener("input",draw); draw();
  }
}

/* ---------- body composition ---------- */
function renderBody(){
  var B=S.client.body, el=$("#t-body"); if(!B){el.innerHTML="";return;}
  var tile=function(x){return '<div class="metric"><span class="num">'+esc(x[1])+'<small style="font-size:.7rem"> '+esc(x[2])+'</small></span><small>'+esc(x[0])+'</small></div>';};
  var tg={measured:'<span class="tag meas">'+T("bMeas")+'</span>',estimate:'<span class="tag est">'+T("est")+'</span>',target:'<span class="tag tgt2">'+T("bTarget")+'</span>'};
  var h='<div class="card"><div class="meal-head"><h2 style="margin:0">'+T("bYour")+'</h2><span class="muted">'+esc(B.source||"")+' • '+esc(B.date||"")+'</span></div><div class="bgrid">'+(B.main||[]).map(tile).join("")+'</div></div>';
  if(B.details&&B.details.length) h+='<div class="card"><h2>'+T("bDet")+'</h2><div class="bgrid">'+B.details.map(tile).join("")+'</div>'+(B.interpretation?'<p class="muted" style="margin-top:12px">'+esc(B.interpretation)+'</p>':'')+'</div>';
  if(B.energy&&B.energy.length) h+='<div class="card"><h2>'+T("bEnergy")+'</h2>'+B.energy.map(function(x){return '<div class="erow"><span>'+esc(x[0])+(tg[x[2]]||"")+'</span><b>'+esc(x[1])+'</b></div>';}).join("")+(B.energy_note?'<div class="warn" style="margin-top:10px">'+esc(B.energy_note)+'</div>':'')+'</div>';
  el.innerHTML=h;
}

/* ---------- shopping ---------- */
var shopDays=7;
function renderShop(){
  var p=dayPlan(), agg={};
  (p.meals||[]).forEach(function(m,mi){m.items.forEach(function(it,ii){var e=effItem(mi,ii,it); if(!e||e.kind!=="food") return; agg[e.f.id]=(agg[e.f.id]||0)+e.g;});});
  var ids=Object.keys(agg).sort(function(a,b){return (F[a].g>F[b].g?1:-1);});
  var h='<div class="card"><div class="meal-head"><h3>'+T("shopT")+'</h3></div><p class="muted">'+T("shopP")+'</p>'+
    '<div class="pillset" id="shopDays">'+[1,3,5,7].map(function(d){return '<button type="button" class="pill'+(d===shopDays?' on':'')+'" data-d="'+d+'">'+T(d===1?"day1":"dayN",{n:d})+'</button>';}).join("")+'</div><div style="margin-top:10px">';
  ids.forEach(function(id){
    var f=F[id], g=agg[id]*shopDays, txt=g>=1000?(r1(g/1000)+(f.u==="ml"?" "+T("uL"):" "+T("uKg"))):(r0(g)+" "+unit(f)), pc=pieceTxt(id,g,true);
    h+='<div class="shop-row"><span>'+esc(FN(f))+' <span class="badge state">'+esc(ST(f.s))+'</span></span><b>'+txt+(pc?' <small class="muted">('+pc+')</small>':'')+'</b></div>';
  });
  h+='</div><p class="muted" style="margin-top:10px">'+T("shopNote")+'</p></div>';
  var el=$("#t-shop"); el.innerHTML=h;
  $$("#shopDays .pill",el).forEach(function(b){b.onclick=function(){shopDays=+b.dataset.d; renderShop();};});
}

/* ---------- free calculator ---------- */
var C={id:"FD0091",g:100,basis:null,scope:"near"};
function renderCalc(){
  var el=$("#t-calc");
  el.innerHTML='<div class="card"><h2>'+T("calcT")+'</h2><p class="muted">'+T("calcP")+'</p>'+
    '<div class="calc-grid"><div><input type="search" id="cQ" placeholder="'+T("calcPh")+'"><select id="cSel" style="margin-top:8px"></select></div>'+
    '<div><input type="number" id="cG" min="1" step="1" value="'+C.g+'" inputmode="decimal" style="text-align:center;direction:ltr;font-weight:900"><div class="muted" id="cU" style="text-align:center">'+T("uGram")+'</div></div></div>'+
    '<div class="totals" id="cStats"></div>'+
    '<div style="margin-top:12px" class="muted">'+T("eqIn")+'</div><div class="pillset" id="cBasis" style="margin-top:6px"></div>'+
    '<div style="margin-top:12px" class="muted">'+T("scopeL")+'</div><select id="cScope" style="margin-top:6px"><option value="near">'+T("scNear")+'</option><option value="بروتين">'+T("scP")+'</option><option value="كارب">'+T("scC")+'</option><option value="فاكهة">'+T("scFr")+'</option><option value="خضار">'+T("scV")+'</option><option value="دهون">'+T("scF")+'</option><option value="supp">'+T("scS")+'</option><option value="all">'+T("scAll")+'</option></select>'+
    '</div><div id="cRes"></div>';
  function fillSel(){
    var q=$("#cQ").value.trim(), opts=FOODS.filter(function(x){return !excluded(x)&&(!q||match(x,q));});
    if(!opts.some(function(x){return x.id===C.id;}) && opts.length) C.id=opts[0].id;
    $("#cSel").innerHTML=opts.map(function(x){return '<option value="'+x.id+'"'+(x.id===C.id?' selected':'')+'>'+esc(FN(x))+' — '+esc(x.s)+'</option>';}).join("");
  }
  fillSel(); $("#cScope").value=C.scope;
  $("#cQ").oninput=function(){fillSel(); C.basis=null; calc();};
  $("#cSel").onchange=function(){C.id=this.value; C.basis=null; calc();};
  $("#cG").oninput=function(){C.g=num(this.value); calc();};
  $("#cScope").onchange=function(){C.scope=this.value; calc();};
  calc();
}
function calc(){
  var src=F[C.id]; if(!src){$("#cRes").innerHTML="";return;}
  var b=C.basis||defBasis(src), g=C.g, m=mac(src,g);
  $("#cU").textContent=src.u==="ml"?T("uMl"):T("uGram");
  $("#cStats").innerHTML='<div class="metric kcal"><span class="num">'+r0(m.k)+'</span><small>'+T("kcal")+'</small></div><div class="metric pro"><span class="num">'+r1(m.p)+'</span><small>'+T("lP")+'</small></div><div class="metric"><span class="num">'+r1(m.c)+'</span><small>'+T("lC")+'</small></div><div class="metric"><span class="num">'+r1(m.f)+'</span><small>'+T("lF")+'</small></div>';
  $("#cBasis").innerHTML=["p","c","f","k"].map(function(k){return '<button type="button" class="pill'+(k===b?' on':'')+'" data-b="'+k+'">'+T("same",{b:BN(k)})+'</button>';}).join("");
  $$("#cBasis .pill").forEach(function(x){x.onclick=function(){C.basis=x.dataset.b; calc();};});
  if(!g){$("#cRes").innerHTML="";return;}
  if(!(src[KEY[b]]>0)){ $("#cRes").innerHTML='<div class="warn">'+T("noBasis",{b:BN(b)})+'</div>'; return; }
  var res=alternatives(src,g,{basis:b,scope:C.scope}), srcK=m.k;
  var h='<div class="card"><h3>'+T("altsN",{n:res.list.length})+'</h3>';
  h+=res.list.slice(0,60).map(function(a){return altBtn(a,srcK,"").replace('<button type="button" class="alt"','<div class="alt" style="cursor:default"').replace(/<\/button>$/,'</div>');}).join("");
  if(!res.list.length) h+='<p class="muted">'+T("noAlts")+'</p>';
  $("#cRes").innerHTML=h+'</div>';
}

/* ---------- more: tips, follow-up, links ---------- */
function weekWeights(){
  var arr=(S.fu.w||[]).slice().sort(function(a,b){return a.d<b.d?-1:1;});
  var cut=new Date(); cut.setDate(cut.getDate()-6); var cs=cut.getFullYear()+"-"+pad(cut.getMonth()+1)+"-"+pad(cut.getDate());
  return arr.filter(function(x){return x.d>=cs;});
}
function renderMore(){
  var c=S.client, h="", FU=c.followup;
  if(c.tips&&c.tips.length) h+='<div class="card"><h2>'+T("tipsT")+'</h2><ul class="tips">'+c.tips.map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul></div>';
  if(c.dislikes_text) h+='<div class="card"><h2>'+T("dislT")+'</h2><p class="muted" style="margin:0">'+T("dislP",{x:esc(c.dislikes_text)})+'</p></div>';
  if(FU){
    var ww=weekWeights(), avg=ww.length?r1(ww.reduce(function(s,x){return s+x.v;},0)/ww.length):null;
    h+='<div class="card"><h2>'+T("fuT")+'</h2><p class="muted">'+esc(FU.weigh_text||"")+'</p>'+
      '<div class="calc-grid"><input type="number" id="fuW" placeholder="'+T("fuWph")+'" step="0.1" inputmode="decimal" style="direction:ltr;text-align:center"><button class="btn secondary" type="button" id="fuAdd">'+T("fuAdd")+'</button></div>'+
      '<div class="wlist">'+ww.map(function(x){return '<span>'+x.d.slice(5)+' • '+x.v+' '+T("uKg")+'<a data-wdel="'+x.d+'">✕</a></span>';}).join("")+'</div>'+
      '<div class="totals" style="grid-template-columns:repeat(2,1fr)"><div class="metric kcal"><span class="num">'+(avg!=null?avg:"—")+'</span><small>'+T("fuAvg")+'</small></div><div class="metric"><span class="num">'+ww.length+'</span><small>'+T("fuCnt")+'</small></div></div>'+
      '<div class="fgrid"><div><label>'+T("waist")+'</label><input type="number" id="fuWaist" step="0.5" inputmode="decimal" value="'+esc(S.fu.waist||"")+'"></div><div><label>'+T("steps")+'</label><input type="number" id="fuSteps" step="100" inputmode="numeric" value="'+esc(S.fu.steps||"")+'"></div>'+
      '<div><label>'+T("perf")+'</label><select id="fuPerf"><option value="">—</option><option value="أحسن">'+T("perf1")+'</option><option value="زي ما هو">'+T("perf2")+'</option><option value="أقل">'+T("perf3")+'</option></select></div><div><label>'+T("hunger")+'</label><select id="fuHunger"><option value="">—</option><option value="مفيش جوع">'+T("hun1")+'</option><option value="جوع خفيف">'+T("hun2")+'</option><option value="جوع كتير">'+T("hun3")+'</option></select></div>'+
      '<div><label>'+T("adh")+'</label><input type="number" id="fuAdh" min="0" max="100" step="5" inputmode="numeric" value="'+esc(S.fu.adh||"")+'"></div><div><label>'+T("noteL")+'</label><input type="text" id="fuNote" value="'+esc(S.fu.note||"")+'"></div></div>'+
      '<a class="btn primary" id="fuSend" href="#" target="_blank" rel="noopener" style="text-decoration:none;display:block;text-align:center;margin-top:10px">'+T("fuSend")+'</a>'+
      (FU.check_text?'<p class="muted" style="margin-top:10px">'+esc(FU.check_text)+'</p>':'')+'</div>';
  } else {
    h+='<div class="card"><h2>'+T("wT")+'</h2><p class="muted">'+T("wP")+'</p>'+
      '<div class="calc-grid"><input type="number" id="wKg" placeholder="'+T("wPh")+'" step="0.1" inputmode="decimal" style="direction:ltr;text-align:center"><a class="btn primary" id="wSend" href="#" target="_blank" rel="noopener" style="text-decoration:none;text-align:center">'+T("wSend")+'</a></div>'+
      '<input type="text" id="wNote" placeholder="'+T("wNote")+'" style="margin-top:8px"></div>';
  }
  var lk=Object.keys(LINKS).map(function(k){var L=LINKS[k]; if(!L||!L.url) return ""; var u=L.url+(L.passCode?((L.url.indexOf("?")>-1?"&":"?")+"code="+encodeURIComponent(S.code)):""); return '<a class="btn secondary" href="'+esc(u)+'"'+(/^https?:/.test(L.url)?' target="_blank" rel="noopener"':'')+'>'+esc(T("lnk_"+k)!=="lnk_"+k?T("lnk_"+k):L.label)+'</a>';}).join("");
  if(lk) h+='<div class="card"><h2>'+T("linksT")+'</h2><div class="links">'+lk+'</div></div>';
  h+='<div class="card"><h2>'+T("qT")+'</h2><a class="btn primary" style="text-decoration:none;display:inline-block" href="https://wa.me/'+WA+'?text='+encodeURIComponent(LANG==="ar"?("كابتن أحمد، أنا "+(c.name||"")+" (كود "+S.code+") — عندي سؤال في نظام الأكل:"):("Coach Ahmed, I'm "+(c.name||"")+" (code "+S.code+") — I have a question about my meal plan:"))+'" target="_blank" rel="noopener">'+T("qBtn")+'</a><div class="muted" style="margin-top:6px">'+T("waNum")+'</div></div>';
  var el=$("#t-more"); el.innerHTML=h;

  if(FU){
    $("#fuPerf").value=S.fu.perf||""; $("#fuHunger").value=S.fu.hunger||"";
    var upd=function(){
      ["waist","steps","adh","note"].forEach(function(k){var i=$("#fu"+{waist:"Waist",steps:"Steps",adh:"Adh",note:"Note"}[k]); S.fu[k]=i.value.trim();});
      S.fu.perf=$("#fuPerf").value; S.fu.hunger=$("#fuHunger").value; save();
      var ww=weekWeights(), avg=ww.length?r1(ww.reduce(function(s,x){return s+x.v;},0)/ww.length):"—";
      var t="📈 متابعة أسبوعية\nالاسم: "+(c.name||"")+"\nالكود: "+S.code+"\nالتاريخ: "+today()+
        "\nأوزان الصبح: "+(ww.map(function(x){return x.d.slice(5)+"="+x.v;}).join("، ")||"—")+"\nمتوسط الأسبوع: "+avg+" كجم"+
        "\nمحيط الخصر: "+(S.fu.waist||"—")+" سم\nمتوسط الخطوات: "+(S.fu.steps||"—")+"\nالأداء: "+(S.fu.perf||"—")+"\nالجوع: "+(S.fu.hunger||"—")+"\nالالتزام: "+(S.fu.adh?S.fu.adh+"%":"—")+(S.fu.note?"\nملاحظة: "+S.fu.note:"");
      $("#fuSend").href="https://wa.me/"+WA+"?text="+encodeURIComponent(t);
    };
    $$("#t-more .fgrid input, #t-more .fgrid select").forEach(function(i){i.addEventListener("input",upd);i.addEventListener("change",upd);});
    $("#fuAdd").onclick=function(){var v=num($("#fuW").value); if(!v||v<30||v>300){$("#fuW").focus();return;} var d=today(); S.fu.w=(S.fu.w||[]).filter(function(x){return x.d!==d;}); S.fu.w.push({d:d,v:v}); S.fu.w=S.fu.w.slice(-30); save(); renderMore();};
    $$("[data-wdel]",el).forEach(function(a){a.onclick=function(){S.fu.w=(S.fu.w||[]).filter(function(x){return x.d!==a.dataset.wdel;}); save(); renderMore();};});
    upd();
  } else {
    var wUpd=function(){
      var kg=num($("#wKg").value), n=$("#wNote").value.trim();
      var t="⚖️ وزن أسبوعي\nالاسم: "+(c.name||"")+"\nالكود: "+S.code+"\nالتاريخ: "+today()+"\nالوزن: "+(kg||"—")+" كجم"+(n?"\nملاحظة: "+n:"");
      $("#wSend").href="https://wa.me/"+WA+"?text="+encodeURIComponent(t);
    };
    $("#wKg").oninput=wUpd; $("#wNote").oninput=wUpd; wUpd();
    $("#wSend").addEventListener("click",function(e){ if(!num($("#wKg").value)){e.preventDefault(); $("#wKg").focus();} });
  }
}

/* ---------- tabs ---------- */
var TABS=["plan","supp","body","shop","calc","more"];
function showTab(t){S.tab=t; $$("#tabs button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t);}); TABS.forEach(function(k){$("#t-"+k).classList.toggle("hidden",k!==t);});}
$$("#tabs button").forEach(function(b){b.onclick=function(){showTab(b.dataset.t); var top=$("#tabs").offsetTop; if(window.scrollY>top) window.scrollTo({top:top,behavior:"smooth"});};});

document.addEventListener("contextmenu",function(e){ if(e.target.tagName==="IMG") e.preventDefault(); });

/* ---------- boot ---------- */
applyLang();
$$(".langsel").forEach(function(sel){sel.addEventListener("change",function(){setLang(sel.value);});});
var g0=store("amn:gender"); if(g0) setGender(g0);
var qg=null, qc=null;
try{ var qp=new URLSearchParams(location.search); qc=qp.get("code"); qg=qp.get("g"); }catch(e){}
if(qg==="male"||qg==="female") setGender(qg);
var hub={}; try{ hub=JSON.parse(sessionStorage.getItem("am-hub"))||{}; }catch(e){}
if(hub.g==="m"||hub.g==="f") setGender(hub.g==="f"?"female":"male");
var c0=hub.code||qc||store("amn:code");
if(c0){ $("#codeIn").value=c0; tryLogin(c0,true); }
})();
