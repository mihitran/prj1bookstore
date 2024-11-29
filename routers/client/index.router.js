const homeRouters = require("./home.router");
const productRouters = require("./product.router");

module.exports = (app) => {
    app.use("/", homeRouters);

    app.use("/product", productRouters);
}