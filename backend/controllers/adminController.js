import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import sendEmail from "../utils/sendEmail.js";
import userModel from "../models/userModel.js";


// // Configure Multer for file uploads (certifications, images)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// API for adding a doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file; img // Get uploaded file
    let imageUrl = null;

    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing required details!" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters!" });
    }

    // Validate and parse address
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid address format!" });
    }

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        imageUrl = uploadedImage.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ success: false, message: "Image upload failed!" });
      }
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor entry
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      image: imageUrl,
      date: Date.now(),
    });

    // Save doctor to database
    await newDoctor.save();

    res.status(201).json({ success: true, message: "Doctor added successfully!" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
      return res.json({ success: true, token });
    }

    res.json({ success: false, message: "Invalid credentials!" });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Fetching all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find(); // Fetch all doctors from the database
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
};

// Doctor appling for approval
const applyDoctor = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, addressLine1, addressLine2 } = req.body;
    const certificationFile = req.file?.certification; // Check for certification upload
    let certificationUrl = "";

    if (certificationFile) {
      const uploadedCert = await cloudinary.uploader.upload(certificationFile.path, { resource_type: "image" });
      certificationUrl = uploadedCert.secure_url;
    }

    // Create new doctor application
    const newDoctorApplication = new doctorModel({
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: { line1: addressLine1, line2: addressLine2 },
      certification: certificationUrl,
      approved: false,
    });

    await newDoctorApplication.save();
    res.status(201).json({ success: true, message: "Doctor application submitted. Pending admin approval." });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ success: false, message: "Error submitting application" });
  }
};

// Fetch all pending doctor applications
const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await doctorModel.find({ approved: false });
    res.status(200).json({ success: true, doctors: pendingDoctors });
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ success: false, message: "Error fetching pending applications" });
  }
};




//  approving doctor application
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    doctor.approved = true;
    await doctor.save();

        // // Send approval email
        // await sendEmail(
        //   doctor.email,
        //   "Application Approved",
        //   `<p>Dear ${doctor.name},</p>
        //   <p>Congratulations! Your application has been approved.</p>
        //   <p>You can now access your doctor dashboard.</p>
        //   <p>Best Regards,<br/>Admin Team</p>`
        // );

        // Send approval email
    const emailSubject = "Application Approved";
    const emailMessage = `
      Dear ${doctor.name},

      Congratulations! Your application has been approved.
      You can now access your doctor dashboard.

      Best Regards,
      Admin Team
    `;

    const emailResult = await sendEmail(doctor.email, emailSubject, emailMessage);

    if (!emailResult.success) {
      console.error("Error sending approval email:", emailResult.message);
      return res.status(500).json({ success: false, message: "Doctor approved, but email could not be sent." });
    }
    
    res.status(200).json({ success: true, message: "Doctor approved successfully" });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ success: false, message: "Error approving doctor" });
  }
};

//  cancelling doctor application
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await doctorModel.findByIdAndDelete(doctorId);

    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

     // Send rejection email
     await sendEmail(
      doctor.email,
      "Application Rejected",
      `<p>Dear ${doctor.name},</p>
      <p>We regret to inform you that your application has been rejected.</p>
      <p>If you have any questions, please contact support.</p>
      <p>Best Regards,<br/>Admin Team</p>`
    );

    res.status(200).json({ success: true, message: "Doctor application rejected" });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ success: false, message: "Error rejecting doctor" });
  }
}


const getDoctorCount = async (req, res) => {
  try {
    const count = await doctorModel.countDocuments(); // Count all doctors
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching doctor count:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor count." });
  }
}

const getPatientCount = async (req, res) => {
  try {
    // Count all users in the database
    const count = await userModel.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching patient count:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient count." });
  }
};

export { addDoctor, loginAdmin, allDoctors, applyDoctor, getPendingDoctors, approveDoctor, rejectDoctor, getDoctorCount, getPatientCount}
