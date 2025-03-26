const {Router} = require("express");
const { createAddress } = require("../controllers/adress.controller");
const verifyToken = require("../middlewares/token");

const addressRouter = Router();


addressRouter.post("/create",verifyToken,createAddress);


module.exports = addressRouter;