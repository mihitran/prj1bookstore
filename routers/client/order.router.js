const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
// Route cho trang "Mua ngay"
router.post("/now/:productId", controller.orderNow);
router.get("/", controller.index);
router.post("/", controller.orderPost);
router.get("/success/:id", controller.success);
module.exports = router;