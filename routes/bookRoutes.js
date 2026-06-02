const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
    homePage,
    addBookPage,
    addBook,
    viewBooks,
    editBookPage,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/", homePage);

router.get("/add-book", addBookPage);

router.post("/add-book", upload.single("image"), addBook);

router.get("/books", viewBooks);

router.get("/edit-book/:id", editBookPage);

router.put("/update-book/:id", upload.single("image"), updateBook);

router.delete("/delete-book/:id", deleteBook);

module.exports = router;