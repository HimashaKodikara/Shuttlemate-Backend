import mongoose from "mongoose";

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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
});

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
    brands:
      [
        {
          name: { type: String, required: true },
          images: { type: String, required: true },
        },
      ],
    
    categories: [CategorySchema], // Categories inside shop
    items: [ItemSchema], // Items assigned to categories via categoryId
  },
  { timestamps: true }
);

export default mongoose.model("shops", ShopSchema);
