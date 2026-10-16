(function(){var b=document.getElementById("slides");if(!b)return;
var im=[].slice.call(b.querySelectorAll("img")),first=im.shift();if(!im.length)return;
for(var i=im.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=im[i];im[i]=im[j];im[j]=t}
var q=[first].concat(im),n=0,timer,still=matchMedia("(prefers-reduced-motion:reduce)").matches;
im.forEach(function(e){e.hidden=false;e.className="s"});first.className="s on";
function show(k){var e=q[k];if(e.dataset.src){e.src=e.dataset.src;delete e.dataset.src}
var go=function(){q[n].classList.remove("on");e.classList.add("on");n=k};
e.complete&&e.naturalWidth?go():e.addEventListener("load",go,{once:true})}
function next(){show((n+1)%q.length)}
function play(){if(!still&&!timer)timer=setInterval(next,6000)}
function stop(){clearInterval(timer);timer=0}
b.addEventListener("mouseenter",stop);b.addEventListener("mouseleave",play);
document.addEventListener("visibilitychange",function(){document.hidden?stop():play()});
var p=q[1];p.src=p.dataset.src;delete p.dataset.src;play()})();
