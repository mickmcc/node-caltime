/**
 * unit-datespan.js
 * Copyright(c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 120] */

'use strict';

/* dependencies */
const assert = require('assert');
const testContext = {};
testContext.dateSpanCtor = require('../').dateSpan;
testContext.mergeDateSpans = require('../').mergeDateSpans;

/* useful Date objects for testing */
/* dates which don't span a leap day transition */
const dateA = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0));
const dateB = new Date(Date.UTC(2017, 6, 16, 12, 0, 0, 0));
const dateC = new Date(Date.UTC(2017, 6, 17, 12, 0, 0, 0));
const dateD = new Date(Date.UTC(2017, 6, 18, 12, 0, 0, 0));
const dateE = new Date(Date.UTC(2017, 6, 19, 12, 0, 0, 0));
/* dates which do span a leap day transition */
const dateLeapA = new Date(Date.UTC(2016, 1, 27, 12, 0, 0, 0));
const dateLeapB = new Date(Date.UTC(2016, 1, 28, 12, 0, 0, 0));
const dateLeapC = new Date(Date.UTC(2016, 1, 29, 12, 0, 0, 0));
const dateLeapD = new Date(Date.UTC(2016, 2, 1, 12, 0, 0, 0));
const dateLeapE = new Date(Date.UTC(2016, 2, 2, 12, 0, 0, 0));


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
    let periodObject = testContext.dateSpanCtor(dateA, null, 1);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid maximum duration date-span', function() {
    let periodObject = testContext.dateSpanCtor(dateA, null, Number.MAX_SAFE_INTEGER);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Create valid date-span using end date', function() {
    let periodObject = testContext.dateSpanCtor(dateA, dateB);
    assert.notEqual(periodObject, null, 'DateSpan object was not constructed.');
  });

  it('Attempt to create an date-span with a null begin argument.', function() {
    try {
      let periodObject = testContext.dateSpanCtor(null, null, Number.MIN_SAFE_INTEGER);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create an date-span with an invalid (array) begin argument.', function() {
    try {
      let periodObject = testContext.dateSpanCtor([], null, Number.MIN_SAFE_INTEGER);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create an date-span with an invalid type of begin argument.', function() {
    try {
      let periodObject = testContext.dateSpanCtor({}, null, Number.MIN_SAFE_INTEGER);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create a date-span with negative duration', function() {
    try {
      let periodObject = testContext.dateSpanCtor(dateA, null, Number.MIN_SAFE_INTEGER);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create a date-span with zero duration', function() {
    try {
      let periodObject = testContext.dateSpanCtor(dateA, null, 0);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create an invalid date-span using floating point arguments.', function() {
    try {
      let periodObject = testContext.dateSpanCtor(dateA, null, Number.MAX_VALUE);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create an invalid date-span using a string argument.', function() {
    try {
      let periodObject = testContext.dateSpanCtor(dateA, null, '456');
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });

  it('Attempt to create an date-span using incorrect end date.', function() {
    try {
      let periodObject = testContext.dateSpanCtor(dateB, dateA);
      assert.equal(periodObject, null, 'DateSpan object was not constructed.');
    } catch (e) {
      assert.ok(true, 'Exception not thrown as expected.');
    }
  });
});

describe('Date-Span - Overlap', function() {
  it('Check two overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.isOverlapping(dateSpanB);
    assert.ok(result, 'DateSpan objects are overlapping.');
  });

  it('Check two non-overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.isOverlapping(dateSpanB);
    assert.equal(result, false, 'DateSpan objects are overlapping.');
  });
});

describe('Date-Span - Merge', function() {
  it('Merge two overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.merge(dateSpanB);
    assert.notEqual(periodC, null, 'DateSpan objects were not merged.');
  });

  it('Merge two non-overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.merge(dateSpanB);
    assert.equal(periodC, null, 'Merge should have returned null as they don\'t overlap.');
  });

  it('Merge list of non-overlapping date-spans', function() {
    const dateSpanA = testContext.dateSpanCtor(dateB, null, 1*60); // 1 hr
    const dateSpanB = testContext.dateSpanCtor(dateC, null, 1*60); // 1 hr
    const list = [dateSpanA, dateSpanB];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = testContext.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 2, 'Array should contain the two original elements.');
  });

  it('Merge empty list of non-overlapping date-spans', function() {
    const list = [];
    const result = testContext.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 0, 'Array should contain the no elements.');
  });

  it('Merge list of two overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    const list = [dateSpanA, dateSpanB];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    const result = testContext.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged element.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), dateSpanB.getEnd().getTime(), 'Incorrect end date of merged period.');
  });

  it('Merge list of three overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 30*60); // 10 hrs
    let periodC = testContext.dateSpanCtor(dateD, null, 10*60); // 10 hrs
    const list = [dateSpanA, dateSpanB, periodC];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    assert.notEqual(periodC, null, 'DateSpan object was not constructed.');
    const result = testContext.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged original elements.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), periodC.getEnd().getTime(), 'Incorrect end date of merged period.');
  });

  it('Merge list of three overlapping date-spans. Periods span leap day.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateLeapB, null, 30*60); // 30 hrs
    let dateSpanB = testContext.dateSpanCtor(dateLeapC, null, 30*60); // 30 hrs
    let periodC = testContext.dateSpanCtor(dateLeapD, null, 30*60); // 30 hrs
    const list = [dateSpanA, dateSpanB, periodC];
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    assert.notEqual(periodC, null, 'DateSpan object was not constructed.');
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end:${dateSpanA.getEnd()}`); // debug
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end:${dateSpanB.getEnd()}`); // debug
    // console.log(`periodC begin: ${periodC.getBegin()}, end:${periodC.getEnd()}`); // debug
    const result = testContext.mergeDateSpans(list);
    assert.notEqual(result, null, 'Function should return an array.');
    assert.equal(result.length, 1, 'Array should contain one merged date-span.');
    assert.equal(result[0].getBegin().getTime(), dateSpanA.getBegin().getTime(), 'Incorrect start date of merged period.');
    assert.equal(result[0].getEnd().getTime(), periodC.getEnd().getTime(), 'Incorrect end date of merged period.');
  });
});

describe('Date-Span - Overlap', function() {
  it('Get the Overlap of two overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 30*60); // 24 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end: ${dateSpanA.getEnd()}, duration: ${dateSpanA.getDuration()}`);
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end: ${dateSpanB.getEnd()}, duration: ${dateSpanB.getDuration()}`);
    let periodC = dateSpanA.overlap(dateSpanB);
    assert.notEqual(periodC, null, 'DateSpan object was not returned by method.');
    // console.log(`periodC begin: ${periodC.getBegin()}, end: ${periodC.getEnd()}, duration: ${periodC.getDuration()}`);
    assert.equal(periodC.getBegin().getTime(), dateC.getTime(), 'Incorrect start time of overlapped date-span');
    assert.equal(periodC.getDuration(), 6*60, 'Incorrect duration of overlapped date-span'); // expecting 6 hours overlap
  });

  it('Get the overlap of two non-overlapping date-spans', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 1*60); // 1 hr
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 1*60); // 1 hr
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let periodC = dateSpanA.overlap(dateSpanB);
    assert.equal(periodC, null, 'Method should have returned null as they don\'t overlap.');
  });
});

describe('Date-Span - Subtract', function() {
  it('Subtract smaller date-span from larger date-span. 2 remainders.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 60*60); // 60 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.equal(typeof result, 'object', 'Method should return an array.');
    assert.notEqual(typeof result.length, 'undefined', 'Expect array with member length.');
    assert.equal(result.length, 2, 'Expect 2 date-spans as remainders of subtraction.');
    let remainder = result[0];
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end: ${dateSpanA.getEnd()}`); // debug
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end: ${dateSpanB.getEnd()}`); // debug
    // console.log(`result[0] begin: ${result[0].getBegin()}, end: ${result[0].getEnd()}`); // debug
    // console.log(`result[1] begin: ${result[1].getBegin()}, end: ${result[1].getEnd()}`); // debug
    assert.equal(remainder.getBegin().getTime(), dateSpanA.getBegin().getTime(), 'First remainder period starts at wrong time.' );
    assert.equal(remainder.getEnd().getTime(), dateSpanB.getBegin().getTime(), 'First remainder period ends at wrong time.' );
    remainder = result[1];
    assert.equal(remainder.getBegin().getTime(), dateSpanB.getEnd().getTime(), 'Second remainder period starts at wrong time.' );
    assert.equal(remainder.getEnd().getTime(), dateSpanA.getEnd().getTime(), 'Second remainder period ends at wrong time.' );
  });

  it('Subtract date-spans. Equal begin times. 1 remainder.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 60*60); // 60 hrs
    let dateSpanB = testContext.dateSpanCtor(dateB, null, 10*60); // 10 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.equal(typeof result, 'object', 'Method should return an array.');
    assert.notEqual(typeof result.length, 'undefined', 'Expect array with member length.');
    assert.equal(result.length, 1, 'Expect 1 date-span as remainder of subtraction.');
    let remainder = result[0];
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end: ${dateSpanA.getEnd()}`); // debug
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end: ${dateSpanB.getEnd()}`); // debug
    // console.log(`result[0] begin: ${result[0].getBegin()}, end: ${result[0].getEnd()}`); // debug
    assert.equal(remainder.getBegin().getTime(), dateSpanB.getEnd().getTime(), 'First remainder period starts at wrong time.' );
    assert.equal(remainder.getEnd().getTime(), dateSpanA.getEnd().getTime(), 'First remainder period ends at wrong time.' );
  });

  it('Subtract date-spans. Equal end times. 1 remainder.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 60*60); // 60 hrs
    let dateSpanB = testContext.dateSpanCtor(dateC, null, 36*60); // 36 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    // console.log(`dateSpanA begin: ${dateSpanA.getBegin()}, end: ${dateSpanA.getEnd()}`); // debug
    // console.log(`dateSpanB begin: ${dateSpanB.getBegin()}, end: ${dateSpanB.getEnd()}`); // debug
    let result = dateSpanA.subtract(dateSpanB);
    assert.equal(typeof result, 'object', 'Method should return an array.');
    assert.notEqual(typeof result.length, 'undefined', 'Expect array with member length.');
    assert.equal(result.length, 1, 'Expect 1 date-span as remainder of subtraction.');
    let remainder = result[0];
    // console.log(`result[0] begin: ${result[0].getBegin()}, end: ${result[0].getEnd()}`); // debug
    assert.equal(remainder.getBegin().getTime(), dateSpanA.getBegin().getTime(), 'First remainder period starts at wrong time.' );
    assert.equal(remainder.getEnd().getTime(), dateSpanB.getBegin().getTime(), 'First remainder period ends at wrong time.' );
  });

  it('Subtract two equal date-spans. 0 remainders.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 20*60); // 20 hrs
    let dateSpanB = testContext.dateSpanCtor(dateB, null, 20*60); // 20 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    assert.notEqual(dateSpanB, null, 'DateSpan object was not constructed.');
    let result = dateSpanA.subtract(dateSpanB);
    assert.equal(typeof result, 'object', 'Method should return an array.');
    assert.notEqual(typeof result.length, 'undefined', 'Expect array with member length.');
    assert.equal(result.length, 0, 'Expect 0 date-spans as remainders of subtraction.');
  });

  it('Subtract null from date-span.', function() {
    let dateSpanA = testContext.dateSpanCtor(dateB, null, 60*60); // 60 hrs
    assert.notEqual(dateSpanA, null, 'DateSpan object was not constructed.');
    try {
      let result = dateSpanA.subtract(null);
      assert.ok(false, 'Method should have thrown an error for null argument.');
    }
    catch(err) {
      return;
    }
  });
});
