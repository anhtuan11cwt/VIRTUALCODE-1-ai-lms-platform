import { ArrowLeft, BookOpen, Edit3, Plus } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setCourses, setLoading } from "../redux/courseSlice";
import api from "../services/api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { courses, loading } = useSelector((state) => state.course);

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get("/course/creator");
        dispatch(setCourses(data.courses));
      } catch {
        toast.error("Không thể tải danh sách khóa học");
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetch();
  }, [dispatch]);

  const published = courses.filter((c) => c.status === "Published").length;
  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.students?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          className="mb-6 flex cursor-pointer items-center gap-1.5 text-gray-500 text-sm transition hover:text-gray-700"
          onClick={() => navigate("/")}
          type="button"
        >
          <ArrowLeft size={16} />
          Trang chủ
        </button>

        <div className="mb-8">
          <h1 className="font-bold text-2xl text-gray-900">
            Xin chào, {userData?.name || "Giảng viên"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Quản lý tất cả khóa học của bạn
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
              Tổng khóa học
            </p>
            <p className="mt-2 font-bold text-3xl text-gray-900">
              {courses.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
              Đã xuất bản
            </p>
            <p className="mt-2 font-bold text-3xl text-green-600">
              {published}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
              Học viên
            </p>
            <p className="mt-2 font-bold text-3xl text-blue-600">
              {totalStudents}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
              Bản nháp
            </p>
            <p className="mt-2 font-bold text-3xl text-amber-600">
              {courses.length - published}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Khóa học của tôi</h2>
          <Link
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-sm text-white transition hover:bg-blue-700"
            to="/dashboard/create-course"
          >
            <Plus size={16} />
            Tạo khóa học
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <ClipLoader color="#2563eb" size={32} />
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-gray-200 border-dashed bg-white py-20 text-center">
            <BookOpen className="mx-auto text-gray-300" size={40} />
            <p className="mt-4 font-medium text-gray-500 text-lg">
              Chưa có khóa học nào
            </p>
            <p className="mt-1 text-gray-400 text-sm">
              Tạo khóa học đầu tiên của bạn
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-gray-100 border-b bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Tiêu đề
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Danh mục
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Giá
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      className="border-gray-50 border-b transition hover:bg-gray-50"
                      key={course._id}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {course.thumbnail ? (
                            <img
                              alt=""
                              className="h-10 w-14 rounded object-cover"
                              src={course.thumbnail}
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 text-gray-400 text-xs">
                              Ảnh
                            </div>
                          )}
                          <div>
                            <p className="max-w-xs truncate font-medium text-gray-900">
                              {course.title}
                            </p>
                            {course.subtitle && (
                              <p className="max-w-xs truncate text-gray-500 text-xs">
                                {course.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {course.category}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {course.price > 0
                          ? `${course.price.toLocaleString()}₫`
                          : "Miễn phí"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 font-medium text-xs ${
                            course.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {course.status === "Published"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white text-xs transition hover:bg-blue-700"
                          onClick={() =>
                            navigate(`/dashboard/edit-course/${course._id}`)
                          }
                          type="button"
                        >
                          <Edit3 size={14} />
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {courses.map((course) => (
                <div
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  key={course._id}
                >
                  <div className="flex items-start gap-3">
                    {course.thumbnail ? (
                      <img
                        alt=""
                        className="h-14 w-20 rounded object-cover"
                        src={course.thumbnail}
                      />
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded bg-gray-100 text-gray-400 text-xs">
                        Ảnh
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {course.title}
                      </p>
                      <p className="text-gray-500 text-xs">{course.category}</p>
                      <p className="font-medium text-gray-900 text-xs">
                        {course.price > 0
                          ? `${course.price.toLocaleString()}₫`
                          : "Miễn phí"}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 font-medium text-xs ${
                          course.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {course.status === "Published"
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 font-medium text-sm text-white transition hover:bg-blue-700"
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    type="button"
                  >
                    <Edit3 size={16} />
                    Chỉnh sửa
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
