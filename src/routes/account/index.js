import express from "express";
import AccountController from "../../controllers/account.controller.js";
import catchAsync from "../../helpers/catchAsync.js";
import Middleware from "../../middlewares/middleware.js";

const accountRoute = express.Router()


accountRoute.get("/:username", catchAsync(Middleware.readCache("account")), catchAsync(AccountController.findOne))
accountRoute.post("", catchAsync(AccountController.create))
accountRoute.post("/delete", catchAsync(AccountController.remove))
accountRoute.post("/update", catchAsync(AccountController.update))

export default accountRoute