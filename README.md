# SimplyLegal

AI-Powered Legal Document Automation Platform

## Project Overview

This FastAPI backend generates contract text and converts it to PDF.
It currently supports:
- generating a contract document from the request data
- writing the document to a PDF file
- returning the PDF file as a response

## Backend Structure

- `main.py` - FastAPI app and `/generate-pdf` endpoint
- `legal_engine.py` - contract generation logic (currently mocked)
- `pdf_engine.py` - text-to-PDF converter
- `.gitignore` - ignores environment, venv, generated files
- `requirements.txt` - Python dependencies

## Frontend Teammate Notes

### What you need to build

A simple UI that:
1. accepts contract input fields from the user
   - `contract_type`
   - `party_name`
   - `state`
2. sends a POST request to `/generate-pdf`
3. downloads or opens the returned PDF file

### Suggested API request

POST `http://127.0.0.1:8000/generate-pdf`

Header:
```http
Content-Type: application/json
```

Body:
```json
{
  "contract_type": "NDA",
  "party_name": "Acme Corp",
  "state": "California"
}
```

### Response

- returns a PDF file
- frontend should handle the file download

### Recommended frontend approach

- plain HTML/CSS/JavaScript is fine for MVP
- use `fetch()` to POST JSON
- use `Blob` and `URL.createObjectURL()` to download the PDF

Example fetch flow:
```js
fetch('http://127.0.0.1:8000/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contract_type, party_name, state })
})
.then(res => res.blob())
.then(blob => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract.pdf';
  a.click();
});
```

## Run the backend locally

1. Activate the virtual environment:
   - `& "./venv/Scripts/Activate.ps1"`
2. Install requirements:
   - `pip install -r requirements.txt`
3. Start the app:
   - `uvicorn main:app --reload --host 127.0.0.1 --port 8000`

## Notes for frontend work

- The current backend is ready for a frontend to send JSON and receive PDFs.
- The AI generation is mocked, so any text output is placeholder until `legal_engine.py` is updated.
- If you want to support file uploads or more fields, we can extend `/generate-pdf` next.
