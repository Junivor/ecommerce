import express from "express";
import accountRoute from "./account/index.js";

const globalRoute = express.Router()

globalRoute.use("/account", accountRoute)

export default globalRoute