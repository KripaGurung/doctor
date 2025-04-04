import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
        type: Object,
        default: {
            line1: "",
            line2: ""
        }
    },
    image: { type: String, default: "" },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    phone: { type: String, default: '0000000000' },
    resetToken: String,
  resetTokenExpiry: Date,
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;