import React from "react";
import SideBar from "../components/SideBar";

export default function ReadingPage() {
  return (
    <div style={styles.container}>
      <div
        className="border border-gray-200 shadow px-10 py-5"
        style={styles.content}
      >
        <TopBar />
        <HeaderSection
          title="Lord of Mysteries"
          book_cover={
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1723688384i/58826678.jpg"
          }
        />
        <BodySection chapter={"Crimson"} content={content} />
        <BottomBar />
      </div>
      <SideBar />
    </div>
  );
}

const TopBar = () => (
  <div className="flex items-center cursor-pointer font-bold">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{ width: "24px", height: "24px", marginRight: "6px" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
    <span>Back</span>
  </div>
);
const Divider = () => <hr className="border border-gray-400 opacity-50 my-1" />;

const HeaderSection = ({ title, book_cover }) => (
  <div>
    <Divider />
    <div className="mt-14">
      <img
        src={book_cover}
        alt="Book Cover"
        className="mx-auto my-5"
        style={{ maxWidth: "180px", maxHeight: "240px" }}
      />
      <p className="text-center text-2xl font-bold my-5">{title}</p>
      <p className="text-center text-lg mb-5">
        <span className="font-bold">Author:</span> Cuttlefish That Loves Diving
      </p>
    </div>
    <Divider />
  </div>
);

const BodySection = ({ chapter, content }) => (
  <div className="mt-10 p-4">
    <div className="text-2xl font-semibold">Chapter 1: {chapter}</div>
    <div className="text-justify text-lg mt-10">
      {content.map((paragraph, index) => (
        <p key={index} className="mb-5">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
);
const BottomBar = () => (
  <div className="flex justify-center mt-32">
    <div className="bg-mycolor flex justify-around items-center w-[400px] h-12 rounded-full shadow-md">
      {/* Previous Chapter Icon */}
      <button className="text-gray-800 px-4 text-sm font-medium hover:scale-150">
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m15 19-7-7 7-7"
          />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300"></div>

      {/* Table of Contents Icon */}
      <button className="text-gray-800 px-4 text-sm font-medium hover:scale-150">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300"></div>

      {/* Next Chapter Icon */}
      <button className="text-gray-800 px-4 text-sm font-medium hover:scale-150">
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m9 5 7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
);

const content = [
  <p>
    With the rising sun, the fog gradually dispersed. The entire city of
    Backlund was enveloped in a golden morning glow.
  </p>,
  <p>
    Klein walked out of the Blackthorn Security Company and headed to the
    Blackthorn Library.
  </p>,
  <p>He had just entered the library when he saw a familiar figure.</p>,
];

const styles = {
  container: {
    backgroundColor: "rgba(206, 186, 164, 0.2)",
  },
  content: {
    backgroundColor: "rgba(250, 248, 228, 0.7)",
    minWidth: "400px",
    maxWidth: "850px",
    minHeight: "100vh",
    width: "80%",
    fontFamily: "Georgia, serif",
    fontSize: "1.2rem",
    margin: "auto",
  },
};
