import numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd

src = Image.open('1318a57509dc55dbe06bc5d12ba6dcea.jpg').convert('RGB')
ref = Image.open('ref.jpg').convert('RGB')
W, H = src.size
a = np.asarray(src).astype(np.int16)
R, G, B = a[..., 0], a[..., 1], a[..., 2]

# 1) fondo: mitad izquierda vacía del banner oscuro oficial, reflejada
left = ref.crop((0, 0, 1300, H))
bg = Image.new('RGB', (2600, H))
bg.paste(left, (0, 0)); bg.paste(left.transpose(Image.FLIP_LEFT_RIGHT), (1300, 0))
bg = bg.resize((W, H), Image.LANCZOS)

# 2) máscara del primer plano (pantalla + máquina)
def c(x, y):  # coords del recorte 2x -> imagen completa
    return (x * 2 + 1500, y * 2)
screen = Image.new('L', (W, H), 0)
ImageDraw.Draw(screen).polygon([c(110, 92), c(626, 60), c(630, 462), c(110, 476)], fill=255)
screen = np.asarray(screen) > 0

yy, xx = np.mgrid[0:H, 0:W]
box = (xx > 1500 + 50 * 2) & (xx < 1500 + 575 * 2) & (yy > 150 * 2) & (yy < 595 * 2)
gray = a.mean(axis=2)
gx = nd.sobel(gray, 1); gy = nd.sobel(gray, 0); gm = np.hypot(gx, gy)
dark = gray < 205
ed = (gm > 90) & box
mach = (nd.binary_dilation(ed, iterations=3) & (dark | (gm > 140))) | (box & (gray < 175))
mach = nd.binary_closing(mach, iterations=10)
mach = nd.binary_fill_holes(mach)
mach = nd.binary_opening(mach, iterations=4)
lab, n = nd.label(mach)
if n:
    sizes = nd.sum(mach, lab, range(1, n + 1))
    mach = np.isin(lab, 1 + np.where(sizes > 20000)[0])
fg = screen | mach
mask = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))

# 3) resplandor azul de "digitalización" alrededor del primer plano
edge = Image.fromarray((fg * 255).astype(np.uint8))
glow = Image.new('RGB', (W, H), (0, 0, 0))
for rad, col in ((60, (0, 90, 255)), (22, (40, 150, 255)), (6, (120, 200, 255))):
    g = edge.filter(ImageFilter.GaussianBlur(rad))
    layer = Image.new('RGB', (W, H), col)
    glow = Image.composite(layer, glow, g.point(lambda v: int(v * 0.6)))
out = Image.fromarray(np.clip(np.asarray(bg).astype(np.int16) + np.asarray(glow).astype(np.int16) * 0.6, 0, 255).astype(np.uint8))

# reflejo/halo en el piso
halo = Image.new('L', (W, H), 0)
ImageDraw.Draw(halo).ellipse([1500 + 40 * 2, 520 * 2, 1500 + 640 * 2, 640 * 2], fill=150)
halo = halo.filter(ImageFilter.GaussianBlur(70))
out = Image.composite(Image.new('RGB', (W, H), (20, 110, 255)), out, halo.point(lambda v: int(v * .55)))

# primer plano, ligeramente enfriado para integrarlo con el fondo azul
fgf = a * np.array([0.92, 0.96, 1.04])
fgf = np.where(screen[..., None] & ~mach[..., None], fgf * np.array([0.82, 0.86, 0.95]), fgf)
fgimg = Image.fromarray(np.clip(fgf, 0, 255).astype(np.uint8))
out = Image.composite(fgimg, out, mask)

# borde luminoso de la pantalla
d = ImageDraw.Draw(out)
d.line([c(110, 92), c(626, 60), c(630, 462), c(110, 476), c(110, 92)], fill=(90, 180, 255), width=4)
out.save(sys.argv[1], quality=92)
Image.fromarray((fg * 255).astype(np.uint8)).resize((720, 311)).save('mask-prev.png')
out.resize((960, 415)).save('comp-prev.png')
