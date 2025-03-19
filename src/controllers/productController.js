import fetch from "node-fetch";

// Fetch product data from Google Sheets
const fetchProductData = async () => {
  const SHEET_ID = "117z_ENHBb1dE2fuwiBHVF3eLMCm1Xvh8jCyeuVch-as";
  const API_KEY = "AIzaSyAAVJfx43FADGwxOBIfhfbOvw_DgwpQT3U";
  const RANGE = "Sheet1!A2:H";

  console.log("📡 Fetching data from Google Sheets...");
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Google Sheets API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error("No valid array found in Google Sheets data.");
    }

    if (data.values.length === 0) {
      throw new Error("No products found in the Google Sheet.");
    }

    // Map Google Sheets data to products
    return data.values.map((row, index) => ({
      id: row[0]?.trim() || `${index + 1}`, // Ensure ID is a number
      name: row[1]?.trim() || "Unnamed Product",
      price: row[2] ? parseFloat(row[2]) : 0,
      category: row[3]?.trim() || "Uncategorized",
      description: row[4]?.trim() || "No description available",
      imageUrl: row[5]?.trim() || "https://via.placeholder.com/150",
      stock: row[6] ? Math.max(0, parseInt(row[6], 10)) : 0,
      rating: row[7] ? Math.min(5, Math.max(0, parseFloat(row[7]))) : 0,
    }));
  } catch (error) {
    console.error("🔥 Error fetching product data:", error);
    throw error;
  }
};

// Get all products
export async function getProducts(req, res) {
  console.log("📡 Fetching all products...");

  try {
    const products = await fetchProductData();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

// Get product by ID
export async function getProductById(req, res) {
  const { id } = req.params;
  console.log(`📡 Fetching product by ID: ${id}`);

  try {
    const products = await fetchProductData();
    const product = products.find((p) => String(p.id) === String(id)); // Ensure ID comparison

    if (!product) {
      console.warn(`⚠️ Product not found: ID ${id}`);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("✅ Successfully fetched product:", product);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("🔥 Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}
