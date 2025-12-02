import React from "react";

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
      active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <span className={active ? "text-indigo-600" : "text-gray-400"}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default SidebarItem;
