import express from "express";
import AccountController from "../../controllers/account.controller.js";
import catchAsync from "../../helpers/catchAsync.js";

const accountRoute = express.Router()

accountRoute.get("/all", catchAsync(AccountController.find))
accountRoute.get("", catchAsync(AccountController.findByEmail))
accountRoute.post("", catchAsync(AccountController.create))

export default accountRoute