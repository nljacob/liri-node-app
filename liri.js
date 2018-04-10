require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var song = "";
var movie = "";
var newRequest = false;

var twitterFunction = function(){
    if (command === "my-tweets") {
        var params = { screen_name: 'njacob1201', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at);
                }
            }
        });
    }
}
twitterFunction();


var movieFunction = function(){
    if (command === "movie-this") {
        if (process.argv.length === 3 && newRequest === false) {
            movie = "Mr. Nobody";
        }
        else {
            for (var i = 3; i < process.argv.length; i++) {
                if (i === 3) {
                    movie = movie + process.argv[i];
                }
                else {
                    movie = movie + "+" + process.argv[i];
                }
            }
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    }
}
movieFunction();


if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        song = dataArr[1];
        movie = dataArr[1];
        newRequest = true;      
        spotifyFunction();
        twitterFunction();
        movieFunction();
      });
}


var spotifyFunction = function(){
    if (command === "spotify-this-song") {
        if (process.argv.length === 3 && newRequest === false) {
            song = "The Sign Ace of Base";
        }
        else {
            for (var i = 3; i < process.argv.length; i++) {
                song = song + process.argv[i] + " ";
            }
        }
        spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log("Error occured: " + err);
            }
            console.log(JSON.stringify(data.tracks.items[0].artists[0].name));
            console.log(JSON.stringify(data.tracks.items[0].name));
            console.log(JSON.stringify(data.tracks.items[0].preview_url));
            console.log(JSON.stringify(data.tracks.items[0].album.name));
        });
    }
}
spotifyFunction();