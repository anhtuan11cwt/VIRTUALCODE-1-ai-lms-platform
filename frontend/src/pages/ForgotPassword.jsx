import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmailStep from "../components/ForgotPassword/EmailStep";
import OTPStep from "../components/ForgotPassword/OTPStep";
import ResetPasswordStep from "../components/ForgotPassword/ResetPasswordStep";
import AuthLayout from "../layouts/AuthLayout";
import api from "../services/api";
import { forgotPasswordEmailSchema } from "../validations/authSchema";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const result = forgotPasswordEmailSchema.safeParse({ email });
    if (!result.success) {
      const first = result.error.flatten().fieldErrors.email?.[0];
      setEmailError(first || "Vui lòng nhập email");
      return;
    }
    setEmailError("");

    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: result.data.email });
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (errResponse) {
      const msg = errResponse.response?.data?.message || "Gửi OTP thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: email.toLowerCase().trim(),
        otp,
      });
      toast.success("Xác minh OTP thành công");
      setStep(3);
    } catch (errResponse) {
      const msg = errResponse.response?.data?.message || "OTP không hợp lệ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: email.trim() });
      toast.success("Đã gửi lại OTP");
    } catch (errResponse) {
      const msg = errResponse.response?.data?.message || "Gửi lại OTP thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (password) => {
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: email.trim(),
        password,
      });
      toast.success("Đặt lại mật khẩu thành công");
      setTimeout(() => navigate("/login"), 2000);
    } catch (errResponse) {
      const msg =
        errResponse.response?.data?.message || "Đặt lại mật khẩu thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate("/login");
  };

  return (
    <AuthLayout
      subtitle="Đặt lại mật khẩu và tiếp tục học tập."
      title="Khóa học ảo"
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <button
          className={`mb-6 flex cursor-pointer items-center gap-1.5 text-sm transition ${
            loading
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          disabled={loading}
          onClick={goBack}
          type="button"
        >
          <ArrowLeft size={16} />
          {step > 1 ? "Quay lại" : "Quay lại đăng nhập"}
        </button>

        {step === 1 && (
          <EmailStep
            email={email}
            error={emailError}
            loading={loading}
            onSubmit={handleSendOTP}
            setEmail={(val) => {
              setEmail(val);
              if (emailError) setEmailError("");
            }}
          />
        )}

        {step === 2 && (
          <OTPStep
            email={email}
            loading={loading}
            onResend={handleResendOTP}
            onVerify={handleVerifyOTP}
          />
        )}

        {step === 3 && (
          <ResetPasswordStep loading={loading} onSubmit={handleResetPassword} />
        )}

        {step === 3 && (
          <div className="mt-6 text-center">
            <button
              className={`inline-flex cursor-pointer items-center gap-2 text-sm transition ${
                loading
                  ? "cursor-not-allowed text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
              disabled={loading}
              onClick={() => navigate("/login")}
              type="button"
            >
              <CheckCircle size={16} />
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
