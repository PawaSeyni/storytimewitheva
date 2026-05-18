# Story Time with Eva — Independent Website

A fully independent React + Vite + TailwindCSS website for storytimewitheva.com.
This project is **not tied to any platform** and can be hosted anywhere.

## Tech Stack
- React 18 + TypeScript
- Vite 5 (build tool)
- TailwindCSS 3 (styling)
- React Router v6 (client-side routing)

## Getting Started
```bash
npm install       # Install dependencies
npm run dev       # Run dev server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
```

## Week 1 Improvements Implemented
1. Buy on Amazon buttons on every book card
2. Author bio section with photo placeholder on About page
3. Parent testimonials section on Homepage
4. Updated email signup: "Download the FREE 20-Page Bilingual Starter Kit"
5. Amazon CTA banner on Books page

## Updating Book Amazon Links
Edit `src/data/books.ts` and replace each `amazonUrl` with the real Amazon product URL.

## Deployment Options (all free)
- Vercel: `vercel deploy`
- Netlify: drag & drop the `dist/` folder
- GitHub Pages: push to `gh-pages` branch
- Cloudflare Pages: connect GitHub repository
