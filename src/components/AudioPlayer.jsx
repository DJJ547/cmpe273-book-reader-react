import React, { useState, useRef, useEffect } from "react";
import "../assets/css/AudioPlayer.css";

export default function AudioPlayer({ content }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0); // Track current paragraph
  //const [completedParagraphs, setCompletedParagraphs] = useState([]); // Track completed paragraphs

  const intervalRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playCurrentParagraph();
    }
  };

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
    //setCompletedParagraphs((prev) => [...prev, currentParagraphIndex]); // Mark paragraph as completed
    setIsPlaying(false);

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
    //setCompletedParagraphs((prev) => prev.filter((p) => p < index)); // Remove completion marks from later paragraphs
    playCurrentParagraph(); // Start playback from selected paragraph
  };

  return (
    <div className="audio-player">
      <button onClick={handlePlayPause} className="play-pause-button">
        {isPlaying ? (
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
              d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z"
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
              d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z"
            />
          </svg>
        )}
      </button>

      <div className="timeline">
        {content.map((paragraph, index) => (
          <div
            key={index}
            className={`paragraph ${
              index === currentParagraphIndex ? "current" : ""
            }`}
            onClick={() => handleTimelineClick(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="paragraph-display">
        <p>{content[currentParagraphIndex]}</p>
      </div>
    </div>
  );
}
