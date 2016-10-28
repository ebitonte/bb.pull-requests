var express = require('express');
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var md5 = require("md5");

router.post("/jenkins", jsonParser, function(req, res, next) {
    console.log(req.body);
    var payload = req.body;
    var id = md5(payload.link);
    var now = new Date();
    payload.createdAt = now.toISOString();
    payload.updatedAt = now.toISOString();

    client.index({
      index: 'pullrequests',
      type: 'pullrequest',
      id: id,
      body: payload
    }, function (error, response) {
        if (error) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
});

router.post("/github", jsonParser, function(req, res, next) {
    var payload = req.body;
    var id = md5(payload.link);
    var now = new Date();
    payload.createdAt = now.toISOString();
    payload.updatedAt = now.toISOString();

    var payload = {
        createdAt: req.body.created_at,
        updatedAt: req.body.updated_at,
        link: req.body.pull_request.html_url,
        author: req.body.user.login,
        title: req.body.title,
        body: req.body.body
    }

    client.index({
      index: 'pullrequests',
      type: 'pullrequest',
      id: id,
      body: payload
    }, function (error, response) {
        if (error) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
});

module.exports = router;
