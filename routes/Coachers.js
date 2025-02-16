import express from "express";
import { createcoach, getCoachers, deleteCoach,updateCoach} from "../controllers/CoachersController.js";

const router = express.Router();

// http://localhost:5000/api/Coachers/
router.post("/", createcoach);
router.get("/", getCoachers);
router.delete('/coach/:id', deleteCoach);
router.put("/:id", updateCoach);

export default router;