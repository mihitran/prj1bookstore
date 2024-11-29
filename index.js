const express = require("express");
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/BookStore');

const router =  require("./routers/client/index.router.js");

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

//Routers
router(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});