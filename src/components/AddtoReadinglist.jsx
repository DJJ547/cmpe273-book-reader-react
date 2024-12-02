import React, { useEffect } from "react";
import { useState, useRef, useContext } from "react";
import MoveToShelvesWindow from "./library/MoveToShelvesWindow";
import { SettingsContext } from "./context/SettingsContext";
import "../assets/css/SideBar.css";
import "../assets/css/tooltip.css";

export default function AddtoReadinglist({ bookname, favorited }) {
  const { Bookinfo } = useContext(SettingsContext);
  const [moveToShelvesWindowIsOpen,setMoveToShelvesWindowIsOpen] = useState(false);
  

  return (
    <div className="tooltip">
      <button
      onClick={() => setMoveToShelvesWindowIsOpen(true)}
        className={`flex aspect-square w-16 items-center justify-center hover:scale-110 active:scale-95 cursor-pointer transition-transform hover:text-red-400 relative`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        {favorited && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 22"
            className="absolute top-0 right-0 w-5 h-5 text-green-500"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        )}
      </button>
      <span className="tooltip-text">
        {favorited ? "Remove from Readinglist" : "Add to Readinglist"}
      </span>
      <MoveToShelvesWindow
        moveToShelvesWindowIsOpen={moveToShelvesWindowIsOpen}
        setMoveToShelvesWindowIsOpen={setMoveToShelvesWindowIsOpen}
        currentBook={Bookinfo}
      />
    </div>
  );
}
