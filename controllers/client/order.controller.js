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

  // Kiểm tra xem có sản phẩm từ "Mua ngay" không
  if (req.body.productId && req.body.quantity) {
    const product = await Product.findOne({
      _id: req.body.productId
    });

    if (product) {
      const quantity = parseInt(req.body.quantity, 10); // Số lượng
      const finalPrice = parseFloat(product.priceNew) || product.price; // Giá mới nếu có, nếu không có thì dùng giá gốc
      const total = finalPrice * quantity; // Thành tiền (giá mới x số lượng)

      // Thêm sản phẩm vào đơn hàng
      const productOrder = {
        productId: product._id,
        price: finalPrice, // Giá mới
        discountPercentage: product.discountPercentage || 0, // Phần trăm giảm giá
        quantity: quantity, // Số lượng
        finalPrice: finalPrice, // Giá sau giảm (nếu có)
        total: total // Thành tiền
      };

      dataOrder.products.push(productOrder); // Thêm sản phẩm từ "Mua ngay"
    }
  } else {
    // Nếu không có sản phẩm từ "Mua ngay", lấy sản phẩm từ giỏ hàng
    const cart = await Cart.findOne({
      _id: cartId
    });

    if (cart && cart.products.length > 0) {
      const products = cart.products;
      for (const item of products) {
        const infoItem = await Product.findOne({
          _id: item.productId
        });

        const finalPrice = parseFloat(infoItem.priceNew) || infoItem.price; // Sử dụng giá mới nếu có, nếu không có thì dùng giá gốc
        const total = finalPrice * item.quantity; // Thành tiền (giá mới x số lượng)

        dataOrder.products.push({
          productId: item.productId,
          price: finalPrice, // Giá mới
          discountPercentage: infoItem.discountPercentage || 0, // Phần trăm giảm giá
          quantity: item.quantity, // Số lượng
          finalPrice: finalPrice, // Giá sau giảm (nếu có)
          total: total // Thành tiền
        });
      }
    }
  }

  // Lưu đơn hàng vào cơ sở dữ liệu
  const newOrder = new Order(dataOrder);
  await newOrder.save();

  // Nếu có sản phẩm trong giỏ, xóa giỏ hàng sau khi đặt hàng (chỉ nếu không phải từ "Mua ngay")
  if (!req.body.productId && cartId) {
    await Cart.updateOne({
      _id: cartId
    }, {
      products: []
    });
  }

  res.redirect(`/order/success/${newOrder.id}`);
};




module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({
    _id: orderId
  });
  let total = 0;
  for (const item of order.products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.priceNew = item.price;
    if(item.discountPercentage > 0) {
      item.priceNew = (1 - item.discountPercentage/100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
  }
  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    total: total
  });
};

module.exports.orderNow = async (req, res) => {
  const productId = req.params.productId; // Lấy productId từ URL
  const quantity = req.body.quantity || 1; // Số lượng mặc định là 1

  const product = await Product.findOne({
    _id: productId,
    deleted: false,
    status: "active"
  });

  if (!product) {
    return res.redirect("/"); // Nếu sản phẩm không tồn tại, chuyển về trang chủ
  }

  // Tính toán giá sau giảm (priceNew) và tổng tiền (total)
  let priceNew = product.price; // Giá gốc
  if (product.discountPercentage > 0) {
    priceNew = (1 - product.discountPercentage / 100) * product.price;
    priceNew = priceNew.toFixed(0); // Làm tròn giá mới
  }

  const total = priceNew * quantity; // Thành tiền (giá mới x số lượng)

  // Render trang order chỉ với 1 sản phẩm, đảm bảo giá và thành tiền được truyền đúng
  res.render("client/pages/order/index", {
    pageTitle: "Đặt hàng",
    products: [{
      productId: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      priceNew: priceNew, // Truyền giá mới sau giảm
      quantity: quantity,
      total: total, // Thành tiền (có thể dùng trong trường hợp cần)
      slug: product.slug
    }],
    total: total, // Tổng tiền cho sản phẩm (tổng thành tiền)
    isBuyNow: true  // Đánh dấu đây là luồng "Mua ngay"
  });
};





