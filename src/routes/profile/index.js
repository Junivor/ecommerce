import express from "express";
import catchAsync from "../../helpers/catchAsync.js";
import ProfileController from "../../controllers/profile.controller.js";
import Middleware from "../../middlewares/middleware.js";

const profileRoute = express.Router()



profileRoute.get("/:profile_name", catchAsync(Middleware.readCache("profile")), catchAsync(ProfileController.findOne))
profileRoute.post("", catchAsync(ProfileController.create))
profileRoute.post("/delete", catchAsync(ProfileController.remove))
profileRoute.post("/update", catchAsync(ProfileController.update))

export default profileRoute