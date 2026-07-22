import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Globe,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { removeCourse, updateCourse } from "../redux/courseSlice";
import api from "../services/api";
import { editCourseSchema } from "../validations/authSchema";

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

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    category: "",
    description: "",
    level: "Beginner",
    price: "",
    subtitle: "",
    title: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/course/${id}`);
        const c = data.course;
        setForm({
          category: c.category || "",
          description: c.description || "",
          level: c.level || "Beginner",
          price: c.price ? String(c.price) : "",
          subtitle: c.subtitle || "",
          title: c.title || "",
        });
        setStatus(c.status || "Draft");
        if (c.thumbnail) setPreview(c.thumbnail);
      } catch {
        toast.error("Không thể tải khóa học");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải dưới 5MB");
      return;
    }
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (newStatus) => {
    const payload = { ...form };
    if (newStatus) payload.status = newStatus;

    const result = editCourseSchema.safeParse(payload);
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
      const fd = new FormData();
      fd.append("title", result.data.title);
      fd.append("subtitle", result.data.subtitle || "");
      fd.append("description", result.data.description || "");
      fd.append("category", result.data.category);
      fd.append("level", result.data.level);
      fd.append("price", String(result.data.price || 0));
      if (newStatus) fd.append("status", newStatus);
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      const { data } = await api.put(`/course/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(updateCourse(data.course));
      setStatus(data.course.status);
      toast.success(
        newStatus === "Published"
          ? "Khóa học đã được xuất bản"
          : newStatus === "Draft"
            ? "Khóa học đã được gỡ xuất bản"
            : "Cập nhật khóa học thành công",
      );
      navigate("/dashboard");
    } catch (errResponse) {
      const msg = errResponse.response?.data?.message || "Cập nhật thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/course/${id}`);
      dispatch(removeCourse(id));
      toast.success("Đã xóa khóa học");
      navigate("/dashboard");
    } catch {
      toast.error("Xóa khóa học thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
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

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="font-bold text-2xl text-gray-900">
            Chỉnh sửa khóa học
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Cập nhật thông tin chi tiết khóa học của bạn
          </p>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-center">
              <button
                className={`relative ${
                  loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
                disabled={loading}
                onClick={() => fileRef.current?.click()}
                type="button"
              >
                {preview ? (
                  <img
                    alt=""
                    className="h-36 w-56 rounded-xl object-cover"
                    src={preview}
                  />
                ) : (
                  <div className="flex h-36 w-56 items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-sm">
                    Chọn ảnh
                  </div>
                )}
                <span className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                  <Camera size={16} />
                </span>
              </button>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImage}
                ref={fileRef}
                type="file"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="title"
              >
                Tiêu đề
              </label>
              <input
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.title ? "border-red-400" : "border-gray-300"
                }`}
                disabled={loading}
                id="title"
                onChange={handleChange}
                type="text"
                value={form.title}
              />
              {errors.title && (
                <p className="mt-1 text-red-500 text-xs">{errors.title}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="subtitle"
              >
                Phụ đề
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
                id="subtitle"
                onChange={handleChange}
                type="text"
                value={form.subtitle}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="description"
              >
                Mô tả
              </label>
              <textarea
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
                id="description"
                onChange={handleChange}
                rows={5}
                value={form.description}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  onChange={handleChange}
                  value={form.category}
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

              <div className="space-y-1.5">
                <label
                  className="block font-medium text-gray-700 text-sm"
                  htmlFor="level"
                >
                  Cấp độ
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                  id="level"
                  onChange={handleChange}
                  value={form.level}
                >
                  <option value="Beginner">Cơ bản</option>
                  <option value="Intermediate">Trung cấp</option>
                  <option value="Advanced">Nâng cao</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="price"
              >
                Giá (VNĐ) — để trống nếu miễn phí, tối thiểu 15,000₫
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
                id="price"
                min="0"
                onChange={handleChange}
                type="number"
                value={form.price}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 text-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => navigate("/dashboard")}
                type="button"
              >
                <X size={18} />
                Hủy
              </button>
              <button
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => handleSave()}
                type="button"
              >
                <Save size={18} />
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 text-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() =>
                  handleSave(status === "Published" ? "Draft" : "Published")
                }
                type="button"
              >
                <Globe size={18} />
                {status === "Published" ? "Gỡ xuất bản" : "Xuất bản khóa học"}
              </button>
            </div>

            {!deleteConfirm ? (
              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 text-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => setDeleteConfirm(true)}
                type="button"
              >
                <Trash2 size={18} />
                Xóa khóa học
              </button>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="mb-3 font-medium text-red-700 text-sm">
                  Bạn có chắc muốn xóa khóa học này? Hành động này không thể
                  hoàn tác.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition hover:bg-gray-50 disabled:opacity-60"
                    disabled={loading}
                    onClick={() => setDeleteConfirm(false)}
                    type="button"
                  >
                    <X size={16} />
                    Hủy
                  </button>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-red-700 disabled:opacity-60"
                    disabled={loading}
                    onClick={handleDelete}
                    type="button"
                  >
                    <AlertTriangle size={16} />
                    {loading ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
