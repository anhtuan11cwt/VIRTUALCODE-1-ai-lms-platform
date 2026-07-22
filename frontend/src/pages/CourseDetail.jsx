import { BookOpen, Lock, Play, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Card from "../components/Card";
import api from "../services/api";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [otherCourses, setOtherCourses] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, lectureRes] = await Promise.all([
          api.get(`/course/${id}`),
          api.get(`/course/course-lecture/${id}`),
        ]);
        const c = courseRes.data.course;
        setCourse(c);
        const allLectures = lectureRes.data.course?.lectures || [];
        setLectures(allLectures);
        const firstFree = allLectures.find(
          (l) => l.isPreviewFree && l.videoUrl,
        );
        if (firstFree) setSelectedLecture(firstFree);

        const published = await api.get("/course/published");
        setOtherCourses(
          published.data.courses.filter(
            (oc) => oc.creator?._id === c.creator?._id && oc._id !== c._id,
          ),
        );
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <ClipLoader color="#2563eb" size={32} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50">
        <p className="text-gray-500">Khóa học không tồn tại</p>
      </div>
    );
  }

  const creator = course.creator;
  const stars = course.rating ? Math.round(course.rating) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {course.thumbnail ? (
                <img
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                  src={course.thumbnail}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gray-100">
                  <BookOpen className="text-gray-300" size={64} />
                </div>
              )}
            </div>

            <div className="mt-6">
              <h1 className="font-bold text-3xl text-gray-900">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="mt-2 text-gray-600 text-lg">{course.subtitle}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                {course.rating > 0 && (
                  <span className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        className={
                          i < stars
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                        key={i}
                        size={16}
                      />
                    ))}
                    <span className="ml-1 font-medium text-gray-700">
                      {course.rating?.toFixed(1)}
                    </span>
                    {course.reviews > 0 && (
                      <span>({course.reviews} đánh giá)</span>
                    )}
                  </span>
                )}
                <span>{lectures.length} bài học</span>
                <span className="capitalize">
                  {course.level?.toLowerCase()}
                </span>
              </div>

              <div className="mt-6">
                <h2 className="font-bold text-gray-900 text-xl">
                  Giới thiệu khóa học
                </h2>
                <p className="mt-2 whitespace-pre-line text-gray-600 leading-relaxed">
                  {course.description || "Chưa có mô tả"}
                </p>
              </div>
            </div>

            {lectures.length > 0 && (
              <div className="mt-10">
                <h2 className="font-bold text-gray-900 text-xl">
                  Nội dung khóa học
                </h2>
                <div className="mt-4 space-y-2">
                  {lectures.map((lecture, i) => {
                    const canPreview =
                      lecture.isPreviewFree && lecture.videoUrl;
                    const isSelected = selectedLecture?._id === lecture._id;
                    if (canPreview) {
                      return (
                        <button
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50"
                          }`}
                          key={lecture._id}
                          onClick={() => setSelectedLecture(lecture)}
                          type="button"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 text-sm">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">
                              {lecture.lectureTitle}
                            </p>
                          </div>
                          <Play className="shrink-0 text-blue-600" size={18} />
                        </button>
                      );
                    }
                    return (
                      <div
                        className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                        key={lecture._id}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 text-sm">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {lecture.lectureTitle}
                          </p>
                        </div>
                        <Lock className="shrink-0 text-gray-400" size={16} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              {selectedLecture?.videoUrl ? (
                <div className="overflow-hidden rounded-xl bg-black">
                  <video
                    className="w-full"
                    controls
                    key={selectedLecture._id}
                    preload="metadata"
                  >
                    <source src={selectedLecture.videoUrl} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
                  <Play className="text-gray-300" size={48} />
                </div>
              )}

              <div className="mt-6">
                <p className="font-bold text-3xl text-gray-900">
                  {course.price > 0
                    ? `${course.price.toLocaleString()}₫`
                    : "Miễn phí"}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">
                  Khóa học này bao gồm
                </h3>
                <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <Play className="shrink-0 text-blue-600" size={16} />
                    {lectures.length} bài học
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="shrink-0 text-amber-400" size={16} />
                    Đánh giá {course.rating || "chưa có"}
                  </li>
                  <li className="flex items-center gap-2">
                    <User className="shrink-0 text-blue-600" size={16} />
                    Giảng viên: {creator?.name || "Ẩn danh"}
                  </li>
                </ul>
              </div>

              {selectedLecture?.videoUrl && (
                <p className="mt-4 text-center text-blue-600 text-xs">
                  Đang xem thử: {selectedLecture.lectureTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {creator && (
          <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl">Giảng viên</h2>
            <div className="mt-4 flex items-start gap-4">
              {creator.photoUrl ? (
                <img
                  alt={creator.name}
                  className="h-16 w-16 rounded-full object-cover"
                  src={creator.photoUrl}
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl">
                  {(creator.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {creator.name || "Ẩn danh"}
                </p>
                {creator.email && (
                  <p className="mt-1 text-gray-500 text-sm">{creator.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {otherCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="font-bold text-gray-900 text-xl">
              Khóa học khác từ giảng viên
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherCourses.slice(0, 4).map((oc) => (
                <Card course={oc} key={oc._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
