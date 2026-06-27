import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    availability: {
      type: [
        {
          day: { type: String, required: true },
          isAvailable: { type: Boolean, default: false },
          startTime: { type: String, default: "" },
          endTime: { type: String, default: "" },
        },
      ],
      default: [
        { day: "Sunday", isAvailable: false, startTime: "", endTime: "" },
        { day: "Monday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
        { day: "Tuesday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
        { day: "Wednesday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
        { day: "Thursday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
        { day: "Friday", isAvailable: true, startTime: "10:00", endTime: "17:00" },
        { day: "Saturday", isAvailable: false, startTime: "", endTime: "" },
      ],
    },
  },
  { minimize: false }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;