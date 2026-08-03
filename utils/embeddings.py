from dotenv import load_dotenv #helps load the enviromnetal variables inside .env 
import os #gives acess to the os system 
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv() # this reads the env file and loads it's variables 
embedding_model=GoogleGenerativeAIEmbeddings( #this is the machine that turns text into vector embeddings 
    model="models/gemini-embedding-001"
)
def create_embeddings(chunks):
    embeddings=[] #an empty list that will conatain the embeddings we create,a well the page numbers and chunks 
    for item in chunks: #visiting every element in dictionary
        page_number=item["page"] #extract the page number
        text=item["chunk"]# extratct the text to be embedded 
        embedding=embedding_model.embed_query(text) # creating the embedding of the text content of text chunk
        embeddings.append({ # the list that conatins all the embedings and relevant information 
            "page":page_number,
            "chunk":text,
            "embeddings":embedding, # the vector that conatins the embedded text [0.2,0.34,-0.98] etc
            })

    return embeddings
         




