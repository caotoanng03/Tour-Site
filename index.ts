import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

dotenv.config();

database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 9100;

// template enginge
app.set("views", "./views");
app.set("view engine", "pug");

app.use("/", async (req, res) => {
    res.render("client/pages/tours/index");
});

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})