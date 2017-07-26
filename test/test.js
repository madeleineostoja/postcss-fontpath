/*eslint no-unused-expressions: 0, block-scoped-var: 0, no-undef: 0*/
'use strict';

var postcss = require('postcss'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path'),
    plugin = require('../');

var test = function (fixture, opts, done) {
  var from = path.join(__dirname, 'fixtures', fixture + '.css'),
      to = path.join(__dirname, 'fixtures', fixture + '.expected.css');

  var input = fs.readFileSync(from, 'utf8'),
      expected = fs.readFileSync(to, 'utf8');

  postcss([ plugin(opts) ])
    .process(input, { from: from })
    .then(function (result) {
      expect(result.css).to.eql(expected);
      done(null, result);
    }).catch(function (error) {
      done(error);
    });

};

describe('postcss-fontpath', function () {

  it('transforms font-path', function (done) {
   test('test', {}, function (error, result) {
     expect(error).to.be.null;
     expect(result.warnings()).to.be.empty;
     done();
   });
  });

  it('warns when file in font-path not exists', function (done) {
    test('missing', { checkPath: true }, function (error, result) {
      expect(error).to.be.null;
      expect(result.warnings()).to.have.lengthOf(5);
      done();
    });
  });
});
