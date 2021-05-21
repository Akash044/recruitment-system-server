const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const firebase = require("firebase");
require("dotenv").config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
// Initialize Firebase
const db = firebase.initializeApp(firebaseConfig).firestore();

app.get("/", (req, res) => {
  res.send("server is working");
});

const employerCollection = db.collection(process.env.db1);
const postCollection = db.collection(process.env.db2);
const applicantCollection = db.collection(process.env.db3);  


app.post("/addEmployer", (req, res) => {
  const email = req.body.employerEmail;

  employerCollection
    .add({
      email: email,
    })
    .then((result) => {
      res.send(result);
    });
});


app.get("/isEmployer", async (req, res) => {
  const email = req.query.email;
  const arr = [];

  await employerCollection.get()
  .then((result) => {
    result.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });
    const matched = arr.filter((data) => data.email === email);
    res.send(matched.length > 0);
  });
});


app.post("/addPost", (req, res) => {
  const jobInfo = req.body;

  postCollection.add(jobInfo).then((result) => {
    res.send(result);
  });
});


app.get("/allPost", async (req, res) => {
  const email = req.query.email;
  const arr = [];

  email
    ? await postCollection.get().then((result) => {
        result.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        const matched = arr.filter((data) => data.email === email);
        res.send(matched);
      })
    : await postCollection.get().then((result) => {
        result.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        res.send(arr);
      });
});


app.post("/addApplicant", (req, res) => {
  const applicantInfo = req.body;

  applicantCollection.add(applicantInfo)
  .then((result) => {
    res.send(result);
  });
});


app.get("/allApplicants",async (req, res) => {
  const jobId = req.query.jobId;
  const arr = [];

  await applicantCollection.get()
  .then((result) => {
    result.forEach((doc) => {
      arr.push({ ...doc.data(), docId: doc.id });
    });
    const matched = arr.filter((data) => data.id === jobId);
    res.send(matched);
  });
});


app.get("/appliedPosts",async (req, res) => {
  const email = req.query.email;
  const arr = [];

  await applicantCollection.get()
  .then((result) => {
    result.forEach((doc) => {
      arr.push({ ...doc.data(), docId: doc.id });
    });
    const matched = arr.filter((data) => data.email === email);
    res.send(matched);
  });
});

app.listen(process.env.PORT || 8080);
