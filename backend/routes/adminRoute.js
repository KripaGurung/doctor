import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  getPendingDoctors,
  applyDoctor,
  approveDoctor,
  rejectDoctor,
} from "../controllers/adminController.js"; // Consolidated imports

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Add doctor (Protected Route)
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addDoctor
);

// Fetch all doctors (GET instead of POST)
adminRouter.get("/all-doctors", authAdmin, allDoctors);

// Fetch all pending doctor applications
adminRouter.get("/pending-doctors", authAdmin, getPendingDoctors);

// Doctor applies for approval (with certification upload)
adminRouter.post(
  "/apply-doctor",
  upload.fields([{ name: "certification", maxCount: 1 }]),
  applyDoctor
);

// Approve doctor application
adminRouter.post("/approve-doctor", authAdmin, approveDoctor);

// Reject doctor application
adminRouter.post("/reject-doctor", authAdmin, rejectDoctor);

export default adminRouter;
