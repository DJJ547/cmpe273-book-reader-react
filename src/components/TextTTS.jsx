import React, { useContext } from "react";
import { TTSContext } from "./context/TTSContext";

export default function TextTTS() {
  const {
    content,
    bookcover,
    handlePlayPause,
    handlePlayNext,
    handlePlayPrevious,
    isPlaying,
    currentParagraphIndex,
    completedParagraphs,
    handleTimelineClick,
  } = useContext(TTSContext);
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      {/* AI TTS */}
      <div className="audio-player text-black outline outline-1 outline-gray-400 p-3 w-[80%]">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          responsiveVoice
        </h4>
        <img src={bookcover} className="h-[20vh] hidden md:flex"></img>
        {/* Play, Pause, Next, Previous buttons */}
        <div className="flex justify-center mt-3 w-2/3">
          <div className="bg-mycolor flex justify-around items-center w-full h-12 rounded-full shadow-md">
            {/* play Previous paragraph */}
            <button
              className={` px-4 text-sm font-medium hover:scale-110`}
              onClick={handlePlayPrevious}
            >
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
            <button
              onClick={handlePlayPause}
              className="play-pause-button px-4 text-sm font-medium hover:scale-110"
            >
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
            <button
              className={` px-4 text-sm font-medium hover:scale-110`}
              onClick={handlePlayNext}
            >
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
            ></div>
          ))}
        </div>
      </div>
      {/* Paragraph Display */}
      <div className="text-black paragraph-display outline-1 outline outline-gray-400">
        <p>{content[currentParagraphIndex]}</p>
      </div>
    </div>
  );
}
