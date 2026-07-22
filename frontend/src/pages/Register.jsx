import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import PasswordInput from "../components/PasswordInput";
import RoleSelector from "../components/RoleSelector";
import AuthLayout from "../layouts/AuthLayout";
import { signupUser } from "../services/authService";
import { signupSchema } from "../validations/authSchema";

const INITIAL_FORM = { confirmPassword: "", email: "", name: "", password: "" };

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = signupSchema.safeParse({ ...form, role });
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

    setLoading(true);
    try {
      await signupUser({
        email: result.data.email,
        name: result.data.name,
        password: result.data.password,
        role: result.data.role,
      });
      toast.success("Tạo tài khoản thành công!");
      navigate("/login");
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (status === 409) toast.error("Email đã tồn tại");
      else if (status === 400) toast.error(msg || "Dữ liệu không hợp lệ");
      else if (status === 500) toast.error("Lỗi máy chủ. Vui lòng thử lại.");
      else if (!err.response)
        toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Tham gia cộng đồng học tập của chúng tôi và bắt đầu hành trình của bạn ngay hôm nay."
      title="Virtual Courses"
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="font-bold text-2xl text-gray-900">
            Tạo tài khoản của bạn
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            Bắt đầu học với Khóa học ảo
          </p>
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-400" : "border-gray-300"
              } ${loading ? "opacity-50" : ""}`}
              disabled={loading}
              id="name"
              onChange={handleChange}
              placeholder="Họ và tên"
              type="text"
              value={form.name}
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="email"
            >
              Địa chỉ Email
            </label>
            <input
              autoComplete="email"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-400" : "border-gray-300"
              } ${loading ? "opacity-50" : ""}`}
              disabled={loading}
              id="email"
              onChange={handleChange}
              placeholder="Địa chỉ Email"
              type="email"
              value={form.email}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <PasswordInput
            error={errors.password}
            id="password"
            label="Mật khẩu"
            loading={loading}
            onChange={handleChange}
            onToggleShow={() => setShowPassword((s) => !s)}
            placeholder="Mật khẩu"
            show={showPassword}
            value={form.password}
          />

          <PasswordInput
            error={errors.confirmPassword}
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            loading={loading}
            onChange={handleChange}
            onToggleShow={() => setShowPassword((s) => !s)}
            placeholder="Xác nhận mật khẩu"
            show={showPassword}
            value={form.confirmPassword}
          />

          <RoleSelector loading={loading} onChange={setRole} value={role} />

          <AuthButton icon={UserPlus} loading={loading}>
            Tạo tài khoản
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Đã có tài khoản?{" "}
          <Link
            className={`font-medium transition ${
              loading
                ? "pointer-events-none text-blue-300 opacity-50"
                : "text-blue-600 hover:text-blue-700"
            }`}
            to="/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
