/**
 * unit-timerule.js
 * Copyright(c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 120] */

'use strict';

/* dependencies */
const assert = require('assert');
const _ = require('lodash');
const momenttz = require('moment-timezone');

const testContext = {};
testContext.module = require('../');
testContext.timeSpanCtor = testContext.module.timeSpan;
testContext.dateSpanCtor = testContext.module.dateSpan;
testContext.ruleRuleCtor = testContext.module.timeRule;


/* useful Date objects for testing */
/* dates which don't span a leap day transition i.e. 29th of Feb. of leap year */
const dateA = new Date(Date.UTC(2017, 6, 14, 12, 0, 0, 0)); // Saturday
const dateB = new Date(Date.UTC(2017, 6, 15, 10, 0, 0, 0));
const dateC = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // Saturday
const dateD = new Date(Date.UTC(2017, 6, 15, 13, 0, 0, 0));
const dateE = new Date(Date.UTC(2017, 6, 15, 14, 0, 0, 0));
const dateF = new Date(Date.UTC(2017, 6, 15, 16, 0, 0, 0));
const dateG = new Date(Date.UTC(2017, 6, 15, 18, 0, 0, 0));
const dateH = new Date(Date.UTC(2017, 6, 15, 22, 0, 0, 0)); // Saturday
const dateI = new Date(Date.UTC(2017, 6, 16, 2, 0, 0, 0)); // Sunday
const dateJ = new Date(Date.UTC(2017, 6, 16, 13, 0, 0, 0)); // Sunday
/* dates which do span a leap day transition */
const dateLeapA = new Date(Date.UTC(2016, 1, 27, 12, 0, 0, 0));
const dateLeapB = new Date(Date.UTC(2016, 1, 28, 12, 0, 0, 0));
const dateLeapC = new Date(Date.UTC(2016, 1, 29, 12, 0, 0, 0));
const dateLeapD = new Date(Date.UTC(2016, 2, 1, 12, 0, 0, 0));
const dateLeapE = new Date(Date.UTC(2016, 2, 2, 12, 0, 0, 0));

/* timezones */
const TZ_UTC = 'Etc/UTC'; // UTC timezone
const TZ_PLUS_FOUR = 'Asia/Dubai'; // UTC+4 timezone
const TZ_MINUS_FOUR = 'America/Antigua'; // UTC-4 timezone

before(function() {

});

beforeEach(function() {

});

afterEach(function() {

});

after(function() {

});


describe('Time Rule - Instantiation', function() {
  it('Create valid time-rule', function() {
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.MONDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
  });

  it('Attempt to create time-rule with null arguments', function() {

    assert.throws(function() { testContext.ruleRuleCtor(null,
                                                        testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                        testContext.module.MONDAY,
                                                        TZ_UTC)},
                    Error,
                    'Expected functional constructor to throw an error.');
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() { testContext.ruleRuleCtor(timespan,
                                                        testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                        null,
                                                        TZ_UTC)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create time-rule with negative time arguments', function() {

    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() { testContext.ruleRuleCtor(timespan,
                                                        testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                        -9,
                                                        TZ_UTC)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create time-rule with out-of-range arguments', function() {

    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() { testContext.ruleRuleCtor(timespan,
                                                        testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                        testContext.module.SUNDAY-100,
                                                        TZ_UTC)},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() { testContext.ruleRuleCtor(timespan,
                                                          testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                          testContext.module.SATURDAY+100,
                                                          TZ_UTC)},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

});


/**
 * Check if a Date coincides exactly with midnight in a specific timezone.
 * @param {object} inDate Date to be checked.
 * @param {number} inTZ Timezone identifier string.
 * @return true if inDate coincides with midnight, otherwise false.
 */
const isMidnight = function isMidnightFunc(inDate, inTZ) {

  let retval = false;
  let tzMoment = null;
  if(_.isDate(inDate) === false
      || _.isString(inTZ) === false) {
    throw new Error('Invalid arguments passed to function.');
  }
  tzMoment = momenttz.tz(inDate, inTZ);
  if(tzMoment.get('hour') === 0
      && tzMoment.get('minutes') === 0) {
    retval = true;
  }
  return retval;
}

describe('Time Rule - Generate Time Periods. Timezone: UTC.', function() {
  it('Create valid time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateC, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateF.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateH.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid time-rule but query date-span with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateE, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no time-periods.');
  });
});

describe('Time Rule - Generate Time Periods. Timezone: UTC+4 hours.', function() {
  it('Create valid time-rule and get period.', function() {
    let timespan = testContext.timeSpanCtor(14, 0, 0, 0, 8*60); // 14:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateA, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one time period.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateB}`);
    assert.equal(result[0].getEnd().getTime(), dateG.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateG}`);
  });

  it('Create valid time-rule. Query date-span before rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(18, 0, 0, 0, 1*60); // 13:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateC, dateD);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no time-periods.');
  });

  it('Create valid time-rule. Query date-span after rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 23:00-00:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateE, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no time-periods.');
  });
});

describe('Time Rule - Generate Time Periods. Timezone: UTC-4 hours.', function() {
  it('Create valid time-rule and get period.', function() {
    let timespan = testContext.timeSpanCtor(14, 0, 0, 0, 8*60); // 14:00-22:00 UTC-4
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateA, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one time period.');
    assert.equal(result[0].getBegin().getTime(), dateG.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateG}`);
    assert.equal(result[0].getEnd().getTime(), dateI.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateI}`);
  });

  it('Create valid time-rule. Query date-span before rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(18, 0, 0, 0, 1*60); // 13:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateC, dateD);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no time-periods.');
  });

  it('Create valid time-rule. Query date-span after rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 23:00-00:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.module.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.module.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.getDateSpans(dateG, dateJ);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no time-periods.');
  });
});
