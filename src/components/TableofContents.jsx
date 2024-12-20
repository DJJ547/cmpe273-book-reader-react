import React, { useEffect } from "react";
import { useState, useRef } from "react";
import axios from "axios";
import "../assets/css/SideBar.css";
import "../assets/css/tooltip.css";

export default function TableofContents({ current_chapter, book }) {
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef(null);
  const toggleDrawer = () => setDrawer(!drawer);
  const currentChapterRef = useRef(null);

  //Table of contents
  const [TOC, setTOC] = useState([]);

  //close drawer when clicked outside
  useEffect(() => {
    const handleClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawer(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    if (currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({ block: "center" });
    }
  }, [drawer]);

  //API call: get the table of contents
  useEffect(() => {
    const fetchTableOfContents = async () => {
      if (!book || !book.book_name) return; // Ensure book_name exists before making the API call

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}/reading/book/${encodeURIComponent(
            book.book_name
          )}/table_of_contents`
        );
        setTOC(response.data);
      } catch (error) {
        console.error("Error fetching table of contents:", error);
      }
    };

    fetchTableOfContents();
  }, [book?.book_name]);

  return (
    <div ref={drawerRef} className="tooltip">
      <button
        onClick={toggleDrawer}
        className={`flex aspect-square w-16 items-center justify-center hover:scale-110 active:scale-95 cursor-pointer transition-transform hover:text-red-400`}
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
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
      <span className="tooltip-text">Open Table of Contents</span>
      {drawer && (
        <div
          className={`${
            drawer ? "" : "hidden"
          } flex flex-col fixed top-0 left-0 z-40 p-4 bg-white ${
            window.innerWidth < 768
              ? "animate-fade-in-slide-up-from-bottom"
              : "animate-fade-in-slide-up"
          } ${
            window.innerWidth < 768 ? "w-full h-[70vh]" : "w-96 h-[68vh]"
          } transition-all duration-300`}
        >
          <div>
            <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
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
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              <span class="ms-2">Table of Contents</span>
            </h5>
            <button
              onClick={toggleDrawer}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          {/* table of contents of the book */}
          <ul className="mt-3 overflow-y-auto">
            {TOC.map((chapter, index) => (
              <li
                key={index}
                className="mb-2"
                ref={index + 1 === current_chapter ? currentChapterRef : null}
              >
                <a
                  /* TO DO: change the link address to correspond correct link */
                  href={`/book/${encodeURIComponent(
                    book.book_name
                  )}/chapter/${index + 1}`}
                  className={`${
                    index + 1 === current_chapter
                      ? "text-red-600"
                      : "text-gray-500"
                  } overflow-x-auto dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline`}
                >
                  {chapter}
                </a>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-2"></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
