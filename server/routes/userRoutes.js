import express from "express";
import {
  getUser,
  updateUser,
  updateUserProfilePicture,
  deleteUser,
  getAllUsersBasicInfo, // Import della funzione aggiornata
} from "../controllers/userController.js";
import upload from "../utils/uploadUtils.js";

const router = express.Router();

router.get("/", getAllUsersBasicInfo); // Aggiornato il nome della funzione
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put(
  "/:id/pfp",
  upload.single("profilePicture"),
  updateUserProfilePicture
);
router.delete("/:id", deleteUser);

export default router;
