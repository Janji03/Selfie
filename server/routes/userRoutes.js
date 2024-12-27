import express from "express";
import {
  getUser,
  updateUser,
  updateUserProfilePicture,
  deleteUser,
  getAllUserIdsAndNames,
} from "../controllers/userController.js";
import upload from "../utils/uploadUtils.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put(
  "/:id/pfp",
  upload.single("profilePicture"),
  updateUserProfilePicture
);
router.delete("/:id", deleteUser);

router.get("/all", getAllUserIdsAndNames);

export default router;
