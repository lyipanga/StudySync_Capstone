"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [noteFolders, setNoteFolders] = useState([]);
  const [openedFolder, setOpenedFolder] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Index of note being edited

  useEffect(() => {
    const fetchPdfList = async () => {
      try {
        const response = await axios.get("/api/upload");
        if (response.data.success) {
          setPdfList(response.data.files);
        } else {
          console.error("Failed to retrieve PDF list");
        }
      } catch (error) {
        console.error("Error fetching PDF list:", error);
      }
    };
    fetchPdfList();

    const storedFolders = JSON.parse(localStorage.getItem("noteFolders")) || [];
    setNoteFolders(storedFolders);
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (note.trim() === "") return;
    if (editIndex !== null) {
      // Update existing note
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = note;
      setNotes(updatedNotes);
      setEditIndex(null); // Reset edit index
    } else {
      // Add new note
      setNotes([...notes, note]);
    }
    setNote(""); // Clear input after adding/updating
  };

  const saveNotesToLocalStorage = () => {
    if (notes.length === 0) {
      alert("No notes to save.");
      return;
    }

    const noteName = prompt("Enter a name for this note set:");
    if (noteName) {
      localStorage.setItem(noteName, JSON.stringify(notes));
      const updatedFolders = [...noteFolders, noteName];
      setNoteFolders(updatedFolders);
      localStorage.setItem("noteFolders", JSON.stringify(updatedFolders));
      setNotes([]);
      setOpenedFolder(null);
      alert(`Notes saved as "${noteName}"`);
    }
  };

  const toggleFolder = (folderName) => {
    if (openedFolder === folderName) {
      setOpenedFolder(null);
      setNotes([]);
    } else {
      const loadedNotes = JSON.parse(localStorage.getItem(folderName)) || [];
      setNotes(loadedNotes);
      setOpenedFolder(folderName);
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    if (openedFolder) {
      if (updatedNotes.length === 0) {
        localStorage.removeItem(openedFolder);
        const updatedFolders = noteFolders.filter(
          (folder) => folder !== openedFolder
        );
        setNoteFolders(updatedFolders);
        localStorage.setItem("noteFolders", JSON.stringify(updatedFolders));
        setOpenedFolder(null);
      } else {
        localStorage.setItem(openedFolder, JSON.stringify(updatedNotes));
      }
    }
  };

  const editNote = (index) => {
    setNote(notes[index]); // Load note content into text area
    setEditIndex(index); // Set the edit index to the current note's index
  };

  return (
    <div className="container mx-auto py-8 text-black flex">
      {/* Note-Taking Section */}
      <div className="w-1/2 pr-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Take a Note</h1>

        {/* Always Visible Note Input Area */}
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
            {editIndex !== null ? "Update Note" : "Add Note"}
          </button>
          <button
            type="button"
            onClick={saveNotesToLocalStorage}
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Save Notes
          </button>
        </form>

        {/* Current Notes List */}
        {notes.length > 0 && (
          <div className="notes-list mt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Current Notes</h2>
            <ul>
              {notes.map((note, index) => (
                <li
                  key={index}
                  className="border-b border-gray-300 py-2 flex justify-between items-center"
                >
                  <span>{note}</span>
                  <div>
                    <button
                      onClick={() => editNote(index)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(index)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note Folders List */}
        <div className="notes-list mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Note Folders</h2>
          {noteFolders.length === 0 ? (
            <p>No saved folders yet. Start by adding some notes!</p>
          ) : (
            <ul>
              {noteFolders.map((folder, index) => (
                <li key={index} className="py-2">
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="text-blue-500 hover:underline"
                  >
                    {folder}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Display Notes in the Selected Folder */}
        {openedFolder && (
          <div className="selected-notes mt-6">
            <h3 className="text-xl font-semibold mb-4">
              Notes in "{openedFolder}"
            </h3>
            {notes.length === 0 ? (
              <p>No notes in this folder.</p>
            ) : (
              <ul>
                {notes.map((note, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-300 py-2 flex justify-between items-center"
                  >
                    <span>{note}</span>
                    <div>
                      <button
                        onClick={() => editNote(index)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(index)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* PDF Viewer Section */}
      <div className="w-1/2 pl-4">
        <h2 className="text-2xl font-bold mb-4 text-center">PDF Viewer</h2>

        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">
            Select a PDF:
          </label>
          <select
            value={selectedPdf || ""}
            onChange={(e) => {
              setSelectedPdf(e.target.value);
              setPageNumber(1); // Reset to the first page
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a PDF</option>
            {pdfList.map((pdf) => (
              <option key={pdf} value={pdf}>
                {pdf}
              </option>
            ))}
          </select>
        </div>

        {selectedPdf ? (
          <div className="border border-gray-300 rounded-md">
            <Document
              file={`/uploads/${selectedPdf}`} // Make sure `selectedPdf` is the filename
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(error) => {
                console.error("Error loading PDF:", error);
                alert(
                  "Failed to load PDF file. Please make sure the file exists."
                );
              }}
            >
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>

            <div className="flex justify-between mt-4">
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

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setScale((prev) => prev + 0.1)}
                className="bg-blue-300 text-black py-1 px-3 rounded-md mr-2"
              >
                Zoom In
              </button>
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
                className="bg-blue-300 text-black py-1 px-3 rounded-md ml-2"
              >
                Zoom Out
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Select a PDF to view it here.</p>
        )}

        {numPages && (
          <div className="mt-4 text-center">
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
