import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookeParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import mealRoutes from "./routes/meal.route.js";
import path from "path";

dotenv.config();

mongoose
  .connect(`${process.env.MONGO}calorie-meter`)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookeParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meal", mealRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server Error";
  console.log(err);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
