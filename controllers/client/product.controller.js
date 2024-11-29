const Product = require("../../models/product.model")

module.exports.index = async(req, res) => {
    // console.log(req.query.category);
    
    let find = {}

    if(req.query.category){
        find.category = req.query.category;
    }

    let keyword = "";

    if(req.query.keyword){
        keyword = req.query.keyword;

        const regax = new RegExp(keyword, "i");
        find.title = regax;
    }

    const products = await Product.find(find);

    // console.log(products);

    res.render("client/pages/product/index.pug", {
        pageTitle:"Danh sách sản phẩm",
        products: products,
        keyword: keyword
    });
};