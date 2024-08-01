import express from "express";
import accountRoute from "./account/index.js";
import profileRoute from "./profile/index.js";
import Middleware from "../middlewares/middleware.js";
import catchAsync from "../helpers/catchAsync.js";

const globalRoute = express.Router()

// globalRoute.use(catchAsync(Middleware.validateParams))

globalRoute.use("/account", accountRoute)
globalRoute.use("/profile", profileRoute)

export default globalRoute