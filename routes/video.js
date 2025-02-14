import express from "express";
import { createVideo ,getVideos,deleteVideo, updateVideo} from "../controllers/video.js";

const router = express.Router();

// http://localhost:5000/api/videos/
router.post("/", createVideo);
router.get("/", getVideos);
router.delete("/video/:id", deleteVideo);
router.put("/:id", updateVideo);

export default router;