/* Terminal-style Bible reader. Keys mirror the Wordsworn Sanctum Reader (reader.c):
   books -> chapters -> verses; arrows or hjkl; Enter opens; Backspace/Esc goes back.
   Extras: g = jump to reference, [ ] = prev/next chapter, y = copy verse. URL hash = #john.3.16 */
(function(){
var host=document.getElementById("rd"),raw=document.getElementById("bd");if(!host||!raw)return;
var D=JSON.parse(raw.textContent),B=D.books,tr=host.dataset.tr,base={},cache={};
var st={v:0,b:0,c:1,l:0,cur:0,lines:[]},pr=null,flash="";
var AL={jn:"john",mt:"matthew",mk:"mark",lk:"luke",ps:"psalms",pss:"psalms",song:"songofsolomon",sos:"songofsolomon",rev:"revelation",heb:"hebrews",jas:"james",phil:"philippians",php:"philippians",phm:"philemon",gen:"genesis",exo:"exodus",lev:"leviticus",num:"numbers",deut:"deuteronomy",josh:"joshua",judg:"judges",sam1:"1samuel",kgs1:"1kings",chr1:"1chronicles"};
function norm(s){return s.toLowerCase().replace(/[^a-z0-9]/g,"")}
function find(q){q=norm(q);if(!q)return -1;q=AL[q]||q;for(var i=0;i<B.length;i++)if(B[i].s===q)return i;for(i=0;i<B.length;i++)if(B[i].s.indexOf(q)===0)return i;return -1}
function parse(t){var m=t.trim().match(/^((?:[123]\s*)?[a-z][a-z .]*?)\s*(\d+)?(?:\s*[:.]\s*(\d+))?$/i);if(!m)return null;var b=find(m[1]);if(b<0)return null;var c=Math.min(m[2]?+m[2]:1,B[b].ch);return{b:b,c:c,v:m[3]?+m[3]:0}}
function load(i){var s=B[i].s;if(cache[s])return Promise.resolve(cache[s]);return fetch(D.files[s]).then(function(r){return r.json()}).then(function(j){return cache[s]=j})}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function hash(){var h=st.v==0?"":st.v==1?B[st.b].s:B[st.b].s+"."+st.c+(st.v==2&&st.cur?"":"");if(st.v==2)h=B[st.b].s+"."+st.c+"."+(verseAt(st.cur)||1);history.replaceState(null,"",h?"#"+h:location.pathname)}
function verseAt(i){return st.lines[i]?st.lines[i].n:0}
function draw(){
  var t=el("div","rt"),title=st.v==0?"choose a book":st.v==1?B[st.b].n+" - choose a chapter":B[st.b].n+" "+st.c;
  t.textContent=" Bethel Reader ["+tr+"] - "+title;
  var body=el("div","rb"),hint=el("div","rh");
  if(st.v==0)B.forEach(function(b,i){body.appendChild(row("  "+b.n,i==st.b,function(){st.b=i;st.v=1;st.c=1;draw()}))});
  else if(st.v==1){var g=el("div","rg");for(var c=1;c<=B[st.b].ch;c++)(function(c){var a=el("button","rc"+(c==st.c?" on":""),c);a.type="button";a.onclick=function(){open(st.b,c)};g.appendChild(a)})(c);body.appendChild(g)}
  else st.lines.forEach(function(l,i){var r=row((l.first?String(l.n).padStart(3," ")+" ":"    ")+l.t,i==st.cur,function(){st.cur=i;draw()});r.className+=" vl";body.appendChild(r)});
  hint.textContent=flash||(st.v==0?" up/down move   enter open   g jump":st.v==1?" arrows move   enter open   backspace back   g jump":" up/down verse   [ ] chapter   y copy   backspace back   g jump");flash="";
  host.replaceChildren(t,body,hint);
  if(pr){var f=el("form","rp"),i=el("input");i.setAttribute("aria-label","Go to reference");i.placeholder="go to (e.g. gal 4:21)";f.appendChild(i);f.onsubmit=function(e){e.preventDefault();var p=parse(i.value);pr=null;if(p)open(p.b,p.c,p.v);else{flash=" not a reference";draw()}};host.appendChild(f);i.focus();i.onkeydown=function(e){e.stopPropagation();if(e.key=="Escape"){pr=null;draw()}}}
  else host.focus({preventScroll:true});
  var on=host.querySelector(".on");if(on&&on.scrollIntoView)on.scrollIntoView({block:"nearest"});
  hash()}
function row(t,on,f){var r=el("div","rw"+(on?" on":""),t);r.onclick=f;return r}
function wrap(txt,w){var out=[],cur="";txt.split(" ").forEach(function(x){if((cur+" "+x).trim().length>w){out.push(cur);cur=x}else cur=(cur+" "+x).trim()});if(cur)out.push(cur);return out}
function open(b,c,v){load(b).then(function(j){st.b=b;st.c=c;st.v=2;st.lines=[];var w=Math.max(30,Math.min(80,Math.floor(host.clientWidth/9)-6));
  (j.c[c-1]||[]).forEach(function(tx,i){if(!tx)return;wrap(tx,w).forEach(function(s,k){st.lines.push({n:i+1,t:s,first:k==0,full:tx})})});
  st.cur=0;if(v)for(var i=0;i<st.lines.length;i++)if(st.lines[i].n==v){st.cur=i;break}draw()})}
function step(d){st.cur=Math.max(0,Math.min(st.lines.length-1,st.cur+d));draw()}
host.addEventListener("keydown",function(e){
  if(e.ctrlKey||e.metaKey||e.altKey||pr)return;var k=e.key,h=true;
  if(k=="g"||k==":"||k=="/"){pr=1;draw();e.preventDefault();return}
  if(st.v==0){if(k=="ArrowDown"||k=="j")st.b=Math.min(B.length-1,st.b+1);else if(k=="ArrowUp"||k=="k")st.b=Math.max(0,st.b-1);else if(k=="Enter"||k=="l"||k=="ArrowRight"){st.v=1;st.c=1}else h=false}
  else if(st.v==1){var n=B[st.b].ch,per=Math.max(1,Math.floor(host.clientWidth/54));
    if(k=="ArrowRight"||k=="l")st.c=Math.min(n,st.c+1);else if(k=="ArrowLeft"||k=="h")st.c=Math.max(1,st.c-1);else if(k=="ArrowDown"||k=="j")st.c=Math.min(n,st.c+per);else if(k=="ArrowUp"||k=="k")st.c=Math.max(1,st.c-per);
    else if(k=="Enter"){open(st.b,st.c);e.preventDefault();return}else if(k=="Backspace"||k=="Escape")st.v=0;else h=false}
  else{if(k=="ArrowDown"||k=="j")return step(1,e.preventDefault());if(k=="ArrowUp"||k=="k")return step(-1,e.preventDefault());if(k=="PageDown")return step(12,e.preventDefault());if(k=="PageUp")return step(-12,e.preventDefault());
    if(k=="]"||k=="["){var d=k=="]"?1:-1,c=st.c+d,b=st.b;if(c<1){if(b>0){b--;c=B[b].ch}else c=1}else if(c>B[b].ch){if(b<B.length-1){b++;c=1}else c=B[b].ch}e.preventDefault();return open(b,c)}
    if(k=="y"){var l=st.lines[st.cur];if(l){var s=B[st.b].n+" "+st.c+":"+l.n+" "+l.full+" ("+tr+")";(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(function(){flash=" copied "+B[st.b].n+" "+st.c+":"+l.n;draw()},function(){flash=" copy not available";draw()})}e.preventDefault();return}
    if(k=="Backspace"||k=="Escape"){st.v=1}else h=false}
  if(h){e.preventDefault();draw()}});
function fromHash(){var m=location.hash.slice(1).split(".");if(!m[0])return;var i=find(m[0]);if(i<0)return;if(m[1])open(i,Math.min(+m[1]||1,B[i].ch),+m[2]||0);else{st.b=i;st.v=1;draw()}}
host.classList.add("tui");var h0=location.hash;if(h0)fromHash();else draw();addEventListener("hashchange",function(){if(!pr)fromHash()});
})();
