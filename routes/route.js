const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Require all models
const db = require("../models");

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

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.democracynow.org/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".news_item h3").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        res.redirect("/");
    });
});

// Clear the DB
app.get("/clearall", function(req, res) {
  db.Article.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
    }
    res.redirect("/");
  });
});

module.exports = app;