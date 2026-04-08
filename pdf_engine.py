from fpdf import FPDF
import uuid # For unique filenames
import os

def text_to_pdf(text, party_name):
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=12)
        
        # Clean text for PDF compatibility
        clean_text = str(text).encode('latin-1', 'replace').decode('latin-1')
        
        for line in clean_text.split('\n'):
            safe_line = line.replace('**', '').replace('#', '').replace('*', '').strip()
            if safe_line:
                pdf.multi_cell(180, 10, txt=safe_line)
        
        # Create a unique filename so it never conflicts
        unique_id = str(uuid.uuid4())[:8]
        filename = f"contract_{party_name}_{unique_id}.pdf".replace(" ", "_")
        
        # Save to the current directory
        pdf.output(filename)
        
        # Absolute path verification
        return os.path.abspath(filename)
    except Exception as e:
        print(f"PDF Logic Error: {e}")
        return None