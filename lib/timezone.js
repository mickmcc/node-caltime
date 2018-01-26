/** @module caltime/timezone
 * @private
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017-2018
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');
const moment = require('moment-timezone');


/**
 * Functional constructor which creates an instance of a TimeZone.
 * Each TimeZone object is immutable.
 * @private
 * @param {string} inTZ String identifying the timezone. Valid timezone
 * strings are valid TZ environment variable values.
 * See https://www.iana.org/time-zones for more details.
 * An error is thrown if the string is not specified or is not one of the
 * permitted TZ values.
 * @return {object} A new instance of the TimeZone object.
 * @throws {Error}
 * @throws {TypeError}
 */
let timeZone = function timeZoneCtor(inTZ) {
  /** private *****************************************************************/

  /* new instance of object */
  const that = {};
  /* offset of the timezone in [minutes] */
  const tz = inTZ;

  // check values are within permitted ranges
  if (_.isString(inTZ) === false) {
    throw new TypeError('Invalid argument passed to TimeZone constructor.');
  } else if (moment.tz.zone(inTZ) === null) {
    throw new Error('Invalid TZ value passed to TimeZone constructor.');
  } else if (moment.tz('2001-01-01', inTZ).isValid() === false) {
    throw new Error('Invalid TZ value passed to TimeZone constructor.');
  }

  /** public methods **********************************************************/

  /**
   * Get the TZ string of the timezone from UTC.
   * @return {string} TZ string which identifies the timezone location.
   */
  that.getTZ = function getTZFunc() {
    return tz;
  };

  /**
   * Calculate the previous occurance of midnight, in a specific timezone,
   * before a specific date and time.
   * @param {object} inDate Date from which the function begins calculating the
   * previous instance of midnight. Function throws an exception if the argument
   * is not a valid date.
   * @return {object} Date which is before inDate.
   * @throws {TypeError}
   */
    that.previousMidnight = function previousMidnightFunc(inDate) {
    let retval = null;
    let tzMoment = null;
    if (_.isDate(inDate) === false) {
      throw new TypeError('Invalid date passed to function.');
    }
    tzMoment = moment.tz(inDate, tz);
    if (tzMoment === null
        || tzMoment.isValid() === false) {
      throw new Error('Failed to create a valid moment object.');
    }
    if (tzMoment !== null) {
      if (that.isMidnight(inDate)) {
        /* if date is already midnight, get midnight of previous day */
        tzMoment.subtract(1, 'hours');
      }
      tzMoment.startOf('date');
      retval = tzMoment.toDate();
    }
    return retval;
  };

  /**
   * Calculate the next occurance of midnight, in a specific timezone,
   * after a specific date and time.
   * @param {Date} inDate Date from which the function begins calculating the
   * next instance of midnight. Function throws an exception if the argument
   * is not a valid date.
   * @return {Date} Date which is after inDate.
   * @throws {TypeError}
   */
    that.nextMidnight = function nextMidnightFunc(inDate) {
    let retval = null;
    let tzMoment = null;
    if (_.isDate(inDate) === false) {
      throw new TypeError('Invalid date passed to function.');
    }
    tzMoment = moment.tz(inDate, tz);
    if (tzMoment === null
        || tzMoment.isValid() === false) {
      throw new Error('Failed to create a valid moment object.');
    }
    if (tzMoment !== null) {
      tzMoment.add(1, 'days');
      tzMoment.startOf('date');
      retval = tzMoment.toDate();
    }
    return retval;
  };

  /**
   * Check if a specific Date object represents midnight in a specific
   * timezone.
   * @param {Date} inDate Date which is to be checked. Function throws an
   * error if the argument is not a valid date.
   * @return {boolean} true if the Date is midnight in the timezone,
   * otherwise false.
   * @throws {TypeError}
   * @throws {Error}
   */
    that.isMidnight = function isMidnightFunc(inDate) {
    let retval = false;
    let tzMoment = null;
    if (_.isDate(inDate) === false) {
      throw new TypeError('Invalid date passed to function.');
    }
    tzMoment = moment.tz(inDate, tz);
    if (tzMoment.isValid() === false) {
      throw new Error('Failed to create moment object.');
    }
    if (tzMoment.hour() === 0
        && tzMoment.minute() === 0) {
      retval = true;
    }
    return retval;
  };

  /**
   * Calculate the day of the week for a specific date/time in a specific
   * timezone. Function required because the Date object only supports
   * getting the day of the week for the UTC and local timezones.
   * @param {Date} inDate Date for which the function calculates the day
   * of the week. Function throws an error if the argument is not a valid date.
   * @return {number} Integer representing the day of the week as defined
   * by Date.getDay().
   * @throws {TypeError}
   */
  that.dayOfWeek = function dayOfWeekFunc(inDate) {
    let retval = 0;
    let tzMoment = null;
    if (_.isDate(inDate) === false) {
      throw new TypeError('Invalid argument passed to function');
    }
    tzMoment = moment.tz(inDate, tz);
    if (tzMoment.isValid() === false) {
      throw new Error('Failed to create moment object.');
    }
    retval = tzMoment.day();
    return retval;
  };

  /** private methods *********************************************************/

  /* functional constructor returns a new instance */
  return that;
};

/* module exports the functional constructor */
module.exports.timeZone = timeZone;


/** public functions *********************************************************/


/** private functions *********************************************************/
