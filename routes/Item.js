import express from "express";
import { getAllItems, getItemsByShopId } from "../controllers/itemcontroller.js";

const router = express.Router();

//http://localhost:5000/api/items/
router.get("/", getAllItems); // Get all items from all shops
router.get("/shop/:shopId", getItemsByShopId); // Get items by Shop ID

export default router;
