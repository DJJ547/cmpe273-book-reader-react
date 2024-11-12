import React, {useState, createContext} from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({children}) => {
    const [background, setBackground] = useState("lightgreen");
    const [font, setFont] = useState('Georgia, serif');
    const [fontSize, setFontSize] = useState("1.2rem");
    const [highlit_paragraph, setHighlit_paragraph] = useState(null);
    
    const call_back_get_highlighted_paragraph =(index) => {
        setHighlit_paragraph(index);
      }
      
    const handleSettingsChange = (newBackground, newFont, newFontSize) => {
        if (newBackground) setBackground(newBackground);
        if (newFont) setFont(newFont);
        if (newFontSize) setFontSize(newFontSize);
    };
    const backgroundStyles = {
        lightyellow: "rgba(250, 248, 228, 0.7)",
        lightblue: "rgba(173, 216, 230, 0.2)",
        lightgreen: "rgba(144, 238, 144, 0.1)",
        nightmode: "rgba(0, 0, 0, 0.9)",
    };
    const styles = {
            container: {
            backgroundColor: backgroundStyles[background],
            },
            content: {
            backgroundColor: backgroundStyles[background],
            minWidth: "410px",
            maxWidth: "850px",
            minHeight: "100vh",
            width: "80%",
            fontFamily: font,
            fontSize: fontSize,
            margin: "auto",
            color: background === "nightmode" ? "white" : "black",
        },
    };

    const Bookinfo = {
        book_name: "Lord of Mysteries",
        book_cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1723688384i/58826678.jpg",
        author: "Cuttlefish That Loves Diving",
        current_chapter: 30,
        chapter_title: "Chapter 30: Crimson", 
        content: [
          "With the rising sun, the fog gradually dispersed. The entire city of Backlund was enveloped in a golden morning glow.",
          "Klein walked out of the Blackthorn Security Company and headed to the Blackthorn Library.",
          "He had just entered the library when he saw a familiar figure.",
          "It was the young lady who had been reading the newspaper in the Blackthorn Security Company.",
          "She was wearing a white shirt and a black skirt, looking very neat and tidy.",
          "Klein walked over and greeted her with a smile.",
          "The young lady looked up and returned the smile.",
          "Klein asked, “Are you here to read the newspaper again?”",
          "The young lady nodded and said, “Yes. I’m here to read the newspaper.”",
          "Klein asked, “What’s so interesting about the newspaper?”",
          "The young lady replied, “I’m looking for a job.”",
          "Klein asked, “What kind of job are you looking for?”",
          "The young lady replied, “I’m looking for a job as a secretary.”",
          "Klein asked, “Do you have any experience as a secretary?”",
          "The young lady replied, “No, but I’m a fast learner.”",
          "Klein asked, “What’s your name?”",
          "The young lady replied, “My name is Audrey.”",
          "Klein asked, “Do you have a last name?”",
          "The young lady replied, “No, I don’t have a last name.”",
        ],
        tableofcontents: Array.from({ length: 100 }, (_, i) => `Chapter ${i + 1}: Crimson`),
        favorited: true,
      };

    return (
        <SettingsContext.Provider
          value={{
            background,
            font,
            fontSize,
            highlit_paragraph,
            call_back_get_highlighted_paragraph,
            handleSettingsChange,
            styles,
            Bookinfo,
          }}
        >
          {children}
        </SettingsContext.Provider>
      );
};