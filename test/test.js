'use strict';

const postcss = require('postcss');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const plugin = require('../');

function test(fixture, opts, done) {
  let input = fixture + '.css',
      expected = fixture + '.expected.css';

  input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
  expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');

  postcss([ plugin(opts) ])
    .process(input)
    .then(function (result) {
      expect(result.css).to.eql(expected);
      expect(result.warnings()).to.be.empty;
      done();
    }).catch(function (error) {
      done(error);
    });
}

describe('postcss-fontpath', function () {
  it('transforms font-path with default options', done => test('test', {}, done));
  it('only generates specified formats', done => test('formats', { formats: [ { type: 'woff2', ext: 'woff2' } ] }, done));
  it('adds the ie8 hack when ie8Fix is true', done => test('ie-fix', { ie8Fix: true }, done));
  it('does not output fonts whose files do not exist if checkFiles is true', done => test('missing', { checkFiles: true }, done));
});
