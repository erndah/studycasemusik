const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 4000;
const dataRoutes = require("./routes/routes");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "music");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const cekFileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/ogg" || file.mimetype === "audio/mp3" || file.mimetype === "audio/webm") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(cors());
app.use(bodyParser.json());
app.use("/music", express.static(path.join(__dirname, "../music")));
app.use(multer({ storage: fileStorage, fileFilter: cekFileFilter }).single("musik"));

app.use("/users", dataRoutes);
//utk menangkap error
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data });
});

mongoose
  .connect(`mongodb+srv://erindah:hYNhFNKtZdeaRSQY@cluster0.muezkrp.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(port, () => console.log(`server berjalan di localhost ${port}`));
  })
  .catch((err) => console.error(err));
