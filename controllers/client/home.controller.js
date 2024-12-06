const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productsFeatured = await Product
    .find({
      deleted: false,
      status: "active",
      featured: "1"
    })
    .sort({
      position: "desc"
    })
    .limit(6);
  for (const item of productsFeatured) {
    item.priceNew = (1 - item.discountPercentage/100) * item.price;
    item.priceNew = item.priceNew.toFixed(0);
  }
  // Sản phẩm mới
  const productsNew = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    })
    .limit(6);
  for (const item of productsNew) {
    item.priceNew = (1 - item.discountPercentage/100) * item.price;
    item.priceNew = item.priceNew.toFixed(0);
  }
  // Sản phẩm giảm giá nhiều
  const productsDiscount = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      discountPercentage: "desc"
    })
    .limit(6);
  for (const item of productsDiscount) {
    item.priceNew = (1 - item.discountPercentage/100) * item.price;
    item.priceNew = item.priceNew.toFixed(0);
  }
  // Lấy ra các sản phẩm cụ thể (theo id)
  const productsChoose = await Product
    .find({
      _id: {
        $in: [
          "674f37f3de2b0c490a13be85",
          "674f37f3de2b0c490a13be86"
        ]
      },
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    });
  for (const item of productsChoose) {
    item.priceNew = (1 - item.discountPercentage/100) * item.price;
    item.priceNew = item.priceNew.toFixed(0);
  }
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: productsFeatured,
    productsNew: productsNew,
    productsDiscount: productsDiscount,
    productsChoose: productsChoose
  });
}