"use client";
import { useState } from "react";

export default function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Notes</h1>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="Write your note here..."
      />

      <button
        onClick={handleAddNote}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Add Note
      </button>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Saved Notes</h2>
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li key={index} className="p-4 bg-gray-100 border rounded-md">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}