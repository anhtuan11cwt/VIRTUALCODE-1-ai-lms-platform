import { Router } from "express";
import {
  freeEnroll,
  stripeCheckoutSession,
  verifyPayment,
} from "../controllers/orderController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

/**
 * @openapi
 * /api/v1/order/create-checkout-session:
 *   post:
 *     tags:
 *       - Order
 *     summary: Tạo Stripe Checkout Session
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: URL thanh toán Stripe
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               sessionUrl: "https://checkout.stripe.com/c/pay/cs_test_..."
 *       400:
 *         description: Thiếu courseId hoặc khóa học miễn phí
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Khóa học không tồn tại
 */
router.post("/create-checkout-session", isAuth, stripeCheckoutSession);

/**
 * @openapi
 * /api/v1/order/verify-payment:
 *   post:
 *     tags:
 *       - Order
 *     summary: Xác thực thanh toán và ghi danh học viên
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - courseId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "cs_test_a1b2c3d4e5f6g7h8i9j0"
 *               courseId:
 *                 type: string
 *                 example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: Ghi danh thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Ghi danh thành công"
 *               user:
 *                 enrolledCourses:
 *                   - "665a1b2c3d4e5f6a7b8c9d0e"
 *       400:
 *         description: Thanh toán chưa hoàn tất
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/verify-payment", isAuth, verifyPayment);

/**
 * @openapi
 * /api/v1/order/free-enroll:
 *   post:
 *     tags:
 *       - Order
 *     summary: Ghi danh khóa học miễn phí
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "665a1b2c3d4e5f6a7b8c9d0e"
 *     responses:
 *       200:
 *         description: Ghi danh thành công
 */
router.post("/free-enroll", isAuth, freeEnroll);

export default router;
