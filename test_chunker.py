from utils.pdf_loader import load_pdf
from utils.chunker import chunk_text

pages = load_pdf(r"C:\Users\user\OneDrive\Documents\PDF X\Dust-of-snow.pdf")

chunks = chunk_text(
    pages,
    size=100,
    overlap=20
)

print("Number of chunks:", len(chunks))

for chunk in chunks[:5]:
    print("=" * 50)
    print(chunk)