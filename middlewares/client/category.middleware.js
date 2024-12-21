const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
module.exports.category = async (req, res, next) => {
  console.log("chay vao day");
  const categoryProduct = await ProductCategory.find({
    deleted: false,
    status: "active"
  });
  const allCategory = createTreeHelper.getAllCategory(categoryProduct);
  res.locals.allCategory = allCategory;
  next();
}