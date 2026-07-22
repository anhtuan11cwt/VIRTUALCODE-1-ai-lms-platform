import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/userSlice";
import api from "../../services/api";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(clearUser());
      toast.success("Đã đăng xuất");
      navigate("/");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
    setOpen(false);
  };

  if (!userData) return null;

  const avatar = userData.photoUrl || null;
  const initial = (userData.name || userData.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        aria-expanded={open}
        aria-label="Menu người dùng"
        className="flex cursor-pointer items-center gap-2 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {avatar ? (
          <img
            alt={userData.name}
            className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover"
            src={avatar}
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-sm text-white">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          <div className="border-gray-100 border-b px-4 py-2">
            <p className="truncate font-medium text-gray-900 text-sm">
              {userData.name || "Người dùng"}
            </p>
            <p className="truncate text-gray-500 text-xs">{userData.email}</p>
          </div>

          <Link
            className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-gray-700 text-sm transition hover:bg-gray-50"
            onClick={() => setOpen(false)}
            to="/profile"
          >
            <User size={16} />
            Trang cá nhân
          </Link>

          {userData.role === "educator" && (
            <Link
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-gray-700 text-sm transition hover:bg-gray-50"
              onClick={() => setOpen(false)}
              to="/dashboard"
            >
              <LayoutDashboard size={16} />
              Bảng điều khiển
            </Link>
          )}

          <button
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-red-600 text-sm transition hover:bg-red-50"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
