import express from "express";
import catchAsync from "../../helpers/catchAsync.js";
import AccessController from "../../controllers/access.controller.js";
import AuthService from "../../services/auth.service.js";

const accessRoute = express.Router()



accessRoute.post("/register", catchAsync(AccessController.register))
accessRoute.post("/verify/:otp", catchAsync(AccessController.verify))
accessRoute.post("/login", catchAsync(AccessController.login))

accessRoute.post("/forgot-password", catchAsync(AccessController.forgotPassword))
accessRoute.post("/reset-password", catchAsync(AccessController.resetPassword))

accessRoute.use(catchAsync(AuthService.checkAuth))

accessRoute.post("/logout", catchAsync(AccessController.logout))
accessRoute.post("/refresh", catchAsync(AccessController.refresh))

export default accessRoute