import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const defaultAvailability = [
  { day: "Sunday", isAvailable: false, startTime: "", endTime: "" },
  { day: "Monday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
  { day: "Tuesday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
  { day: "Wednesday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
  { day: "Thursday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
  { day: "Friday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
  { day: "Saturday", isAvailable: false, startTime: "", endTime: "" },
];

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);

  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateAvailability = (index, field, value) => {
    setProfileData((prev) => {
      const updatedAvailability = [
        ...(prev.availability?.length === 7
          ? prev.availability
          : defaultAvailability),
      ];

      updatedAvailability[index] = {
        ...updatedAvailability[index],
        [field]: value,
      };

      if (field === "isAvailable" && value === false) {
        updatedAvailability[index].startTime = "";
        updatedAvailability[index].endTime = "";
      }

      if (field === "isAvailable" && value === true) {
        updatedAvailability[index].startTime =
          updatedAvailability[index].startTime || "10:00";
        updatedAvailability[index].endTime =
          updatedAvailability[index].endTime || "17:00";
      }

      return {
        ...prev,
        availability: updatedAvailability,
      };
    });
  };

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available,
        availability:
          profileData.availability?.length === 7
            ? profileData.availability
            : defaultAvailability,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  useEffect(() => {
    if (profileData && !profileData.availability) {
      setProfileData((prev) => ({
        ...prev,
        availability: defaultAvailability,
      }));
    }
  }, [profileData]);

  return (
    profileData && (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              className="w-40 h-40 object-cover rounded-2xl border shadow-sm"
              src={profileData.image}
              alt=""
            />

            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {profileData.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {profileData.degree} • {profileData.speciality}
              </p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border">
                {profileData.experience} Experience
              </span>

              <div className="flex items-center gap-2 mt-4">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    profileData.available ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <p className="text-sm text-gray-600">
                  {profileData.available
                    ? "Available for appointments"
                    : "Currently unavailable"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ABOUT</h3>

            {isEdit ? (
              <textarea
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    about: e.target.value,
                  }))
                }
                rows={6}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
              <p className="text-gray-600 leading-relaxed text-sm">
                {profileData.about}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              APPOINTMENT FEE
            </h3>

            <div className="text-gray-800 font-medium">
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  className="border rounded-lg px-2 py-1 w-24 ml-2"
                />
              ) : (
                profileData.fees
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              ADDRESS
            </h3>

            {isEdit ? (
              <div className="space-y-2">
                <input
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                {profileData.address.line1} <br />
                {profileData.address.line2}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={profileData.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
            />
            <label className="text-sm text-gray-600">
              Available for patients
            </label>
          </div>

          <div className="mt-8 border-t pt-8">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Weekly Availability
                </h3>
                <p className="text-sm text-gray-500">
                  Set your working days and appointment timings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(profileData.availability?.length === 7
                ? profileData.availability
                : defaultAvailability
              ).map((item, index) => (
                <div
                  key={item.day}
                  className="grid grid-cols-1 md:grid-cols-[160px_120px_1fr] gap-4 items-center border rounded-2xl p-4 bg-gray-50"
                >
                  <p className="font-semibold text-gray-700">{item.day}</p>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      disabled={!isEdit}
                      onChange={(e) =>
                        updateAvailability(
                          index,
                          "isAvailable",
                          e.target.checked
                        )
                      }
                    />
                    Available
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="time"
                      value={item.startTime}
                      disabled={!isEdit || !item.isAvailable}
                      onChange={(e) =>
                        updateAvailability(index, "startTime", e.target.value)
                      }
                      className="border rounded-xl px-3 py-2 disabled:bg-gray-100"
                    />

                    <input
                      type="time"
                      value={item.endTime}
                      disabled={!isEdit || !item.isAvailable}
                      onChange={(e) =>
                        updateAvailability(index, "endTime", e.target.value)
                      }
                      className="border rounded-xl px-3 py-2 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl shadow hover:scale-105 transition"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;