import React, { useEffect, useState, useRef, useContext } from "react";
import { TTSContext } from "./context/TTSContext";
import TextTTS from "./TextTTS";
import AudioTTS from "./AudioTTS";
import "../assets/css/SideBar.css";
import "../assets/css/tooltip.css";
import "../assets/css/AudioPlayer.css";

export default function TTS() {
  //------------------------- Drawer control---------------------------------------------
  const { drawer, setDrawer, toggleDrawer } = useContext(TTSContext);
  const drawerRef = useRef(null);

  const { minimized, setMinimized } = useContext(TTSContext);

  useEffect(() => {
    const handleClick = (event) => {
      //check the click is on the drawer
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawer(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  //------------------------------------------------------------------------
  const [audio_available, setAudioAvailable] = useState(true);

  //------------------------------------------------------------------------

  return (
    <div className="tooltip" ref={drawerRef}>
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
        <div
          className={`${drawer? "":"hidden"} flex flex-col fixed top-0 left-0 z-40 p-4 bg-white ${
            window.innerWidth < 768
              ? "animate-fade-in-slide-up-from-bottom"
              : "animate-fade-in-slide-up"
          } ${
            window.innerWidth < 768 ? "w-full h-[80vh]" : "w-[500px] h-[70vh]"
          } transition-all duration-300`}
        >
          <div>
            <h5
              className={`inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400`}
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
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className={`ms-2`}>
                AI reading
              </span>
            </h5>

            <button
              onClick={toggleDrawer}
              className={`text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white`}
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

          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setAudioAvailable(true)}
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                audio_available
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span>Audio Based</span>
              {audio_available && (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => setAudioAvailable(false)}
              className={`flex items-center justify-between w-full p-2 rounded-lg ${
                !audio_available
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span>Text Based</span>
              {!audio_available && (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </div>
          {audio_available ? <AudioTTS /> : <TextTTS />}
        </div>
    </div>
  );
}
