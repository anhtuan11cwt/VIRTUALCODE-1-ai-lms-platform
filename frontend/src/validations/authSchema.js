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

const passwordSchema = z
  .string({ required_error: "Vui lòng nhập mật khẩu" })
  .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
  .max(64, { message: "Mật khẩu không được quá 64 ký tự" })
  .regex(/^\S+$/, { message: "Mật khẩu không được chứa khoảng trắng" })
  .regex(/[A-Z]/, {
    message: "Mật khẩu phải chứa ít nhất một chữ hoa",
  })
  .regex(/[a-z]/, {
    message: "Mật khẩu phải chứa ít nhất một chữ thường",
  })
  .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất một số" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
  })
  .refine((val) => !/\p{Extended_Pictographic}/u.test(val), {
    message: "Mật khẩu không được chứa biểu tượng cảm xúc",
  })
  .refine((val) => !commonWeakPasswords.includes(val.toLowerCase()), {
    message: "Mật khẩu quá phổ biến và dễ đoán",
  });

export const signupSchema = z
  .object({
    confirmPassword: z.string({
      required_error: "Vui lòng xác nhận mật khẩu",
    }),
    email: z
      .string({ required_error: "Vui lòng nhập email" })
      .trim()
      .toLowerCase()
      .email("Vui lòng nhập địa chỉ email hợp lệ"),
    name: z
      .string({ required_error: "Vui lòng nhập họ và tên" })
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(100, "Tên không được quá 100 ký tự")
      .regex(
        /^[\p{L}'-]+(?: [\p{L}'-]+)*$/u,
        "Tên chỉ được chứa chữ cái, dấu gạch ngang, dấu nháy đơn và khoảng trắng",
      ),
    password: passwordSchema,
    role: z.enum(["student", "educator"]).default("student"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .trim()
    .toLowerCase()
    .email("Vui lòng nhập địa chỉ email hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .min(1, "Vui lòng nhập mật khẩu"),
});

const forgotEmailSchema = z
  .string({ required_error: "Vui lòng nhập email" })
  .trim()
  .toLowerCase()
  .email("Vui lòng nhập địa chỉ email hợp lệ");

export const forgotPasswordEmailSchema = z.object({
  email: forgotEmailSchema,
});

export const forgotPasswordOTPSchema = z.object({
  otp: z
    .string({ required_error: "Vui lòng nhập mã OTP" })
    .length(6, "OTP phải có 6 chữ số"),
});

export const updateProfileSchema = z.object({
  bio: z
    .string({ required_error: "Vui lòng nhập giới thiệu" })
    .trim()
    .max(300, "Giới thiệu không được quá 300 ký tự")
    .optional()
    .default(""),
  name: z
    .string({ required_error: "Vui lòng nhập tên" })
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự")
    .regex(
      /^[\p{L}'-]+(?: [\p{L}'-]+)*$/u,
      "Tên chỉ được chứa chữ cái, dấu gạch ngang, dấu nháy đơn và khoảng trắng",
    ),
});

export const forgotPasswordResetSchema = z
  .object({
    confirmPassword: z.string({
      required_error: "Vui lòng xác nhận mật khẩu",
    }),
    password: z
      .string({ required_error: "Vui lòng nhập mật khẩu mới" })
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });
