import express from "express";
import {
  createReview,
  getDoctorReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from "../controllers/reviewController.js";

import authUser from "../middleware/authUser.js";

const reviewRouter = express.Router();

reviewRouter.post("/create", authUser, createReview);
reviewRouter.get("/doctor/:doctorId", getDoctorReviews);
reviewRouter.get("/me", authUser, getMyReviews);
reviewRouter.put("/:reviewId", authUser, updateReview);
reviewRouter.delete("/:reviewId", authUser, deleteReview);

export default reviewRouter;