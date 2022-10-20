const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { post, datas, music, edit, del } = require("../controllers/controllers");

router.get("/data", datas);
router.post("/post", [body("judul").isLength({ min: 1 }).withMessage("Judul tidak valid"), body("penyanyi").isLength({ min: 1 }).withMessage("Penyanyi tidak valid")], post);
// search by id
router.get("/data/:getId", music);
//update data
router.put("/data/:getId", [body("judul").isLength({ min: 1 }).withMessage("Judul tidak valid"), body("penyanyi").isLength({ min: 1 }).withMessage("Penyanyi tidak valid")], edit);

//delete data
router.delete("/data/:getId", del);

module.exports = router;
