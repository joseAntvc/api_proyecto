const express = require("express");
const router = express.Router();
const cart_controller = require("../controllers/cart_controller");

router.route("/:userId")
  .get(cart_controller.fetchCart)

module.exports = router;
