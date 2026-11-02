import "./configs/env.js";

import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.static("public"))


import errorHandler from "./middlewares/error.middleware.js";



app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Job Portal API" });
})

export default app