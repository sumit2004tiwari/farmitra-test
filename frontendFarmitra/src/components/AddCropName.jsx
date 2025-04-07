import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import EditCropModal from "../Modals/EditCropModal";
import Swal from "sweetalert2";


const AddCropName = () => {
  const [editingCrop, setEditingCrop] = useState(null); // crop to edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cropName, setCropName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cropList, setCropList] = useState([]);
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCrops = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PATH}/get-crop-name`
      );
      setCropList(response.data);
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PATH}/categories/get-categorise`
        );
        console.log(response.data, "response");
        setCategories(response.data.categories); 
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

   
    fetchCategories();
    fetchCrops();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "logo") {
        setLogo(file);
        setLogoPreview(previewUrl);
      } else if (type === "cover") {
        setCover(file);
        setCoverPreview(previewUrl);
      }
    }
  };

  const handleDelete = async (id) => {
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
  
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_PATH}/delete-crop-name/${id}`);
      setCropList((prev) => prev.filter((crop) => crop.id !== id));
      Swal.fire("Deleted!", "Crop has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting crop:", error);
      Swal.fire("Error", "Failed to delete crop", "error");
    }
    setIsLoading(false);
  };
  

  const handleSubmit = async () => {
    if (!cropName || !selectedCategory) {
      Swal.fire("Oops!", "Please fill all fields!", "warning");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", cropName);
    formData.append("category", selectedCategory);
    if (logo) formData.append("logo", logo);
    if (cover) formData.append("cover", cover);
  
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_PATH}/add-crop-name`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      setCropList([...cropList, response.data]);
      Swal.fire("Success", "Crop added successfully!", "success");
  
      setCropName("");
      setSelectedCategory("");
      setLogo(null);
      setCover(null);
      setLogoPreview(null);
      setCoverPreview(null);
    } catch (error) {
      console.error("Error adding crop:", error);
      Swal.fire("Error", "Failed to add crop", "error");
    }
    setIsLoading(false);
  };
  

  const handleUpdateCrop = async (formData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_PATH}/update-crop-name/${editingCrop.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCropList((prev) =>
        prev.map((crop) => (crop.id === editingCrop.id ? response.data : crop))
      );
      fetchCrops();
      setIsEditModalOpen(false);
      handleUpdateCrop();
      setEditingCrop(null);
      
    } 
    catch (error) {
      console.error("Error updating crop:", error);
      
    }
  };

  const handleSetPreview = async (id) => {
    setIsLoading(true);
    try {
      await axios.patch(`${import.meta.env.VITE_API_PATH}/crop/preview/${id}`);
      Swal.fire("Updated!", "Preview has been enabled.", "success");
    } catch (error) {
      console.error("Error setting preview:", error);
      Swal.fire("Error", "Failed to update preview", "error");
    }
    setIsLoading(false);
  };
  

  return (
    <div className="p-6 bg-gray-100">
      {isLoading && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
)}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-black font-bold">
            ➕ Add New Crop Category
          </h2>
        </div>

        <div className="flex gap-6">
          <div className="w-2/3 bg-white p-4 rounded-lg border shadow-md">
            <label className="block text-lg text-black font-medium mb-1">
              Crop Category
            </label>
            <select
              className="w-1/2 border text-black border-black p-2 rounded mb-4"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            <label className="block text-black text-lg font-medium mb-1">
              Crop Name
            </label>
            <input
              type="text"
              className="w-1/2 border text-black border-black p-2 rounded mb-4"
              placeholder="Enter Crop Name"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
            />

            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-green-300 text-white rounded"
                onClick={() => {
                  setCropName("");
                  setSelectedCategory("");
                  setLogo(null);
                  setCover(null);
                  setLogoPreview(null);
                  setCoverPreview(null);
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 !bg-green-700 text-white rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="w-1/3 bg-white p-4 rounded-lg border shadow-md">
            <h3 className="text-lg font-medium mb-2">Crop Logo & Covers</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center relative">
                <p className="text-gray-500">Logo (1:1)</p>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-auto mt-2 rounded-lg"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center mt-2">
                    <span className="text-2xl">📤</span>
                    <span className="text-gray-600 text-sm">Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                  </label>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center relative">
                <p className="text-gray-500">Store Cover (2:1)</p>
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-auto mt-2 rounded-lg"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center mt-2">
                    <span className="text-2xl">📤</span>
                    <span className="text-gray-600 text-sm">Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "cover")}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-black font-bold">Crops List</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="border text-black p-2 rounded w-64"
              placeholder="🔍 Search Crop Name"
            />
            <button className="bg-gray-300 p-2 rounded">
              <FaSearch />
            </button>
            <button className="bg-green-700 text-white p-2 rounded flex items-center gap-1">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-black text-left">SI</th>
              <th className="p-3 text-black text-left">Crop Name</th>
              <th className="p-3 text-black text-left">Category</th>
              <th className="p-3 text-black text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {console.log(cropList , "cropListcropList")}
            {cropList.map((crop, index) => (
              <tr key={crop.id} className="border-b">
                <td className="p-3 text-black">{index + 1}</td>
                <td className="p-3 flex text-black">
                  {crop.name}
                  <img
                    src={`http://localhost:8000${crop.logo}`}
                    alt={crop.name}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                
                
                <td className="p-3 text-black">{crop.category_name}
                <img
                    src={`http://localhost:8000${crop.categorylogo}`}
                    alt={crop.name}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                
                <td className="p-3 flex gap-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleSetPreview(crop.id)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500"
                    onClick={() => {
                      setEditingCrop(crop);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(crop.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && editingCrop && (
        <EditCropModal
          crop={editingCrop}
          categories={categories}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCrop}
        />
      )}
    </div>
  );
};

export default AddCropName;
