/* ── SRTV Navigation + Progress Bar ── */
(function () {
    'use strict';

    const path    = window.location.pathname;
    const match   = path.match(/slide-(\d+)/);
    const current = match ? parseInt(match[1], 10) : 0;
    const isRoot  = !match && (path.endsWith('index.html') || path.endsWith('/'));
    const total   = 34;

    function slideUrl(n) {
        return `slide-${String(n).padStart(2, '0')}/index.html`;
    }

    function goToSlide(n) {
        if (n < 1 || n > total) return;
        const direction = n > current ? 'forward' : 'back';
        const target = isRoot ? slideUrl(n) : `../${slideUrl(n)}`;
        if (window.__playTransition) {
            window.__playTransition(target, direction);
        } else {
            window.location.href = target;
        }
    }

    /* ── Keyboard navigation ── */
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault(); goToSlide(current + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault(); goToSlide(current - 1);
        } else if (e.key === 'Home') {
            e.preventDefault(); goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault(); goToSlide(total);
        }
    });

    /* ── Touch / swipe navigation ── */
    let touchStartX = 0;
    document.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', function (e) {
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 60) { dx > 0 ? goToSlide(current + 1) : goToSlide(current - 1); }
    }, { passive: true });

    /* ── SRTV logo (all slides except cover) ── */
    if (match && current > 1) {
        const logo = document.createElement('img');
        logo.className = 'slide-logo';
        logo.src = '../assets/logosrtv.png';
        logo.alt = 'SRTV';
        document.body.appendChild(logo);
    }

    /* ── Progress bar ── */
    if (match && current >= 1) {
        const bar = document.createElement('div');
        bar.id = 'srtv-progress';
        bar.style.cssText = [
            'position:fixed;bottom:0;left:0;height:3px;z-index:9000;',
            'background:linear-gradient(90deg,#0077cc,#6366f1,#10b981);',
            'border-radius:0 3px 3px 0;',
            'transition:width 0.6s cubic-bezier(0.22,1,0.36,1);',
            'opacity:0;'
        ].join('');
        document.body.appendChild(bar);

        /* Animate in after a short delay */
        setTimeout(function () {
            bar.style.opacity = '1';
            bar.style.width = ((current / total) * 100) + '%';
        }, 400);
    }

    /* ── Nav counter: replace "02 / 34" format with styled version ── */
    document.addEventListener('DOMContentLoaded', function () {
        const navEl = document.querySelector('.nav-year');
        if (!navEl || !match) return;
        navEl.innerHTML = `<span class="nav-current">${current}</span><span class="nav-sep"> / </span><span class="nav-total">${total}</span>`;
    });
})();
