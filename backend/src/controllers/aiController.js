import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ZodError } from "zod";
import Course from "../models/Course.js";
import { aiSearchSchema } from "../utils/zodSchemas.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiSearch = async (req, res) => {
  try {
    const { query } = aiSearchSchema.parse(req.body);

    const courses = await Course.find({ status: "Published" })
      .select("title subtitle category level price")
      .lean();

    if (courses.length === 0) {
      return res.json({ recommendations: [], success: true });
    }

    const courseList = courses
      .map(
        (c, i) =>
          `${i + 1}. "${c.title}" — Chuyên mục: ${c.category}, Cấp độ: ${c.level}, Giá: ${c.price}₫`,
      )
      .join("\n");

    const prompt = `Bạn là trợ lý tư vấn khóa học thông minh. Dưới đây là danh sách khóa học có sẵn:\n\n${courseList}\n\nNgười dùng hỏi: "${query}"\n\nHãy chọn những khóa học phù hợp nhất (tối đa 6) và trả về JSON array thuần (không markdown, không code block) với mỗi phần tử có: title (chính xác tên khóa học), reason (lý do đề xuất bằng tiếng Việt). Nếu không có khóa học phù hợp, trả về [].`;

    const response = await genAI.models.generateContent({
      contents: [{ parts: [{ text: prompt }], role: "user" }],
      model: "gemini-3.1-flash-lite",
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const clean = jsonMatch ? jsonMatch[0] : "[]";
    let recommendations = [];
    try {
      recommendations = JSON.parse(clean);
    } catch {
      recommendations = [];
    }

    const fullCourses = recommendations
      .map((r) => {
        const found = courses.find((c) => c.title === r.title);
        return found ? { ...found, reason: r.reason } : null;
      })
      .filter(Boolean);

    res.json({ recommendations: fullCourses, success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        message: "Dữ liệu không hợp lệ",
        success: false,
      });
    }
    console.error("Lỗi tìm kiếm AI:", error);
    res.status(500).json({ message: "Lỗi tìm kiếm AI", success: false });
  }
};
