"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            files: ["**/*", "!**/node_modules/**", "!**public/lib/**", "!**public/dist/**"],
            tasks: ["watch-tasks"],
        },
        jshint: {
            files: [
                "**/*.js"
            ],
            options: {
                ignores: [
                    "node_modules/**",
                    "public/dist/**",
                    "public/lib/**"
                ],
                jshintrc: true
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: true,
                    compress: false,
                    sourceMap: true
                },
                files: {
                    "<%= minifiedApplicationJavaScriptFiles %>": "<%= applicationJavaScriptFiles %>"
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    "<%= minifiedApplicationCSSFiles %>": "<%= applicationCSSFiles %>",
                    "<%= minifiedVendorCSSFiles %>": "<%= vendorCSSFiles %>"
                }
            }
        },
        concat: {
            production: {
                options: {
                    stripBanners: true
                },
                files: {
                    "<%= minifiedVendorJavaScriptFiles %>": "<%= vendorJavaScriptFiles %>"
                }
            }
        },
        env: {
            build: {
                NODE_ENV: "build"
            }
        },
        concurrent: {
            dev: {
                tasks: ["nodemon", "watch"]
            },
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: "server.js",
                options: {
                    ignore: ["node_modules/**", "public/lib/**", "public/dist/**"]
                }
            }
        },
        sass: {
            options: {
                sourceMap: true,
                includePaths: ["public/lib/foundation/scss"]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "public/sass",
                    src: ["**/*.scss"],
                    dest: "public/dist/",
                    ext: ".css"
                }]
            }
        },
        postcss: {
            options: {
                processors: [
                    require("autoprefixer-core")({
                        browsers: "last 5 versions"
                    }).postcss
                ]
            },
            dist: {
                src: "public/dist/**/*.css"
            }
        },
        clean: {
            css: ["public/dist/"]
        }
    });

    // Load NPM tasks
    require("load-grunt-tasks")(grunt);

    // A Task for loading the configuration object
    grunt.task.registerTask("loadConfig", "Task that loads the config into a grunt option.", function() {
        require("./config/init")();
        var config = require("./config/config");
        var gitRev = require("git-rev-sync");

        grunt.config.set("vendorJavaScriptFiles", config.assets.lib.js);
        grunt.config.set("vendorCSSFiles", config.assets.lib.css);
        grunt.config.set("applicationJavaScriptFiles", config.assets.js);
        grunt.config.set("applicationCSSFiles", config.assets.css);

        // the minified asset names (with git version)
        var version = gitRev.short();
        grunt.config.set("minifiedVendorJavaScriptFiles",
            "public/dist/vendor-" + version + ".min.js");
        grunt.config.set("minifiedVendorCSSFiles",
            "public/dist/vendor-" + version + ".min.css");
        grunt.config.set("minifiedApplicationJavaScriptFiles",
            "public/dist/application-" + version + ".min.js");
        grunt.config.set("minifiedApplicationCSSFiles",
            "public/dist/application-" + version + ".min.css");
    });

    grunt.registerTask("server", "Start the server", function() {
        require("./server.js");
    });

    grunt.registerTask("watch-tasks", ["lint", "generate-css"]);
    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("generate-css", ["clean:css", "sass", "postcss"]);

    grunt.registerTask("default", ["lint", "generate-css", "concurrent:dev"]);
    grunt.registerTask("build", ["env:build", "loadConfig", "lint", "generate-css", "uglify", "cssmin", "concat"]);
};
