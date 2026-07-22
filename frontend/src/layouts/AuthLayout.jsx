import { BookOpen } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden bg-slate-50">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 p-12 text-white lg:flex lg:w-[45%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-sm text-center">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 font-bold text-4xl leading-tight">
            {title || "Khóa học ảo"}
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            {subtitle ||
              "Học tập, Sáng tạo và Phát triển với nền giáo dục trực tuyến thông minh."}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
