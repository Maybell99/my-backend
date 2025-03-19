import fetch from "node-fetch";

export const getProducts = async (req, res) => {
  console.log("📡 Fetching all products...");

  try {
    const SHEET_ID = "117z_ENHBb1dE2fuwiBHVF3eLMCm1Xvh8jCyeuVch-as";
    const API_KEY = "AIzaSyAAVJfx43FADGwxOBIfhfbOvw_DgwpQT3U";
    const RANGE = "Sheet1!A2:H";

    console.log("📡 Fetching data from Google Sheets...");
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Google Sheets data:", data); // Log fetched data for debugging

    if (!data.values || data.values.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    // Map sheet rows to structured product objects
    const products = data.values.map((row, index) => {
      const product = {
        id: row[0] || `prod-${index + 1}`,
        name: row[1]?.trim() || "Unnamed Product",
        price: row[2] ? parseFloat(row[2]) : 0,
        category: row[3]?.trim() || "Uncategorized",
        description: row[4]?.trim() || "No description available",
        imageUrl: row[5]?.trim() || "https://via.placeholder.com/150",
        stock: row[6] ? Math.max(0, parseInt(row[6], 10)) : 0,
        rating: row[7] ? Math.min(5, Math.max(0, parseFloat(row[7]))) : 0,
      };
      console.log(`Product mapped: ${product.id} - ${product.name}`); // Log each product ID and name for debugging
      return product;
    });

    console.log("Products array:", products); // Log all products for debugging

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.json({ success: true, products });

  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL
  console.log(`📡 Fetching product by ID: ${id}`); // Log the incoming product ID

  try {
    const SHEET_ID = "117z_ENHBb1dE2fuwiBHVF3eLMCm1Xvh8jCyeuVch-as";
    const API_KEY = "AIzaSyAAVJfx43FADGwxOBIfhfbOvw_DgwpQT3U";
    const RANGE = "Sheet1!A2:H";

    console.log("📡 Fetching data from Google Sheets...");
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Google Sheets data:", data); // Log fetched data for debugging

    if (!data.values || data.values.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    // Map sheet rows to structured product objects
    const products = data.values.map((row, index) => {
      const product = {
        id: row[0] || `prod-${index + 1}`,
        name: row[1]?.trim() || "Unnamed Product",
        price: row[2] ? parseFloat(row[2]) : 0,
        category: row[3]?.trim() || "Uncategorized",
        description: row[4]?.trim() || "No description available",
        imageUrl: row[5]?.trim() || "https://via.placeholder.com/150",
        stock: row[6] ? Math.max(0, parseInt(row[6], 10)) : 0,
        rating: row[7] ? Math.min(5, Math.max(0, parseFloat(row[7]))) : 0,
      };
      console.log(`Product mapped: ${product.id} - ${product.name}`); // Log each product ID and name for debugging
      return product;
    });

    console.log("Products array:", products); // Log all products for debugging

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    // Find the product by ID
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("✅ Successfully fetched product:", product);
    res.json({ success: true, product });

  } catch (error) {
    console.error("🔥 Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
