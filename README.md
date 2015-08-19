# PostCSS FontPath
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

[PostCSS][PostCSS] plugin that adds a `font-path` attribute to `@font-face` which expands to the [FontSpring syntax][fontspring].

Part of [Rucksack - CSS Superpowers](http://simplaio.github.io/rucksack).

```css
/* Note: path must include base filename */
@font-face {
  font-family: 'My Font';
  font-path: '/path/to/font/file';
  font-weight: normal;
  font-style: normal;
}
```

```css
@font-face {
  font-family: 'My Font';
  src: url("/path/to/font/file.eot");
  src: url("/path/to/font/file.eot?#iefix") format('embedded-opentype'),
       url("/path/to/font/file.woff") format('woff'),
       url("/path/to/font/file.ttf") format('truetype'),
       url("/path/to/font/file.svg") format('svg');
  font-weight: normal;
  font-style: normal;
}
```

--

### Usage

```js
postcss([ require('postcss-fontpath') ])
```

See [PostCSS][PostCSS] docs for examples for your environment.

--

### License

MIT © [Sean King](https://twitter.com/seaneking)

[npm-image]: https://badge.fury.io/js/postcss-fontpath.svg
[npm-url]: https://npmjs.org/package/postcss-fontpath
[travis-image]: https://travis-ci.org/seaneking/postcss-fontpath.svg?branch=master
[travis-url]: https://travis-ci.org/seaneking/postcss-fontpath
[daviddm-image]: https://david-dm.org/seaneking/postcss-fontpath.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/seaneking/postcss-fontpath
[PostCSS]: https://github.com/postcss/postcss
[fontspring]: http://blog.fontspring.com/2011/02/further-hardening-of-the-bulletproof-syntax/
