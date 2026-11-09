#!/usr/bin/env python3
"""Genera el sitio de ProTech a partir de src/.

Salidas:
  wordpress/<pagina>.html  bloque listo para pegar en un bloque "HTML personalizado" de WordPress
  wordpress/_cabecera.html y _pie.html  (se usan como patrones sincronizados)
  vista-previa.html        todas las páginas en un solo archivo para revisar (navegación por #)

Uso: python3 build.py [--img-base /wp-content/uploads/protech/]
"""
import base64, json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
IMG_BASE = "/wp-content/uploads/protech/"
if "--img-base" in sys.argv:
    IMG_BASE = sys.argv[sys.argv.index("--img-base") + 1]

WA_ICON = ('<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z"/></svg>')

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n')

# ---------- precios (una sola fuente para todas las páginas) ----------
PLANS = {
    "zwcad": [
        ("ZWCAD Standard", 17980, "Dibujo 2D y visualización 3D básica.",
         ["Herramientas completas de dibujo 2D", "Visualización de modelos 3D", "Extensión LISP"], False),
        ("ZWCAD Professional", 23980, "CAD 2D/3D completo con modelado.",
         ["Todo lo de Standard", "Modelado 3D", "Nube de puntos y GIS", "Vectorización de imágenes", "APIs completas (VBA, ZRX, .NET)"], True),
        ("ZWCAD MFG (Mecánico)", 27980, "Professional con módulo mecánico.",
         ["Todo lo de Professional", "Biblioteca de piezas estándar", "Compatible con AutoCAD® Mechanical", "Generación de BOM",
          "Cotas, anotaciones y cálculo mecánico"], False),
    ],
    "zw3d": [
        ("ZW3D Lite", 36000, "Modelado básico de sólidos.", ["Modelado de sólidos", "Ensambles", "Planos 2D"], False),
        ("ZW3D Standard", 60000, "Sólidos y superficies para producto real.",
         ["Modelado de superficies", "Ensambles y biblioteca de piezas", "Lámina (chapa metálica)", "Ingeniería inversa",
          "Soldadura y estructuras", "Análisis estático de piezas"], True),
        ("ZW3D Professional", 90000, "Standard más moldes y electrodos.",
         ["Todo lo de Standard", "Diseño de moldes", "Electrodos", "Análisis estático de piezas"], False),
        ("ZW3D Advanced", 100000, "Standard más tuberías, arneses y ECAD.",
         ["Todo lo de Standard", "Tuberías (Piping)", "Arneses (Harness)", "ECAD / MCAD", "Colaboración",
          "Análisis estático de pieza y ensamble"], False),
        ("ZW3D Premium", 144000, "La suite completa de diseño a fabricación.",
         ["Todo lo de Standard", "Moldes y electrodos", "CAM 2X y 3X", "Análisis estático de pieza y ensamble"], False),
    ],
    "cam": [
        ("ZW3D CAM-2X", 50000, "Maquinado 2 ejes.", ["Fresado 2X", "Torneado 2X", "Edición de trayectorias"], False),
        ("ZW3D CAM-3X", 90000, "Maquinado 2 y 3 ejes.", ["Fresado 2X", "Torneado 2X", "Fresado 3X (Quick Mill)", "Edición de trayectorias"], False),
    ],
}


# Precio de licencia de red (flotante). None = se cotiza aparte. Fuente: sitio anterior.
NETWORK = {"ZWCAD Standard": 18980, "ZWCAD Professional": 24980, "ZWCAD MFG (Mecánico)": 28980}

PRODUCTS = [  # orden y textos del cotizador
    ("zwcad", "ZWCAD", "CAD 2D/3D compatible con DWG", "logo-zwcad.webp"),
    ("zw3d", "ZW3D CAD", "CAD/CAE 3D todo en uno", "logo-zw3d.webp"),
    ("cam", "ZW3D CAM", "Maquinado 2X y 3X", "logo-zw3d.webp"),
]


def cotizador_html(img_of, start=None):
    data = []
    for key, label, sub, logo in PRODUCTS:
        data.append({"id": key, "label": label, "sub": sub, "logo": img_of(logo), "plans": [
            {"name": n, "price": p, "net": NETWORK.get(n), "desc": d, "feats": f, "hot": h}
            for n, p, d, f, h in PLANS[key]]})
    js = json.dumps(data, ensure_ascii=False).replace("'", "&#39;")
    st = f' data-start="{start}"' if start else ""
    return (f"<div class=\"cz\"{st} data-cz='{js}'><noscript><p>Activa JavaScript para usar el cotizador, "
            "o consulta la lista de precios más abajo.</p></noscript></div>")


def plans_html(key, limit=None):
    items = PLANS[key][:limit] if limit else PLANS[key]
    out = []
    for name, price, desc, feats, hot in items:
        msg = f"Hola ProTech, quiero {name} (${price:,} MXN)."
        cls = "plan hot" if hot else "plan"
        badge = '<span class="badge">Recomendado</span>' if hot else ""
        btn = "btn-p"
        lis = "".join(f"<li>{f}</li>" for f in feats)
        net = f'<div class="net">Licencia de red: <b>${NETWORK[name]:,}</b></div>' if NETWORK.get(name) else ""
        out.append(
            f'<div class="{cls}">{badge}<h3>{name}</h3><div class="pr">${price:,} <small>MXN · perpetua</small></div>{net}'
            f'<p>{desc}</p><ul>{lis}</ul><a class="btn {btn} wa" data-msg="{msg}" href="#">Cotizar este plan</a>'
            f'<a class="trial wa" data-msg="Hola ProTech, quiero la prueba gratis de 30 días de {name}." href="#">o pruébalo gratis 30 días</a></div>')
    n = len(items)
    grid = {2: "plans two", 3: "plans", 4: "plans four"}.get(n, "plans")
    return f'<div class="{grid}">' + "".join(out) + "</div>"


def terms_html():
    rows = [l.split("\t", 1) for l in (SRC / "terminos.txt").read_text(encoding="utf-8").splitlines()]
    out = []
    for tag, text in rows:
        if tag == "li":
            continue
        text = text.replace("PROECH", "PROTECH")
        if tag == "h2":
            out.append(f"<h2>{text.capitalize()}</h2>")
        else:
            for part in re.split(r"(?=\([a-z]\) )", text):
                if part.strip():
                    out.append(f"<p>{part.strip()}</p>")
    return "\n".join(out)


# ---------- páginas ----------
def load_pages():
    pages = []
    for f in sorted((SRC / "pages").glob("*.html")):
        if f.name.startswith("_"):
            continue
        raw = f.read_text(encoding="utf-8")
        m = re.match(r"<!--(\{.*?\})-->\n", raw, re.S)
        meta = json.loads(m.group(1))
        meta["body"] = raw[m.end():]
        pages.append(meta)
    pages.sort(key=lambda p: p.get("order", 99))
    return pages


def render(text, url_of, img_of):
    text = text.replace("{{wa-icon}}", WA_ICON)
    text = re.sub(r"\{\{plans:(\w+)(?::(\d+))?\}\}", lambda m: plans_html(m.group(1), int(m.group(2)) if m.group(2) else None), text)
    text = text.replace("{{terminos}}", terms_html())
    text = re.sub(r"\{\{cotizador(?::(\w+))?\}\}", lambda m: cotizador_html(img_of, m.group(1)), text)
    text = re.sub(r"\{\{u:([\w-]+)\}\}", lambda m: url_of(m.group(1)), text)
    text = re.sub(r"\{\{img:([\w.-]+)\}\}", lambda m: img_of(m.group(1)), text)
    return text


def main():
    pages = load_pages()
    by_id = {p["id"]: p for p in pages}
    css = (SRC / "base.css").read_text(encoding="utf-8") + (SRC / "cotizador.css").read_text(encoding="utf-8") + (SRC / "zw3d.css").read_text(encoding="utf-8") + (SRC / "about.css").read_text(encoding="utf-8")
    js = (SRC / "site.js").read_text(encoding="utf-8")
    marker = "  // single-file preview: hash router"
    js = js.replace(marker, (SRC / "cotizador.js").read_text(encoding="utf-8") + marker, 1)
    header = (SRC / "header.html").read_text(encoding="utf-8")
    footer = (SRC / "footer.html").read_text(encoding="utf-8")

    def check(pid):
        if pid not in by_id:
            sys.exit(f"Enlace a página inexistente: {pid}")

    # WordPress blocks
    def wp_url(pid):
        check(pid)
        return by_id[pid]["path"]

    def wp_img(name):
        return IMG_BASE + name

    out = ROOT / "wordpress"
    out.mkdir(exist_ok=True)
    for old in out.glob("*.html"):
        old.unlink()
    (out / "_cabecera.html").write_text(
        FONTS + f'<style>{render(css, wp_url, wp_img)}</style>\n<div class="pt">' + render(header, wp_url, wp_img) + "</div>", encoding="utf-8")
    (out / "_pie.html").write_text(
        '<div class="pt">' + render(footer, wp_url, wp_img) + f"</div>\n<script>{js}</script>", encoding="utf-8")
    for p in pages:
        (out / f'{p["id"]}.html').write_text('<div class="pt">' + render(p["body"], wp_url, wp_img) + "</div>", encoding="utf-8")
    index = ["| Página | URL | Título SEO | Descripción SEO |", "|---|---|---|---|"]
    index += [f'| {p["menu"]} | `{p["path"]}` | {p["title"]} | {p["desc"]} |' for p in pages]
    (out / "PAGINAS.md").write_text("# Páginas del sitio\n\n" + "\n".join(index) + "\n", encoding="utf-8")

    # Single-file preview (artifact page: no doctype/html/head/body)
    def pv_url(pid):
        check(pid)
        return "#" + pid

    cache = {}

    def pv_img(name):
        if name.endswith(".mp4"):
            return "img/" + name  # se publica como archivo aparte
        if name not in cache:
            mime = "image/svg+xml" if name.endswith(".svg") else ("video/mp4" if name.endswith(".mp4") else "image/webp")
            cache[name] = f"data:{mime};base64," + base64.b64encode((ROOT / "img" / name).read_bytes()).decode()
        return cache[name]

    sections = "\n".join(
        f'<div data-page="{p["id"]}" data-title="{p["title"]}"' + ("" if p["id"] == "inicio" else " hidden") + ">"
        + render(p["body"], pv_url, pv_img) + "</div>" for p in pages)
    preview = (
        '<title>Sitio ProTech México</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
        '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
        f"<style>:root{{color-scheme:light}}body{{background:#fff;color:#33415c}}body::before{{content:\"\";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:70;background:#fff}}{render(css, pv_url, pv_img)}</style>\n"
        '<div class="pt">' + render(header, pv_url, pv_img) + "<main>" + sections + "</main>"
        + render(footer, pv_url, pv_img) + f"</div>\n<script>{js}</script>\n")
    (ROOT / "vista-previa.html").write_text(preview, encoding="utf-8")
    print(f"{len(pages)} páginas generadas; vista previa {len(preview)//1024} KB")


if __name__ == "__main__":
    main()
