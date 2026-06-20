/* Shared Arrow Key Navigation + Cinematic Entrance */
(function () {
    const path = window.location.pathname;
    const match = path.match(/slide-(\d+)/);
    const current = match ? parseInt(match[1], 10) : 0;
    const isRoot = !match && (path.endsWith('index.html') || path.endsWith('/'));
    const total = 33;

    function slideUrl(n) {
        return `slide-${String(n).padStart(2, '0')}/index.html`;
    }

    function goToSlide(n) {
        if (n < 1 || n > total) return;
        const target = isRoot ? slideUrl(n) : `../${slideUrl(n)}`;

        // Trigger exit transition on forward navigation
        if (n > current && window.__playTransition) {
            window.__playTransition(target);
            return;
        }

        window.location.href = target;
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            goToSlide(current + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSlide(current - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(total);
        }
    });

    // Small SRTV logo on all slides except the cover (not on root index)
    if (match && current > 1) {
        const logo = document.createElement('img');
        logo.className = 'slide-logo';
        logo.src = '../assets/logosrtv.png';
        logo.alt = 'SRTV';
        document.body.appendChild(logo);
    }

    /* ── Cinematic Entrance on page load ── */
    (function entrance() {
        let direction = null;
        try { direction = sessionStorage.getItem('slideTransition'); } catch (e) {}
        if (!direction) return;

        // Clear the flag immediately
        try { sessionStorage.removeItem('slideTransition'); } catch (e) {}

        // Wrap body children in a content container for the entrance effect
        const wrapper = document.createElement('div');
        wrapper.className = 'enter-content';

        // Move all direct body children into the wrapper
        while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);

        // Create the dark veil
        const veil = document.createElement('div');
        veil.className = 'enter-veil';
        document.body.appendChild(veil);

        // Create sweep line
        const sweepLine = document.createElement('div');
        sweepLine.className = 'enter-sweep-line';
        document.body.appendChild(sweepLine);

        // Force reflow
        void document.body.offsetHeight;

        // Start entrance: content pushed toward viewer + blurry
        document.body.classList.add('enter-start');

        // Small delay then lift veil and sweep line
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                veil.classList.add('lifting');
                sweepLine.classList.add('active');

                // Settle content to normal
                document.body.classList.add('enter-done');

                // Cleanup after animation
                setTimeout(function () {
                    veil.remove();
                    sweepLine.remove();
                    document.body.classList.remove('enter-start', 'enter-done');
                    // Unwrap: move children back to body
                    while (wrapper.firstChild) {
                        document.body.appendChild(wrapper.firstChild);
                    }
                    wrapper.remove();
                }, 1200);
            });
        });
    })();
})();
