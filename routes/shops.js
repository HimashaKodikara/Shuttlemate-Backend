import express from "express";
import { 
  createShop, 
  getAllShops, 
 
} from "../controllers/shop.js";

const router = express.Router();

// http://localhost:5000/api/shops/
router.post("/", createShop);
router.get("/", getAllShops);


// Define item routes within shops


export default router;
