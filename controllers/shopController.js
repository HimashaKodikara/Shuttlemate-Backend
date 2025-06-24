import express from "express";
import mongoose from "mongoose";
import Shop from "../models/shop.js";
import { getRegisteredTokens } from "./notificationController.js";

// Create a new shop
export const createShop = async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);

    try{
      const tokens = getRegisteredTokens();

      if(tokens && tokens.length > 0){
        const message = {
          Notification:{
            title:'New Shop Added !',
            body : `A new shop has been added : ${shop.name || 'Check it out!'} `,

          },
          data:{
            screen: 'shop',
              shopId: shop._id.toString(),
              type: 'new_shop'
          },
        };

        const notification = tokens.map(async(token) => {
          try{
            const result = await admin.message().send({
              ...message,
              token,
            });
            return result;
          }catch(error){
              console.error(`Failed to send notification to token ${token.substring(0, 10)}...:`, error.message);
              return null;
          }
        });
         const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
          const failed = results.length - successful;
      }else{
             console.log('No registered tokens found for notifications');

      }
    }
    catch(notificationError){
          console.error('Error sending notifications:', notificationError);

    }
    res.status(201).json({ success: true, shop });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ success: false, message: "Failed to create shop" });
    next(error);
  }
};



// Get all shops
export const getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find();
    
    const transformedShops = shops.map(shop => ({
      ...shop.toObject(),
      itemsCount: shop.items.length,
      categoriesCount: shop.categories.length,
    }));

    res.status(200).json({ success: true, shops: transformedShops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shops" });
    next(error);
  }
};

// Get a single shop by ID
export const getShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shop" });
    next(error);
  }
};

// Update a shop by ID
export const updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ success: false, message: "Failed to update shop" });
    next(error);
  }
};

// Delete a shop by ID
export const deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, message: "Shop deleted successfully" });
  } catch (error) {
    console.error("Error deleting shop:", error);
    res.status(500).json({ success: false, message: "Failed to delete shop" });
    next(error);
  }
};

// Add a category to a shop
export const addCategoryToShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    shop.categories.push(req.body);
    await shop.save();
    res.status(201).json({ success: true, shop });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: "Failed to add category" });
    next(error);
  }
};

// // Add an item to a category in a shop
// export const addItemToCategory = async (req, res, next) => {
//   try {
//     const { name, price, color, itemphoto, categoryId } = req.body;
//     const shop = await Shop.findById(req.params.id);
//     if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

//     const categoryExists = shop.categories.some(category => category._id.toString() === categoryId);
//     if (!categoryExists) return res.status(404).json({ success: false, message: "Category not found" });

//     const newItem = { name, price, color, itemphoto, categoryId };
//     shop.items.push(newItem);
//     await shop.save();
//     res.status(201).json({ success: true, shop });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     res.status(500).json({ success: false, message: "Failed to add item" });
//     next(error);
//   }
// };



// export const addItemToCategory = async (req, res, next) => {
//   try {
//     const { name, price, color, itemphoto, categoryId } = req.body;

//     // Find the shop
//     const shop = await Shop.findById(req.params.id);
//     if (!shop) {
//       return res.status(404).json({ success: false, message: "Shop not found" });
//     }

//     // Convert categoryId to ObjectId if it's a string
//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({ success: false, message: "Invalid category ID" });
//     }
//     const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

//     // Check if category exists in shop
//     const categoryExists = shop.categories.some(category => category._id.equals(categoryObjectId));
//     if (!categoryExists) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     // Create and add new item
//     const newItem = { name, price, color, itemphoto, categoryId };
//     shop.items.push(newItem);
//     await shop.save();

//     res.status(201).json({ success: true, shop });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     res.status(500).json({ success: false, message: "Failed to add item" });
//     next(error);
//   }
// };

export const addItemToCategory = async (req, res, next) => {
  try {
    const { name, price, color, itemphoto, categoryId, brand, features, availableqty } = req.body;

    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const categoryExists = shop.categories.some(category => category._id.equals(categoryObjectId));
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const newItem = {
      name,
      price,
      color,
      itemphoto,
      brand,
      features,
      availableqty,
      categoryId
    };

    shop.items.push(newItem);
    await shop.save(); // Automatically fills item.shopName

    res.status(201).json({ success: true, shop });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ success: false, message: "Failed to add item" });
    next(error);
  }
};



// Remove an item from a shop
export const removeItemFromShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    shop.items = shop.items.filter(item => item._id.toString() !== req.params.itemId);
    await shop.save();
    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ success: false, message: "Failed to remove item" });
    next(error);
  }
};


