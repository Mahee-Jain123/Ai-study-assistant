from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()

# Gemini model for conversational QA and study generation
llm = ChatGoogleGenerativeAI(
    model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
    temperature=0.3
)

def _extract_content(response) -> str: # helper function 
    """Safely extracts text content from LangChain response."""
    if hasattr(response, "content"):
        content = response.content # gets the text from the langchain message object just a safe check  
    else:
        content = response
    
    if isinstance(content, str): # if .content is a string return conetent 
        return content
    elif isinstance(content, list): # some langchain models return response lika a list of content blocks
        texts = []
        for item in content:
            if isinstance(item, str): # simple string
                texts.append(item)
            elif isinstance(item, dict) and "text" in item: # dict with text key
                texts.append(item["text"])
            elif hasattr(item, "text"):
                texts.append(str(item.text)) # object with text attribute 
        return "\n".join(texts) if texts else str(content)
    return str(content) # if none of the above works we stringify the content

# the four generation functions 

def generate_answers(question, relevant_documents):
    context = ""
    for item in relevant_documents:
        text = getattr(item, "page_content", str(item))
        metadata = getattr(item, "metadata", {})
        page = metadata.get("page", "?")
        context += f"[Page {page}]:\n{text}\n\n"
    
    prompt = f"""You are an expert AI Study Assistant.
Answer the user's question clearly, thoroughly, and accurately based ONLY on the provided document context.

Format your answer with clear markdown headings, bullet points, and code/math formatting where appropriate.
If the context does not contain enough information to answer the question, state:
"I couldn't find sufficient information in the uploaded document to answer this question."

Document Context:
{context}

Question:
{question}

Answer:"""
    response = llm.invoke(prompt)
    return _extract_content(response)

def generate_summary(relevant_documents):
    context = ""
    for item in relevant_documents:
        text = getattr(item, "page_content", str(item))
        metadata = getattr(item, "metadata", {})
        page = metadata.get("page", "?")
        context += f"[Page {page}]:\n{text}\n\n"
    
    prompt = f"""You are an expert AI Study Assistant.
Please provide a comprehensive, beautifully structured Study Summary of the document based on the context below:

Include:
1. **Executive Overview**: What is the core topic and main takeaway?
2. **Key Themes & Topics**: Detailed breakdown of primary subject areas.
3. **Important Insights & Takeaways**: High-yield points to remember for exams/review.
4. **Quick Self-Check Questions**: 3 questions a student should be able to answer after studying this.

Document Context:
{context}

Summary:"""
    response = llm.invoke(prompt)
    return _extract_content(response)

def generate_quiz(relevant_documents):
    context = ""
    for item in relevant_documents:
        text = getattr(item, "page_content", str(item))
        metadata = getattr(item, "metadata", {})
        page = metadata.get("page", "?")
        context += f"[Page {page}]:\n{text}\n\n"
    
    prompt = f"""You are an expert AI Study Assistant.
Based on the following document context, create 4 high-quality practice quiz questions (multiple choice with 4 options A, B, C, D) to test understanding.

For each question, format as:
### Question [N]: [Question text]
- **A)** [Option A]
- **B)** [Option B]
- **C)** [Option C]
- **D)** [Option D]

> **Correct Answer**: [Option letter] - [Brief explanation citing the context]

Document Context:
{context}

Quiz:"""
    response = llm.invoke(prompt)
    return _extract_content(response)

def generate_concepts(relevant_documents):
    context = ""
    for item in relevant_documents:
        text = getattr(item, "page_content", str(item))
        metadata = getattr(item, "metadata", {})
        page = metadata.get("page", "?")
        context += f"[Page {page}]:\n{text}\n\n"
    
    prompt = f"""You are an expert AI Study Assistant.
Extract all key concepts, technical terms, formulas, and definitions from the following study material.

Format each concept clearly:
  - **[Concept / Term Name]**
  - **Definition**: [Concise, accurate definition]
  - **Why it matters**: [Practical significance or exam relevance]
  - **Reference**: [Page number if mentioned in context]

Document Context:
{context}

Key Concepts:"""
    response = llm.invoke(prompt)
    return _extract_content(response)

