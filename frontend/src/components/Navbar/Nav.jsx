import { LayoutDashboard, LogIn, Menu, UserPlus } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";

const Nav = ({ isChecking }) => {
  const { userData } = useSelector((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition cursor-pointer after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-blue-600 after:transition-transform after:duration-300 ${
      isActive
        ? "text-blue-600 after:scale-x-100"
        : "text-gray-700 hover:text-blue-600 after:scale-x-0 hover:after:scale-x-100"
    } after:w-full`;

  return (
    <>
      <header className="sticky top-0 z-30 border-gray-100 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              className="cursor-pointer font-bold text-gray-900 text-xl"
              to="/"
            >
              Virtual Courses
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <NavLink className={linkClass} end to="/">
                Trang chủ
              </NavLink>
              <NavLink className={linkClass} to="/courses">
                Khóa học
              </NavLink>
              {userData?.role === "educator" && (
                <NavLink className={linkClass} to="/dashboard">
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={16} />
                    Bảng điều khiển
                  </span>
                </NavLink>
              )}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {isChecking ? (
                <span className="inline-block h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
              ) : userData ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm transition hover:bg-gray-50"
                    to="/login"
                  >
                    <LogIn size={16} />
                    Đăng nhập
                  </Link>
                  <Link
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-blue-700"
                    to="/register"
                  >
                    <UserPlus size={16} />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button
              aria-label="Mở menu"
              className="cursor-pointer rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Nav;
