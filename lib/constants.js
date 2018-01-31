/** @module caltime/constants
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017-2018
 * @license MIT
 */

'use strict';

module.exports = Object.freeze({

  /** Milliseconds per second */
  MSECS_PER_SEC: (1000),
  /** Milliseconds per minute. */
  MSECS_PER_MIN: (60 * 1000),
  /** Milliseconds per hour. */
  MSECS_PER_HOUR: (60 * 60 * 1000),
  /** Milliseconds in a 24-hour day. */
  MSECS_PER_DAY: (24 * 60 * 60 * 1000),

  /** Maximum duration of a day in [minutes]. */
  MAX_MINS_PER_DAY: (24 * 60),

  /** Minimum permitted value of day of the week */
  DAY_MIN: 0,
  /** Day of the week - Sunday. See Date.getDay(). */
  SUNDAY: 0,
  /** Day of the week - Sunday. See Date.getDay(). */
  MONDAY: 1,
  /** Day of the week - Sunday. See Date.getDay(). */
  TUESDAY: 2,
  /** Day of the week - Sunday. See Date.getDay(). */
  WEDNESDAY: 3,
  /** Day of the week - Sunday. See Date.getDay(). */
  THURSDAY: 4,
  /** Day of the week - Sunday. See Date.getDay(). */
  FRIDAY: 5,
  /** Day of the week - Sunday. See Date.getDay(). */
  SATURDAY: 6,
  /** Minimum permitted value of day of the week */
  DAY_MAX: 6,

  /** Minimum permitted day of the month */
  DATE_MIN: 1,
  /** Maximum permitted day of the month */
  DATE_MAX: 31,

  /** Minimum permitted month of the year - January. see Date.getMonth(). */
  MONTH_MIN: 0,
  /** Month - January. See Date.getMonth() */
  JAN: 0,
  /** Month - February. See Date.getMonth() */
  FEB: 1,
  /** Month - March. See Date.getMonth() */
  MAR: 2,
  /** Month - April. See Date.getMonth() */
  APR: 3,
  /** Month - May. See Date.getMonth() */
  MAY: 4,
  /** Month - June. See Date.getMonth() */
  JUN: 5,
  /** Month - July. See Date.getMonth() */
  JUL: 6,
  /** Month - August. See Date.getMonth() */
  AUG: 7,
  /** Month - February. See Date.getMonth() */
  SEPT: 8,
  /** Month - October. See Date.getMonth() */
  OCT: 9,
  /** Month - November. See Date.getMonth() */
  NOV: 10,
  /** Month - DECEMBER. See Date.getMonth() */
  DEC: 11,
  /** Maximum permitted month of the year - December. see Date.getMonth(). */
  MONTH_MAX: 11,

  /* Minimum permitted value for TimeRule constraint. */
  CONSTRAINT_MIN_VALUE: 0,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the same day of every
   *  week. The day must be in the range 0-6 (Sunday-Saturday) or within
   *  the range WEEKDAYS_MIN_VALUE to WEEKDAYS_MAX_VALUE. */
  CONSTRAINT_DAY_OF_WEEK: 0,
  /** Constraint on TimeRule. Day of the month when the rule applies is
   *  specified by the day argument. The day must be an integer between 1-31.
   *  Date-spans will be created on the same day of every month. */
  CONSTRAINT_DAY_OF_MONTH: 1,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the first occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_FIRST_OF_MONTH: 2,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the second occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_SECOND_OF_MONTH: 3,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the third occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_THIRD_OF_MONTH: 4,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the fourth occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_FOURTH_OF_MONTH: 5,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the fifth occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_FIFTH_OF_MONTH: 6,
  /** Constraint on TimeRule. Day of the week when the rule applies is specified
   *  by the day argument. Date-spans will be created on the last occurance
   *  of the day each month. The day must be in the range 0-6 (Sunday-Saturday).
   */
  CONSTRAINT_LAST_OF_MONTH: 7,
  /* Maximum permitted value for a TimeRule constraint. */
  CONSTRAINT_MAX_VALUE: 7,

  /* Minimum permitted value accepted by TimeRule#calcDuration. */
  DURATION_MIN_VALUE: 0,
  /** Defines how the duration of DateSpans is calculated by the TimeRule#calcDuration
   *  function. When this constant is passed as an argument, the duration is the
   *  sum total of all of the DateSpan's durations in milliseconds. No rounding
   *  or counting of the overlap with clock time is used.
   */
  DURATION_RAW_MSECS: 0,
  /** Defines how the duration of DateSpans is calculated by the TimeRule#calcDuration
   *  function. When this constant is passed as an argument, the duration is
   *  calculated by counting all of the 'natural seconds' which overlap with each
   *  DateSpan. A 'natural second' is a period of time, of 1 second duration,
   *  which spans from any time with a milliseconds value of 0 to the next time
   *  with a milliseconds value of 999 (inclusive).
   */
  DURATION_NATURAL_SECS: 1,
  /** Defines how the duration of DateSpans is calculated by the TimeRule#calcDuration
   *  function. When this constant is passed as an argument, the duration is
   *  calculated by counting all of the 'natural minutes' which overlap with each
   *  DateSpan. A 'natural minute' is a period of time, of 1 minute duration,
   *  which spans from any time with a ss:msec value of 00:000 to the next time
   *  with a ss:msec value of 59:999 (inclusive).
   */
  DURATION_NATURAL_MINS: 2,
  /** Defines how the duration of DateSpans is calculated by the TimeRule#calcDuration
   *  function. When this constant is passed as an argument, the duration is
   *  calculated by counting all of the 'natural hours' which overlap with each
   *  DateSpan. A 'natural hour' is a period of time, of 1 hour duration,
   *  which spans from any time with a mm:ss:ms value of 00:00:000 to the next time
   *  with a mm:ss:ms value of 59:59:999 (inclusive).
   */
  DURATION_NATURAL_HOURS: 3,
  /** Defines how the duration of DateSpans is calculated by the TimeRule#calcDuration
   *  function. When this constant is passed as an argument, the duration is
   *  calculated by counting all of the 'natural days' which overlap with each
   *  DateSpan. A 'natural day' is a period of time, of 24 hours duration,
   *  which spans from 00:00 midnight to the following midnight.
   */
  DURATION_NATURAL_DAYS: 4,
  /* Maximum permitted value accepted by TimeRule#calcDuration. */
  DURATION_MAX_VALUE: 4,

  /* Minimum permitted value accepted by TimeRule#timeRule. Values must not overlap
   * with the values used by Date to represent the days of the week. */
  WEEKDAYS_MIN_VALUE: 8,
  /** Monday - Friday, 5 day working week.
   */
  WEEKDAYS_MON_FRI: 8,
  /** Sunday to Thursday, 5 day working week.
   */
  WEEKDAYS_SUN_THURS: 9,
  /** Monday to Saturday, 6 day working week.
   */
  WEEKDAYS_MON_SAT: 10,
  /** Monday to Sunday, 7 days of the week.
   */
  WEEKDAYS_MON_SUN: 11,
  /** Sunday to Friday, 6 day working week.
   */
  WEEKDAYS_SUN_FRI: 12,
  /** Saturday to Wednesday, 6 day working week.
   */
  WEEKDAYS_SAT_WED: 13,
  /** Saturday to Thursday, 5 day working week.
   */
  WEEKDAYS_SAT_THURS: 14,
  /** Monday - Thursday and Saturday. Split weekend on Friday and Sunday.
   */
  WEEKDAYS_BRUNEI: 15,
  /** Saturday - Sunday, 2 day weekend.
   */
  WEEKDAYS_SAT_SUN: 16,
  /**  day to day, 2 day weekend.
   */
  WEEKDAYS_FRI_SAT: 17,
  /** Thursday to Friday, 2 day weekend.
   */
  WEEKDAYS_THURS_FRI: 18,
  /** Firday and Sunday, 2 day weekend.
   */
  WEEKDAYS_BRUNEI_WEEKEND: 19,
  /* Maximum permitted value accepted by TimeRule#timeRule. */
  WEEKDAYS_MAX_VALUE: 19
});
