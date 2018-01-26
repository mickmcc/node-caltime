/**
 * unit-timespan.js
 * Copyright(c) 2017-2018 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 120] */

'use strict';

/* dependencies */
const assert = require('assert');
const util = require('util');
const _ = require('lodash');
const tc = {}; // test context
tc.spanCtor = require('../').timeSpan;
tc.sortTimeSpans = require('../').sortTimeSpans;
tc.mergeTimeSpans = require('../').mergeTimeSpans;
tc.constants = require('../').constants;


before(function() {

});

beforeEach(function() {

});

afterEach(function() {

});

after(function() {

});


describe('TimeSpan - Instantiation', function() {
  it('Create valid time spans', function() {
    let span = tc.spanCtor(0, 0, 0, 0, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = tc.spanCtor(0, 0, 0, 0, 1, 1, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = tc.spanCtor(0, 0, 0, 0, tc.constants.MAX_MINS_PER_DAY);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    span = tc.spanCtor(23, 59, 59, 999, 0, 0, 1);
    assert.notEqual(span, null, 'Timespan object was not constructed.');
    /* check access to data members is not mixed up */
    span = tc.spanCtor(4, 5, 6, 7, 8, 9, 10);
    assert.equal(span.getHours(), 4, 'Timespan has incorrect hour.');
    assert.equal(span.getMinutes(), 5, 'Timespan has incorrect minutes.');
    assert.equal(span.getSeconds(), 6, 'Timespan has incorrect seconds.');
    assert.equal(span.getMilliseconds(), 7, 'Timespan has incorrect milliseconds.');
    assert.equal(span.getDurationMins(), 8, 'Timespan has incorrect duration in minutes.');
    assert.equal(span.getDurationSecs(), 9, 'Timespan has incorrect duration in seconds.');
    assert.equal(span.getDurationMs(), 10, 'Timespan has incorrect duration in milliseconds.');
    /* check getting total duration */
    span = tc.spanCtor(0, 0, 0, 0, 1, 0, 0);
    assert.equal(span.getTotalDuration(), ((1*60*1000)+(0*1000)+0), 'Timespan has incorrect total duration in milliseconds.');
    span = tc.spanCtor(0, 0, 0, 0, 0, 1, 0);
    assert.equal(span.getTotalDuration(), ((0*60*1000)+(1*1000)+0), 'Timespan has incorrect total duration in milliseconds.');
    span = tc.spanCtor(0, 0, 0, 0, 0, 0, 1);
    assert.equal(span.getTotalDuration(), ((0*60*1000)+(0*1000)+1), 'Timespan has incorrect total duration in milliseconds.');
    span = tc.spanCtor(0, 0, 0, 0, 23, 59, 999);
    assert.equal(span.getTotalDuration(), ((23*60*1000)+(59*1000)+999), 'Timespan has incorrect total duration in milliseconds.');
  });

  it('Attempt to create timespans with null arguments', function() {

    assert.throws(function() { tc.spanCtor(null, 0, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, null, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, null, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, null, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, 0, null)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans with negative time arguments', function() {

    assert.throws(function() { tc.spanCtor(-1, 0, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, -1, 0, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, -1, 0, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, -1, 1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, 0, -1)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, 0, 1, -1, 0)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(12, 0, 0, 0, 1, 0, -1)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans with out-of-range arguments', function() {

    assert.throws(function() { tc.spanCtor(24, 9, 0, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 60, 0, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 0, 60, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 0, 0, 1000, 1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 0, 0, 0, tc.constants.MAX_MINS_PER_DAY+1) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 0, 0, 0, 1, 60, 0) },
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { tc.spanCtor(23, 0, 0, 0, 1, 0, 1000) },
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timespans which have excessive end times', function() {

    assert.throws(function() { tc.spanCtor(23, 0, 0, 0, 2*60, 0, 0) },
                    Error,
                    'Expected functional constructor to throw an error.'); // spans 23:00 - 01:00
    assert.throws(function() { tc.spanCtor(23, 0, 0, 0, 61, 0, 0) },
                    Error,
                    'Expected functional constructor to throw an error.'); // spans 23:00 - 00:01
    assert.throws(function() { tc.spanCtor(1, 0, 0, 0, tc.constants.MAX_MINS_PER_DAY, 0, 0) },
                    Error,
                    'Expected functional constructor to throw an error.'); // spans 01:00-01:00
    assert.throws(function() { tc.spanCtor(0, 0, 0, 0, tc.constants.MAX_MINS_PER_DAY, 0, 1) },
                    Error,
                    'Expected functional constructor to throw an error.'); // spans 00:00:00:000 - 00:00:00:001
  });
});


describe('TimeSpan - Operations', function() {

  it('Timespans which are equals', function() {

    let spanA = tc.spanCtor(1, 2, 3, 4, 5, 6, 7);
    let spanB = tc.spanCtor(1, 2, 3, 4, 5, 6, 7);
    assert.equal(spanA.isEqual(spanB), true, 'TimeSpan objects should be equal.');
    assert.equal(spanB.isEqual(spanA), true, 'TimeSpan objects should be equal.');
    assert.equal(spanA.isEqual(spanA), true, 'TimeSpan objects should be equal.');
  });

  it('Timespans which are not equals', function() {

    let spanA = tc.spanCtor(1, 2, 3, 4, 5, 6, 7);
    let spanB = tc.spanCtor(1, 2, 3, 4, 5, 6, 8); // different duration
    let spanC = tc.spanCtor(1, 2, 3, 9, 5, 6, 7); // different begin time
    assert.equal(spanA.isEqual(spanB), false, 'TimeSpans have different durations.');
    assert.equal(spanB.isEqual(spanA), false, 'TimeSpans have different durations.');
    assert.equal(spanA.isEqual(spanC), false, 'TimeSpans have different begin times.');
    assert.equal(spanC.isEqual(spanA), false, 'TimeSpans have different begin times.');
    assert.equal(spanB.isEqual(spanC), false, 'TimeSpans are different.');
    assert.equal(spanC.isEqual(spanB), false, 'TimeSpans are different.');
  });

  it('Query the intersection of timespans', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);  // 01:00 - 02:00
    let spanB = tc.spanCtor(1, 30, 0, 0, 60, 0, 0); // 01:30 - 02:30
    let spanC = tc.spanCtor(1, 30, 0, 0, 10, 0, 0); // 01:30 - 01:40
    let spanD = tc.spanCtor(2, 0, 0, 0, 60, 0, 0);  // 02:00 - 03:00
    let spanE = tc.spanCtor(2, 30, 0, 0, 60, 0, 0); // 02:30 - 03:30
    // pass invalid arguments to method
    assert.throws(function() { spanA.isIntersect(null) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.isIntersect(undefined) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.isIntersect( {} ) },
                    Error,
                    'Expected method to throw an error.');
    // spans which do intersect
    assert.equal(spanA.isIntersect(spanA), true, 'TimeSpans should intersect.');
    assert.equal(spanA.isIntersect(spanB), true, 'TimeSpans should intersect.');
    assert.equal(spanA.isIntersect(spanC), true, 'TimeSpans should intersect.');
    assert.equal(spanB.isIntersect(spanA), true, 'TimeSpans should intersect.');
    assert.equal(spanB.isIntersect(spanC), true, 'TimeSpans should intersect.');
    assert.equal(spanD.isIntersect(spanE), true, 'TimeSpans should intersect.');
    // spans which don't intersect
    assert.equal(spanA.isIntersect(spanD), false, 'TimeSpans should not intersect.');
    assert.equal(spanA.isIntersect(spanE), false, 'TimeSpans should not intersect.');
    assert.equal(spanD.isIntersect(spanA), false, 'TimeSpans should not intersect.');
    assert.equal(spanE.isIntersect(spanA), false, 'TimeSpans should not intersect.');
  });

  it('Intersection of timespans', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);  // 01:00 - 02:00
    let spanB = tc.spanCtor(1, 30, 0, 0, 60, 0, 0); // 01:30 - 02:30
    let spanC = tc.spanCtor(1, 59, 0, 0, 10, 0, 0); // 01:59 - 02:09
    let spanD = tc.spanCtor(1, 30, 0, 0, 0, 0, 100);  // 01:30 - 01:30:00:100
    let spanE = tc.spanCtor(1, 30, 0, 0, 0, 0, 1); // 01:30 - 01:30:00:001
    let spanF = tc.spanCtor(2, 0, 0, 0, 30, 0, 0);  // 02:00 - 02:30
    // pass invalid arguments to method
    assert.throws(function() { spanA.intersect(null) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.intersect(undefined) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.intersect( {} ) },
                    Error,
                    'Expected method to throw an error.');
    // spans which do intersect
    let newSpan = spanA.intersect(spanB);
    assert.equal(_.isObject(newSpan), true, 'Function should return a TimeSpan object.');
    assert.equal(newSpan.getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(newSpan.getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(newSpan.getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(newSpan.getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(newSpan.getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(newSpan.getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(newSpan.getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // spans with 1 minute overlap
    newSpan = spanA.intersect(spanC);
    assert.equal(_.isObject(newSpan), true, 'Function should return a TimeSpan object.');
    assert.equal(newSpan.getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(newSpan.getMinutes(), 59, 'Incorrect start time: minutes.');
    assert.equal(newSpan.getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(newSpan.getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(newSpan.getDurationMins(), 1, 'Incorrect duration: minutes.');
    assert.equal(newSpan.getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(newSpan.getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // spans with 1 millisecond overlap
    newSpan = spanD.intersect(spanE);
    assert.equal(_.isObject(newSpan), true, 'Function should return a TimeSpan object.');
    assert.equal(newSpan.getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(newSpan.getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(newSpan.getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(newSpan.getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(newSpan.getDurationMins(), 0, 'Incorrect duration: minutes.');
    assert.equal(newSpan.getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(newSpan.getDurationMs(), 1, 'Incorrect duration: milliseconds.');
    // spans which don't intersect
    newSpan = spanA.intersect(spanF);
    assert.equal(newSpan, null, 'Function should return null.');
  });

  it('Union of timespans', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);  // 01:00 - 02:00
    let spanB = tc.spanCtor(1, 59, 0, 0, 10, 0, 0); // 01:59 - 02:09
    let spanC = tc.spanCtor(2, 0, 0, 0, 30, 0, 0);  // 02:00 - 02:30
    let spanD = tc.spanCtor(2, 0, 0, 0, 6*60, 0, 0);  // 02:00 - 08:00
    // pass invalid arguments to method
    assert.throws(function() { spanA.union(null) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.union(undefined) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.union( {} ) },
                    Error,
                    'Expected method to throw an error.');
    // spans which do intersect
    let newSpan = spanA.union(spanB);
    assert.equal(_.isObject(newSpan), true, 'Function should return a TimeSpan object.');
    assert.equal(newSpan.getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(newSpan.getMinutes(), 0, 'Incorrect start time: minutes.');
    assert.equal(newSpan.getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(newSpan.getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(newSpan.getDurationMins(), 69, 'Incorrect duration: minutes.');
    assert.equal(newSpan.getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(newSpan.getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // spans which do intersect
    newSpan = spanB.union(spanD);
    assert.equal(_.isObject(newSpan), true, 'Function should return a TimeSpan object.');
    assert.equal(newSpan.getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(newSpan.getMinutes(), 59, 'Incorrect start time: minutes.');
    assert.equal(newSpan.getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(newSpan.getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(newSpan.getDurationMins(), (6*60)+1, 'Incorrect duration: minutes.');
    assert.equal(newSpan.getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(newSpan.getDurationMs(), 0, 'Incorrect duration: milliseconds.');
  });

  it('Subtraction of timespans with invalid arguments', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);   // 01:00 - 02:00
    assert.throws(function() { spanA.subtract(null) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.subtract(undefined) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.subtract( {} ) },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Subtraction of timespans', function() {

    const spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);    // 01:00 - 02:00
    const spanB = tc.spanCtor(1, 20, 0, 0, 10, 0, 0);   // 01:20 - 01:40
    const spanBb = tc.spanCtor(1, 20, 0, 0, 10, 0, 0);  // same as spanB
    const spanC = tc.spanCtor(1, 0, 0, 0, 30, 0, 0);    // 01:00 - 01:30
    const spanD = tc.spanCtor(1, 30, 0, 0, 30, 0, 0);   // 01:30 - 02:00
    // produces two remainders
    let result = spanA.subtract(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 2, 'Expect two timespans in array.');
    // first remainder from subtraction
    assert.equal(result[0].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 0, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 20, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // second remainder from subtraction
    assert.equal(result[1].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[1].getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(result[1].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[1].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[1].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[1].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[1].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // equal starts, produces 1 remainder
    result = spanA.subtract(spanC);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 1, 'Expect one timespan in array.');
    assert.equal(result[0].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // equal ends, produces 1 remainder
    result = spanA.subtract(spanD);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 1, 'Expect one timespan in array.');
    assert.equal(result[0].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 0, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // equal starts and ends, produces empty array
    result = spanB.subtract(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 0, 'Expect empty array.');
    result = spanB.subtract(spanBb);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 0, 'Expect empty array.');
  });

  it('Subtraction of timespans with insufficient overlap', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);   // 01:00 - 02:00
    let spanB = tc.spanCtor(1, 20, 0, 0, 60, 0, 0);  // 01:20 - 02:20
    let spanC = tc.spanCtor(0, 30, 0, 0, 40, 0, 0);   // 00:30 - 01:10
    let spanD = tc.spanCtor(2, 0, 0, 0, 30, 0, 0);   // 02:00 - 02:30

    let result = spanA.subtract(spanB);
    assert.equal(_.isNull(result), true, 'Function should return null.');
    result = spanB.subtract(spanA);
    assert.equal(_.isNull(result), true, 'Function should return null.');
    result = spanA.subtract(spanC);
    assert.equal(_.isNull(result), true, 'Function should return null.');
    result = spanA.subtract(spanD);
    assert.equal(_.isNull(result), true, 'Function should return null.');
  });

  it('Difference of timespans with invalid arguments', function() {

    let spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);   // 01:00 - 02:00
    assert.throws(function() { spanA.difference(null) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.difference(undefined) },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() { spanA.difference( {} ) },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Difference of timespans - one remainder', function() {

    const spanA = tc.spanCtor(12, 0, 0, 0, 60, 0, 0);    // 12:00 - 13:00
    const spanB = tc.spanCtor(12, 30, 0, 0, 60, 0, 0);   // 12:20 - 13:30
    const spanC = tc.spanCtor(11, 30, 0, 0, 60, 0, 0);   // 11:30 - 12:30
    // this timespan starts before other, produces 1 remainder
    let result = spanA.difference(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 1, 'Expect one timespan in array.');
    assert.equal(result[0].getHours(), 12, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 0, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // this timespan ends after other, produces 1 remainder
    result = spanA.difference(spanC);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 1, 'Expect one timespan in array.');
    assert.equal(result[0].getHours(), 12, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // no overlap, original timespan returned
    result = spanC.difference(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 1, 'Expect one timespan in array.');
    assert.equal(result[0], spanC, 'Expected return of same timespan object.');
    assert.equal(result[0].getHours(), spanC.getHours(), 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), spanC.getMinutes(), 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), spanC.getSeconds(), 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), spanC.getMilliseconds(), 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), spanC.getDurationMins(), 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), spanC.getDurationSecs(), 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), spanC.getDurationMs(), 'Incorrect duration: milliseconds.');
  });

  it('Difference of timespans - two remainders', function() {

    const spanA = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);    // 01:00 - 02:00
    const spanB = tc.spanCtor(1, 20, 0, 0, 10, 0, 0);   // 01:20 - 01:40
    // produces two remainders
    let result = spanA.difference(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 2, 'Expect two timespans in array.');
    // first remainder from difference
    assert.equal(result[0].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[0].getMinutes(), 0, 'Incorrect start time: minutes.');
    assert.equal(result[0].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[0].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[0].getDurationMins(), 20, 'Incorrect duration: minutes.');
    assert.equal(result[0].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[0].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
    // second remainder from difference
    assert.equal(result[1].getHours(), 1, 'Incorrect start time: hours.');
    assert.equal(result[1].getMinutes(), 30, 'Incorrect start time: minutes.');
    assert.equal(result[1].getSeconds(), 0, 'Incorrect start time: seconds.');
    assert.equal(result[1].getMilliseconds(), 0, 'Incorrect start time: milliseconds.');
    assert.equal(result[1].getDurationMins(), 30, 'Incorrect duration: minutes.');
    assert.equal(result[1].getDurationSecs(), 0, 'Incorrect duration: seconds.');
    assert.equal(result[1].getDurationMs(), 0, 'Incorrect duration: milliseconds.');
  });

  it('Difference of timespans - no remainders', function() {

    const spanB = tc.spanCtor(1, 20, 0, 0, 10, 0, 0);   // 01:20 - 01:40
    const spanBb = tc.spanCtor(1, 20, 0, 0, 10, 0, 0);  // same as spanB
    const spanC = tc.spanCtor(1, 0, 0, 0, 60, 0, 0);    // 01:00 - 02:00
    // equal starts and ends, produces empty array
    let result = spanB.difference(spanB);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 0, 'Expect empty array.');
    result = spanB.subtract(spanBb);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 0, 'Expect empty array.');
    // other timespan exceeds begin and end times, produces empty array
    result = spanB.difference(spanC);
    assert.equal(_.isArray(result), true, 'Function should return an array.');
    assert.equal(result.length, 0, 'Expect empty array.');
  });

  it('String output of TimeSpan', function() {

    let spanA = tc.spanCtor(1, 2, 3, 4, 5, 6, 7);
    assert.equal(spanA.toString(), '[ 1:2:3:4, 5:6:7 ]', 'TimeSpan string not formatted as expected.');
  });

});

describe('TimeSpan - Sort', function() {

  it('Sort an empty array', function() {
    const spanArray = [];
    let result = tc.sortTimeSpans(spanArray);
    assert.notEqual(result, null, 'TimeSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
  });

  it('Sort an array of TimeSpan objects', function() {
    const spanArray = [];
    const timeSpanA = tc.spanCtor(9, 30, 30, 0, 60, 0, 0, 0);  // 9:30-10:30
    const timeSpanB = tc.spanCtor(10, 30, 30, 0, 60, 0, 0, 0); // 10:30-11:30
    const timeSpanC = tc.spanCtor(11, 30, 30, 0, 60, 0, 0, 0); // 11:30-12:30
    const timeSpanD = tc.spanCtor(12, 30, 30, 0, 60, 0, 0, 0); // 12:30-13:30
    // sort in ascending order
    spanArray.push(timeSpanD);
    spanArray.push(timeSpanC);
    spanArray.push(timeSpanB);
    spanArray.push(timeSpanA);
    let result = tc.sortTimeSpans(spanArray);
    assert.notEqual(result, null, 'TimeSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 4, 'Expected 4 elements in array.');
    assert.notEqual(result, spanArray, 'Method should return a new array object.');
    assert.equal(result[0], timeSpanA, 'Expected a different TimeSpan');
    assert.equal(result[1], timeSpanB, 'Expected a different TimeSpan');
    assert.equal(result[2], timeSpanC, 'Expected a different TimeSpan');
    assert.equal(result[3], timeSpanD, 'Expected a different TimeSpan');
    // sort in descending order again
    result = tc.sortTimeSpans(spanArray, true);
    assert.notEqual(result, null, 'TimeSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 4, 'Expected 4 elements in array.');
    assert.notEqual(result, spanArray, 'Method should return a new array object.');
    assert.equal(result[0], timeSpanD, 'Expected a different TimeSpan');
    assert.equal(result[1], timeSpanC, 'Expected a different TimeSpan');
    assert.equal(result[2], timeSpanB, 'Expected a different TimeSpan');
    assert.equal(result[3], timeSpanA, 'Expected a different TimeSpan');
  });
});

describe('TimeSpan - Merge List', function() {

  it('Merge empty list of non-intersecting timespans', function() {
    const list = [];
    const result = tc.mergeTimeSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 0, 'Array should contain the no elements.');
  });

  it('Merge list of four intersecting timespans', function() {
    const timeSpanA = tc.spanCtor(9, 30, 0, 0, 80, 0, 0, 0);  // 9:30-10:50
    const timeSpanB = tc.spanCtor(10, 30, 0, 0, 80, 0, 0, 0); // 10:30-11:50
    const timeSpanC = tc.spanCtor(11, 30, 0, 0, 80, 0, 0, 0); // 11:30-12:50
    const timeSpanD = tc.spanCtor(12, 30, 0, 0, 80, 0, 0, 0); // 12:30-13:50
    const list = [timeSpanA, timeSpanB, timeSpanC, timeSpanD];
    assert.notEqual(timeSpanA, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanB, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanC, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanD, null, 'TimeSpan object was not constructed.');
    const result = tc.mergeTimeSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged element.');
    assert.equal(result[0].getHours(), timeSpanA.getHours(), 'Incorrect start time of merged period.');
    assert.equal(result[0].getMinutes(), timeSpanA.getMinutes(), 'Incorrect start time of merged period.');
    assert.equal(result[0].getDurationMins(), 260, 'Incorrect duration of merged period.'); // 9:30-13:50
  });

  it('Merge list of four non-intersecting timespans', function() {
    const timeSpanA = tc.spanCtor(9, 30, 0, 0, 60, 0, 0, 0);  // 9:30-10:30
    const timeSpanB = tc.spanCtor(10, 30, 0, 0, 60, 0, 0, 0); // 10:30-11:30
    const timeSpanC = tc.spanCtor(11, 30, 0, 0, 60, 0, 0, 0); // 11:30-12:30
    const timeSpanD = tc.spanCtor(12, 30, 0, 0, 60, 0, 0, 0); // 12:30-13:30
    const list = [timeSpanA, timeSpanB, timeSpanC, timeSpanD];
    assert.notEqual(timeSpanA, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanB, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanC, null, 'TimeSpan object was not constructed.');
    assert.notEqual(timeSpanD, null, 'TimeSpan object was not constructed.');
    const result = tc.mergeTimeSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 4, 'Array should contain 4 original elements.');
  });

});
