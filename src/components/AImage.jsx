import images from "../assets/statics/image.png";
import a from "../assets/statics/a.png";

export default function AImage(ListImages) {
  ListImages = [a, images];
  const ListDescription = ["cultivation.", "klein talking to a women."];
  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between px-9">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Comics
        </h5>
        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          Generate
        </button>
      </div>
      
      {ListImages.map((image, index) => {
        return (
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-4">
            <a href="#">
              <img className="rounded-t-lg" src={image} alt="" />
            </a>
            <div className="p-5">
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {ListDescription[index]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
