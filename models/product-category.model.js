const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  parent_id: String,
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false
  }
});

// Thêm chỉ mục trên các trường status, deleted và position
productCategorySchema.index({ status: 1, deleted: 1 }); // Chỉ mục cho việc lọc theo status và deleted
productCategorySchema.index({ position: -1 }); // Chỉ mục cho việc sắp xếp theo position

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-category');
module.exports = ProductCategory;