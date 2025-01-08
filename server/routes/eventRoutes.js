import express from "express";
import {
  getEvents,
  getInvitedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  acceptEventInvitation,
  rejectEventInvitation,
  resendEventInvitation
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/invited", getInvitedEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.put("/:id/accept", acceptEventInvitation);
router.put("/:id/reject", rejectEventInvitation);
router.put("/:id/resend", resendEventInvitation);


export default router;
