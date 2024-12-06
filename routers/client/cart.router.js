const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
router.get("/", controller.index);
router.post("/add/:id", controller.addPost);
router.get("/delete/:id", controller.delete);
router.patch("/update", controller.updatePatch);
module.exports = router;