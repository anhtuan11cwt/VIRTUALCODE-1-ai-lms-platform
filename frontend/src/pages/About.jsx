import { BookOpen, Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    desc: "Giao diện trực quan, dễ sử dụng cho mọi đối tượng",
    title: "Học tập đơn giản",
  },
  {
    desc: "Đội ngũ giảng viên giàu kinh nghiệm trong nhiều lĩnh vực",
    title: "Giảng viên chuyên nghiệp",
  },
  {
    desc: "Hàng ngàn học viên đã tin tưởng và theo học",
    title: "Kinh nghiệm lớn",
  },
  {
    desc: "Học mọi lúc, mọi nơi, không giới hạn thời gian",
    title: "Truy cập trọn đời",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-bold text-4xl leading-tight sm:text-5xl">
            Về Virtual Courses
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-blue-200 text-lg">
            Nền tảng học tập trực tuyến thông minh, kết nối học viên với các
            giảng viên hàng đầu, mang đến trải nghiệm học tập hiện đại và hiệu
            quả.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Tối đa hóa sự phát triển học tập của bạn
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Virtual Courses là hệ thống quản lý học tập hiện đại, giúp tối ưu
              hóa sự hợp tác giữa học viên và giảng viên thông qua nền tảng trực
              tuyến thông minh.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                key={f.title}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-bold text-3xl text-gray-900">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Tham gia cùng hàng ngàn học viên đang học tập trên Virtual Courses.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              to="/courses"
            >
              Khám phá khóa học
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
