"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

// Set the correct worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setPreviewFile(URL.createObjectURL(file)); // Generate preview URL for the PDF
    } else {
      alert("Please select a valid PDF file.");
      setPreviewFile(null); // Clear preview if the file is not a valid PDF
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUploadStatus("File uploaded successfully");
      } else {
        setUploadStatus("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file");
    }
  };

  return (
    <div className="container mx-auto py-8 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Upload Your Textbook
      </h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewFile && (
        <Document
          file={previewFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("Error loading PDF:", error)}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      )}

      {numPages && (
        <div className="mt-4 text-center">
          <p className="text-black">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
      >
        Upload
      </button>

      {uploadStatus && (
        <div className="mt-4 text-center text-black">{uploadStatus}</div>
      )}
    </div>
  );
}
