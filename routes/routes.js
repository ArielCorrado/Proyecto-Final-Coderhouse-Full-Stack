const express = require('express');
const router = express.Router();
const compression = require("compression");
const upload = require("../config/multer");
const passport = require("passport");
const controller = require("../controller/controller")

router.post("/login", passport.authenticate("login"), controller.login);
router.post("/signup", passport.authenticate("signup"), controller.signup);
router.get("/islogged", controller.islogged);
router.get("/logout", controller.loguot);
router.post("/upload", upload.single("file"), controller.upload);
router.post("/db", controller.db)
router.get("/info", compression(), controller.info);
router.get("/config", controller.config);
router.get("/randoms", controller.randoms);


module.exports = router;