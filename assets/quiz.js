(function () {
  var Q = window.QUIZ;
  var KEY = 'svquiz-' + Q.id;
  var L = ['A', 'B', 'C', 'D', 'E'];
  var state = load() || { order: null, opt: {}, picked: {}, done: {} };
  var shuffle = !!state.shuffle;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save() { try { state.shuffle = shuffle; localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function perm(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }

  document.title = Q.id + ' ' + Q.title + ' - Quiz';
  document.getElementById('title').textContent = Q.id + ' ' + Q.title;
  document.getElementById('sub').textContent = 'IBM Storage Virtualize V9.2.0 · ' + Q.questions.length + ' 題單選題';
  var list = document.getElementById('list');
  var tog = document.getElementById('shuffle');
  tog.checked = shuffle;

  function ensureOrder() {
    var n = Q.questions.length;
    if (!state.order || state.order.length !== n) state.order = shuffle ? perm(n) : perm(n).sort(function (a, b) { return a - b; });
    Q.questions.forEach(function (q, i) {
      if (!state.opt[i] || state.opt[i].length !== q.o.length) state.opt[i] = shuffle ? perm(q.o.length) : q.o.map(function (_, j) { return j; });
    });
  }

  function render() {
    ensureOrder();
    list.innerHTML = '';
    state.order.forEach(function (qi, pos) {
      var q = Q.questions[qi], ord = state.opt[qi];
      var d = document.createElement('section');
      d.className = 'q'; d.id = 'q' + qi;
      var h = '<div class="num">QUESTION ' + (pos + 1) + ' / ' + Q.questions.length + '</div><div class="stem">' + fmt(q.q) + '</div>';
      ord.forEach(function (oi, j) {
        h += '<label class="opt" data-o="' + oi + '"><input type="radio" name="r' + qi + '" value="' + oi + '"><span class="k">' + L[j] + '.</span><span>' + fmt(q.o[oi]) + '</span></label>';
      });
      h += '<div class="acts"><button class="primary chk" disabled>作答</button><button class="show">直接看答案</button></div>';
      h += '<div class="ans"><div class="verdict"></div><div class="exp"></div>' + (q.r ? '<div class="ref">出處：' + esc(q.r) + '</div>' : '') + '</div>';
      d.innerHTML = h;
      list.appendChild(d);
      var chk = d.querySelector('.chk');
      d.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('change', function () {
          if (state.done[qi]) return;
          state.picked[qi] = +inp.value; save();
          d.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('sel', +o.dataset.o === +inp.value); });
          chk.disabled = false;
        });
      });
      chk.addEventListener('click', function () { reveal(qi, true); });
      d.querySelector('.show').addEventListener('click', function () { reveal(qi, false); });
      if (state.picked[qi] !== undefined) {
        var inp = d.querySelector('input[value="' + state.picked[qi] + '"]');
        if (inp) { inp.checked = true; d.querySelector('.opt[data-o="' + state.picked[qi] + '"]').classList.add('sel'); chk.disabled = false; }
      }
      if (state.done[qi]) paint(qi);
    });
    stats();
  }

  function reveal(qi, answered) {
    if (state.done[qi]) return;
    state.done[qi] = answered && state.picked[qi] !== undefined ? 'a' : 's';
    save(); paint(qi); stats();
  }

  function paint(qi) {
    var q = Q.questions[qi], d = document.getElementById('q' + qi), p = state.picked[qi];
    d.classList.add('done');
    d.querySelectorAll('input').forEach(function (i) { i.disabled = true; });
    d.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    var j = state.opt[qi].indexOf(q.a);
    d.querySelectorAll('.opt').forEach(function (o) {
      var v = +o.dataset.o;
      o.classList.remove('sel');
      if (v === q.a) o.classList.add('right');
      else if (v === p && state.done[qi] === 'a') o.classList.add('wrong');
    });
    var vd = d.querySelector('.verdict');
    if (state.done[qi] === 'a') {
      var ok = p === q.a;
      vd.className = 'verdict ' + (ok ? 'ok' : 'bad');
      vd.textContent = (ok ? '✔ 答對了！' : '✘ 答錯了。') + '正確答案是 ' + L[j] + '。';
    } else {
      vd.className = 'verdict'; vd.textContent = '正確答案是 ' + L[j] + '。';
    }
    d.querySelector('.exp').innerHTML = fmt(q.e);
    d.querySelector('.ans').classList.add('show');
  }

  function stats() {
    var n = Q.questions.length, done = 0, ans = 0, ok = 0;
    for (var i = 0; i < n; i++) {
      if (state.done[i]) { done++; if (state.done[i] === 'a') { ans++; if (state.picked[i] === Q.questions[i].a) ok++; } }
    }
    document.getElementById('st').innerHTML = '進度 <b>' + done + '</b>/' + n + '　答對 <b>' + ok + '</b>/' + ans + (ans ? '（' + Math.round(ok * 100 / ans) + '%）' : '');
    document.getElementById('pg').style.width = (done * 100 / n) + '%';
    var r = document.getElementById('result');
    if (done === n) {
      r.innerHTML = '<b>全部完成！</b> 作答 ' + ans + ' 題，答對 ' + ok + ' 題' + (ans ? '，正確率 ' + Math.round(ok * 100 / ans) + '%' : '') + '。' + (n - ans ? '（另有 ' + (n - ans) + ' 題直接看答案，不計分）' : '');
      r.classList.add('show');
    } else r.classList.remove('show');
  }

  document.getElementById('submit').addEventListener('click', function () {
    for (var i = 0; i < Q.questions.length; i++) if (!state.done[i]) state.done[i] = state.picked[i] !== undefined ? 'a' : 's';
    save(); render(); document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('清除本章所有作答紀錄並重新開始？')) return;
    state = { order: null, opt: {}, picked: {}, done: {} }; save(); render(); window.scrollTo(0, 0);
  });
  tog.addEventListener('change', function () {
    shuffle = tog.checked; state.order = null; state.opt = {}; state.picked = {}; state.done = {}; save(); render();
  });
  render();
})();
