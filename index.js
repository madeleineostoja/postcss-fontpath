'use strict';

var postcss = require('postcss');

/**
 * Extend object
 * @param  {Object} obj
 * @param  {Object} props
 * @return {Objetc}
 */
function extend (target, source) {
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

/*
 * Defaults options
 */
var defaultOptions = {
  IEFix: true,
  formats: [
    {
      type: 'embedded-opentype',
      ext: '.eot?#iefix'
    }, {
      type: 'woff',
      ext: '.woff'
    }, {
      type: 'truetype',
      ext: '.ttf'
    }, {
      type: 'svg',
      ext: '.svg'
    }
  ]
};

module.exports = postcss.plugin('postcss-fontpath', function (_options) {
  return function (css) {
    var options = extend(defaultOptions, _options);

    // Loop through each @rule
    css.walkAtRules('font-face', function(rule) {

      // Loop through each decleration in the rule
      rule.walkDecls('font-path', function(decl) {

        // Gather up the components of our new declerations
        var fontPath = decl.value.replace(/'/g, ''),
            src = '',
            ieSrc = 'url("' + fontPath + '.eot")';
        // Construct the new src value
        options.formats.forEach(function(format, index, array) {

          if (index === array.length - 1){
            src += 'url("' + fontPath + format.ext + '") format(\'' + format.type + '\')';
          } else {
            src += 'url("' + fontPath + format.ext + '") format(\'' + format.type + '\'),\n       ';
          }

        });

        // IE Fix src prop
        if (options.IEFix) {
          decl.cloneBefore({ prop: 'src', value: ieSrc });
        }

        // New src prop
        decl.cloneBefore({ prop: 'src', value: src });

        // Remove our custom decleration
        decl.remove();

      });

    });

  };
});
