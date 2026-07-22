import { Router } from "express";
import {
  createReview,
  getCourseReviews,
} from "../controllers/reviewController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

/**
 * @openapi
 * /api/v1/review/create:
 *   post:
 *     tags:
 *       - Review
 *     summary: Tạo đánh giá cho khóa học (yêu cầu đã ghi danh)
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
 *               - rating
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID của khóa học
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Số sao đánh giá (1–5)
 *               comment:
 *                 type: string
 *                 description: Nội dung nhận xét
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         photoUrl:
 *                           type: string
 *                     course:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Đã đánh giá khóa học này rồi
 *       403:
 *         description: Chưa ghi danh khóa học
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/create", isAuth, createReview);

/**
 * @openapi
 * /api/v1/review/course/{courseId}:
 *   get:
 *     tags:
 *       - Review
 *     summary: Lấy tất cả đánh giá của một khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           photoUrl:
 *                             type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/course/:courseId", getCourseReviews);

export default router;
