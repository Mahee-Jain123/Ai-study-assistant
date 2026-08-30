from utils.pdf_loader import load_pdf
from utils.chunker import chunk_text
from utils.embeddings import create_embeddings
from utils.vector_store import create_vector_db
from pathlib import Path
def processing_pdf(pdf_path: Path, filename: str = None) -> dict:
    if filename is None:
        filename = pdf_path.name
    pages = load_pdf(pdf_path)
    chunks = chunk_text(pages)
    embedding = create_embeddings(chunks)
    success = create_vector_db(embedding, filename=filename)
    return {
        "success": success,
        "page_count": len(pages),
        "chunk_count": len(chunks)
    }
 
    