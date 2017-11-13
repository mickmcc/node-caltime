/**
 * unit-timespan.js
 * Copyright(c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 120] */

'use strict';

/* dependencies */
const assert = require('assert');
const testContext = {};
testContext.spanCtor = require('../').timeSpan;
testContext.MAX_MINS_PER_DAY = require('../').MAX_MINS_PER_DAY;


before(function() {

});

beforeEach(function() {

});

afterEach(function() {

});

after(function() {

});


describe('Timespan - Instantiation', function() {
  it('Create valid time spans', function() {
    let span = testContext.spanCtor(0, 0, 0, 0, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = testContext.spanCtor(0, 0, 0, 0, 1, 1, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = testContext.spanCtor(0, 0, 0, 0, testContext.MAX_MINS_PER_DAY);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = testContext.spanCtor(23, 59, 59, 999, 0, 0, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    /* check access to data members is not mixed up */
    span = testContext.spanCtor(4, 5, 6, 7, 8, 9, 10);
    assert.equal(span.getHours(), 4, 'Timespan has incorrect hour.');
    assert.equal(span.getMinutes(), 5, 'Timespan has incorrect minutes.');
    assert.equal(span.getSeconds(), 6, 'Timespan has incorrect seconds.');
    assert.equal(span.getMilliseconds(), 7, 'Timespan has incorrect milliseconds.');
    assert.equal(span.getDurationMins(), 8, 'Timespan has incorrect duration in minutes.');
    assert.equal(span.getDurationSecs(), 9, 'Timespan has incorrect duration in seconds.');
    assert.equal(span.getDurationMSecs(), 10, 'Timespan has incorrect duration in milliseconds.');
    /* check getting total duration */
    span = testContext.spanCtor(0, 0, 0, 0, 1, 0, 0);
    assert.equal(span.getTotalDuration(), ((1*60*1000)+(0*1000)+0), 'Timespan has incorrect total duration in milliseconds.');
    span = testContext.spanCtor(0, 0, 0, 0, 0, 1, 0);
    assert.equal(span.getTotalDuration(), ((0*60*1000)+(1*1000)+0), 'Timespan has incorrect total duration in milliseconds.');
    span = testContext.spanCtor(0, 0, 0, 0, 0, 0, 1);
    assert.equal(span.getTotalDuration(), ((0*60*1000)+(0*1000)+1), 'Timespan has incorrect total duration in milliseconds.');
    span = testContext.spanCtor(0, 0, 0, 0, 23, 59, 999);
    assert.equal(span.getTotalDuration(), ((23*60*1000)+(59*1000)+999), 'Timespan has incorrect total duration in milliseconds.');
  });

  it('Attempt to create timespans with null arguments', function() {

    assert.throws(function() { testContext.spanCtor(null, 0, 0, 0, 1,)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, null, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, null, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, null, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, 0, null)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans with negative time arguments', function() {

    assert.throws(function() { testContext.spanCtor(-1, 0, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, -1, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, -1, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, -1, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, 0, -1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, 0, 1, -1, 0)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, 0, 0, 0, 1, 0, -1)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans with out-of-range arguments', function() {

    assert.throws(function() { testContext.spanCtor(24, 9, 0, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 60, 0, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 60, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 1000, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, testContext.MAX_MINS_PER_DAY+1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 1, 60, 0) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 1, 0, 1000) },
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans which are too long', function() {

    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 2*60) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 61) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(1, 0, 0, 0, testContext.MAX_MINS_PER_DAY) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(0, 0, 0, 0, testContext.MAX_MINS_PER_DAY, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
  });

});
