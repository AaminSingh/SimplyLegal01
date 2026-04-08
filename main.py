from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from legal_engine import generate_contract
from pdf_engine import text_to_pdf
import os
from fastapi import UploadFile, File
from review_engine import review_contract
import shutil
from fastapi.middleware.cors import CORSMiddleware
from google.api_core import exceptions as google_exceptions

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

@app.post("/generate-pdf")
async def create_pdf_contract(request: ContractRequest):
    try:
        raw_text = generate_contract(request.contract_type, request.party_name, request.state)

        full_file_path = text_to_pdf(raw_text, request.party_name)
        if full_file_path is None or not os.path.exists(full_file_path):
            raise HTTPException(status_code=500, detail="Failed to write PDF to disk")

        return FileResponse(
            path=full_file_path,
            filename=os.path.basename(full_file_path),
            media_type='application/pdf'
        )
    except google_exceptions.ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=str(e))
    except google_exceptions.GoogleAPICallError as e:
        raise HTTPException(status_code=502, detail=str(e))
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
    except google_exceptions.ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=str(e))
    except google_exceptions.GoogleAPICallError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return {"analysis": analysis}
