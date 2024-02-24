import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//auth
const yourUsername = "OnceIcecreamOnly";
const yourPassword = "asljdfsalnkfjdsakjs";
const yourAPIKey = "bc674c38-ffb2-4eb4-b4eb-e2ef9ac50056";
const yourBearerToken = "0b28fec1-e3f7-499a-bf7b-76760097e957";

//middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  // base route
  res.render("index.ejs", { secret: "intro", user: yourUsername });
});

app.get("/get-secret", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random/");
    console.log(response.data);

    res.render("index.ejs", {
      secret: response.data.secret,
      user: response.data.username,
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { secret: error.message, user: yourUsername });
  }
});

//server on port 3000
app.listen(port, () => {
  console.log(`Started running port at`, port);
});
