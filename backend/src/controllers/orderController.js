import "dotenv/config";
import Stripe from "stripe";
import Course from "../models/Course.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "Thiếu courseId", success: false });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }

    if (course.price === 0) {
      return res.status(400).json({
        message: "Khóa học miễn phí không cần thanh toán",
        success: false,
      });
    }

    if (course.status !== "Published") {
      return res.status(400).json({
        message: "Khóa học chưa được xuất bản",
        success: false,
      });
    }

    if (course.creator.toString() === req.userId) {
      return res.status(400).json({
        message: "Bạn không thể mua khóa học của chính mình",
        success: false,
      });
    }

    const user = await User.findById(req.userId);
    if (user.enrolledCourses.some((c) => c.toString() === courseId)) {
      return res.status(400).json({
        message: "Bạn đã ghi danh khóa học này rồi",
        success: false,
      });
    }

    const origin =
      req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";

    // Giá gốc VND — Stripe nhận VND dạng zero-decimal (không cần * 100)
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${origin}/course/${courseId}`,
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              description: course.subtitle || undefined,
              images: course.thumbnail ? [course.thumbnail] : undefined,
              name: course.title,
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId,
        userId: req.userId,
      },
      mode: "payment",
      success_url: `${origin}/course/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ sessionUrl: session.url, success: true });
  } catch (error) {
    console.error("Lỗi tạo session Stripe:", error);
    res
      .status(500)
      .json({ message: error.message || "Lỗi máy chủ", success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, courseId } = req.body;
    const userId = req.userId;

    if (!sessionId || !courseId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin thanh toán", success: false });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ message: "Thanh toán chưa hoàn tất", success: false });
    }

    if (
      session.metadata.userId !== userId ||
      session.metadata.courseId !== courseId
    ) {
      return res.status(403).json({
        message: "Phiên thanh toán không hợp lệ",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { returnDocument: "after" },
    );
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    res.json({
      message: "Ghi danh thành công",
      success: true,
      user: {
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error) {
    console.error("Lỗi xác thực thanh toán:", error);
    res
      .status(500)
      .json({ message: error.message || "Lỗi máy chủ", success: false });
  }
};

export const freeEnroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId;

    if (!courseId) {
      return res
        .status(400)
        .json({ message: "Thiếu courseId", success: false });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Khóa học không tồn tại", success: false });
    }

    if (course.price !== 0) {
      return res
        .status(400)
        .json({ message: "Khóa học này không miễn phí", success: false });
    }

    if (course.status !== "Published") {
      return res.status(400).json({
        message: "Khóa học chưa được xuất bản",
        success: false,
      });
    }

    if (course.creator.toString() === userId) {
      return res.status(400).json({
        message: "Bạn không thể ghi danh khóa học của chính mình",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (user.enrolledCourses.some((c) => c.toString() === courseId)) {
      return res.status(400).json({
        message: "Bạn đã ghi danh khóa học này rồi",
        success: false,
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    user.enrolledCourses.push(courseId);

    res.json({
      message: "Ghi danh thành công",
      success: true,
      user: {
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error) {
    console.error("Lỗi ghi danh miễn phí:", error);
    res
      .status(500)
      .json({ message: error.message || "Lỗi máy chủ", success: false });
  }
};
