const MusicPost = require("../models/models");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const post = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }
  if (!req.file) {
    const err = new Error("Musik harus diupload");
    err.errorStatus = 422;
    throw err;
  }
  let result = {
    musik: req.file.path,
    judul: req.body.judul,
    penyanyi: req.body.penyanyi,
  };
  const posting = new MusicPost(result);
  posting
    .save() //untuk save ke database
    .then((respond) => {
      res.status(200).json({
        message: "Musik berhasil diupload",
        data: respond,
      });
    })
    .catch((err) => console.log(err));
};

// get all data music
const datas = (req, res) => {
  MusicPost.find().then((respon) => {
    res.status(200).json({
      message: "Musik berhasil get",
      data: respon,
    });
  });
};

//get by id
const music = (req, res) => {
  const musicId = req.params.getId;
  MusicPost.findById(musicId).then((respon) => {
    res.status(200).json({
      message: "Musik berhasil dipanggil",
      data: respon,
    });
  });
};

const edit = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }
  if (!req.file) {
    const err = new Error("Musik harus diupload");
    err.errorStatus = 422;
    throw err;
  }
  let result = {
    musik: req.file.path,
    judul: req.body.judul,
    penyanyi: req.body.penyanyi,
  };

  const musicId = req.params.getId;

  MusicPost.findById(musicId)
    .then((respon) => {
      if (!respon) {
        const err = new Error("Musik tidak ditemukan");
        err.status(422);
        throw err;
      }

      respon.judul = result.judul;
      respon.musik = result.musik;
      respon.penyanyi = result.penyanyi;

      return respon.save();
    })
    .then((respon) => {
      res.status(201).json({
        message: "Musik berhasil update",
        data: respon,
      });
    })
    .catch((err) => next(err));
};

const del = (req, res, next) => {
  const musicId = req.params.getId;
  MusicPost.findById(musicId)
    .then((respon) => {
      if (!respon) {
        const err = new Error("Invalid value");
        err.errorStatus = 422;
        throw err;
      }
      hapusMusik(respon.music);
      return MusicPost.findByIdAndRemove(musicId);
    })
    .then((respon) => {
      res.status(202).json({
        message: "Musik berhasil dihapus",
        data: respon,
      });
    })
    .catch((err) => next(err));
};

const hapusMusik = (filePath) => {
  filePath = path.join(__dirname + "../.." + filePath);
  fs.unlink(filePath, (err) => console.error(err));
};
module.exports = { post, datas, music, edit, del };
