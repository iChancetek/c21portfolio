from PIL import Image, ImageDraw, ImageFont

def create_icon():
    # 512x512 Canvas
    size = 1024
    img = Image.new('RGB', (size, size), color = (5, 5, 8)) # Ultra dark navy-black
    d = ImageDraw.Draw(img)

    # Load Segoe UI Bold / standard clean modern typeface
    try:
        font_path = "C:\\Windows\\Fonts\\segoeuib.ttf" # Segoe UI Bold
        font = ImageFont.truetype(font_path, 130)
    except IOError:
        font = ImageFont.load_default()

    text = "Chancellor"
    
    # Calculate bounding box for center alignment
    bbox = d.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]

    # Draw text centered
    x = (size - w) / 2
    y = (size - h) / 2 - 20
    
    # Inner glowing outline (slight shadow)
    d.text((x + 2, y + 2), text, fill=(0, 240, 255, 100), font=font) # shadow Offset Cyan
    d.text((x, y), text, fill=(255, 255, 255), font=font) # main White

    # Minimalist Accent Line (Modernist dot or neon anchor)
    line_w = 400
    line_x = (size - line_w) / 2
    line_y = y + h + 40
    d.line([(line_x, line_y), (line_x + line_w, line_y)], fill=(0, 243, 255), width=8)

    save_path = r"C:\Users\chanc\.gemini\antigravity\brain\acf1da52-57d0-4e17-a6d4-3c90d0b8859a\pwa_icon_text.png"
    img.save(save_path)
    print(f"Icon saved to {save_path}")

if __name__ == "__main__":
    create_icon()
