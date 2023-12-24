import express, { Express } from "express";
import dotenv from "dotenv";
import clientRoutes from "./routes/client/index.route";
import moment from "moment";
dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 9100;

// body-parser instead
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Template enginge
app.set("views", "./views");
app.set("view engine", "pug");

// App local variables
app.locals.moment = moment;

// Routes
clientRoutes(app);

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})