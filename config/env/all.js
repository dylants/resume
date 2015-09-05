"use strict";

module.exports = {
    port: process.env.PORT || 3000,
    templateEngine: "swig",
    assets: {
        lib: {
            css: [

            ],
            js: [
                // jquery
                "public/lib/jquery/dist/jquery.js",
                // foundation
                "public/lib/foundation/js/foundation.js",
                "public/lib/foundation/js/vendor/modernizr.js"
            ]
        },
        css: [
            "public/dist/**/*.css"
        ],
        js: [

        ],
        tests: [

        ]
    }
};
