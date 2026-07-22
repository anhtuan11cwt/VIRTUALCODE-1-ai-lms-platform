import { LayoutDashboard, LogIn, LogOut, UserPlus, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/userSlice";
import api from "../../services/api";

const MobileMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(clearUser());
      toast.success("Đã đăng xuất");
      navigate("/");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
    onClose();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition cursor-pointer ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-gray-100 border-b p-4">
          <Link
            className="font-bold text-gray-900 text-lg"
            onClick={onClose}
            to="/"
          >
            Virtual Courses
          </Link>
          <button
            aria-label="Đóng menu"
            className="cursor-pointer rounded-lg p-2 transition hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          <NavLink className={linkClass} end onClick={onClose} to="/">
            Trang chủ
          </NavLink>
          <NavLink className={linkClass} onClick={onClose} to="/courses">
            Khóa học
          </NavLink>

          {userData?.role === "educator" && (
            <NavLink className={linkClass} onClick={onClose} to="/dashboard">
              <LayoutDashboard size={18} />
              Bảng điều khiển
            </NavLink>
          )}
        </nav>

        <div className="absolute right-0 bottom-0 left-0 border-gray-100 border-t p-4">
          {userData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-sm text-white">
                  {(userData.name || userData.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 text-sm">
                    {userData.name || "Người dùng"}
                  </p>
                  <p className="truncate text-gray-500 text-xs">
                    {userData.email}
                  </p>
                </div>
              </div>
              <button
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-medium text-red-600 text-sm transition hover:bg-red-50"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 text-sm transition hover:bg-gray-50"
                onClick={onClose}
                to="/login"
              >
                <LogIn size={18} />
                Đăng nhập
              </Link>
              <Link
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-sm text-white transition hover:bg-blue-700"
                onClick={onClose}
                to="/register"
              >
                <UserPlus size={18} />
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
