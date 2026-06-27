import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="min-h-screen px-4 md:px-10 py-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
        <div className="flex flex-col items-center text-center">
          <label htmlFor="image" className="cursor-pointer relative">
            <img
              src={image ? URL.createObjectURL(image) : userData.image}
              className="
                w-28 h-28 md:w-32 md:h-32
                rounded-full
                object-cover
                border-4 border-blue-100
                shadow-md
              "
            />

            {isEdit && (
              <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full shadow-lg">
                <img src={assets.upload_icon} className="w-4 invert" />
              </div>
            )}
          </label>

          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          {isEdit ? (
            <input
              className="
                mt-5 text-2xl font-semibold text-center
                bg-gray-100 px-3 py-2 rounded-lg outline-none
              "
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              {userData.name}
            </h2>
          )}

          <p className="text-sm text-gray-500">Patient Profile</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Contact Information
            </h3>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-blue-600">{userData.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Phone</span>

                {isEdit ? (
                  <input
                    className="bg-gray-100 px-2 py-1 rounded"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <span className="text-gray-700">{userData.phone}</span>
                )}
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-500">Address</span>

                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <input
                      className="bg-gray-100 px-2 py-1 rounded"
                      value={userData.address.line1}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                    />
                    <input
                      className="bg-gray-100 px-2 py-1 rounded"
                      value={userData.address.line2}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <span className="text-gray-700 text-right">
                    {userData.address.line1} <br />
                    {userData.address.line2}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gender</span>

                {isEdit ? (
                  <select
                    className="bg-gray-100 px-2 py-1 rounded"
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option>Not Selected</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <span>{userData.gender}</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Birthday</span>

                {isEdit ? (
                  <input
                    type="date"
                    className="bg-gray-100 px-2 py-1 rounded"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                  />
                ) : (
                  <span>{userData.dob}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="
                px-8 py-2
                bg-blue-600 text-white
                rounded-full
                shadow-md
                hover:bg-blue-700
                transition-all
              "
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="
                px-8 py-2
                border border-blue-600
                text-blue-600
                rounded-full
                hover:bg-blue-600 hover:text-white
                transition-all
              "
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;
