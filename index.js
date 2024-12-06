const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/BOOKSTORE');
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const routeClient = require("./routers/client/index.router");
app.set('views', './views'); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug
app.use(express.static('public')); // Thiết lập thư mục chứa file tĩnh
app.use(methodOverride('_method'));
routeClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});