from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001"
)

result = embedding_model.embed_query("Hello, this is a test.")

print("Embedding successful!")
print("Dimensions:", len(result))
print("First 5 values:", result[:5])