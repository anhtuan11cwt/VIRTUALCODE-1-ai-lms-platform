import { KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { forgotPasswordOTPSchema } from "../../validations/authSchema";

const OTPStep = ({ email, loading, onVerify, onResend }) => {
  const OTP_LENGTH = 6;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(300);
  const inputsRef = useRef([]);
  const expired = timer <= 0;

  useEffect(() => {
    if (expired) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [expired]);

  const lastIndex = OTP_LENGTH - 1;

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < lastIndex) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextFocus = Math.min(pasted.length, lastIndex);
    inputsRef.current[nextFocus]?.focus();
  };

  const handleVerify = () => {
    const result = forgotPasswordOTPSchema.safeParse({ otp: otp.join("") });
    if (!result.success) return;
    onVerify(result.data.otp);
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(300);
    onResend();
    inputsRef.current[0]?.focus();
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <KeyRound className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="font-bold text-2xl text-gray-900">Xác minh OTP</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Nhập mã 6 chữ số đã được gửi đến{" "}
          <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              className={`h-14 w-14 rounded-lg border-2 text-center font-bold text-xl transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                digit
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              } ${loading || expired ? "opacity-50" : ""}`}
              disabled={loading || expired}
              inputMode="numeric"
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed 6-position OTP inputs, never reordered
              key={index}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={digit}
            />
          ))}
        </div>

        <div className="text-center">
          {expired ? (
            <p className="font-medium text-red-500 text-sm">OTP đã hết hạn</p>
          ) : (
            <p className="text-gray-500 text-sm">
              OTP hết hạn trong{" "}
              <span
                className={`font-bold font-mono ${
                  timer <= 60 ? "text-red-500" : "text-gray-700"
                }`}
              >
                {minutes}:{seconds}
              </span>
            </p>
          )}
        </div>

        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || expired || otp.join("").length !== OTP_LENGTH}
          onClick={handleVerify}
          type="button"
        >
          {loading ? (
            <ShieldCheck className="h-4 w-4 animate-pulse" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {loading ? "Đang xác minh..." : "Xác minh"}
        </button>

        {expired && (
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-medium text-blue-600 text-sm transition hover:bg-blue-50"
            onClick={handleResend}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Gửi lại OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPStep;
