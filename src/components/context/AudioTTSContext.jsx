import {React, useState, useRef,createContext } from "react";

export const AudioTTSContext = createContext();

export const AudioTTSProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const AudioRef = useRef(null);
    const [dropdown,setDropdown] = useState(false);
    
    return (
        <AudioTTSContext.Provider value={{ isPlaying, setIsPlaying, AudioRef,dropdown, setDropdown}}>
        {children}
        </AudioTTSContext.Provider>
    );
}
