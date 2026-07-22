import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/connectDB.js";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send("LMS Backend đang chạy...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`API Docs:            http://localhost:${PORT}/api-docs`);
});
