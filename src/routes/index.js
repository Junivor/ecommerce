import express from "express";
import accountRoute from "./account/index.js";
import profileRoute from "./profile/index.js";
import accessRoute from "./access/index.js";

const globalRoute = express.Router()



globalRoute.use("/auth", accessRoute)
globalRoute.use("/account", accountRoute)
globalRoute.use("/profile", profileRoute)

export default globalRoute