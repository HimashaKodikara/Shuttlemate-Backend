import express from "express";
import { getAllItems, getItemsByShopId,getAllItemsByCategoryId } from "../controllers/itemcontroller.js";

const router = express.Router();

//http://localhost:5000/api/items/
router.get("/", getAllItems); // Get all items from all shops


//http://localhost:5000/api/items/shop/67bb5c19df773fdb10ffa92d

router.get("/shop/:shopId", getItemsByShopId);
router.get("/category/:categoryId", getAllItemsByCategoryId);





export default router;
