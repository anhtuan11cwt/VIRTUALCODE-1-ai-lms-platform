import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/authController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Chữ cái, dấu gạch ngang (-), dấu nháy ('), khoảng trắng đơn giữa các từ. Tối thiểu 2, tối đa 100.
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Nguyễn Văn An
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvanan@example.com
 *               password:
 *                 type: string
 *                 description: Tối thiểu 8, tối đa 64. Phải có chữ hoa, chữ thường, số, ký tự đặc biệt. Không khoảng trắng, không emoji.
 *                 minLength: 8
 *                 maxLength: 64
 *                 example: An@12345
 *               role:
 *                 type: string
 *                 enum: [student, educator]
 *                 default: student
 *                 example: student
 *           example:
 *             name: Nguyễn Văn An
 *             email: nguyenvanan@example.com
 *             password: An@12345
 *             role: student
 *     responses:
 *       201:
 *         description: Đăng ký người dùng thành công
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
 *             example:
 *               success: true
 *               message: "Đăng ký thành công"
 *               user:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 name: "Nguyễn Văn An"
 *                 email: "nguyenvanan@example.com"
 *                 role: "student"
 *       400:
 *         description: Lỗi dữ liệu — một hoặc nhiều trường không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             examples:
 *               invalidEmail:
 *                 summary: Email sai định dạng
 *                 value:
 *                   success: false
 *                   message: "Dữ liệu không hợp lệ"
 *                   errors:
 *                     - field: "email"
 *                       message: "Định dạng email không hợp lệ"
 *               weakPassword:
 *                 summary: Mật khẩu yếu (thiếu chữ hoa, số, ký tự đặc biệt)
 *                 value:
 *                   success: false
 *                   message: "Dữ liệu không hợp lệ"
 *                   errors:
 *                     - field: "password"
 *                       message: "Phải chứa ít nhất một chữ hoa"
 *                     - field: "password"
 *                       message: "Phải chứa ít nhất một số"
 *                     - field: "password"
 *                       message: "Phải chứa ít nhất một ký tự đặc biệt"
 *               duplicateEmail:
 *                 summary: Email đã tồn tại
 *                 value:
 *                   success: false
 *                   message: "Email đã tồn tại"
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/signup", signup);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvanan@example.com
 *               password:
 *                 type: string
 *                 example: An@12345
 *           example:
 *             email: nguyenvanan@example.com
 *             password: An@12345
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *             example:
 *               success: true
 *               message: "Đăng nhập thành công"
 *               user:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 name: "Nguyễn Văn An"
 *                 email: "nguyenvanan@example.com"
 *                 role: "student"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             examples:
 *               missingField:
 *                 summary: Thiếu mật khẩu
 *                 value:
 *                   success: false
 *                   message: "Dữ liệu không hợp lệ"
 *                   errors:
 *                     - field: "password"
 *                       message: "Mật khẩu là bắt buộc"
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email hoặc mật khẩu không đúng"
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/login", login);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng xuất tài khoản — xoá Cookie JWT
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Đăng xuất thành công"
 */
router.post("/logout", logout);

/**
 * @openapi
 * /api/v1/auth/current-user:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Lấy thông tin người dùng hiện tại (dựa trên Cookie)
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
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
 *                     photoUrl:
 *                       type: string
 *                     enrolledCourses:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               success: true
 *               user:
 *                 id: "665a1b2c3d4e5f6a7b8c9d0e"
 *                 name: "Nguyễn Văn An"
 *                 email: "nguyenvanan@example.com"
 *                 role: "student"
 *                 photoUrl: "https://ui-avatars.com/api/?name=Nguyen+Van+An"
 *                 enrolledCourses:
 *                   - "66a1b2c3d4e5f6a7b8c9d111"
 *                   - "66a1b2c3d4e5f6a7b8c9d222"
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             examples:
 *               noToken:
 *                 summary: Không có Cookie token
 *                 value:
 *                   success: false
 *                   message: "Chưa đăng nhập"
 *               expiredToken:
 *                 summary: Token hết hạn hoặc sai
 *                 value:
 *                   success: false
 *                   message: "Token không hợp lệ hoặc đã hết hạn"
 */
router.get("/current-user", isAuth, getCurrentUser);

export default router;
