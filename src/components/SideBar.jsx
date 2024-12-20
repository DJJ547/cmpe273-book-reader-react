import React, { useState, useEffect, useRef, useContext } from "react";
import {SettingsContext} from "./context/SettingsContext";
import { TTSProvider } from "./context/TTSContext";
import {AudioTTSProvider} from "./context/AudioTTSContext";
import "../assets/css/SideBar.css";
import Settings from "./Settings";
import TableofContents from "./TableofContents";
import AddtoReadinglist from "./AddtoReadinglist";
import TTS from "./TTS";
import TextToImage from "./TextToImage";
import { useAuth } from "./context/AuthContext";


const SideBar = () => {
  const { background, Bookinfo, call_back_get_highlighted_paragraph} = useContext(SettingsContext);
  
  const nightmode = background === 'nightmode' ? true:false;

  const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
  const bottomBarRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const toggleBottomBar = () => {
    setIsBottomBarVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClick = (event) => {
      // Check if the click is outside the BottomBar
      if (
        bottomBarRef.current &&
        !bottomBarRef.current.contains(event.target)
      ) {
        toggleBottomBar();
      }
    };

    // Add event listener to the entire document
    document.addEventListener("click", handleClick);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className={`${nightmode ? 'text-white':'text-black' } hidden md:flex right-[0px] fixed top-2/4 -translate-y-2/4 2xl:right-[300px] xl:right-[200px] lg:right-[10px] shadow-lg rounded-lg}`}>
        <nav className="z-20 flex shrink-0 grow-0 justify-around gap-4 p-2.5 flex-col rounded-lg">
          <TableofContents current_chapter={Bookinfo.current_chapter} book={Bookinfo}/>
          {isAuthenticated && <AddtoReadinglist bookname={Bookinfo.book_name} favorited={Bookinfo.favorited}/>}
          <TTSProvider content={Bookinfo.content} bookcover={Bookinfo.book_cover} call_back_get_highlighted_paragraph={call_back_get_highlighted_paragraph}>
            <AudioTTSProvider>
              <TTS />
            </AudioTTSProvider>
          </TTSProvider>
          <TextToImage />
          <Settings />
        </nav>
      </div>

      {/* Bottom bar for smaller screens */}
      <div className="md:hidden fixed z-20">
        <nav
          className={`bottom-bar flex justify-between border-t bg-white/90 p-2.5 backdrop-blur-lg fixed bottom-0 z-10 w-full ${
            isBottomBarVisible ? "slide-up" : "slide-down"
          }`}
          ref={bottomBarRef}
        >
          <TableofContents current_chapter={Bookinfo.current_chapter} book={Bookinfo}/>
          <AddtoReadinglist bookname={Bookinfo.book_name} favorited={Bookinfo.favorited} />
          <TTSProvider content={Bookinfo.content} bookcover={Bookinfo.book_cover} call_back_get_highlighted_paragraph={call_back_get_highlighted_paragraph}>
            <AudioTTSProvider>
              <TTS />
            </AudioTTSProvider>
          </TTSProvider>
          <TextToImage />
          <Settings />
        </nav>
      </div>
    </>
  );
};

export default SideBar;
