import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CardPage from "../components/CardPage";
import usePublishedCourses from "../hooks/usePublishedCourses";

const Home = () => {
  const { courses, loading, error } = usePublishedCourses();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-bold text-4xl leading-tight sm:text-5xl">
              Học tập thông minh với AI
            </h1>
            <p className="mt-4 text-blue-200 text-lg">
              Khám phá các khóa học trực tuyến chất lượng cao, được thiết kế bởi
              các chuyên gia hàng đầu.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                to="/courses"
              >
                <Search size={20} />
                Khám phá khóa học
              </Link>
              {!loading && courses.length > 0 && (
                <p className="text-blue-200 text-sm">
                  {courses.length}+ khóa học đang chờ bạn
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <CardPage
        courses={courses}
        error={error}
        loading={loading}
        subtitle="Khám phá các khóa học được yêu thích nhất từ các giảng viên hàng đầu"
        title="Khóa học nổi bật"
      />

      {!loading && courses.length > 0 && (
        <div className="pb-16 text-center">
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            to="/courses"
          >
            Xem tất cả khóa học
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
