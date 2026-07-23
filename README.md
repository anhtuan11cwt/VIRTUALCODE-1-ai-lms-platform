# Virtual Courses — AI Learning Management System

**Virtual Courses** là nền tảng quản lý học tập trực tuyến (LMS) thông minh, được xây dựng với kiến trúc **MERN Stack** hiện đại, tích hợp **AI** để tư vấn khóa học và **Stripe** để xử lý thanh toán. Hệ thống hỗ trợ hai vai trò: **Học viên** (Student) và **Giảng viên** (Educator), cung cấp trải nghiệm học tập và giảng dạy toàn diện.

---

## Mục lục

- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Cách sử dụng](#cách-sử-dụng)
- [API Endpoints](#api-endpoints)
- [Kiểm thử](#kiểm-thử)
- [Đóng góp](#đóng-góp)
- [Tác giả](#tác-giả)
- [Giấy phép](#giấy-phép)

---

## Tính năng chính

### Đối với Học viên

- **Xem danh sách khóa học** — Duyệt và lọc khóa học theo danh mục (8 danh mục)
- **Tìm kiếm thông minh bằng AI** — Mô tả nhu cầu học tập bằng ngôn ngữ tự nhiên, AI (Google Gemini) sẽ gợi ý khóa học phù hợp kèm lý do
- **Tìm kiếm bằng giọng nói** — Nhập liệu bằng giọng nói (Web Speech API, hỗ trợ tiếng Việt)
- **Đăng ký khóa học** — Khóa học miễn phí (ghi danh ngay) hoặc thanh toán qua Stripe (VNĐ)
- **Học trực tuyến** — Xem bài giảng dạng video, bao gồm bài học xem thử miễn phí
- **Đánh giá khóa học** — Gửi đánh giá sao (1–5) và nhận xét sau khi ghi danh

### Đối với Giảng viên

- **Dashboard quản lý** — Xem thống kê: tổng khóa học, đã xuất bản, bản nháp, số học viên
- **Biểu đồ trực quan** — Biểu đồ cột hiển thị tiến độ bài học và học viên ghi danh (Recharts)
- **Quản lý khóa học** — Tạo, sửa, xóa khóa học; xuất bản/gỡ xuất bản
- **Quản lý bài học** — Thêm, sửa, xóa bài học; upload video (Cloudinary); đánh dấu xem thử miễn phí
- **Upload ảnh/video** — Hỗ trợ upload lên Cloudinary với phân loại folder

### Tính năng chung

- **Xác thực JWT** — Đăng nhập/đăng ký với cookie httpOnly
- **Quên mật khẩu** — Gửi OTP qua email, xác minh OTP, đặt lại mật khẩu
- **Hồ sơ người dùng** — Cập nhật tên, bio, ảnh đại diện
- **Phân quyền** — Middleware kiểm tra đăng nhập (`isAuth`) và vai trò giảng viên (`isEducator`)
- **Responsive Design** — Giao diện tương thích mọi thiết bị (Tailwind CSS)
- **Swagger API Docs** — Tài liệu API tự động tại `/api-docs`
- **UI/UX hiện đại** — Giao diện với blur backdrop, hiệu ứng mượt mà, loading skeleton

---

## Công nghệ sử dụng

### Frontend

| Công nghệ                                       | Phiên bản | Mục đích                  |
| ----------------------------------------------- | --------- | ------------------------- |
| [React](https://react.dev/)                     | 19.2      | Thư viện UI               |
| [Vite](https://vitejs.dev/)                     | 8.1       | Build tool                |
| [Tailwind CSS](https://tailwindcss.com/)        | 4.3       | CSS utility framework     |
| [Redux Toolkit](https://redux-toolkit.js.org/)  | 2.12      | Quản lý state             |
| [React Router](https://reactrouter.com/)        | 7.18      | Định tuyến                |
| [Axios](https://axios-http.com/)                | 1.18      | HTTP client               |
| [Recharts](https://recharts.org/)               | 3.10      | Biểu đồ dữ liệu           |
| [Lucide React](https://lucide.dev/)             | 1.25      | Icon library              |
| [React Hot Toast](https://react-hot-toast.com/) | 2.6       | Thông báo                 |
| [Zod](https://zod.dev/)                         | 4.4       | Validate form phía client |
| [Biome](https://biomejs.dev/)                   | 2.4       | Lint & Format             |

### Backend

| Công nghệ                                        | Phiên bản | Mục đích                   |
| ------------------------------------------------ | --------- | -------------------------- |
| [Express](https://expressjs.com/)                | 5.2       | Web framework              |
| [MongoDB + Mongoose](https://mongoosejs.com/)    | 9.8       | Cơ sở dữ liệu              |
| [JWT (jsonwebtoken)](https://jwt.io/)            | 9.0       | Xác thực                   |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3.0       | Mã hóa mật khẩu            |
| [Stripe](https://stripe.com/)                    | 22.3      | Cổng thanh toán            |
| [Cloudinary](https://cloudinary.com/)            | 2.10      | Lưu trữ ảnh/video          |
| [Google Gemini AI](https://ai.google.dev/)       | 2.13      | Tư vấn khóa học thông minh |
| [Nodemailer](https://nodemailer.com/)            | 9.0       | Gửi email OTP              |
| [Swagger](https://swagger.io/)                   | 6.3       | Tài liệu API               |
| [Multer](https://github.com/expressjs/multer)    | 2.2       | Upload file                |
| [Zod](https://zod.dev/)                          | 4.4       | Validate dữ liệu           |
| [Biome](https://biomejs.dev/)                    | 2.4       | Lint & Format              |

---

## Cấu trúc dự án

```
1-ai-lms-platform/
├── backend/                       # Server-side (Express + MongoDB)
│   ├── src/
│   │   ├── config/                # Cấu hình
│   │   │   ├── cloudinary.js      # Cấu hình Cloudinary upload
│   │   │   ├── connectDB.js       # Kết nối MongoDB
│   │   │   └── swagger.js         # Cấu hình Swagger API docs
│   │   ├── controllers/           # Xử lý logic
│   │   │   ├── aiController.js    # Tìm kiếm AI (Gemini)
│   │   │   ├── authController.js  # Đăng ký, đăng nhập, OTP
│   │   │   ├── courseController.js# CRUD khóa học, bài học
│   │   │   ├── orderController.js # Thanh toán Stripe, ghi danh
│   │   │   ├── reviewController.js# Đánh giá khóa học
│   │   │   └── userController.js  # Cập nhật hồ sơ
│   │   ├── middleware/
│   │   │   ├── isAuth.js          # Xác thực JWT
│   │   │   ├── isEducator.js      # Kiểm tra vai trò giảng viên
│   │   │   └── multer.js          # Upload file (ảnh, video)
│   │   ├── models/
│   │   │   ├── User.js            # Người dùng (student/educator)
│   │   │   ├── Course.js          # Khóa học
│   │   │   ├── Lecture.js         # Bài học
│   │   │   └── Review.js          # Đánh giá
│   │   ├── routes/
│   │   │   ├── aiRoutes.js        # AI search
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   ├── courseRoutes.js    # Course & Lecture CRUD
│   │   │   ├── paymentRoute.js    # Stripe & enroll
│   │   │   ├── reviewRoutes.js    # Review CRUD
│   │   │   └── userRoutes.js      # User profile
│   │   ├── utils/
│   │   │   ├── genToken.js        # Tạo JWT + cookie
│   │   │   ├── sendMail.js        # Gửi email OTP
│   │   │   └── zodSchemas.js      # Schema validation (Zod)
│   │   └── index.js               # Entry point
│   ├── .env.example               # Biến môi trường mẫu
│   ├── biome.json                 # Cấu hình Biome
│   └── package.json
│
├── frontend/                      # Client-side (React + Vite)
│   ├── public/
│   │   └── ...
│   ├── src/
│   │   ├── components/            # Component dùng chung
│   │   │   ├── Navbar/            # Navigation
│   │   │   │   ├── Nav.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   └── ProfileDropdown.jsx
│   │   │   ├── ForgotPassword/    # Flow quên mật khẩu
│   │   │   │   ├── EmailStep.jsx
│   │   │   │   ├── OTPStep.jsx
│   │   │   │   └── ResetPasswordStep.jsx
│   │   │   ├── AuthButton.jsx
│   │   │   ├── Card.jsx           # Card khóa học
│   │   │   ├── CardPage.jsx       # Grid card + loading/error
│   │   │   ├── Footer.jsx
│   │   │   ├── GuestRoute.jsx     # Route dành cho guest
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── ProtectedRoute.jsx # Route cần đăng nhập
│   │   │   ├── RoleSelector.jsx   # Chọn vai trò
│   │   │   └── ScrollToTop.jsx
│   │   ├── constants/
│   │   │   └── category.js        # Danh sách danh mục
│   │   ├── hooks/
│   │   │   ├── useCurrentUser.js  # Lấy thông tin user hiện tại
│   │   │   └── usePublishedCourses.js # Lấy khóa học đã xuất bản
│   │   ├── layouts/
│   │   │   └── AuthLayout.jsx     # Layout đăng nhập/đăng ký
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Trang chủ
│   │   │   ├── Courses.jsx        # Danh sách khóa học
│   │   │   ├── CourseDetail.jsx   # Chi tiết khóa học + video
│   │   │   ├── SearchWithAi.jsx   # Tìm kiếm AI + giọng nói
│   │   │   ├── Login.jsx          # Đăng nhập
│   │   │   ├── Register.jsx       # Đăng ký
│   │   │   ├── ForgotPassword.jsx # Quên mật khẩu
│   │   │   ├── Dashboard.jsx      # Dashboard giảng viên
│   │   │   ├── CreateCourse.jsx   # Tạo khóa học mới
│   │   │   ├── EditCourse.jsx     # Chỉnh sửa khóa học
│   │   │   ├── CreateLecture.jsx  # Tạo bài học mới
│   │   │   ├── EditLecture.jsx    # Chỉnh sửa bài học
│   │   │   ├── ViewLectures.jsx   # Xem danh sách bài học
│   │   │   ├── MyEnrolledCourses.jsx # Khóa học đã ghi danh
│   │   │   ├── Profile.jsx        # Hồ sơ người dùng
│   │   │   ├── EditProfile.jsx    # Chỉnh sửa hồ sơ
│   │   │   ├── About.jsx          # Giới thiệu
│   │   │   └── NotFound.jsx       # 404
│   │   ├── redux/
│   │   │   ├── store.js           # Redux store
│   │   │   ├── courseSlice.js     # State khóa học
│   │   │   ├── userSlice.js       # State người dùng
│   │   │   └── lectureSlice.js    # State bài học
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance
│   │   │   └── authService.js     # Service xác thực
│   │   ├── validations/
│   │   │   └── authSchema.js      # Zod schema (login, signup, course)
│   │   ├── App.css
│   │   ├── App.jsx                # Router chính
│   │   ├── index.css              # Global styles + Tailwind
│   │   └── main.jsx               # Entry point React
│   ├── .env.example
│   ├── biome.json
│   ├── eslint.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── .vscode/                       # Cấu hình VS Code chung
└── README.md
```

---

## Hướng dẫn cài đặt

### Yêu cầu hệ thống (Prerequisites)

- **[Node.js](https://nodejs.org/)** v18 trở lên (khuyến nghị v20 LTS)
- **[MongoDB](https://www.mongodb.com/)** — Chạy local hoặc [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Tài khoản dịch vụ**:
  - [Cloudinary](https://cloudinary.com/) — Lưu trữ ảnh/video
  - [Stripe](https://stripe.com/) — Cổng thanh toán
  - [Google AI Studio](https://aistudio.google.com/) — API Key Gemini
  - [Gmail App Password](https://support.google.com/accounts/answer/185833) — Gửi email OTP

### Các bước cài đặt

1. **Clone dự án**

   ```bash
   git clone <your-repo-url>
   cd 1-ai-lms-platform
   ```

2. **Cài đặt dependencies cho Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Cấu hình biến môi trường cho Backend**

   ```bash
   cp .env.example .env
   ```

   Sau đó điền các giá trị vào file `.env` (xem [Cấu hình môi trường](#cấu-hình-môi-trường)).

4. **Cài đặt dependencies cho Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Cấu hình biến môi trường cho Frontend**

   ```bash
   cp .env.example .env
   ```

   Mở file `.env` và điền:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

6. **Chạy dự án**

   Mở hai terminal:

   **Terminal 1 — Backend** (cổng 8000):

   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 — Frontend** (cổng 5173):

   ```bash
   cd frontend
   npm run dev
   ```

7. **Truy cập ứng dụng**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs (Swagger): [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## Cấu hình môi trường

### Backend (`backend/.env`)

```env
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/lms
JWT_SECRET=<your-jwt-secret-key>
EMAIL_USER=<your-gmail-address>
EMAIL_PASS=<your-gmail-app-password>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

> **Lưu ý**: Các file `.env` đã được thêm vào `.gitignore` — không commit chúng lên repository.

---

## Cách sử dụng

### Người dùng thông thường

1. **Truy cập trang chủ** tại `http://localhost:5173`
2. **Đăng ký tài khoản** — Chọn vai trò `Student` hoặc `Educator`
3. **Khám phá khóa học** — Duyệt qua `Khóa học` hoặc dùng `Tìm kiếm AI` để nhận gợi ý thông minh
4. **Đăng ký học** — Chọn khóa học, thanh toán qua Stripe (hoặc ghi danh miễn phí)
5. **Học tập** — Vào `Khóa học của tôi` để xem các khóa học đã ghi danh

### Giảng viên

1. **Đăng ký với vai trò Educator**
2. **Vào Dashboard** — Xem thống kê, tạo khóa học mới
3. **Tạo khóa học** — Nhập tiêu đề và danh mục → thêm mô tả, ảnh, giá → xuất bản
4. **Quản lý bài học** — Thêm bài học, upload video, đánh dấu xem thử miễn phí
5. **Theo dõi** — Xem số học viên và biểu đồ trong Dashboard

### Quên mật khẩu

1. Nhấn "Quên mật khẩu?" trên trang đăng nhập
2. Nhập email → nhận mã OTP (6 chữ số) qua email
3. Nhập OTP → đặt lại mật khẩu mới

---

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint          | Mô tả                       | Xác thực |
| ------ | ----------------- | --------------------------- | -------- |
| POST   | `/signup`         | Đăng ký tài khoản           | —        |
| POST   | `/login`          | Đăng nhập                   | —        |
| POST   | `/logout`         | Đăng xuất                   | —        |
| GET    | `/current-user`   | Lấy thông tin user hiện tại | JWT      |
| POST   | `/send-otp`       | Gửi mã OTP đặt lại mật khẩu | —        |
| POST   | `/verify-otp`     | Xác minh OTP                | —        |
| POST   | `/reset-password` | Đặt lại mật khẩu            | —        |

### Course (`/api/v1/course`)

| Method | Endpoint                     | Mô tả                          | Xác thực       |
| ------ | ---------------------------- | ------------------------------ | -------------- |
| GET    | `/published`                 | Danh sách khóa học đã xuất bản | —              |
| GET    | `/:courseId`                 | Chi tiết khóa học              | —              |
| POST   | `/create`                    | Tạo khóa học mới               | JWT            |
| GET    | `/creator`                   | Khóa học của giảng viên        | JWT            |
| PUT    | `/:courseId`                 | Cập nhật khóa học              | JWT + Educator |
| DELETE | `/:courseId`                 | Xóa khóa học                   | JWT + Educator |
| POST   | `/create-lecture/:courseId`  | Tạo bài học mới                | JWT + Educator |
| GET    | `/course-lecture/:courseId`  | Danh sách bài học của khóa học | JWT            |
| POST   | `/edit-lecture/:lectureId`   | Cập nhật bài học               | JWT + Educator |
| DELETE | `/remove-lecture/:lectureId` | Xóa bài học                    | JWT + Educator |

### Order / Payment (`/api/v1/order`)

| Method | Endpoint                   | Mô tả                          | Xác thực |
| ------ | -------------------------- | ------------------------------ | -------- |
| POST   | `/create-checkout-session` | Tạo Stripe Checkout Session    | JWT      |
| POST   | `/verify-payment`          | Xác thực thanh toán & ghi danh | JWT      |
| POST   | `/free-enroll`             | Ghi danh khóa học miễn phí     | JWT      |

### Review (`/api/v1/review`)

| Method | Endpoint            | Mô tả                           | Xác thực |
| ------ | ------------------- | ------------------------------- | -------- |
| POST   | `/create`           | Tạo đánh giá khóa học           | JWT      |
| GET    | `/course/:courseId` | Danh sách đánh giá của khóa học | —        |

### AI (`/api/v1/ai`)

| Method | Endpoint  | Mô tả                                    | Xác thực |
| ------ | --------- | ---------------------------------------- | -------- |
| POST   | `/search` | Tìm kiếm khóa học thông minh bằng Gemini | —        |

### User (`/api/v1/user`)

| Method | Endpoint            | Mô tả                          | Xác thực |
| ------ | ------------------- | ------------------------------ | -------- |
| PUT    | `/update-profile`   | Cập nhật hồ sơ (tên, bio, ảnh) | JWT      |
| GET    | `/enrolled-courses` | Danh sách khóa học đã ghi danh | JWT      |

> Tài liệu API đầy đủ (bao gồm request/response mẫu) có sẵn tại `/api-docs` khi chạy backend.

---

## Kiểm thử

Dự án hiện sử dụng **Biome** cho lint & format và **ESLint** cho kiểm tra mã nguồn.

### Backend

```bash
cd backend

# Kiểm tra lint
npm run lint

# Tự động fix lint
npm run lint:fix

# Kiểm tra & format với Biome
npm run biome:ci
npm run biome:check
npm run biome:format
```

### Frontend

```bash
cd frontend

# Kiểm tra lint
npm run lint

# Tự động fix lint
npm run lint:fix

# Kiểm tra & format với Biome
npm run biome:ci
npm run biome:check
npm run biome:format

# Build production
npm run build
```

---

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng làm theo các bước sau:

1. Fork dự án
2. Tạo nhánh tính năng: `git checkout -b feature/amazing-feature`
3. Commit thay đổi: `git commit -m 'Add some amazing feature'`
4. Push lên nhánh: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Coding Standards

- Sử dụng **Biome** để format code trước khi commit (`npm run biome:check:unsafe`)
- Tuân thủ ESLint rules
- Đặt tên biến rõ ràng, có ý nghĩa
- Comment code bằng tiếng Việt (dự án hướng đến người Việt)

---

## Tác giả

- **Trần Anh Tuấn** — [GitHub](https://github.com/trananhtuan) — Tác giả & Developer

Dự án được phát triển như một nền tảng học tập trực tuyến mã nguồn mở với mục tiêu mang giáo dục chất lượng cao đến gần hơn với người học Việt Nam.

---

## Giấy phép

Dự án này được phân phối dưới giấy phép **ISC**. Xem file `LICENSE` để biết thêm chi tiết.
