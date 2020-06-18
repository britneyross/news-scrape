const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  Saved: {
    type: Boolean,
    required: true,
    default: false
  },
  Note: [{
    type: Schema.Types.Array,
    required: false
  }]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;