const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body:{
      type: String,
      required: true
    },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;