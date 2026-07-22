import { ClipLoader } from "react-spinners";

const AuthButton = ({ children, loading, icon: Icon }) => {
  return (
    <button
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={loading}
      type="submit"
    >
      {loading ? (
        <ClipLoader color="#fff" size={18} />
      ) : (
        Icon && <Icon size={18} />
      )}
      {loading ? "Đang xử lý..." : children}
    </button>
  );
};

export default AuthButton;
