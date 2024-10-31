"use client";
import { useState, useEffect } from "react";

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  return (
    <div
      onClick={handleFlip}
      className="w-64 h-40 flex items-center justify-center cursor-pointer transition-transform duration-500 transform perspective"
      style={{
        perspective: "1000px",
        position: "relative",
      }}
    >
      {!flipped && (
        <div
          className="absolute w-full h-full flex items-center justify-center bg-blue-300 rounded-lg shadow-lg"
          style={{
            transform: "rotateY(0deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-xl text-black">{question}</p>
        </div>
      )}

      {flipped && (
        <div
          className="absolute w-full h-full flex items-center justify-center bg-green-300 rounded-lg shadow-lg"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-xl text-black">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FlashcardPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load flashcards from local storage when the component mounts
  useEffect(() => {
    const storedFlashcards = JSON.parse(localStorage.getItem("flashcards"));
    if (storedFlashcards) {
      setFlashcards(storedFlashcards);
    }
  }, []);

  const addFlashcard = (e) => {
    e.preventDefault();
    if (question.trim() === "" || answer.trim() === "") return;

    setFlashcards([...flashcards, { question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const saveFlashcardsToLocalStorage = () => {
    const flashcardName = prompt("Enter a name for this flashcard set:");
    if (flashcardName) {
      localStorage.setItem(flashcardName, JSON.stringify(flashcards));
      alert(`Flashcards saved as "${flashcardName}"`);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Flashcards</h1>

      <form onSubmit={addFlashcard} className="mb-4">
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
        >
          Add Flashcard
        </button>
        <button
          type="button"
          onClick={saveFlashcardsToLocalStorage}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Save Flashcards
        </button>
      </form>

      {flashcards.length > 0 && (
        <div className="flex flex-col items-center">
          <Flashcard
            question={flashcards[currentIndex].question}
            answer={flashcards[currentIndex].answer}
          />

          <div className="mt-4">
            <button
              onClick={goToPrevious}
              className="bg-gray-300 text-black py-1 px-3 rounded-md mr-2"
            >
              Previous
            </button>
            <button
              onClick={goToNext}
              className="bg-gray-300 text-black py-1 px-3 rounded-md ml-2"
            >
              Next
            </button>
          </div>

          <p className="mt-2 text-black">
            Flashcard {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
      )}
    </div>
  );
}
