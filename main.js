var got = require('got-promise');
var express = require('express');
var fs = require('fs');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.list', 'utf-8'));
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

var URL = 'https://api.pushbullet.com/v2/pushes';
var PUSHBULLET_TOKEN = process.env.PUSHBULLET_TOKEN || config.PUSHBULLET_TOKEN;
var HEADER = 'Bearer ' + PUSHBULLET_TOKEN;

var SENDER_ID = 'ujvYEd3GfU4sjxCHoMphca';

var SERVER_PORT = process.env.SERVER_PORT || config.SERVER_PORT || 3330;

function sendPush(title, text) {
    return got.post(URL, {
        headers: {
            'Authorization': HEADER,
            'Content-Type': 'application/json'
        },
        json: true,
        body: JSON.stringify({
            type: 'note',
            title: title,
            body: text,
            source_device_iden: SENDER_ID
        })
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.post('/send', function (req, res) {
    var text = req.body.text;
    var title = req.body.title;

    sendPush(title, text)
        .then(function(result){
            res.status(200).send(result.body);
        })
        .catch(function(err){
            console.log(err.body);
            res.status(500).send(err.body);
        });

});

var server = app.listen(SERVER_PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Push sender listening at http://%s:%s', host, port);

});

module.exports = sendPush;




