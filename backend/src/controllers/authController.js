import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import User from "../models/User.js";
import genToken from "../utils/genToken.js";
import { signupSchema } from "../utils/zodSchemas.js";

export const signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã tồn tại",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    });

    genToken(user._id, res);

    res.status(201).json({
      message: "Đăng ký thành công",
      success: true,
      user: {
        email: user.email,
        id: user._id,
        name: user.name,
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

    res.status(500).json({
      message: "Lỗi máy chủ",
      success: false,
    });
  }
};
