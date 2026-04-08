import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def build_contract_prompt(contract_type, party_name, state):
    return f"""
Write a professional contract for a small business with the details below.

Contract type: {contract_type}
Party name: {party_name}
Governing state: {state}

Instructions:
- Use clear headings and numbered clauses.
- Include parties, purpose, obligations, confidentiality, termination, and governing law.
- Keep the language professional and easy to understand.
- Return only the contract text, with no extra commentary.
"""


def generate_contract(contract_type, party_name, state):
    if not GEMINI_API_KEY:
        raise RuntimeError("Missing GEMINI_API_KEY environment variable. Add it to .env or your environment.")

    prompt = build_contract_prompt(contract_type, party_name, state)
    model = genai.GenerativeModel(GEMINI_MODEL)
    response = model.generate_content(prompt)

    contract_text = getattr(response, "text", None)
    if not contract_text:
        raise RuntimeError("AI did not return contract text.")

    return contract_text.strip()
