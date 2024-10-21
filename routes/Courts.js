import express from "express";
import { createcoach, getCoachers } from "../controllers/Coachers.js";
import { createcourt, getCourts } from "../controllers/Courts.js";

const router = express.Router();

// http://localhost:5000/api/Coachers/
router.post("/", createcourt);
router.get("/", getCourts);

export default router;