# Cómo subir la nueva página de inicio a WordPress

## 1. Hosting y WordPress
Contrata un hosting con WordPress (Hostinger, SiteGround o GoDaddy) e instala WordPress con un tema ligero: Astra o Hello Elementor (gratis).

## 2. Imágenes
Sube los archivos de `img/` a Medios (Medios → Añadir nuevo). Copia la URL de cada uno.

## 3. Página
1. Páginas → Añadir nueva → título "Inicio".
2. Plantilla: "Ancho completo / Sin título" (en Astra: Ajustes de Astra → Diseño sin contenedor y desactiva el título).
3. Agrega un bloque **HTML personalizado** y pega TODO lo que está entre
   `INICIO BLOQUE PROTECH` y `FIN BLOQUE PROTECH` en `index.html`.
4. Reemplaza cada `img/nombre.webp` por la URL que copiaste en el paso 2.
5. Ajustes → Lectura → "Tu página de inicio muestra": página estática → Inicio.

## 4. SEO (lo que la agencia no hizo)
- Ajustes → Lectura → **desmarcar** "Disuadir a los motores de búsqueda".
- Instala Rank Math o Yoast y pon:
  - Título: `ZWCAD y ZW3D en México | Licencia Perpetua desde $17,980 MXN | ProTech`
  - Descripción: `ProTech, distribuidor exclusivo de ZWSOFT en México. ZWCAD (compatible con DWG) y ZW3D CAD/CAM con licencia perpetua, sin suscripción. Prueba gratis 30 días y soporte local.`
- Da de alta el sitio en Google Search Console y envía `/sitemap_index.xml`.

## 5. Cambiar el dominio (al final)
En GoDaddy → DNS, cambia SOLO el registro **A** a la IP del hosting nuevo.
No toques los registros MX (correo).

## Medición
Los botones de WhatsApp y el formulario ya envían eventos `whatsapp_click` y `generate_lead` (Google Analytics 4) y `Contact` y `Lead` (Meta Pixel), si instalas esas etiquetas con Site Kit o PixelYourSite.
