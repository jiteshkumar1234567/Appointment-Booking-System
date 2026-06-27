import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import sendEmail from "../utils/sendEmail.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      const userData = await userModel.findById(
        appointmentData.userId
      );

      const doctorData = await doctorModel.findById(docId);

      await sendEmail({
        to: userData.email,
        subject: "Appointment Cancelled by Doctor | MediCare+",
        html: `
          <div style="font-family:Arial;padding:30px;">
            <div style="max-width:650px;margin:auto;background:white;border-radius:20px;overflow:hidden">
              
              <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:30px;text-align:center;color:white">
                <h1>MediCare+</h1>
                <p>Appointment Cancellation Notice</p>
              </div>

              <div style="padding:30px">
                <h2 style="color:#ef4444">Appointment Cancelled</h2>

                <p>Hello <b>${userData.name}</b>,</p>

                <p>
                  Your appointment with
                  <b>Dr. ${doctorData.name}</b>
                  has been cancelled by the doctor.
                </p>

                <div style="background:#fef2f2;padding:20px;border-radius:12px;margin:20px 0">
                  <p><b>Date:</b> ${appointmentData.slotDate}</p>
                  <p><b>Time:</b> ${appointmentData.slotTime}</p>
                  <p><b>Speciality:</b> ${doctorData.speciality}</p>
                </div>

                <p>
                  We apologize for the inconvenience.
                  Please book another appointment from your dashboard.
                </p>

                <div style="text-align:center;margin-top:30px;color:#64748b">
                  © MediCare+
                </div>
              </div>
            </div>
          </div>
        `,
      });

      return res.json({
        success: true,
        message: "Appointment Cancelled",
      });
    }

    res.json({
      success: false,
      message: "Appointment not found",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(
      appointmentId
    );

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      const userData = await userModel.findById(
        appointmentData.userId
      );

      const doctorData = await doctorModel.findById(docId);

      await sendEmail({
        to: userData.email,
        subject: "Appointment Completed | MediCare+",
        html: `
          <div style="font-family:Arial;padding:30px;">
            <div style="max-width:650px;margin:auto;background:white;border-radius:20px;overflow:hidden">

              <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:30px;text-align:center;color:white">
                <h1>MediCare+</h1>
                <p>Thank You For Visiting</p>
              </div>

              <div style="padding:30px">
                <h2 style="color:#16a34a">
                  Appointment Successfully Completed
                </h2>

                <p>Hello <b>${userData.name}</b>,</p>

                <p>
                  Your appointment with
                  <b>Dr. ${doctorData.name}</b>
                  has been marked as completed.
                </p>

                <div style="background:#f0fdf4;padding:20px;border-radius:12px;margin:20px 0">
                  <p><b>Date:</b> ${appointmentData.slotDate}</p>
                  <p><b>Time:</b> ${appointmentData.slotTime}</p>
                  <p><b>Doctor:</b> Dr. ${doctorData.name}</p>
                </div>

                <div style="background:#eff6ff;padding:20px;border-radius:12px;margin-top:20px">
                  <h3 style="margin-top:0;color:#2563eb">
                    ⭐ Leave Your Review
                  </h3>

                  <p>
                    Your feedback helps other patients choose
                    the best healthcare professionals.
                  </p>

                  <p>
                    You can now submit a review from the
                    <b> My Appointments </b> page.
                  </p>
                </div>

                <p style="margin-top:25px">
                  Thank you for choosing MediCare+.
                </p>

                <div style="text-align:center;margin-top:30px;color:#64748b">
                  © MediCare+
                </div>
              </div>
            </div>
          </div>
        `,
      });

      return res.json({
        success: true,
        message: "Appointment Completed",
      });
    }

    res.json({
      success: false,
      message: "Appointment not found",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available, about, availability } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about,
      availability,
    });

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorAvailability = async (req, res) => {
  try {
    const { docId, availability } = req.body;

    if (!availability || !Array.isArray(availability)) {
      return res.json({
        success: false,
        message: "Availability is required",
      });
    }

    await doctorModel.findByIdAndUpdate(docId, { availability });

    res.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  updateDoctorAvailability,
};