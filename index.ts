import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import Tour from "./models/tour.model";
dotenv.config();

sequelize;

const app: Express = express();
const port: string | number = process.env.PORT || 9100;

// template enginge
app.set("views", "./views");
app.set("view engine", "pug");

app.use("/", async (req, res) => {
    const tours = await Tour.findAll({ raw: true });

    res.render("client/pages/tours/index", {
        pageTitle: "Tour List",
        tours: tours
    });
});

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})