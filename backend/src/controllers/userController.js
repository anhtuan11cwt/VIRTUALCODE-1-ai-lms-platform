import { ZodError } from "zod";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { updateProfileSchema } from "../utils/zodSchemas.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = updateProfileSchema.parse(req.body);

    const updateFields = { bio, name };

    if (req.file) {
      const existing = await User.findById(req.userId).select("photoUrl");
      if (existing?.photoUrl) await deleteFromCloudinary(existing.photoUrl);

      const uploadResult = await uploadOnCloudinary(req.file.buffer, {
        folder: "1-ai-lms-platform/users/avatar",
      });
      if (uploadResult?.secure_url) {
        updateFields.photoUrl = uploadResult.secure_url;
      }
    }

    const user = await User.findByIdAndUpdate(req.userId, updateFields, {
      returnDocument: "after",
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    res.json({
      message: "Cập nhật hồ sơ thành công",
      success: true,
      user: {
        bio: user.bio,
        email: user.email,
        enrolledCourses: user.enrolledCourses,
        id: user._id,
        name: user.name,
        photoUrl: user.photoUrl,
        role: user.role,
      },
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

export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    const courses = await Course.find({
      _id: { $in: user.enrolledCourses },
    }).populate("creator", "name photoUrl");

    res.json({ courses, success: true });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
