"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [pdfFile, setPdfFile] = useState(null); // State to hold selected PDF file
  const [pageNumber, setPageNumber] = useState(1); // Page number for PDF
  const [numPages, setNumPages] = useState(null); // Total number of pages in PDF

  // Load notes from local storage when the component mounts
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  // Handle the submission of a new note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (note.trim() === "") return;

    setNotes([...notes, note]);
    setNote(""); // Clear the input
  };

  // Save notes to local storage with a custom name
  const saveNotesToLocalStorage = () => {
    const noteName = prompt("Enter a name for this note set:");
    if (noteName) {
      localStorage.setItem(noteName, JSON.stringify(notes));
      alert(`Notes saved as "${noteName}"`);
    }
  };

  // Load selected PDF file
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  return (
    <div className="container mx-auto py-8 text-black flex">
      {/* Note-Taking Section */}
      <div className="w-1/2 pr-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Take a Note</h1>

        <form onSubmit={handleAddNote} className="mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
            rows="4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={saveNotesToLocalStorage}
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Save Notes
          </button>
        </form>

        <div className="notes-list mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
          {notes.length === 0 ? (
            <p>No notes yet. Start by adding one!</p>
          ) : (
            <ul>
              {notes.map((note, index) => (
                <li key={index} className="border-b border-gray-300 py-2">
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PDF Viewer Section */}
      <div className="w-1/2 pl-4">
        <h2 className="text-2xl font-bold mb-4 text-center">PDF Viewer</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="mb-4"
        />

        {pdfFile ? (
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
            className="border border-gray-300 rounded-md"
          >
            <Page pageNumber={pageNumber} />
          </Document>
        ) : (
          <p className="text-center">Upload a PDF to view it here.</p>
        )}

        {numPages && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-300 text-black py-1 px-3 rounded-md mr-2"
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              className="bg-gray-300 text-black py-1 px-3 rounded-md ml-2"
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
