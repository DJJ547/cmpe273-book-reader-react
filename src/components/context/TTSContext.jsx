import React, { useState, createContext, useRef, useEffect } from "react";

export const TTSContext = createContext();

export const TTSProvider = ({
  children,
  content,
  bookcover,
  call_back_get_highlighted_paragraph,
}) => {

    const [drawer, setDrawer] = useState(false);
    const toggleDrawer = () => setDrawer(!drawer);
    const [minimized, setMinimized] = useState(false);

  //---------------------------TTS player---------------------------------------------
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0); // Track current paragraph
  const [completedParagraphs, setCompletedParagraphs] = useState([]); // Track completed paragraphs
  const intervalRef = useRef(null);

  const AudioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      call_back_get_highlighted_paragraph(currentParagraphIndex);
    } else {
      call_back_get_highlighted_paragraph(null);
    }
  }, [isPlaying, currentParagraphIndex]);
  //--------------------------------get_highlted current paragraph--------------------

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
  };
  const handlePlayPrevious = () => {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex((prev) => {
        const nextIndex = prev - 1;
        playNextParagraph(nextIndex);
        return nextIndex;
      });
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

  return (
    <TTSContext.Provider
      value={{
        content,
        bookcover,
        call_back_get_highlighted_paragraph,
        drawer,
        setDrawer,
        toggleDrawer,
        isPlaying,
        setIsPlaying,
        currentParagraphIndex,
        setCurrentParagraphIndex,
        completedParagraphs,
        setCompletedParagraphs,
        handlePlayPause,
        handlePlayNext,
        handlePlayPrevious,
        playCurrentParagraph,
        handleParagraphEnd,
        playNextParagraph,
        pauseAudio,
        handleTimelineClick,
        AudioRef,
        minimized,
        setMinimized,
      }}
    >
      {children}
    </TTSContext.Provider>
  );
};
