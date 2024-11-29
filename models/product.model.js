const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        description: String,
        category: String,
        price: Number,
        discountPercentage: Number,
        rating: Number,
        stock: Number,
        brand: String,
        thumbnail: String
    }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;