import express from "express";

import { createcourt, getCourts } from "../controllers/Courts.js";

const router = express.Router();

// http://localhost:5000/api/courts/
router.post("/", createcourt);
router.get("/", getCourts);

export default router;