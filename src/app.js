import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import globalRoute from "./routes/index.js";


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use("/api/v1", globalRoute)

app.use((req, res, next) => {
    const error = new Error()
    error.message = `Not found path ${req.path}`
    error.statusCode = 404
    return next(error)
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    const stack = err.stack
    const service = err.service
    return res.status(statusCode).json({
        service, message, stack
    })
})

export default app;
