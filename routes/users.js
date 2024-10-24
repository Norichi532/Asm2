const express = require("express");
const router = express.Router();
const pool = require("../models/pg_connector");

// Function to generate HTML table for product list
const createProductTable = (products) => {
  const tableHeader = `
    <table border="1">
      <tr>
        <th>ID</th>
        <th>Product</th>
        <th>Price</th>
        <th>Shop ID</th>
        <th>Amount</th>
        <th>Action</th>
      </tr>
      <tr>
        <form action="/users" method="POST">
          <td><input type="text" name="id" placeholder="Auto" disabled></td>
          <td><input type="text" name="product" placeholder="New product" required></td>
          <td><input type="number" name="price" placeholder="Price" required step="0.01"></td>
          <td><input type="number" name="shop_id" placeholder="Shop ID" required></td>
          <td><input type="number" name="amount" placeholder="Amount" required></td>
          <td><input type="submit" name="btn" value="Add"></td>
        </form>
      </tr>`;

  const tableRows = products.map(product => `
      <tr>
        <form action="/users" method="POST">
          <td><input type="text" name="id" value="${product.id}" readonly></td>
          <td><input type="text" name="product" value="${product.product_name}" required></td>
          <td><input type="number" name="price" value="${product.price}" required step="0.01"></td>
          <td><input type="number" name="shop_id" value="${product.shop_id}" required></td>
          <td><input type="number" name="amount" value="${product.amount}" required></td>
          <td>
            <input type="submit" name="btn" value="Update">
            <input type="submit" name="btn" value="Delete">
          </td>
        </form>
      </tr>`).join('');

  return `${tableHeader}${tableRows}</table>`;
};

// GET request to fetch products
router.get("/", async (req, res) => {
  if (!req.session.authented) {
    return res.redirect("/login");
  }

  try {
    const result = await pool.query("SELECT id, product_name, price, shop_id, amount FROM products");
    const productTable = createProductTable(result.rows);
    res.render("users", { title: "Users page", products_table: productTable });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Database query error");
  }
});

// POST request to handle CRUD operations
router.post("/", async (req, res) => {
  const { id, product, price, shop_id, amount, btn } = req.body;

  try {
    if (btn === "Add") {
      if (!product || !price || !shop_id || !amount) {
        return res.status(400).send("All fields are required!");
      }
      await pool.query(
        "INSERT INTO products (product_name, price, shop_id, amount) VALUES ($1, $2, $3, $4)",
        [product, price, shop_id, amount]
      );
    } else if (btn === "Update") {
      if (!id || !product || !price || !shop_id || !amount) {
        return res.status(400).send("All fields must be filled when updating!");
      }
      await pool.query(
        "UPDATE products SET product_name = $1, price = $2, shop_id = $3, amount = $4 WHERE id = $5",
        [product, price, shop_id, amount, id]
      );
    } else if (btn === "Delete") {
      if (!id) {
        return res.status(400).send("Product ID is required for deletion!");
      }
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
    }
    res.redirect("/users");
  } catch (err) {
    console.error(`Error during ${btn.toLowerCase()} operation:`, err);
    res.status(500).send(`Error during ${btn.toLowerCase()} operation`);
  }
});

module.exports = router;
