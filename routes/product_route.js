const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product_controller");

router.route("/")
  .get(product_controller.fetchAll)
  .post(product_controller.create);

router.route("/:userId")
  .get(product_controller.fetchByUser)

router.route("/category/:categoryId")
  .get(product_controller.fetchByCategory)

router.route("/detail/:productId")
  .get(product_controller.fetchById)

router.route("/:id")
  .put(product_controller.update)
  .delete(product_controller.remove);

module.exports = router;
