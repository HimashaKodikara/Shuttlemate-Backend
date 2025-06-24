import mongoose from "mongoose";

// Define Item Schema
const ItemSchema = new mongoose.Schema({
  itemphoto: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  shopName: {
    type: String, // Will be auto-filled
  },
  brand: {
    type: String,
  },
  features: {
    type: String,
  },
  availableqty: {
    type: Number,
    min: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

// Define Category Schema
const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  priceRange: {
    type: String,
  },
});

// Define Shop Schema
const ShopSchema = new mongoose.Schema(
  {
    ShopPhoto: {
      type: String,
      required: true,
    },
    ShopName: {
      type: String,
      required: true,
    },
    Tel: {
      type: String,
    },
    place: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    brands: [
      {
        name: { type: String, required: true },
        images: { type: String, required: true },
      },
    ],
    categories: [CategorySchema], // Embedded categories
    items: [ItemSchema], // Embedded items
  },
  { timestamps: true }
);

// Pre-save middleware to auto-fill shopName in each item
ShopSchema.pre("save", function (next) {
  const shop = this;
  if (shop.items && shop.ShopName) {
    shop.items.forEach(item => {
      item.shopName = shop.ShopName;
    });
  }
  next();
});

export default mongoose.model("shops", ShopSchema);
