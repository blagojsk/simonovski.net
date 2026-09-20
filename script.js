(() => {
    const nav = document.getElementById('topnav');
    const toTop = document.getElementById('back-to-top');
    const links = [...document.querySelectorAll('.topnav-links a')];
    const sections = links
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    // Nav chrome + back-to-top, throttled to animation frames
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            nav.classList.toggle('is-stuck', y > 24);
            toTop.classList.toggle('show', y > 600);
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Active section highlighting
    const setActive = id => links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`));

    const sectionIO = new IntersectionObserver(entries => {
        // pick the topmost visible section
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => sectionIO.observe(s));

    // Scroll-in reveals
    const items = document.querySelectorAll(
        '.employer-head, .tl-item, .cert-row, .edu-item, .skill-row, .prose-lg'
    );
    items.forEach(el => el.classList.add('io'));
    const revealIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                revealIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => revealIO.observe(el));

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
