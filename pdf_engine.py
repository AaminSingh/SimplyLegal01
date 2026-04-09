from fpdf import FPDF
import unicodedata
import uuid
import os
import base64


def _sanitize(text: str) -> str:
    """Replace common unicode / smart-punctuation chars with ASCII equivalents."""
    text = unicodedata.normalize("NFKD", text)
    replacements = {
        "\u2018": "'",  "\u2019": "'",   # curly single quotes
        "\u201c": '"',  "\u201d": '"',   # curly double quotes
        "\u2013": "-",  "\u2014": "--",  # en-dash / em-dash
        "\u2022": "-",                    # bullet point
        "\u2026": "...",                  # ellipsis
        "\u00a0": " ",                    # non-breaking space
        "\u00b0": "deg",
        "\u00a9": "(c)",
        "\u00ae": "(R)",
    }
    for char, repl in replacements.items():
        text = text.replace(char, repl)
    return text.encode("latin-1", "ignore").decode("latin-1")


def text_to_pdf(text: str, party_name: str, signature_base64: str = None) -> str:
    """Convert contract text to a PDF file. Raises on failure."""

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Calculate effective content width AFTER add_page (avoids fpdf2 2.8 w=0 bug)
    eff_w = pdf.w - pdf.l_margin - pdf.r_margin

    safe_text = _sanitize(str(text))

    for raw_line in safe_text.split("\n"):
        # Strip markdown artifacts
        line = (
            raw_line
            .replace("**", "")
            .replace("__", "")
            .replace("*", "")
            .lstrip("# ")
            .strip()
        )

        if not line:
            pdf.ln(3)
            continue

        # Heading detection: ALL CAPS short line, or starts with a digit+period
        is_heading = (
            (line.isupper() and len(line) < 100)
            or (len(line) < 120 and line[:3].rstrip(". ").isdigit())
        )

        if is_heading:
            pdf.set_font("Helvetica", "B", 12)
            pdf.ln(2)
        else:
            pdf.set_font("Helvetica", "", 11)

        pdf.multi_cell(eff_w, 6, line)

    if signature_base64:
        # Check for data URI prefix and strip it
        if "," in signature_base64:
            header, encoded = signature_base64.split(",", 1)
        else:
            encoded = signature_base64
            
        try:
            image_data = base64.b64decode(encoded)
            temp_image_path = f"temp_sig_{uuid.uuid4().hex[:8]}.png"
            with open(temp_image_path, "wb") as img_file:
                img_file.write(image_data)
                
            pdf.ln(10)
            pdf.set_font("Helvetica", "B", 11)
            pdf.cell(0, 10, "First Party Signature:", ln=True)
            
            pdf.image(temp_image_path, x=15, w=60)
            pdf.ln(25)
            
            os.remove(temp_image_path)
        except Exception as e:
            print(f"Error processing signature: {e}")

    # Build a safe filename
    safe_name = "".join(
        c if c.isalnum() or c in "-_" else "_" for c in party_name
    )[:30]
    filename = f"contract_{safe_name}_{uuid.uuid4().hex[:8]}.pdf"

    pdf_bytes = pdf.output()
    with open(filename, "wb") as f:
        f.write(pdf_bytes)

    return os.path.abspath(filename)
