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
    // Log any errors to the console
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
  db.Article.find({ saved: true })
      .lean()
      .then(function (data) {
          res.render("saved", {
              message: "Saved",
              saved: data,
              nothing: "There are no saved articles yet!",
          });
      });
});

/*app.get("/saved", function (req, res) {
  db.Article.find({})
    .where('saved').equals(true)
    .exec(function (err, article) {
      if (err) {
        console.log(err);
      } else {
        console.log(article);
      };
      res.render("saved");
    });
});*/

app.get("/saved/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
          res.json(dbArticle);
      })
      .catch(function (err) {
          res.json(err);
      });
});

app.post("/saved/:id", function (req, res) {
  db.Note.create(req.body)
      .then(function (dbNote) {
          return db.Article.findOneAndUpdate(
              { _id: req.params.id },
              {$push: { note: dbNote._id }},
              { new: true }
          );
      })
      .then(function (dbArticle) {
          res.json(dbArticle);
      })
      .catch(function (err) {
          res.json(err);
      });
});

app.put("/saved/:id", function (req, res) {
  db.Article.updateOne({ _id: req.params.id }, { saved: req.body.saved })
      .populate("note")
      .then(function (data) {
          res.json(data);
      })
      .catch(function (err) {
          res.json(err);
      });
});

module.exports = app;