# Tech Spec — Ahuja's Atelier Website

## Implementation Approach

The user requires **pure HTML + CSS + Vanilla JavaScript** — no frameworks, no React, no npm, no build step. The site runs by opening `index.html` directly in a browser.

Given this constraint, the design's Three.js/R3F spiral gallery and GSAP-driven sticky card stack are **adapted** as follows:

### Section: The Collection (Sticky Cards Stack)
**Adaptation**: Instead of GSAP + ScrollTrigger (which would require external GSAP/CDN), implement using **CSS position: sticky** + **Vanilla JS IntersectionObserver** for scroll-driven card reveals. Cards slide up with CSS transitions triggered by scroll position. The fanned offset layout uses CSS transforms. Scroll velocity jitter is implemented via a lightweight scroll listener.

### Section: The Gallery (Infinite Spiral)
**Adaptation**: Instead of a full Three.js WebGL spiral (which would require Three.js, React Three Fiber, Lenis, shaders), implement a **CSS 3D perspective gallery** with scroll-driven navigation. Images are arranged in a cylindrical/perspective tunnel using CSS `transform-style: preserve-3d` and `perspective`. Scroll moves through the tunnel with smooth CSS transitions. This achieves a similar immersive feel without the heavy WebGL dependency.

### Typography Animation
**Adaptation**: The blur-reveal effect is implemented with pure CSS transitions + JS class toggling. Words are wrapped in spans, CSS `filter: blur()` and `opacity` animate on class add. No GSAP needed.

## File Structure

```
/mnt/agents/output/app/
├── index.html          # Single HTML file with all sections
├── style.css           # All styles (or embedded in HTML)
├── script.js           # All interactions (or embedded in HTML)
├── images/
│   ├── product-1.jpg
│   ├── product-2.jpg
│   ├── product-3.jpg
│   ├── product-4.jpg
│   ├── product-5.jpg
│   ├── product-6.jpg
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   └── gallery-4.jpg
└── README.txt
```

## Dependencies (CDN only)

- **Google Fonts**: Playfair Display (400, 500, 600), Inter (300, 400, 500), JetBrains Mono (400)
- **Font Awesome 6** (CDN): For icons (phone, email, map pin, social icons, WhatsApp)

No other external dependencies. No npm packages.

## Core Implementation Details

### Navigation
- Fixed position, scroll-aware background transition (JS scroll listener)
- Mobile: fullscreen overlay with CSS transitions
- Scroll spy via IntersectionObserver on each section

### Hero Section
- Full viewport, centered content
- Blur-reveal typography: JS splits headline into word spans, adds staggered transition-delay
- Page load sequence: CSS keyframe animations for entrance

### Our Craft Section
- CSS Grid (3 columns desktop, 1 mobile)
- Card hover: CSS transform + box-shadow transition
- Scroll-triggered reveal: IntersectionObserver + CSS transition

### The Collection (Sticky Cards)
- Tall outer container creates scroll distance
- Sticky inner container (position: sticky, top: 0, height: 100vh)
- 6 cards with absolute positioning and CSS variable offsets
- JS scroll listener calculates progress, applies transform to each card
- Cards slide from below (translateY) to stacked positions

### The Gallery (CSS 3D Perspective)
- Container with perspective: 1000px
- Images positioned in 3D space with translateZ
- Scroll drives a CSS custom property that moves images along Z-axis
- Opacity fade for distant items

### Heritage Section
- CSS Grid split layout (55/45)
- Pull quote with oversized quotation mark

### Testimonials
- CSS Grid (3 columns)
- Star ratings: Unicode characters styled in gold
- Staggered scroll reveal

### Contact Section
- Two-column grid layout
- Form validation: vanilla JS
- Success message toggle
- Google Maps iframe embed

### Footer
- Flexbox layout
- Mobile: stacked center-aligned

### Floating WhatsApp Button
- Fixed position, bottom-right
- CSS hover animation

### Global Interactions
- Smooth scroll: CSS `scroll-behavior: smooth`
- Scroll reveals: IntersectionObserver at threshold 0.15
- Nav scroll spy: IntersectionObserver on sections
- Reduced motion: `prefers-reduced-motion` media query

## Performance Considerations
- Images: lazy loading with `loading="lazy"`
- Fonts: `display=swap` for fast initial render
- CSS: single file, no framework overhead
- JS: minimal vanilla code, no libraries
- Mobile-first responsive design
