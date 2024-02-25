import express, { Router } from "express";
import axios from "axios";
const router = express.Router();

const API_URL = "https://secrets-api.appbrewery.com";
const yourUsername = "OnceIcecreamOnly";
const yourPassword = "asljdfsalnkfjdsakjs";
const yourAPIKey = "bc674c38-ffb2-4eb4-b4eb-e2ef9ac50056";
const yourBearerToken = "0b28fec1-e3f7-499a-bf7b-76760097e957";
const config = {
  headers: {
    Authorization: `Bearer ${yourBearerToken}`,
  },
};

//base route
router.get("/", (req, res) => {
  res.render("authIndex.ejs", { content: "API Response." });
});

// get random secret without authentication.
router.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random");
    //result is an array of secret objects
    const result = [response.data];
    res.render("authIndex.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("authIndex.ejs", {
      error: error.message,
    });
  }
});

//route to get first page of secrets. basic username:password authentication
router.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/all?page=1", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    // response is already in list format. traversed in authIndex view
    const result = response.data;
    return res.render("authIndex.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("authIndex.ejs", {
      error: error.message,
    });
  }
});

//route to get secrets filtered by minimum embarassment score. apiKey authentication
router.get("/apiKey", async (req, res) => {
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
router.get("/bearerToken", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/secrets/42", {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    });
    res.render("authIndex.ejs", { content: [response.data] });
  } catch (err) {
    console.log("error: ", err.message);
    res.render("authIndex.ejs", { error: err.message });
  }
});

//route to get random secret from api. renders index.ejs
router.get("/get-random", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random/");
    res.render("index.ejs", {
      secret: response.data.secret,
      user: response.data.username,
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { secret: error.message, user: yourUsername });
  }
});

// module.exports = router;
export default router;
