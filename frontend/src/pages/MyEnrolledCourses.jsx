import { BookOpen, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../services/api";

const MyEnrolledCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/user/enrolled-courses");
        setCourses(data.courses);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <ClipLoader color="#2563eb" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-900">Khóa học của tôi</h1>
          <p className="mt-1 text-gray-500 text-sm">
            {courses.length > 0
              ? `Bạn đang theo học ${courses.length} khóa học`
              : "Khám phá khóa học mới"}
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 border-dashed bg-white py-20 text-center">
            <BookOpen className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 font-medium text-gray-500 text-lg">
              Bạn chưa ghi danh khóa học nào
            </p>
            <p className="mt-1 text-gray-400 text-sm">
              Khám phá các khóa học và bắt đầu hành trình học tập
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700"
              to="/courses"
            >
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <div
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                key={course._id}
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {course.thumbnail ? (
                    <img
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      src={course.thumbnail}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <BookOpen size={40} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="mb-1 font-medium text-blue-600 text-xs uppercase tracking-wide">
                    {course.category}
                  </p>
                  <h3 className="line-clamp-2 font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-gray-500 text-xs">
                    {course.creator?.name || "Giảng viên"}
                  </p>
                  {course.level && (
                    <p className="mt-2 text-gray-400 text-xs capitalize">
                      {course.level.toLowerCase()}
                    </p>
                  )}
                  <button
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-sm text-white transition hover:bg-blue-700"
                    onClick={() => navigate(`/course/${course._id}/lectures`)}
                    type="button"
                  >
                    <Play size={16} />
                    Học ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
