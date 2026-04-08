import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the library
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_contract(contract_type, party_name, state):
    # Temporary mock response so you can keep building the PDF features
    return f"""
    # {contract_type}
    This agreement is made between {party_name} in the state of {state}.
    
    1. PURPOSE: This is a placeholder document for testing purposes.
    2. TERMS: The AI quota is currently resetting.
    """