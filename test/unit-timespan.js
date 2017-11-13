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
    span = testContext.spanCtor(0, 0, 0, 0, testContext.MAX_MINS_PER_DAY);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = testContext.spanCtor(23, 59, 59, 999, 0, 0, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    /* check values */
    assert.equal(span.getHours(), 23, 'Timespan has incorrect hour.');
    assert.equal(span.getMinutes(), 59, 'Timespan has incorrect minutes.');
    assert.equal(span.getDurationMSecs(), 1, 'Timespan has incorrect duration.');
  });

  it('Attempt to create timespans with null arguments', function() {

    assert.throws(function() { testContext.spanCtor(null, 0, 0, 0, 1,)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(12, null, 0, 0, 1)},
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
    assert.throws(function() { testContext.spanCtor(12, 0, 0, 0, -1)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans with out-of-range arguments', function() {

    assert.throws(function() { testContext.spanCtor(24, 9, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 60, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, MAX_MINS_PER_DAY+1)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans which are too long', function() {

    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 2*60)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(23, 0, 0, 0, 61)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.spanCtor(1, 0, 0, 0, MAX_MINS_PER_DAY)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

});
