/**
 * unit-timerule.js
 * Copyright(c) 2017-2018 Michael McCarthy <michael.mccarthy@ieee.org>
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
const dateA = new Date(Date.UTC(2017, 6, 1, 0, 0, 0, 0)); // Saturday 1st, 1st day of July
const dateAc = new Date(Date.UTC(2017, 6, 1, 16, 0, 0, 0)); // Saturday 1st, 1st day of July, 16:00
const dateAb = new Date(Date.UTC(2017, 6, 2, 16, 0, 0, 0)); // Sunday 2nd, 1st Sunday of July, 16:00
const dateAa = new Date(Date.UTC(2017, 6, 3, 16, 0, 0, 0)); // Monday 3rd, 1st Monday of July, 16:00
const dateB = new Date(Date.UTC(2017, 6, 5, 16, 0, 0, 0)); // First Wed. of July, 16:00
const dateBa = new Date(Date.UTC(2017, 6, 5, 16, 30, 0, 0)); // First Wed. of July, 16:30
const dateC = new Date(Date.UTC(2017, 6, 5, 17, 0, 0, 0)); // First Wed. of July, 17:00
const dateCa = new Date(Date.UTC(2017, 6, 6, 16, 0, 0, 0)); // First Thurs. of July, 16:00
const dateCb = new Date(Date.UTC(2017, 6, 7, 16, 0, 0, 0)); // First Friday of July, 16:00
const dateD = new Date(Date.UTC(2017, 6, 12, 16, 0, 0, 0)); // Second Wed. of July, 16:00
const dateE = new Date(Date.UTC(2017, 6, 12, 17, 0, 0, 0)); // Second Wed. of July, 17:00
const dateF = new Date(Date.UTC(2017, 6, 14, 12, 0, 0, 0)); // Friday 14th, 12:00
const dateG = new Date(Date.UTC(2017, 6, 15, 10, 0, 0, 0)); // Saturday 15th, 10:00
const dateH = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // Saturday 15th, 12:00
const dateI = new Date(Date.UTC(2017, 6, 15, 13, 0, 0, 0)); // Saturday 15th, 13:00
const dateJ = new Date(Date.UTC(2017, 6, 15, 14, 0, 0, 0)); // Saturday 15th, 14:00
const dateK = new Date(Date.UTC(2017, 6, 15, 16, 0, 0, 0)); // Saturday 15th, 16:00
const dateL = new Date(Date.UTC(2017, 6, 15, 17, 0, 0, 0)); // Saturday 15th, 17:00
const dateM = new Date(Date.UTC(2017, 6, 15, 18, 0, 0, 0)); // Saturday 15th, 18:00
const dateN = new Date(Date.UTC(2017, 6, 15, 22, 0, 0, 0)); // Saturday 15th, 22:00
const dateNa = new Date(Date.UTC(2017, 6, 15, 22, 33, 44, 222)); // Saturday 15th, 22:33:44:222
const dateO = new Date(Date.UTC(2017, 6, 16, 2, 0, 0, 0)); // Sunday 16th, 02:00
const dateP = new Date(Date.UTC(2017, 6, 16, 13, 0, 0, 0)); // Sunday 16th, 13:00
const dateQ = new Date(Date.UTC(2017, 6, 19, 16, 0, 0, 0)); // Third Wed. of July, 16:00
const dateR = new Date(Date.UTC(2017, 6, 19, 17, 0, 0, 0)); // Third Wed. of July, 17:00
const dateS = new Date(Date.UTC(2017, 6, 26, 16, 0, 0, 0)); // Last Wed. of July, 16:00
const dateT = new Date(Date.UTC(2017, 6, 26, 17, 0, 0, 0)); // Last Wed. of July, 17:00
const dateTa = new Date(Date.UTC(2017, 6, 28, 22, 0, 0, 0)); // Last Fri. of July, 22:00
const dateU = new Date(Date.UTC(2017, 6, 29, 16, 0, 0, 0)); // Sat. 29th, 22:00, Last Sat. of July, 16:00
const dateV = new Date(Date.UTC(2017, 6, 29, 17, 0, 0, 0)); // Sat. 29th, 22:00, Last Sat. of July, 17:00
const dateVb = new Date(Date.UTC(2017, 6, 29, 22, 0, 0, 0)); // Sat. 29th, 22:00, Last Sat. of July, 22:00
const dateVa = new Date(Date.UTC(2017, 6, 30, 22, 0, 0, 0)); // Sunday 30th, 22:00, Last Sunday of July
const dateX = new Date(Date.UTC(2017, 6, 31, 16, 0, 0, 0)); // Monday 31st, 16:00, Last day of July
const dateY = new Date(Date.UTC(2017, 6, 31, 17, 0, 0, 0)); // Monday 31st, 17:00, Last day of July
const dateYa = new Date(Date.UTC(2017, 6, 31, 22, 0, 0, 0)); // Monday 31st, 22:00, Last Monday of July
const dateZ = new Date(Date.UTC(2017, 6, 31, 23, 0, 0, 0)); // Monday 31st, Last day of July

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
    assert.throws(function() {
     testContext.ruleRuleCtor(timespan,
                                testContext.constants.CONSTRAINT_DAY_OF_MONTH,
                                0,
                                TZ_UTC);
    },
                    Error,
                    'Expected function to throw an error. Month outside range.');
    assert.throws(function() {
     testContext.ruleRuleCtor(timespan,
                                testContext.constants.CONSTRAINT_DAY_OF_MONTH,
                                32,
                                TZ_UTC);
    },
                    Error,
                    'Expected function to throw an error. Month outside range.');
  });

  it('Attempt to create time-rule with incorrect type of arguments', function() {

    let timespan = testContext.timeSpanCtor(9, 0, 0, 0, 60);
    // invalid arg type passed to function
    assert.throws(function() {
      testContext.ruleRuleCtor(timespan,
                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                testContext.constants.SATURDAY,
                                TZ_UTC,
                                {},
                                null);
      },
      Error,
      'inBegin argument must be Date or null.');
    // invalid arg type passed to function
    assert.throws(function() {
        testContext.ruleRuleCtor(timespan,
                                  testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                  testContext.constants.SATURDAY,
                                  TZ_UTC,
                                  null,
                                  {});
        },
        Error,
        'inEnd argument must be Date or null.');
  });
});

describe('TimeRule - Generate Date-spans with invalid arguments.', function() {
  it('Generate DateSpans with null arguments.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    assert.throws(function() {
                      ruleObject.generateDateSpans(null, dateA);
                    },
                    Error,
                    'Expected method to throw error.');
    assert.throws(function() {
                      ruleObject.generateDateSpans(dateA, null);
                    },
                    Error,
                    'Expected method to throw error.');
    // begin date is after start date
    assert.throws(function() {
                      ruleObject.generateDateSpans(dateG, dateA);
                    },
                    Error,
                    'Expected method to throw error.');
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
    let result = ruleObject.generateDateSpans(dateH, dateP);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateK.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateN.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Monday-Friday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_MON_FRI,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 21, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAa.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Sunday-Thursday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_SUN_THURS,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 22, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAb.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Monday-Saturday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_MON_SAT,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 26, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Monday-Sunday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_MON_SUN,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 31, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Sunday-Friday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_SUN_FRI,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 26, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAb.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Saturday-Wednesday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_SAT_WED,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 23, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Saturday-Thursday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_SAT_THURS,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 27, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Brunei working week.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_BRUNEI,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 22, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateYa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Sat. and Sunday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_SAT_SUN,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 10, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateVa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Friday and Saturday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_FRI_SAT,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 9, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAc.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateVb.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Thursday and Friday.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_THURS_FRI,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 8, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateCa.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateTa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule, Brunei weekend.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 6*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.WEEKDAYS_BRUNEI_WEEKEND,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // 1-31 July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 9, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateAb.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[result.length-1].getEnd().getTime(), dateVa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of week" time-rule with minutes, seconds and msecs.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, (6*60)+33, 44, 222); // 16:00:00:000-22:33:44:222
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateP);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateK.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateNa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid "Day of month" time-rule and get date-span.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_MONTH,
                                                15,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateH, dateP); // 15th of month
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateK.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateL.getTime(), 'Incorrect end time of date-span.');
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
    assert.equal(result[0].getBegin().getTime(), dateS.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateT.getTime(), 'Incorrect end time of date-span.');
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
    assert.equal(result[0].getBegin().getTime(), dateQ.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateR.getTime(), 'Incorrect end time of date-span.');
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
    assert.equal(result[0].getBegin().getTime(), dateS.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateT.getTime(), 'Incorrect end time of date-span.');
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
    assert.equal(result[0].getBegin().getTime(), dateU.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateV.getTime(), 'Incorrect end time of date-span.');
  });

  it('Generate date-spans with start date of search period overlapping rule timespan.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIRST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateBa, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateBa.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'Incorrect end time of date-span.');
  });

  it('Generate date-spans with end date of search period overlapping rule timespan.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIRST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateBa);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateBa.getTime(), 'Incorrect end time of date-span.');
  });

  it('Create valid time-rule but query date-span with no overlap.', function() {
    let timespan = testContext.timeSpanCtor(12, 0, 0, 0, 1*60); // 16:00-22:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_DAY_OF_WEEK,
                                                testContext.constants.SATURDAY,
                                                TZ_UTC);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateJ, dateP);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });

  it('Generate date-spans with rule start date overlapping rule timespan.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIRST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC,
                                                dateB,
                                                null);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ); // dateZ is last day of July
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateC.getTime(), 'Incorrect end time of date-span.');
  });

  it('Generate date-spans with end date of rule overlapping rule timespan.', function() {
    let timespan = testContext.timeSpanCtor(16, 0, 0, 0, 1*60); // 16:00-17:00
    let ruleObject = testContext.ruleRuleCtor(timespan,
                                                testContext.constants.CONSTRAINT_FIRST_OF_MONTH,
                                                testContext.constants.WEDNESDAY,
                                                TZ_UTC,
                                                null,
                                                dateBa);
    assert.notEqual(ruleObject, null, 'TimeRule object was not constructed.');
    let result = ruleObject.generateDateSpans(dateA, dateZ);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateB.getTime(), 'Incorrect start time of date-span.');
    assert.equal(result[0].getEnd().getTime(), dateBa.getTime(), 'Incorrect end time of date-span.');
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
    let result = ruleObject.generateDateSpans(dateF, dateP);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateG.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateG}`);
    assert.equal(result[0].getEnd().getTime(), dateM.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateM}`);
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
    let result = ruleObject.generateDateSpans(dateJ, dateP);
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
    let result = ruleObject.generateDateSpans(dateF, dateP);
    assert.equal(typeof result, 'object', 'Method should return an array of TimePeriod objects.');
    assert.equal(result.length, 1, 'Method should return one date-span.');
    assert.equal(result[0].getBegin().getTime(), dateM.getTime(), `Incorrect start time of date-span. actual: ${result[0].getBegin()}, expected: ${dateM}`);
    assert.equal(result[0].getEnd().getTime(), dateO.getTime(), `Incorrect end time of date-span. actual: ${result[0].getEnd()}, expected: ${dateO}`);
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
    let result = ruleObject.generateDateSpans(dateM, dateP);
    assert.equal(typeof result, 'object', 'Method should return an emtpy array.');
    assert.equal(result.length, 0, 'Method should return no date-spans.');
  });
});
