import express from "express";
import { createVideo ,getVideos } from "../controllers/video.js";

const router = express.Router();

// http://localhost:5000/api/videos/
router.post("/", createVideo);
router.get("/videos", getVideos);

export default router;