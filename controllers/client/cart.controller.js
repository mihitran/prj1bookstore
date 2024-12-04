const Cart = require("../../models/cart.model");
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  const existProduct = products.find(item => item.productId == req.params.id);
  if(existProduct) {
    existProduct.quantity = existProduct.quantity + parseInt(req.body.quantity);
  } else {
    const product = {
      productId: req.params.id,
      quantity: parseInt(req.body.quantity)
    };
  
    products.push(product);
  }
  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });
  res.redirect("back");
}