from fastapi import FastAPI
from fastapi import File,UploadFile 
from pathlib import Path
app=FastAPI()
@app.get("/")
def start():
    return {"Message":"ai-study-assistant-API"}

@app.post("/ask/")
def ask_question():
    pass