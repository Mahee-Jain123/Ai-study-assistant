from langchain_chroma import Chroma #import the chroma database 
from langchain_google_genai import GoogleGenerativeAIEmbeddings #import the embedding model
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

embedding_model=GoogleGenerativeAIEmbeddings( #this is the machine that turns text into vector embeddings 
    model="models/gemini-embedding-001"
)
vector_db = Chroma(# load the chroma database 
    collection_name="study_guide", #the name of the folder containg the embeddings in the database 
    embedding_function=embedding_model, #the model db uses to embed text same as the model used to embed chunks
    persist_directory="vectorstore" # chroma saves all the embeddings in the vectorstore without this after closing we would have to make all the embeddings again tomorrow
)

def get_vector_count():
    try:
        return vector_db._collection.count() # gives the count of total number of documents (rows inr regular database) present in the vector database 
    except Exception:
        return 0

def retrieve_chunks(question, k=4):
    count = get_vector_count()
    if count == 0: # if the database is empty  
        raise HTTPException(status_code=400, detail="No documents indexed. Please upload a study PDF first.")
    
    k_val = min(k, count) #if the database has less than 3 documents 
    results = vector_db.similarity_search(
        question,
        k=k_val
    )
    return results

def get_all_chunks(limit=10): # retieves the first 10 chunks without any relevance 
    """Retrieves chunks across the document for summarization and quiz generation."""
    count = get_vector_count()
    if count == 0:
        raise HTTPException(status_code=400, detail="No documents indexed. Please upload a study PDF first.")
    
    # Perform a broad search or get direct documents
    try:
        data = vector_db._collection.get(limit=limit) # direct retrieval from the database 
        docs = []
        if not data or "documents" not in data:
            raise ValueError("No documents returned during retreival")
        documents= data["documents"]
        metadatas = data.get("metadatas",[{} for _ in documents]) # an empty dict if there is no metadata
        if data and "documents" in data and data["documents"]:
            for i, doc in enumerate(data["documents"]):
                metadata = metadatas[i] if i < len(metadatas) else {}
                class SimpleDoc:
                    def __init__(self, page_content, metadata):
                        self.page_content = page_content
                        self.metadata = metadata
                docs.append(SimpleDoc(doc, metadata))
            return docs
    except Exception as e:
        print(f"Direct retrieval failed, falling abck to search {e}")

    
    # Fallback to similarity search with broad query
    return retrieve_chunks("overview summary introduction key points", k=limit)

