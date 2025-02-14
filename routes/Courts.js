import express from "express";

import { createcourt, deleteCourt, getCourts } from "../controllers/Courts.js";

const router = express.Router();

// http://localhost:5000/api/courts/
router.post("/", createcourt);
router.get("/", getCourts);
router.delete("/:id",deleteCourt);
router.put("/:id", getCourts);

export default router;