from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

embedding_model = GoogleGenerativeAIEmbeddings( # making an embedding model telling chroma to embed text whenever given a question  
    model="models/gemini-embedding-001"
)
vector_db = Chroma(
    collection_name="study_guide", #the name of the folder containg the embeddings in the database 
    embedding_function=embedding_model, #the model db uses to embed text same as the model used to embed chunks
    persist_directory="vectorstore" # chroma saves all the embeddings in the vectorstore without this after closing we would have to make all the embeddings again tomorrow
)
def create_vector_db(embedded_chunks):
    for index, item in enumerate(embedded_chunks):

        page_number = item["page"]
        text = item["chunk"]
        vector = item["embedding"]

        vector_db._collection.add(
            embeddings=[vector],
            documents=[text],
            metadatas=[
                {
                    "page": page_number
                }
            ],
            ids=[f"chunk_{index}"]
        )