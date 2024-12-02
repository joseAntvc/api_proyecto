const express = require("express");
const router = express.Router();
const coupon_controller = require("../controllers/coupon_controller");

router.route("/")
  .post(coupon_controller.fecthFindCode);
module.exports = router;