import React, { useState, useEffect } from "react";

export default function EditCategoryModal({ isOpen, onClose, onSubmit, category }) {
  const [name, setName] = useState(category?.name || "");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    onSubmit(category.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl text-black font-semibold mb-4">Edit Crop Category</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-black p-3 mb-4 border border-gray-300 rounded"
          placeholder="Enter new category name"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4 text-black border-dashed border-1 border-gray-600"
          
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
