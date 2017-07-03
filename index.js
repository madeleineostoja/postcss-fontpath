'use strict';

var fs = require('fs'),
  objectAssign = require('object-assign'),
  path = require('path'),
  postcss = require('postcss'),
  url = require('url');

module.exports = postcss.plugin('postcss-fontpath', function (opts) {

  opts = objectAssign({
    checkPath: false,
    showMissingFontError: true,
    formats: [
      {type: 'embedded-opentype', ext: 'eot'},
      {type: 'woff2', ext: 'woff2'},
      {type: 'woff', ext: 'woff'},
      {type: 'truetype', ext: 'ttf'},
      {type: 'svg', ext: 'svg'}
    ]
  }, opts);

  return function (css, result) {
    // Loop through each @rule
    css.walkAtRules('font-face', function(rule) {

      // Loop through each decleration in the rule
      rule.walkDecls('font-path', function(decl) {

        // Replace single and double quotes with nothing
        var fontPath = decl.value.replace(/"/g, '').replace(/'/g, ''),
          // Fonts array for found fonts
          fonts = [],
          // Is there an eot to include EOT fallabck
          ieSrc = false,

          // placeholder vars
          ext = '',
          absoluteFontPath = '';

        // Foreach of the formats used
        opts.formats.forEach(function(format, index, array) {

          // If checking for path
          if (opts.checkPath === true) {
            // Make the fontPath absolute and normalize it (removes the #iefix hash)
            absoluteFontPath = url.parse(path.resolve(path.dirname(css.source.input.file), fontPath) + '.' + format.ext).pathname;

            try {
              // Try to see if the font exists
              fs.accessSync(absoluteFontPath, fs.F_OK);
            } catch (err) {
              // Only output error if wanted
              if(opts.showMissingFontError) {
                decl.warn(result, 'Cannot find file "' + fontPath + format.ext + '"');
              }
              // Skip the format in the src output
              return;
            }
          }

          // Set the ext var
          ext = format.ext;

          if(ext === 'eot') {
            ieSrc = true;
            ext = 'eot?#iefix'
          }

          // Add the font to the font-face dec
          fonts.push('url("' + fontPath + '.' + ext + '") format(\'' + format.type + '\')');
        });

        if (fonts.length > 0) {
          // If the EOT exists, add the fallback
          if(ieSrc ) {
            decl.cloneBefore({
              prop: 'src',
              value: 'url("' + fontPath + '.eot")'
            });
          }

          // Implode the rest of the fonts
          decl.cloneBefore({
            prop: 'src',
            value: fonts.join(',')
          });
        }

        // Remove our custom decleration
        decl.remove();

      });

    });
  };
});
