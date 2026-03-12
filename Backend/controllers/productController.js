const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, status } = req.body;
  const price = Math.round(Number(req.body.price));

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const images = req.files ? req.files.map((file) => file.path) : [];


  const product = await Product.create({
    brand: req.user.userId,
    name,
    description,
    price,
    category,
    status: status || "draft",
    images,
  });
  res.status(201).json({ message: "product created", product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product.brand.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden: Not your product" });
  }
  const { name, description, price, category, status } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = Math.round(Number(price));
  if (category) product.category = category;
  if (status) product.status = status;

  if (req.files && req.files.length > 0)
    product.images = req.files.map((file) => file.path);

  await product.save();

  res.status(200).json({ message: "Product updated", product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.isDeleted)
    return res.status(404).json({ message: "Product not found" });

  if (product.brand.toString() !== req.user.userId)
    return res.status(403).json({ message: "Forbidden: Not your product" });

  product.isDeleted = true;
  product.status = "archived";
  await product.save();

  res.status(200).json({ message: "Product deleted successfully" });
});

// ── GET MARKETPLACE (Customer) ──
const getMarketplace = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;

  const filter = {
    isDeleted: false,
    status: "published",
  };

  if (search) filter.name = { $regex: search, $options: "i" };

  if (category && category !== "All Categories") filter.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    products,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  });
});

// ── GET SINGLE PRODUCT ──
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("brand", "name email");

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ product });
});

// ── GET MY PRODUCTS (Brand) ──
const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    brand: req.user.userId,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.status(200).json({ products });
});

// ── GET DASHBOARD STATS (Brand) ──
const getDashboardStats = asyncHandler(async (req, res) => {
  const brandId = req.user.userId;

  const [total, published, archived] = await Promise.all([
    Product.countDocuments({ brand: brandId, isDeleted: false }),
    Product.countDocuments({
      brand: brandId,
      isDeleted: false,
      status: "published",
    }),
    Product.countDocuments({
      brand: brandId,
      isDeleted: true,
      status: "archived",
    }),
  ]);

  res.status(200).json({ total, published, archived });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getMarketplace,
  getProductById,
  getMyProducts,
  getDashboardStats,
};
