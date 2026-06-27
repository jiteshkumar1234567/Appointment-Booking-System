import PDFDocument from "pdfkit";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import userModel from "../models/userModel.js";

const validatePrescriptionInput = (diagnosis, medicines) => {
  if (!diagnosis || !diagnosis.trim()) {
    return "Diagnosis is required";
  }

  if (!Array.isArray(medicines) || medicines.length === 0) {
    return "At least one medicine is required";
  }

  const invalidMedicine = medicines.find(
    (medicine) =>
      !medicine.medicineName?.trim() ||
      !medicine.dosage?.trim() ||
      !medicine.duration?.trim()
  );

  if (invalidMedicine) {
    return "Medicine name, dosage and duration are required";
  }

  return "";
};

const cleanMedicines = (medicines) =>
  medicines.map((medicine) => ({
    medicineName: medicine.medicineName.trim(),
    dosage: medicine.dosage.trim(),
    duration: medicine.duration.trim(),
    instructions: medicine.instructions?.trim() || "",
  }));

const formatDate = (slotDate) => {
  if (!slotDate) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateArray = slotDate.split("_");
  return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
};

const drawTableCell = (doc, text, x, y, width, height, options = {}) => {
  doc.rect(x, y, width, height).stroke("#d1d5db");
  doc
    .fillColor(options.color || "#374151")
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.size || 9)
    .text(text || "-", x + 6, y + 7, {
      width: width - 12,
      height: height - 10,
      ellipsis: true,
    });
};

const createPrescription = async (req, res) => {
  try {
    const { docId, appointmentId, diagnosis, medicines, notes } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID is required" });
    }

    const validationMessage = validatePrescriptionInput(diagnosis, medicines);
    if (validationMessage) {
      return res.json({ success: false, message: validationMessage });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId !== docId) {
      return res.json({
        success: false,
        message: "You can prescribe only for your own appointments",
      });
    }

    if (!appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "Prescription can be created only after appointment completion",
      });
    }

    const existingPrescription = await prescriptionModel.findOne({
      appointmentId,
    });

    if (existingPrescription) {
      return res.json({
        success: false,
        message: "Prescription already exists for this appointment",
      });
    }

    const prescription = await prescriptionModel.create({
      appointmentId,
      doctorId: docId,
      patientId: appointmentData.userId,
      diagnosis: diagnosis.trim(),
      medicines: cleanMedicines(medicines),
      notes: notes?.trim() || "",
    });

    res.json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { docId, diagnosis, medicines, notes } = req.body;

    const validationMessage = validatePrescriptionInput(diagnosis, medicines);
    if (validationMessage) {
      return res.json({ success: false, message: validationMessage });
    }

    const prescription = await prescriptionModel.findById(id);

    if (!prescription) {
      return res.json({ success: false, message: "Prescription not found" });
    }

    if (prescription.doctorId.toString() !== docId) {
      return res.json({
        success: false,
        message: "You can update only your own prescription",
      });
    }

    prescription.diagnosis = diagnosis.trim();
    prescription.medicines = cleanMedicines(medicines);
    prescription.notes = notes?.trim() || "";

    await prescription.save();

    res.json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { docId } = req.body;
    const { appointmentId } = req.params;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId !== docId) {
      return res.json({
        success: false,
        message: "You can access only your own appointment prescription",
      });
    }

    const prescription = await prescriptionModel.findOne({ appointmentId });

    res.json({ success: true, prescription });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getMyPrescriptions = async (req, res) => {
  try {
    const { userId } = req.body;

    const prescriptions = await prescriptionModel
      .find({ patientId: userId })
      .populate("doctorId", "name image speciality")
      .populate("appointmentId", "slotDate slotTime")
      .sort({ createdAt: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const downloadPrescription = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const prescription = await prescriptionModel
      .findById(id)
      .populate("doctorId", "name speciality")
      .populate("appointmentId", "slotDate slotTime");

    if (!prescription) {
      return res.json({ success: false, message: "Prescription not found" });
    }

    if (prescription.patientId.toString() !== userId) {
      return res.json({
        success: false,
        message: "You can download only your own prescription",
      });
    }

    const patientData = await userModel.findById(userId).select("name");
    const doctorData =
      prescription.doctorId || (await doctorModel.findById(prescription.doctorId));

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=prescription-${prescription._id}.pdf`
    );

    doc.pipe(res);

    doc
      .fillColor("#2563eb")
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("MediCare+", { align: "center" });
    doc
      .fillColor("#64748b")
      .font("Helvetica")
      .fontSize(10)
      .text("Digital Prescription", { align: "center" });

    doc.moveDown(2);
    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Dr. ${doctorData?.name || "Doctor"}`);
    doc
      .fillColor("#4b5563")
      .font("Helvetica")
      .fontSize(11)
      .text(doctorData?.speciality || "Specialist");

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Patient Details", { underline: true });
    doc
      .font("Helvetica")
      .fillColor("#374151")
      .text(`Patient Name: ${patientData?.name || "Patient"}`)
      .text(
        `Appointment: ${formatDate(
          prescription.appointmentId?.slotDate
        )} | ${prescription.appointmentId?.slotTime || ""}`
      )
      .text(`Generated Date: ${new Date().toLocaleDateString("en-IN")}`);

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Diagnosis", { underline: true });
    doc
      .font("Helvetica")
      .fillColor("#374151")
      .text(prescription.diagnosis, { width: 500 });

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Medicines", { underline: true });

    const tableX = 50;
    let tableY = doc.y + 8;
    const rowHeight = 42;
    const colWidths = [150, 90, 90, 170];
    const headers = ["Medicine", "Dosage", "Duration", "Instructions"];

    headers.forEach((header, index) => {
      const x = tableX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      drawTableCell(doc, header, x, tableY, colWidths[index], 26, {
        bold: true,
        color: "#111827",
      });
    });

    tableY += 26;

    prescription.medicines.forEach((medicine) => {
      if (tableY + rowHeight > doc.page.height - 80) {
        doc.addPage();
        tableY = 50;
      }

      const values = [
        medicine.medicineName,
        medicine.dosage,
        medicine.duration,
        medicine.instructions,
      ];

      values.forEach((value, index) => {
        const x =
          tableX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        drawTableCell(doc, value, x, tableY, colWidths[index], rowHeight);
      });

      tableY += rowHeight;
    });

    doc.y = tableY + 20;
    doc
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Notes", { underline: true });
    doc
      .font("Helvetica")
      .fillColor("#374151")
      .text(prescription.notes || "-", { width: 500 });

    doc.moveDown(2);
    doc
      .fillColor("#64748b")
      .fontSize(9)
      .text("This prescription was generated electronically by MediCare+.");

    doc.end();
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    }
  }
};

const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel
      .find({})
      .populate("doctorId", "name image speciality")
      .populate("patientId", "name image email")
      .populate("appointmentId", "slotDate slotTime")
      .sort({ createdAt: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  createPrescription,
  updatePrescription,
  getPrescriptionByAppointment,
  getMyPrescriptions,
  downloadPrescription,
  getAllPrescriptions,
};
