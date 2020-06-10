const express = require("express")
const path = require("path");
const axios = require("axios");

const cheerio = require("cheerio");
const request = require("request");

const Note = require("../models/note.js");
const Article = require("../models/article.js");

// Initialize Express
var app = express();


// Require all models
var db = require("../models");

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.democracynow.org/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".news_item h3").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});
  /*
  // Retrieve data from the db
  app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scraper.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });
    
  // Handle form submission, save submission to mongo
  app.post("/submit", function(req, res) {
    console.log(req.body);
    // Insert the note into the notes collection
    db.notes.insert(req.body, function(error, saved) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send the note back to the browser
        // This will fire off the success function of the ajax request
        res.send(saved);
      }
    });
  });
  
  // Select just one note by an id
  app.get("/find/:id", function(req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))
  
    // Find just one result in the notes collection
    db.notes.findOne(
      {
        // Using the id in the url
        _id: mongojs.ObjectId(req.params.id)
      },
      function(error, found) {
        // log any errors
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the note to the browser
          // This will fire off the success function of the ajax request
          console.log(found);
          res.send(found);
        }
      }
    );
  });
  
  // Update just one note by an id
  app.post("/update/:id", function(req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))
  
    // Update the note that matches the object id
    db.notes.update(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        // Set the title, note and modified parameters
        // sent in the req body.
        $set: {
          title: req.body.title,
          note: req.body.note,
          modified: Date.now()
        }
      },
      function(error, edited) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(edited);
          res.send(edited);
        }
      }
    );
  });
  
  // Delete One from the DB
  app.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    db.notes.remove(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });
  
  // Clear the DB
  app.get("/clearall", function(req, res) {
    // Remove every note from the notes collection
    db.notes.remove({}, function(error, response) {
      // Log any errors to the console
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(response);
        res.send(response);
      }
    });
  });
  
  */
  module.exports = app;