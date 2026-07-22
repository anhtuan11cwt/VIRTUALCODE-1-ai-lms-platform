import User from "../models/User.js";

const isEducator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user?.role !== "educator") {
      return res.status(403).json({
        message: "Chỉ giảng viên mới có quyền thực hiện thao tác này",
        success: false,
      });
    }
    next();
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};

export default isEducator;
