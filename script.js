// Tate Gillen portfolio interactions. All visual content is visible without JavaScript.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    const label = navToggle.querySelector('.sr-only');
    if (label) label.textContent = 'Open navigation menu';
  };

  navToggle.addEventListener('click', () => {
    const opening = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(opening));
    navLinks.classList.toggle('open', opening);
    const label = navToggle.querySelector('.sr-only');
    if (label) label.textContent = opening ? 'Close navigation menu' : 'Open navigation menu';
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });
}

// Sticky-header state and active homepage section indicator.
const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const sectionLinks = document.querySelectorAll('[data-section-link]');
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const observedSections = [...sectionLinks]
    .map((link) => document.getElementById(link.dataset.sectionLink))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.dataset.sectionLink === entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Interactive "How I Build" tabs with arrow-key navigation.
const workflowTabs = [...document.querySelectorAll('.workflow-stage')];
const workflowPanel = document.querySelector('.workflow-panel');

function selectWorkflowTab(tab) {
  if (!workflowPanel || !tab) return;
  workflowTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  workflowPanel.setAttribute('aria-labelledby', tab.id);
  const title = workflowPanel.querySelector('h3');
  const copy = workflowPanel.querySelector('p:last-child');
  if (title) title.textContent = tab.dataset.title;
  if (copy) copy.textContent = tab.dataset.copy;
}

workflowTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWorkflowTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % workflowTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + workflowTabs.length) % workflowTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = workflowTabs.length - 1;
    selectWorkflowTab(workflowTabs[nextIndex]);
    workflowTabs[nextIndex].focus();
  });
});

// Netlify form success state.
const successMessage = document.querySelector('.form-success');
if (successMessage && new URLSearchParams(window.location.search).get('success') === 'true') {
  successMessage.hidden = false;
  successMessage.focus();
  try { window.history.replaceState({}, '', `${window.location.pathname}#contact`); } catch (error) { /* file:// preview can restrict history changes */ }
}

// Cursor-responsive hero lighting with interpolated movement.
const hero = document.querySelector('.hero');
if (hero && finePointer && !reduceMotion) {
  let targetX = 70;
  let targetY = 42;
  let currentX = targetX;
  let currentY = targetY;
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width) * 100;
    targetY = ((event.clientY - bounds.top) / bounds.height) * 100;
  }, { passive: true });
  const moveGlow = () => {
    currentX += (targetX - currentX) * .065;
    currentY += (targetY - currentY) * .065;
    hero.style.setProperty('--glow-x', `${currentX}%`);
    hero.style.setProperty('--glow-y', `${currentY}%`);
    requestAnimationFrame(moveGlow);
  };
  requestAnimationFrame(moveGlow);
}

// Restrained card tilt for fine pointers only. Links remain regular clickable elements.
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 2.2;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -2.2;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Official Spline Viewer. It is not downloaded until a real scene URL is supplied and visible.
// REPLACE_WITH_SPLINE_SCENE_URL: paste the Viewer export URL from Spline here.
const SPLINE_SCENE_URL = 'REPLACE_WITH_SPLINE_SCENE_URL';
const splineHost = document.querySelector('.spline-host');
const heroVisual = document.querySelector('.hero-visual');

function loadSplineScene() {
  if (!splineHost || !heroVisual || SPLINE_SCENE_URL === 'REPLACE_WITH_SPLINE_SCENE_URL' || !finePointer || reduceMotion) return;
  const loader = document.createElement('script');
  loader.type = 'module';
  loader.src = 'https://unpkg.com/@splinetool/viewer@1.10.94/build/spline-viewer.js';
  loader.addEventListener('error', () => console.error('[Spline] Viewer failed to load. The static network fallback remains active.'), { once: true });
  loader.addEventListener('load', async () => {
    await customElements.whenDefined('spline-viewer');
    const viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', SPLINE_SCENE_URL);
    viewer.setAttribute('loading', 'lazy');
    viewer.addEventListener('load', () => {
      heroVisual.classList.add('spline-ready');
      window.ScrollTrigger?.refresh();
    }, { once: true });
    splineHost.appendChild(viewer);
  }, { once: true });
  document.head.appendChild(loader);
}

if (splineHost && SPLINE_SCENE_URL !== 'REPLACE_WITH_SPLINE_SCENE_URL') {
  if ('IntersectionObserver' in window) {
    const splineObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadSplineScene();
        observer.disconnect();
      }
    }, { rootMargin: '150px' });
    splineObserver.observe(splineHost);
  } else loadSplineScene();
}

// GSAP, ScrollTrigger, and Lenis. Each has a native fallback.
const gsapLoaded = typeof window.gsap !== 'undefined';
const scrollTriggerLoaded = typeof window.ScrollTrigger !== 'undefined';
const lenisLoaded = typeof window.Lenis !== 'undefined';
const motionPage = document.querySelector('.hero, .case-hero');
if (motionPage && !gsapLoaded) console.error('[Portfolio] GSAP 3.13.0 failed to load; content remains visible.');
if (motionPage && gsapLoaded && !scrollTriggerLoaded) console.error('[Portfolio] ScrollTrigger 3.13.0 failed to load; content remains visible.');
if (motionPage && !lenisLoaded) console.error('[Portfolio] Lenis failed to load; native scrolling remains active.');

if (gsapLoaded && scrollTriggerLoaded) gsap.registerPlugin(ScrollTrigger);

let lenis = null;
if (!reduceMotion && finePointer && lenisLoaded && gsapLoaded && scrollTriggerLoaded) {
  try {
    lenis = new Lenis({ lerp: .12, smoothWheel: true, syncTouch: false, anchors: { offset: -70 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch (error) {
    lenis = null;
    console.error('[Portfolio] Lenis initialization failed; native scrolling remains active.', error);
  }
}

if (!reduceMotion && gsapLoaded && scrollTriggerLoaded) {
  try {
    const clear = 'transform,opacity';
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: clear } });
    const heroEyebrow = document.querySelector('.hero .eyebrow');
    const heroHeading = document.querySelector('.hero h1');
    const heroStatement = document.querySelector('.hero-headline');
    const heroCopy = document.querySelector('.hero-copy');
    const heroButtons = document.querySelectorAll('.hero .button-group .button');
    if (heroEyebrow) heroTimeline.from(heroEyebrow, { opacity: 0, y: 14, duration: .45 });
    if (heroHeading) heroTimeline.from(heroHeading, { opacity: 0, y: 35, duration: .8 }, '-=.2');
    if (heroStatement) heroTimeline.from(heroStatement, { opacity: 0, y: 18, duration: .55 }, '-=.42');
    if (heroCopy) heroTimeline.from(heroCopy, { opacity: 0, y: 13, duration: .45 }, '-=.3');
    if (heroButtons.length) heroTimeline.from(heroButtons, { opacity: 0, y: 11, duration: .4, stagger: .07 }, '-=.25');
    if (heroVisual) heroTimeline.from(heroVisual, { opacity: 0, scale: .94, duration: .85 }, '-=.8');

    const aboutHeading = document.querySelector('.about-heading');
    const aboutCopy = document.querySelector('.about-copy');
    const principles = document.querySelectorAll('.about-details > div');
    if (aboutHeading) gsap.from(aboutHeading, { scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }, opacity: 0, x: -24, duration: .65, ease: 'power2.out', clearProps: clear });
    if (aboutCopy) gsap.from(aboutCopy, { scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }, opacity: 0, x: 24, duration: .65, ease: 'power2.out', clearProps: clear });
    const underline = document.querySelector('.heading-underline');
    if (underline) gsap.from(underline, { scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }, scaleX: 0, duration: .65, delay: .25, ease: 'power2.out', clearProps: 'transform' });
    if (principles.length) gsap.from(principles, { scrollTrigger: { trigger: '.about-details', start: 'top 88%', once: true }, opacity: 0, y: 14, duration: .45, stagger: .08, ease: 'power2.out', clearProps: clear });

    gsap.utils.toArray('.section-heading').forEach((heading) => gsap.from(heading, { scrollTrigger: { trigger: heading, start: 'top 86%', once: true }, opacity: 0, y: 19, duration: .6, ease: 'power2.out', clearProps: clear }));
    ScrollTrigger.batch('.project-card', { start: 'top 88%', once: true, onEnter: (cards) => gsap.from(cards, { opacity: 0, y: 26, duration: .6, stagger: .11, ease: 'power2.out', clearProps: clear }) });
    document.querySelectorAll('.project-card').forEach((card) => {
      const image = card.querySelector('.project-image');
      const tags = card.querySelectorAll('.tag-list li');
      if (image) gsap.fromTo(image, { y: 7 }, { y: -5, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      if (tags.length) gsap.from(tags, { scrollTrigger: { trigger: card, start: 'top 82%', once: true }, opacity: 0, y: 8, duration: .35, stagger: .04, delay: .18, clearProps: clear });
    });
    if (workflowTabs.length) gsap.from(workflowTabs, { scrollTrigger: { trigger: '.workflow', start: 'top 85%', once: true }, opacity: 0, y: 12, duration: .45, stagger: .06, clearProps: clear });
    const caseWorkflowSteps = document.querySelectorAll('.system-workflow > li');
    if (caseWorkflowSteps.length) gsap.from(caseWorkflowSteps, { scrollTrigger: { trigger: '.system-workflow', start: 'top 86%', once: true }, opacity: 0, y: 16, duration: .48, stagger: .09, ease: 'power2.out', clearProps: clear });
    const skillItems = document.querySelectorAll('.skills-list li');
    if (skillItems.length) gsap.from(skillItems, { scrollTrigger: { trigger: '.skills-list', start: 'top 86%', once: true }, opacity: 0, x: -10, duration: .4, stagger: .055, clearProps: clear });
    const contactBanner = document.querySelector('.project-contact-banner');
    if (contactBanner) gsap.from(contactBanner, { scrollTrigger: { trigger: contactBanner, start: 'top 90%', once: true }, opacity: 0, y: 18, duration: .6, clearProps: clear });
    const contactSection = document.querySelector('.contact-layout');
    if (contactSection) gsap.from(contactSection, { scrollTrigger: { trigger: contactSection, start: 'top 86%', once: true }, opacity: 0, y: 18, duration: .6, clearProps: clear });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
  } catch (error) {
    console.error('[Portfolio] Animation setup failed; content remains visible.', error);
  }
}
