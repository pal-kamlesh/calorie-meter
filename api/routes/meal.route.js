import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createMeal,
  deleteMeal,
  getMeals,
  updateMeal,
} from "../controllers/meal.controller.js";
const router = express.Router();

router.post("/create", verifyToken, createMeal);
router.get("/getmeals", verifyToken, getMeals);
router.delete("/deletemeal/:mealId/:userId", verifyToken, deleteMeal);
router.put("/updatemeal/:mealId/:userId", verifyToken, updateMeal);

export default router;
