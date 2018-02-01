/** @module caltime/timerule
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017-2018
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');
const moment = require('moment-timezone');

const dateSpan = require('./datespan').dateSpan;
const timeZone = require('./timezone').timeZone;
const modconst = require('./constants');


/**
 * Functional constructor. Creates an instance of a TimeRule.
 * Each TimeRule object is immutable.
 * @param {Object} inTimeSpan A TimeSpan object which represents the begin time
 * and duration of a span of time during which the rule applies. An error is
 * thrown if this argument is not specified or it is not a valid object.
 * @param {number} inConstraint Integer. Identifies which type of Constraint
 * is applied by the time rule. Valid values are:
 *  CONSTRAINT_DAY_OF_WEEK, CONSTRAINT_DAY_OF_MONTH, CONSTRAINT_FIRST_OF_MONTH,
 *  CONSTRAINT_SECOND_OF_MONTH, CONSTRAINT_THIRD_OF_MONTH,
 *  CONSTRAINT_FOURTH_OF_MONTH, CONSTRAINT_FIFTH_OF_MONTH and
 *  CONSTRAINT_LAST_OF_MONTH.
 * @param {number} inDay Integer. Represents the day of the week or month
 * when this rule applies. Values representing the days of the week are the
 * same as those of the Date.getDay() method or the WEEKDAYS_ constants.
 * Values for the day of the month must be in the range 1-31. Whether the day
 * of the week or month is specified depends on the value passed to inConstraint.
 * An error is thrown if no value is specified or it is outside the valid range.
 * @param {string} inTZ Timezone identifier as defined by the
 * tz database - sometimes called the TZ environment variable value.
 * See https://www.iana.org/time-zones for more details.
 * @param {Date|null} [inBegin] Date and time from which the rule is applied.
 * If no begin time is specified then the rule begins at the earliest possible
 * time.
 * @param {Date|null} [inEnd] Date and time up until which the rule is applied.
 * If no begin time is specified then the rule ends at the latest possible time.
 * @return {Object} A new instance of a TimeRule object.
 * @throws {Error}
 * @throws {RangeError}
 */
let timeRule = function timeRuleFunc(inTimeSpan,
                                        inConstraint,
                                        inDay,
                                        inTZ,
                                        inBegin=null,
                                        inEnd=null) {
  /** private *****************************************************************/
  /* new instance of object */
  const that = {};

  if (_.isObject(inTimeSpan) === false) {
    throw new Error('Null or non-valid timespan argument passed to method.');
  }
  if (_.isInteger(inConstraint) === false) {
    throw new Error('Null or non-valid constraint argument passed to method.');
  }
  if (_.isInteger(inDay) === false) {
    throw new Error('Null or non-valid day argument passed to method.');
  }
  if (_.isNil(inBegin) === false
      && _.isDate(inBegin) === false) {
    throw new Error('Invalid argument. inBegin must be null or a Date object.');
  }
  if (_.isNil(inEnd) === false
      && _.isDate(inEnd) === false) {
    throw new Error('Invalid argument. inEnd must be null or a Date object.');
  }
  if ((inConstraint !== modconst.CONSTRAINT_DAY_OF_MONTH)
      && ((inDay < modconst.SUNDAY
          || inDay > modconst.SATURDAY)
          && (inDay < modconst.WEEKDAYS_MIN_VALUE
              || inDay > modconst.WEEKDAYS_MAX_VALUE))) {
    throw new Error('Invalid argument. Day of the week or constant expected for inDay.');
  } else if (inConstraint === modconst.CONSTRAINT_DAY_OF_MONTH
          && (inDay < 1
                || inDay > 31)) {
    throw new Error('Invalid argument. Day of month expected for inDay.');
  }
  if (_.isString(inTZ) === false
          || moment.tz.zone(inTZ) === null
          || moment.tz('2001-01-01', inTZ).isValid() === false) {
    throw new Error('Invalid argument. Invalid TZ identifier string.');
  }
  if (inConstraint < modconst.CONSTRAINT_MIN_VALUE
      || inConstraint > modconst.CONSTRAINT_MAX_VALUE) {
    throw new RangeError('Invalid argument. inConstraint outside permitted range.');
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
  const ruleBegin = (_.isDate(inBegin))
                      ?inBegin
                      :new Date(Number.MIN_SAFE_INTEGER);
  /* end time of rule */
  const ruleEnd = (_.isDate(inEnd))
                    ?inEnd
                    :new Date(Number.MAX_SAFE_INTEGER);


  /** public methods **********************************************************/

  /**
   * Get the TimeSpan of the TimeRule.
   * @return {Object} TimeSpan object.
   */
  that.getTimeSpan = function getTimeSpanFunc() {
    return timespan;
  };

  /**
   * Get the day of the week or month of the rule.
   * @return {number} Day of the week/month. Can be a value in the range 0-31.
   */
  that.getDay = function getDayFunc() {
    return day;
  };

  /**
   * Get the timezone identifier string of the TimeRule.
   * @return {string} Timezone identifier.
   */
  that.getTZ = function getTZFunc() {
    return tz;
  };

  /**
   * Get the begin time when the rule starts applying.
   * @return {Date} Begin time of the rule.
   */
  that.getBegin = function getBeginFunc() {
    return ruleBegin;
  };

  /**
   * Get the end time when the rule stops applying.
   * @return {Date} End time of the rule.
   */
  that.getEnd = function getEndFunc() {
    return ruleEnd;
  };

  /**
   * Starting from a specific date and time, get all of the date-spans which are
   * created by this time rule.
   * @param {Date} inBegin Time from which the rule should generate date-spans.
   * Must be a valid Date object.
   * @param {Date} inEnd Time up to which the rule generates date-spans. Must be
   * a valid Date object and after the inBegin time.
   * @return {Object[]} Array of DateSpan objects.
   * @throws {TypeError}
   * @throws {Error}
   */
  that.generateDateSpans = function generateDateSpansFunc(inBegin, inEnd) {
    let retval = [];
    let beginCounter = null;
    let endCounter = null;
    let searchBegin = null;
    let searchEnd = null;
    if (_.isDate(inBegin) === false
      || _.isDate(inEnd) === false) {
        throw new TypeError('Invalid argument. Must be of type Date.');
    } else if (inBegin.getTime() > inEnd.getTime()) {
      throw new Error('Invalid argument. End date preceeds start date.');
    }
    /* rules have their own start/end times - no point in searching outside
       the rule's own range of dates */
    searchBegin = (inBegin.getTime() < ruleBegin.getTime())?ruleBegin:inBegin;
    searchEnd = (inEnd.getTime() > ruleEnd.getTime())?ruleEnd:inEnd;
    /* setup first day to examine for date-spans */
    beginCounter = moment.tz(searchBegin, tz);
    endCounter = beginCounter.clone();
    endCounter = moment.tz(timezone.nextMidnight(endCounter.toDate()), tz);
    /* step thru dates, one day at a time */
    while (beginCounter.toDate().getTime() < searchEnd.getTime()) {
      /* don't generate periods after the end time on last day */
      if (endCounter.toDate().getTime() > searchEnd.getTime()) {
        endCounter = moment.tz(searchEnd, tz);
      }
      let newSpan = generateDateSpan(beginCounter.toDate(), endCounter.toDate());
      if (newSpan !== null) {
        retval.push(newSpan);
      }
      beginCounter.add(1, 'days');
      beginCounter.startOf('date');
      endCounter = beginCounter.clone();
      endCounter.add(1, 'days');
      endCounter.startOf('date');
    }
    return retval;
  };

  /** private methods *********************************************************/

  /**
   * Search for a date-span for this rule between the start and end dates. The
   * begin and end times should belong to the same day. The search is performed
   * on a day-by-day basis in the required timezone.
   * @param {Date} inBegin Start time. Must be a valid Date object.
   * @param {Date} inEnd End time. Must be a valid Date object.
   * @return {@link module:caltime/datespan|null} A single DateSpan object or null
   * if the rule generates no date-span between the start and end times.
   * @throws {TypeError}
   * @throws {Error}
   */
  const generateDateSpan = function generateDateSpanFunc(inBegin, inEnd) {
    let retval = null;
    let daySpan = null;
    let newDateSpan = null;
    let beginMoment = null;
    if (_.isDate(inBegin) === false
        || _.isDate(inEnd) === false) {
      throw new TypeError('Invalid argument. Function expects two Date objects.');
    } else if (inBegin.getTime() >= inEnd.getTime()) {
      throw new Error('Invalid argument. Start date must preceed the end date.');
    }
    beginMoment = moment.tz(inBegin, tz);
    daySpan = dateSpan(inBegin, inEnd);
    if (beginMoment === null
        || daySpan === null) {
      throw new Error('Internal Error. Object not expected to be null.');
    }
    /* check if constraint matches parameters of the day */
    if ((constraint === modconst.CONSTRAINT_DAY_OF_WEEK
            && inDay >= modconst.SUNDAY
            && inDay <= modconst.SATURDAY
            && beginMoment.day() === day)
        || (constraint === modconst.CONSTRAINT_DAY_OF_MONTH
              && beginMoment.date() === day)) {
      newDateSpan = makeDateSpan(inBegin);
    }
    else if (constraint === modconst.CONSTRAINT_DAY_OF_WEEK
              && inDay >= modconst.WEEKDAYS_MIN_VALUE
              && inDay <= modconst.WEEKDAYS_MAX_VALUE) {

        if((inDay === modconst.WEEKDAYS_MON_FRI
              && beginMoment.day() >= modconst.MONDAY
              && beginMoment.day() <= modconst.FRIDAY)
            || (inDay === modconst.WEEKDAYS_MON_SAT
                  && beginMoment.day() >= modconst.MONDAY
                  && beginMoment.day() <= modconst.SATURDAY)
            || (inDay === modconst.WEEKDAYS_MON_SUN
                  && beginMoment.day() >= modconst.SUNDAY
                  && beginMoment.day() <= modconst.SATURDAY)
            || (inDay === modconst.WEEKDAYS_SUN_THURS
                  && beginMoment.day() >= modconst.SUNDAY
                  && beginMoment.day() <= modconst.THURSDAY)
            || (inDay === modconst.WEEKDAYS_SUN_FRI
                  && beginMoment.day() >= modconst.SUNDAY
                  && beginMoment.day() <= modconst.FRIDAY)
            || (inDay === modconst.WEEKDAYS_SAT_WED
                  && ((beginMoment.day() >= modconst.MONDAY
                      && beginMoment.day() <= modconst.WEDNESDAY)
                      || beginMoment.day() === modconst.SUNDAY
                      || beginMoment.day() === modconst.SATURDAY))
            || (inDay === modconst.WEEKDAYS_SAT_THURS
                  && beginMoment.day() >= modconst.SUNDAY
                  && beginMoment.day() <= modconst.SATURDAY
                  && beginMoment.day() !== modconst.FRIDAY)
            || (inDay === modconst.WEEKDAYS_BRUNEI
                  && beginMoment.day() >= modconst.MONDAY
                  && beginMoment.day() <= modconst.SATURDAY
                  && beginMoment.day() !== modconst.FRIDAY)
            || (inDay === modconst.WEEKDAYS_SAT_SUN
                        && (beginMoment.day() === modconst.SATURDAY
                            || beginMoment.day() === modconst.SUNDAY))
            || (inDay === modconst.WEEKDAYS_FRI_SAT
                        && (beginMoment.day() === modconst.FRIDAY
                            || beginMoment.day() === modconst.SATURDAY))
            || (inDay === modconst.WEEKDAYS_THURS_FRI
                        && (beginMoment.day() === modconst.THURSDAY
                            || beginMoment.day() === modconst.FRIDAY))
            || (inDay === modconst.WEEKDAYS_BRUNEI_WEEKEND
                        && (beginMoment.day() === modconst.FRIDAY
                            || beginMoment.day() === modconst.SUNDAY))
         ) {

          newDateSpan = makeDateSpan(inBegin);
        }
    }
    else if ((constraint !== modconst.CONSTRAINT_DAY_OF_WEEK
              && constraint !== modconst.CONSTRAINT_DAY_OF_MONTH)
            && beginMoment.date() === findDayOfMonth(constraint,
                                                      day,
                                                      beginMoment.year(),
                                                      beginMoment.month())) {
      newDateSpan = makeDateSpan(inBegin);
    }
    /* rule made a date-span - yipee */
    if (newDateSpan !== null) {
      retval = newDateSpan.intersect(daySpan);
    }
    return retval;
  };

/**
 * Create a DateSpan object based on three inputs:
 * - a specific date based on a Date object.
 * - time of the day based on the time associated with the rule.
 * - duration based on the duration of the rule.
 * @param {Date} inDate Date for which the date-span should be created. Must
 * be a valid Date object.
 * @return {@link module:caltime/datespan} A single DateSpan object.
 * @throws {TypeError}
 */
const makeDateSpan = function makeDateSpanFunc(inDate) {
  let retval = null;
  let ruleMoment = null;
  if (_.isDate(inDate) === false) {
    throw new TypeError('Invalid argument. Function expects a Date object.');
  }
  ruleMoment = moment.tz(inDate, tz);
  if (ruleMoment === null) {
    throw new Error('Internal Error. Object not expected to be null.');
  }
  ruleMoment = moment.tz(inDate, tz);
  ruleMoment.hour(timespan.getHours());
  ruleMoment.minutes(timespan.getMinutes());
  ruleMoment.seconds(timespan.getSeconds());
  ruleMoment.milliseconds(timespan.getMilliseconds());
  // use UTC time because time in rule has a timezone
  retval = dateSpan(ruleMoment.utc().toDate(),
                          null,
                          timespan.getDurationMins(),
                          timespan.getDurationSecs(),
                          timespan.getDurationMs());
  return retval;
};


/**
 * Find the day of the month which matches the constraint. The constraint
 * must be of the day-of-week type i.e.  CONSTRAINT_FIRST_OF_MONTH.
 * @param {number} inConstraint Integer. Constraint type.
 * @param {number} inDay Integer. Name of the day.
 * @param {number} inYear Integer. Year component of the date.
 * @param {number} inMonth Integer. Month component of the date. Range is 0-11.
 * @return {number} Integer which indicates the day of the month which
 * matches the constraint. Value should be in the range 1-31.
 * @throws {TypeError}
 * @throws {RangeError}
 * @throws {Error}
 */
const findDayOfMonth = function findDayOfMonthFunc(inConstraint,
                                                    inDay,
                                                    inYear,
                                                    inMonth) {
  let retval = 0;
  let tempMoment = null;
  // used to find first, second etc. instance of a day during the month
  let multiplier = 0;
  if (_.isInteger(inConstraint) === false
      || _.isInteger(inDay) === false
      || _.isInteger(inYear) === false
      || _.isInteger(inMonth) === false) {
    throw new TypeError('Invalid argument. Arguments must be integers.');
  }
  if (inConstraint !== modconst.CONSTRAINT_FIRST_OF_MONTH
      && inConstraint !== modconst.CONSTRAINT_SECOND_OF_MONTH
      && inConstraint !== modconst.CONSTRAINT_THIRD_OF_MONTH
      && inConstraint !== modconst.CONSTRAINT_FOURTH_OF_MONTH
      && inConstraint !== modconst.CONSTRAINT_FIFTH_OF_MONTH
      && inConstraint !== modconst.CONSTRAINT_LAST_OF_MONTH) {
    throw new RangeError('Invalid argument. Not the expeceted constraint type.');
  }
  if (inDay < modconst.DAY_MIN
      || inDay > modconst.DAY_MAX) {
    throw new RangeError('Invalid argument. Day of week outside permitted range.');
  }
  if (inMonth < modconst.MONTH_MIN
      || inMonth > modconst.MONTH_MAX) {
    throw new RangeError('Invalid argument. Month is outside permitted range.');
  }
  tempMoment = moment.tz('2000-01-01 12:00', tz);
  tempMoment.year(inYear);
  tempMoment.month(inMonth);
  tempMoment.startOf('month');
  /* last *day of month is one week backwards from first *day of next month */
  if (inConstraint == modconst.CONSTRAINT_LAST_OF_MONTH) {
    tempMoment.add(1, 'months');
    tempMoment.day(inDay);
    if (tempMoment.month() > inMonth) {
      tempMoment.subtract(7, 'days');
    }
    if (tempMoment.year() === inYear
        && tempMoment.month() === inMonth
        && tempMoment.day() === inDay) {
      retval = tempMoment.date();
    } else {
      throw new Error('Error calculating "last of month" constraint.');
    }
  } else {
    tempMoment.day(inDay);
    switch (inConstraint) {
      case modconst.CONSTRAINT_SECOND_OF_MONTH:
        multiplier = 1;
        break;
      case modconst.CONSTRAINT_THIRD_OF_MONTH:
        multiplier = 2;
        break;
      case modconst.CONSTRAINT_FOURTH_OF_MONTH:
        multiplier = 3;
        break;
      case modconst.CONSTRAINT_FIFTH_OF_MONTH:
        multiplier = 4;
        break;
    }
    // make sure setting day didn't bump moment back to previous month
    if (tempMoment.month() < inMonth) {
      tempMoment.add(7, 'days');
    }
    tempMoment.add(7*multiplier, 'days');
    if (tempMoment.year() === inYear
        && tempMoment.month() === inMonth
        && tempMoment.day() === inDay) {
      retval = tempMoment.date();
    } else {
      throw new Error('Error calculating with  "*th of month" constraint.');
    }
  }
  return retval;
};

/* functional constructor return */
return that;
};


/** public functions **********************************************************/


/* interface exported by the module */
module.exports.timeRule = timeRule;


/** private functions *********************************************************/
