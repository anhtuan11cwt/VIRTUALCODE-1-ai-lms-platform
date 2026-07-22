import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    category: {
      required: true,
      trim: true,
      type: String,
    },
    creator: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      default: "",
      type: String,
    },
    lectures: [
      {
        ref: "Lecture",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    level: {
      default: "Beginner",
      enum: ["Beginner", "Intermediate", "Advanced"],
      type: String,
    },
    price: {
      default: 0,
      type: Number,
    },
    rating: {
      default: 0,
      type: Number,
    },
    reviews: {
      default: 0,
      type: Number,
    },
    status: {
      default: "Draft",
      enum: ["Draft", "Published"],
      type: String,
    },
    students: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    subtitle: {
      default: "",
      trim: true,
      type: String,
    },
    thumbnail: {
      default: "",
      type: String,
    },
    title: {
      required: true,
      trim: true,
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
