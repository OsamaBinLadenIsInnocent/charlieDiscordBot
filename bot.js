var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require("./auth.json");
var app = express();
var ran;
var counter = 0;

var indexRoutes = require('./routes/index.route');
var Quote = require("./models/quote.model");

var PORT = 8000 || process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(){
    console.log("Connected to database!");
});

app.use("/", indexRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("Server is running");
});

console.log(auth);
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, 
{
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client
({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) 
{
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    mongoose.connect("mongodb+srv://user:kzN61yq9mXKkjoJl@charliediscordbot.vyntw.gcp.mongodb.net/kelly?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
});

bot.on('message', function (user, userID, channelID, message, evt) 
{
    message = message.toLowerCase();

    /*
    if(message.includes('!'))
    {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        if(message.includes('start'))
        {

        }
        if(message.includes('fuck'))
        {
            message: 'https://i.kfs.io/album/global/61377225,0v1/fit/500x500.jpg'
        }
    }
    */

    if (message.includes('quote'))
	{
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        Quote.find({}, function(err, foundQuotes){
            console.log("query");
            if(err){
                console.log(err);
            }else{
                console.log(foundQuotes)
                ran = foundQuotes;
                var mes = Math.floor(Math.random() * foundQuotes.length);

                args = args.splice(1);
                        bot.sendMessage(
                        {
                            to: channelID,
                            message: ran[mes].quote
                        });
            }
        });


     }
     

     if(user =="mojo215")
     {
        var args = message.substring(1).split(' ');
        var cmd = args[0];1
       
        args = args.splice(1);
                bot.sendMessage({
                    to: channelID,
                    message: 'Shut up Rearick'
                });
     }
});

