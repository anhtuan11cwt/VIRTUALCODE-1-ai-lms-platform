import "dotenv/config";
import express from "express";
import connectDB from "./config/connectDB.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (_req, res) => {
  res.send("LMS Backend đang chạy...");
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
