const multer = require("multer");
const { resolve, extname } = require("path");

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "uploads"),
    filename: (req, file, cb) => {
      try {
        req.body.name = file.originalname;
        return cb(null, new Date().getTime() + extname(file.originalname));
      } catch (error) {
        return cb("Arquivo inválido");
      }
    },
  }),
};
