const Cart = require("../../models/cart.model");
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