const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Require all models
const db = require("../models");

// A GET route for scraping the Democracy Now website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.democracynow.org/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $(".news_item h3").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  db.Article.find({})
    .lean()
    .then(function (data) {
      res.render("index", { articles: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Clear the DB
app.get("/clearall", function (req, res) {
  db.Article.remove({}, function (error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
    }
    res.redirect("/");
  });
});

app.get("/saved", function (req, res) {
  db.Article.find({ Saved: true })
    .lean()
    .then(function (data) {
      res.render("saved", { Saved: data });
    });
});

// save an article
app.post('/saved/:id', function (req, res) {
  db.Article.findByIdAndUpdate(req.params.id, {
    $set: { Saved: true }
  },
    function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500);
      } else {
        res.redirect('/');
      }
    });
});

app.post("/savedNote/:id", function (req, res) {
  db.Article.findByIdAndUpdate(req.params.id, {
    $push: { Note: { body: req.body.com } }
  },
    function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500);
      } 
      else {
        res.redirect('/saved');
      }
    });
});


module.exports = app;