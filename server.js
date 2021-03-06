//Dependencies 
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
    })
);
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

const databaseurl = process.env.MONGODB_URI || 'mongodb://localhost/newsscraper';

const db = mongoose.connection;
// Connect to the Mongo DB
mongoose.connect(databaseurl, { useNewUrlParser: true });
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connected to Mongoose");
});

const routes = require("./routes/route.js");
app.use("/", routes);

app.listen(PORT, () => console.log('App listening to port ' + PORT));

