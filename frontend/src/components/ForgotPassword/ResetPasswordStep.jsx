import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { forgotPasswordResetSchema } from "../../validations/authSchema";
import PasswordInput from "../PasswordInput";

const ResetPasswordStep = ({ loading, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = forgotPasswordResetSchema.safeParse({
      confirmPassword,
      password,
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const flattened = {};
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages.length > 0) flattened[field] = messages[0];
      }
      setErrors(flattened);
      return;
    }
    setErrors({});
    onSubmit(result.data.password);
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Lock className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="font-bold text-2xl text-gray-900">Đặt mật khẩu mới</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Nhập mật khẩu mới của bạn bên dưới.
        </p>
      </div>

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <PasswordInput
          error={errors.password}
          id="password"
          label="Mật khẩu mới"
          loading={loading}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((p) => ({ ...p, password: "" }));
          }}
          onToggleShow={() => setShowPassword((s) => !s)}
          placeholder="Mật khẩu mới"
          show={showPassword}
          value={password}
        />

        <PasswordInput
          error={errors.confirmPassword}
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          loading={loading}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((p) => ({ ...p, confirmPassword: "" }));
          }}
          onToggleShow={() => setShowPassword((s) => !s)}
          placeholder="Xác nhận mật khẩu"
          show={showPassword}
          value={confirmPassword}
        />

        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <ShieldCheck className="h-4 w-4 animate-pulse" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordStep;
