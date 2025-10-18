import React from "react";
import { useNavigate } from "react-router-dom";

export default function ExpenseWrapper({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <div className="flex justify-end p-4 bg-blue-600 text-white">
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
