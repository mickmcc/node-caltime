/** @module schedtime/timerule
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');
const dateSpan = require('./datespan').dateSpan;
const timeZone = require('./timezone').timeZone;
const moment = require('moment-timezone');

/* constants */
const MAX_MINS_PER_DAY = 24*60;
const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const MSECS_PER_MIN = 60*1000;
const MSECS_PER_HOUR = 60*MSECS_PER_MIN;

/**
 * Functional constructor. Creates an instance of a TimeRule.
 * Each TimeRule object is immutable.
 * @param {Object} InTimeSpan A TimeSpan object which represents the begin time
 * and duration of a span of time during which the rule applies. An error is
 * thrown if this argument is not specified or it is not a valid object.
 * @param {number} inDayOfWeek Integer. Represents the day of the week
 * when this rule applies. Values representing the days of the week are the
 * same as those of the Date.getDay() method.
 * An error is thrown if no value is specified or it is outside the valid range.
 * @param {string} inTZ Timezone identifier as defined by the
 * tz database - sometimes called the TZ environment variable value.
 * See https://www.iana.org/time-zones for more details.
 * @return {Object} A new instance of a TimeRule object.
 */
let timeRule = function timeRuleFunc(inTimeSpan, inDayOfWeek, inTZ) {
  /** private *****************************************************************/
  /* new instance of object */
  const that = {};

  if(_.isObject(inTimeSpan) === false)  {
    throw new Error('Null or non-valid time-span argument passed to method.');
  }
  else if(_.isInteger(inDayOfWeek) === false)  {
    throw new Error('Null or non-valid day-of-week argument passed to method.');
  }
  else if(inDayOfWeek < SUNDAY
          || inDayOfWeek > SATURDAY) {
    throw new Error('Invalid argument. Day of Week is outside of valid range.');
  }
  else if(_.isString(inTZ) === false
          || moment.tz.zone(inTZ) === null
          || moment.tz('2001-01-01', inTZ).isValid() === false) {
    throw new Error('Invalid argument. Invalid TZ identifier string.');
  }

  /* timespan representing a span of time during the day */
  const timespan = inTimeSpan;
  /* day of week when the rule applies. */
  const dayOfWeek = inDayOfWeek;
  /* timezone identifier string */
  const tz = inTZ;
  /* timezone object */
  const timezone = timeZone(inTZ);

  /** public methods **********************************************************/

  /**
   * Get the TimeSpan of the TimeRule.
   * @return {Object} TimeSpan object.
   */
  that.getTimeSpan = function getTimeSpanFunc() {

    return timespan;
  }

  /**
   * Get the day of the week of the TimeRule.
   * @return {number} Day of the week as specified by the Date object.
   */
  that.getDayOfWeek = function getDayOfWeekFunc() {

    return dayOfWeek;
  }

  /**
   * Get the timezone identifier string of the TimeRule.
   * @return {string} Timezone identifier.
   */
  that.getTZ = function getTZFunc() {

    return tz;
  }

  /**
   * Starting from a specific date and time, get all of the date-spans which are
   * created by this time rule.
   * @param {Date} inStart Time from which the rule generates date-spans.
   * Must be a valid Date object.
   * @param {Date} inEnd Time up to which the rule generates time. Must be
   * a valid Date object and after the inStart time.
   * @return {Object[]} Array of DateSpan objects.
   */
  that.getDateSpans = function getDateSpansFunc(inStart, inEnd) {

    let retval = [];
    let beginCounter = null;
    let endCounter = null;
    if(_.isDate(inStart) === false
      || _.isDate(inEnd) === false) {
        throw new Error('Invalid argument. Must be of type Date.');
    }
    else if(inStart.getTime() > inEnd.getTime()) {
      throw new Error('Invalid argument. End date cannot be before the start date.');
    }
    beginCounter = moment.tz(inStart, tz);
    endCounter = beginCounter.clone();
    endCounter = moment.tz(timezone.nextMidnight(endCounter.toDate()), tz);
    /* step thru dates, one day at a time */
    while(beginCounter.toDate().getTime() < inEnd.getTime()) {
      /* don't generate periods after the end time on last day */
      if(endCounter.toDate().getTime() > inEnd.getTime()) {
        endCounter = moment.tz(inEnd, tz);
      }
      let newPeriod = generateDateSpan(beginCounter.toDate(), endCounter.toDate());
      if(newPeriod !== null) {
        retval.push(newPeriod);
      }
      beginCounter.add(1, 'days');
      beginCounter.startOf('date');
      endCounter = beginCounter.clone();
      endCounter.add(1, 'days');
      endCounter.startOf('date');
    }
    return retval;
  }

  /** private methods *********************************************************/

  /**
   * Generate a date-span for this rule between the start and end dates.
   * @param {Date} inStart Start time. Must be a valid Date object.
   * @param {Date} inEnd End time. Must be a valid Date object.
   * @return {@link module:date-spans/datespan} A single DateSpan object or null if the rule generates
   * no date-span between the start and end times.
   */
  const generateDateSpan = function generateDateSpanFunc(inStart, inEnd) {

    let retval = null;
    let dayPeriod = null;
    let ruleStartMoment = null;
    let rulePeriod = null;
    let startArgMoment = null;
    if(_.isDate(inStart) === false
        || _.isDate(inEnd) === false) {
      throw new Error('Invalid argument. Function expects two Date objects as arguments.');
    }
    else if(inStart.getTime() >= inEnd.getTime()) {
      throw new Error('Invalid argument. Start date must be before the end date.');
    }
    startArgMoment = moment.tz(inStart, tz);
    dayPeriod = dateSpan(inStart, inEnd);
    if(startArgMoment === null
        || dayPeriod === null) {
      throw new Error('Internal Error. Object not expected to be null.');
    }
    if(startArgMoment.day() === dayOfWeek) {
      ruleStartMoment = moment.tz(inStart, tz);
      ruleStartMoment.hour(timespan.getHours());
      ruleStartMoment.minutes(timespan.getMinutes());
      ruleStartMoment.set(0, 'seconds');
      ruleStartMoment.set(0, 'milliseconds');
      // adjust UTC time because time in rule has a timezone
      rulePeriod = dateSpan(ruleStartMoment.utc().toDate(), null, timespan.getDurationMins());
    }
    if(rulePeriod !== null) {
      retval = rulePeriod.overlap(dayPeriod);
    }
    return retval;
  }

  /* functional constructor return */
  return that;
};


/** public functions **********************************************************/


/* interface exported by the module */
module.exports.timeRule = timeRule;
module.exports.MONDAY = MONDAY;
module.exports.TUESDAY = TUESDAY;
module.exports.WEDNESDAY = WEDNESDAY;
module.exports.THURSDAY = THURSDAY;
module.exports.FRIDAY = FRIDAY;
module.exports.SATURDAY = SATURDAY;
module.exports.SUNDAY = SUNDAY;


/** private functions *********************************************************/
