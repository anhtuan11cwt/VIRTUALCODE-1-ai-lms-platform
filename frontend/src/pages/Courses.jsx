import { Filter, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import { categories } from "../constants/category";
import usePublishedCourses from "../hooks/usePublishedCourses";

const Courses = () => {
  const { courses, loading, error } = usePublishedCourses();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    if (selectedCategories.length === 0) return courses;
    return courses.filter((c) => selectedCategories.includes(c.category));
  }, [courses, selectedCategories]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl text-gray-900">
              Tất cả khóa học
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {loading
                ? "Đang tải..."
                : `${filtered.length} khóa học${
                    selectedCategories.length > 0 ? " đã lọc" : " có sẵn"
                  }`}
            </p>
          </div>

          <button
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition hover:bg-gray-50 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <Filter size={16} />
            Lọc
          </button>
        </div>

        <div className="flex gap-8">
          <aside
            className={`fixed inset-y-0 right-0 z-40 w-72 bg-white shadow-xl transition-transform duration-300 lg:static lg:w-64 lg:shadow-none lg:transition-none ${
              sidebarOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="flex items-center justify-between border-gray-100 border-b p-4 lg:hidden">
              <span className="font-semibold text-gray-900">Danh mục</span>
              <button
                aria-label="Đóng bộ lọc"
                className="cursor-pointer p-1 hover:text-gray-700"
                onClick={() => setSidebarOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 lg:p-0">
              <h3 className="mb-4 hidden font-semibold text-gray-900 lg:block">
                Danh mục
              </h3>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100"
                    key={cat}
                  >
                    <input
                      checked={selectedCategories.includes(cat)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 focus:ring-blue-500"
                      onChange={() => toggleCategory(cat)}
                      type="checkbox"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm transition hover:bg-gray-50"
                  onClick={() => setSelectedCategories([])}
                  type="button"
                >
                  <RotateCcw size={16} />
                  Bỏ lọc
                </button>
              )}
            </div>
          </aside>

          {sidebarOpen && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                    key={i}
                  >
                    <div className="aspect-video animate-pulse bg-gray-200" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                      <div className="flex justify-between">
                        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
                        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-medium text-gray-500 text-lg">
                  Không có khóa học nào phù hợp
                </p>
                <p className="mt-1 text-gray-400 text-sm">
                  Thử chọn danh mục khác hoặc{" "}
                  <button
                    className="inline cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setSelectedCategories([])}
                    type="button"
                  >
                    bỏ lọc
                  </button>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((course) => (
                  <Card course={course} key={course._id} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;
