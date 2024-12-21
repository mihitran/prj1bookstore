// const mongoose = require("mongoose");
// const slug = require("mongoose-slug-updater");
// mongoose.plugin(slug);
// const productSchema = new mongoose.Schema({
//   title: String,
//   slug: {
//     type: String,
//     slug: "title",
//     unique: true
//   },
//   category_id: String,
//   description: String,
//   price: Number,
//   discountPercentage: Number,
//   stock: Number,
//   thumbnail: String,
//   status: String,
//   position: Number,
//   featured: {
//     type: String,
//     default: "0"
//   },
//   deleted: {
//     type: Boolean,
//     default: false
//   }
// });
// const Product = mongoose.model('Product', productSchema, 'products');
// module.exports = Product;
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  category_id: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  featured: {
    type: String,
    default: "0"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  authors: {
    type: [String], // Mảng các tên tác giả (có thể chứa nhiều tên tác giả)
    default: [] // Mặc định là mảng rỗng
  }
});

const Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;
