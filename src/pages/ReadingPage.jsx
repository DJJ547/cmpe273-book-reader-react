import React from "react";

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
        <SideBar />
      </div>
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
        style={{ maxWidth: "210px", maxHeight: "280px" }}
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
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M15 19V5l-8.5 7L15 19zM19 19V5h-2v14h2z" />
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
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M9 5v14l8.5-7L9 5zm-4 0v14h2V5H5z" />
        </svg>
      </button>
    </div>
  </div>
);

const SideBar = () => (
  <div class="relative bg-mycolor2 dark:bg-slate-900 pattern">
    <nav class="z-20 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 right-[420px] min-h-[auto] min-w-[64px] flex-col rounded-lg border">
      <a
        href="#profile"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5  text-indigo-600 dark:bg-sky-900 dark:text-sky-50"
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
      </a>

      <a
        href="#analytics"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
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
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      </a>

      <a
        href="#settings"
        class="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </a>

      <hr class="dark:border-gray-700/60" />

      <a
        href="/"
        class="flex h-16 w-16 flex-col items-center justify-center gap-1 text-fuchsia-900 dark:text-gray-400"
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
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </a>
    </nav>
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
    minWidth: "600px",
    maxWidth: "850px",
    minHeight: "100vh",
    width: "80%",
    fontFamily: "Georgia, serif",
    fontSize: "1.2rem",
    margin: "auto",
  },
};
