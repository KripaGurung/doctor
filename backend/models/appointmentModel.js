// import mongoose from 'mongoose';
// import User from './userModel.js'; // Optional: only needed if used in pre/post hooks

// const appointmentSchema = new mongoose.Schema({
//   doctor: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'doctor',
//     required: true 
//   },
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'user',
//     required: true 
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Confirmed', 'Rejected'],
//     default: 'Pending'
//   },

//   slotDate: { type: String, required: true },
//   slotTime: { type: String, required: true },

//   patientName: { type: String, required: true },
//   reason: { type: String, default: 'General Consultation' },
//   isUrgent: { type: Boolean, default: false },

//   slotDate: { type: String, required: true },      // e.g. "2025-04-15"
//   slotTime: { type: String, required: true },      // e.g. "10:30 AM"
//   time: { type: Date },                            // Optional: could be used for exact timestamp

//   amount: { type: Number, required: true },
//   payment: { type: Boolean, default: false },

//   cancelled: { type: Boolean, default: false },
//   isCompleted: { type: Boolean, default: false },

//   userData: { type: Object, required: true },       // Snapshot of user info at time of booking
//   docData: { type: Object, required: true },        // Snapshot of doctor info at time of booking

//   createdAt: { type: Date, default: Date.now },
// });

// const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// export default Appointment;


import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'doctor',
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true 
  },
  patientName: { 
    type: String, 
    required: true 
  },
  slotDate: { 
    type: String, 
    required: true 
  },
  slotTime: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  },
  amount: { 
    type: Number, 
    required: true 
  },
  userData: { 
    type: Object, 
    required: true 
  },
  docData: { 
    type: Object, 
    required: true 
  }
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;