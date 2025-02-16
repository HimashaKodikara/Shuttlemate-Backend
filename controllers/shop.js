import express from "express";
import mongoose from "mongoose";
import Shop from "../models/shop.js"; // Ensure this points to the correct Shop model file



// Create a new shop
export const createShop = async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);
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
    const shops = await Shop.find({}, "ShopName Tel place");
    res.status(200).json({ success: true, shops });
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

// Add an item to a shop
export const addItemToShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    shop.items.push(req.body);
    await shop.save();
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
