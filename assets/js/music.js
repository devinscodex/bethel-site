// Music player. Turns the playlist lists on /music/ into one player.
// Audio plays by default; a Video button shows when the song has a video.
// "My playlist" is kept in this browser only (localStorage).
(function () {
  var root = document.getElementById("mu");
  if (!root) return;
  var base = root.dataset.base, KEY = "bm", mode = "audio", cur = null;
  var lists = [].slice.call(root.querySelectorAll(".mp"));

  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function saved() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function store(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
  }

  // Player: one audio element, one video element, one title line.
  var box = mk("div", "mpl");
  var now = mk("p", "meta", "Choose a song.");
  var audio = mk("audio"), video = mk("video");
  audio.controls = video.controls = true;
  audio.preload = video.preload = "none";
  video.setAttribute("playsinline", "");
  video.hidden = true;
  var modes = mk("div", "ctl");
  var bA = mk("button", "", "Audio"), bV = mk("button", "", "Video");
  bA.type = bV.type = "button";
  modes.appendChild(bA); modes.appendChild(bV);
  box.appendChild(now); box.appendChild(modes); box.appendChild(audio); box.appendChild(video);

  // Tabs: one button per playlist, plus "My playlist".
  var tabs = mk("div", "ctl");
  var mine = mk("section", "mp");
  mine.id = "mine";
  mine.dataset.title = "My playlist";
  root.appendChild(mine);
  lists.push(mine);
  var buttons = {};
  lists.forEach(function (s) {
    var b = mk("button", "", s.dataset.title);
    b.type = "button";
    b.onclick = function () { show(s.id); };
    buttons[s.id] = b;
    tabs.appendChild(b);
  });
  root.insertBefore(box, root.firstChild);
  root.insertBefore(tabs, root.firstChild);

  function show(id) {
    lists.forEach(function (s) {
      s.hidden = s.id !== id;
      buttons[s.id].setAttribute("aria-pressed", s.id === id);
    });
    history.replaceState(null, "", "#" + id);
  }

  function setMode(m) {
    var el = m === "video" ? video : audio, off = m === "video" ? audio : video;
    var t = off.currentTime, playing = !off.paused;
    off.pause(); off.hidden = true;
    el.hidden = false;
    mode = m;
    if (el.src && t) el.currentTime = t;
    if (playing && el.src) el.play();
    bA.setAttribute("aria-pressed", m === "audio");
    bV.setAttribute("aria-pressed", m === "video");
  }
  bA.onclick = function () { setMode("audio"); };
  bV.onclick = function () { setMode("video"); };

  // Play one track. Use the video only when the listener chose it and the song has one.
  function play(li) {
    cur = li;
    var v = li.dataset.v;
    audio.src = base + li.dataset.a;
    video.src = v ? base + v : "";
    bV.hidden = bA.hidden = !v;
    if (!v && mode === "video") setMode("audio");
    var el = mode === "video" ? video : audio;
    now.textContent = li.querySelector("a").textContent;
    el.play();
  }
  function next() {
    var items = [].slice.call(cur.parentNode.children);
    var n = items[items.indexOf(cur) + 1];
    if (n) play(n);
  }
  audio.onended = video.onended = next;

  // Track list: links play in the page; the small button adds or removes a song.
  function wire(ol, remove) {
    [].forEach.call(ol.children, function (li) {
      var a = li.querySelector("a");
      a.onclick = function (e) { e.preventDefault(); play(li); };
      var b = mk("button", "add", remove ? "Remove" : "Add to my playlist");
      b.type = "button";
      b.onclick = function () {
        var l = saved(), t = a.textContent;
        if (remove) l = l.filter(function (s) { return s.t !== t; });
        else if (!l.some(function (s) { return s.t === t; })) l.push({ t: t, a: li.dataset.a, v: li.dataset.v || "" });
        store(l);
        draw();
      };
      li.appendChild(b);
    });
  }
  function draw() {
    var l = saved();
    mine.innerHTML = "";
    mine.appendChild(mk("h3", "label", "My playlist"));
    mine.appendChild(mk("p", "meta", "Saved in this browser only. Clearing your browser data removes it."));
    if (!l.length) { mine.appendChild(mk("p", "meta", "No songs yet. Use \"Add to my playlist\" on any song.")); return; }
    var ol = mk("ol", "trk");
    l.forEach(function (s) {
      var li = mk("li"), a = mk("a", "", s.t);
      a.href = base + s.a;
      li.dataset.a = s.a;
      if (s.v) li.dataset.v = s.v;
      li.appendChild(a);
      ol.appendChild(li);
    });
    mine.appendChild(ol);
    wire(ol, true);
  }

  lists.forEach(function (s) {
    var ol = s.querySelector(".trk");
    if (ol && s !== mine) wire(ol, false);
  });
  draw();
  setMode("audio");

  // Open the playlist in the address, else "This week", else the first one with songs.
  var want = location.hash.slice(1);
  var pick = lists.filter(function (s) { return s.id === want; })[0] ||
    lists.filter(function (s) { return s.querySelector(".trk"); })[0] || lists[0];
  show(pick.id);
})();
