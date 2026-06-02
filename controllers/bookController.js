const Book = require("../models/Book");

// 1. Home Page Dashboard
exports.homePage = async (req, res) => {
    try {
        const books = await Book.find();

        const totalBooks = books.reduce((sum, book) => {
            return sum + (book.quantity || 0); 
        }, 0);

        res.render("index", {
            books,
            totalBooks
        });
    } catch (err) {
        console.error("Error loading Home Page:", err);
        res.status(500).send("Internal Server Error");
    }
};

// 2. Render Add Book Form Page

exports.addBookPage = (req, res) => {
    res.render("addBook");
};

// 3. Process Add Book Submission

exports.addBook = async (req, res) => {
    try {
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            image: req.file ? req.file.filename : "",
        });

        // Save data to Mongo
        await newBook.save();
        console.log("Book saved successfully to MongoDB Compass!");

        res.redirect("/");
    } catch (err) {
        console.error("Database Save Error in addBook:", err);
        res.status(500).send("Database Error: Could not save the book.");
    }
};

// 4. View All Books Page

exports.viewBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.render("viewBooks", { books });
    } catch (err) {
        console.error("Error retrieving books list:", err);
        res.status(500).send("Internal Server Error");
    }
};

// 5. Render Edit Book Page

exports.editBookPage = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send("Book not found");
        }
        res.render("editBook", { book });
    } catch (err) {
        console.error("Error fetching book details for edit:", err);
        res.status(500).send("Internal Server Error");
    }
};

// 6. Process Update Book Submission

exports.updateBook = async (req, res) => {
    try {
        let updatedData = {
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        console.log(`Book ID ${req.params.id} updated successfully!`);

        res.redirect("/books");
    } catch (err) {
        console.error("Error updating book database records:", err);
        res.status(500).send("Database Error: Could not update the book details.");
    }
};

// 7. Process Delete Book Action

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        console.log(`Book ID ${req.params.id} deleted from database.`);

        res.redirect("/books");
    } catch (err) {
        console.error("Error deleting book records:", err);
        res.status(500).send("Database Error: Could not remove the book.");
    }
};