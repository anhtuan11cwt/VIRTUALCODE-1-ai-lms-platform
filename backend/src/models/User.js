import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    enrolledCourses: [
      {
        ref: "Course",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    name: {
      required: true,
      trim: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    photoUrl: {
      default: "",
      type: String,
    },
    resetOtp: {
      default: null,
      type: String,
    },
    resetOtpExpireAt: {
      default: null,
      type: Date,
    },
    role: {
      default: "student",
      enum: ["student", "educator"],
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
