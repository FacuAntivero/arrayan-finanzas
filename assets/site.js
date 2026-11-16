(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function f(n){ return Math.round(n * 10) / 10; }

  /* ---------- Menú móvil y sombra de la barra ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  if(burger){
    burger.addEventListener('click', function(){
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    document.querySelectorAll('#mobile-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }

  /* ---------- WhatsApp (mismos datos que el sitio actual) ---------- */
  var WA = '5492494246954';
  var MSG = {
    home: 'Hola Juan, te escribo desde la web de Arrayán. Me gustaría coordinar una primera conversación.',
    patrimonio: 'Hola Juan, te escribo desde la web de Arrayán. Me gustaría conversar sobre mi patrimonio y mis inversiones.',
    empresa: 'Hola Juan, te escribo desde la web de Arrayán. Me gustaría conversar sobre las finanzas de mi empresa.'
  };
  document.querySelectorAll('a[data-wa]').forEach(function(a){
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(MSG[a.dataset.wa] || MSG.home);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Árbol procedural (semilla fija) ---------- */
  var LEAF = 'M0 0C5-7 5-17 0-26C-5-17-5-7 0 0Z';
  function buildTree(svg){
    var seed = 11, MAXD = 6, br = [], lv = [], rt = [];
    function rnd(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    function branch(x, y, a, len, w, d, delay){
      var ex = x + Math.sin(a) * len, ey = y - Math.cos(a) * len;
      var bend = (rnd() - .5) * len * .36;
      var cx = (x + ex) / 2 + Math.cos(a) * bend, cy = (y + ey) / 2 + Math.sin(a) * bend;
      var dur = .42 + len * .0065;
      br.push('<path class="b b' + Math.min(d, 5) + '" d="M' + f(x) + ' ' + f(y) + 'Q' + f(cx) + ' ' + f(cy) + ' ' + f(ex) + ' ' + f(ey) + '" pathLength="1" stroke-width="' + f(w) + '" style="--d:' + delay.toFixed(2) + 's;--t:' + dur.toFixed(2) + 's"/>');
      var end = delay + dur;
      if(d >= MAXD - 2){
        var n = d === MAXD ? 2 : 1;
        for(var i = 0; i < n; i++){
          var la = (a * 180 / Math.PI) + (rnd() - .5) * 120, s = .65 + rnd() * .65;
          lv.push('<g transform="translate(' + f(ex) + ' ' + f(ey) + ') rotate(' + f(la) + ')"><path class="lf c' + (1 + Math.floor(rnd() * 4)) + '" d="' + LEAF + '" style="--d:' + (end + .05 + rnd() * .35).toFixed(2) + 's;--s:' + s.toFixed(2) + '"/></g>');
        }
      }
      if(d < MAXD && len > 14){
        var k = d < 2 ? 2 : (rnd() < .38 ? 3 : 2);
        for(var j = 0; j < k; j++){
          var side = k === 2 ? (j === 0 ? -1 : 1) : (j - 1);
          branch(ex, ey, a + side * (.26 + rnd() * .38) + (rnd() - .5) * .12, len * (.7 + rnd() * .12), w * .66, d + 1, end * .9 + j * .04);
        }
      }
    }
    function root(x, y, a, len, w, d, delay){
      var ex = x + Math.sin(a) * len, ey = y - Math.cos(a) * len;
      var bend = (rnd() - .5) * len * .4;
      var cx = (x + ex) / 2 + Math.cos(a) * bend, cy = (y + ey) / 2 + Math.sin(a) * bend;
      var dur = .4 + len * .006;
      rt.push('<path class="r" d="M' + f(x) + ' ' + f(y) + 'Q' + f(cx) + ' ' + f(cy) + ' ' + f(ex) + ' ' + f(ey) + '" pathLength="1" stroke-width="' + f(w) + '" style="--d:' + delay.toFixed(2) + 's;--t:' + dur.toFixed(2) + 's"/>');
      if(d < 3 && len > 18){
        for(var j = 0; j < 2; j++) root(ex, ey, a + (j ? 1 : -1) * (.3 + rnd() * .45), len * (.68 + rnd() * .1), w * .62, d + 1, delay + dur * .85);
      }
    }
    var GY = 470;
    [-.62, -.22, .18, .6].forEach(function(da, i){ root(300 + (i - 1.5) * 8, GY, Math.PI + da, 78 - Math.abs(da) * 20, 6.5, 0, .5 + i * .06); });
    branch(300, GY, .03, 132, 15, 0, 1.0);
    svg.innerHTML =
      '<path class="gl" d="M40 470H560" pathLength="1" style="--d:.1s;--t:1.4s"/>' +
      '<g>' + rt.join('') + '</g>' +
      '<g class="canopy"><g>' + br.join('') + '</g><g>' + lv.join('') + '</g></g>' +
      '<text x="48" y="500" style="--d:4.2s">↓ raíces · Tandil</text>' +
      '<text x="552" y="500" text-anchor="end" style="--d:4.6s">↑ ramas</text>';
  }
  document.querySelectorAll('svg.tree').forEach(buildTree);

  /* ---------- Titular: palabra rotativa (personas -> familias -> PyMEs -> personas y PyMEs) ---------- */
  var slot = document.querySelector('.rot-slot');
  if(slot){
    var ws = [].slice.call(slot.querySelectorAll('.rot-w')), cur = ws.length - 1, timer;
    var fit = function(){ var w = slot.querySelector('.rot-w.on'); if(w) slot.style.width = w.offsetWidth + 'px'; };
    var show = function(i, draw){
      ws.forEach(function(w, k){ w.classList.toggle('on', k === i); w.classList.toggle('out', k === cur && k !== i); });
      cur = i; fit();
      if(draw){ slot.classList.remove('draw'); void slot.offsetWidth; slot.classList.add('draw'); }
    };
    addEventListener('resize', fit);
    if(reduce){ slot.style.transition = 'none'; slot.classList.add('draw'); (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit); }
    else {
      var seq = [0, 1, 2, 3], n = 0;
      var step = function(){
        show(seq[n], true); n++;
        if(n < seq.length) timer = setTimeout(step, 2300);
      };
      slot.style.transition = 'none';
      ws.forEach(function(w){ w.classList.remove('on'); });
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function(){
        cur = -1; show(0, false); slot.style.width = ws[0].offsetWidth + 'px';
        setTimeout(function(){ slot.style.transition = ''; slot.classList.add('draw'); n = 1; timer = setTimeout(step, 2300); }, 1500);
      });
    }
  }

  /* ---------- Reveal / disparo de animaciones al entrar en pantalla ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add(e.target.classList.contains('tree') ? 'go' : 'in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: .2}) : null;
  document.querySelectorAll('.rv, svg.tree').forEach(function(el){
    if(io) io.observe(el); else el.classList.add(el.classList.contains('tree') ? 'go' : 'in');
  });

  /* ---------- Anillos de crecimiento (página Quién soy) ---------- */
  var svg = document.getElementById('rings');
  if(svg){
    var C = 200;
    var blob = function(r, ph, amp){
      var pts = [], N = 150;
      for(var i = 0; i <= N; i++){
        var t = i / N * Math.PI * 2 - Math.PI / 2;
        var k = 1 + amp * (Math.sin(3 * t + ph) * .55 + Math.sin(5 * t + ph * 1.9) * .3 + Math.sin(2 * t + ph * .6) * .15);
        pts.push(f(C + Math.cos(t) * r * k) + ' ' + f(C + Math.sin(t) * r * k));
      }
      return 'M' + pts.join('L');
    };
    var layer = document.getElementById('ring-layer'), pl = document.getElementById('pill-layer');
    var MAIN = [{r: 76, c: '#B06A37', y: '2016'}, {r: 114, c: '#94803d', y: '2021'}, {r: 152, c: '#5d8a47', y: '2025'}, {r: 188, c: '#2E7243', y: '2026'}];
    var DECOR = [[52, 64], [90, 102], [128, 140], [166, 176]];
    var lh = '', ph = '';
    MAIN.forEach(function(m, i){
      DECOR[i].forEach(function(r, j){ lh += '<path class="ring d" data-k="' + (i + 1) + '" d="' + blob(r, i * 1.3 + j * .7, .018) + '" pathLength="1"/>'; });
      lh += '<path class="ring m" data-k="' + (i + 1) + '" stroke="' + m.c + '" d="' + blob(m.r, i * 1.3 + .3, .018) + '" pathLength="1"/>';
      var ang = -42 * Math.PI / 180;
      ph += '<g class="pill" data-k="' + (i + 1) + '" transform="translate(' + f(C + Math.cos(ang) * m.r) + ' ' + f(C + Math.sin(ang) * m.r) + ')"><rect x="-27" y="-11" width="54" height="22" rx="11" stroke="' + m.c + '"/><text>' + m.y + '</text></g>';
    });
    layer.innerHTML = lh; pl.innerHTML = ph;

    var steps = [].slice.call(document.querySelectorAll('.rstep'));
    var yrEl = document.getElementById('yr');
    var YRS = ['Raíces', '2016', '2021', '2025', 'Hoy'];
    var mains = [].slice.call(layer.querySelectorAll('.ring.m')), decs = [].slice.call(layer.querySelectorAll('.ring.d')), pills = [].slice.call(pl.querySelectorAll('.pill'));
    var cur = -1;
    var setActive = function(i){
      if(i === cur) return; cur = i;
      steps.forEach(function(s, k){ s.classList.toggle('act', k === i); });
      mains.forEach(function(m){ var k = +m.dataset.k; m.classList.toggle('on', reduce || k <= i); m.classList.toggle('act', k === i); });
      decs.forEach(function(m){ m.classList.toggle('on', reduce || +m.dataset.k <= i); });
      pills.forEach(function(m){ m.classList.toggle('on', reduce || +m.dataset.k <= i); });
      yrEl.textContent = YRS[i];
    };
    var desk = matchMedia('(min-width:900px)');
    var pick = function(){
      var fig = document.querySelector('.fig').getBoundingClientRect();
      var target = desk.matches ? innerHeight * .5 : fig.bottom + (innerHeight - fig.bottom) * .4;
      var best = 0, bd = 1e9;
      steps.forEach(function(s, k){ var r = s.getBoundingClientRect(); var d = Math.abs((r.top + r.bottom) / 2 - target); if(d < bd){ bd = d; best = k; } });
      setActive(best);
    };
    var tick = false;
    addEventListener('scroll', function(){ if(!tick){ tick = true; requestAnimationFrame(function(){ tick = false; pick(); }); } }, {passive: true});
    addEventListener('resize', pick);
    pick();
  }
})();
