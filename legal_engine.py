import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

SYSTEM_PROMPT = (
    "You are a professional legal document drafting assistant specializing in small business contracts. "
    "You draft clear, professional, and legally sound contracts following standard legal conventions. "
    "Always return only the complete contract text — no preamble, no commentary, and no extra explanations outside the document."
)


def build_contract_prompt(contract_type, party_name, state, agreement_type=None, purpose=None):
    extras = ""
    if agreement_type:
        label = "Mutual (both parties share equal obligations)" if agreement_type == "mutual" else "One-Way (only one party is bound)"
        extras += f"\nAgreement structure: {label}"
    if purpose:
        extras += f"\nPrimary purpose: {purpose}"

    return (
        f"Draft a complete and professional {contract_type} for a small business with the following details:\n\n"
        f"Contract type: {contract_type}\n"
        f"Party name(s): {party_name}\n"
        f"Governing state: {state}"
        f"{extras}\n\n"
        "Requirements:\n"
        "- Use clear numbered headings and clauses\n"
        "- Include all standard sections: parties, recitals, purpose, obligations, "
        "confidentiality (if applicable), term, termination, and governing law\n"
        "- Use professional but plain language\n"
        "- Return only the contract text with no additional commentary"
    )


def generate_contract(contract_type, party_name, state, agreement_type=None, purpose=None):
    if not client:
        raise RuntimeError("Missing GROQ_API_KEY. Add it to your .env file.")

    prompt = build_contract_prompt(contract_type, party_name, state, agreement_type, purpose)

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=4096,
    )

    contract_text = response.choices[0].message.content
    if not contract_text:
        raise RuntimeError("AI did not return contract text.")

    return contract_text.strip()
