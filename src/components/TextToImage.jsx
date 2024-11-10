import React, { useEffect, useState, useRef, useContext } from "react";
import AImage from "./AImage";

export default function TTS() {
  //------------------------- Drawer control---------------------------------------------
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef(null);
  const toggleDrawer = () => {
    setDrawer((prev) => !prev);
  };
  const [maximize, setmaximize] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      //check the click is on the drawer
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawer(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------

  return (
    <div className="tooltip" ref={drawerRef}>
      <button
        onClick={toggleDrawer}
        className="flex aspect-square w-16 items-center justify-center hover:scale-110 active:scale-95 cursor-pointer transition-transform hover:text-red-400"
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
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>

      <span className="tooltip-text">Novel to image</span>
      <div
        className={`${
          drawer ? "" : "hidden"
        } flex flex-col fixed top-0 left-0 z-40 p-4 bg-white ${
          window.innerWidth < 768
            ? "animate-fade-in-slide-up-from-bottom"
            : "animate-fade-in-slide-up"
        } ${
          window.innerWidth < 768 ? "w-full h-[90vh]" : "w-[500px] h-[70vh]"
        } ${
          maximize
            ? "w-[110vh] h-[95vh] -top-[250px] rounded-sm"
            : ""
        }transition-all duration-300`}
      >
        <div>
          <h5
            className={`inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400`}
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
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <span className={`ms-2`}>Text to Image</span>
          </h5>
          <button
            onClick={() => setmaximize((prev) => !prev)}
            className={`${window.innerWidth<768 ? "hidden": ""} text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-10 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white`}
          >
            {!maximize?(<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5h15v15h-15v-15z"
              />
            </svg>) : (<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.5 6.5h11v11h-11v-11z"
              />
            </svg>)
              }
            <span className="sr-only">Maximize</span>
          </button>

          <button
            onClick={toggleDrawer}
            className={`text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white`}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <AImage />
      </div>
    </div>
  );
}
