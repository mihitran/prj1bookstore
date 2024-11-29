const Product = require("../../models/product.model")

module.exports.index = async(req, res) => {
    const products = await Product.find({});

    console.log(products);

    res.render("client/pages/home/index.pug", {
        pageTitle:"Trang chủ",
        products: products
    });
};