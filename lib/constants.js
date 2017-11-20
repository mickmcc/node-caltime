/** @module caltime/constants
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017
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
   *  week. The day must be in the range 0-6 (Sunday-Saturday). */
  CONSTRAINT_DAY_OF_WEEK: 0,
  /** Constraint on TimeRule. Day of the month when the rule applies is specified
   *  by the day argument. The day must be an integer between 1-31.
  *   Date-spans will be created on the same day of every month. */
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

});
