import { Camera, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import api from "../services/api";
import { updateProfileSchema } from "../validations/authSchema";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(userData.name || "");

      setBio(userData.bio || "");
    }
  }, [userData]);

  if (!userData) return null;

  const initial = (userData.name || userData.email || "U")
    .charAt(0)
    .toUpperCase();

  const handleImageChange = (e) => {
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

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = updateProfileSchema.safeParse({ bio, name });
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
      const formData = new FormData();
      formData.append("name", result.data.name);
      formData.append("bio", result.data.bio);
      if (image) formData.append("image", image);

      const { data } = await api.put("/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setUser(data.user));
      toast.success("Cập nhật hồ sơ thành công");
      navigate("/profile");
    } catch {
      toast.error("Cập nhật hồ sơ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-slate-50">
      <div className="max-h-[calc(100dvh-8rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl text-gray-900">Chỉnh sửa hồ sơ</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <button
              className="relative cursor-pointer"
              disabled={loading}
              onClick={() => document.getElementById("imageInput")?.click()}
              type="button"
            >
              <div className={loading ? "opacity-50" : ""}>
                {preview || userData.photoUrl ? (
                  <img
                    alt="Avatar"
                    className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover"
                    src={preview || userData.photoUrl}
                  />
                ) : (
                  <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-600 font-bold text-3xl text-white">
                    {initial}
                  </span>
                )}
              </div>
              <span
                className={`absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full shadow ${
                  loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600"
                } text-white`}
              >
                <Camera size={16} />
              </span>
            </button>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={loading}
              id="imageInput"
              onChange={handleImageChange}
              type="file"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
              disabled={loading}
              id="name"
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="Tên của bạn"
              type="text"
              value={name}
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
              Email
            </label>
            <input
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 text-sm"
              disabled
              id="email"
              type="email"
              value={userData.email}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="bio"
            >
              Giới thiệu
            </label>
            <textarea
              className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.bio ? "border-red-400" : "border-gray-300"
              }`}
              disabled={loading}
              id="bio"
              maxLength={300}
              onChange={(e) => {
                setBio(e.target.value);
                if (errors.bio) setErrors((p) => ({ ...p, bio: "" }));
              }}
              placeholder="Kể về bản thân bạn..."
              rows={4}
              value={bio}
            />
            {errors.bio && (
              <p className="mt-1 text-red-500 text-xs">{errors.bio}</p>
            )}
            <p className="text-right text-gray-400 text-xs">{bio.length}/300</p>
          </div>

          <div className="flex gap-3">
            <button
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 text-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              onClick={() => navigate("/profile")}
              type="button"
            >
              <X size={18} />
              Hủy
            </button>
            <button
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              <Save size={18} />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
