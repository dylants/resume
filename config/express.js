"use strict";

var express = require("express"),
    config = require("./config"),
    consolidate = require("consolidate"),
    path = require("path"),
    gitRev = require("git-rev-sync"),
    domainMiddleware = require("express-domain-middleware"),
    uuid = require("uuid"),
    logger = require("../app/lib/logger")();

module.exports = function() {
    var app;

    // Initialize express app
    app = express();

    // Setting application local variables
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();
    app.locals.gitRevision = gitRev.long();

    // generate a unique ID for each request within the domain
    domainMiddleware.id = function(req) {
        return uuid.v4();
    };
    app.use(domainMiddleware);

    // log request information
    app.use(function(req, res, next) {
        // don't log asset requests (to keep the logs less chatty)
        if (req.path && req.path.indexOf("/assets") === 0) {
            return next();
        }

        logger.log("REQUEST: req.url: %s, req.method: %s, req.headers.host: %s, req.ip: %s",
            req.url, req.method, req.headers.host, req.ip);
        return next();
    });

    // Set the template engine
    app.engine("server.view.html", consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set("view engine", "server.view.html");
    app.set("views", "./app/views");

    // serve all static assets in the public directory under /assets
    app.use("/assets", express.static(path.resolve("./public")));

    // as of now, all routes cause us to render the resume page
    app.all("/*", function(req, res) {
        res.render("resume");
    });

    return app;
};
