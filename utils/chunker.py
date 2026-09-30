from langchain_text_splitters import RecursiveCharacterTextSplitter
def chunk_text(pages,size=1000,overlap=200):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=size,
        chunk_overlap=overlap
    )
    chunks=[]
    for page in pages: #page is the page 1,2,3 & so on in the dictionary in the list pages
        page_number = page["page"]
        text = page["text"]
        split_chunks = splitter.split_text(text) # splittingwith the help of langchain 
        
        for chunk in split_chunks:
            chunks.append({
                "page": page_number,
                "chunk": chunk
            })
     
    print(f"Total chunks created: {len(chunks)}")

    return chunks
