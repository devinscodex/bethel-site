// Music player. Turns the song lists on /tools/ into one player.
// Video plays when the song has one; audio-only songs use the audio player.
(function () {
  var root = document.getElementById("mu");
  if (!root) return;
  var base = root.dataset.base, cur = null;

  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // Player: one video, one audio, one title line. Hidden until a song is chosen.
  var box = mk("div", "mpl");
  var now = mk("p", "meta", "Choose a song.");
  var audio = mk("audio"), video = mk("video");
  audio.controls = video.controls = true;
  audio.preload = video.preload = "none";
  video.setAttribute("playsinline", "");
  audio.hidden = video.hidden = true;
  box.appendChild(now); box.appendChild(video); box.appendChild(audio);
  root.insertBefore(box, root.firstChild);

  // Play one song. Video if it has one, else audio.
  function play(li) {
    var v = li.dataset.v, el = v ? video : audio, off = v ? audio : video;
    cur = li;
    off.pause(); off.removeAttribute("src"); off.hidden = true;
    el.src = base + (v || li.dataset.a);
    el.hidden = false;
    now.textContent = li.querySelector("a").textContent;
    [].forEach.call(root.querySelectorAll(".trk li"), function (x) {
      x.classList.toggle("on", x === li);
    });
    el.play();
  }
  function next() {
    var items = [].slice.call(cur.parentNode.children);
    var n = items[items.indexOf(cur) + 1];
    if (n) play(n);
  }
  audio.onended = video.onended = next;

  // Links play in the page. Without script they still open the file.
  [].forEach.call(root.querySelectorAll(".trk li"), function (li) {
    li.querySelector("a").onclick = function (e) { e.preventDefault(); play(li); };
  });
})();
