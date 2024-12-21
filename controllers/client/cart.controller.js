const Cart = require("../../models/cart.model");
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
    console.log(infoItem);
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
  res.render("client/pages/cart/index", {
  pageTitle: "Giỏ hàng",
  products: products,
  total: total
});
};
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  console.log(cart);
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
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.id;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products.filter(item => item.productId != productId);
  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });
  res.redirect("back");
}
module.exports.updatePatch = async (req, res) => {
  const cartId = req.cookies.cartId;
  const product = req.body;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  const productUpdate = products.find(item => item.productId == product.productId);
  productUpdate.quantity = parseInt(product.quantity);
  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });
  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  });
}



// const Cart = require("../../models/cart.model");
// module.exports.addPost = async (req, res) => {
//   const productId  = req.params.id;
//   const quantity = req.body.quantity;
//   const cartId = req.cookies.cartId;

//   console.log(productId);
//   console.log(quantity);
//   console.log(cartId);

//   const objectCart = {
//     productId: productId,
//     quantity: quantity
//   }

//   await Cart.updateOne(
//     {
//       _id: cartId
//     },
//     {
//       $push: { products: objectCart }
//     }
//   );

//   console.log(objectCart);

//   res.send("OK");
// }