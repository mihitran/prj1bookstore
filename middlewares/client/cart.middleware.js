// try {
//   const Cart = require("../../models/cart.model");
//   module.exports.cart = async (req, res, next) => {
//   if(!req.cookies.cartId) {
//     const expiresDay = 365 * 24 * 60 * 60 * 1000;
//     const cart = new Cart({
//       expireAt: Date.now() + expiresDay
//     });
//     await cart.save();
//     res.cookie("cartId", cart.id, {
//       expires: new Date(Date.now() + expiresDay)
//     });
//     res.locals.miniCart = 0;
//   } else {
//     const cart = await Cart.findOne({
//       _id: req.cookies.cartId
//     });
//     res.locals.miniCart = cart.products.length;
//   }
//   next();
// }
// } catch (error) {
//   console.error("Error in cart middleware:", error);
//   res.locals.miniCart = 0;
//   next();
// }

const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      // Nếu không có cartId trong cookie, tạo mới giỏ hàng
      const expiresDay = 365 * 24 * 60 * 60 * 1000;
      const cart = new Cart({
        expireAt: Date.now() + expiresDay
      });
      await cart.save();
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresDay)
      });
      res.locals.miniCart = 0;
    } else {
      const cart = await Cart.findOne({ _id: req.cookies.cartId });
      
      // Kiểm tra nếu cart là null, tạo giỏ hàng mới
      if (!cart) {
        const expiresDay = 365 * 24 * 60 * 60 * 1000;
        const newCart = new Cart({
          expireAt: Date.now() + expiresDay
        });
        await newCart.save();
        res.cookie("cartId", newCart.id, {
          expires: new Date(Date.now() + expiresDay)
        });
        res.locals.miniCart = 0;
      } else {
        res.locals.miniCart = cart.products.length;
      }
    }
    next();
  } catch (error) {
    console.error("Error in cart middleware:", error);
    res.locals.miniCart = 0;
    next();
  }
};
