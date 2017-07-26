'use strict';

var fs = require('fs'),
  merge = require('deepmerge'),
  path = require('path'),
  postcss = require('postcss'),
  url = require('url');

var defaults = {
    checkPath: false,
    ie8Fix: false,
    formats: [
      { type: 'embedded-opentype', ext: 'eot' },
      { type: 'woff2', ext: 'woff2' },
      { type: 'woff', ext: 'woff' },
      { type: 'truetype', ext: 'ttf' },
      { type: 'svg', ext: 'svg'}
    ]
  };

module.exports = postcss.plugin('postcss-fontpath', function (options) {

  var opts = merge(defaults, options || {});

  return function (css) {
    // Loop through each @rule
    css.walkAtRules('font-face', function(rule) {

      // Loop through each decleration in the rule
      rule.walkDecls('font-path', function(decl) {

        // Replace single and double quotes with nothing
        var fontPath = decl.value.replace(/"/g, '').replace(/'/g, ''),
          fonts = [],
          ieHack = false,
          ext = '',
          absoluteFontPath = '';

        opts.formats.forEach(function(format) {

          if (opts.checkPath === true) {
            absoluteFontPath = url.parse(path.resolve(path.dirname(css.source.input.file), fontPath) + '.' + format.ext).pathname;

            try {
              // Try to see if the font exists
              fs.accessSync(absoluteFontPath, fs.F_OK);
            } catch (err) {
              return;
            }
          }

          // Set the ext var
          ext = format.ext;

          if (ext === 'eot' && opts.ie8Fix) {
            ieHack = true;
            ext = 'eot?#iefix';
          }

          // Add the font to the font-face decl
          fonts.push('url("' + fontPath + '.' + ext + '") format(\'' + format.type + '\')');
        });

        if (fonts.length > 0) {

          // If the EOT exists, add the fallback
          if (ieHack && opts.ie8Fix) {
            decl.cloneBefore({
              prop: 'src',
              value: 'url("' + fontPath + '.eot")'
            });
          }

          // Implode the rest of the fonts
          decl.cloneBefore({
            prop: 'src',
            value: fonts.join(',\n       ')
          });
        }

        // Remove our custom decleration
        decl.remove();

      });

    });
  };
});
