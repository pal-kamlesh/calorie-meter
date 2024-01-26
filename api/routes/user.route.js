import express from "express";
import {
  test,
  deleteUser,
  signout,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout/", signout);
router.get("/:userId", getUser);
router.get("/getusers", verifyToken, getUsers);
export default router;
