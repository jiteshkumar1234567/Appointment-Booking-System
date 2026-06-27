import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import stripe from "stripe";
import razorpay from "razorpay";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking for all data to register user
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
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

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot Not Available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    await sendEmail({
      to: userData.email,
      subject: "Appointment Booked Successfully | MediCare+",
      html: `
        <div style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:640px;margin:0 auto;padding:30px 16px;">
            <div style="background:linear-gradient(135deg,#2563eb,#06b6d4);padding:28px;border-radius:24px 24px 0 0;text-align:center;color:white;">
              <h1 style="margin:0;font-size:30px;font-weight:800;">MediCare+</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Trusted Doctor Appointment Platform</p>
            </div>

            <div style="background:#ffffff;padding:32px;border-radius:0 0 24px 24px;border:1px solid #e5eefb;">
              <div style="text-align:center;margin-bottom:24px;">
                <table align="center" cellpadding="0" cellspacing="0" style="   width:72px;   height:72px;   background:#dcfce7;   border-radius:50%;"><tr> <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" width="72" height="72" alt="Success"/> </tr></table>
                <h2 style="margin:18px 0 8px;color:#0f172a;font-size:24px;">Appointment Confirmed</h2>
                <p style="margin:0;color:#64748b;font-size:15px;">Your appointment has been booked successfully.</p>
              </div>

              <p style="color:#334155;font-size:15px;line-height:24px;">
                Hello <b>${userData.name}</b>,
              </p>

              <p style="color:#334155;font-size:15px;line-height:24px;">
                Your appointment with <b>${docData.name}</b> has been confirmed. Please reach on time.
              </p>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:20px;margin:24px 0;">
                <h3 style="margin:0 0 16px;color:#0f172a;font-size:18px;">Appointment Details</h3>

                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Doctor</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${docData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Speciality</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${docData.speciality}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Date</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${slotDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Time</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${slotTime}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Fee</td>
                    <td style="padding:10px 0;color:#2563eb;font-weight:800;text-align:right;">₹${docData.fees}</td>
                  </tr>
                </table>
              </div>

              <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px;border-radius:12px;">
                <p style="margin:0;color:#1e3a8a;font-size:14px;line-height:22px;">
                  Tip: You can view, pay, or cancel your appointment from the My Appointments page.
                </p>
              </div>

              <p style="margin-top:28px;color:#64748b;font-size:14px;line-height:22px;">
                Thank you for choosing MediCare+. We wish you good health.
              </p>

              <div style="margin-top:30px;text-align:center;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} MediCare+. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized action",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    const userData = await userModel.findById(userId).select("-password");

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    await sendEmail({
      to: userData.email,
      subject: "Appointment Cancelled | MediCare+",
      html: `
        <div style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:640px;margin:0 auto;padding:30px 16px;">
            <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:28px;border-radius:24px 24px 0 0;text-align:center;color:white;">
              <h1 style="margin:0;font-size:30px;font-weight:800;">MediCare+</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Trusted Doctor Appointment Platform</p>
            </div>

            <div style="background:#ffffff;padding:32px;border-radius:0 0 24px 24px;border:1px solid #fee2e2;">
              <div style="text-align:center;margin-bottom:24px;">
             <div style="text-align:center; margin-bottom:20px;">
  <img
    src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
    alt="Cancelled"
    width="72"
    height="72"
    style="
      display:block;
      margin:0 auto;
      border-radius:50%;
      background:#fee2e2;
      padding:12px;
    "
  />
</div>
                <h2 style="margin:18px 0 8px;color:#0f172a;font-size:24px;">Appointment Cancelled</h2>
                <p style="margin:0;color:#64748b;font-size:15px;">Your appointment has been cancelled successfully.</p>
              </div>

              <p style="color:#334155;font-size:15px;line-height:24px;">
                Hello <b>${userData.name}</b>,
              </p>

              <p style="color:#334155;font-size:15px;line-height:24px;">
                Your appointment with <b>${doctorData.name}</b> has been cancelled.
              </p>

              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:20px;margin:24px 0;">
                <h3 style="margin:0 0 16px;color:#0f172a;font-size:18px;">Cancelled Appointment Details</h3>

                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Doctor</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${doctorData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Speciality</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${doctorData.speciality}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Date</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${slotDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#64748b;">Time</td>
                    <td style="padding:10px 0;color:#0f172a;font-weight:700;text-align:right;">${slotTime}</td>
                  </tr>
                </table>
              </div>

              <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:12px;">
                <p style="margin:0;color:#991b1b;font-size:14px;line-height:22px;">
                  Your slot has been released and is now available for other patients.
                </p>
              </div>

              <p style="margin-top:28px;color:#64748b;font-size:14px;line-height:22px;">
                You can book a new appointment anytime from MediCare+.
              </p>

              <div style="margin-top:30px;text-align:center;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} MediCare+. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    const currency = process.env.CURRENCY.toLocaleLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: "Appointment Fees",
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items: line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;

    if (success === "true") {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
      });
      return res.json({ success: true, message: "Payment Successful" });
    }

    res.json({ success: false, message: "Payment Failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
};
