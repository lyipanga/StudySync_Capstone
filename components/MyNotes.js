import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import axios from "axios"; // Make sure axios is installed

export default function MyNotes() {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [noteContent, setNoteContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file

  // Load saved notes and the uploaded PDF from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNoteContent(savedNotes); // Set note content from localStorage
    }

    const pdfPath = localStorage.getItem("uploadedPDF");
    if (pdfPath) {
      setSelectedPDF(pdfPath); // Set selected PDF path
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleNoteChange = (e) => {
    const newNotes = e.target.value;
    setNoteContent(newNotes);

    // Save the new notes to localStorage
    localStorage.setItem("notes", newNotes);
  };

  // Upload file function (Integrated from UploadTextbook.js)
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filePath = response.data.file.path;

      // Store the file path in local storage and set the PDF to display
      localStorage.setItem("uploadedPDF", filePath);
      setSelectedPDF(filePath);

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Notes</h1>

      {/* Upload Section */}
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload PDF
        </button>
      </div>

      {/* Grid Layout for PDF Viewer and Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: PDF Viewer */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          {selectedPDF ? (
            <Document
              file={selectedPDF}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error("Error loading PDF:", error)
              }
            >
              <Page pageNumber={pageNumber} />
            </Document>
          ) : (
            <p className="text-center text-gray-500">
              No PDF found. Please upload a PDF.
            </p>
          )}

          {numPages && (
            <div className="text-center mt-2">
              <p>
                Page {pageNumber} of {numPages}
              </p>
              <button
                onClick={() =>
                  setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)
                }
                className="mr-4 bg-gray-300 px-3 py-1 rounded"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPageNumber(
                    pageNumber < numPages ? pageNumber + 1 : numPages
                  )
                }
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Note-Taking Section */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <textarea
            value={noteContent}
            onChange={handleNoteChange}
            placeholder="Start taking your notes here..."
            className="w-full h-full p-4 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}
