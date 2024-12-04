const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  const products = await Product
  .find({
    status: "active",
    deleted: false
  })
  .sort({
    position: "desc"
  });
  for (const item of products) {
    item.priceNew = item.price*(100 - item.discountPercentage)/100;
    item.priceNew = (item.priceNew).toFixed(0);
  }
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products
  });
}

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({
    slug: slug,
    status: "active",
    deleted: false
  });
  if(product.category_id) {
    const category = await ProductCategory.findOne({
      _id: product.category_id,
      deleted: false,
      status: "active"
    });
    product.category = category;
  }
  product.priceNew = product.price*(100 - product.discountPercentage)/100;
  product.priceNew = (product.priceNew).toFixed(0);
  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product
  });
}

module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  
  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active"
  })
  
  const allCategoryChildren = [];
  const getCategoryChildren = async (parentId) => {
    const childs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });
    for (const child of childs) {
      allCategoryChildren.push(child.id);
      await getCategoryChildren(child.id);
    }
  };
  await getCategoryChildren(category.id);

  const products = await Product.find({
    category_id: { $in: [category.id, ...allCategoryChildren] },
    status: "active",
    deleted: false
  }).sort({ position: "desc" });
  console.log(products);
  for (const product of products) {
    product.priceNew = product.price*(100 - product.discountPercentage)/100;
    product.priceNew = (product.priceNew).toFixed(0);
  }
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products
  });
}

module.exports.search = async (req, res) => {
  const keyword = req.query.keyword;
  let products = [];
  // Tìm kiếm
  if(keyword) {
    const regex = new RegExp(keyword, "i");
    products = await Product
      .find({
        title: regex,
        deleted: false,
        status: "active"
      })
      .sort({ position: "desc" });
    for (const item of products) {
      item.priceNew = (1 - item.discountPercentage/100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
  }
  // Hết Tìm kiếm
  res.render("client/pages/products/search", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword: keyword,
    products: products
  });
}