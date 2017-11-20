/**
 * unit-datespan.js
 * Copyright(c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 140] */

'use strict';

/* dependencies */
const assert = require('assert');
const _ = require('lodash');
const tc = {};
tc.dateSpanCtor = require('../').dateSpan;
tc.mergeDateSpans = require('../').mergeDateSpans;
tc.sortDateSpans = require('../').sortDateSpans;
/* useful Date objects for testing */
/* dates which don't span a leap day transition */
const dateA = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // 15th, 12:00
const dateB = new Date(Date.UTC(2017, 6, 16, 12, 0, 0, 0)); // 16th, 12:00
const dateC = new Date(Date.UTC(2017, 6, 17, 12, 0, 0, 0)); // 17th, 12:00
const dateD = new Date(Date.UTC(2017, 6, 18, 12, 0, 0, 0)); // 18th, 12:00
/* dates which do span a leap day transition */
const dateLeapB = new Date(Date.UTC(2016, 1, 28, 12, 0, 0, 0));
const dateLeapC = new Date(Date.UTC(2016, 1, 29, 12, 0, 0, 0));
const dateLeapD = new Date(Date.UTC(2016, 2, 1, 12, 0, 0, 0));


before(function() {

});

beforeEach(function() {

});

afterEach(function() {

});

after(function() {

});


describe('Date-Span - Instantiation', function() {
  it('Create valid minimum duration date-span', function() {
    let periodObject = tc.dateSpanCtor(dateA, null, 0, 0, 1);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid minimum-ish duration date-span', function() {
    let periodObject = tc.dateSpanCtor(dateA, null, 1);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid maximum duration date-span', function() {
    let periodObject = tc.dateSpanCtor(dateA, null, Number.MAX_SAFE_INTEGER, 59, 999);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid date-span using end date', function() {
    let periodObject = tc.dateSpanCtor(dateA, dateB);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid date-span using end date and zero durations', function() {
    let periodObject = tc.dateSpanCtor(dateA, dateB, 0, 0, 0);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid date-span using end date and null durations', function() {
    let periodObject = tc.dateSpanCtor(dateA, dateB, null, null, null);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Attempt to create an date-span with a null begin argument.', function() {
    assert.throws(function() {
 tc.dateSpanCtor(null, null, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create an date-span with an invalid (array) begin argument.', function() {
    assert.throws(function() {
 tc.dateSpanCtor([], null, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create an date-span with an invalid type of begin argument.', function() {
    assert.throws(function() {
 tc.dateSpanCtor({}, null, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create a date-span with negative durations', function() {
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, 0, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, 0, 0, Number.MIN_SAFE_INTEGER);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create a date-span with out-of-range durations', function() {
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, Number.MIN_SAFE_INTEGER+1);
},
                    Error,
                    'Expected functional constructor to throw an error (inDurationMins).');
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, 0, 60, 0);
},
                    Error,
                    'Expected functional constructor to throw an error (inDurationSecs).');
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, 0, 0, 1000);
},
                    Error,
                    'Expected functional constructor to throw an error (inDurationMSecs).');
  });

  it('Attempt to create an invalid date-span using floating point arguments.', function() {
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, Number.MAX_VALUE);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create an invalid date-span using a string argument.', function() {
    assert.throws(function() {
 tc.dateSpanCtor(dateA, null, 'ABCD');
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create an date-span using incorrect end date.', function() {
    assert.throws(function() {
 tc.dateSpanCtor(dateB, dateA);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });
});

describe('Date-Span - Duration', function() {
  it('Check total duration', function() {
    let span = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.notEqual(span, null, 'DateSpan object was not constructed.');
    assert.equal(span.getDurationMins(), 60, 'Expected different value for minutes component of duration.');
    assert.equal(span.getDurationSecs(), 40, 'Expected different value for seconds component of duration.');
    assert.equal(span.getDurationMs(), 20, 'Expected different value for milliseconds component of duration.');
    assert.equal(span.getTotalDuration(), (60*60*1000)+(40*1000)+20, 'Expected different value for total duration in milliseconds.');
  });
});

describe('Date-Span - Intersection', function() {
  it('Check two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.isIntersect(dateSpanB);
    assert.ok(result, 'DateSpan objects are intersecting.');
  });

  it('Check two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.isIntersect(dateSpanB);
    assert.equal(result, false, 'DateSpan objects are intersecting.');
  });
});

describe('Date-Span - Union', function() {
  it('Union of two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.union(dateSpanB);
    assert.notEqual(periodC, null, 'DateSpan objects were not merged.');
  });

  it('Union of two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.union(dateSpanB);
    assert.equal(periodC, null, 'Merge should have returned null as they don\'t overlap.');
  });

  it('Merge list of non-intersecting date-spans', function() {
    const dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    const dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    const list = [dateSpanA, dateSpanB];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 2, 'Array should contain the two original elements.');
  });

  it('Merge empty list of non-intersecting date-spans', function() {
    const list = [];
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 0, 'Array should contain the no elements.');
  });

  it('Merge list of two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    const list = [dateSpanA, dateSpanB];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged element.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), dateSpanB.getEnd().getTime(), 'Incorrect end date of merged period.');
  });

  it('Merge list of three intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 30*60); // 10 hrs
    let periodC = tc.dateSpanCtor(dateD, null, 10*60); // 10 hrs
    const list = [dateSpanA, dateSpanB, periodC];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    assert.notEqual(periodC, null, 'DateSpan object was not constructed.');
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged original elements.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), periodC.getEnd().getTime(), 'Incorrect end date of merged period.');
  });

  it('Merge list of three intersecting date-spans. Periods span leap day.', function() {
    let dateSpanA = tc.dateSpanCtor(dateLeapB, null, 30*60); // 30 hrs
    let dateSpanB = tc.dateSpanCtor(dateLeapC, null, 30*60); // 30 hrs
    let periodC = tc.dateSpanCtor(dateLeapD, null, 30*60); // 30 hrs
    const list = [dateSpanA, dateSpanB, periodC];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    assert.notEqual(periodC, null, 'DateSpan object was not constructed.');
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end:${dateSpanA.getEnd()}`); // debug
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end:${dateSpanB.getEnd()}`); // debug
    // console.log(`periodC begin: ${periodC.getBegin()}, end:${periodC.getEnd()}`); // debug
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged date-span.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), periodC.getEnd().getTime(), 'Incorrect end date of merged period.');
  });
});

describe('Date-Span - Intersection', function() {
  it('Get the Intersection of two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end: ${dateSpanA.getEnd()}, duration: ${dateSpanA.getDuration()}`);
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end: ${dateSpanB.getEnd()}, duration: ${dateSpanB.getDuration()}`);
    let periodC = dateSpanA.intersect(dateSpanB);
    assert.notEqual(periodC, null, 'DateSpan object was not returned by method.');
    // console.log(`periodC begin: ${periodC.getBegin()}, end: ${periodC.getEnd()}, duration: ${periodC.getDuration()}`);
    assert.equal(periodC.getBegin().getTime(), dateC.getTime(), 'Incorrect start time of overlapped date-span');
    assert.equal(periodC.getDurationMins(), 6*60, 'Incorrect duration of overlapped date-span'); // expecting 6 hours overlap
  });

  it('Get the overlap of two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.intersect(dateSpanB);
    assert.equal(periodC, null, 'Method should have returned null as they don\'t overlap.');
  });
});

describe('Date-Span - Subtract', function() {
  it('Subtraction of two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 30 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    // TODO check start and duration of remainders
  });

  it('Subtraction of two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.subtract(dateSpanB);
    assert.equal(periodC, null, 'Subtraction should have returned null.');
  });
});

describe('Date-Span - Sort', function() {
  it('Sort an empty array', function() {
    const spanArray = [];
    let result = tc.sortDateSpans(spanArray);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
  });

  it('Sort an array of DateSpan objects', function() {
    const spanArray = [];
    const dateSpanA = tc.dateSpanCtor(dateA, null, 1*60); // 1 hr
    const dateSpanB = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    const dateSpanC = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    const dateSpanD = tc.dateSpanCtor(dateD, null, 1*60); // 1 hr
    // sort in ascending order
    spanArray.push(dateSpanD);
    spanArray.push(dateSpanC);
    spanArray.push(dateSpanB);
    spanArray.push(dateSpanA);
    let result = tc.sortDateSpans(spanArray);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 4, 'Expected 4 elements in array.');
    assert.notEqual(result, spanArray, 'Method should return a new array object.');
    assert.equal(result[0], dateSpanA, 'Expected a different DateSpan');
    assert.equal(result[1], dateSpanB, 'Expected a different DateSpan');
    assert.equal(result[2], dateSpanC, 'Expected a different DateSpan');
    assert.equal(result[3], dateSpanD, 'Expected a different DateSpan');
    // sort in descending order again
    result = tc.sortDateSpans(spanArray, true);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 4, 'Expected 4 elements in array.');
    assert.notEqual(result, spanArray, 'Method should return a new array object.');
    assert.equal(result[0], dateSpanD, 'Expected a different DateSpan');
    assert.equal(result[1], dateSpanC, 'Expected a different DateSpan');
    assert.equal(result[2], dateSpanB, 'Expected a different DateSpan');
    assert.equal(result[3], dateSpanA, 'Expected a different DateSpan');
  });
});
