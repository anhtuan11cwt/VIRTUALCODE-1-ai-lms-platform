import multer from "multer";

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ chấp nhận tệp JPG, PNG, WebP"));
};

const upload = multer({
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.memoryStorage(),
});

export default upload;
