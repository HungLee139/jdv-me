/* JDV M&E — tương tác trang. Không dùng thư viện ngoài; mất JS trang vẫn đọc đủ. */
(function () {
  var doc = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* vẽ toà nhà */
  document.querySelectorAll('[data-building]').forEach(function (el, i) { el.innerHTML = window.JDVBuilding('b' + i); });

  requestAnimationFrame(function () { doc.classList.add('ready'); });
  setTimeout(function () { doc.classList.add('ready'); }, 120);

  /* đầu trang + thước tiến độ + mục đang xem */
  var hdr = document.getElementById('hdr'), prog = document.getElementById('prog');
  var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    var y = scrollY, max = doc.scrollHeight - innerHeight;
    hdr.classList.toggle('sc', y > 8);
    prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    var cur = -1;
    secs.forEach(function (s, k) { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = k; });
    links.forEach(function (a, k) { a.classList.toggle('on', k === cur); });
    flowLine();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  /* menu điện thoại */
  var menu = hdr.querySelector('.menu');
  menu.addEventListener('click', function () { menu.setAttribute('aria-expanded', hdr.classList.toggle('open')); });
  links.forEach(function (a) { a.addEventListener('click', function () { hdr.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }); });

  /* hiện dần */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* số chạy */
  function count(el, from, to, dur, suffix) {
    if (reduce) { el.textContent = to + (suffix || ''); return; }
    var t0 = performance.now();
    (function f(n) {
      var t = Math.min(1, (n - t0) / dur), v = from + (to - from) * (1 - Math.pow(1 - t, 4));
      el.textContent = Math.round(v) + (suffix || '');
      if (t < 1) requestAnimationFrame(f);
    })(t0);
  }
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; io2.unobserve(en.target);
      var b = en.target; count(b, +b.dataset.from || 0, +b.dataset.count, 1600);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(function (b) { io2.observe(b); });

  /* nhiệt độ trong nhà: 36 → 24 */
  var tin = document.getElementById('tIn'), bar = document.getElementById('tBar');
  if (tin) setTimeout(function () { count(tin, 36, 24, 2400, '°C'); if (bar) bar.style.width = '100%'; }, 700);

  /* 4 hệ thống: làm nổi lớp theo đoạn đang đọc */
  var sysB = document.querySelector('#he-thong .bld');
  var sxs = [].slice.call(document.querySelectorAll('.sx'));
  var legs = [].slice.call(document.querySelectorAll('.sys-legend span'));
  function setSys(key) {
    if (!sysB) return;
    sysB.setAttribute('data-on', key);
    sxs.forEach(function (s) { s.classList.toggle('on', s.dataset.sys === key); });
    legs.forEach(function (l) { l.classList.toggle('on', l.dataset.sys === key); });
  }
  if (sxs.length) {
    setSys('hvac');
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) setSys(en.target.dataset.sys); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sxs.forEach(function (s) { io3.observe(s); });
    legs.forEach(function (l) {
      l.addEventListener('click', function () {
        var t = document.querySelector('.sx[data-sys="' + l.dataset.sys + '"]');
        setSys(l.dataset.sys);
        if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
    });
  }

  /* tab giải pháp điều hoà */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) {
        var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on', on);
      });
    });
    t.addEventListener('keydown', function (e) {
      var k = tabs.indexOf(t), n = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : null;
      if (n === null) return; n = (n + tabs.length) % tabs.length; tabs[n].focus(); tabs[n].click();
    });
  });

  /* quy trình: đường nối chạy theo cuộn */
  var fw = document.querySelector('.flow-w'), fl = document.querySelector('.flow-line i'), steps = [].slice.call(document.querySelectorAll('.step'));
  function flowLine() {
    if (!fw) return;
    var r = fw.getBoundingClientRect(), t = Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height + innerHeight * .25)));
    if (fl) fl.style.transform = 'scaleX(' + t + ')';
    steps.forEach(function (s, k) { s.classList.toggle('on', t >= (k + .3) / steps.length || (innerWidth <= 980 && s.getBoundingClientRect().top < innerHeight * .8)); });
  }
  onScroll();

  /* hạt không khí trong hero: trôi nhẹ, né con trỏ */
  var cv = document.getElementById('air');
  if (cv && !reduce) {
    var cx = cv.getContext('2d'), W, Hh, dpr = Math.min(2, devicePixelRatio || 1), P = [], mx = -999, my = -999, run = true;
    function size() { W = cv.offsetWidth; Hh = cv.offsetHeight; cv.width = W * dpr; cv.height = Hh * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    var N = innerWidth < 640 ? 28 : 64;
    for (var i = 0; i < N; i++) P.push({ x: Math.random() * W, y: Math.random() * Hh, v: .2 + Math.random() * .5, r: .8 + Math.random() * 1.8, o: Math.random() * 6.28, gold: Math.random() < .2 });
    if (fine) cv.parentNode.addEventListener('mousemove', function (e) { var b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
    new IntersectionObserver(function (es) { run = es[0].isIntersecting; if (run) requestAnimationFrame(tick); }).observe(cv);
    function tick(ts) {
      if (!run) return;
      cx.clearRect(0, 0, W, Hh);
      P.forEach(function (q) {
        q.x -= q.v; q.y += Math.sin(ts / 1400 + q.o) * .25;
        var dx = q.x - mx, dy = q.y - my, d = dx * dx + dy * dy;
        if (d < 12000) { var f = (12000 - d) / 12000 * 2.2; q.x += dx / Math.sqrt(d + 1) * f; q.y += dy / Math.sqrt(d + 1) * f; }
        if (q.x < -10) { q.x = W + 10; q.y = Math.random() * Hh; }
        cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 6.28);
        cx.fillStyle = q.gold ? 'rgba(212,154,78,.5)' : 'rgba(127,154,168,.38)'; cx.fill();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* form nhận báo giá: gom nội dung → chép → mở Zalo */
  var form = document.getElementById('quoteForm'), ok = document.getElementById('formOk');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var lines = ['YÊU CẦU BÁO GIÁ — từ website JDV M&E'];
    form.querySelectorAll('[data-label]').forEach(function (el) { if (el.value.trim()) lines.push(el.dataset.label + ': ' + el.value.trim()); });
    var txt = lines.join('\n');
    document.getElementById('okText').textContent = txt;
    function done() { form.hidden = true; ok.classList.add('on'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
    window.open('https://zalo.me/0932343337', '_blank', 'noopener');
  });
  var again = document.getElementById('again');
  if (again) again.addEventListener('click', function () { form.hidden = false; ok.classList.remove('on'); });

  /* năm ở chân trang */
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
