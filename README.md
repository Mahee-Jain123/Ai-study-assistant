# 📚 AI Study Assistant

An AI-powered document question-answering system built using **Retrieval-Augmented Generation (RAG)**. The application allows users to process PDF documents, convert them into semantic vector embeddings, retrieve the most relevant content for a query, and generate accurate answers using Google's Gemini models.

---

## 🚀 Features

- 📄 Extracts text from PDF documents
- ✂️ Splits documents into overlapping text chunks
- 🧠 Generates semantic embeddings using **Gemini Embedding API**
- 🗄️ Stores embeddings in a persistent **Chroma Vector Database**
- 🔍 Retrieves the most relevant chunks using semantic similarity search
- 🤖 Generates context-aware answers with **Google Gemini**
- 📑 Preserves page numbers for future citation support

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Language | Python |
| LLM | Google Gemini |
| Embeddings | Gemini Embedding API |
| Vector Database | ChromaDB |
| Framework | LangChain |
| PDF Processing | PyPDF |
| Environment Management | python-dotenv |
| Version Control | Git & GitHub |

---

# 📂 Project Structure

```
ai-study-assistant/
│
├── app.py
├── main.py
├── requirements.txt
│
├── utils/
│   ├── pdf_loader.py
│   ├── chunker.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── retriever.py
│   ├── generator.py
│   └── prompt.py
│
├── test_pdf_loader.py
├── test_chunker.py
├── test_embeddings.py
│
├── .gitignore
└── README.md
```

---

# ⚙️ RAG Pipeline

The application follows a standard Retrieval-Augmented Generation workflow.

```
PDF
 │
 ▼
PDF Loader
 │
 ▼
Text Chunking
 │
 ▼
Gemini Embeddings
 │
 ▼
Chroma Vector Store
 │
 ▼
User Question
 │
 ▼
Question Embedding
 │
 ▼
Similarity Search
 │
 ▼
Relevant Chunks
 │
 ▼
Gemini
 │
 ▼
Final Answer
```

---

# 🧠 How It Works

### 1. PDF Loading

The application extracts text from uploaded PDF files while preserving page numbers.

### 2. Chunking

Large documents are split into overlapping chunks to improve retrieval accuracy.

### 3. Embedding Generation

Each chunk is converted into a high-dimensional vector using Google's Gemini Embedding model.

### 4. Vector Storage

The embeddings are stored inside a persistent Chroma database for efficient retrieval.

### 5. Semantic Search

When a user asks a question, the question is embedded using the same embedding model.

The vector database compares the question embedding with stored document embeddings and retrieves the most semantically relevant chunks.

### 6. Answer Generation

The retrieved chunks are supplied as context to Gemini, which generates a final response grounded in the document.

---

# ▶️ Installation

Clone the repository

```bash
git clone https://github.com/Mahee-Jain123/Ai-study_assistant.git
cd Ai-study_assistant
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```
GOOGLE_API_KEY=your_api_key_here
```

---

# ▶️ Running the Project

```bash
python main.py
```

---

# 🧪 Testing

Individual modules can be tested using

```bash
python test_pdf_loader.py
python test_chunker.py
python test_embeddings.py
```

---

# 📌 Current Status

✅ PDF Loading

✅ Text Chunking

✅ Gemini Embeddings

✅ Chroma Vector Database

✅ Semantic Retrieval

✅ Answer Generation

🚧 FastAPI Backend (In Progress)

🚧 Frontend UI (Planned)

🚧 Deployment (Planned)

---

# 🔮 Future Improvements

- FastAPI backend
- Web interface
- PDF upload from browser
- Chat history
- Multiple document support
- Source citations
- Docker support
- Cloud deployment

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Mahee Jain**

GitHub: https://github.com/Mahee-Jain123
