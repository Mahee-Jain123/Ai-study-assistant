from utils.embeddings import create_embeddings
from utils.chunker import chunk_text
from utils.pdf_loader import load_pdf
pages=load_pdf(r"C:\Users\user\OneDrive\Desktop\Dust-of-snow.pdf")

chunks=chunk_text(
    pages,
    size=1000,
    overlap=200,
)
embeddings=create_embeddings(chunks)
print("EMBEDDING LENGTH: ",len(embeddings))
print(embeddings[0])

