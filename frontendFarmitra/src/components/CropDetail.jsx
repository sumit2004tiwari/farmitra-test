import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const CropDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const crop = state?.crop;
  const navigate = useNavigate();

  const tabRoutes = {
    Overview: `/crop-detail/${id}`,
    Timeline: `/crop-detail/${id}/timeline`,
    "Crop Guide": `/crop-detail/${id}/guide`,
    "Crop Protection": `/crop-detail/${id}/protection`,
  };

  if (!crop)
    return <div className="p-8 text-red-500">No crop data found!</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl text-black font-bold mb-4 capitalize">
        {crop.crop_name}
      </h1>

      <div className="flex gap-8 border-b border-gray-300 mb-8">
        {["Overview", "Timeline", "Crop Guide", "Crop Protection"].map(
          (tab, i) => (
            <button
              key={i}
              className={`pb-2 font-medium ${
                tab === "Overview"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => navigate(tabRoutes[tab], { state: { crop } })}
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="flex gap-8">
        <div className="bg-blue-100 p-4 rounded-lg w-1/4 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Crop Category</p>
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:8000${crop.category_logo}`}
              alt={crop.category_name}
              className="w-12 h-12 mb-2"
            />
            <p className="text-xl font-semibold text-orange-500">
              {crop.category_name}
            </p>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg w-1/4 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Crop Name</p>
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:8000${crop.logo}`}
              alt={crop.crop_name}
              className="w-12 h-12 mb-2 rounded-full"
            />
            <p className="text-xl font-semibold text-black">
              {crop.crop_name}
            </p>
          </div>
        </div>

        <div className="w-1/2 rounded-lg overflow-hidden shadow-sm">
          <img
            src={`http://localhost:8000${crop.cover || ""}`}
            alt={`${crop.crop_name} Cover`}
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CropDetail;
