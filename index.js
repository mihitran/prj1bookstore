const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/BookStore');
const express = require("express");
const app = express();
const port = 3000;
const routeClient = require("./routers/client/index.router");
app.set('views', './views'); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug
app.use(express.static('public')); // Thiết lập thư mục chứa file tĩnh
routeClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});