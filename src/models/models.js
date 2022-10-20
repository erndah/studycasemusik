const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicPost = new Schema(
  {
    musik: {
      type: String,
      required: true,
    },
    judul: {
      type: String,
      required: true,
    },
    penyanyi: {
      type: String,
      required: true,
    },
  },
  {
    timetamps: true,
  }
);

module.exports = mongoose.model("music", MusicPost);
