/**
 * Document Summarizer Application
 * 
 * This React component provides a user interface for uploading PDF or TXT documents
 * and generating summaries using a backend API. It handles file validation,
 * error states, loading states, and displays the generated summary.
 * 
 * Features:
 * - File upload with type validation (PDF/TXT)
 * - Real-time error feedback
 * - Loading state management
 * - Responsive design
 * - API integration with timeout handling
 */

import React, { useState } from "react";
import axios from "axios";

function App() {
    // State management for document handling
    const [selectedDocument, setSelectedDocument] = useState(null);  // Stores the uploaded document
    const [documentSummary, setDocumentSummary] = useState("");     // Stores the generated summary
    const [errorMessage, setErrorMessage] = useState("");           // Stores error messages
    const [isSummarizing, setIsSummarizing] = useState(false);     // Tracks summarization process

    /**
     * Handles document file selection and validation
     * @param {Event} event - The file input change event
     */
    const handleDocumentSelection = (event) => {
        const uploadedDocument = event.target.files[0];
        // Validate file type (PDF or TXT only)
        if (uploadedDocument && (uploadedDocument.type === 'application/pdf' || uploadedDocument.type === 'text/plain')) {
            setSelectedDocument(uploadedDocument);
            setErrorMessage(""); // Clear any existing errors
        } else {
            setErrorMessage("Please upload a valid PDF or TXT file.");
            setSelectedDocument(null);
        }
    };

    /**
     * Handles the document summarization process
     * Makes an API call to the backend service and manages the response
     */
    const handleSummarizeDocument = async () => {
        // Validate document existence
        if (!selectedDocument) {
            setErrorMessage("Please upload a document.");
            return;
        }

        // Reset states before processing
        setErrorMessage("");
        setDocumentSummary("");
        setIsSummarizing(true);

        // Prepare form data for API request
        const documentData = new FormData();
        documentData.append("file", selectedDocument);

        try {
            // Make API request to summarization endpoint
            const apiResponse = await axios.post(
                "http://127.0.0.1:5000/summarize", 
                documentData, 
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 30000, // 30 second timeout to prevent hanging
                }
            );
            // Update summary with API response
            setDocumentSummary(apiResponse.data.summary || "No summary available.");
        } catch (error) {
            // Handle API errors and provide user feedback
            setErrorMessage(
                error.response?.data?.error || 
                "Failed to summarize the document. Please try again."
            );
        } finally {
            // Reset loading state regardless of outcome
            setIsSummarizing(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Document Summarizer</h1>
            
            <div className="upload-section">
                <label className="file-label">
                    <input 
                        type="file" 
                        onChange={handleDocumentSelection} 
                        accept=".pdf,.txt"
                        className="file-input"
                    />
                    <span className="file-button">Choose File</span>
                    <span className="file-name">
                        {selectedDocument ? selectedDocument.name : "No file selected"}
                    </span>
                </label>
                <button 
                    onClick={handleSummarizeDocument} 
                    disabled={!selectedDocument || isSummarizing}
                    className="submit-button"
                >
                    {isSummarizing ? "Summarizing..." : "Summarize"}
                </button>
            </div>
            
            {errorMessage && (
                <div className="error-container">
                    <p className="error-message">{errorMessage}</p>
                </div>
            )}
            
            {documentSummary && (
                <div className="summary-section">
                    <h3 className="summary-title">Summary:</h3>
                    <div className="summary-content">
                        <p className="summary-text">{documentSummary}</p>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #ffffff;
                    min-height: 100vh;
                }

                .title {
                    color: #2C3E50;
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .upload-section {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    margin: 2rem 0;
                    flex-wrap: wrap;
                }

                .file-label {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                    min-width: 250px;
                }

                .file-input {
                    display: none;
                }

                .file-button {
                    background-color: #34495E;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .file-button:hover {
                    background-color: #2C3E50;
                }

                .file-name {
                    color: #2C3E50;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .submit-button {
                    padding: 0.75rem 1.5rem;
                    background-color: #3498DB;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1rem;
                    font-weight: 500;
                    min-width: 120px;
                }

                .submit-button:hover:not(:disabled) {
                    background-color: #2980B9;
                    transform: translateY(-1px);
                }

                .submit-button:disabled {
                    background-color: #BDC3C7;
                    cursor: not-allowed;
                }

                .error-container {
                    background-color: #FFEBEE;
                    border-left: 4px solid #EF5350;
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 4px;
                }

                .error-message {
                    color: #C62828;
                    margin: 0;
                    font-size: 0.9rem;
                }

                .summary-section {
                    margin-top: 2rem;
                    background-color: #F8F9FA;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .summary-title {
                    color: #2C3E50;
                    padding: 1rem;
                    margin: 0;
                    border-bottom: 1px solid #E9ECEF;
                }

                .summary-content {
                    padding: 1.5rem;
                }

                .summary-text {
                    color: #2C3E50;
                    line-height: 1.6;
                    margin: 0;
                    font-size: 1rem;
                    white-space: pre-wrap;
                }

                @media (max-width: 600px) {
                    .container {
                        padding: 1rem;
                    }

                    .upload-section {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .submit-button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
