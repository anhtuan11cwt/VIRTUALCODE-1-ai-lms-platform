import { Router } from "express";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getPublishedCourses,
  removeCourse,
  removeLecture,
} from "../controllers/courseController.js";
import isAuth from "../middleware/isAuth.js";
import isEducator from "../middleware/isEducator.js";
import upload, { uploadVideo } from "../middleware/multer.js";

const router = Router();

/**
 * @openapi
 * /api/v1/course/create:
 *   post:
 *     tags:
 *       - Course
 *     summary: Tạo khóa học mới (Draft)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete MERN Stack Bootcamp"
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *           example:
 *             title: "Complete MERN Stack Bootcamp"
 *             category: "Web Development"
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Tạo khóa học thành công"
 *               course:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 title: "Complete MERN Stack Bootcamp"
 *                 category: "Web Development"
 *                 status: "Draft"
 *       400:
 *         description: Thiếu tiêu đề hoặc danh mục
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", isAuth, createCourse);

/**
 * @openapi
 * /api/v1/course/published:
 *   get:
 *     tags:
 *       - Course
 *     summary: Lấy danh sách khóa học đã xuất bản
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               courses:
 *                 - id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                   title: "Complete MERN Stack Bootcamp"
 *                   subtitle: "Build Full Stack Apps with React and NodeJS"
 *                   thumbnail: "https://res.cloudinary.com/..."
 *                   price: 499000
 *                   rating: 4.8
 *                   reviews: 152
 *                   level: "Beginner"
 *                   category: "Web Development"
 *                   creator:
 *                     name: "Nguyễn Văn An"
 *                     photoUrl: "https://..."
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/published", getPublishedCourses);

/**
 * @openapi
 * /api/v1/course/creator:
 *   get:
 *     tags:
 *       - Course
 *     summary: Lấy danh sách khóa học của giảng viên hiện tại
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khóa học của giảng viên
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               courses:
 *                 - id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                   title: "Complete MERN Stack Bootcamp"
 *                   status: "Draft"
 *                   category: "Web Development"
 *                   price: 499000
 *                   createdAt: "2026-07-22T10:30:00.000Z"
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/creator", isAuth, getCreatorCourses);

/**
 * @openapi
 * /api/v1/course/{courseId}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Lấy chi tiết khóa học theo ID
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: Chi tiết khóa học
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               course:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 title: "Complete MERN Stack Bootcamp"
 *                 subtitle: "Build Full Stack Apps with React and NodeJS"
 *                 description: "..."
 *                 category: "Web Development"
 *                 level: "Beginner"
 *                 price: 499000
 *                 thumbnail: "https://res.cloudinary.com/..."
 *                 rating: 4.8
 *                 reviews: 152
 *                 status: "Published"
 *                 creator:
 *                   name: "Nguyễn Văn An"
 *                   photoUrl: "https://..."
 *                 students: []
 *                 createdAt: "2026-07-22T..."
 *       404:
 *         description: Khóa học không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:courseId", getCourseById);

/**
 * @openapi
 * /api/v1/course/{courseId}:
 *   put:
 *     tags:
 *       - Course
 *     summary: Cập nhật khóa học
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete MERN Stack Bootcamp 2026"
 *               subtitle:
 *                 type: string
 *                 example: "Build Full Stack Apps with React, NodeJS và MongoDB"
 *               description:
 *                 type: string
 *                 example: "Khóa học toàn diện từ cơ bản đến nâng cao, giúp bạn xây dựng ứng dụng web hoàn chỉnh với MERN Stack."
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: "Intermediate"
 *               price:
 *                 type: number
 *                 example: 699000
 *               status:
 *                 type: string
 *                 enum: [Draft, Published]
 *                 example: "Published"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Ảnh đại diện khóa học (JPG, PNG, WebP, tối đa 5MB)"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cập nhật khóa học thành công"
 *               course:
 *                 _id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 title: "Complete MERN Stack Bootcamp 2026"
 *                 subtitle: "Build Full Stack Apps with React, NodeJS và MongoDB"
 *                 description: "Khóa học toàn diện từ cơ bản đến nâng cao..."
 *                 category: "Web Development"
 *                 level: "Intermediate"
 *                 price: 699000
 *                 thumbnail: "https://res.cloudinary.com/.../thumbnail_updated.jpg"
 *                 rating: 4.8
 *                 reviews: 152
 *                 status: "Published"
 *                 creator: "665a0a1b2c3d4e5f6a7b8c9df"
 *                 students: []
 *                 createdAt: "2026-06-15T08:00:00.000Z"
 *                 updatedAt: "2026-07-22T14:30:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu dữ liệu bắt buộc khi publish
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vui lòng điền đầy đủ: tiêu đề, phụ đề, mô tả, danh mục, cấp độ, giá (tối thiểu 15,000₫) và ảnh đại diện trước khi xuất bản"
 *       403:
 *         description: Không có quyền chỉnh sửa
 *       404:
 *         description: Khóa học không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/:courseId", isAuth, upload.single("thumbnail"), editCourse);

/**
 * @openapi
 * /api/v1/course/{courseId}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Xóa khóa học
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Xóa khóa học thành công"
 *       403:
 *         description: Không có quyền xóa
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Bạn không có quyền xóa khóa học này"
 *       404:
 *         description: Khóa học không tồn tại
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Khóa học không tồn tại"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Lỗi máy chủ"
 */
router.delete("/:courseId", isAuth, removeCourse);

/**
 * @openapi
 * /api/v1/course/create-lecture/{courseId}:
 *   post:
 *     tags:
 *       - Lecture
 *     summary: Tạo bài học mới cho khóa học
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lectureTitle
 *             properties:
 *               lectureTitle:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: "Giới thiệu về React Hooks"
 *           example:
 *             lectureTitle: "Giới thiệu về React Hooks"
 *     responses:
 *       201:
 *         description: Tạo bài học thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Tạo bài học thành công"
 *               lecture:
 *                 _id: "666b1b2c3d4e5f6a7b8c9d1a"
 *                 lectureTitle: "Giới thiệu về React Hooks"
 *                 videoUrl: ""
 *                 isPreviewFree: false
 *                 createdAt: "2026-07-22T10:30:00.000Z"
 *                 updatedAt: "2026-07-22T10:30:00.000Z"
 *               course:
 *                 _id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 title: "Complete MERN Stack Bootcamp"
 *                 lectures:
 *                   - _id: "666b1b2c3d4e5f6a7b8c9d1a"
 *                     lectureTitle: "Giới thiệu về React Hooks"
 *                     videoUrl: ""
 *                     isPreviewFree: false
 *                     createdAt: "2026-07-22T10:30:00.000Z"
 *                     updatedAt: "2026-07-22T10:30:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ (thiếu tiêu đề, quá 200 ký tự, …)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Dữ liệu không hợp lệ"
 *               errors:
 *                 - field: "lectureTitle"
 *                   message: "Tiêu đề bài học là bắt buộc"
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không phải giảng viên
 *       404:
 *         description: Khóa học không tồn tại
 */
router.post("/create-lecture/:courseId", isAuth, isEducator, createLecture);

/**
 * @openapi
 * /api/v1/course/course-lecture/{courseId}:
 *   get:
 *     tags:
 *       - Lecture
 *     summary: Lấy danh sách bài học của khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: Danh sách bài học
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               course:
 *                 _id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 title: "Complete MERN Stack Bootcamp"
 *                 lectures:
 *                   - _id: "666b1b2c3d4e5f6a7b8c9d1a"
 *                     lectureTitle: "Giới thiệu về React Hooks"
 *                     videoUrl: "https://res.cloudinary.com/.../lecture01.mp4"
 *                     isPreviewFree: true
 *                     createdAt: "2026-07-22T10:30:00.000Z"
 *                     updatedAt: "2026-07-22T10:30:00.000Z"
 *                   - _id: "666b1b2c3d4e5f6a7b8c9d1b"
 *                     lectureTitle: "useState và useEffect"
 *                     videoUrl: "https://res.cloudinary.com/.../lecture02.mp4"
 *                     isPreviewFree: false
 *                     createdAt: "2026-07-22T11:00:00.000Z"
 *                     updatedAt: "2026-07-22T11:00:00.000Z"
 *       404:
 *         description: Khóa học không tồn tại
 */
router.get("/course-lecture/:courseId", isAuth, getCourseLecture);

/**
 * @openapi
 * /api/v1/course/edit-lecture/{lectureId}:
 *   post:
 *     tags:
 *       - Lecture
 *     summary: Cập nhật bài học (tiêu đề, video, trạng thái xem thử)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         example: "666b1b2c3d4e5f6a7b8c9d1a"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lectureTitle:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: "Tiêu đề bài học (không bắt buộc nếu chỉ upload video)"
 *                 example: "React Hooks nâng cao — useCallback & useMemo"
 *               isPreviewFree:
 *                 type: boolean
 *                 description: "Cho phép xem thử miễn phí (true / false)"
 *                 example: true
 *               videoUrl:
 *                 type: string
 *                 format: binary
 *                 description: "Tệp video bài học (.mp4, .avi, .mov, .mkv, .webm, tối đa 200MB)"
 *     responses:
 *       200:
 *         description: Cập nhật bài học thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cập nhật bài học thành công"
 *               lecture:
 *                 _id: "666b1b2c3d4e5f6a7b8c9d1a"
 *                 lectureTitle: "React Hooks nâng cao — useCallback & useMemo"
 *                 videoUrl: "https://res.cloudinary.com/.../lecture01_updated.mp4"
 *                 isPreviewFree: false
 *                 createdAt: "2026-07-22T10:30:00.000Z"
 *                 updatedAt: "2026-07-22T12:00:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Dữ liệu không hợp lệ"
 *               errors:
 *                 - field: "lectureTitle"
 *                   message: "Tiêu đề bài học không được quá 200 ký tự"
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không phải giảng viên
 *       404:
 *         description: Bài học không tồn tại
 */
router.post(
  "/edit-lecture/:lectureId",
  isAuth,
  isEducator,
  uploadVideo.single("videoUrl"),
  editLecture,
);

/**
 * @openapi
 * /api/v1/course/remove-lecture/{lectureId}:
 *   delete:
 *     tags:
 *       - Lecture
 *     summary: Xóa bài học
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         example: "666b1b2c3d4e5f6a7b8c9d1a"
 *     responses:
 *       200:
 *         description: Xóa bài học thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Xóa bài học thành công"
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không phải giảng viên
 *       404:
 *         description: Bài học không tồn tại
 */
router.delete("/remove-lecture/:lectureId", isAuth, isEducator, removeLecture);

export default router;
