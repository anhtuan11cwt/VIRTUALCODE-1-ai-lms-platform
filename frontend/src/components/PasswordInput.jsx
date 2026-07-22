import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({
  id,
  label,
  loading,
  show,
  onToggleShow,
  value,
  onChange,
  error,
  placeholder,
}) => {
  const [internalShow, setInternalShow] = useState(false);
  const isControlled = show !== undefined && onToggleShow !== undefined;
  const visible = isControlled ? show : internalShow;
  const toggle = isControlled ? onToggleShow : () => setInternalShow((s) => !s);

  return (
    <div className="space-y-1.5">
      <label className="block font-medium text-gray-700 text-sm" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={
            id.includes("confirm") ? "new-password" : "current-password"
          }
          className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-400" : "border-gray-300"
          } ${loading ? "opacity-50" : ""}`}
          disabled={loading}
          id={id}
          onChange={onChange}
          placeholder={placeholder || label}
          type={visible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className={`absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition ${
            loading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:text-gray-600"
          }`}
          disabled={loading}
          onClick={toggle}
          tabIndex={-1}
          type="button"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PasswordInput;
