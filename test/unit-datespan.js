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
tc.calcDuration = require('../').calcDuration;
tc.constants = require('../').constants;
/* useful Date objects for testing */
/* dates which don't span a leap day transition */
const dateA = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // 15th, 12:00
const dateB = new Date(Date.UTC(2017, 6, 16, 12, 0, 0, 0)); // 16th, 12:00
const dateC = new Date(Date.UTC(2017, 6, 17, 12, 0, 0, 0)); // 17th, 12:00
const dateD = new Date(Date.UTC(2017, 6, 17, 13, 0, 0, 0)); // 17th, 13:00
const dateE = new Date(Date.UTC(2017, 6, 17, 18, 0, 0, 0)); // 17th, 18:00
const dateF = new Date(Date.UTC(2017, 6, 18, 12, 0, 0, 0)); // 18th, 12:00
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


describe('DateSpan - Instantiation', function() {
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

  it('Attempt to create an date-span passing both end date and durations.', function() {
    assert.throws(function() {
                     tc.dateSpanCtor(dateA, dateB, 1, 2, 3);
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

describe('DateSpan - Duration', function() {

  it('Check total duration', function() {
    let span = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.notEqual(span, null, 'DateSpan object was not constructed.');
    assert.equal(span.getDurationMins(), 60, 'Expected different value for minutes component of duration.');
    assert.equal(span.getDurationSecs(), 40, 'Expected different value for seconds component of duration.');
    assert.equal(span.getDurationMs(), 20, 'Expected different value for milliseconds component of duration.');
    assert.equal(span.getTotalDuration(), (60*60*1000)+(40*1000)+20, 'Expected different value for total duration in milliseconds.');
  });

  it('Check total duration over multiple days', function() {
    let span = tc.dateSpanCtor(dateA, null, 5*24*60, 0, 0);
    assert.notEqual(span, null, 'DateSpan object was not constructed.');
    assert.equal(span.getDurationMins(), (5*24*60), 'Expected different value for minutes component of duration.');
    assert.equal(span.getDurationSecs(), 0, 'Expected different value for seconds component of duration.');
    assert.equal(span.getDurationMs(), 0, 'Expected different value for milliseconds component of duration.');
    assert.equal(span.getTotalDuration(), (5*24*60*60*1000)+(0*1000)+0, 'Expected different value for total duration in milliseconds.');
  });
});

describe('DateSpan - Equals', function() {

  it('Call isEqual with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.isEqual(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.isEqual(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.isEqual([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Date-spans which are equals', function() {
      let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
      let spanB = tc.dateSpanCtor(dateA, null, 60, 40, 20);
      assert.equal(spanA.isEqual(spanB), true, 'DateSpan objects should be equal.');
      assert.equal(spanB.isEqual(spanA), true, 'DateSpan objects should be equal.');
      assert.equal(spanA.isEqual(spanA), true, 'DateSpan objects should be equal.');
  });

  it('Date-spans which are not equals', function() {
      let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
      let spanB = tc.dateSpanCtor(dateA, null, 60, 40, 40); // different duration
      let spanC = tc.dateSpanCtor(dateB, null, 60, 40, 20); // different begin time
      assert.equal(spanA.isEqual(spanB), false, 'DateSpan have different durations.');
      assert.equal(spanB.isEqual(spanA), false, 'DateSpan have different durations.');
      assert.equal(spanA.isEqual(spanC), false, 'DateSpan have different begin times.');
      assert.equal(spanC.isEqual(spanA), false, 'DateSpan have different begin times.');
      assert.equal(spanB.isEqual(spanC), false, 'DateSpan are different.');
      assert.equal(spanC.isEqual(spanB), false, 'DateSpan are different.');
  });
});

describe('DateSpan - Intersection', function() {

  it('Call isIntersect with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.isIntersect(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.isIntersect(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.isIntersect([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

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

describe('DateSpan - Union', function() {

  it('Call union with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.union(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.union(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.union([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

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
});

describe('DateSpan - Merge List', function() {

  it('Call mergeDateSpans() with invalid argument', function() {
    assert.throws(function() {
                     tc.mergeDateSpans(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     tc.mergeDateSpans(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     tc.mergeDateSpans({});
                    },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Merge list of four sorted non-intersecting date-spans', function() {
    const dateSpanA = tc.dateSpanCtor(dateA, null, 1*60); // 1 hr
    const dateSpanB = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    const dateSpanC = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    const dateSpanD = tc.dateSpanCtor(dateF, null, 1*60); // 1 hr
    const list = [dateSpanA, dateSpanB, dateSpanC, dateSpanD];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 4, 'Array should contain the four original elements.');
  });

  it('Merge list of four unsorted non-intersecting date-spans', function() {
    const dateSpanA = tc.dateSpanCtor(dateA, null, 1*60); // 1 hr
    const dateSpanB = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    const dateSpanC = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    const dateSpanD = tc.dateSpanCtor(dateF, null, 1*60); // 1 hr
    const list = [dateSpanD, dateSpanC, dateSpanB, dateSpanA];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 4, 'Array should contain the four original elements.');
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
    let periodC = tc.dateSpanCtor(dateF, null, 10*60); // 10 hrs
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
    const result = tc.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged date-span.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), periodC.getEnd().getTime(), 'Incorrect end date of merged period.');
  });
});

describe('DateSpan - Intersection', function() {

  it('Call subtract() with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.intersect(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.intersect(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.intersect([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Get the Intersection of two intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.intersect(dateSpanB);
    assert.notEqual(periodC, null, 'DateSpan object was not returned by method.');
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

describe('DateSpan - Subtract', function() {

  it('Call subtract() with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.subtract(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.subtract(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.subtract([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Subtraction of two intersecting date-spans - 2 remainders', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 30 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 2, 'Expect array to have 2 elements.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'First remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'First remainder has incorrect end time.');
    assert.equal(result[1].getBegin().getTime(), dateD.getTime(), 'Second remainder has incorrect start time.');
    assert.equal(result[1].getEnd().getTime(), dateE.getTime(), 'Second remainder has incorrect end time.');
  });

  it('Subtraction of two intersecting date-spans - equal starts - 1 remainder', function() {
    let dateSpanA = tc.dateSpanCtor(dateC, null, 24*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateC, null, 60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 1, 'Expect array to have 1 element.');
    assert.equal(result[0].getBegin().getTime(), dateD.getTime(), 'Remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateF.getTime(), 'Remainder has incorrect end time.');
  });

  it('Subtraction of two intersecting date-spans - equal ends - 1 remainder', function() {
    let dateSpanA = tc.dateSpanCtor(dateC, null, 24*60); // 24 hrs
    let dateSpanB = tc.dateSpanCtor(dateD, null, 23*60); // 23 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.notEqual(result, null, 'DateSpan objects were not subtracted.');
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 1, 'Expect array to have 1 element.');
    assert.equal(result[0].getBegin().getTime(), dateC.getTime(), 'Remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateD.getTime(), 'Remainder has incorrect end time.');
  });

  it('Subtraction of two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.subtract(dateSpanB);
    assert.equal(periodC, null, 'Subtraction should have returned null.');
  });

  it('Subtraction of two partially intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 26*60); // 26 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 10 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.subtract(dateSpanB);
    assert.equal(periodC, null, 'Subtraction should have returned null.');
  });
});

describe('DateSpan - Difference', function() {

  it('Call difference with invalid argument', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 60, 40, 20);
    assert.throws(function() {
                     spanA.difference(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.difference(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     spanA.difference([]);
                    },
                    Error,
                    'Expected method to throw an error.');
  });

  it('Difference of two completely intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 30*60); // 16th 12:00 - 17th 18:00
    let dateSpanB = tc.dateSpanCtor(dateC, null, 60); // 17th 12:00 - 17th 13:00
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    // primary datespan exceeds the start and end times of secondary datespan
    let result = dateSpanA.difference(dateSpanB);
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 2, 'Expect array to have 2 elements.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'First remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'First remainder has incorrect end time.');
    assert.equal(result[1].getBegin().getTime(), dateD.getTime(), 'Second remainder has incorrect start time.');
    assert.equal(result[1].getEnd().getTime(), dateE.getTime(), 'Second remainder has incorrect end time.');
    // primary datespan is exceeded by the start and end times of secondary datespan
    result = dateSpanB.difference(dateSpanA);
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 0, 'Expect array to have 0 elements.');
  });

  it('Difference of two non-intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = tc.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.difference(dateSpanB);
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 1, 'Expect array to have 1 element.');
    assert.equal(result[0], dateSpanA, 'Expected primary DateSpan to be returned.');
  });

  it('Difference of two partially intersecting date-spans', function() {
    let dateSpanA = tc.dateSpanCtor(dateB, null, 26*60); // 16th 12:00 - 17th 14:00
    let dateSpanB = tc.dateSpanCtor(dateC, null, 10*60); // 17th 12:00 - 17th 22:00
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    // primary datespan starts before the secondary
    let result = dateSpanA.difference(dateSpanB);
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 1, 'Expect array to have 1 elements.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'First remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'First remainder has incorrect end time.');
    // primary datespan starts after the secondary
    result = dateSpanB.difference(dateSpanA);
    assert.equal(_.isArray(result), true, 'Method should return an array.');
    assert.equal(result.length, 1, 'Expect array to have 1 elements.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime()+(26*60*60*1000), 'Remainder has incorrect start time.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime()+(10*60*60*1000), 'Remainder has incorrect end time.');
  });
});

describe('DateSpan - Sort', function() {

  it('Call sortDateSpans() with invalid argument', function() {
    assert.throws(function() {
                     tc.sortDateSpans(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     tc.sortDateSpans(undefined);
                    },
                    Error,
                    'Expected method to throw an error.');
    assert.throws(function() {
                     tc.sortDateSpans({});
                    },
                    Error,
                    'Expected method to throw an error.');
  });

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
    const dateSpanD = tc.dateSpanCtor(dateF, null, 1*60); // 1 hr
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

describe('DateSpan - String', function() {
  it('String output of DateSpan', function() {
    let spanA = tc.dateSpanCtor(dateA, null, 11, 22, 33);
    assert.equal(spanA.toString(), '[ '+ dateA.toISOString()+', 11:22:33 ]', 'TimeSpan string not formatted as expected.');
  });
});

describe('DateSpan - Calculate Duration Function', function() {

    it('Call calcDuration() with invalid arguments', function() {
      assert.throws(function() {
                       tc.calcDuration(null, null);
                      },
                      Error,
                      'Expected method to throw an error.');
      assert.throws(function() {
                       tc.calcDuration(undefined, undefined);
                      },
                      Error,
                      'Expected method to throw an error.');
      assert.throws(function() {
                       tc.calcDuration({});
                      },
                      Error,
                      'Expected method to throw an error.');
      assert.throws(function() {
                       tc.calcDuration(null, tc.constants.DURATION_RAW_MSECS);
                      },
                      Error,
                      'Expected method to throw an error.');
      assert.throws(function() {
                       tc.calcDuration(undefined, tc.constants.DURATION_RAW_MSECS);
                      },
                      Error,
                      'Expected method to throw an error.');
    });

    it('Call calcDuration() for an empty array', function() {
      const spanArray = [];
      let result = tc.calcDuration(spanArray, tc.constants.DURATION_RAW_MSECS);
      assert.equal(result, 0, 'Method should return zero for duration.');
    });

    it('Calculate duration: Raw milliseconds, no overlap.', function() {
      const spanArray = [];
      const dateSpanA = tc.dateSpanCtor(dateA, null, 1*30); // 30 minutes
      const dateSpanB = tc.dateSpanCtor(dateB, null, 1*30); // 30 minutes
      const dateSpanC = tc.dateSpanCtor(dateC, null, 1*30); // 30 minutes
      const dateSpanD = tc.dateSpanCtor(dateF, null, 1*30); // 30 minutes
      // sort in ascending order
      spanArray.push(dateSpanD);
      spanArray.push(dateSpanC);
      spanArray.push(dateSpanB);
      spanArray.push(dateSpanA);
      let result = tc.calcDuration(spanArray, tc.constants.DURATION_RAW_MSECS);
      assert.equal(result, 2*tc.constants.MSECS_PER_HOUR, 'Total duration is incorrect.');
    });

    it('Calculate duration: Raw milliseconds with overlap.', function() {
      const spanArray = [];
      const dateSpanC = tc.dateSpanCtor(dateC, null, 2*60); // 1 hr
      const dateSpanD = tc.dateSpanCtor(dateD, null, 2*60); // 1 hr
      // sort in ascending order
      spanArray.push(dateSpanD);
      spanArray.push(dateSpanC);
      let result = tc.calcDuration(spanArray, tc.constants.DURATION_RAW_MSECS);
      assert.equal(result, 3*tc.constants.MSECS_PER_HOUR, 'Total duration is incorrect.');
    });
});
