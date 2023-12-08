const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("usernmae", "Name can't be empty!").notEmpty(),
    check("password", "Password should be more than 4 simbol!").isLength({
      min: 4,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", controller.getUsers);

module.exports = router;
