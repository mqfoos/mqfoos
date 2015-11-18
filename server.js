var express = require('express');
var app = express();
var request = require('request');
var slackWebhookUrl = "https://hooks.slack.com/services/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";
var videoStreamUrl = "http://10.66.168.142:8080/video";
var os = require("os");

app.get('/', function (req, res) {
    console.log(os.hostname());
    res.send("hello world");
});

app.get('/users', function (req, res) {

    res.send("hello world SUSERSSKLS");
});

app.get('/video', function (req, res) {
    var stream = request.get(videoStreamUrl).on('error', function (err) {
        console.log("error: " + err);
    });
    req.pipe(stream);
    stream.pipe(res);
});

app.get("/slack", function(req, res, err){
   makeSlackRequest(req.param("msg"));
    res.sendStatus(200)
});

var portNumber = process.env.PORT || 3000;
var server = app.listen(portNumber, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;


var makeSlackRequest = function(message) {
    var localVideoProxy = getBaseUrl() + "/video";
    request.post({
        uri: slackWebhookUrl,
        body:'{"channel": "#foosball", "username": "webhookbot", "text": "<'+localVideoProxy+'|Click here for live cam> This is a test from our foosball cam team", "icon_emoji": ":ghost:"}'
    }).on("error", function(err){
        console.log('got a slack error ' + err);
    }).on("response", function(res){
        console.log('got a response ' + res.statusCode);
        console.log(res.body);
    });
};

var getBaseUrl = function() {
    //we probably need a better solution than this.
    var networkInterfaces = os.getNetworkInterfaces();
    var interface = networkInterfaces["en0"][1];
    return "http://" + interface.address + ':' + server.address().port;
};