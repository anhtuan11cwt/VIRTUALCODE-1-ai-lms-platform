import "dotenv/config";
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Chưa đăng nhập",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
      success: false,
    });
  }
};

export default isAuth;
