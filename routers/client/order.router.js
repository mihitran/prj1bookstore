const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
router.get("/", controller.index);
router.post("/", controller.orderPost);
module.exports = router;