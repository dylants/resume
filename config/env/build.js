"use strict";

module.exports = {
    // Include the same assets from all.js, but for the vendor libraries (3rd party),
    // include the minimized versions. These will not be minified during the build
    // but instead concat together to form 1 vendor js file.
    assets: {
        lib: {
            css: [

            ],
            js: [
                // jquery
                "public/lib/jquery/dist/jquery.min.js",
                // foundation
                "public/lib/foundation/js/vendor/fastclick.js",
                "public/lib/foundation/js/vendor/modernizr.js",
                "public/lib/foundation/js/vendor/placeholder.js",
                "public/lib/foundation/js/foundation.min.js"
            ]
        },
        css: [
            "public/dist/**/*.css"
        ],
        js: [

        ]
    }
};
