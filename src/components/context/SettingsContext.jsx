import React, { useState, createContext } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children, book }) => {
  const [background, setBackground] = useState("lightgreen");
  const [font, setFont] = useState('Georgia, serif');
  const [fontSize, setFontSize] = useState("1.2rem");
  const [highlit_paragraph, setHighlit_paragraph] = useState(null);

  const call_back_get_highlighted_paragraph = (index) => {
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
    book_name: book?.book_name || '',
    book_cover: book?.book_cover || 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1723688384i/58826678.jpg',
    author: book?.author || '',
    current_chapter: book?.chapter_number || 1,
    chapter_title: book?.chapter_title || '',
    content: book?.chapter_content || [],
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