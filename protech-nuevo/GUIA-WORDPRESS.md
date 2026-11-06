# Sitio ProTech: cómo se arma y cómo subirlo a WordPress

## Estructura
- `src/`: la fuente. Aquí se edita.
  - `pages/*.html`: una por página, con su URL, título SEO y descripción.
  - `header.html` / `footer.html`: menú con submenús y pie (comunes a todas).
  - `base.css`, `site.js`: estilos y comportamiento (WhatsApp, pestañas, menú móvil).
  - Los precios están en `build.py` (`PLANS`): cámbialos ahí y se actualizan en todas las páginas.
- `python3 build.py` genera:
  - `wordpress/`: un bloque por página, listo para pegar, más `_cabecera.html` y `_pie.html`.
  - `wordpress/PAGINAS.md`: tabla con la URL, el título y la descripción SEO de cada página.
  - `vista-previa.html`: todo el sitio en un archivo para revisarlo.

## Menú
Productos (ZWCAD, ZW3D CAD/CAM, Todos los productos) · Soporte (Centro de descargas, Soporte técnico,
Preguntas frecuentes) · Precios y Comprar · Partners (Programa de Partners, Localizador de Resellers) ·
Nosotros · Contacto. Se conservan las URLs del sitio anterior (`/product/zwcad/`, `/descarga/`, etc.).

## Subirlo a WordPress (manual; con la conexión por API lo hace Claude)
1. Tema **Astra** (gratis). Sube la carpeta `img/` a `/wp-content/uploads/protech/` con el Administrador
   de archivos de SiteGround.
2. Apariencia → Patrones → crea dos **patrones sincronizados**: "Cabecera ProTech" (bloque HTML con
   `_cabecera.html`) y "Pie ProTech" (`_pie.html`). Al editarlos una vez, cambian en todas las páginas.
3. Por cada fila de `PAGINAS.md`: Páginas → Añadir → título y slug de la tabla → patrón Cabecera →
   bloque HTML personalizado con `wordpress/<pagina>.html` → patrón Pie. En la configuración de Astra
   de la página: desactivar título, cabecera y pie del tema, y elegir el diseño "Ancho completo / sin contenedor".
4. Ajustes → Lectura → página de inicio estática: "Inicio". Desmarca "Disuadir a los motores de búsqueda".
5. Rank Math o Yoast: copia el título y la descripción de `PAGINAS.md` en cada página.
6. Google Search Console: da de alta el sitio y envía `/sitemap_index.xml`.
7. Al final, en GoDaddy cambia **solo el registro A** a la IP de SiteGround. No toques los MX.

## Medición
Los botones de WhatsApp envían `whatsapp_click` y los formularios `generate_lead` (GA4), además de `Contact`
y `Lead` (Meta Pixel), si esas etiquetas están instaladas.
