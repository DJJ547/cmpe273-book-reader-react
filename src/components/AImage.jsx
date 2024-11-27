import { useState, useEffect, useContext } from "react";
import axios from "axios";
import a from "../assets/statics/a.png";
import { SettingsContext } from "./context/SettingsContext";

export default function AImage() {
  const { Bookinfo } = useContext(SettingsContext);
  const content = Bookinfo.content;

  const [AIgeneration, setAIgeneration] = useState({
    images: [],
    description: [],
  });
  const arrayToImage = (array) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(512, 512);

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        const pixelIndex = (i * 512 + j) * 4;
        imageData.data[pixelIndex] = array[i][j][0]; // Red
        imageData.data[pixelIndex + 1] = array[i][j][1]; // Green
        imageData.data[pixelIndex + 2] = array[i][j][2]; // Blue
        imageData.data[pixelIndex + 3] = 255; // Alpha
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };
  //TODO: Fetch the images from the API
  const getAIImages = () => {
    let images = [];
    const getImages = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}ai/image_generation/`,
          {
            prompt: content[0],
          }
        );
        if (response.data) {
          const image = response.data.generated_image;
          const imageUrls = image.map((image) => arrayToImage(image));
          console.log("Image URLs:", imageUrls);  
          setAIgeneration({
            images: [...imageUrls],
            description: [],
          });
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
            text: content.slice(0,3),
          }
        );
        if (response.data) {
          const summary = response.data;
          console.log("Summary:", summary);
          setAIgeneration({
            images: [a],
            description: [summary],
          });
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }

    getImages();
    getSummary();

    /* setAIgeneration({
      images: images,
      description: [
        "With the rising sun, the fog gradually dispersed. The entire city of Backlund was enveloped in a golden morning glow. Klein walked out of the Blackthorn Security Company and headed to the Blackthorn Library.",
        "Image 2",
      ],
    }); */
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
