"use client"; // Make sure to enable client-side functionality
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup'); // Redirects the user to the signup page
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between py-16 px-4">

        {/* Text Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Organize Your Study Materials with Ease
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload textbooks, take notes, and create flashcards—all in one place.
          </p>
          <button 
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            onClick={handleGetStarted} // This will take the user to the signup page
          >
            Get Started
          </button>
        </div>

        {/* Image / Illustration */}
        <div className="md:w-1/2">
          <img src="Capstone-1.png" alt="Student with textbooks" className="w-full rounded" />
        </div>
      </div>
    </section>
  );
}