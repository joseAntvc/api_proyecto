const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/category_controller");

router.route("/")
  .get(category_controller.fetchAll);

router.route("/count")
  .get(category_controller.countProducts);

module.exports = router;
