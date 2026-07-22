import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link className="flex items-center gap-2" to="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Virtual Courses
              </span>
            </Link>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Nền tảng học tập trực tuyến thông minh, kết nối học viên với các
              giảng viên hàng đầu.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-sm text-white uppercase tracking-wider">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="transition hover:text-blue-400" to="/">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-blue-400" to="/courses">
                  Khóa học
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-blue-400" to="/about">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-blue-400" to="/login">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-sm text-white uppercase tracking-wider">
              Danh mục
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Phát triển Web</li>
              <li className="text-gray-400">Phát triển Di động</li>
              <li className="text-gray-400">AI & Học máy</li>
              <li className="text-gray-400">Khoa học Dữ liệu</li>
              <li className="text-gray-400">DevOps</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-sm text-white uppercase tracking-wider">
              Hỗ trợ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="transition hover:text-blue-400"
                  href="mailto:support@virtualcourses.com"
                >
                  support@virtualcourses.com
                </a>
              </li>
              <li className="text-gray-400">Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-gray-800 border-t pt-6 text-center text-gray-500 text-sm">
          &copy; {currentYear} Virtual Courses. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
