import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "API is Working!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          caloriesPerDay: req.body.caloriesPerDay,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User have been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log(req.params.userId);
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
