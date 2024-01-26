import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookeParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import mealRoutes from "./routes/meal.route.js";

dotenv.config();

mongoose
  .connect(`${process.env.MONGO}calorie-meter`)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookeParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meal", mealRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
