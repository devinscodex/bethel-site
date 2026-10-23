document.querySelectorAll(".tg").forEach(function(b){b.onclick=function(){var r=document.documentElement,s=r.dataset.theme==="dark"?"light":"dark";r.dataset.theme=s;document.cookie="bt="+s+"; max-age=31536000; path=/; SameSite=Lax"}});
/* .pl */
if(document.querySelector('.pl')){
document.querySelectorAll(".pl").forEach(function(p){var a=p.querySelector("audio");a.controls=false;
var h=function(t,c,f){var e=document.createElement(t);e.className=c||"";if(f)e.onclick=f;return e},
pb=h("button","pp",function(){a.paused?a.play():a.pause()}),bk=h("button","sk",function(){a.currentTime=Math.max(0,a.currentTime-15)}),
r=h("input","sb"),tm=h("span","tm meta"),sp=h("button","sp",function(){var s=[1,1.25,1.5,2],i=(s.indexOf(a.playbackRate)+1)%s.length;a.playbackRate=s[i];sp.textContent=s[i]+"x"}),
f=function(s){s=Math.floor(s||0);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
pb.setAttribute("aria-label","Play");pb.textContent="\u25B6";bk.textContent="\u21BA15";bk.setAttribute("aria-label","Back 15 seconds");sp.textContent="1x";sp.setAttribute("aria-label","Playback speed");
r.type="range";r.min=0;r.max=1000;r.value=0;r.setAttribute("aria-label","Seek");
a.addEventListener("play",function(){pb.textContent="\u275A\u275A";pb.setAttribute("aria-label","Pause")});
a.addEventListener("pause",function(){pb.textContent="\u25B6";pb.setAttribute("aria-label","Play")});
function u(){if(a.duration)r.value=a.currentTime/a.duration*1000;tm.textContent=f(a.currentTime)+" / "+f(a.duration)}
["timeupdate","loadedmetadata","durationchange"].forEach(function(e){a.addEventListener(e,u)});
r.oninput=function(){if(a.duration)a.currentTime=r.value/1000*a.duration};tm.textContent="0:00";
[pb,bk,r,tm,sp].forEach(function(e){p.appendChild(e)});p.classList.add("js")});
}

/* #lb */
if(document.querySelector('#lb')){
(function(){var d=document.getElementById("lb"),i=d.querySelector("img"),c=d.querySelector("p"),a=[].slice.call(document.querySelectorAll(".gal a")),n=0;
function show(k){n=(k+a.length)%a.length;i.src=a[n].dataset.full;i.alt=c.textContent=a[n].dataset.alt}
a.forEach(function(e,k){e.onclick=function(ev){ev.preventDefault();show(k);d.showModal()}});
d.querySelector("button").onclick=function(){d.close()};
d.onclick=function(ev){if(ev.target===d)d.close()};
document.addEventListener("keydown",function(ev){if(!d.open)return;if(ev.key=="ArrowRight")show(n+1);if(ev.key=="ArrowLeft")show(n-1)});
})();
}

/* #sl */
if(document.querySelector('#sl')){
document.getElementById("ctl").addEventListener("submit",function(e){e.preventDefault()});
(function(){
var L=document.getElementById("sl"),rows=[].slice.call(L.children),g=function(i){return document.getElementById(i)},
ids=["q","speaker","series","year","sort"],N=rows.length,hs=[].slice.call(document.querySelectorAll(".sx th button"));
function has(r,k,v){return(r.dataset[k]||"").split("|").indexOf(v)>-1}
function dd(A,B){return A.date<B.date?1:-1}
function run(){
 var w=g("q").value.trim().toLowerCase().split(/\s+/).filter(Boolean),sp=g("speaker").value,se=g("series").value,yr=g("year").value,nt=g("notes").checked,so=g("sort").value,n=0,f=w.length||sp||se||yr||nt;
 rows.sort(function(a,b){var A=a.dataset,B=b.dataset;
  if(so=="old")return A.date<B.date?-1:1;
  if(so=="title")return A.title.localeCompare(B.title);
  if(so=="speaker")return A.speaker.localeCompare(B.speaker)||dd(A,B);
  if(so=="series")return(!A.series)-(!B.series)||A.series.localeCompare(B.series)||dd(A,B);
  return dd(A,B)});
 rows.forEach(function(r){var d=r.dataset,ok=w.every(function(x){return d.q.indexOf(x)>-1})&&(!sp||has(r,"speaker",sp))&&(!se||has(r,"series",se))&&(!yr||d.year==yr)&&(!nt||d.notes);
  r.hidden=!ok;if(ok)n++;L.appendChild(r)});
 g("count").textContent=f?n+" of "+N+" sermons":N+" sermons";g("none").hidden=n>0;g("clr").hidden=!f;
 hs.forEach(function(b){var k=b.dataset.k,on=k=="date"?(so=="new"||so=="old"):so==k;if(on)b.parentNode.setAttribute("aria-sort",k=="date"?(so=="new"?"descending":"ascending"):"ascending");else b.parentNode.removeAttribute("aria-sort")});
 var p=new URLSearchParams();ids.forEach(function(i){if(g(i).value&&!(i=="sort"&&g(i).value=="new"))p.set(i,g(i).value)});
 if(nt)p.set("notes","1");
 history.replaceState(null,"",p.toString()?"#"+p:location.pathname)}
ids.forEach(function(i){g(i).addEventListener("input",run)});g("notes").onchange=run;
g("clr").onclick=function(){g("ctl").reset();run();g("q").focus()};
hs.forEach(function(b){b.onclick=function(){var k=b.dataset.k,s=g("sort");s.value=k=="date"?(s.value=="new"?"old":"new"):k;run()}});
document.addEventListener("keydown",function(e){var t=e.target.tagName;if(e.key=="/"&&t!="INPUT"&&t!="SELECT"&&t!="TEXTAREA"){e.preventDefault();g("q").focus()}});
var h=new URLSearchParams(location.hash.slice(1));ids.forEach(function(i){if(h.get(i))g(i).value=h.get(i)});
g("notes").checked=h.get("notes")=="1";run();
})();
}

/* .car */
(function(){var c=document.querySelector(".car");if(!c)return;var t=c.querySelector(".trk"),f=t.children,n=f.length,i=0,
b=function(x,l,d){var e=document.createElement("button");e.type="button";e.className=x;e.textContent=l;e.setAttribute("aria-label",d);return e},
dw=document.createElement("div"),ds=[],hold=0,rm=matchMedia("(prefers-reduced-motion:reduce)").matches,stopped=0,pz=b("pz","","");dw.className="dots";
function lab(){pz.textContent=stopped?"\u25B6":"\u275A\u275A";pz.setAttribute("aria-label",stopped?"Play slideshow":"Pause slideshow")}
function go(j){i=(j+n)%n;t.scrollTo({left:f[i].offsetLeft-t.offsetLeft,behavior:rm?"auto":"smooth"})}
function man(j){stopped=1;lab();go(j)}
function up(){i=Math.round(t.scrollLeft/t.clientWidth);ds.forEach(function(d,k){if(k==i)d.setAttribute("aria-current","true");else d.removeAttribute("aria-current")})}
pz.onclick=function(){stopped=!stopped;hold=0;lab()};dw.appendChild(pz);
for(var k=0;k<n;k++)(function(k){var d=b("dt","","Show photo "+(k+1)+" of "+n);d.onclick=function(){man(k)};ds.push(d);dw.appendChild(d)})(k);
c.appendChild(b("cb pv","\u2039","Previous photo")).onclick=function(){man(i-1)};
c.appendChild(b("cb nx","\u203A","Next photo")).onclick=function(){man(i+1)};
c.appendChild(dw);t.addEventListener("scroll",up);up();lab();
t.addEventListener("keydown",function(e){if(e.key=="ArrowRight")man(i+1);if(e.key=="ArrowLeft")man(i-1)});
if(matchMedia("(hover:hover)").matches){c.addEventListener("mouseenter",function(){hold=1});c.addEventListener("mouseleave",function(){hold=0})}
c.addEventListener("focusin",function(e){if(e.target.matches(":focus-visible"))hold=1});c.addEventListener("focusout",function(){hold=0});
["touchstart","wheel"].forEach(function(v){t.addEventListener(v,function(){stopped=1;lab()},{passive:true})});
setInterval(function(){if(!stopped&&!hold&&!document.hidden)go(i+1)},7000);
})();
