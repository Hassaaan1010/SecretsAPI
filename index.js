import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import crudRoutes from "./routes/crud.js";

const app = express();
const port = 8000;

//middleware
morgan.token("customDate", () => {
  const currentDate = new Date().toISOString();
  return currentDate;
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :customDate"
  )
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// routing
app.use("/auth", authRoutes); // Use authRoutes for '/'
app.use("/crud", crudRoutes); // Use crudRoutes for '/crud'

//base route (empty)
app.get("/", (req, res) => {
  res.redirect("/crud");
});

//server on port 8000
app.listen(port, () => {
  console.log(`Started running port at`, port);
});
