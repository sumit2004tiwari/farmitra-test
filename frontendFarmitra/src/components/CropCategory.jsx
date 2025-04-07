import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import EditCategoryModal from "../Modals/EditCategoryModal";

export default function CropCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PATH}/categories/get-categorise`
      );
      console.log(response.data, "response");
      setCategories(response.data.categories); // categories ko correctly set karo
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !image) {
      alert("Enter category name & upload image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_PATH}/add-crop-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important!
          },
        }
      );
      fetchCategories();
      setNewCategory("");
      setImage(null);
      Swal.fire("Success", "Category added successfully!", "success");

    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire("Error", "Failed to add category", "error");

    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (id, formData) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_PATH}/edit-categorise/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Updated", "Category updated successfully!", "success");

      fetchCategories();
    } catch (error) {
      Swal.fire("Error", "Failed to update category", "error");

      console.error("Error editing category:", error);
    }
  };

  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PATH}/delete-categorise/${id}`
      );
      Swal.fire("Deleted!", "Category has been deleted.", "success");
      fetchCategories();

    } catch (error) {
      Swal.fire("Error", "Failed to delete category", "error");
      console.error("Error deleting category:", error);
    }
  };

  const handleReset = () => {
    setNewCategory("");
    setImage(null);
  };

  return (
    <div className="flex flex-1 bg-gray-100 min-h-screen">
      <div className="p-8 flex-1 overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Add New Crop Category
        </h2>

        <div className="bg-white flex space-x-5 p-3 rounded-lg shadow-md mb-2">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Default</h3>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                English(EN)
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Crop Category Name
          </h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory} // This is controlled by React state
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                  }}
                  className="w-full p-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border border-gray-300 rounded-md text-white hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-5 py-2.5 !bg-green-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-0"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <div className=" ">Add</div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo * (Ratio 1:1)
                </label>
                <label className="block cursor-pointer">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      image
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {image ? (
                      <div className="space-y-2">
                        <div className="mx-auto flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm  font-medium text-gray-700 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Upload Image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {image && (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Selected:
                    </span>
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {image.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setImage(null)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Category List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left text-gray-700">
                  <th className="p-3  font-medium">SI</th>
                  <th className="p-3 font-medium">Id</th>
                  <th className="p-3 font-medium">Logo</th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) &&
                  categories.map((category, index) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-black">{index + 1}</td>
                      <td className="p-3 text-black">{category.id}</td>
                      <td className="p-3">
                        {category.logo &&  (
                         <img
                         src={`http://localhost:8000${category.logo}`}
                         alt={category.name}
                         className="w-16 h-16 object-cover rounded"
                       />
                        )}
                      </td>
                      <td className="p-3 text-black">{category.name}</td>
                      <td className="p-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={category.status}
                            onChange={async () => {
                              await axios.put(
                                `YOUR_BACKEND_URL/categories/${category.id}/toggle-status`
                              );
                              fetchCategories();
                            }}
                            className="hidden"
                          />
                          <div
                            className={`w-10 h-5 rounded-full transition-all ${
                              category.status ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 bg-white rounded-full shadow-md transform transition ${
                                category.status
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </label>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EditCategoryModal
  isOpen={isEditModalOpen}
  onClose={() => setEditModalOpen(false)}
  onSubmit={handleEditSubmit}
  category={selectedCategory}
/>
    </div>
    
  );
}
