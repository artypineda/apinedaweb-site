// Art Pineda Web: the small bits of behavior the Next.js site had.

// Nav overlay and the About panel inside it.
const nav = document.querySelector('nav.navBar');
if (nav) {
    nav.querySelector('.navBtn').addEventListener('click', () => {
        nav.classList.toggle('open');
        if (!nav.classList.contains('open')) nav.classList.remove('about-open');
    });
    nav.querySelector('.isAbout').addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.toggle('about-open');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') nav.classList.remove('open', 'about-open');
    });
}

// Fade elements in as they scroll into view (stand-in for the AOS library).
const aosItems = document.querySelectorAll('[data-aos]');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-in');
                io.unobserve(entry.target);
            }
        }
    }, { rootMargin: '0px 0px -50px 0px' });
    aosItems.forEach((el) => io.observe(el));
} else {
    aosItems.forEach((el) => el.classList.add('aos-in'));
}

// Turn vertical mouse-wheel movement into horizontal scrolling on the
// project rows, like the original site.
document.querySelectorAll('[data-wheel-x]').forEach((row) => {
    row.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const max = row.scrollWidth - row.clientWidth;
        const atStart = row.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd = row.scrollLeft >= max - 1 && e.deltaY > 0;
        if (atStart || atEnd) return;
        e.preventDefault();
        row.scrollLeft += e.deltaY;
    }, { passive: false });
});

// Home page: client logos fade in and out at random spots.
document.querySelectorAll('.homelogosContainer .clientLogo').forEach((logo, i) => {
    const place = () => {
        logo.style.top = Math.random() * window.innerHeight + 'px';
        logo.style.left = Math.random() * window.innerWidth + 'px';
        logo.classList.add('visible');
    };
    setInterval(place, 5000 * (i + 1));
});

// Contact form: there's no server, so hand the message to the visitor's
// mail app with everything filled in.
const form = document.querySelector('.contactForm form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const subject = `Website inquiry from ${data.get('name')}`;
        const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
        window.location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}
