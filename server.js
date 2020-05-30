var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var expresshandlebars = require("express-handlebars");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });