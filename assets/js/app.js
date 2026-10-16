document.getElementById("tg").onclick=function(){var r=document.documentElement,s=r.dataset.theme==="dark"?"light":"dark";r.dataset.theme=s;document.cookie="bt="+s+"; max-age=31536000; path=/; SameSite=Lax"};
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
ids=["q","speaker","series","year","sort"];
function has(r,k,v){return(r.dataset[k]||"").split("|").indexOf(v)>-1}
function run(){
 var q=g("q").value.trim().toLowerCase(),sp=g("speaker").value,se=g("series").value,yr=g("year").value,nt=g("notes").checked,so=g("sort").value,n=0;
 rows.sort(function(a,b){var A=a.dataset,B=b.dataset;
  if(so=="old")return A.date<B.date?-1:1;
  if(so=="title")return A.title.localeCompare(B.title);
  if(so=="speaker")return A.speaker.localeCompare(B.speaker)||(A.date<B.date?1:-1);
  return A.date<B.date?1:-1});
 rows.forEach(function(r){var d=r.dataset,ok=(!q||d.q.indexOf(q)>-1)&&(!sp||has(r,"speaker",sp))&&(!se||has(r,"series",se))&&(!yr||d.year==yr)&&(!nt||d.notes);
  r.hidden=!ok;if(ok)n++;L.appendChild(r)});
 g("count").textContent=n+(n==1?" sermon":" sermons");g("none").hidden=n>0;
 var p=new URLSearchParams();ids.forEach(function(i){if(g(i).value&&!(i=="sort"&&g(i).value=="new"))p.set(i,g(i).value)});
 if(nt)p.set("notes","1");
 history.replaceState(null,"",p.toString()?"#"+p:location.pathname)}
ids.forEach(function(i){g(i).addEventListener("input",run)});g("notes").onchange=run;
g("clr").onclick=function(){g("ctl").reset();run()};
var h=new URLSearchParams(location.hash.slice(1));ids.forEach(function(i){if(h.get(i))g(i).value=h.get(i)});
g("notes").checked=h.get("notes")=="1";run();
})();
}
