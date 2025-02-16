import express from "express";
import { 
  createShop, 
  getAllShops,
  deleteShop ,
  addItemToShop,
  removeItemFromShop,
 
} from "../controllers/shopController.js";

const router = express.Router();

// http://localhost:5000/api/shops/
router.post("/", createShop);
router.get("/", getAllShops);
router.delete("/shop/:id",deleteShop);
//  http://localhost:5000/api/shops/:id/items/
router.post("/:id/items",addItemToShop);
// http://localhost:5000/api/shops/shop/:id/items/:id
router.delete("/shop/:id/items/:itemId", removeItemFromShop);




// Define item routes within shops


export default router;
