import React, { useState, useEffect, useRef } from "react";
import "../assets/css/SideBar.css";
import Settings from "./Settings";

const SideBar = ({setting}) => {
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
  const bottomBarRef = useRef(null);

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
      <div className="hidden md:flex relative bg-mycolor2">
        <nav className="z-20 flex shrink-0 grow-0 justify-around gap-4 p-2.5 fixed top-2/4 -translate-y-2/4 right-[420px] flex-col rounded-lg">
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
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
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
          <Settings setting={setting}/>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
