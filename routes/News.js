import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/NewsController.js";

const router = express.Router();

router.post("/", createNews);      // Create news
router.get("/", getAllNews);       // Get all news
router.get("/:id", getNewsById);   // Get single news
router.put("/:id", updateNews);    // Update news
router.delete("/:id", deleteNews); // Delete news

export default router;
