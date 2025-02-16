import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
//const AutoIncrement = AutoIncrementFactory(connection);

//const connection = mongoose.connection;

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
    
    // Embed an array of items in each shop document
    items: [ItemSchema],
  },
  { timestamps: true, } 
);



export default mongoose.model("shops", ShopSchema);
