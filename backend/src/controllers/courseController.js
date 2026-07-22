import { ZodError } from "zod";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Course from "../models/Course.js";
import { createCourseSchema, editCourseSchema } from "../utils/zodSchemas.js";

export const createCourse = async (req, res) => {
  try {
    const { category, title } = createCourseSchema.parse(req.body);

    const course = await Course.create({
      category,
      creator: req.userId,
      title,
    });

    res.status(201).json({
      course: {
        category: course.category,
        id: course._id,
        status: course.status,
        title: course.title,
      },
      message: "Tạo khóa học thành công",
      success: true,
    });
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

export const getPublishedCourses = async (_req, res) => {
  try {
    const courses = await Course.find({ status: "Published" })
      .sort({ createdAt: -1 })
      .populate("creator", "name photoUrl");

    res.json({ courses, success: true });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ courses, success: true });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};

export const editCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }
    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa khóa học này",
        success: false,
      });
    }

    const data = editCourseSchema.parse(req.body);

    const allowedFields = [
      "category",
      "description",
      "level",
      "price",
      "status",
      "subtitle",
      "title",
    ];
    for (const field of allowedFields) {
      if (data[field] !== undefined) course[field] = data[field];
    }

    if (req.file) {
      if (course.thumbnail) await deleteFromCloudinary(course.thumbnail);
      const uploadResult = await uploadOnCloudinary(req.file.buffer, {
        folder: "1-ai-lms-platform/courses/thumbnail",
      });
      if (uploadResult?.secure_url) course.thumbnail = uploadResult.secure_url;
    }

    if (data.status === "Published") {
      if (
        !course.title ||
        !course.subtitle ||
        !course.description ||
        !course.category ||
        !course.level ||
        course.price === undefined ||
        course.price < 15000 ||
        !course.thumbnail
      ) {
        return res.status(400).json({
          message:
            "Vui lòng điền đầy đủ: tiêu đề, phụ đề, mô tả, danh mục, cấp độ, giá (tối thiểu 15,000₫) và ảnh đại diện trước khi xuất bản",
          success: false,
        });
      }
    }

    await course.save();

    res.json({
      course,
      message: "Cập nhật khóa học thành công",
      success: true,
    });
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

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "creator",
      "name photoUrl",
    );
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }

    res.json({ course, success: true });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }
    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa khóa học này",
        success: false,
      });
    }

    if (course.thumbnail) await deleteFromCloudinary(course.thumbnail);
    await Course.findByIdAndDelete(req.params.courseId);

    res.json({ message: "Xóa khóa học thành công", success: true });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
