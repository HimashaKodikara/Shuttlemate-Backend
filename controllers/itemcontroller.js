import Shop from "../models/shop.js";

// Fetch all items from all shops
// Fetch all items from all shops
// export const getAllItems = async (req, res) => {
//     try {
//       const shops = await Shop.find(); // No need for populate()
  
//       // Extract items from all shops
//       const allItems = shops.flatMap((shop) =>
//         shop.items.map((item) => {
//           // Find the category object from the embedded categories array
//           const category = shop.categories.find(
//             (cat) => cat._id.toString() === item.categoryId.toString()
//           );
  
//           return {
//             _id: item._id,
//             itemphoto: item.itemphoto,
//             name: item.name,
//             price: item.price,
//             color: item.color,
//             categoryId: category?._id, // Extract category ID
//             categoryName: category?.categoryName || "Uncategorized", // Extract category name
//             shopId: shop._id,
//             shopName: shop.ShopName,
//           };
//         })
//       );
  
//       res.status(200).json(allItems);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Error fetching items", error: error.message });
//     }
//   };
  

// // Fetch items by Shop ID
// export const getItemsByShopId = async (req, res) => {
//   try {
//     const shop = await Shop.findById(req.params.shopId).populate("items.categoryId");

//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     res.status(200).json(shop.items);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching shop items", error });
//   }
// };

// Fetch all items grouped by category
export const getAllItems = async (req, res) => {
  try {
    const shops = await Shop.find();

    // Object to store items under categories
    const categorizedItems = {};

    shops.forEach((shop) => {
      shop.items.forEach((item) => {
        const category = shop.categories.find(
          (cat) => cat._id.toString() === item.categoryId.toString()
        );

        const categoryId = category?._id.toString() || "Uncategorized";
        const categoryName = category?.categoryName || "Uncategorized";

        if (!categorizedItems[categoryId]) {
          categorizedItems[categoryId] = {
            categoryId,
            categoryName,
            items: [],
          };
        }

        // Push item with all fields
        categorizedItems[categoryId].items.push({
          _id: item._id,
          itemphoto: item.itemphoto,
          name: item.name,
          price: item.price,
          color: item.color,
          brand: item.brand,
          features: item.features,
          availableqty: item.availableqty,
          shopId: shop._id,
          shopName: shop.ShopName,
        });
      });
    });

    const result = Object.values(categorizedItems);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching categorized items:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};



export const getItemsByShopId = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const categorizedItems = {};

    shop.items.forEach((item) => {
      const category = shop.categories.find(
        (cat) => cat._id.toString() === item.categoryId.toString()
      );

      const categoryId = category?._id.toString() || "Uncategorized";
      const categoryName = category?.categoryName || "Uncategorized";

      if (!categorizedItems[categoryId]) {
        categorizedItems[categoryId] = {
          categoryId,
          categoryName,
          items: [],
        };
      }

      categorizedItems[categoryId].items.push({
        _id: item._id,
        itemphoto: item.itemphoto,
        name: item.name,
        price: item.price,
        color: item.color,
        brand: item.brand,
        features: item.features,
        availableqty: item.availableqty,
        shopId: shop._id,
        shopName: shop.ShopName,
      });
    });

    const result = Object.values(categorizedItems);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching items by shop ID:", error);
    res.status(500).json({ message: "Error fetching shop items", error: error.message });
  }
};


export const getAllItemsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const shops = await Shop.find();

    const filteredItems = [];

    shops.forEach((shop) => {
      shop.items.forEach((item) => {
        if (item.categoryId.toString() === categoryId) {
          filteredItems.push({
            _id: item._id,
            itemphoto: item.itemphoto,
            name: item.name,
            price: item.price,
            color: item.color,
            brand: item.brand,
            features: item.features,
            availableqty: item.availableqty,
            shopId: shop._id,
            shopName: shop.ShopName,
          });
        }
      });
    });

    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error fetching items by category ID:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const shops = await Shop.find();

    let foundItem = null;

    for (const shop of shops) {
      const item = shop.items.find((item) => item._id.toString() === itemId);
      if (item) {
        const category = shop.categories.find(
          (cat) => cat._id.toString() === item.categoryId.toString()
        );

        foundItem = {
          _id: item._id,
          itemphoto: item.itemphoto,
          name: item.name,
          price: item.price,
          color: item.color,
          brand: item.brand,
          features: item.features,
          availableqty: item.availableqty,
          shopId: shop._id,
          shopName: shop.ShopName,
          categoryId: category?._id || "Uncategorized",
          categoryName: category?.categoryName || "Uncategorized",
        };
        break; 
      }
    }

    if (!foundItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(foundItem);
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};
