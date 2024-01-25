import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
