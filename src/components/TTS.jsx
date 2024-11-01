import React, { useEffect, useState, useRef } from "react";
import "../assets/css/SideBar.css";
import "../assets/css/tooltip.css";

export default function TTS({ content }) {
  const [drawer, setDrawer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const drawerRef = useRef(null);
  const utteranceRef = useRef(null);

  const toggleDrawer = () => setDrawer(!drawer);

  // Fetch available voices, with improved handling for asynchronous loading
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // Set a default voice if available
      }
    };

    // Call populateVoices immediately in case voices are already loaded
    populateVoices();

    // Add event listener for when voices are loaded asynchronously
    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }, []);

  // TTS toggle function
  const toggleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    if (isSpeaking) {
      // If already speaking, cancel the current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // If not speaking, start a new speech with the selected voice
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
      utteranceRef.current.onend = () => setIsSpeaking(false); // Reset state when speech ends
      window.speechSynthesis.speak(utteranceRef.current);
      setIsSpeaking(true);
    }
  };

  // Close drawer when clicked outside
  useEffect(() => {
    const handleClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawer(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={drawerRef} className="tooltip">
      <button
        onClick={toggleDrawer}
        className="flex aspect-square w-16 items-center justify-center hover:scale-110 active:scale-95 cursor-pointer transition-transform hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
          />
        </svg>
      </button>
      <span className="tooltip-text">AI speech reading</span>
      {drawer && (
        <div
          className={`flex flex-col fixed top-0 left-0 z-40 h-[70vh] p-4 overflow-y-auto bg-white w-80 shadow-md rounded-sm dark:bg-gray-800 dark:shadow-lg ${
            window.innerWidth < 768
              ? "animate-fade-in-slide-up-from-bottom"
              : "animate-fade-in-slide-up"
          } ${window.innerWidth < 768 ? "w-full" : "w-80"}`}
        >
          <div>
            <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="ms-2">AI reading</span>
            </h5>
            <button
              onClick={toggleDrawer}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          {/* Voice Selector */}
          <div className="mb-4">
            <label
              htmlFor="voiceSelect"
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Select Voice:
            </label>
            <select
              id="voiceSelect"
              onChange={(e) =>
                setSelectedVoice(
                  voices.find((voice) => voice.name === e.target.value)
                )
              }
              className="block w-full mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded"
              value={selectedVoice ? selectedVoice.name : ""}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* AI TTS */}
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => toggleSpeak(content)}
              className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isSpeaking ? "Stop Reading" : "Start Reading"}
            </p>
          </div>

          {/* Close Drawer */}
        </div>
      )}
    </div>
  );
}
