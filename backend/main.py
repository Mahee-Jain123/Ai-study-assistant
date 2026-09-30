from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os
import shutil

from utils.pipeline import processing_pdf
from utils.question_pipeline import (
    processing_questions,
    processing_summary,
    processing_quiz,
    processing_concepts
)
from utils.retriever import get_vector_count
from utils.vector_store import clear_vector_db

app = FastAPI(
    title="AI Study Assistant API",
    description="RAG-powered AI Study Assistant with Gemini & ChromaDB",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "AI Study Assistant API is running",
        "endpoints": ["/upload/", "/ask/", "/study/summary", "/study/quiz", "/study/concepts", "/documents/stats", "/documents/clear"]
    }

@app.get("/health")
def health():
    count = get_vector_count()
    return {
        "status": "healthy",
        "indexed_chunks": count
    }

@app.get("/documents/stats")
def document_stats():
    count = get_vector_count()
    return {
        "indexed_chunks": count,
        "has_documents": count > 0
    }

@app.delete("/documents/clear")
def clear_documents():
    success = clear_vector_db()
    return {
        "success": success,
        "message": "Vector database cleared successfully"
    }

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    
    temp_path = uploads_dir / file.filename
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")
        
        temp_path.write_bytes(contents)
        
        result = processing_pdf(temp_path, filename=file.filename)
        if not result.get("success"):
            raise HTTPException(status_code=500, detail="Failed to process document into vector database.")
        
        return {
            "message": "PDF uploaded and indexed successfully",
            "filename": file.filename,
            "page_count": result.get("page_count", 0),
            "chunk_count": result.get("chunk_count", 0),
            "total_vectors": get_vector_count()
        }
    except HTTPException:
        raise
    except Exception as e:
        print("UPLOAD ERROR:", repr(e))
        raise
    finally:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except Exception:
                pass

@app.post("/ask/")
async def ask_question(req: QuestionRequest):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    try:
        res = processing_questions(req.question.strip())
        return {
            "question": req.question,
            "answer": res["answer"],
            "citations": res.get("citations", [])
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

@app.post("/study/summary")
async def get_summary():
    try:
        res = processing_summary()
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@app.post("/study/quiz")
async def get_quiz():
    try:
        res = processing_quiz()
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.post("/study/concepts")
async def get_concepts():
    try:
        res = processing_concepts()
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating concepts: {str(e)}")
