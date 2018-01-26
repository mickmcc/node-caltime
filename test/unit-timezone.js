/**
 * unit-timezone.js
 * Copyright(c) 2017-2018 Michael McCarthy <michael.mccarthy@ieee.org>
 * See accompanying MIT License file.
 */

 /* eslint max-len: ["error", 120] */

'use strict';

/* dependencies */
const assert = require('assert');
const _ = require('lodash');

const testContext = {};
testContext.timeZoneCtor = require('../lib/timezone').timeZone;
testContext.constants = require('../lib/constants');

/* useful Date objects for testing */
/* dates which don't span a leap day transition i.e. 29th of Feb. of leap year */
const dateA = new Date(Date.UTC(2017, 6, 14, 10, 0, 0, 0)); // UTC+14: Friday/Sat Midnight.
const dateAa = new Date(Date.UTC(2017, 6, 14, 12, 0, 0, 0)); // UTC-12: Thur/Fri Midnight.
const dateB = new Date(Date.UTC(2017, 6, 14, 20, 0, 0, 0)); // UTC+4: Fri/Sat Midnight.
const dateC = new Date(Date.UTC(2017, 6, 15, 0, 0, 0, 0)); // UTC: Friday/Sat Midnight.
const dateD = new Date(Date.UTC(2017, 6, 15, 4, 0, 0, 0)); // UTC-4: Friday/Sat Midnight.
const dateE = new Date(Date.UTC(2017, 6, 15, 10, 0, 0, 0)); // UTC+14: Sat/Sun Midnight.
const dateF = new Date(Date.UTC(2017, 6, 15, 12, 0, 0, 0)); // UTC: Saturday Midday. UTC-12: Fri/Sat Midnight.
const dateG = new Date(Date.UTC(2017, 6, 15, 20, 0, 0, 0)); // UTC+4: Sat/Sun Midnight.
const dateH = new Date(Date.UTC(2017, 6, 16, 0, 0, 0, 0)); // UTC: Sat/Sun Midnight.
const dateI = new Date(Date.UTC(2017, 6, 16, 4, 0, 0, 0)); // UTC-4: Sat/Sun Midnight.
const dateIa = new Date(Date.UTC(2017, 6, 16, 10, 0, 0, 0)); // UTC+14: Sun/Mon Midnight.
const dateJ = new Date(Date.UTC(2017, 6, 16, 12, 0, 0, 0)); // UTC-12: Sat/Sun Midnight.

/* timezones */
const TZ_PLUS_14 = 'Pacific/Kiritimati'; // UTC+14 timezone offset in [minutes]
const TZ_PLUS_4 = 'Asia/Dubai'; // UTC+4 timezone offset in [minutes]
const TZ_UTC = 'Etc/UTC'; // UTC timezone offset
const TZ_MINUS_4 = 'America/Antigua'; // UTC-4 timezone offset in [minutes]
const TZ_MINUS_12 = 'Etc/GMT+12'; // UTC-12 timezone offset in [minutes]

before(function() {

});

beforeEach(function() {

});

afterEach(function() {

});

after(function() {

});


describe('Timezone - Instantiation', function() {
  it('Create valid timezones', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    assert.equal(_.isObject(timezone), true, 'TimeZone object was not constructed.');
    assert.equal(timezone.getTZ(), TZ_UTC, 'TimeZone has incorrect offset.');
    timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    assert.equal(_.isObject(timezone), true, 'TimeZone object was not constructed.');
    assert.equal(timezone.getTZ(), TZ_PLUS_14, 'TimeZone has incorrect offset.');
    timezone = testContext.timeZoneCtor(TZ_PLUS_4);
    assert.equal(_.isObject(timezone), true, 'TimeZone object was not constructed.');
    assert.equal(timezone.getTZ(), TZ_PLUS_4, 'TimeZone has incorrect offset.');
    timezone = testContext.timeZoneCtor(TZ_MINUS_4);
    assert.equal(_.isObject(timezone), true, 'TimeZone object was not constructed.');
    assert.equal(timezone.getTZ(), TZ_MINUS_4, 'TimeZone has incorrect offset.');
    timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    assert.equal(_.isObject(timezone), true, 'TimeZone object was not constructed.');
    assert.equal(timezone.getTZ(), TZ_MINUS_12, 'TimeZone has incorrect offset.');
  });

  it('Attempt to create timezone with null arguments', function() {
    assert.throws(function() {
 testContext.timeZoneCtor(null);
},
                    Error,
                    'Expected functional constructor to throw an error.');
  });

  it('Attempt to create timezone with invalid arguments', function() {
    assert.throws(function() {
                    testContext.timeZoneCtor('xxxx');
                  },
                  Error,
                  'Expected functional constructor to throw an error.');
    assert.throws(function() {
                    testContext.timeZoneCtor('');
                  },
                    Error,
                    'Expected functional constructor to throw an error.');
  });
});

describe('Timezone - Methods - Null arguments', function() {
  it('Pass null to method nextMidnight.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    assert.notEqual(timezone, null, 'Constructor returned null.');
    assert.throws(function() {
                    timezone.nextMidnight(null);
                  },
                  Error,
                  'Expected method to throw an error.');
    });

    it('Pass null to method isMidnight.', function() {
      let timezone = testContext.timeZoneCtor(TZ_UTC);
      assert.notEqual(timezone, null, 'Constructor returned null.');
      assert.throws(function() {
                      timezone.isMidnight(null);
                    },
                    Error,
                    'Expected method to throw an error.');
    });

  it('Pass null to method previousMidnight.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    assert.notEqual(timezone, null, 'Constructor returned null.');
    assert.throws(function() {
                    timezone.previousMidnight(null);
                  },
                  Error,
                  'Expected method to throw an error.');
  });

  it('Pass null to method dayOfWeek.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    assert.notEqual(timezone, null, 'Constructor returned null.');
    assert.throws(function() {
                    timezone.dayOfWeek(null);
                  },
                  Error,
                  'Expected method to throw an error.');
  });
});

describe('Timezone - Is Midnight Method.', function() {
  it('Check dates which are midnight in timezone UTC-12.', function() {
    let timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    let result = timezone.isMidnight(dateAa);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
  });

  it('Check dates which are not midnight in timezone UTC-12.', function() {
    let timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    let result = timezone.isMidnight(dateA);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, false, 'Expect false as date is not midnight.');
  });

  it('Check dates which are midnight in timezone UTC-4.', function() {
    let timezone = testContext.timeZoneCtor(TZ_MINUS_4);
    let result = timezone.isMidnight(dateD);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
  });

  it('Check dates which are not midnight in timezone UTC-4.', function() {
    let timezone = testContext.timeZoneCtor(TZ_MINUS_4);
    let result = timezone.isMidnight(dateE);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, false, 'Expect false as date is not midnight.');
  });

  it('Check dates which are midnight in timezone UTC.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.isMidnight(dateC);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
    timezone = testContext.timeZoneCtor(TZ_UTC);
    result = timezone.isMidnight(dateH);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
  });

  it('Check dates which are not midnight in timezone UTC.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.isMidnight(dateA);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, false, 'Expect false as date is not midnight.');
  });

  it('Check dates which are midnight in timezone UTC+4.', function() {
    let timezone = testContext.timeZoneCtor(TZ_PLUS_4);
    let result = timezone.isMidnight(dateG);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
  });

  it('Check dates which are not midnight in timezone UTC+4.', function() {
    let timezone = testContext.timeZoneCtor(TZ_PLUS_4);
    let result = timezone.isMidnight(dateF);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, false, 'Expect false as date is not midnight.');
  });

  it('Check dates which are midnight in timezone UTC+14.', function() {
    let timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    let result = timezone.isMidnight(dateIa);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, true, 'Expect true as date is midnight.');
  });

  it('Check dates which are not midnight in timezone UTC+14.', function() {
    let timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    let result = timezone.isMidnight(dateG);
    assert.equal(_.isBoolean(result), true, 'Boolean was not returned by method.');
    assert.equal(result, false, 'Expect false as date is not midnight.');
  });
});

describe('Timezone - Next Midnight Method.', function() {
  it('Find next midnight occurance. UTC.', function() {
    const timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.nextMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateH.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find next midnight occurance for midnight. UTC.', function() {
    const timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.nextMidnight(dateC);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateH.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find next midnight occurance. UTC+4.', function() {
    const timezone = testContext.timeZoneCtor(TZ_PLUS_4);
    let result = timezone.nextMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateG.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find next midnight occurance. UTC+14.', function() {
    const timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    let result = timezone.nextMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateIa.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find next midnight occurance. UTC-4.', function() {
    const timezone = testContext.timeZoneCtor(TZ_MINUS_4);
    let result = timezone.nextMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateI.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find next midnight occurance. UTC-12.', function() {
    const timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    let result = timezone.nextMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateJ.getTime(), 'Date not expected. Should be midnight.');
  });
});

describe('Timezone - Previous Midnight Method.', function() {
  it('Find previous midnight occurance. UTC.', function() {
    const timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.previousMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateC.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance for midnight. UTC.', function() {
    const timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.previousMidnight(dateH);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateC.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance. UTC+4.', function() {
    const timezone = testContext.timeZoneCtor(TZ_PLUS_4);
    let result = timezone.previousMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateB.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance. UTC+14.', function() {
    const timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    let result = timezone.previousMidnight(dateC);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateA.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance for midnight. UTC+14.', function() {
    const timezone = testContext.timeZoneCtor(TZ_PLUS_14);
    let result = timezone.previousMidnight(dateE);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateA.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance. UTC-4.', function() {
    const timezone = testContext.timeZoneCtor(TZ_MINUS_4);
    let result = timezone.previousMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateD.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance. UTC-12.', function() {
    const timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    let result = timezone.previousMidnight(dateE);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateAa.getTime(), 'Date not expected. Should be midnight.');
  });

  it('Find previous midnight occurance for midnight. UTC-12.', function() {
    const timezone = testContext.timeZoneCtor(TZ_MINUS_12);
    let result = timezone.previousMidnight(dateF);
    assert.equal(_.isDate(result), true, 'Date was not returned by method.');
    assert.equal(result.getTime(), dateAa.getTime(), 'Date not expected. Should be midnight.');
  });
});

describe('Timezone - Day Of Week Method.', function() {

  it('Pass invalid argument to dayOfWeek method.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    assert.throws(function() {
                    timezone.dayOfWeek(null);
                  },
                  Error,
                  'Expected method to throw an error.');
    assert.throws(function() {
                    timezone.dayOfWeek(undefined);
                  },
                  Error,
                  'Expected method to throw an error.');
    assert.throws(function() {
                    timezone.dayOfWeek({});
                  },
                  Error,
                  'Expected method to throw an error.');
  });

  it('Check day in UTC timezone.', function() {
    let timezone = testContext.timeZoneCtor(TZ_UTC);
    let result = timezone.dayOfWeek(dateAa);
    assert.equal(_.isInteger(result), true, 'Integer was not returned by method.');
    assert.equal(result, testContext.constants.FRIDAY, 'Expected other day of the week.');
  });
});
