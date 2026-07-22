import { z } from "zod";

const commonWeakPasswords = [
  "12345678",
  "password",
  "qwerty",
  "123456789",
  "1234567890",
  "abc123",
  "password1",
  "12345",
  "123456",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "sunshine",
  "princess",
  "football",
  "iloveyou",
  "trustno1",
  "admin",
  "passw0rd",
  "p@ssword",
  "p@ssw0rd",
  "changeme",
  "default",
  "guest",
  "temp123",
  "temp1234",
];

const emailSchema = z
  .string({ required_error: "Email là bắt buộc" })
  .trim()
  .toLowerCase()
  .email("Định dạng email không hợp lệ");

const passwordSchema = z
  .string({ required_error: "Mật khẩu là bắt buộc" })
  .min(8, { message: "Phải có ít nhất 8 ký tự" })
  .max(64, { message: "Phải dưới 64 ký tự" })
  .regex(/^\S+$/, { message: "Mật khẩu không được chứa khoảng trắng" })
  .regex(/[A-Z]/, { message: "Phải chứa ít nhất một chữ hoa" })
  .regex(/[a-z]/, { message: "Phải chứa ít nhất một chữ thường" })
  .regex(/[0-9]/, { message: "Phải chứa ít nhất một số" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Phải chứa ít nhất một ký tự đặc biệt",
  })
  .refine((val) => !/\p{Extended_Pictographic}/u.test(val), {
    message: "Mật khẩu không được chứa emoji",
  })
  .refine((val) => !commonWeakPasswords.includes(val.toLowerCase()), {
    message: "Mật khẩu quá phổ biến và dễ đoán",
  });

export const signupSchema = z.object({
  email: emailSchema,
  name: z
    .string({ required_error: "Tên là bắt buộc" })
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên phải dưới 100 ký tự")
    .regex(
      /^[\p{L}'-]+(?: [\p{L}'-]+)*$/u,
      "Tên chỉ được chứa chữ cái, dấu gạch ngang (-), dấu nháy (') và khoảng trắng đơn",
    ),
  password: passwordSchema,
  role: z.enum(["student", "educator"]).default("student"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(1, "Mật khẩu là bắt buộc"),
});

export const sendOTPSchema = z.object({
  email: emailSchema,
});

export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: z
    .string({ required_error: "OTP là bắt buộc" })
    .length(6, "OTP phải có 6 chữ số")
    .regex(/^\d{6}$/, "OTP không hợp lệ"),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
