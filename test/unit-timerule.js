/**
 * unit-timerule.js
 * Copyright(c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 160] */

'use strict';

/* dependencies */
const assert = require('assert');
// const _ = require('lodash');
// const momenttz = require('moment-timezone');

const testContext = {};
testContext.module = require('../');
testContext.timeSpanCtor = testContext.module.timeSpan;
testContext.dateSpanCtor = testContext.module.dateSpan;
testContext.ruleRuleCtor = testContext.module.timeRule;
testContext.constants = testContext.module.constants;

/* useful Date objects for testing */
/* dates which don't span a leap day transition i.e. 29th of Feb. of leap year */
const dateA = new Date(Date.UTC(2017, 6, 1, 0, 0, 0, 0)); // Saturday, 1st day of July
const dateB = new Date(Date.UTC(2017, 6, 5, 16, 0, 0, 0)); // First Wed. of July, 16:00
const dateC = new Date(Date.UTC(2017, 6, 5, 17, 0, 0, 0)); // Last Wed. of July, 17:00
const dateD = new Date(Date.UTC(2017, 6, 12, 16, 0, 0, 0)); // Second Wed. of July, 16:00
const dateE = new Date(Date.UTC(2017, 6, 12, 17, 0, 0, 0)); // Second Wed. of July, 17:00
const dateF = new Date(Date.UTC(2017, 6, 14, 12, 0, 0, 0)); // Friday
const dateG = new Date(Date.UTC(2017, 6, 15, 10, 0, 0, 0)); // Saturday
const dateH = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // Saturday
const dateI = new Date(Date.UTC(2017, 6, 15, 13, 0, 0, 0));
const dateJ = new Date(Date.UTC(2017, 6, 15, 14, 0, 0, 0));
const dateK_F = new Date(Date.UTC(2017, 6, 15, 16, 0, 0, 0));
const dateG_Fa = new Date(Date.UTC(2017, 6, 15, 17, 0, 0, 0));
const dateH_G = new Date(Date.UTC(2017, 6, 15, 18, 0, 0, 0)); // Saturday
const dateI_H = new Date(Date.UTC(2017, 6, 15, 22, 0, 0, 0)); // Saturday
const dateJ_I = new Date(Date.UTC(2017, 6, 16, 2, 0, 0, 0)); // Friday 02:00
const dateK_J = new Date(Date.UTC(2017, 6, 16, 13, 0, 0, 0)); // Sunday 13:00
const dateL_K = new Date(Date.UTC(2017, 6, 19, 16, 0, 0, 0)); // Third Wed. of July, 16:00
const dateM_L = new Date(Date.UTC(2017, 6, 19, 17, 0, 0, 0)); // Third Wed. of July, 17:00
const dateN_M = new Date(Date.UTC(2017, 6, 26, 16, 0, 0, 0)); // Last Wed. of July, 16:00
const dateO_N = new Date(Date.UTC(2017, 6, 26, 17, 0, 0, 0)); // Last Wed. of July, 17:00
const dateQ_P = new Date(Date.UTC(2017, 6, 29, 16, 0, 0, 0)); // Last Wed. of July, 16:00
const dateR_Q = new Date(Date.UTC(2017, 6, 29, 17, 0, 0, 0)); // Last Wed. of July, 17:00
const dateX = new Date(Date.UTC(2017, 6, 31, 16, 0, 0, 0)); // Monday 16:00, Last day of July
const dateY = new Date(Date.UTC(2017, 6, 31, 17, 0, 0, 0)); // Monday 17:00, Last day of July
const dateZ = new Date(Date.UTC(2017, 6, 31, 23, 0, 0, 0)); // Monday, Last day of July

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
  it('Create valid day-of-week time-rule', function() {
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.MONDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
  });

  it('Create valid day-of-month time-rule', function() {
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_MONTH,
                                                15,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
  });

  it('Attempt to create time-rule with null arguments', function() {
    assert.throws(function() {
 testContext.ruleRuleCtor(null,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                        testContext.constants.MONDAY,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        null,
                                                        testContext.constants.WEDNESDAY,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                        null,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                        testContext.constants.MONDAY,
                                                        null);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create time-rule with negative day argument', function() {
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                        -9,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create time-rule with out-of-range arguments', function() {
    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK-100,
                                                        testContext.constants.SUNDAY,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK+100,
                                                        testContext.constants.SUNDAY,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                        testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                        testContext.constants.SUNDAY-100,
                                                        TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
    assert.throws(function() {
 testContext.ruleRuleCtor(timespan,
                                                          testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                          testContext.constants.SATURDAY+100,
                                                          TZ_UTC);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });
});


describe('Time Rule - Generate Date-spans. Timezone: UTC.', function() {
  it('Create valid "Day of week" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateK_F.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateI_H.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_MONTH,
                                                15,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateK_J); // 15th of month
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateK_F.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateG_Fa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Last Monday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_LAST_OF_MONTH,
                                                testContext.constants.MONDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateF, dateZ); // dateZ is last Monday of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateX.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateY.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Last Wednesday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_LAST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateF, dateZ); // dateZ is last Monday of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateN_M.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateO_N.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "First Wednesday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIRST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Second Wednesday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_SECOND_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateD.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateE.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Third Wednesday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_THIRD_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateL_K.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateM_L.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Fourth Wednesday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FOURTH_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateN_M.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateO_N.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Fifth Saturday of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIFTH_OF_MONTH,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateQ_P.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateR_Q.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid time-rule but query date-span with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateJ, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });
});

describe('Time Rule - Generate Date-spans. Timezone: UTC+4 hours.', function() {
  it('Create valid time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(14, 0, 0, 0, 8*60); // 14:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateF, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateG.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateG}`);
    assert.equal(result[0].getEnd().getTime(), dateH_G.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateH_G}`);
  });

  it('Create valid time-rule. Query date-span before rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(18, 0, 0, 0, 1*60); // 13:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateI);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });

  it('Create valid time-rule. Query date-span after rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 23:00-00:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_PLUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateJ, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });
});

describe('Time Rule - Generate Time Periods. Timezone: UTC-4 hours.', function() {
  it('Create valid time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(14, 0, 0, 0, 8*60); // 14:00-22:00 UTC-4
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateF, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateH_G.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateH_G}`);
    assert.equal(result[0].getEnd().getTime(), dateJ_I.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateJ_I}`);
  });

  it('Create valid time-rule. Query date-span before rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(18, 0, 0, 0, 1*60); // 13:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateI);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });

  it('Create valid time-rule. Query date-span after rule with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 23:00-00:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_MINUS_FOUR);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH_G, dateK_J);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });
});
