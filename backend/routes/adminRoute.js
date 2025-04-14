import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  getPendingDoctors,
  applyDoctor,
  approveDoctor,
  rejectDoctor,
  getDoctorCount,
  getPatientCount,
  getAppointments,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Add doctor (Protected Route)
adminRouter.post("/add-doctor", authAdmin, upload.fields([{ name: "image", maxCount: 1 }]), addDoctor);

adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/pending-doctors", authAdmin, getPendingDoctors);
adminRouter.post("/apply-doctor", upload.fields([{ name: "certification", maxCount: 1 }]), applyDoctor);
adminRouter.put("/approve-doctor/:id", authAdmin, approveDoctor);
adminRouter.put("/reject-doctor/:id", authAdmin, rejectDoctor);

// Route to get doctor count
adminRouter.get("/doctor-count", authAdmin, getDoctorCount);

// Route to get patient count
adminRouter.get("/patient-count", authAdmin, getPatientCount);
adminRouter.get("/appointments", getAppointments);

export default adminRouter