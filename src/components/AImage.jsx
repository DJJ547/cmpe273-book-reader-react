import { useState, useEffect, useContext } from "react";
import axios from "axios";
import a from "../assets/statics/a.png";
import { SettingsContext } from "./context/SettingsContext";

export default function AImage() {
  const { Bookinfo } = useContext(SettingsContext);
  const content = Bookinfo.content;

  const [AIgeneration, setAIgeneration] = useState({
    images: [a],
    description: ['123'],
  });
  const base64ToBlobUrl = (base64) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  const getAIImages = () => {
    const getImages = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}ai/image_generation/`,
          {
            prompt: content[0],
          }
        );
        if (response.data) {
          const image_base64 = response.data.generated_image;
          const imageUrls = base64ToBlobUrl(image_base64);
          console.log("Image:", imageUrls);
  
          setAIgeneration((prevState) => ({
            ...prevState,
            images: [...prevState.images, imageUrls],
          }));
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
  
    const getSummary = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}ai/summerize_chapter/`,
          {
            text: content.slice(0, 3),
          }
        );
        if (response.data) {
          const summary = response.data;
          console.log("Summary:", summary);
  
          setAIgeneration((prevState) => ({
            ...prevState,
            description: [...prevState.description, summary],
          }));
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
  
    // Call both asynchronous functions
    getImages();
    getSummary();
  };
  

  function GenerateCard({image, description}) {
    return (
      <div className="max-w-2xl w-3/4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-4">
        <a href="#">
          <img className="rounded-t-lg" src={image} alt="" />
        </a>
        <div className="p-5">
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between px-9">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Comics
        </h5>
        <button
          onClick={getAIImages}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Generate
        </button>
      </div>
      {AIgeneration.images.map((img, index) =>
        <GenerateCard key={index} image={img} description={AIgeneration.description[index]} />
      )}
    </div>
  );
}
