from utils.retriever import retrieve_chunks
from utils.generator import generate_answers

def processing_questions(question):
    relevant_documents =  retrieve_chunks(question)
    answer = generate_answers(question,relevant_documents)
    return answer