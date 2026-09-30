from dotenv import load_dotenv #helps load the enviromnetal variables inside .env 
import os #gives acess to the os system 
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import time

load_dotenv() # this reads the env file and loads it's variables 
embedding_model=GoogleGenerativeAIEmbeddings( #this is the machine that turns text into vector embeddings 
    model="models/gemini-embedding-001"
)
def create_embeddings(chunks):
    print(f"Starting embedding for {len(chunks)} chunks...")
    texts = [item["chunk"] for item in chunks]

    all_vectors=[]
    batch_size=5

    for i in range (0,len(texts),batch_size):
        batch=texts[i:i+batch_size]
        print(
            f"embedding batch {i//batch_size+1}",
            f"({len(batch)} chunks....)",
        )

        vectors = embedding_model.embed_documents(batch)
        all_vectors.extend(vectors)
        if i+batch_size<len(texts):
            time.sleep(10)

    embeddings = []

    for item, vector in zip(chunks,all_vectors):
        embeddings.append({
            "page": item["page"],
            "chunk": item["chunk"],
            "embedding": vector
        })

    print("Embedding completed!")
    
    return embeddings
         




