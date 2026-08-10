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

def retrieve_chunks(question):
    if vector_db._collection.count()==0:
        raise HTTPException(status_code=400,detail="Please Upload a PDF")
    results=vector_db.similarity_search(
        question,
        k=3 #return the 3 most similar chunks
    )
    return results
