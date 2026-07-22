import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  },
  service: "gmail",
});

export const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #1e3a8a; margin: 0;">Virtual Courses</h1>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0;">Đặt lại mật khẩu</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới để xác minh danh tính của bạn.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background: #eff6ff; padding: 16px 32px; border-radius: 12px; letter-spacing: 12px; font-size: 36px; font-weight: 700; color: #2563eb;">
            ${otp}
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0 0 4px;">
          Mã OTP này sẽ hết hạn trong <strong style="color: #ef4444;">5 phút</strong>.
        </p>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
        </p>
      </div>
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 20px;">
        &copy; 2026 Virtual Courses. Đã đăng ký bản quyền.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Virtual Courses" <${process.env.EMAIL_USER}>`,
    html,
    subject: "Mã OTP đặt lại mật khẩu — Virtual Courses",
    to: email,
  });
};
