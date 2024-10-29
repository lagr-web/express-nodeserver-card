// app.js

import express from "express";
import { PORT } from "./config.js";
import routes from "./router_enemies.js";
import mongoose from "./db.js";
import cors from "cors";
import crypto from "crypto"
import cookieSession from "cookie-session";


const app = express();

const allowedOrigins = true;//["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, //Enable credentials (cookies, authorization headers) crossorigin
    optionsSuccessStatus: 204
  })
);

const key = crypto.randomBytes(32).toString('base64');


app.set('trust proxy', 1) 

app.use(cookieSession({
    name: 'session',
    keys: [key], // Skift denne nøgle til noget sikkert
    maxAge: 24 * 60 * 60 * 1000 // Session udløber efter 24 timer
  })); 

app.use("/", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server Listening and is ready on PORT:", port);
});
