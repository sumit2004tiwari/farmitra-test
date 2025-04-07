import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";
import {
  FaSearch,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const CropList = () => {
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [totalCrops, setTotalCrops] = useState(0);
  const [categories, setCategories] = useState(0);
  const [reviewCrops, setReviewCrops] = useState(0);
  const [removedCrops, setRemovedCrops] = useState(0);

  console.log(crops, "cropscropscropscrops");
  useEffect(() => {
    fetchCropSummary();
  }, []);

  const handleSetPreview = async (crop) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_PATH}/crop/preview/${crop.crop_id}`);
      fetchCropSummary();
      navigate(`/crop-detail/${crop.crop_id}`, { state: { crop } });
    } catch (error) {
      console.error("Error setting preview:", error);
    }
  };
  

  const fetchCropSummary = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PATH}/get-crop-summary`
      );
      const {
        totalCategories,
        totalCrops,
        reviewCrops,
        removedCrops,
        breakdown,
      } = response.data;

      setCategories(totalCategories);
      setTotalCrops(totalCrops);
      setReviewCrops(reviewCrops || 0);
      setRemovedCrops(removedCrops || 0);
      setCrops((breakdown || []).filter((crop) => !crop.removed));
    } catch (error) {
      console.error("Error fetching crop summary:", error);
    }
  };
  const handleDeleteCrop = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await axios.delete(`${import.meta.env.VITE_API_PATH}/delete-crop-name/${id}`);
      setCrops((prev) => prev.filter((crop) => crop.crop_id !== id)); 
      Swal.fire("Deleted!", "Crop has been deleted.", "success");
      fetchCropSummary();
    } catch (error) {
      console.error("Error deleting crop:", error);
      Swal.fire("Error", "Failed to delete crop", "error");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100">
      {/* Add Crop Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/add-crop")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Crop
        </button>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="w-1/4 text-black bg-sky-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold">{totalCrops}</h3>
          <p>Total Crops</p>
        </div>
        <div className="w-1/4 text-black bg-yellow-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold">{categories}</h3>
          <p>Categories</p>
        </div>
        <div className="w-1/4 text-black bg-green-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold">{reviewCrops}</h3>
          <p>Review Crops</p>
        </div>
        <div className="w-1/4 text-black bg-red-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold">{removedCrops}</h3>
          <p>Removed Crops</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="p-3 text-left">SI</th>
              <th className="p-3 text-left">Crop Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(crops) &&
              crops.map((crop, index) => (
                <tr key={crop.category_id} className="border-b">
                  <td className="p-3 text-black ">{index + 1}</td>
                  <td className="p-3 text-black flex items-center gap-2">
                    {crop.logo && (
                      <img
                        src={`http://localhost:8000${crop.logo}`}
                        alt={crop.name}
                        className="w-8 text-black h-8 rounded-full"
                      />
                    )}
                    <span>{crop.crop_name || "N/A"}</span>
                  </td>
                  <td className="p-3  text-black">
                    {crop.category_name || "Unknown"}
                    {crop.category_logo && (
                      <img
                        src={`http://localhost:8000${crop.category_logo}`}
                        alt={crop.category_name}
                        className="w-8 text-black h-8 rounded-full"
                      />
                    )}
                  </td>
                  <td className="p-3 text-black">{crop.status || "Active"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleSetPreview(crop)}
                    >
                      {console.log(crop.id, "crop.idcrop.is")}
                      <FaEye />
                    </button>
                    <button className="text-green-500">
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteCrop(crop.crop_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropList;
