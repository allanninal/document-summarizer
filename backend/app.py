"""
Document Summarization API

This Flask application provides an API endpoint for summarizing PDF and text documents.
It uses the BART-large-CNN model for text summarization and supports both PDF and TXT files.

Key Features:
- File upload handling
- PDF and TXT file processing
- Text extraction
- Automatic text summarization
- Error handling and validation
- Temporary file management

Dependencies:
- Flask: Web framework
- flask_cors: Cross-origin resource sharing
- transformers: Hugging Face transformers for summarization
- pdfplumber: PDF text extraction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import pdfplumber
import os
from typing import Optional

# Application Configuration
MAX_TEXT_LENGTH = 1024  # Maximum number of characters to process
MAX_SUMMARY_LENGTH = 130  # Maximum length of generated summary
MIN_SUMMARY_LENGTH = 30  # Minimum length of generated summary
ALLOWED_EXTENSIONS = {'pdf', 'txt'}  # Supported file types
TEMP_DIR = "temp"  # Directory for temporary file storage

# Initialize Flask application and CORS
app = Flask(__name__)
CORS(app)

# Initialize the summarization model
# Using facebook/bart-large-cnn model which is optimized for news article summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def is_valid_file_extension(filename: str) -> bool:
    """
    Validate if the uploaded file has an allowed extension.
    
    Args:
        filename (str): Name of the uploaded file
        
    Returns:
        bool: True if file extension is allowed, False otherwise
        
    Example:
        >>> is_valid_file_extension("document.pdf")
        True
        >>> is_valid_file_extension("document.doc")
        False
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_file(file_path: str, file_extension: str) -> Optional[str]:
    """
    Extract text content from the uploaded file based on its type.
    
    Args:
        file_path (str): Path to the temporary stored file
        file_extension (str): Extension of the file ('pdf' or 'txt')
        
    Returns:
        Optional[str]: Extracted text content or None if extraction fails
        
    Raises:
        ValueError: If text extraction encounters an error
        
    Example:
        >>> text = extract_text_from_file("/temp/doc.pdf", "pdf")
    """
    try:
        if file_extension == 'pdf':
            # Handle PDF files using pdfplumber
            with pdfplumber.open(file_path) as pdf_document:
                # Extract text from each page and join with spaces
                return " ".join(page.extract_text() or "" for page in pdf_document.pages).strip()
        else:  # txt file
            # Handle plain text files
            with open(file_path, 'r', encoding='utf-8') as text_file:
                return text_file.read().strip()
    except Exception as error:
        raise ValueError(f"Error extracting text: {str(error)}")

@app.route('/summarize', methods=['POST'])
def summarize_document():
    """
    API endpoint to handle document upload and generate summary.
    
    Expected input: Multipart form data with a 'file' field containing the document
    
    Returns:
        JSON response containing:
        - summary: Generated summary text
        - original_length: Length of original text
        - summary_length: Length of generated summary
        - error: Error message if processing fails
        
    HTTP Status Codes:
        200: Success
        400: Invalid request (missing file, invalid type)
        500: Server error during processing
    """
    try:
        # Step 1: Validate file upload
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files['file']
        if not uploaded_file or not uploaded_file.filename:
            return jsonify({"error": "Invalid file"}), 400

        # Step 2: Validate file extension
        if not is_valid_file_extension(uploaded_file.filename):
            return jsonify({"error": f"Unsupported file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

        # Step 3: Set up temporary storage
        os.makedirs(TEMP_DIR, exist_ok=True)
        temporary_file_path = os.path.join(TEMP_DIR, uploaded_file.filename)

        try:
            # Step 4: Save and process the uploaded file
            uploaded_file.save(temporary_file_path)
            file_extension = uploaded_file.filename.rsplit('.', 1)[1].lower()
            extracted_text = extract_text_from_file(temporary_file_path, file_extension)

            # Step 5: Validate extracted text
            if not extracted_text:
                return jsonify({"error": "No text could be extracted from the file"}), 400

            # Step 6: Truncate text if it exceeds maximum length
            if len(extracted_text) > MAX_TEXT_LENGTH:
                extracted_text = extracted_text[:MAX_TEXT_LENGTH]

            # Step 7: Generate summary using the BART model
            generated_summary = summarizer(
                extracted_text,
                max_length=MAX_SUMMARY_LENGTH,
                min_length=MIN_SUMMARY_LENGTH,
                do_sample=False  # Deterministic generation
            )[0]['summary_text']

            # Step 8: Return successful response with summary
            return jsonify({
                "summary": generated_summary,
                "original_length": len(extracted_text),
                "summary_length": len(generated_summary)
            })

        finally:
            # Step 9: Clean up - Remove temporary file
            if os.path.exists(temporary_file_path):
                os.remove(temporary_file_path)

    except Exception as error:
        # Step 10: Handle any unexpected errors
        return jsonify({
            "error": "An error occurred while processing the file",
            "details": str(error)
        }), 500

if __name__ == '__main__':
    # Run the Flask application in debug mode when executed directly
    app.run(debug=True)
