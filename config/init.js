"use strict";

var glob = require("glob"),
    logger = require("../app/lib/logger")();

module.exports = function() {
    var environmentFiles;

    // Ascii art, brought to you by: http://www.patorjk.com/software/taag/#p=display&f=Big&t=Resume
    // (done to show a break in the logs after a restart)
    logger.log("\n\n  _____                                \n |  __ \\                               \n | |__) |___  ___ _   _ _ __ ___   ___ \n |  _  // _ \\/ __| | | | '_ ` _ \\ / _ \\\n | | \\ \\  __/\\__ \\ |_| | | | | | |  __/\n |_|  \\_\\___||___/\\__,_|_| |_| |_|\\___|\n\n");

    /**
     * Before we begin, lets set the environment variable.
     * We'll Look for a valid NODE_ENV variable and if one cannot be
     * found load the development NODE_ENV.
     */
    environmentFiles = glob.sync("./config/env/" + process.env.NODE_ENV + ".js");
    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            logger.error("No configuration file found for '" +
                process.env.NODE_ENV +
                "' environment, using development instead");
        } else {
            logger.error("NODE_ENV is not defined! Using " +
                "default development environment");
        }

        process.env.NODE_ENV = "development";
    } else {
        logger.log("Application loaded using the '" +
            process.env.NODE_ENV + "' environment configuration");
    }

    /**
     * Add our server node extensions.
     * This is done so we don't have to include the full name of
     * each file when we `require` them as a dependency.
     */
    require.extensions[".server.controller.js"] = require.extensions[".js"];
    require.extensions[".server.model.js"] = require.extensions[".js"];
    require.extensions[".server.routes.js"] = require.extensions[".js"];
};
