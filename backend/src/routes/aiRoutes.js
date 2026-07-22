import { Router } from "express";
import { aiSearch } from "../controllers/aiController.js";

const router = Router();

/**
 * @openapi
 * /api/v1/ai/search:
 *   post:
 *     tags:
 *       - AI
 *     summary: Tìm kiếm khóa học thông minh bằng AI (Gemini)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Câu hỏi hoặc mô tả nhu cầu học tập bằng ngôn ngữ tự nhiên
 *                 example: Tôi muốn học lập trình web từ cơ bản
 *     responses:
 *       200:
 *         description: Danh sách khóa học được AI đề xuất
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subtitle:
 *                         type: string
 *                       category:
 *                         type: string
 *                       level:
 *                         type: string
 *                       price:
 *                         type: number
 *                       reason:
 *                         type: string
 *                         description: Lý do AI đề xuất khóa học này
 *       500:
 *         description: Lỗi máy chủ hoặc lỗi AI
 */
router.post("/search", aiSearch);

export default router;
