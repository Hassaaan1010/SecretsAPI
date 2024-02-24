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

app.get("/", (req, res) => {
  res.render("authIndex.ejs", { content: "API Response." });
});

// get random secret without authentication.
app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random");
    //result is an array of secret objects
    const result = [response.data];
    console.log(result);
    console.log("type: ", typeof result);
    res.render("authIndex.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("authIndex.ejs", {
      error: error.message,
    });
  }
});

//route to get first page of secrets. basic username:password authentication
app.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/all?page=1", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    // response is already in list format. traversed in authIndex view
    const result = response.data;
    console.log(result[0]);
    console.log(typeof result);
    return res.render("authIndex.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("authIndex.ejs", {
      error: error.message,
    });
    console.log(0);
  } finally {
    console.log(2);
  }
});

//route to get secrets filtered by minimum embarassment score. apiKey authentication
app.get("/apiKey", async (req, res) => {
  try {
    const custom = await axios.get(API_URL + `/filter?`, {
      params: {
        score: 5,
        apiKey: yourAPIKey,
      },
    });
    res.render("authIndex.ejs", { content: custom.data });
  } catch (error) {
    console.log("error found: ", error.message);
    res.render("authIndex.ejs", { error: error.message });
  }
});

//route to get secret by ID. token authorization.
app.get("/bearerToken", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/secrets/42", {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    });
    console.log(response);
    console.log(response.data);
    res.render("authIndex.ejs", { content: [response.data] });
  } catch (err) {
    console.log("error: ", err.message);
    res.render("authIndex.ejs", { error: err.message });
  }
});

//route to get random secret from api. renders index.ejs
app.get("/get-random", async (req, res) => {
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
