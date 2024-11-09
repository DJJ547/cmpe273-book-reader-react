import React from "react";
import { useState, useContext } from "react";
import {SettingsContext} from "../components/context/SettingsContext";
import SideBar from "../components/SideBar";


export default function ReadingPage() {
  const {styles, highlit_paragraph, Bookinfo} = useContext(SettingsContext);

  return (
    <div style={styles.container}>
      <div
        className="border border-gray-200 shadow px-10 py-5"
        style={styles.content}
      >
        <TopBar />
        <HeaderSection
          title={Bookinfo.book_name}
          book_cover={Bookinfo.book_cover}
          author={Bookinfo.author}
        />
        <BodySection chapter_title={Bookinfo.chapter_title} content={Bookinfo.content} highlit_paragraph={highlit_paragraph} />
        <BottomBar color={styles.content.color}/>
      </div>
      <SideBar />
    </div>
  );
}

const TopBar = () => (
  <div className="flex items-center cursor-pointer text-base">
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

const HeaderSection = ({ title, book_cover, author }) => (
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
        <span className="font-bold">Author:</span> {author}
      </p>
    </div>
    <Divider />
  </div>
);


function BodySection({ chapter_title, content, highlit_paragraph}){
  return(
    <div className="mt-10 p-4">
    <div className="font-semibold">{chapter_title}</div>
    <div className="mt-10">
      {content.map((paragraph, index) => (
        <p key={index} className={`mb-5 ${index === highlit_paragraph ? "bg-yellow-400" : ""}`}>
          {paragraph}
        </p>
      ))}
    </div>
  </div>
  );
}

function BottomBar ({color}){
  /* TO DO: implement buttons that go to previous, next chapters, and button that goes to book description page */
  return (
    <div className="flex justify-center mt-32">
    <div className="bg-mycolor flex justify-around items-center w-[400px] h-12 rounded-full shadow-md">
      {/* Previous Chapter Icon */}
      <button className="text-white px-4 text-sm font-medium hover:scale-150">
        <svg
          className={`w-6 h-6 dark:text-white ${color==='black' ? "text-gray-800":"text-white"}`}
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
      <button className= {`px-4 text-sm font-medium hover:scale-150 ${color==='black' ? "text-gray-800":"text-white"}`}>
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
      <button className={`${color==='black' ? "text-gray-800":"text-white"} px-4 text-sm font-medium hover:scale-150`}>
        <svg
          className="w-6 h-6 dark:text-white"
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
}




