import express from "express";
import {
  test,
  deleteUser,
  signout,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout/", signout);
router.get("/getusers", verifyToken, getUsers); // try to run taking get "/getusers" route below get "/:userId" route, somethis peculiar will happen
router.get("/:userId", getUser);

export default router;
