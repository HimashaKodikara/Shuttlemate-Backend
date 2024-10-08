import express from "express";
import { createcoach, getCoachers } from "../controllers/Coachers.js";

const router = express.Router();

// http://localhost:5000/api/Coachers/
router.post("/", createcoach);
router.get("/", getCoachers);

export default router;