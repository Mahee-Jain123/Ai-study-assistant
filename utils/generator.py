from langchain_google_genai import ChatGoogleGenerativeAI #model that turns embeddings into text beacuse gemin understands text better 

llm=ChatGoogleGenerativeAI(
    model="gemini-3.5-flash"
)
def generate_answers(question,relevant_documents):
    context=""
    for item in relevant_documents:
          text=item.page_content
          page=item.metadata
          context+=f"{page}\n{text}\\n"
    prompt = f"""
    You are a helpful study assistant.

    Answer the question ONLY using the provided context.

    If the answer is not present in the context, say:
    "I couldn't find the answer in the uploaded document."

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    response = llm.invoke(prompt)
    
    return response.content[0]["text"]
