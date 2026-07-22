import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      default: "",
      trim: true,
      type: String,
    },
    course: {
      ref: "Course",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    rating: {
      max: 5,
      min: 1,
      required: true,
      type: Number,
    },
    user: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Review", reviewSchema);
