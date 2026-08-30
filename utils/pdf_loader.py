from pypdf import PdfReader
from fastapi import HTTPException 
# pypdf: python toolbox for dealing with pdfs 
# PdfReader: tool that opens a pdf, count pages, extract content, read metadata 
def load_pdf(pdf_path):#pdf_path: location of the pdf file on the computer
    reader=PdfReader(pdf_path) #the pdf is now opened in the variable reader
    #It knows things like: how many pages there are,the contents of each page,the document metadata.
    pages=[] # a list that stores every page that is read and all the text content of that page 
    for page_number, page in enumerate(reader.pages, start=1):
        #reader object has property called page like an element in a list page1,page2 etc
        #enumerate: function that gives the element as well as index of the element start: index starts from 1 not 0 
        text = page.extract_text() or ""
        #page.extract: extract all the readable content from the page object 
        if text.strip():
            pages.append( #append():function to add elements to pages list
                {
                    "page": page_number, #a dictionary with keys & values 
                    "text": text
                }
            )
    if not pages:
        raise HTTPException(
            status_code=400,
            detail="The given document doesn't contain any readable text"
        )
    return pages 




