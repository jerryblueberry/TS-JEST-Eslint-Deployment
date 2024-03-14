import express, { Express } from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import "dotenv/config";
// import cron from "node-cron";
import User from "./routes/userRoutes";
import Event from "./routes/eventRoutes";
import Register from "./routes/registerRoute";

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    secret: "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  }),
);

app.use("/files", express.static(path.join(__dirname, "../files")));

// routes
app.use("/user", User);
app.use("/event", Event);
app.use("/register", Register);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
