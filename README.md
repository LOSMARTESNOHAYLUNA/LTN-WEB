# Lidera tu Negocio — Web Corporativa

Sitio web estático de [lideratunegocio.com](https://lideratunegocio.com) — desplegado en Vercel.

---

## Estructura del proyecto

```
lideratunegocio.com/
│
├── index.html                  → Home
├── servicios/index.html        → Servicios detallados
├── precios/index.html          → Precios y paquetes
├── casos/index.html            → Casos de éxito
├── ia-tools/index.html         → IA Tools y apps a medida
├── nosotras/index.html         → Carla y Sheila
├── auditoria/index.html        → Landing auditoría gratuita
├── aviso-legal/index.html      → Aviso legal
├── privacidad/index.html       → Política de privacidad
├── cookies/index.html          → Política de cookies
├── gracias/index.html          → Página de confirmación (post-formulario)
│
├── img/
│   ├── team/
│   │   ├── carla-vallejos-lidera-tu-negocio.jpg   (foto Carla — mín. 800×1067px)
│   │   └── sheila-aguilar-lidera-tu-negocio.jpg   (foto Sheila — mín. 800×1067px)
│   ├── casos/
│   │   └── medioambiente-castro-caso-real.jpg     (imagen caso — mín. 1200×800px)
│   ├── og/
│   │   ├── og-home.jpg          (1200×630px)
│   │   ├── og-servicios.jpg     (1200×630px)
│   │   ├── og-precios.jpg       (1200×630px)
│   │   ├── og-casos.jpg         (1200×630px)
│   │   ├── og-ia-tools.jpg      (1200×630px)
│   │   ├── og-nosotras.jpg      (1200×630px)
│   │   └── og-auditoria.jpg     (1200×630px)
│   └── icons/
│       └── (iconos SVG si se añaden)
│
├── favicon.svg
├── favicon-32.png
├── favicon-180.png
├── site.webmanifest
│
├── robots.txt
├── sitemap.xml
├── sitemap-pages.xml
├── sitemap-posts.xml
│
├── vercel.json
└── README.md
```

---

## Imágenes pendientes de subir

Antes del primer despliegue, añadir en `img/`:

| Archivo | Tamaño mínimo | Descripción |
|---|---|---|
| `team/carla-vallejos-lidera-tu-negocio.jpg` | 800×1067px | Foto de Carla |
| `team/sheila-aguilar-lidera-tu-negocio.jpg` | 800×1067px | Foto de Sheila |
| `casos/medioambiente-castro-caso-real.jpg` | 1200×800px | Imagen del caso |
| `og/og-home.jpg` | 1200×630px | OG para la home |
| `og/og-nosotras.jpg` | 1200×630px | OG para Nosotras |
| `favicon.svg` | — | Logo en SVG |
| `favicon-32.png` | 32×32px | Favicon navegador |
| `favicon-180.png` | 180×180px | Apple Touch Icon |

---

## Despliegue en Vercel

1. Conectar este repositorio en [vercel.com](https://vercel.com)
2. Framework: **Other** (HTML estático)
3. Build command: *(vacío)*
4. Output directory: `.` (raíz)
5. En **Settings → Domains**: añadir `lideratunegocio.com` y configurar `www` como redirect 301 al dominio sin www

---

## DNS en Raiola Networks

Añadir en el panel de Raiola:

```
Tipo    Nombre    Valor
A       @         76.76.21.21
CNAME   www       cname.vercel-dns.com
```

---

## Páginas por construir

- [ ] `servicios/index.html`
- [ ] `casos/index.html`
- [ ] `ia-tools/index.html`
- [ ] `auditoria/index.html`
- [ ] `aviso-legal/index.html`
- [ ] `privacidad/index.html`
- [ ] `cookies/index.html`
- [ ] `gracias/index.html`

## Páginas completadas

- [x] `index.html` — Home
- [x] `precios/index.html` — Precios
- [x] `nosotras/index.html` — Nosotras

---

## Notas técnicas

- Sin frameworks ni dependencias de npm — HTML, CSS y JS vanilla
- Fuentes: Google Fonts (Outfit + DM Sans)
- Cookies: banner RGPD con localStorage, sin librerías externas
- Animaciones: IntersectionObserver nativo
- Responsive: breakpoints en 900px y 480px
