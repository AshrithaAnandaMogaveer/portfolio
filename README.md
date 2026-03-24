# Ashritha A M — Portfolio

Personal portfolio website for Ashritha A M, AI & Data Science student and aspiring web developer.

## Features

- Fixed navbar with active section highlighting and mobile hamburger menu
- Hero section with gradient name, role, tagline, and social links
- About section with avatar, stats, and skill badges
- Education timeline with percentage scores
- Skills section with grouped cards
- Projects section with image cards and hover overlays
- Contact form with JS validation, powered by Formspree
- Scroll progress bar
- AOS scroll animations (respects `prefers-reduced-motion`)
- Project card 3D tilt effect
- Fully responsive — mobile-first

## Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, grid, flexbox, glassmorphism)
- Vanilla JavaScript (ES6+)
- [AOS](https://michalsnik.github.io/aos/) — scroll animations
- [Formspree](https://formspree.io/) — contact form backend
- [Google Fonts](https://fonts.google.com/) — Inter + Space Grotesk

## Setup

1. Clone or download the repository.
2. Open `index.html` in any modern browser — no build step required.

### Enable the Contact Form

1. Sign up at [formspree.io](https://formspree.io/).
2. Create a new form and copy your form ID (e.g. `xpwzabcd`).
3. In `index.html`, replace `YOUR_FORM_ID`:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

## Deployment

### GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/portfolio.git
git push -u origin main
```

Go to **Settings → Pages**, set source to `main` branch, save.

### Netlify

1. Push to GitHub (steps above).
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**.
3. Select your repo → **Deploy Site**.

Netlify auto-deploys on every push to `main`.
