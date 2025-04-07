import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Import useLocation

import {
  FaHome,
  FaUserTie,
  FaChevronDown,
  FaChevronUp,
  FaSeedling,
  FaBlog,
  FaShieldAlt,
  FaClipboardList,
  FaPlus,
  FaList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  const [isManagementOpen, setManagementOpen] = useState(true);
  const [isCropCategoryOpen, setCropCategoryOpen] = useState(false);

  return (
    <div className="w-84 h-screen bg-[#0e1b2a] text-white p-4">
      {/* Logo */}
      <h1 className="text-xl font-bold mb-6">Logo</h1>

      {/* Sidebar Items */}
      <ul className="space-y-2">
        <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
          <FaHome />
          <span>Dashboard</span>
        </li>

        <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
          <FaUserTie />
          <span>Test example</span>
        </li>

        <li>
          <button
            className="flex items-center justify-between w-full p-2 bg-green-700 rounded text-white hover:bg-green-600"
            onClick={() => setManagementOpen(!isManagementOpen)}
          >
            <div className="flex items-center gap-3">
              <FaClipboardList />
              <span>Management</span>
            </div>
            {isManagementOpen ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>

          {isManagementOpen && (
            <ul className="pl-6 mt-2 space-y-2">
              <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
                <FaSeedling />
                <span>Crop</span>
              </li>

              <li>
                <div
                  className="flex items-center justify-between p-2 bg-green-800 rounded cursor-pointer hover:bg-green-700"
                  onClick={() => setCropCategoryOpen(!isCropCategoryOpen)}
                >
                  <div className="flex items-center gap-3">
                    <FaSeedling />
                    <span>Crop Category</span>
                  </div>
                  {isCropCategoryOpen ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </div>

                {isCropCategoryOpen && (
                  <ul className="pl-6 mt-1 space-y-1">
                    <li className="">
                      <Link
                        to="/add-crop-category"
                        className={`flex items-center gap-3 p-2 text-sm rounded cursor-pointer 
                          ${location.pathname === "/add-crop-category" ? "bg-green-600" : "hover:bg-green-700"}`}
                      >
                        <FaPlus size={10} />
                        <span className="!text-white">Add Category</span>
                      </Link>
                    </li>
                    <li className="">
                      <Link
                        to="/add-crop"
                        className={`flex items-center gap-3 p-2 text-sm rounded cursor-pointer 
                          ${location.pathname === "/add-crop" ? "bg-green-600" : "hover:bg-green-700"}`}
                      >
                        <FaPlus size={10} />
                        <span className="!text-white">Add Crop</span>
                      </Link>
                    </li>
                    <li className="">
                      <Link
                        to="/crop-list"
                        className={`flex items-center gap-3 p-2 text-sm rounded cursor-pointer 
                          ${location.pathname === "/crop-list" ? "bg-green-600" : "hover:bg-green-700"}`}
                      >
                        <FaPlus size={10} />
                        <span className="!text-white">Crop List</span>
                      </Link>
                    </li>
                    <li className="flex items-center gap-3 p-2 text-sm hover:bg-green-700 rounded cursor-pointer">
                      <FaSeedling size={10} />
                      <span>View All</span>
                    </li>
                  </ul>
                )}
              </li>

              <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
                <FaBlog />
                <span>Blog</span>
              </li>

              <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
                <FaClipboardList />
                <span>Crop Timeline</span>
              </li>

              <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
                <FaShieldAlt />
                <span>Crop Protection</span>
              </li>

              <li className="flex items-center gap-3 p-2 bg-green-700 rounded cursor-pointer hover:bg-green-600">
                <FaUserTie />
                <span>Expert</span>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
