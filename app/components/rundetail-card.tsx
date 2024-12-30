import React, { useState } from "react";
import { Sword, ShieldPlus, MessageSquareMore, HeartPulse, CheckCircle } from "lucide-react";

interface CardProps {
  name: string;
  realm: string;
  slug: string; // Unique identifier for the run
}

const saveBehaviorToUpstash = async (slug: string, behavior: string) => {
  try {
    const response = await fetch("/api/saveBehavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, behavior }),
    });

    if (!response.ok) {
      throw new Error("Failed to save behavior");
    }
    console.log("Behavior saved successfully");
  } catch (error) {
    console.error(error);
  }
};

const saveRejoinRating = async (slug: string, rating: boolean) => {
  const payload = { slug, rating: rating.toString() };

  try {
    const response = await fetch("/api/saveRejoinRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save rejoin rating");
    }

    console.log("Rejoin Rating saved successfully");
  } catch (error) {
    console.error("Error in saveRejoinRating:", error);
  }
};

export const RunDetailCard: React.FC<CardProps> = ({ name, realm, slug }) => {
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);
  const [showRejoinQuestion, setShowRejoinQuestion] = useState(false);
  const [selectedRejoinRating, setSelectedRejoinRating] = useState<boolean | null>(null);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleButtonClick = (behavior: string) => {
    saveBehaviorToUpstash(slug, behavior);
    setSelectedBehavior(behavior);
    setShowRejoinQuestion(true);
    setShowThankYouMessage(false); // Clear the "Thank you" message when a new behavior is selected
    setSelectedRejoinRating(null); // Reset the rejoin rating when a new behavior is selected
  };

  const handleRejoinRating = (rating: boolean) => {
    saveRejoinRating(slug, rating);
    setSelectedRejoinRating(rating);
    setShowThankYouMessage(true); // Show the "Thank you" message only after submitting rating
    setShowRejoinQuestion(false); // Optionally hide the rejoin question after rating is submitted
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{realm}</p>
      </div>
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        <button
          onClick={() => handleButtonClick("Big Dam")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          <Sword className="w-5 h-5 mr-2" />
          Big Dam
        </button>
        <button
          onClick={() => handleButtonClick("Uses Defensives")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <ShieldPlus className="w-5 h-5 mr-2" />
          Uses Defensives
        </button>
        <button
          onClick={() => handleButtonClick("Good Comms")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none"
        >
          <MessageSquareMore className="w-5 h-5 mr-2" />
          Good Comms
        </button>
        <button
          onClick={() => handleButtonClick("Giga Heals")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
        >
          <HeartPulse className="w-5 h-5 mr-2" />
          Giga Heals
        </button>
      </div>
      {selectedBehavior && (
        <div className="mt-4 text-center text-lg text-green-700 flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-semibold">
            Nice! <span className="text-gray-900">{selectedBehavior}</span> was recorded for <span className="text-gray-900">{name}</span>.
          </span>
        </div>
      )}
      {showRejoinQuestion && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-800">Would you group with them again?</p>
          <div className="flex justify-center mt-2 gap-4">
            <button
              onClick={() => handleRejoinRating(true)}
              disabled={selectedRejoinRating !== null}
              className={`px-4 py-2 text-base font-medium ${selectedRejoinRating === true ? "bg-green-500 text-white" : "text-black bg-white"
                } border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none`}
            >
              Yes
            </button>
            <button
              onClick={() => handleRejoinRating(false)}
              disabled={selectedRejoinRating !== null}
              className={`px-4 py-2 text-base font-medium ${selectedRejoinRating === false ? "bg-red-500 text-white" : "text-black bg-white"
                } border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none`}
            >
              No
            </button>
          </div>
        </div>
      )}
      {showThankYouMessage && (
        <div className="mt-4 text-center text-lg text-green-700 flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-semibold">Thank you! Rejoin Rating submitted.</span>
        </div>
      )}
    </div>
  );
};