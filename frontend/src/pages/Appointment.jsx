import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const fullDaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Appointment = () => {
  const { docId } = useParams();

  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const convertTimeToDate = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  useEffect(() => {
    const found = doctors.find((doc) => doc._id === docId);
    setDocInfo(found || null);
  }, [doctors, docId]);

  const getDoctorReviews = useCallback(async () => {
    try {
      setReviewLoading(true);

      const { data } = await axios.get(
        backendUrl + `/api/reviews/doctor/${docId}`
      );

      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReviewLoading(false);
    }
  }, [backendUrl, docId]);

  useEffect(() => {
    getDoctorReviews();
  }, [getDoctorReviews]);

  const getAvailableSlots = useCallback(async () => {
    if (!docInfo) return;

    setDocSlots([]);

    const today = new Date();
    const newSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = fullDaysOfWeek[currentDate.getDay()];

      const dayAvailability = docInfo.availability?.find(
        (item) => item.day === dayName
      );

      if (
        !docInfo.available ||
        !dayAvailability ||
        !dayAvailability.isAvailable ||
        !dayAvailability.startTime ||
        !dayAvailability.endTime
      ) {
        newSlots.push([]);
        continue;
      }

      let startTime = convertTimeToDate(currentDate, dayAvailability.startTime);
      const endTime = convertTimeToDate(currentDate, dayAvailability.endTime);

      if (i === 0 && startTime < today) {
        startTime = new Date(today);
        startTime.setHours(today.getHours() + 1);
        startTime.setMinutes(startTime.getMinutes() > 30 ? 30 : 0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
      }

      const timeSlots = [];

      while (startTime < endTime) {
        const formattedTime = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const slotDate = `${startTime.getDate()}_${
          startTime.getMonth() + 1
        }_${startTime.getFullYear()}`;

        const isAvailable = docInfo?.slots_booked?.[slotDate]
          ? !docInfo.slots_booked[slotDate].includes(formattedTime)
          : true;

        if (isAvailable) {
          timeSlots.push({
            datetime: new Date(startTime),
            time: formattedTime,
          });
        }

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      newSlots.push(timeSlots);
    }

    setDocSlots(newSlots);
  }, [docInfo]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [getAvailableSlots, docInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Please login first");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    if (!docSlots.length || !docSlots[slotIndex]?.length) {
      toast.error("No slot selected");
      return;
    }

    const date = docSlots[slotIndex][0].datetime;

    const slotDate = `${date.getDate()}_${
      date.getMonth() + 1
    }_${date.getFullYear()}`;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!docInfo) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-72">
          <img
            className="w-full rounded-2xl shadow-lg object-cover"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
            {docInfo.name}
            <img src={assets.verified_icon} className="w-5" alt="" />
          </div>

          <p className="text-gray-500 mt-1">
            {docInfo.degree} • {docInfo.speciality}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <div>{renderStars(docInfo.averageRating || 0)}</div>

            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                {docInfo.averageRating || 0}
              </span>{" "}
              ({docInfo.totalReviews || 0} reviews)
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-6">
            {docInfo.about}
          </p>

          <div className="mt-4 text-gray-700 font-medium">
            Fee:
            <span className="text-blue-600 ml-2">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700">
          Select Appointment Slot
        </h2>

        {!docInfo.available && (
          <p className="mt-4 text-red-500 text-sm">
            Doctor is currently unavailable for appointments.
          </p>
        )}

        <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
          {docSlots.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSlotIndex(index);
                setSlotTime("");
              }}
              className={`min-w-[80px] py-4 rounded-xl border transition-all ${
                slotIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <p className="text-xs">
                {item[0]
                  ? daysOfWeek[item[0].datetime.getDay()]
                  : daysOfWeek[
                      new Date(
                        new Date().setDate(new Date().getDate() + index)
                      ).getDay()
                    ]}
              </p>

              <p className="font-semibold">
                {item[0]
                  ? item[0].datetime.getDate()
                  : new Date(
                      new Date().setDate(new Date().getDate() + index)
                    ).getDate()}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          {docSlots[slotIndex]?.length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <button
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-5 py-2 rounded-full border text-sm transition-all ${
                  slotTime === item.time
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {item.time}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No slots available for this day.
            </p>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Book Appointment
        </button>
      </div>

      <div className="mt-14 bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-blue-600 font-semibold">
              Patient Reviews
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              What patients say about {docInfo.name}
            </h2>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border text-center">
            <p className="text-3xl font-bold text-gray-800">
              {docInfo.averageRating || 0}
            </p>

            <div>{renderStars(docInfo.averageRating || 0)}</div>

            <p className="text-xs text-gray-500 mt-1">
              {docInfo.totalReviews || reviews.length} reviews
            </p>
          </div>
        </div>

        <div className="mt-8">
          {reviewLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <p className="text-gray-700 font-medium">No reviews yet</p>

              <p className="text-sm text-gray-500 mt-1">
                Be the first patient to share your experience after appointment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={review.patientId?.image || assets.profile_pic}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border"
                    />

                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.patientId?.name || "Patient"}
                      </p>

                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-800">
                    {review.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    {review.comment}
                  </p>

                  {review.verifiedPatient && (
                    <p className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      Verified Patient
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-14">
        <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    </div>
  );
};

export default Appointment;