import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const API_URL = "https://secrets-api.appbrewery.com";
const router = express.Router();
const yourBearerToken = "0b28fec1-e3f7-499a-bf7b-76760097e957";
const config = {
  headers: {
    Authorization: `Bearer ${yourBearerToken}`,
  },
};

//middleware
router.use(bodyParser.urlencoded({ extended: true }));

//routes
router.get("/", (req, res) => {
  res.render("crudIndex.ejs", { content: "Waiting for data..." });
});

router.get("/get-secret/:id", async (req, res) => {
  const searchId = req.params.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("crudIndex.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("crudIndex.ejs", { content: error.message });
  }
});

router.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("crudIndex.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("crudIndex.ejs", {
      content: error.message,
    });
  }
});

router.post("/post-secret", async (req, res) => {
  try {
    const response = await axios.post(
      API_URL + "/secrets",
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config
    );
    res.render("crudIndex.ejs", { content: "Waiting for data..." });
  } catch (error) {
    console.log("error: ", error.message);
    res.render("crudIndex.ejs", { error: error.message });
  }
});

router.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const action = await axios.put(
      API_URL + `/secrets/${searchId}`,
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config
    );
    return res.redirect(`/crud/get-secret/${searchId}`);
  } catch (err) {
    console.log("error: ", err.message);
    res.render("crudIndex.ejs", { error: err.message });
  }
});

router.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const action = await axios.patch(
      API_URL + `/secrets/${searchId}`,
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config
    );
    return res.redirect(`/crud/get-secret/${searchId}`);
  } catch (error) {
    console.log("error: ", error.message);
    return res.render("crudIndex.ejs", error.message);
  }
});

router.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const action = await axios.delete(API_URL + `/secrets/${searchId}`, config);
    res.render("crudIndex.ejs", { content: "Waiting for data..." });
  } catch (err) {
    console.log(err.message);
    res.render("crudIndex.ejs", { content: err.message });
  }
});

// module.exports = router;
export default router;
