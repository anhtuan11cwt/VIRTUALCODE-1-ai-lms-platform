import { Router } from "express";
import {
  createCourse,
  editCourse,
  getCourseById,
  getCreatorCourses,
  getPublishedCourses,
  removeCourse,
} from "../controllers/courseController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

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
 *                   createdAt: "2026-07-22T..."
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
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Draft, Published]
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu dữ liệu bắt buộc khi publish
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
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Khóa học không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:courseId", isAuth, removeCourse);

export default router;
