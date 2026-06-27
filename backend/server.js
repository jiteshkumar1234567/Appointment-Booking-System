import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import reviewRouter from "./routes/reviewroute.js";
import prescriptionRouter from "./routes/prescriptionRoute.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://appointment-booking-system-2-m5b4.onrender.com", // User frontend
  "https://appointment-booking-system-1-wn2v.onrender.com", // Admin panel
];

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "aToken", "dToken"],
  })
);

app.options("*", cors());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/prescriptions", prescriptionRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});