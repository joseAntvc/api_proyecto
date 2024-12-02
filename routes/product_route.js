const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product_controller");
const s3Controller = require('../controllers/s3_controller');

router.route("/")
  .get(product_controller.fetchAll)
  .post(s3Controller.upload.single('image'), product_controller.create);

router.route("/user/:userId")
  .get(product_controller.fetchByUser)

router.route("/category/:categoryId")
  .get(product_controller.fetchByCategory)

router.route("/detail/:productId")
  .get(product_controller.fetchById)

router.route("/update/:id")
  .put(s3Controller.upload.single('image'), product_controller.update);

router.route("/delete/:id")
  .delete(product_controller.remove);

router.route('/search')
  .get(product_controller.fetchByName);

router.route("/category/:categoryId/search")
  .get(product_controller.fetchByName);


module.exports = router;
