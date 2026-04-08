import fitz  # PyMuPDF
import google.generativeai as genai
import os

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def review_contract(file_path):
    contract_text = extract_text_from_pdf(file_path)
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""
    Analyze the following legal contract and provide a response in JSON format:
    1. "summary": A 2-sentence explanation of the contract.
    2. "risks": A list of potential red flags for a small business owner.
    3. "missing": Key clauses that are absent (e.g., termination, force majeure).
    4. "rating": A score from 1-10 on how "fair" it is.

    Contract Text:
    {contract_text[:5000]} 
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Review Error: {str(e)}"