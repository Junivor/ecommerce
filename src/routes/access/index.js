import express from "express";
import catchAsync from "../../helpers/catchAsync.js";
import AccessController from "../../controllers/access.controller.js";

const accessRoute = express.Router()



accessRoute.post("/register", catchAsync(AccessController.register))
accessRoute.post("/verify/:otp", catchAsync(AccessController.verify))
accessRoute.post("/login", catchAsync())
accessRoute.post("/logout", catchAsync())
accessRoute.post("/refresh", catchAsync())

export default accessRoute