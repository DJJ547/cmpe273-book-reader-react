import React, { useEffect, useState, useRef } from "react";
import "../assets/css/SideBar.css";
import "../assets/css/tooltip.css";
import "../assets/css/AudioPlayer.css";

export default function TTS({ content, bookcover, call_back_get_highlighted_paragraph }) {
  //------------------------- Drawer control---------------------------------------------
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(!drawer);
  const drawerRef = useRef(null);

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

  //---------------------------TTS player---------------------------------------------
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0); // Track current paragraph
  const [completedParagraphs, setCompletedParagraphs] = useState([]); // Track completed paragraphs

  const intervalRef = useRef(null);
  //--------------------------------get_highlted current paragraph--------------------
  useEffect(() => {
    if (isPlaying) {
        call_back_get_highlighted_paragraph(currentParagraphIndex);
    }
    else {
      call_back_get_highlighted_paragraph(null);
    }
  }, [isPlaying, currentParagraphIndex]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playCurrentParagraph();
    }
  };
  const handlePlayNext = () => {
    if (currentParagraphIndex < content.length - 1) {
      setCurrentParagraphIndex((prev) => {
        const nextIndex = prev + 1;
        playNextParagraph(nextIndex);
        return nextIndex;
      });
    }
  }
  const handlePlayPrevious = () => {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex((prev) => {
        const nextIndex = prev - 1;
        playNextParagraph(nextIndex);
        return nextIndex;
      });
    }
  }

  const playCurrentParagraph = () => {
    const currentText = content[currentParagraphIndex];

    if (window.responsiveVoice) {
      // Play ResponsiveVoice TTS for the current paragraph
      window.responsiveVoice.speak(currentText, "UK English Female", {
        onstart: () => setIsPlaying(true),
        onend: () => handleParagraphEnd(),
      });
    } else {
      alert("ResponsiveVoice is not available.");
    }
  };

  const handleParagraphEnd = () => {
    setCompletedParagraphs((prev) => [...prev, currentParagraphIndex]); // Mark paragraph as completed


    if (currentParagraphIndex < content.length - 1) {
      setCurrentParagraphIndex((prev) => {
        const nextIndex = prev + 1;
        playNextParagraph(nextIndex);
        return nextIndex;
      });
    }
    
  };

  const playNextParagraph = (index) => {
    const nextText = content[index];
    setCompletedParagraphs(Array.from({ length: index }, (_, i) => i)); // Mark all previous paragraphs as completed

    if (window.responsiveVoice) {
      // Play ResponsiveVoice TTS for the next paragraph
      window.responsiveVoice.speak(nextText, "UK English Female", {
        onstart: () => setIsPlaying(true),
        onend: () => handleParagraphEnd(),
      });
    } else {
      alert("ResponsiveVoice is not available.");
    }
  };

  const pauseAudio = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  const handleTimelineClick = (index) => {
    pauseAudio(); // Pause current playback
    setCurrentParagraphIndex(index); // Set selected paragraph as current
    setCompletedParagraphs(Array.from({ length: index }, (_, i) => i)); // Mark all previous paragraphs as completed
    playCurrentParagraph(); // Start playback from selected paragraph
  };
  //------------------------------------------------------------------------

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

          {/* AI TTS */}
          <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            responsiveVoice
          </h4>

          <div className="audio-player text-black outline outline-1 outline-gray-400 p-3">
            <img src={bookcover} className="h-[20vh] hidden md:flex"></img>
            {/* Play, Pause, Next, Previous buttons */}
            <div className="flex justify-center mt-3">
              <div className="bg-mycolor flex justify-around items-center w-full h-12 rounded-full shadow-md">
                {/* play Previous paragraph */}
                <button className={` px-4 text-sm font-medium hover:scale-110`} onClick={handlePlayPrevious}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
                    />
                  </svg>
                </button>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* play and pause */}
                <button onClick={handlePlayPause} className="play-pause-button px-4 text-sm font-medium hover:scale-110">
                  {!isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      />
                    </svg>
                  )}
                </button>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* play next paragraph */}
                <button className={` px-4 text-sm font-medium hover:scale-110`} onClick={handlePlayNext}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 7.189c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 15.311V7.189ZM12.75 7.189c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V7.189Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
              
            {/* Timeline with a percentage mark like 60% */}  
            <div className="timeline rounded-lg">
              {content.map((paragraph, index) => (
                <div
                  key={index}
                  className={`paragraph ${
                    completedParagraphs.includes(index)
                      ? "completed"
                      : index === currentParagraphIndex
                      ? "current"
                      : ""
                  }`}
                  onClick={() => handleTimelineClick(index)}
                >
                </div>
              ))}
              
            </div>

            
          </div>
          {/* Paragraph Display */}
          <div className="text-black paragraph-display outline-1 outline outline-gray-400">
              <p>{content[currentParagraphIndex]}</p>
          </div>

          {/* End */}
        </div>
      )}
    </div>
  );
}
