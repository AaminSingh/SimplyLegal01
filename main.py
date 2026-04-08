from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel
from legal_engine import generate_contract
from pdf_engine import text_to_pdf # New Import
import os
from fastapi import UploadFile, File
from review_engine import review_contract
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractRequest(BaseModel):
    contract_type: str
    party_name: str
    state: str

@app.post("/generate-pdf")
async def create_pdf_contract(request: ContractRequest):
    # 1. Generate text (Ensure your Gemini mock or real code is working)
    raw_text = generate_contract(request.contract_type, request.party_name, request.state)
    
    # 2. Generate PDF with the new unique logic
    full_file_path = text_to_pdf(raw_text, request.party_name)
    
    # 3. Final Check
    if full_file_path is None or not os.path.exists(full_file_path):
        raise HTTPException(status_code=500, detail="Failed to write PDF to disk")

    return FileResponse(
        path=full_file_path, 
        filename=os.path.basename(full_file_path), 
        media_type='application/pdf'
    )

@app.post("/review")
async def upload_and_review(file: UploadFile = File(...)):
    # 1. Save the uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Run the AI review
    analysis = review_contract(temp_path)
    
    # 3. Clean up the temp file
    os.remove(temp_path)
    
    return {"analysis": analysis}