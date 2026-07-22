import { Router } from "express";
import { signup } from "../controllers/authController.js";

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
 *                 example: Abcd@1234
 *               role:
 *                 type: string
 *                 enum: [student, educator]
 *                 default: student
 *                 example: student
 *           example:
 *             name: Nguyễn Văn An
 *             email: nguyenvanan@example.com
 *             password: Abcd@1234
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
 *         description: Lỗi dữ liệu hoặc email đã tồn tại
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
 *             example:
 *               success: false
 *               message: "Dữ liệu không hợp lệ"
 *               errors:
 *                 - field: "email"
 *                   message: "Định dạng email không hợp lệ"
 *                 - field: "password"
 *                   message: "Phải có ít nhất 8 ký tự"
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/signup", signup);

export default router;
