# TablóStúdió Landing Page

Modern landing page a TablóStúdió SaaS platformhoz.

## Tech Stack

- HTML5
- Tailwind CSS
- AOS (Animate On Scroll)
- GSAP (opcionális, extra animációkhoz)

## Fejlesztés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása (hot reload)
npm run dev

# Production build
npm run build
```

## Struktúra

```
landing/
├── dist/                 # Build output (ezt serveli a webszerver)
│   ├── index.html        # Fő HTML
│   ├── styles.css        # Compiled Tailwind CSS
│   └── assets/
│       ├── images/       # Képek
│       └── icons/        # Ikonok, favicon
├── src/
│   └── styles.css        # Tailwind source
├── package.json
├── tailwind.config.js
└── README.md
```

## Deployment

A `dist/` mappa tartalma megy a szerverre. Nginx konfig:

```nginx
location / {
    root /path/to/landing/dist;
    try_files $uri $uri/ /index.html;
}
```

## Referencia

- Stílus: tablokiraly.hu
- Angular app: tablostudio.hu/login
