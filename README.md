# Tate Gillen — Personal Portfolio

A responsive, static personal portfolio built with HTML, CSS, and JavaScript. It can be opened directly in a browser or deployed to Netlify without a build step.

## Preview locally

Open `index.html` in any modern browser. No installation or local server is required.

## Deploy to Netlify

1. Sign in to Netlify.
2. Drag this project folder into Netlify's manual deploy area, or connect the Git repository.
3. If prompted for settings, leave the build command empty and set the publish directory to `.` (the repository root).

## Customize links

Search the site for these placeholders and replace them before launch:

- Production metadata uses `https://tategillen.netlify.app`
- Replace `assets/tate-gillen-resume.pdf` whenever the resume is updated; the site opens it in a new browser tab
- Project cards and case studies use lightweight conceptual HTML/CSS illustrations, with inline SVG where useful. They do not depend on screenshot files or image galleries.
- `assets/favicon-placeholder.svg` and `assets/og-image-placeholder.svg` with final brand assets
- Replace `REPLACE_WITH_SPLINE_SCENE_URL` in `script.js` with the Viewer URL exported by Spline. The static network graphic remains active until then.

Each project uses a unique placeholder suffix so every link can be updated independently. HTML comments mark all replacement locations.

## Files

- `index.html` — page content and structure
- `styles.css` — layout, visual design, responsive styles, and motion preferences
- `script.js` — accessible mobile navigation, workflow interaction, form success handling, and GSAP animations
- Four project `.html` files — individual static case studies
- `404.html` — custom Netlify not-found page
- `assets/` — screenshot, favicon, and social-sharing placeholders

The site uses Google Fonts, GSAP/ScrollTrigger, and Lenis CDNs when an internet connection is available. The official Spline viewer is lazy-loaded only after a real scene URL is added. System fonts, native scrolling, visible content, and a static network graphic keep the site usable when JavaScript or a CDN is unavailable. Netlify detects the contact form from the static HTML automatically after deployment.
