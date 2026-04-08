import os
import fitz
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def extract_text_from_pdf(pdf_path):
    document = fitz.open(pdf_path)
    text = []
    for page in document:
        text.append(page.get_text())
    document.close()
    return "\n".join(text)


def build_review_prompt(contract_text):
    return f"""
Please review the following legal contract and provide a concise analysis.

Review requirements:
- Identify any unclear or inconsistent terms.
- Highlight missing sections or clauses.
- Suggest any improvements for clarity and readability.
- Do not rewrite the entire document; provide a short review.

Contract text:
{contract_text}
"""


def review_contract(file_path):
    if not GEMINI_API_KEY:
        raise RuntimeError("Missing GEMINI_API_KEY environment variable. Add it to .env or your environment.")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Review file not found: {file_path}")

    if file_path.lower().endswith(".pdf"):
        contract_text = extract_text_from_pdf(file_path)
    else:
        with open(file_path, "r", encoding="utf-8") as f:
            contract_text = f.read()

    if not contract_text.strip():
        raise ValueError("Uploaded file contains no readable text.")

    prompt = build_review_prompt(contract_text)
    model = genai.GenerativeModel(GEMINI_MODEL)
    response = model.generate_content(prompt)
    review_text = getattr(response, "text", None)

    if not review_text:
        raise RuntimeError("AI did not return a review.")

    return review_text.strip()
