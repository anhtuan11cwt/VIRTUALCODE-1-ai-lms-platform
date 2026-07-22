import { ArrowLeft, BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../redux/lectureSlice";
import api from "../services/api";
import { createLectureSchema } from "../validations/authSchema";

const CreateLecture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/course/course-lecture/${id}`);
        dispatch(setLectureData(data.course?.lectures || []));
      } catch {
        toast.error("Không thể tải danh sách bài học");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, dispatch]);

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    const result = createLectureSchema.safeParse({
      lectureTitle,
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

    setLoading(true);
    try {
      const { data } = await api.post(`/course/create-lecture/${id}`, {
        lectureTitle: result.data.lectureTitle,
      });
      dispatch(setLectureData(data.course.lectures));
      toast.success("Đã thêm bài học");
      setLectureTitle("");
    } catch (errResponse) {
      const msg = errResponse.response?.data?.message || "Tạo bài học thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      await api.delete(`/course/remove-lecture/${lectureId}`);
      dispatch(setLectureData(lectureData.filter((l) => l._id !== lectureId)));
      toast.success("Đã xóa bài học");
    } catch {
      toast.error("Xóa bài học thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          className={`mb-6 flex cursor-pointer items-center gap-1.5 text-sm transition ${
            loading
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
          disabled={loading}
          onClick={() => navigate(`/dashboard/edit-course/${id}`)}
          type="button"
        >
          <ArrowLeft size={16} />
          Quay lại khóa học
        </button>

        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="font-bold text-2xl text-gray-900">Quản lý bài học</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Thêm và quản lý các bài học cho khóa học của bạn
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreateLecture}>
            <div className="space-y-1.5">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="lectureTitle"
              >
                Tiêu đề bài học
              </label>
              <input
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.lectureTitle ? "border-red-400" : "border-gray-300"
                }`}
                disabled={loading}
                id="lectureTitle"
                onChange={(e) => {
                  setLectureTitle(e.target.value);
                  if (errors.lectureTitle)
                    setErrors((p) => ({ ...p, lectureTitle: "" }));
                }}
                placeholder="VD: Giới thiệu về React Hooks"
                type="text"
                value={lectureTitle}
              />
              {errors.lectureTitle && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.lectureTitle}
                </p>
              )}
            </div>
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <ClipLoader color="#fff" size={16} />
              ) : (
                <Plus size={18} />
              )}
              {loading ? "Đang tạo..." : "Thêm bài học"}
            </button>
          </form>
        </div>

        {fetching ? (
          <div className="flex justify-center py-12">
            <ClipLoader color="#2563eb" size={32} />
          </div>
        ) : lectureData.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 border-dashed bg-white py-16 text-center">
            <BookOpen className="mx-auto text-gray-300" size={40} />
            <p className="mt-4 font-medium text-gray-500 text-lg">
              Chưa có bài học nào
            </p>
            <p className="mt-1 text-gray-400 text-sm">
              Thêm bài học đầu tiên cho khóa học
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lectureData.map((lecture, index) => (
              <div
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200"
                key={lecture._id}
              >
                {deleteConfirmId === lecture._id ? (
                  <div className="text-center">
                    <p className="mb-3 font-medium text-red-700 text-sm">
                      Xóa bài học này?
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition hover:bg-gray-50"
                        onClick={() => setDeleteConfirmId(null)}
                        type="button"
                      >
                        Hủy
                      </button>
                      <button
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-red-700"
                        onClick={() => {
                          handleDeleteLecture(lecture._id);
                          setDeleteConfirmId(null);
                        }}
                        type="button"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 text-sm">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {lecture.lectureTitle}
                      </p>
                      {lecture.videoUrl && (
                        <p className="text-green-600 text-xs">Đã có video</p>
                      )}
                    </div>
                    <button
                      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 font-medium text-blue-600 text-xs transition hover:bg-blue-50"
                      onClick={() =>
                        navigate(
                          `/dashboard/edit-course/${id}/lecture/${lecture._id}`,
                        )
                      }
                      type="button"
                    >
                      <Pencil size={14} />
                      Sửa
                    </button>
                    <button
                      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 text-xs transition hover:bg-red-50"
                      onClick={() => setDeleteConfirmId(lecture._id)}
                      type="button"
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
