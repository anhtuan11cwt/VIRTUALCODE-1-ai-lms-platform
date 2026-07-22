import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Đã kết nối MongoDB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
