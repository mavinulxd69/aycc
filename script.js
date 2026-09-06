(function(){
  if (window.gsap) {
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
  }
  if (typeof window.Lenis === 'function' && !window.__appLenis) {
    var lenis = new window.Lenis();
    window.__appLenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function(time){ lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
})();

(function(){var t=document.querySelector('.nav-toggle');var l=document.getElementById('nav-links');if(!t||!l)return;function setOpen(o){t.setAttribute('aria-expanded',o?'true':'false');t.setAttribute('aria-label',o?'Close menu':'Open menu');t.textContent=o?'\u2715':'\u2630';l.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''}t.addEventListener('click',function(){setOpen(t.getAttribute('aria-expanded')!=='true')});l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false)})});window.addEventListener('resize',function(){if(window.innerWidth>768)setOpen(false)})})();

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