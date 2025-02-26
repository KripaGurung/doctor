import { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Krepa Gurung",
    image: assets.profile_pic,
    email: "krepa@gmail.com",
    phone: "9876543210",
    address: {
      line1: "Nepal",
      line2: "KTM",
    },
    gender: "Female",
    dob: "2004-09-04",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 flex">
      <div className="w-2/3 pr-8">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <div className="border-b pb-4 mb-4 space-y-3">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="space-y-1">
            <p className="text-gray-600">Email:</p>
            <p className="text-gray-800">{userData.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                className="p-2 border rounded-lg w-full"
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-gray-600">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  className="p-2 border rounded-lg w-full"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  className="p-2 border rounded-lg w-full"
                />
              </div>
            ) : (
              <p className="text-gray-800">{userData.address.line1}, {userData.address.line2}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Gender:</p>
            {isEdit ? (
              <select
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                value={userData.gender}
                className="p-2 border rounded-lg w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-800">{userData.gender}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-gray-600">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                value={userData.dob}
                className="p-2 border rounded-lg w-full"
              />
            ) : (
              <p className="text-gray-800">{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-1/3 flex flex-col items-center">
        <img src={userData.image} alt="Profile" className="w-32 h-32 rounded-full border-4 border-gray-200" />
        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-4 p-2 border rounded-lg w-full text-center"
          />
        ) : (
          <p className="text-xl font-semibold mt-4">{userData.name}</p>
        )}
        <div className="mt-auto pt-4">
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            {isEdit ? "Save Information" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
