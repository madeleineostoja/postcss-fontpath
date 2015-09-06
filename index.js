'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-fontpath', function () {
  return function (css) {

    // Loop through each @rule
    css.walkAtRules('font-face', function(rule) {

      // Loop through each decleration in the rule
      rule.walkDecls('font-path', function(decl) {

        // Gather up the components of our new declerations
        var fontPath = decl.value.replace(/'/g, ''),
            src = '',
            ieSrc = 'url("' + fontPath + '.eot")',
            formats = [
              { type: 'embedded-opentype', ext: '.eot?#iefix' },
              { type: 'woff', ext: '.woff' },
              { type: 'truetype', ext: '.ttf' },
              { type: 'svg', ext: '.svg' }
            ];

        // Construct the new src value
        formats.forEach(function(format, index, array) {

          if (index === array.length - 1){
            src += 'url("' + fontPath + format.ext + '") format(\'' + format.type + '\')';
          } else {
            src += 'url("' + fontPath + format.ext + '") format(\'' + format.type + '\'),\n       ';
          }

        });

        // IE Fix src prop
        decl.cloneBefore({ prop: 'src', value: ieSrc });

        // New src prop
        decl.cloneBefore({ prop: 'src', value: src });

        // Remove our custom decleration
        decl.remove();

      });

    });

  };
});
