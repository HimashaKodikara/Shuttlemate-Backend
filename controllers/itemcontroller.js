import Shop from "../models/shop.js";

// Fetch all items from all shops
// Fetch all items from all shops
export const getAllItems = async (req, res) => {
    try {
      const shops = await Shop.find(); // No need for populate()
  
      // Extract items from all shops
      const allItems = shops.flatMap((shop) =>
        shop.items.map((item) => {
          // Find the category object from the embedded categories array
          const category = shop.categories.find(
            (cat) => cat._id.toString() === item.categoryId.toString()
          );
  
          return {
            _id: item._id,
            itemphoto: item.itemphoto,
            name: item.name,
            price: item.price,
            color: item.color,
            categoryId: category?._id, // Extract category ID
            categoryName: category?.categoryName || "Uncategorized", // Extract category name
            shopId: shop._id,
            shopName: shop.ShopName,
          };
        })
      );
  
      res.status(200).json(allItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Error fetching items", error: error.message });
    }
  };
  

// Fetch items by Shop ID
export const getItemsByShopId = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId).populate("items.categoryId");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop.items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop items", error });
  }
};
