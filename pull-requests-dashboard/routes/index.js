var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var ONE_DAY = 1000 * 60 * 60 * 24;

/* GET home page. */
router.get('/', function(req, res, next) {
    client.search({
        index: "pullrequests",
        type: "pullrequest",
        q: "*:*"
    }).then(function(body) {
        return body.hits.hits.map(function(pr) {
            const prInfo = pr._source;
            prInfo.repo = /\/Consumer-Web\/(.+)\/pull/.exec(prInfo.link)[1];
            prInfo.visibleTime = new Date(Date.parse(prInfo.createdAt)).toLocaleTimeString();
            prInfo.status = Date.parse(prInfo.updatedAt) - new Date() > 2 * ONE_DAY ? "old" : "new";

            return prInfo;
        });
    }).then(function(prs) {
        res.render("index", {"prs": prs});
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

module.exports = router;
