import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import User from "../models/User.js";
import genToken from "../utils/genToken.js";
import { sendOTPEmail } from "../utils/sendMail.js";
import {
  loginSchema,
  resetPasswordSchema,
  sendOTPSchema,
  signupSchema,
  verifyOTPSchema,
} from "../utils/zodSchemas.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Người dùng không tồn tại",
        success: false,
      });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        enrolledCourses: user.enrolledCourses,
        id: user._id,
        name: user.name,
        photoUrl: user.photoUrl,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      message: "Lỗi máy chủ",
      success: false,
    });
  }
};

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

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
        success: false,
      });
    }

    genToken(user._id, res);

    res.json({
      message: "Đăng nhập thành công",
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

export const logout = async (_req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Đăng xuất thành công",
    success: true,
  });
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = sendOTPSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email không tồn tại trong hệ thống",
        success: false,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.json({ message: "OTP đã được gửi tới email của bạn", success: true });
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

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user?.resetOtp) {
      return res
        .status(400)
        .json({ message: "Vui lòng yêu cầu mã OTP trước", success: false });
    }

    if (new Date() > user.resetOtpExpireAt) {
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn, vui lòng gửi lại", success: false });
    }

    if (user.resetOtp !== otp) {
      return res
        .status(400)
        .json({ message: "OTP không chính xác", success: false });
    }

    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    await user.save();

    res.json({ message: "OTP hợp lệ", success: true });
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

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công", success: true });
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
