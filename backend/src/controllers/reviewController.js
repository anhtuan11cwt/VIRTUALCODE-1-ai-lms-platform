import { ZodError } from "zod";
import Course from "../models/Course.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { createReviewSchema } from "../utils/zodSchemas.js";

export const createReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = createReviewSchema.parse(req.body);
    const userId = req.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }

    const user = await User.findById(userId);
    if (!user.enrolledCourses?.some((c) => c.toString() === courseId)) {
      return res.status(403).json({
        message: "Bạn phải ghi danh khóa học trước khi đánh giá",
        success: false,
      });
    }

    const existing = await Review.findOne({ course: courseId, user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá khóa học này rồi", success: false });
    }

    const review = await Review.create({
      comment,
      course: courseId,
      rating,
      user: userId,
    });

    const allReviews = await Review.find({ course: courseId });
    const avgRating =
      allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    course.rating = Math.round(avgRating * 10) / 10;
    course.reviews = allReviews.length;
    await course.save();

    await review.populate("user", "name photoUrl");

    res
      .status(201)
      .json({ message: "Đánh giá thành công", review, success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        message: "Dữ liệu không hợp lệ",
        success: false,
      });
    }
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl")
      .sort({ createdAt: -1 });

    res.json({ reviews, success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        message: "Dữ liệu không hợp lệ",
        success: false,
      });
    }
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
