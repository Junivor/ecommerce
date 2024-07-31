import express from "express";
import catchAsync from "../../helpers/catchAsync.js";
import ProfileController from "../../controllers/profile.controller.js";

const profileRoute = express.Router()

profileRoute.get("/:profile_name", catchAsync(ProfileController.findOne))
profileRoute.post("", catchAsync(ProfileController.create))
profileRoute.post("/delete", catchAsync(ProfileController.remove))
profileRoute.post("/update", catchAsync(ProfileController.update))

export default profileRoute