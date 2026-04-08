# SimplyLegal

AI-Powered Legal Document Automation Platform — draft, review, and manage contracts in minutes using Groq's Llama AI.

---

## Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, React 18, Tailwind CSS  |
| Backend  | FastAPI (Python)                    |
| AI       | Groq API — `llama-3.1-8b-instant`   |
| PDF      | fpdf2, PyMuPDF                      |

---

## Project Structure

```
SimplyLegal/
├── app/                  # Next.js app router
│   ├── page.tsx          # Root page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Dashboard.tsx     # Main dashboard with document list
│   ├── DocumentViewer.tsx# Document viewer + AI review panel
│   ├── IntakeWizard.tsx  # 4-step contract creation wizard
│   └── Sidebar.tsx       # Navigation sidebar
├── main.py               # FastAPI app + API endpoints
├── legal_engine.py       # Contract generation via Groq
├── review_engine.py      # Document review via Groq
├── pdf_engine.py         # Text-to-PDF converter
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
└── next.config.js        # Next.js config (proxies /backend/* → FastAPI)
```

---

## Setup

### 1. Clone and install dependencies

```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

### 2. Configure environment

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Get a free API key at [console.groq.com](https://console.groq.com).

---

## Running the App

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend (FastAPI)

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend (Next.js)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The frontend proxies all `/backend/*` requests to `http://localhost:8000` automatically via `next.config.js`, so no additional config is needed.

---

## Features

### Create a Contract
1. Click **Create New Document** on the dashboard
2. Select a document type (NDA, Service Agreement, Lease)
3. Fill in party names and jurisdiction
4. Add agreement details and purpose
5. Click **Generate Contract** — the AI drafts the contract and downloads it as a PDF

### Review a Document
1. Open the **Document Viewer** (click any document row)
2. Click **Review Doc** in the toolbar
3. Upload a PDF or TXT file
4. The AI analyzes the contract and shows feedback in the right panel

### Clause Explainer
In the Document Viewer, click any clause in the left pane to get an instant plain-English explanation in the AI panel on the right.

---

## API Endpoints

### `POST /generate-pdf`

Generates a contract and returns it as a PDF file.

**Request body:**
```json
{
  "contract_type": "Non-Disclosure Agreement",
  "party_name": "Acme Corp and Globex Inc",
  "state": "California",
  "agreement_type": "mutual",
  "purpose": "Protecting source code shared during a software evaluation"
}
```

**Response:** `application/pdf` file download

---

### `POST /review`

Reviews an uploaded contract document.

**Request:** `multipart/form-data` with a `file` field (PDF or TXT)

**Response:**
```json
{
  "analysis": "AI-generated review text..."
}
```

---

## Notes

- Generated PDF files are saved temporarily in the project root and served immediately.
- The `.env` file must never be committed — it is listed in `.gitignore`.
- Always consult a licensed attorney before using AI-generated contracts in legal contexts.
