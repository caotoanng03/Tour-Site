import express, { Express } from "express";
import dotenv from "dotenv";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import moment from "moment";
import { systemConfig } from "./config/system";
import path from "path";
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

// TinyMCE
app.use("/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App local variables
app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
    console.log(`app listenging on port ${port}`);
})