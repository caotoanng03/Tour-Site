import express, { Express } from "express";
import dotenv from "dotenv";
import clientRoutes from "./routes/client/index.route";
dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 9100;

// Static files
app.use(express.static("public"));

// Template enginge
app.set("views", "./views");
app.set("view engine", "pug");

// Routes
clientRoutes(app);

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})