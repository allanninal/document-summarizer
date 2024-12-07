
# Document Summarizer

The Document Summarizer leverages Hugging Face’s **facebook/bart-large-cnn** model to simplify the process of summarizing lengthy documents. This app allows users to upload **PDF** or **plain text** files and generates concise, human-readable summaries. It combines a **ReactJS (Vite)** frontend with a **Flask** backend for efficient processing.

---

## Features

- **File Upload Support**: Accepts both `.pdf` and `.txt` files for summarization.
- **Concise Summaries**: Generates readable and concise summaries of lengthy documents.
- **Secure Processing**: Files are temporarily stored during processing and deleted after use.
- **Modern Technology Stack**:
  - **Frontend**: ReactJS and Vite.
  - **Backend**: Flask.
  - **Summarization**: Hugging Face’s `facebook/bart-large-cnn`.

---

## Tech Stack

### **Frontend**
- ReactJS with Vite for responsive and fast UI.
- Axios for API requests.

### **Backend**
- Flask for API handling and text processing.
- pdfplumber for extracting text from PDF files.

### **AI Model**
- Hugging Face’s **facebook/bart-large-cnn** for abstractive text summarization.

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone git@github.com:allanninal/document-summarizer.git
cd document-summarizer
```

### 2. Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies using `requirements.txt` from the backend folder:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the Flask backend:
   ```bash
   python backend/app.py
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

Visit the app at `http://localhost:5173`.

---

## How It Works

1. **Upload a Document**: Upload `.pdf` or `.txt` files through the frontend.
2. **Text Extraction**: The backend extracts text using `pdfplumber` or reads plain text files.
3. **Summarization**: The extracted text is processed through Hugging Face’s `facebook/bart-large-cnn` model to generate a concise summary.
4. **Display Results**: The frontend displays the summary in real time.

---

## Future Enhancements

1. **Support for Large Documents**: Chunk large files and summarize them section by section.
2. **Multilingual Summarization**: Add support for non-English texts using multilingual models.
3. **Save Summaries**: Enable users to download summaries in `.txt` or `.pdf` formats.
4. **Enhanced UI/UX**: Add drag-and-drop file upload and progress indicators.
5. **Customizable Summaries**: Allow users to choose between short, medium, or detailed summaries.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

If you find this project helpful, consider supporting me on Ko-fi:  
[ko-fi.com/allanninal](https://ko-fi.com/allanninal)

---

## Explore More Projects

For more exciting projects, check out my list of **AI Mini Projects**:  
[Mini AI Projects GitHub List](https://github.com/stars/allanninal/lists/mini-ai-projects)
