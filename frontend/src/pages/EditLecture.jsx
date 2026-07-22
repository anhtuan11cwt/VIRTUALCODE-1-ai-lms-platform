import { ArrowLeft, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../services/api";
import { createLectureSchema } from "../validations/authSchema";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideo, setExistingVideo] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/course/course-lecture/${courseId}`);
        const lecture = data.course?.lectures?.find((l) => l._id === lectureId);
        if (lecture) {
          setLectureTitle(lecture.lectureTitle || "");
          setExistingVideo(lecture.videoUrl || "");
          setIsPreviewFree(lecture.isPreviewFree || false);
        } else {
          toast.error("Không tìm thấy bài học");
          navigate(`/dashboard/edit-course/${courseId}/lectures`);
        }
      } catch {
        toast.error("Không thể tải bài học");
        navigate(`/dashboard/edit-course/${courseId}/lectures`);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [courseId, lectureId, navigate]);

  const videoPreviewUrl = useMemo(() => {
    if (videoFile) return URL.createObjectURL(videoFile);
    return existingVideo || null;
  }, [videoFile, existingVideo]);

  const handleSubmit = async (e) => {
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
      const formData = new FormData();
      formData.append("lectureTitle", result.data.lectureTitle);
      formData.append("isPreviewFree", String(isPreviewFree));
      if (videoFile) formData.append("videoUrl", videoFile);

      await api.post(`/course/edit-lecture/${lectureId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Cập nhật bài học thành công");
      navigate(`/dashboard/edit-course/${courseId}/lectures`);
    } catch (errResponse) {
      const msg =
        errResponse.response?.data?.message || "Cập nhật bài học thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <ClipLoader color="#2563eb" size={32} />
      </div>
    );
  }

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
          onClick={() =>
            navigate(`/dashboard/edit-course/${courseId}/lectures`)
          }
          type="button"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="font-bold text-2xl text-gray-900">
            Chỉnh sửa bài học
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Cập nhật tiêu đề, video và trạng thái xem trước
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                type="text"
                value={lectureTitle}
              />
              {errors.lectureTitle && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.lectureTitle}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="block font-medium text-gray-700 text-sm">
                Video bài học
              </p>
              {existingVideo && !videoFile && (
                <p className="mb-2 text-green-600 text-xs">
                  Đã có video:{" "}
                  <a
                    className="underline hover:text-green-700"
                    href={existingVideo}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Xem video
                  </a>
                </p>
              )}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-4 text-sm transition disabled:opacity-50 ${
                  loading
                    ? "pointer-events-none border-gray-200 text-gray-300"
                    : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                <Upload size={20} />
                <span>
                  {videoFile ? videoFile.name : "Chọn video (mp4, mov, webm)"}
                </span>
                <input
                  accept="video/*"
                  className="hidden"
                  disabled={loading}
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  type="file"
                />
              </label>
              {(videoFile || existingVideo) && (
                <div
                  className={`mt-3 overflow-hidden rounded-lg bg-black transition ${
                    loading ? "pointer-events-none blur-sm" : ""
                  }`}
                >
                  <video
                    className="max-h-64 w-full"
                    controls
                    preload="metadata"
                    src={videoPreviewUrl}
                  >
                    Trình duyệt không hỗ trợ video
                  </video>
                </div>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                checked={isPreviewFree}
                className="h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-blue-500"
                disabled={loading}
                onChange={(e) => setIsPreviewFree(e.target.checked)}
                type="checkbox"
              />
              <span className="font-medium text-gray-700 text-sm">
                Cho phép xem trước miễn phí
              </span>
            </label>

            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <ClipLoader color="#fff" size={18} />
                  Đang tải video lên, vui lòng đợi...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
