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

/* exported constants */
/** maximum duration of a date-span in [minutes] */
const MAX_MINS_PER_DAY = 24*60;
/** Day of the week - Sunday. Same as defined by Date. */
const SUNDAY = 0;
/** Day of the week - Sunday. Same as defined by Date. */
const MONDAY = 1;
/** Day of the week - Sunday. Same as defined by Date. */
const TUESDAY = 2;
/** Day of the week - Sunday. Same as defined by Date. */
const WEDNESDAY = 3;
/** Day of the week - Sunday. Same as defined by Date. */
const THURSDAY = 4;
/** Day of the week - Sunday. Same as defined by Date. */
const FRIDAY = 5;
/** Day of the week - Sunday. Same as defined by Date. */
const SATURDAY = 6;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the same day of every
 *  week. The day must be in the range 0-6 (Sunday-Saturday). */
const CONSTRAINT_DAY_OF_WEEK = 0;
/** Constraint on TimeRule. Day of the month when the rule applies is specified
 *  by the day argument. The day must be an integer between 1-31.
*   Date-spans will be created on the same day of every month. */
const CONSTRAINT_DAY_OF_MONTH = 1;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the first occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_FIRST_OF_MONTH = 2;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the second occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_SECOND_OF_MONTH = 3;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the third occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_THIRD_OF_MONTH = 4;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the fourth occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_FOURTH_OF_MONTH = 5;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the fifth occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_FIFTH_OF_MONTH = 6;
/** Constraint on TimeRule. Day of the week when the rule applies is specified
 *  by the day argument. Date-spans will be created on the last occurance
 *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
 */
const CONSTRAINT_LAST_OF_MONTH = 7;

/* static constants */
const MSECS_PER_MIN = 60*1000;
const MSECS_PER_HOUR = 60*MSECS_PER_MIN;

/**
 * Functional constructor. Creates an instance of a TimeRule.
 * Each TimeRule object is immutable.
 * @param {Object} InTimeSpan A TimeSpan object which represents the begin time
 * and duration of a span of time during which the rule applies. An error is
 * thrown if this argument is not specified or it is not a valid object.
 * @param {number} inConstraint Integer. Identifies which type of Constraint
 * is applied by the time rule. Valid values are:
 * CONSTRAINT_DAY_OF_WEEK, CONSTRAINT_DAY_OF_MONTH, CONSTRAINT_FIRST_OF_MONTH,
 * CONSTRAINT_SECOND_OF_MONTH, CONSTRAINT_THIRD_OF_MONTH,
 * CONSTRAINT_FOURTH_OF_MONTH, CONSTRAINT_FIFTH_OF_MONTH and
 * CONSTRAINT_LAST_OF_MONTH.
 * @param {number} inDay Integer. Represents the day of the week or month
 * when this rule applies. Values representing the days of the week are the
 * same as those of the Date.getDay() method and values for the day of the
 * month must be in the range 1-31. Whether the day of the week or month is
 * specified depends on the value passed to inConstraint.
 * An error is thrown if no value is specified or it is outside the valid range.
 * @param {string} inTZ Timezone identifier as defined by the
 * tz database - sometimes called the TZ environment variable value.
 * See https://www.iana.org/time-zones for more details.
 * @param {Date|null} [inBegin] Date and time from which the rule is applied. If no
 * begin time is specified then the rule begins at the earliest possible time.
 * @param {Date|null} [inDate] Date and time up until which the rule is applied. If
 * no begin time is specified then the rule ends at the latest possible time.
 * @return {Object} A new instance of a TimeRule object.
 */
let timeRule = function timeRuleFunc(inTimeSpan, inConstraint, inDay, inTZ, inBegin=null, inEnd=null) {
  /** private *****************************************************************/
  /* new instance of object */
  const that = {};

  if(_.isObject(inTimeSpan) === false)  {
    throw new Error('Null or non-valid time-span argument passed to method.');
  }
  if(_.isInteger(inConstraint) === false)  {
    throw new Error('Null or non-valid constraint argument passed to method.');
  }
  if(_.isInteger(inDay) === false)  {
    throw new Error('Null or non-valid day argument passed to method.');
  }
  if(_.isNil(inBegin) === false
      && _.isDate(inBegin) === false) {
    throw new Error('Invalid argument. inBegin must be null or a Date object.');
  }
  if(_.isNil(inEnd) === false
      && _.isDate(inEnd) === false) {
    throw new Error('Invalid argument. inEnd must be null or a Date object.');
  }
  if((inConstraint !== CONSTRAINT_DAY_OF_MONTH)
      && (inDay < SUNDAY
          || inDay > SATURDAY)) {
    throw new Error('Invalid argument. Day of the week expected for inDay.');
  }
  else if(inConstraint === CONSTRAINT_DAY_OF_MONTH
          && (inDay < 1
                || inDay > 31)) {
    throw new Error('Invalid argument. Day of month expected for inDay.');
  }
  if(_.isString(inTZ) === false
          || moment.tz.zone(inTZ) === null
          || moment.tz('2001-01-01', inTZ).isValid() === false) {
    throw new Error('Invalid argument. Invalid TZ identifier string.');
  }

  /* timespan representing a span of time during the day */
  const timespan = inTimeSpan;
  /* constraint applied to the rule */
  const constraint = inConstraint;
  /* day of week/month when the rule applies. */
  const day = inDay;
  /* timezone identifier string */
  const tz = inTZ;
  /* timezone object */
  const timezone = timeZone(inTZ);
  /* begin time of rule */
  const begin = (_.isDate(inBegin))?inBegin:new Date(Number.MIN_SAFE_INTEGER);
  /* end time of rule */
  const end = (_.isDate(inEnd))?inEnd:new Date(Number.MAX_SAFE_INTEGER);


  /** public methods **********************************************************/

  /**
   * Get the TimeSpan of the TimeRule.
   * @return {Object} TimeSpan object.
   */
  that.getTimeSpan = function getTimeSpanFunc() {

    return timespan;
  }

  /**
   * Get the day of the week or month of the rule.
   * @return {number} Day of the week/month. Can be a value in the range 0-31.
   */
  that.getDayOfWeek = function getDayOfWeekFunc() {

    return day;
  }

  /**
   * Get the timezone identifier string of the TimeRule.
   * @return {string} Timezone identifier.
   */
  that.getTZ = function getTZFunc() {

    return tz;
  }

  /**
   * Get the begin time when the rule starts applying.
   * @return {Date} Begin time of the rule.
   */
  that.getBegin = function getBeginFunc() {

    return begin;
  }

  /**
   * Get the end time when the rule stops applying.
   * @return {Date} End time of the rule.
   */
  that.getEnd = function getEndFunc() {

    return end;
  }

  /**
   * Starting from a specific date and time, get all of the date-spans which are
   * created by this time rule.
   * @param {Date} inBegin Time from which the rule generates date-spans.
   * Must be a valid Date object.
   * @param {Date} inEnd Time up to which the rule generates time. Must be
   * a valid Date object and after the inBegin time.
   * @return {Object[]} Array of DateSpan objects.
   */
  that.getDateSpans = function getDateSpansFunc(inBegin, inEnd) {

    let retval = [];
    let beginCounter = null;
    let endCounter = null;
    if(_.isDate(inBegin) === false
      || _.isDate(inEnd) === false) {
        throw new Error('Invalid argument. Must be of type Date.');
    }
    else if(inBegin.getTime() > inEnd.getTime()) {
      throw new Error('Invalid argument. End date cannot be before the start date.');
    }
    beginCounter = moment.tz(inBegin, tz);
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
   * @param {Date} inBegin Start time. Must be a valid Date object.
   * @param {Date} inEnd End time. Must be a valid Date object.
   * @return {@link module:date-spans/datespan} A single DateSpan object or null if the rule generates
   * no date-span between the start and end times.
   */
  const generateDateSpan = function generateDateSpanFunc(inBegin, inEnd) {

    let retval = null;
    let dayPeriod = null;
    let ruleStartMoment = null;
    let rulePeriod = null;
    let startArgMoment = null;
    if(_.isDate(inBegin) === false
        || _.isDate(inEnd) === false) {
      throw new Error('Invalid argument. Function expects two Date objects as arguments.');
    }
    else if(inBegin.getTime() >= inEnd.getTime()) {
      throw new Error('Invalid argument. Start date must be before the end date.');
    }
    startArgMoment = moment.tz(inBegin, tz);
    dayPeriod = dateSpan(inBegin, inEnd);
    if(startArgMoment === null
        || dayPeriod === null) {
      throw new Error('Internal Error. Object not expected to be null.');
    }
    if(startArgMoment.day() === day) {
      ruleStartMoment = moment.tz(inBegin, tz);
      ruleStartMoment.hour(timespan.getHours());
      ruleStartMoment.minutes(timespan.getMinutes());
      ruleStartMoment.set(0, 'seconds');
      ruleStartMoment.set(0, 'milliseconds');
      // adjust UTC time because time in rule has a timezone
      rulePeriod = dateSpan(ruleStartMoment.utc().toDate(), null, timespan.getDurationMins());
    }
    if(rulePeriod !== null) {
      retval = rulePeriod.intersect(dayPeriod);
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
module.exports.CONSTRAINT_DAY_OF_WEEK = CONSTRAINT_DAY_OF_WEEK;
module.exports.CONSTRAINT_DAY_OF_MONTH = CONSTRAINT_DAY_OF_MONTH;
module.exports.CONSTRAINT_FIRST_OF_MONTH = CONSTRAINT_FIRST_OF_MONTH;
module.exports.CONSTRAINT_SECOND_OF_MONTH = CONSTRAINT_SECOND_OF_MONTH;
module.exports.CONSTRAINT_THIRD_OF_MONTH = CONSTRAINT_THIRD_OF_MONTH;
module.exports.CONSTRAINT_FOURTH_OF_MONTH = CONSTRAINT_FOURTH_OF_MONTH;
module.exports.CONSTRAINT_FIFTH_OF_MONTH = CONSTRAINT_FIFTH_OF_MONTH;
module.exports.CONSTRAINT_LAST_OF_MONTH = CONSTRAINT_LAST_OF_MONTH;


/** private functions *********************************************************/
