"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [purpose, setPurpose] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Function to save profile data to local storage
  const handleSaveInformation = () => {
    const profileData = { firstName, lastName, age, gender, purpose };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    setSavedMessage("Profile information saved successfully!");
  };

  // Message based on the purpose selected
  const getPurposeMessage = () => {
    switch (purpose) {
      case "school":
        return "This is a good way for you to study for your exams, quizzes, and to remember your material.";
      case "work":
        return "This is a good way to prep yourself for presentations in your workplace.";
      case "certification":
        return "This is a good way to study to be certified in your field.";
      case "personal":
        return "This is a good way to motivate yourself.";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Page</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-black font-semibold">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-black font-semibold">Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select the purpose</option>
            <option value="school">School</option>
            <option value="work">Work</option>
            <option value="certification">Certification</option>
            <option value="personal">Personal Use</option>
          </select>
        </div>
      </form>

      {purpose && (
        <div className="mt-6 p-4 bg-blue-100 rounded-md text-black">
          <p>{getPurposeMessage()}</p>
        </div>
      )}

      {/* Save Information Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSaveInformation}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Save Information
        </button>
      </div>

      {/* Display Saved Message */}
      {savedMessage && (
        <div className="mt-4 text-center text-green-600">
          <p>{savedMessage}</p>
        </div>
      )}
    </div>
  );
}
