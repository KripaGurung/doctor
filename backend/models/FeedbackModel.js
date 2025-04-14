import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  patientName: String,
  comment: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
