import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 9100;

app.use("/", async (req, res) => {
    res.send("This is tour site!");
});

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})