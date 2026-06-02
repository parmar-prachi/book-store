const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");         
const path = require("path");     
const methodOverride = require("method-override");
const app = express();

// 1. Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Book-Store");
        console.log("MongoDB connected");
    }
    catch (err) {
        console.log("Database connection error: ", err);
    }
}
connectDB();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(methodOverride("_method"));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📁 Generated missing 'uploads' directory automatically.");
}

app.use("/uploads", express.static(uploadsDir));

const bookRoutes = require("./routes/bookRoutes");
app.use("/", bookRoutes);

app.listen(8000, () => {
    console.log("Server Running on Port 8000");
});