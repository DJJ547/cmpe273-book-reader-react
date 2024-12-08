import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SettingsContext } from "./context/SettingsContext";

export default function AImage() {
  const { Bookinfo } = useContext(SettingsContext);
  const content = Bookinfo.content;
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [AIgeneration, setAIgeneration] = useState({
    images: [],
    description:[],
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

  const contentDivider = (content) => {
    const parts = [];
    let c = content.join(' ');
    const words = c.split(/\s+/);
    let part = [];

    words.forEach(word => {
      if (part.join(' ').length + word.length + 1 <= 1000) {
        part.push(word);
      } else {
        parts.push(part.join(' '));
        part = [word];
      }
    });

    if (part.length > 0) {
      parts.push(part.join(' '));
    }

    return parts;
  }

  useEffect(() => {
    if (content.length > 0) {
      setParts(contentDivider(content));
    }
  }, [content]);

  const getAIImages = () => {
    setLoading(true);
    const getImages = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}/ai/image_generation/`,
          {
            prompt: parts.slice(0, 5),
          }
        );
        if (response.data) {
          const images_base64 = response.data.images;
          if (!images_base64 || images_base64.length === 0) {
            setLoading(false);
            return;
          }
          for (let i = 0; i < images_base64.length; i++) {
            images_base64[i] = base64ToBlobUrl(images_base64[i]);
          }
          const summaries = response.data.summaries;
          if (!summaries || summaries.length === 0) {
            setLoading(false);
            return;
          }
          setAIgeneration(
            {
              images: images_base64,
              description: summaries,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Call both asynchronous functions
    getImages();
  };
  

  function GenerateCard({image, description}) {
    return (
      <div className="max-w-2xl w- bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-4">
        <a href="#">
          <img className="rounded-lg mx-auto mt-2" src={image} alt="" />
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
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
        </div>
      )}
      {AIgeneration.images.map((img, index) =>
        <GenerateCard key={index} image={img} description={AIgeneration.description[index]} />
      )}
    </div>
  );
}
