import { ChevronLeft, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../services/api";

const ViewLectures = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, lectureRes] = await Promise.all([
          api.get(`/course/${courseId}`),
          api.get(`/course/course-lecture/${courseId}`),
        ]);
        setCourse(courseRes.data.course);
        const all = lectureRes.data.course?.lectures || [];
        setLectures(all);
        if (all.length > 0) {
          const first = all.find((l) => l.videoUrl) || all[0];
          setLecture(first);
        }
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const selectLecture = (l) => {
    if (l.videoUrl) {
      setLecture(l);
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <ClipLoader color="#2563eb" size={32} />
      </div>
    );
  }

  if (fetchError || !course || !lecture) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 bg-slate-50">
        <p className="text-gray-500">Không thể tải nội dung khóa học</p>
        <button
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-blue-700"
          onClick={() => navigate(-1)}
          type="button"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const creator = course.creator;

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-slate-50 lg:flex-row">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3 border-gray-100 border-b px-4 py-3">
            <button
              className="flex cursor-pointer items-center gap-1 text-gray-500 text-sm transition hover:text-gray-700"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ChevronLeft size={18} />
              Quay lại
            </button>
            <button
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 text-xs transition hover:bg-gray-50 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              type="button"
            >
              Danh sách bài học
            </button>
          </div>
          <div className="flex items-center gap-3 border-gray-100 border-b px-4 py-2 lg:hidden">
            <p className="truncate font-medium text-gray-700 text-sm">
              {course.title}
            </p>
          </div>
          {/* Desktop title */}
          <div className="hidden items-center gap-3 border-gray-100 border-b px-4 py-3 lg:flex">
            <p className="truncate font-medium text-gray-700 text-sm">
              {course.title}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-black">
          <video
            className="mx-auto h-full w-full max-w-5xl"
            controls
            key={lecture._id}
            preload="metadata"
          >
            <source src={lecture.videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <h1 className="font-bold text-gray-900 text-xl">
            {lecture.lectureTitle}
          </h1>

          {lectures.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold text-gray-900">
                Nội dung khóa học
              </h2>
              <div className="space-y-1.5 lg:hidden">
                {lectures.map((l) => {
                  const isActive = lecture._id === l._id;
                  return (
                    <button
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-blue-100 font-medium text-blue-700"
                          : l.videoUrl
                            ? "text-gray-700 hover:bg-gray-100"
                            : "cursor-not-allowed text-gray-400"
                      }`}
                      disabled={!l.videoUrl}
                      key={l._id}
                      onClick={() => selectLecture(l)}
                      type="button"
                    >
                      <Play
                        className={isActive ? "text-blue-600" : "text-gray-400"}
                        size={14}
                      />
                      <span className="truncate">{l.lectureTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {creator && (
            <div className="mt-8 rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-4">
                {creator.photoUrl ? (
                  <img
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover"
                    src={creator.photoUrl}
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-lg text-white">
                    {(creator.name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {creator.name || "Giảng viên"}
                  </p>
                  {creator.email && (
                    <p className="text-gray-500 text-sm">{creator.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 w-80 translate-x-0 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-80 lg:translate-x-0 lg:border-gray-100 lg:border-l lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-gray-100 border-b px-4 py-3 lg:hidden">
          <span className="font-semibold text-gray-900">Bài học</span>
          <button
            aria-label="Đóng"
            className="cursor-pointer p-1 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="overflow-y-auto p-3"
          style={{ height: "calc(100% - 52px)" }}
        >
          <div className="space-y-1">
            {lectures.map((l, i) => {
              const isActive = lecture._id === l._id;
              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-blue-100 font-medium text-blue-700"
                      : l.videoUrl
                        ? "text-gray-700 hover:bg-gray-100"
                        : "cursor-not-allowed text-gray-400"
                  }`}
                  disabled={!l.videoUrl}
                  key={l._id}
                  onClick={() => selectLecture(l)}
                  type="button"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 text-xs">
                    {i + 1}
                  </span>
                  <span className="truncate">{l.lectureTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ViewLectures;
