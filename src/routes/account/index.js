import express from "express";
import AccountController from "../../controllers/account.controller.js";
import catchAsync from "../../helpers/catchAsync.js";

const accountRoute = express.Router()

accountRoute.get("/all", catchAsync(AccountController.find))
accountRoute.post("", catchAsync(AccountController.create))
accountRoute.post("/delete", catchAsync(AccountController.remove))
accountRoute.post("/update", catchAsync(AccountController.update))

export default accountRoute