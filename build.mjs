// Generates the site's HTML pages from data/ (projects.json, about.json).
// No dependencies: `node build.mjs`, then commit the result.
//
// GitHub Pages serves this repo's root as-is, so the generated pages sit
// next to the hand-written files (site.css, site.js, imgs/, apw/).

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT = '.';
const SITE_URL = 'https://www.apinedaweb.com';
const CONTACT_EMAIL = 'art@apinedaweb.com';

const projects = JSON.parse(readFileSync('data/projects.json', 'utf8'));
const about = JSON.parse(readFileSync('data/about.json', 'utf8'));

const esc = (s = '') =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clientLogos = [
    ['sunmaid.png', 'SunMaid Raisins'],
    ['aims-logo.png', 'Aims Center for Math and Science'],
    ['chukchansi-logo.png', 'Chukchansi Gold Resort and Casino'],
    ['hope_500.png', 'Hope Animal Foundation'],
    ['calviva.png', 'CalViva Health Services'],
    ['blastbrew.png', 'Blast and Brew'],
    ['MironCrosby.png', 'Miron Crosby'],
    ['wellhung.png', 'Wellhung Vineyards'],
];

function nav(active) {
    const cls = (name) => (active === name ? ' class="active"' : '');
    return `
<nav class="navBar">
    <button class="navBtn" aria-label="Menu">
        <img class="closed-icon" src="/imgs/burger.svg" alt="Open navigation" width="35" height="35">
        <img class="open-icon" src="/imgs/burger_open.svg" alt="Close navigation" width="35" height="35">
    </button>
    <div class="navPage">
        <div class="left">
            <div class="topLogo scaleIn">
                <a href="/"><img src="/imgs/alogo_whole_ol_w.svg" alt="Art Pineda | Web Application Development"></a>
            </div>
            <div class="content">
                <div class="inner">
                    <div class="aboutContent aboutCard">
                        <span>${esc(about.experience)}</span>
                        <span><strong>Prototyping:</strong> ${esc(about.prototyping)}</span>
                        <span><strong>Modern Web Development:</strong> ${esc(about.stacks)}</span>
                        <span><strong>Frameworking:</strong> ${esc(about.frameworking)}</span>
                        <span><strong>Content Management Systems:</strong> ${esc(about.cms)}</span>
                        <span><strong>Deployment:</strong> ${esc(about.deployment)}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <ul>
                <li><a href="/projects/"${cls('projects')}>Projects</a></li>
                <li class="about-item"><a href="#about" class="isAbout"><span class="about-label-open">About</span><span class="about-label-close">Close About</span></a></li>
                <li><a href="/contact/"${cls('contact')}>Contact</a></li>
            </ul>
        </div>
    </div>
</nav>`;
}

function page({ title, description, path, active, body, bodyClass = '' }) {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE_URL}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${nav(active)}
${body}
<script src="/site.js" defer></script>
</body>
</html>
`;
}

function write(path, html) {
    const file = join(OUT, path, path.endsWith('.html') ? '' : 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
}

// Clear out previously generated pages (only these; everything else in the
// repo root is hand-written).
for (const generated of ['index.html', '404.html', 'projects', 'contact']) {
    rmSync(join(OUT, generated), { recursive: true, force: true });
}

// Home
write('/', page({
    title: 'Art Pineda Web',
    description: 'Next-Level Website Design and Development',
    path: '/',
    bodyClass: 'home',
    body: `
<main>
    <div class="homelogosContainer" aria-hidden="true">
        ${clientLogos.map(([file, alt]) => `<span class="clientLogo"><img src="/imgs/clients/${file}" alt="${esc(alt)}"></span>`).join('\n        ')}
    </div>
    <div class="contain">
        <div class="mainlogoContainer">
            <a href="/projects/" class="mainlogo" data-aos="fade-up">
                <img src="/imgs/alogo_whole_ol_g0.svg" alt="Art Pineda | Web Application Development">
                <div class="sigOnly"><img src="/imgs/alogo_whole_ol.svg" alt=""></div>
            </a>
        </div>
    </div>
</main>`,
}));

// Projects list
write('/projects/', page({
    title: 'Art Pineda Web | Projects',
    description: 'Next-Level Website Design and Development Projects Page',
    path: '/projects/',
    active: 'projects',
    body: `
<main class="projects-page">
    <div class="notification" aria-hidden="true">
        <img src="/imgs/hand1.svg" alt="">
        <span>Scroll down to scroll right</span>
    </div>
    <div class="split_top">
        <div class="theLogo scaleIn" data-aos="fade-in">
            <a href="/"><img src="/imgs/alogo_whole_ol.svg" alt="Art Pineda | Web Application Development"></a>
        </div>
    </div>
    <ul class="projects_container" data-wheel-x>
        ${projects.map((p, i) => `
        <li class="projectBG" data-aos="fade-left">
            ${p.logo_url ? `<div class="logo_contain"><a href="/projects/${esc(p.slug)}/"><img src="${esc(p.logo_url)}" alt="${esc(p.title)}"${i > 2 ? ' loading="lazy"' : ''}></a></div>` : ''}
            <div class="backgroundImg"><img src="${esc(p.cover_url)}" alt=""${i > 2 ? ' loading="lazy"' : ''}></div>
            <div class="tools"><p>${esc(p.tools)}</p></div>
        </li>`).join('')}
    </ul>
</main>`,
}));

// One page per project
for (const p of projects) {
    write(`/projects/${p.slug}/`, page({
        title: `${p.title} | Art Pineda Web`,
        description: `${p.title}: ${p.tools}`,
        path: `/projects/${p.slug}/`,
        active: 'projects',
        body: `
<main class="split">
    <div class="left" data-aos="fade-right">
        <a href="/" class="logo-link scaleIn"><img src="/imgs/alogo_whole_ol.svg" alt="Art Pineda | Web Application Development"></a>
        <div class="information">
            <div class="content">
                <h1 class="visually-hidden">${esc(p.title)}</h1>
                <div class="product-des">${p.description}</div>
            </div>
        </div>
        <div class="goBack"><a href="/projects/">Back to Projects</a></div>
    </div>
    <div class="right">
        <div class="right_top"><p>${esc(p.tools)}</p></div>
        <div class="right_inner">
            <ul class="gallery" data-wheel-x>
                ${p.media.map((m, i) => `<li data-aos="fade-left"><img src="${esc(m.image_url)}" alt="${esc(m.image_alt)}"${i > 1 ? ' loading="lazy"' : ''}></li>`).join('\n                ')}
            </ul>
            <div class="website">
                ${p.website ? `<a href="${esc(p.website)}" target="_blank" rel="noopener">View Website</a>` : '<span></span>'}
                <div class="code">${p.github_url
                    ? `<a href="${esc(p.github_url)}" target="_blank" rel="noopener">Code <img src="/imgs/github.svg" alt=""></a>`
                    : `<a>Private <img src="/imgs/github.svg" alt=""></a>`}</div>
            </div>
        </div>
    </div>
</main>`,
    }));
}

// Contact
write('/contact/', page({
    title: 'Art Pineda Web | Contact',
    description: 'Next-Level Website Design and Development Contact Page',
    path: '/contact/',
    active: 'contact',
    bodyClass: 'contact',
    body: `
<main class="split">
    <div class="left" data-aos="fade-right">
        <a href="/" class="logo-link scaleIn"><img src="/imgs/alogo_whole_ol_w.svg" alt="Art Pineda | Web Application Development"></a>
        <div class="information">
            <div class="contactForm">
                <form data-to="${CONTACT_EMAIL}">
                    <div class="topForms">
                        <label for="name">Full Name</label>
                        <input id="name" name="name" type="text" placeholder="Full Name" required>
                        <label for="email">Email Address</label>
                        <input id="email" name="email" type="email" placeholder="email@mail.com" required>
                    </div>
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="4" placeholder="Type your message" required></textarea>
                    <button class="submit">Submit</button>
                </form>
            </div>
        </div>
    </div>
    <div class="right">
        <div class="intro">
            <h2>Full-Service Design / Development</h2>
            <p>Need to get a hold of us? Please use the form provided</p>
            <div class="dots"></div>
        </div>
    </div>
</main>`,
}));

// 404 (GitHub Pages serves /404.html for unknown paths)
write('/404.html', page({
    title: 'Page Not Found | Art Pineda Web',
    description: 'Page not found',
    path: '/404.html',
    body: `
<main class="not_found">
    <img src="/imgs/alogo_whole_ol_g0.svg" alt="Art Pineda | Web Application Development">
    <h2>Shucks, page was not found</h2>
    <a href="/projects/">View Projects</a>
</main>`,
}));

console.log(`Built ${projects.length + 4} pages`);
