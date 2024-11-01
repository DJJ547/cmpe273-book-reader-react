import React, { useEffect } from "react";
import { useState, useRef } from "react";
import "../assets/css/SideBar.css";

export default function Settings({ setting }) {
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef(null);
  const toggleDrawer = () => setDrawer(!drawer);
  const [selectedBackground, setSelectedBackground] = useState("lightyellow");
  const [selectedFont, setSelectedFont] = useState("Georgia, serif");
  const [selectedFontSize, setSelectedFontSize] = useState("1.2rem");
  /* const textcolor = selectedBackground === "nightmode" ? true : false; */

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

  //handle setting changes
  const handleSettingsChange = (bgcolor, fontfamily, fontsize) => {
    if (bgcolor) {
      setSelectedBackground(bgcolor);
    }
    if (fontfamily) {
      setSelectedFont(fontfamily);
    }
    if (fontsize) {
      setSelectedFontSize(fontsize);
    }
    setting(bgcolor, fontfamily, fontsize);
  };

  return (
    <div ref={drawerRef}>
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
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      {drawer && (
        <div
          className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto bg-white w-80 shadow-md rounded-sm dark:bg-gray-800 dark:shadow-lg ${
            window.innerWidth < 768 ? "animate-fade-in-slide-up-from-bottom" : "animate-fade-in-slide-up"
          } ${window.innerWidth < 768 ? "w-full" : "w-80"}`}
        >
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
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span class="ms-2">Settings</span>
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
          {/* buttons that change theme*/}
          <div className="p-4 flex flex-col gap-4 justify-center items-start bg-white border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-700">Background</span>

            <div className="flex justify-between items-center gap-1">
              <button
                className={`w-16 h-16 rounded-full border ${
                  selectedBackground === "lightblue"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: "rgba(173, 216, 230, 0.2)" }}
                onClick={() => handleSettingsChange("lightblue")}
              >
                {selectedBackground === "lightblue" && (
                  <span className="text-blue-500">&#10003;</span>
                )}
              </button>

              <button
                className={`w-16 h-16 rounded-full border ${
                  selectedBackground === "lightyellow"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: "rgba(250, 248, 228, 0.7)" }}
                onClick={() => handleSettingsChange("lightyellow")}
              >
                {selectedBackground === "lightyellow" && (
                  <span className="text-blue-500">&#10003;</span>
                )}
              </button>
              <button
                className={`w-16 h-16 rounded-full border ${
                  selectedBackground === "lightgreen"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: "rgba(144, 238, 144, 0.1)" }}
                onClick={() => handleSettingsChange("lightgreen")}
              >
                {selectedBackground === "lightgreen" && (
                  <span className="text-blue-500">&#10003;</span>
                )}
              </button>

              <button
                className={`w-16 h-16 rounded-full border ${
                  selectedBackground === "nightmode"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                onClick={() => handleSettingsChange("nightmode")}
              >
                {selectedBackground === "nightmode" && (
                  <span className="text-blue-500">&#10003;</span>
                )}
              </button>
            </div>
          </div>
          {/* buttons that let user change font family*/}
          <div className="p-4 flex flex-col gap-4 justify-center items-start bg-white border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-700">Font</p>
            <div className="flex mt-2 gap-2">
              <button
                onClick={() =>
                  handleSettingsChange(null, "Arial, sans-serif", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "Arial, sans-serif"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <p style={{ fontFamily: "Arial, sans-serif" }}>Arial</p>
              </button>

              <button
                onClick={() =>
                  handleSettingsChange(null, "Georgia, serif", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "Georgia, serif"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
              </button>

              <button
                onClick={() =>
                  handleSettingsChange(null, "Verdana, sans-serif", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "Verdana, sans-serif"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontFamily: "Verdana, sans-serif" }}>
                  Verdana
                </span>
              </button>
            </div>
            <div className="flex mt-2 gap-2">
              <button
                onClick={() =>
                  handleSettingsChange(null, "Courier, monospace", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "Courier, monospace"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontFamily: "Courier, monospace" }}>
                  Courier
                </span>
              </button>
              <button
                onClick={() =>
                  handleSettingsChange(null, "Times New Roman, serif", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "Times New Roman, serif"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontFamily: "Times New Roman, serif" }}>
                  Times
                </span>
              </button>
              <button
                onClick={() =>
                  handleSettingsChange(null, "SimSun, sans-serif", null)
                }
                className={`px-2 py-1 border rounded ${
                  selectedFont === "SimSun, sans-serif"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontFamily: "SimSun, sans-serif" }}>Simsun</span>
              </button>
            </div>
          </div>
          {/* buttons that let user change font size*/}
          <div className="p-4 flex flex-col gap-4 justify-center items-start bg-white border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-700">Font Size</p>
            <div className="flex mt-2 gap-2">
              <button
                onClick={() => handleSettingsChange(null, null, "1rem")}
                className={`px-2 py-1 border rounded ${
                  selectedFontSize === "1rem"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontSize: "1rem" }}>Small</span>
              </button>
              <button
                onClick={() => handleSettingsChange(null, null, "1.2rem")}
                className={`px-2 py-1 border rounded ${
                  selectedFontSize === "1.2rem"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontSize: "1.2rem" }}>Medium</span>
              </button>
              <button
                onClick={() => handleSettingsChange(null, null, "1.5rem")}
                className={`px-2 py-1 border rounded ${
                  selectedFontSize === "1.5rem"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <span style={{ fontSize: "1.5rem" }}>Large</span>
              </button>
            </div>
          </div>

          {/* end*/}
        </div>
      )}
    </div>
  );
}
