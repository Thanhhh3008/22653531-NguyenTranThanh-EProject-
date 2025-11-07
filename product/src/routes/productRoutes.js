const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

// router.post("/", isAuthenticated, productController.createProduct);
// router.post("/buy", isAuthenticated, productController.createOrder);
// router.get("/", isAuthenticated, productController.getProducts);
// router.get('/:id', productController.getProductById);
if (process.env.NODE_ENV === "test") {
  router.post("/", productController.createProduct);
  router.post("/buy", productController.createOrder);
  router.get("/", productController.getProducts);
} else {
  router.post("/", isAuthenticated, productController.createProduct);
  router.post("/buy", isAuthenticated, productController.createOrder);
  router.get("/", isAuthenticated, productController.getProducts);
}

router.get('/:id', productController.getProductById);

module.exports = router;
