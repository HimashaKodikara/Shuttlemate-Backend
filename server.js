import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/video.js";
import CoachRoutes from "./routes/Coachers.js"
import CourtRoutes from "./routes/Courts.js";
import ShopRoutes from "./routes/shops.js";
import itemRoutes from "./routes/Item.js";
import MatchesRoute from  "./routes/Matches.js"
//import { errorHandler } from "./middlewares/error.js";

dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/coachers",CoachRoutes);
app.use("/api/courts",CourtRoutes);
app.use("/api/shops",ShopRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/matches",MatchesRoute);

app.listen(port, () => {
  // connect to DB
  connectDB();
  console.log("Server started listening on port", port);
});