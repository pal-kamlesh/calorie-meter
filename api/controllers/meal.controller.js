import Meal from "../models/meal.model.js";
import { errorHandler } from "../utils/error.js";

export const createMeal = async (req, res, next) => {
  try {
    const { text, calories, userId, overflow } = req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create this meal"));
    }
    const newMeal = new Meal({
      text,
      calories,
      userId,
      overflow,
    });
    await newMeal.save();
    const meals = await Meal.find({ userId });
    res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to get meals "));
    }

    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const meals = await Meal.find().sort({
      updatedAt: sortDirection,
    });

    const totalMeals = await Meal.countDocuments();

    res.status(200).json({
      meals,
      totalMeals,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allwed to delete this post"));
  }
  try {
    await Meal.findByIdAndDelete(req.params.mealId);
    res.status(200).json("The meal has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateMeal = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allwed to delete this post"));
  }
  const userId = req.params.userId;
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.mealId,
      {
        $set: {
          text: req.body.text,
          calories: req.body.calories,
          overflow: req.body.overflow,
        },
      },
      { new: true }
    );
    const meals = await Meal.find({ userId });

    res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};
