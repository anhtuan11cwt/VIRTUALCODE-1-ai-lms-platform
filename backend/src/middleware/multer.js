import multer from "multer";

const imageFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ chấp nhận tệp JPG, PNG, WebP"));
};

const videoFilter = (_req, file, cb) => {
  const allowed = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/mkv",
    "video/webm",
    "video/quicktime",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ chấp nhận tệp video MP4, AVI, MOV, MKV, WebM"));
};

export const uploadImage = multer({
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.memoryStorage(),
});

export const uploadVideo = multer({
  fileFilter: videoFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
  storage: multer.memoryStorage(),
});

const upload = uploadImage;

export default upload;
