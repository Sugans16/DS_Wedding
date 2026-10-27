import os, io
from PIL import Image, ImageOps

src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Images"))
dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "src", "assets", "gallery"))
public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "public", "images"))

os.makedirs(dest_dir, exist_ok=True)
os.makedirs(public_dir, exist_ok=True)

if not os.path.exists(src_dir):
    print(f"Source images directory not found at {src_dir}")
    exit(0)

files = sorted(os.listdir(src_dir))
processed = 0

for fname in files:
    ext = os.path.splitext(fname)[1].lower()
    base = os.path.splitext(fname)[0]
    out_name = f"{base}.jpg"
    out_path = os.path.join(dest_dir, out_name)
    src_path = os.path.join(src_dir, fname)

    # Skip if output already exists and is newer than source
    if os.path.exists(out_path) and os.path.getmtime(out_path) >= os.path.getmtime(src_path):
        processed += 1
        continue

    try:
        if ext == ".cr3":
            with open(src_path, "rb") as f:
                data = f.read()
            pos = 0
            while True:
                idx = data.find(b"\xFF\xD8\xFF", pos)
                if idx == -1: break
                eoi = data.find(b"\xFF\xD9", idx)
                if eoi != -1:
                    sz = eoi - idx + 2
                    if sz > 500000:
                        jpeg_data = data[idx:eoi+2]
                        img = Image.open(io.BytesIO(jpeg_data))
                        t = ImageOps.exif_transpose(img)
                        max_dim = 1600
                        ratio = min(max_dim / t.width, max_dim / t.height, 1.0)
                        new_size = (int(t.width * ratio), int(t.height * ratio))
                        resized = t.resize(new_size, Image.Resampling.LANCZOS)
                        resized.save(out_path, "JPEG", quality=82, optimize=True)
                        processed += 1
                        break
                    pos = eoi + 2
                else: break
        elif ext in [".jpg", ".jpeg", ".png"]:
            with Image.open(src_path) as img:
                t = ImageOps.exif_transpose(img)
                max_dim = 1600
                ratio = min(max_dim / t.width, max_dim / t.height, 1.0)
                new_size = (int(t.width * ratio), int(t.height * ratio))
                resized = t.resize(new_size, Image.Resampling.LANCZOS)
                resized.save(out_path, "JPEG", quality=82, optimize=True)
                processed += 1
    except Exception as e:
        print(f"Error on {fname}: {e}")

# Copy hero image 0Y1A1024.jpg to public/images/couple-1.jpg as well
hero_src = os.path.join(dest_dir, "0Y1A1024.jpg")
hero_dst = os.path.join(public_dir, "couple-1.jpg")
if os.path.exists(hero_src):
    import shutil
    shutil.copyfile(hero_src, hero_dst)

print(f"Synchronized {processed} photos to {dest_dir}!")
