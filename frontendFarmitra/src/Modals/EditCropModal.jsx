import React, { useState, useEffect } from "react";

const EditCropModal = ({ crop, categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    logo: null,
    cover: null,
  });

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.name || "",
        category: crop.category_id || "",
        logo: null,
        cover: null,
      });
    }
  }, [crop]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert("Please fill all fields!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50  bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative">
        <h3 className="text-xl text-black font-semibold mb-4">Edit Crop</h3>

        <label className="block text-sm text-black font-medium">Crop Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border text-black border-black p-2 rounded mb-3"
        />

        <label className="block text-sm text-black font-medium">Crop Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full text-black border border-black p-2 rounded mb-3"
        >
          <option value="" className="text-black">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
          ))}
        </select>

        <label className="block border-dashed text-black text-sm font-medium">Logo</label>
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className="mb-3 border-2 text-black border-dashed border-gray-700"
        />

        <label className="block text-black text-sm font-medium">Cover</label>
        <input
          type="file"
          name="cover"
          onChange={handleFileChange}
          className="mb-3 border-2 text-black border-dashed border-gray-700"

        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCropModal;
