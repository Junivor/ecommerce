import express from "express";
import AccountController from "../../controllers/account.controller.js";
import catchAsync from "../../helpers/catchAsync.js";
import Middleware from "../../middlewares/middleware.js";
import AuthService from "../../services/auth.service.js";

const accountRoute = express.Router()

accountRoute.use(catchAsync(AuthService.checkAuth))
accountRoute.get("/me", catchAsync(AccountController.getMe))


accountRoute.get("/:username", catchAsync(Middleware.readCache("account")), catchAsync(AccountController.findOne))
accountRoute.post("", catchAsync(AccountController.create))
accountRoute.post("/delete", catchAsync(AccountController.remove))
accountRoute.post("/update", catchAsync(AccountController.update))

export default accountRoute