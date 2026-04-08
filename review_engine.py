import os
import fitz
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

SYSTEM_PROMPT = (
    "You are an expert legal document reviewer. "
    "Your role is to analyze contracts and provide concise, actionable feedback. "
    "Focus on: unclear or inconsistent terms, missing standard clauses, ambiguous language, "
    "and concrete suggestions for improvement. Be direct and specific. "
    "Do not rewrite the entire document — provide a structured review only."
)


def extract_text_from_pdf(pdf_path):
    document = fitz.open(pdf_path)
    text = []
    for page in document:
        text.append(page.get_text())
    document.close()
    return "\n".join(text)


def build_review_prompt(contract_text):
    return (
        "Please review the following legal contract and provide a structured analysis.\n\n"
        "Your review should cover:\n"
        "1. Unclear or inconsistent terms\n"
        "2. Missing sections or standard clauses\n"
        "3. Ambiguous language that could cause disputes\n"
        "4. Specific suggestions to improve clarity and enforceability\n\n"
        f"Contract text:\n{contract_text}"
    )


def review_contract(file_path):
    if not client:
        raise RuntimeError("Missing GROQ_API_KEY. Add it to your .env file.")

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

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=2048,
    )

    review_text = response.choices[0].message.content
    if not review_text:
        raise RuntimeError("AI did not return a review.")

    return review_text.strip()
