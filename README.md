# Mongo News Scrape App

## Function
This news scraper application scrapes articles from the Democracy Now home page and displays the titles on the applications's home page. If the user clicks on the title, they will be redirected to the article on the Democracy Now website. If the user presses the "Scrape New Articles" button, new articles will populate and old ones will no longer appear. If the user presses "Clear Articles" button, all articles and saved articles will be delteled. The user has the option to save articles and go to the "Saved Articles" tab and view them as well as make notes on each saved article. 

## Technologies
This application uses Mongo DB and Mongoose to save articles and note data. It uses Handlebars as a template. 
### Dependencies:
* axios
* cheerio
* express
* express-handlebars
* mongoose
* morgan

This application can be viewed via the deployed Heroku page: https://news-web-scrape.herokuapp.com/