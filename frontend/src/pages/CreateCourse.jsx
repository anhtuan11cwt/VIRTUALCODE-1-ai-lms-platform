import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { createCourseSchema } from "../validations/authSchema";

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI & Machine Learning",
  "DevOps",
  "Design",
  "Business",
  "Marketing",
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = createCourseSchema.safeParse({ category, title });
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
      await api.post("/course/create", {
        category: result.data.category,
        title: result.data.title,
      });
      toast.success("Tạo khóa học thành công");
      navigate("/dashboard");
    } catch (errResponse) {
      const msg =
        errResponse.response?.data?.message || "Tạo khóa học thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <button
          className={`mb-6 flex cursor-pointer items-center gap-1.5 text-sm transition ${
            loading
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          disabled={loading}
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <ArrowLeft size={16} />
          Quay lại Dashboard
        </button>

        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl text-gray-900">Tạo khóa học</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Nhập thông tin cơ bản để bắt đầu
          </p>
        </div>

        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="title"
            >
              Tiêu đề khóa học
            </label>
            <input
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.title ? "border-red-400" : "border-gray-300"
              }`}
              disabled={loading}
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              placeholder="VD: Lập trình MERN toàn diện"
              type="text"
              value={title}
            />
            {errors.title && (
              <p className="mt-1 text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="category"
            >
              Danh mục
            </label>
            <select
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.category ? "border-red-400" : "border-gray-300"
              }`}
              disabled={loading}
              id="category"
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((p) => ({ ...p, category: "" }));
              }}
              value={category}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-red-500 text-xs">{errors.category}</p>
            )}
          </div>

          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            <Plus size={18} />
            {loading ? "Đang tạo..." : "Tạo khóa học"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
