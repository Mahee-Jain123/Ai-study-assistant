from fastapi import FastAPI
from pydantic import BaseModel
from utils.question_pipeline import processing_questions 
app=FastAPI()
class Question(BaseModel):
    question:str

@app.post("/ask/")
async def ask(ques: Question):
    ans = processing_questions(ques.question)
    
    return {
        "question":ques.question,
        "answer":ans
    }

