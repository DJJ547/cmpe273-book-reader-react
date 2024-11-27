import {React, useState, useRef,createContext } from "react";

export const AudioTTSContext = createContext();

export const AudioTTSProvider = ({ children,content,bookcover,call_back_get_highlighted_paragraph }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const AudioRef = useRef(null);
    const [dropdown,setDropdown] = useState(false);

    //Audio TTS player
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0); // Track current paragraph
    
    
    
    return (
        <AudioTTSContext.Provider value={{ isPlaying, setIsPlaying, AudioRef,dropdown, setDropdown, currentParagraphIndex, setCurrentParagraphIndex}}>
        {children}
        </AudioTTSContext.Provider>
    );
}
