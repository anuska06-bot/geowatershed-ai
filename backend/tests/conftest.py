import io
import pytest
from PIL import Image

@pytest.fixture
def sample_image_bytes():
    """Generates a synthetic 200x200 JPEG with native Pillow EXIF GPS coordinates."""
    img = Image.new("RGB", (200, 200), color=(73, 109, 137))
    # Draw high frequency contrast pattern so image has high Laplacian variance
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    for i in range(0, 200, 10):
        draw.line([(i, 0), (i, 200)], fill=(255, 255, 255), width=2)
        draw.line([(0, i), (200, i)], fill=(0, 0, 0), width=2)
    exif = img.getexif()
    # 0x8825 is GPSInfo IFD
    gps_ifd = exif.get_ifd(0x8825)
    gps_ifd[1] = 'N'
    gps_ifd[2] = (18, 54, 44.64)
    gps_ifd[3] = 'E'
    gps_ifd[4] = (73, 19, 40.44)
    gps_ifd[6] = 314.5
    gps_ifd[17] = 135.0

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", exif=exif)
    return buffer.getvalue()
