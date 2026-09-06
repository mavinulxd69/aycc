(function(){
  if (window.gsap) {
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
  }
  if (typeof window.Lenis === 'function' && !window.__appLenis) {
    var lenis = new window.Lenis();
    window.__appLenis = lenis;
    /* Lenis now owns smooth scrolling — disable the native CSS smooth
       scroll so the two don't fight and double-smooth the page. */
    document.documentElement.style.scrollBehavior = 'auto';
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function(time){ lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    /* Route same-page hash-link clicks through Lenis so anchor jumps stay
       smooth and consistent with scroll-driven animations. */
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a) return;
      var url;
      try { url = new URL(a.getAttribute('href'), window.location.href); } catch (err) { return; }
      if (url.pathname !== window.location.pathname || !url.hash) return;
      var target;
      try { target = document.querySelector(url.hash); } catch (err) { return; }
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    });
  }
})();

(function(){var t=document.querySelector('.nav-toggle');var l=document.getElementById('nav-links');if(!t||!l)return;function setOpen(o){t.setAttribute('aria-expanded',o?'true':'false');t.setAttribute('aria-label',o?'Close menu':'Open menu');t.textContent=o?'\u2715':'\u2630';l.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''}t.addEventListener('click',function(){setOpen(t.getAttribute('aria-expanded')!=='true')});l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false)})});window.addEventListener('resize',function(){if(window.innerWidth>768)setOpen(false)})})();

(function () {
  var form = document.getElementById('a27-interest-form');
  if (!form) return;
  var status = document.createElement('p');
  status.className = 'a27-form-status';
  status.setAttribute('aria-live', 'polite');
  var fallback = form.querySelector('.a27-form-fallback');
  if (fallback) fallback.insertAdjacentElement('afterend', status);
  else form.appendChild(status);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (form.classList.contains('is-sending') || form.classList.contains('is-sent')) return;
    var data = new FormData(form);
    var subject = encodeURIComponent('AYCT 27 registration interest');
    var body = encodeURIComponent([
      'Name: ' + data.get('name'),
      'Email: ' + data.get('email'),
      'Institution: ' + (data.get('institution') || 'Not provided')
    ].join('\n'));
    var mailtoUrl = 'mailto:pr@amazeconsortium.org?subject=' + subject + '&body=' + body;

    form.classList.add('is-sending');
    status.innerHTML = '<span class="a27-form-status__dot" aria-hidden="true"></span>sending&hellip;';

    window.setTimeout(function () {
      window.location.href = mailtoUrl;
      form.classList.remove('is-sending');
      form.classList.add('is-sent');
      status.classList.add('is-good');
      status.textContent = "you're on the list. your email app should now be open to send the details.";
    }, 650);
  });
})();

/* snippet: header.center-stack-reveal */
document.querySelectorAll('[data-snippet="header.center-stack-reveal"]').forEach((root) => {
  if (root.__csrvBound) return;
  root.__csrvBound = true;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    root.setAttribute('data-csrv-instant', '');
    return;
  }

  const play = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.setAttribute('data-csrv-state', 'in');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', play, { once: true });
  } else {
    play();
  }
});

/* snippet: features.cards-spread-row */
(() => {
  const roots = document.querySelectorAll('[data-snippet="features.cards-spread-row"]');
  if (!roots.length) return;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' &&
    typeof window.ScrollTrigger !== 'undefined';
  if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

  roots.forEach((root) => {
    if (root.dataset.csrReady) return;
    root.dataset.csrReady = '1';

    if (reduce || !hasGsap) {
      root.classList.add('is-fallback');
      return;
    }

    window.ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      end:   'top 35%',
      scrub: 0.5,
      onUpdate: (self) => {
        root.style.setProperty('--csr-p', self.progress.toFixed(4));
      },
    });
  });
})();

/* snippet: feature.podium-rise */
document.querySelectorAll('[data-snippet="feature.podium-rise"]').forEach((root) => {
  if (root.__podiumBound) return;
  root.__podiumBound = true;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const useStaticFallback =
    reduce || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined';

  // No GSAP / reduced motion: leave the podium in its normal CSS-visible
  // state (see .podium-card defaults in the stylesheet) — no animation.
  if (useStaticFallback) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const cards = Array.from(root.querySelectorAll('.podium-card'));
  if (!cards.length) return;

  const first  = root.querySelector('.podium-card--first');
  const second = root.querySelector('.podium-card--second');
  const third  = root.querySelector('.podium-card--third');
  const ordered = [second, first, third].filter(Boolean);

  const plinths = cards.map((c) => c.querySelector('.podium-card__plinth')).filter(Boolean);
  const crown   = root.querySelector('.ayct-podium-crown');
  const photos  = cards.map((c) => c.querySelector('.ayct-podium-photo')).filter(Boolean);

  // Starting state — hidden, dropped in slightly, pedestals flat.
  gsap.set(cards, { opacity: 0, y: 70, scale: 0.92 });
  gsap.set(plinths, { scaleY: 0, transformOrigin: '50% 100%' });
  if (crown) gsap.set(crown, { opacity: 0, y: -18, scale: 0.4, rotate: -18, transformOrigin: '50% 100%' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top 78%',
      once: true,
      invalidateOnRefresh: true,
    },
  });

  tl.to(plinths, {
    scaleY: 1,
    duration: 0.7,
    ease: 'power3.out',
    stagger: { each: 0.14, from: 'center' },
  }, 0);

  tl.to(ordered, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1.6)',
    stagger: { each: 0.16, from: 'center' },
  }, 0.12);

  if (crown) {
    tl.to(crown, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.55,
      ease: 'back.out(2.6)',
    }, 0.55);
  }

  // Subtle ambient float on the photos once everything has landed — a
  // continuous, low-amplitude motion, not a scroll-driven one.
  tl.add(() => {
    photos.forEach((photo, i) => {
      gsap.to(photo, {
        y: -6,
        duration: 2.4 + i * 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  });
});

/* snippet: article.mission-split-reveal */
(() => {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const splitIntoLines = (host) => {
    if (host.dataset.msrSplit) {
      return Array.from(host.querySelectorAll('[data-msr-line]'));
    }
    host.dataset.msrSplit = '1';

    const units = [];
    Array.from(host.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        (node.textContent || '').split(/(\s+)/).forEach((part) => {
          if (!part || /^\s+$/.test(part)) return;
          units.push({ type: 'word', text: part });
        });
      } else if (node.nodeName === 'BR') {
        units.push({ type: 'br' });
      } else {
        units.push({ type: 'node', node });
      }
    });

    host.textContent = '';
    const measured = [];
    units.forEach((u, i) => {
      if (u.type === 'br') { measured.push({ br: true }); return; }
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      if (u.type === 'word') span.textContent = u.text;
      else span.appendChild(u.node);
      host.appendChild(span);
      if (i < units.length - 1) host.appendChild(document.createTextNode(' '));
      measured.push({ el: span });
    });

    const lines = [];
    let current = [];
    let lastTop = null;
    measured.forEach((m) => {
      if (m.br) {
        if (current.length) { lines.push(current); current = []; }
        lastTop = null;
        return;
      }
      const top = m.el.offsetTop;
      if (lastTop !== null && Math.abs(top - lastTop) > 1) {
        lines.push(current);
        current = [];
      }
      current.push(m.el);
      lastTop = top;
    });
    if (current.length) lines.push(current);

    host.textContent = '';
    const inners = [];
    lines.forEach((lineEls) => {
      const mask = document.createElement('span');
      mask.setAttribute('data-msr-line-mask', '');
      const inner = document.createElement('span');
      inner.setAttribute('data-msr-line', '');
      lineEls.forEach((el, idx) => {
        while (el.firstChild) inner.appendChild(el.firstChild);
        if (idx < lineEls.length - 1) inner.appendChild(document.createTextNode(' '));
      });
      mask.appendChild(inner);
      host.appendChild(mask);
      inners.push(inner);
    });
    return inners;
  };

  document.querySelectorAll('[data-snippet="article.mission-split-reveal"]').forEach((root) => {
    if (root.dataset.msrReady) return;
    root.dataset.msrReady = '1';

    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
      () => {
        const cs     = getComputedStyle(root);
        const pad    = cs.getPropertyValue('--msr-pad').trim()    || '4vw';
        const radius = cs.getPropertyValue('--radius').trim()     || '14px';
        const scroll = cs.getPropertyValue('--msr-scroll').trim() || '180%';
        const pin    = root.querySelector('.msr__pin');
        const media  = root.querySelector('.msr__media');
        if (!pin || !media) return;

        const lineHosts = Array.from(
          root.querySelectorAll('.msr__lines :is(h1,h2,h3,h4,h5,h6,p)')
        );
        const fallbackHost = root.querySelector('.msr__lines');
        const lines = lineHosts.length
          ? lineHosts.flatMap((host) => splitIntoLines(host))
          : (fallbackHost ? splitIntoLines(fallbackHost) : []);

        // Resize the media box's real edges (rather than clip-path) so the
        // image's object-fit:cover crop recalculates and stays centered in
        // the visible area as the box narrows, instead of staying centered
        // on the original full-bleed box and looking off-center once cropped.
        gsap.set(media, { top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 });
        if (lines.length) gsap.set(lines, { yPercent: 110 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end:   `+=${scroll}`,
            pin:   pin,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(media, {
          top: pad,
          left: pad,
          right: '50vw',
          bottom: pad,
          borderRadius: radius,
          duration: 0.4,
          ease: 'power3.inOut',
        }, 0);

        if (lines.length) {
          // Keep the staggered reveal inside the pin even when the slot holds
          // many lines (e.g. a multi-item list): shrink the per-line offset so
          // every line still finishes within the timeline window.
          const lineStagger = lines.length > 1
            ? Math.min(0.10, 0.5 / lines.length)
            : 0.10;
          tl.to(lines, {
            yPercent: 0,
            duration: 0.25,
            ease: 'expo.out',
            stagger: lineStagger,
          }, 0.4);
        }

        tl.to({}, { duration: 0.15 }, 0.85);
      }
    );
  });
})();

/* motion runtime: viewportOnce */
(function () {
  if (window.__mMotionReady) return;
  window.__mMotionReady = true;
  const targets = Array.from(document.querySelectorAll('[data-motion]'));
  if (targets.length === 0) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((target) => observer.observe(target));
})();

/* motion: letter-cursor-magnet */
(function () {
  const hosts = document.querySelectorAll('[data-motion~="letter-cursor-magnet"]');
  if (!hosts.length) return;
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer =
    window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (prefersReducedMotion || isCoarsePointer) return;
  const allChars = [];
  hosts.forEach((host) => {
    if (host.dataset.lcmReady) return;
    host.dataset.lcmReady = '1';
    const text = (host.textContent || '').trim();
    if (!text) return;
    host.setAttribute('aria-label', text);
    host.textContent = '';
    const chunks = text.split(/(\s+)/);
    chunks.forEach((chunk) => {
      if (chunk === '') return;
      if (/^\s+$/.test(chunk)) {
        host.appendChild(document.createTextNode(' '));
        return;
      }
      const word = document.createElement('span');
      word.className = 'lcm__word';
      word.setAttribute('aria-hidden', 'true');
      [...chunk].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'lcm__char';
        span.textContent = ch;
        word.appendChild(span);
        allChars.push({ el: span, host, cx: 0, cy: 0, radius: 0 });
      });
      host.appendChild(word);
    });
  });
  if (!allChars.length) return;
  const measure = () => {
    for (let i = 0; i < allChars.length; i++) {
      const c = allChars[i];
      const r = c.el.getBoundingClientRect();
      c.cx = r.left + r.width * 0.5;
      c.cy = r.top + r.height * 0.5;
      const raw = getComputedStyle(c.host).getPropertyValue('--lcm-radius');
      const parsed = parseFloat(raw);
      c.radius = Number.isFinite(parsed) && parsed > 0 ? parsed : 180;
    }
  };
  measure();
  let measurePending = false;
  const scheduleMeasure = () => {
    if (measurePending) return;
    measurePending = true;
    requestAnimationFrame(() => {
      measurePending = false;
      measure();
    });
  };
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('scroll', scheduleMeasure, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
  let mx = -99999, my = -99999;
  let raf = 0;
  const tick = () => {
    raf = 0;
    for (let i = 0; i < allChars.length; i++) {
      const c = allChars[i];
      const dx = mx - c.cx;
      const dy = my - c.cy;
      const r2 = c.radius * c.radius;
      const d2 = dx * dx + dy * dy;
      let f = 0;
      if (d2 < r2) {
        const t = 1 - Math.sqrt(d2) / c.radius;
        f = t * t * (3 - 2 * t);
      }
      c.el.style.setProperty('--f', f.toFixed(3));
    }
  };
  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onLeave = () => {
    mx = -99999;
    my = -99999;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerleave', onLeave);
  window.addEventListener('pointercancel', onLeave);
})();

/* motion: text-letter-fade */
(function () {
  const hosts = document.querySelectorAll('[data-motion~="text-letter-fade"]');
  if (!hosts.length) return;
  hosts.forEach((host) => {
    if (host.dataset.tlfReady) return;
    host.dataset.tlfReady = '1';
    const raw = (host.textContent || '').trim();
    if (!raw) return;
    host.setAttribute('data-tlf-text', raw);
    host.textContent = '';
    raw.split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) {
        host.appendChild(document.createTextNode(' '));
        return;
      }
      const word = document.createElement('span');
      word.className = 'tlf__word';
      for (const ch of chunk) {
        const letter = document.createElement('span');
        letter.className = 'tlf__letter';
        letter.textContent = ch;
        word.appendChild(letter);
      }
      host.appendChild(word);
    });
  });
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  hosts.forEach((host) => {
    const letters = host.querySelectorAll('.tlf__letter');
    if (!letters.length) return;
    const cs = getComputedStyle(host);
    const dim = parseFloat(cs.getPropertyValue('--tlf-dim')) || 0.15;
    const win = Math.max(1, parseFloat(cs.getPropertyValue('--tlf-window')) || 8);
    const total = letters.length;
    ScrollTrigger.create({
      trigger: host,
      start: 'top 85%',
      end: 'bottom 35%',
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        const lead = p * (total + win) - win;
        for (let i = 0; i < total; i++) {
          const d = lead - i;
          let o;
          if (d >= 0) {
            o = 1;
          } else if (d > -win) {
            const t = 1 + d / win;
            o = dim + (1 - dim) * t;
          } else {
            o = dim;
          }
          letters[i].style.opacity = o;
        }
      }
    });
  });
})();

/* motion: button-circle-arrow */
(function () {
  const hosts = document.querySelectorAll('[data-motion~="button-circle-arrow"]');
  if (!hosts.length) return;
  const ARROW_SVG =
    '<svg viewBox="0 0 23 19" class="bca__arrow"><polygon points="13.5,18.7 12.1,17.3 18.9,10.5 0.3,10.5 0.3,8.5 18.9,8.5 12.1,1.7 13.5,0.3 22.7,9.5"/></svg>';
  const ARROW_DUP_SVG =
    '<svg viewBox="0 0 23 19" class="bca__arrow bca__arrow--dup"><polygon points="13.5,18.7 12.1,17.3 18.9,10.5 0.3,10.5 0.3,8.5 18.9,8.5 12.1,1.7 13.5,0.3 22.7,9.5"/></svg>';
  hosts.forEach((host) => {
    if (host.dataset.bcaReady) return;
    host.dataset.bcaReady = '1';
    const label = (host.textContent || '').trim();
    if (!label) return;
    host.textContent = '';
    const labelEl = document.createElement('span');
    labelEl.className = 'bca__label';
    labelEl.textContent = label;
    host.appendChild(labelEl);
    const badge = document.createElement('span');
    badge.className = 'bca__badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = '<span class="bca__arrows">' + ARROW_SVG + '</span>';
    host.appendChild(badge);
    const fill = document.createElement('span');
    fill.className = 'bca__fill';
    fill.setAttribute('aria-hidden', 'true');
    fill.innerHTML =
      '<span class="bca__row">' +
        '<span>' + label.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) + '</span>' +
        '<span class="bca__arrows">' + ARROW_SVG + ARROW_DUP_SVG + '</span>' +
      '</span>';
    host.appendChild(fill);
  });
})();

(function(){
  var nav = document.querySelector('.m-nav');
  if (!nav) return;
  var stickyGap = 12;
  var managedHeaderTargets = [];

  function getFirstHeader() {
    var first = nav.nextElementSibling;
    if (!first || !first.matches('[data-section="header"], [data-section="hero"]')) return null;
    return first;
  }

  function isExcludedHeaderTarget(element) {
    if (element.matches && element.matches('[data-page-overlay], [data-crh-curtain]')) return true;
    return false;
  }

  function restoreManagedHeaderTargets() {
    managedHeaderTargets.forEach(function(target){
      target.element.style.height = target.height;
      target.element.style.minHeight = target.minHeight;
    });
    managedHeaderTargets = [];
  }

  function rememberHeaderTarget(element) {
    if (managedHeaderTargets.some(function(target){ return target.element === element; })) return;
    managedHeaderTargets.push({
      element: element,
      height: element.style.height,
      minHeight: element.style.minHeight
    });
  }

  function addHeaderTarget(targets, element, applyHeight, applyMinHeight) {
    if (!element || targets.some(function(target){ return target.element === element; })) return;
    if (isExcludedHeaderTarget(element)) return;
    targets.push({ element: element, height: Boolean(applyHeight), minHeight: Boolean(applyMinHeight) });
  }

  function getHeaderTargets(first) {
    var targets = [];
    var rootNeedsFixedHeight = first.matches('.hzr, [data-nav-aware-height]');
    addHeaderTarget(targets, first, rootNeedsFixedHeight, true);
    first.querySelectorAll('.crh__stage, .hps__pin, .zth__pin, [data-nav-aware-viewport]').forEach(function(element){
      addHeaderTarget(targets, element, true, true);
    });
    return targets;
  }

  function getNavMetrics() {
    var navStyle = window.getComputedStyle(nav);
    var navPosition = navStyle.position;
    var navHeight = nav.getBoundingClientRect().height;
    return {
      height: navHeight,
      consumesSpace: navPosition !== 'fixed' && navPosition !== 'absolute',
      overlaysViewport: navPosition === 'fixed' || navPosition === 'sticky' || navPosition === 'absolute'
    };
  }

  function applyNavAwareHeaderHeight(metrics) {
    restoreManagedHeaderTargets();
    var first = getFirstHeader();
    if (!first) return;
    var navHeight = metrics.consumesSpace ? metrics.height : 0;
    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var availableHeight = Math.max(0, Math.round(viewportHeight - navHeight));
    getHeaderTargets(first).forEach(function(target){
      rememberHeaderTarget(target.element);
      if (target.minHeight) target.element.style.minHeight = availableHeight + 'px';
      if (target.height) target.element.style.height = availableHeight + 'px';
    });
  }

  function applyStickyOffsets(metrics) {
    var navTop = metrics.overlaysViewport && metrics.height > 0 ? metrics.height + stickyGap : 0;
    document.querySelectorAll('[data-sticky-under-nav]').forEach(function(element){
      element.style.top = '';
      var style = window.getComputedStyle(element);
      if (style.position !== 'sticky') return;
      var baseTop = parseFloat(style.top);
      if (!Number.isFinite(baseTop)) return;
      var safeTop = navTop > 0 ? Math.max(baseTop, navTop) : baseTop;
      element.style.top = Math.round(safeTop) + 'px';
    });
  }

  function applyNavAwareLayout() {
    var metrics = getNavMetrics();
    applyNavAwareHeaderHeight(metrics);
    applyStickyOffsets(metrics);
  }

  applyNavAwareLayout();
  window.addEventListener('resize', applyNavAwareLayout, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', applyNavAwareLayout, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(applyNavAwareLayout).catch(function(){});
  }
  if (window.ResizeObserver) {
    new ResizeObserver(applyNavAwareLayout).observe(nav);
  }
})();

/* AYCT content assets: podium/venue/gallery photos live under img/ and may
   not exist yet; hide the broken-image icon and show a muted placeholder. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ayct-podium-photo img, .venue-photo, .ayct-gallery-tile img').forEach(img => {
    img.addEventListener('error', () => {
      const container = img.closest('.ayct-podium-photo, .venue-image-wrapper, .ayct-gallery-tile');
      if (container) container.classList.add('img-missing');
      img.remove();
    }, { once: true });
  });

  /* nav background solidifies once the page scrolls past the hero */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
      } else {
        nav.style.background = '';
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }
});
/* ===================================================================
   CINEMATIC UPGRADE LAYER
   =================================================================== */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fineHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- living board-field background (inserted once, first in body) ---- */
  (function boardField() {
    if (document.querySelector('.board-field')) return;
    var field = document.createElement('div');
    field.className = 'board-field';
    field.setAttribute('aria-hidden', 'true');
    field.innerHTML =
      '<div class="board-field__grid"></div>' +
      '<div class="board-field__glow"></div>';
    document.body.insertBefore(field, document.body.firstChild);

    if (!reduceMotion) {
      var files = 'abcdefgh'.split('');
      files.forEach(function (f, i) {
        var el = document.createElement('span');
        el.className = 'board-field__coord';
        el.textContent = f;
        el.style.left = (6 + i * 12) + 'vw';
        el.style.top = '2vh';
        field.appendChild(el);
      });
    }
  })();

  /* ---- hero: coordinate ribbon markup + mouse parallax ---- */
  (function heroExtras() {
    document.querySelectorAll('.csrv').forEach(function (root) {
      var media = root.querySelector('.csrv__media');
      if (media && !root.querySelector('.csrv__coords')) {
        var coords = document.createElement('div');
        coords.className = 'csrv__coords';
        coords.setAttribute('aria-hidden', 'true');
        var files = 'A B C D E F G H'.split(' ').map(function (f) { return '<span>' + f + '</span>'; }).join('');
        var ranks = '8 7 6 5 4 3 2 1'.split(' ').map(function (r) { return '<span>' + r + '</span>'; }).join('');
        coords.innerHTML =
          '<div class="csrv__coords-files">' + files + '</div>' +
          '<div class="csrv__coords-ranks">' + ranks + '</div>';
        media.appendChild(coords);
      }
      if (media && !root.querySelector('.csrv__sheen')) {
        var sheen = document.createElement('div');
        sheen.className = 'csrv__sheen';
        sheen.setAttribute('aria-hidden', 'true');
        media.appendChild(sheen);
      }
      var statBlock = root.querySelector('.stat-block');
      if (statBlock) statBlock.classList.add('csrv__stats');

      if (!fineHover || reduceMotion) return;
      var img = root.querySelector('.csrv__image');
      var content = root.querySelector('.csrv__content');
      root.addEventListener('pointermove', function (e) {
        var r = root.getBoundingClientRect();
        var px = ((e.clientX - r.left) / r.width - 0.5);
        var py = ((e.clientY - r.top) / r.height - 0.5);
        if (img) { img.style.setProperty('--px', (px * -14).toFixed(1) + 'px'); img.style.setProperty('--py', (py * -10).toFixed(1) + 'px'); }
        if (content) { content.style.setProperty('--px', (px * 6).toFixed(1) + 'px'); content.style.setProperty('--py', (py * 4).toFixed(1) + 'px'); }
      }, { passive: true });
      root.addEventListener('pointerleave', function () {
        if (img) { img.style.setProperty('--px', '0px'); img.style.setProperty('--py', '0px'); }
        if (content) { content.style.setProperty('--px', '0px'); content.style.setProperty('--py', '0px'); }
      });
    });
  })();

  /* ---- nav active-section indicator ---- */
  (function navActive() {
    var links = Array.from(document.querySelectorAll('.nav-links a[href*="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var hash = a.getAttribute('href').split('#')[1];
      if (hash) map[hash] = a;
    });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!sections.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---- tournament journey: piece travels the track on scroll ---- */
  (function journey() {
    var track = document.getElementById('journey-track');
    if (!track) return;
    var stages = Array.from(track.querySelectorAll('.journey__stage'));
    if (reduceMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      stages.forEach(function (s) { s.classList.add('is-active'); });
      return;
    }
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    ScrollTrigger.create({
      trigger: track,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.5,
      onUpdate: function (self) {
        track.style.setProperty('--jp', self.progress.toFixed(4));
        var idx = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
        stages.forEach(function (s, i) { s.classList.toggle('is-active', i <= idx); });
      }
    });
  })();

  /* ---- champions: cursor-follow spotlight + click-to-expand ---- */
  (function podiumExtras() {
    document.querySelectorAll('.podium-card').forEach(function (card) {
      if (fineHover && !reduceMotion) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        });
      }
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', function () { card.classList.toggle('is-open'); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-open'); }
      });
    });
  })();

  /* ---- gallery lightbox ---- */
  (function galleryLightbox() {
    var tiles = Array.from(document.querySelectorAll('.ayct-gallery-tile'));
    if (!tiles.length) return;
    tiles.forEach(function (tile, i) {
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('role', 'button');
      var caption = tile.querySelector('.ayct-gallery-tile__caption');
      tile.setAttribute('aria-label', 'Open image' + (caption ? ': ' + caption.textContent : ''));
    });

    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'ayct-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('data-open', 'false');
    lb.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">\u2715</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Previous image">\u2039</button>' +
      '<div class="lightbox__stage">' +
        '<img class="lightbox__img" alt="">' +
        '<span class="lightbox__caption"></span>' +
      '</div>' +
      '<button type="button" class="lightbox__next" aria-label="Next image">\u203a</button>' +
      '<span class="lightbox__counter"></span>';
    document.body.appendChild(lb);

    var imgEl = lb.querySelector('.lightbox__img');
    var capEl = lb.querySelector('.lightbox__caption');
    var counterEl = lb.querySelector('.lightbox__counter');
    var current = 0, lastFocused = null;

    function pad(n) { return String(n).padStart(2, '0'); }
    function render() {
      var tile = tiles[current];
      var img = tile.querySelector('img');
      var caption = tile.querySelector('.ayct-gallery-tile__caption');
      imgEl.src = img ? img.src : '';
      imgEl.alt = img ? img.alt : '';
      capEl.textContent = caption ? caption.textContent : '';
      counterEl.textContent = pad(current + 1) + ' / ' + pad(tiles.length);
    }
    function open(i) {
      current = i;
      lastFocused = document.activeElement;
      render();
      lb.setAttribute('data-open', 'true');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    }
    function close() {
      lb.setAttribute('data-open', 'false');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    function next() { current = (current + 1) % tiles.length; render(); }
    function prev() { current = (current - 1 + tiles.length) % tiles.length; render(); }

    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function () { open(i); });
      tile.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__next').addEventListener('click', next);
    lb.querySelector('.lightbox__prev').addEventListener('click', prev);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  })();

  /* ---- make your move: lightweight puzzle interaction ---- */
  (function makeYourMove() {
    var board = document.getElementById('move-board');
    if (!board) return;
    var feedback = document.getElementById('move-feedback');

    var files = ['a','b','c','d','e','f','g','h'];
    var pieces = { d1: '\u2655', g1: '\u2654', h8: '\u265A', g7: '\u265F', g6: '\u2659' };
    var whiteSquares = { d1: 1, g1: 1, g6: 1 };
    var movable = 'd1';
    var target = 'd8';
    var decoys = ['d5', 'h5'];
    var candidates = [target].concat(decoys);
    var selected = false;
    var solved = false;

    for (var r = 8; r >= 1; r--) {
      for (var f = 0; f < 8; f++) {
        var sq = files[f] + r;
        var cell = document.createElement('div');
        cell.className = 'move-sq' + (((f + r) % 2 === 0) ? ' is-dark' : '');
        cell.dataset.square = sq;
        if (pieces[sq]) {
          cell.textContent = pieces[sq];
          if (sq === movable) cell.classList.add('is-piece');
        }
        board.appendChild(cell);
      }
    }

    function setFeedback(text, good) {
      feedback.textContent = text;
      feedback.classList.toggle('is-good', !!good);
    }

    board.addEventListener('click', function (e) {
      if (solved) return;
      var cell = e.target.closest('.move-sq');
      if (!cell) return;
      var sq = cell.dataset.square;

      if (!selected) {
        if (sq === movable) {
          selected = true;
          cell.classList.add('is-selected');
          candidates.forEach(function (c) {
            var el = board.querySelector('[data-square="' + c + '"]');
            if (el) el.classList.add('is-candidate');
          });
        }
        return;
      }

      if (sq === movable) return;

      if (sq === target) {
        solved = true;
        cell.textContent = pieces.d1;
        cell.classList.add('is-correct');
        board.querySelector('[data-square="' + movable + '"]').textContent = '';
        setFeedback('Good move. Checkmate.', true);
      } else if (candidates.indexOf(sq) !== -1) {
        cell.classList.add('is-wrong');
        setFeedback('The board disagrees. Try again.', false);
        window.setTimeout(function () { cell.classList.remove('is-wrong'); }, 400);
      }

      if (!solved) {
        selected = false;
        board.querySelectorAll('.is-selected, .is-candidate').forEach(function (el) {
          el.classList.remove('is-selected', 'is-candidate');
        });
      } else {
        board.querySelectorAll('.is-selected, .is-candidate').forEach(function (el) {
          el.classList.remove('is-selected', 'is-candidate');
        });
      }
    });
  })();

  /* ---- count-up for real, existing numbers only ---- */
  (function countUp() {
    var els = document.querySelectorAll('.countup');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        if (!Number.isFinite(target)) return;
        if (reduceMotion) { el.textContent = target; return; }
        var start = 0;
        var duration = 900;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min(1, (ts - startTime) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(start + (target - start) * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---- magnetic buttons ---- */
  (function magneticButtons() {
    if (!fineHover || reduceMotion) return;
    document.querySelectorAll('.m-btn, .m-btn-outline').forEach(function (btn) {
      var maxOffset = 8;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var my = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = 'translate(' + (mx * maxOffset).toFixed(1) + 'px,' + (my * maxOffset).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  })();

  /* ---- spotlight-follow for .vab-card / .m-card ---- */
  (function spotlightCards() {
    if (!fineHover || reduceMotion) return;
    document.querySelectorAll('.vab-card, .m-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  })();

  /* ---- ayct27: darken the board-field once that chapter is in view ---- */
  (function ayct27Transition() {
    var target = document.getElementById('ayct27') || document.querySelector('.a27-hero');
    if (!target || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        document.body.classList.toggle('in-ayct27', entry.isIntersecting);
      });
    }, { threshold: 0.25 });
    io.observe(target);
  })();
})();