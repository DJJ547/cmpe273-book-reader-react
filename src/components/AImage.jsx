import { useState, useEffect } from "react";
import axios from "axios";
import image from "../assets/statics/image.png";
import a from "../assets/statics/a.png";

export default function AImage(ListImages) {
  const [AIgeneration, setAIgeneration] = useState({
    images: [],
    description: [],
  });

  //TODO: Fetch the images from the API
  const getAIImages = () => {
    setAIgeneration({
      images: [image, a],
      description: ["With the rising sun, the fog gradually dispersed. The entire city of Backlund was enveloped in a golden morning glow. Klein walked out of the Blackthorn Security Company and headed to the Blackthorn Library.", "Image 2"],
    });
  };

  function GenerateCard(image, description) {
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
        GenerateCard(img, AIgeneration.description[index])
      )}
    </div>
  );
}
