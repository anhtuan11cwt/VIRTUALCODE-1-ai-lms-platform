import { Calendar, Edit3, Mail, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const roleMap = {
  educator: "Giảng viên",
  student: "Học viên",
};

const Profile = () => {
  const { userData } = useSelector((state) => state.user);

  if (!userData) return null;

  const initial = (userData.name || userData.email || "U")
    .charAt(0)
    .toUpperCase();

  const joinedDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-slate-50">
      <div className="max-h-[calc(100dvh-8rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          {userData.photoUrl ? (
            <img
              alt={userData.name}
              className="mx-auto h-28 w-28 rounded-full border-4 border-blue-100 object-cover"
              src={userData.photoUrl}
            />
          ) : (
            <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-600 font-bold text-3xl text-white">
              {initial}
            </span>
          )}

          <h1 className="mt-5 font-bold text-2xl text-gray-900">
            {userData.name}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {roleMap[userData.role] || userData.role}
          </p>
        </div>

        <div className="mt-8 space-y-4 border-gray-100 border-t pt-8">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" size={18} />
            <div>
              <p className="text-gray-500 text-xs">Email</p>
              <p className="font-medium text-gray-900 text-sm">
                {userData.email}
              </p>
            </div>
          </div>

          {userData.bio && (
            <div className="flex items-start gap-3">
              <User className="mt-0.5 text-gray-400" size={18} />
              <div>
                <p className="text-gray-500 text-xs">Giới thiệu</p>
                <p className="text-gray-700 text-sm">{userData.bio}</p>
              </div>
            </div>
          )}

          {joinedDate && (
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <p className="text-gray-500 text-xs">Tham gia</p>
                <p className="font-medium text-gray-900 text-sm">
                  {joinedDate}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700"
            to="/edit-profile"
          >
            <Edit3 size={16} />
            Chỉnh sửa hồ sơ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
