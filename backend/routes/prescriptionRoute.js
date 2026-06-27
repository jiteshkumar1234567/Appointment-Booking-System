import express from "express";
import {
  createPrescription,
  downloadPrescription,
  getAllPrescriptions,
  getMyPrescriptions,
  getPrescriptionByAppointment,
  updatePrescription,
} from "../controllers/prescriptionController.js";
import authAdmin from "../middleware/authAdmin.js";
import authDoctor from "../middleware/authDoctor.js";
import authUser from "../middleware/authUser.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/create", authDoctor, createPrescription);
prescriptionRouter.put("/:id", authDoctor, updatePrescription);
prescriptionRouter.get(
  "/appointment/:appointmentId",
  authDoctor,
  getPrescriptionByAppointment
);
prescriptionRouter.get("/my", authUser, getMyPrescriptions);
prescriptionRouter.get("/download/:id", authUser, downloadPrescription);
prescriptionRouter.get("/all", authAdmin, getAllPrescriptions);

export default prescriptionRouter;
