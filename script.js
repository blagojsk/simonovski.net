// Optimized with throttling for better performance
let scrollTimeout;

// Back to top button visibility with throttled scroll
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            const backToTopButton = document.getElementById('back-to-top');
            backToTopButton?.classList.toggle('show', window.pageYOffset > 300);

            // Update active navigation link
            updateActiveNavLink();

            scrollTimeout = null;
        }, 100);
    }
}, { passive: true });

// Active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.resume-section');
    const navLinks = document.querySelectorAll('.sticky-nav .nav-link');

    let currentSection = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 150) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${currentSection}`;
        link.classList.toggle('active', isActive);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Fade-in animation using Intersection Observer (optimal for performance)
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Unobserve after animation to free up resources
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe fade-in elements
document.querySelectorAll('.experience-item, .education-item').forEach(item => {
    fadeObserver.observe(item);
});
