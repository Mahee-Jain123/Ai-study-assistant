from fastapi import FastAPI
app=FastAPI()
@app.get("/")
def start():
    return {"Message":"ai-study-assistant-API"}
@app.post("/upload/")
def upload_pdf():
    pass
@app.post("/ask/")
def ask_question():
    pass