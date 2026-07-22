import { Router } from "express";
import {
  getEnrolledCourses,
  updateProfile,
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = Router();

/**
 * @openapi
 * /api/v1/user/update-profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Cập nhật hồ sơ người dùng (tên, bio, ảnh đại diện)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Chữ cái, dấu gạch ngang (-), dấu nháy ('), khoảng trắng đơn. Tối thiểu 2, tối đa 100.
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Nguyễn Văn An
 *               bio:
 *                 type: string
 *                 description: Giới thiệu ngắn. Tối đa 300 ký tự.
 *                 maxLength: 300
 *                 example: Giảng viên lập trình web với 5 năm kinh nghiệm.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện (JPEG, PNG, WebP). Tối đa 5MB.
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [student, educator]
 *                     bio:
 *                       type: string
 *                     photoUrl:
 *                       type: string
 *                     enrolledCourses:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               success: true
 *               message: "Cập nhật hồ sơ thành công"
 *               user:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 name: "Nguyễn Văn An"
 *                 email: "nguyenvanan@example.com"
 *                 role: "educator"
 *                 bio: "Giảng viên lập trình web với 5 năm kinh nghiệm."
 *                 photoUrl: "https://res.cloudinary.com/.../avatar.jpg"
 *                 enrolledCourses: []
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc ảnh sai định dạng
 *         content:
 *           application/json:
 *             examples:
 *               invalidName:
 *                 summary: Tên vi phạm định dạng
 *                 value:
 *                   success: false
 *                   message: "Dữ liệu không hợp lệ"
 *                   errors:
 *                     - field: "name"
 *                       message: "Tên chỉ được chứa chữ cái, dấu gạch ngang, dấu nháy đơn và khoảng trắng"
 *               longBio:
 *                 summary: Bio quá 300 ký tự
 *                 value:
 *                   success: false
 *                   message: "Dữ liệu không hợp lệ"
 *                   errors:
 *                     - field: "bio"
 *                       message: "Giới thiệu không được quá 300 ký tự"
 *               invalidImage:
 *                 summary: Upload file không phải ảnh
 *                 value:
 *                   success: false
 *                   message: "Chỉ chấp nhận tệp JPG, PNG, WebP"
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Chưa đăng nhập"
 *       404:
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Người dùng không tồn tại"
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update-profile", isAuth, upload.single("image"), updateProfile);

/**
 * @openapi
 * /api/v1/user/enrolled-courses:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy danh sách khóa học đã ghi danh
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khóa học đã ghi danh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       thumbnail:
 *                         type: string
 *                       category:
 *                         type: string
 *                       level:
 *                         type: string
 *                         enum: [Beginner, Intermediate, Advanced]
 *                       price:
 *                         type: number
 *                       creator:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           photoUrl:
 *                             type: string
 *             example:
 *               success: true
 *               courses:
 *                 - _id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                   title: "Complete MERN Stack Bootcamp"
 *                   thumbnail: "https://res.cloudinary.com/..."
 *                   category: "Web Development"
 *                   level: "Beginner"
 *                   price: 499000
 *                   creator:
 *                     _id: "665a1b2c3d4e5f6a7b8c9d0f"
 *                     name: "Nguyễn Văn An"
 *                     photoUrl: "https://res.cloudinary.com/.../avatar.jpg"
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/enrolled-courses", isAuth, getEnrolledCourses);

export default router;
