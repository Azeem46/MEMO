import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaTag } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("posts"); // State to track active tab
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="py-14 px-4 max-sm:pt-4">
      <div className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-7xl text-black" />
          <div className="text-black">
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-sm text-black-500">
              {formatDate(user.joinDate)}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className={`py-2 px-6 rounded-lg font-semibold ${
              activeTab === "posts"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`py-2 px-6 rounded-lg font-semibold border border-gray-300 flex items-center space-x-2 ${
              activeTab === "favourites"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("favourites")}
          >
            <FaTag />
            <span>Favourites</span>
          </button>
        </div>
      </div>
      <div className="text-right max-sm:mt-4 mt-4">
        <div className="text-xl font-semibold">
          {activeTab === "posts" ? "Posts" : "Favourites"}
        </div>
        <div className="text-3xl font-bold">0</div>
      </div>
    </div>
  );
};

export default ProfileScreen;
