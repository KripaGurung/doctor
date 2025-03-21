import userModel from '../models/userModel.js';
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUserToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// API for adding user
const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        // checking for all data to add user
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details!" });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email!" });
        }

        // validating password length
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters!" });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // saving user data
        const userData = {
            name,
            email,
            password: hashedPassword,
            date: Date.now(),
        };

        const newUser = new userModel(userData);
        await newUser.save();

        const token = createUserToken(newUser._id);

        console.log("User added successfully :", newUser);
        res.json({ success: true, message: "User added successfully!", token });
    } catch (error) {
        console.log("Error adding user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("User logging in:", req.body);

        // checking for all data to login user
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details!" });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email!" });
        }

        // finding user with email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        // comparing password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials!" });
        }

        const token = createUserToken(user._id);

        console.log("User logged in successfully:", token);
        res.json({ success: true, message: "User logged in successfully!", token });
    } catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export { addUser, loginUser };