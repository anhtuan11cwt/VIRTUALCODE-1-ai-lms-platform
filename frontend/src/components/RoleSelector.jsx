import { GraduationCap, Presentation } from "lucide-react";

const roles = [
  { icon: GraduationCap, key: "student", label: "Học viên" },
  { icon: Presentation, key: "educator", label: "Giảng viên" },
];

const RoleSelector = ({ loading, value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <span className="block font-medium text-gray-700 text-sm">
        Tôi muốn tham gia với tư cách
      </span>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = value === role.key;
          return (
            <button
              className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium text-sm transition-all ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : isActive
                    ? "cursor-pointer border-blue-600 bg-blue-50 text-blue-700"
                    : "cursor-pointer border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
              disabled={loading}
              key={role.key}
              onClick={() => onChange(role.key)}
              type="button"
            >
              <Icon size={18} />
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
