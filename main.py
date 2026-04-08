from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from legal_engine import generate_contract
from pdf_engine import text_to_pdf
from review_engine import review_contract
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def home():
    with open("static/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(f.read())


class ContractRequest(BaseModel):
    contract_type: str
    party_name: str
    state: str
    agreement_type: Optional[str] = None
    purpose: Optional[str] = None


@app.post("/generate-pdf")
async def create_pdf_contract(request: ContractRequest):
    try:
        raw_text = generate_contract(
            request.contract_type,
            request.party_name,
            request.state,
            request.agreement_type,
            request.purpose,
        )

        full_file_path = text_to_pdf(raw_text, request.party_name)
        if not os.path.exists(full_file_path):
            raise HTTPException(status_code=500, detail="PDF file not found after generation")

        return FileResponse(
            path=full_file_path,
            filename=os.path.basename(full_file_path),
            media_type="application/pdf",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/review")
async def upload_and_review(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        analysis = review_contract(temp_path)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return {"analysis": analysis}
