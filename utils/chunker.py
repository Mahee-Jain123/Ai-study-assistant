
def chunk_text(pages,size=1000,overlap=200):
    chunks=[]
    for page in pages: #page is the page 1,2,3 & so on in the dictionary in the list pages
        page_number = page["page"]
        text = page["text"]
        start=0
        while start<len(text):
            chunk=text[start:start+size]
            chunks.append({
                "page":page_number,
                "chunk":chunk
            })
            start+=size-overlap

        return chunks


