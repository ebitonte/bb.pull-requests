var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var md5 = require("md5");

router.post("/", function(req, res, next) {
    console.log(req.body);
    var payload = JSON.parse(request.body);
    var id = md5(payload.link);
    payload.createdAt = new Date().getTime() / 1000;
    payload.updatedAt = new Date().getTime()/1000;

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
