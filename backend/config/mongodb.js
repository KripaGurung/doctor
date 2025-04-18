// import mongoose from "mongoose";

// const connectDB = async () => {
  
    
//     mongoose.connection.on('connected', () => console.log("Database Connected"))

//     await mongoose.connect(`${process.env.MONGODB_URI}/FYP`)
// }

// export default connectDB


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("MongoDB Error:", err));

    await mongoose.connect(`${process.env.MONGODB_URI}/FYP`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB