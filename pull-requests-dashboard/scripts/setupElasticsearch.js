"use strict";
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var JENKINS_INDEX = "pullrequests_jenkins";
var JENKINS_TYPE = "pullrequest_jenkins";
var GITHUB_INDEX = "pullrequests";
var GITHUB_TYPE = "pullrequest";

var settings = {
    'number_of_shards': 2,
    'number_of_replicas': 2
};

var jenkinsMappings = require("./config/jenkinsMappings.json");
var githubMappings = require("./config/githubMappings.json");

client.indices.create({
    index: JENKINS_INDEX,
    body: {
        settings: settings,
        mappings: jenkinsMappings
    }
});

client.indices.create({
    index: GITHUB_INDEX,
    body: {
        settings: settings,
        mappings: githubMappings
    }
});
