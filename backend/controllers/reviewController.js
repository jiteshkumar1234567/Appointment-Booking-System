import reviewModel from "../models/reviewModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const updateDoctorRating = async (doctorId) => {
  const reviews = await reviewModel.find({ doctorId });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  await doctorModel.findByIdAndUpdate(doctorId, {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
  });
};

export const createReview = async (req, res) => {
  try {
    const patientId = req.body.userId;
    const { doctorId, appointmentId, rating, title, comment } = req.body;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    if (!doctorId || !appointmentId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can review only your own appointment",
      });
    }

    if (appointment.docId.toString() !== doctorId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Doctor does not match this appointment",
      });
    }

    if (!appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "You can review only after completed appointment",
      });
    }

    const existingReview = await reviewModel.findOne({ appointmentId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this appointment",
      });
    }

    const review = await reviewModel.create({
      doctorId,
      patientId,
      appointmentId,
      rating,
      title,
      comment,
      verifiedPatient: true,
    });

    await updateDoctorRating(doctorId);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.log("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Create review failed",
      error: error.message,
    });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await reviewModel
      .find({ doctorId })
      .populate("patientId", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get doctor reviews failed",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const patientId = req.body.userId;
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own review",
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    await review.save();

    await updateDoctorRating(review.doctorId);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update review failed",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.patientId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    const doctorId = review.doctorId;

    await reviewModel.findByIdAndDelete(reviewId);

    await updateDoctorRating(doctorId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete review failed",
      error: error.message,
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const patientId = req.body.userId;

    const reviews = await reviewModel
      .find({ patientId })
      .populate("doctorId", "name image speciality")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get my reviews failed",
      error: error.message,
    });
  }
};