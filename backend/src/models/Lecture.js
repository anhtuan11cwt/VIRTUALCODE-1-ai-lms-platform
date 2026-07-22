import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    isPreviewFree: {
      type: Boolean,
    },
    lectureTitle: {
      required: true,
      type: String,
    },
    videoUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lecture", lectureSchema);
