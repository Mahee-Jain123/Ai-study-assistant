from utils.retriever import retrieve_chunks, get_all_chunks
from utils.generator import generate_answers, generate_summary, generate_quiz, generate_concepts

def processing_questions(question):
    relevant_documents = retrieve_chunks(question, k=4)
    answer = generate_answers(question, relevant_documents)
    
    citations = []
    for doc in relevant_documents:
        metadata = getattr(doc, "metadata", {})
        page = metadata.get("page", 1)
        filename = metadata.get("filename", "")
        content = getattr(doc, "page_content", str(doc))
        citations.append({
            "page": page,
            "filename": filename,
            "snippet": content[:240] + ("..." if len(content) > 240 else "")
        })
        
    return {
        "answer": answer,
        "citations": citations
    }

def processing_summary():
    chunks = get_all_chunks(limit=12)
    summary = generate_summary(chunks)
    return {"summary": summary}

def processing_quiz():
    chunks = get_all_chunks(limit=10)
    quiz = generate_quiz(chunks)
    return {"quiz": quiz}

def processing_concepts():
    chunks = get_all_chunks(limit=10)
    concepts = generate_concepts(chunks)
    return {"concepts": concepts}