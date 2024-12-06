
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  let total = 0;
  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
      deleted: false,
      status: "active"
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.priceNew = infoItem.price;
    if(infoItem.discountPercentage > 0) {
      item.priceNew = (1 - infoItem.discountPercentage/100) * infoItem.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
  }
  res.render("client/pages/order/index", {
    pageTitle: "Đặt hàng",
    products: products,
    total: total
  });
};
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const order = req.body;
  const dataOrder = {
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    products: []
  };
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });
    const product = {
      productId: item.productId,
      price: infoItem.price,
      discountPercentage: infoItem.discountPercentage,
      quantity: item.quantity
    };
    dataOrder.products.push(product);
  }
  const newOrder = new Order(dataOrder);
  await newOrder.save();
  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });
  res.redirect(`/order/success/${newOrder.id}`);
}
