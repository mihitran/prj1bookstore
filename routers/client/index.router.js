const homeRoute = require("./home.router");
const productRoute = require("./product.router");
const cartRoute = require("./cart.router");
const orderRoute = require("./order.router");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
  
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cart);
  // app.use(cartMiddleware.cartId);

  app.use("/", homeRoute);

  app.use("/products", productRoute);
  app.use("/cart", cartRoute);
  app.use("/order", orderRoute);
}