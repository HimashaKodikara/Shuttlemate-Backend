import express from "express";
import { createcoach, getCoachers, deleteCoach,updateCoach} from "../controllers/Coachers.js";

const router = express.Router();

// http://localhost:5000/api/Coachers/
router.post("/", createcoach);
router.get("/", getCoachers);
router.delete("/:id", deleteCoach);
router.put("/", updateCoach);

export default router;