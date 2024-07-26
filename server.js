import 'dotenv/config'
import app from "./src/app.js";

app.listen(process.env.APP_PORT, () => console.log(`ecommerce started with port ${process.env.APP_PORT}`))






