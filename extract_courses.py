"""
Script to extract course data from PDFs using OCR
Requires: pip install pdfplumber pytesseract pillow
And Tesseract OCR installed on system
"""
import json
from pathlib import Path

# This is a placeholder - you'll need to install Tesseract OCR
# and use pytesseract to extract text from image PDFs

# For now, let's create a structure based on what we know
# You can manually fill in the missing data or use OCR

branches_map = {
    "CSE": "CSE.pdf",
    "EEE": "EEE.pdf", 
    "ECE": "ECE.pdf",
    "ME": "ME.pdf",
    "CE": "CE.pdf",
    "CL": "CL.pdf",
    "CST": "CST.pdf",
    "BSBE": "BSBE.pdf",
    "EP": "EP.pdf",
    "MnC": "MnC.pdf",
    "EN": "EN.pdf",
    "DSAI": "DSAI.pdf"
}

print("To extract from PDFs, you need:")
print("1. Install Tesseract OCR: https://github.com/UB-Mannheim/tesseract/wiki")
print("2. pip install pytesseract pdfplumber pillow")
print("3. Run this script with OCR enabled")



