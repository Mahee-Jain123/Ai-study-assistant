from fastapi import File,UploadFile,HTTPException,FastAPI
from pathlib import Path
app=FastAPI()
def process_pdf(pdf_path: Path) -> bool: #placeholder function for processer 
     print(f"Processing{pdf_path}")
     return True 
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":  # check if the uploaded file is a pdf
        raise HTTPException(status_code=400, detail="only pdfs are allowed")
    uploads = Path("uploads") # create an object called uploads
    uploads.mkdir(exist_ok=True) # create an uploads folder if not already there 
    pdf_path = uploads/file.filename # pdf_path is path object representation the location where the path will be saved 
    contents = await file.read() # read the bytes in the pdf into the memory 
    pdf_path.write_bytes(contents) # write the bytes stored in  contents to the file in file location 
    try:
        success = process_pdf(pdf_path) # if the pdf is not processed due to any reason 
        if not success:
            raise HTTPException(
                 status_code=500,
                 detail="failed to process"
            )
        return { # if it did process successfully  
              "message":"Pdf uploaded and processed successsfully",
              "filename":file.filename
              }
    finally:
          if pdf_path.exists(): # deleting the temporaily saved files after rag pipeline 
                pdf_path.unlink()