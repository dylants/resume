"use strict";

require("./config/init")();

var config = require("./config/config"),
    logger = require("./app/lib/logger.js")();

// Output the configuration for debugging purposes
logger.log("config: %j", config);

// Init the express application
var app = require("./config/express")();

// Start the app by listening on <port>
app.listen(config.port, function() {
    logger.log("Express server listening on HTTP on port " + config.port);
});

// Expose app
module.exports = app;
