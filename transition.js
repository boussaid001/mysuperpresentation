/* Smooth Slide Transition */
(function () {
    const veil = document.createElement('div');
    veil.id = 'page-veil';
    veil.style.cssText = 'position:fixed;inset:0;background:#f8fafc;z-index:9999;transform:translateX(100%);transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);';
    document.body.appendChild(veil);

    window.__playTransition = function (url) {
        if (document.body.classList.contains('transitioning')) return;
        document.body.classList.add('transitioning');

        veil.style.transform = 'translateX(0)';

        setTimeout(function () {
            window.location.href = url;
        }, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnter);
    } else {
        initEnter();
    }

    function initEnter() {
        veil.style.transform = 'translateX(-100%)';
    }
})();
