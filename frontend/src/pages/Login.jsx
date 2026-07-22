import { LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import PasswordInput from "../components/PasswordInput";
import AuthLayout from "../layouts/AuthLayout";
import { setUser } from "../redux/userSlice";
import { loginUser } from "../services/authService";
import { loginSchema } from "../validations/authSchema";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);
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
      const { data } = await loginUser({
        email: result.data.email,
        password: result.data.password,
      });
      dispatch(setUser(data.user || data));
      toast.success("Chào mừng trở lại!");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (status === 401) toast.error("Email hoặc mật khẩu không hợp lệ");
      else if (status === 400) toast.error(msg);
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
      subtitle="Chào mừng trở lại — tiếp tục hành trình học tập của bạn."
      title="Virtual Courses"
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="font-bold text-2xl text-gray-900">
            Chào mừng trở lại
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            Đăng nhập vào tài khoản để tiếp tục
          </p>
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
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
            placeholder="Mật khẩu"
            value={form.password}
          />

          <div className="flex justify-end">
            <Link
              className={`font-medium text-sm transition ${
                loading
                  ? "pointer-events-none text-blue-300 opacity-50"
                  : "text-blue-600 hover:text-blue-700"
              }`}
              to="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <AuthButton icon={LogIn} loading={loading}>
            Đăng nhập
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Chưa có tài khoản?{" "}
          <Link
            className={`font-medium transition ${
              loading
                ? "pointer-events-none text-blue-300 opacity-50"
                : "text-blue-600 hover:text-blue-700"
            }`}
            to="/register"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
