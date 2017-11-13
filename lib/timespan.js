/** @module schedtime/timespan
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');

/* constants */
/* maximum value of the hour of the day */
const MAX_HOUR_OF_DAY = 23;
/* maximum value of minutes past the hour */
const MAX_MINUTES = 59;
/* maximum allowed number of minutes per day */
const MAX_MINS_PER_DAY = 24*60;

/**
 * Functional constructor which creates an instance of a TimeSpan.
 * Each TimeSpan object is immutable.
 * @param {number} inHourOfDay Integer. Represents the hour of the day
 * component of the start time of the timespan. Valid
 * values are 0-23. An error is thrown if the integer is not specified or is not
 * within the valid range.
 * @param {number} inMinutes Integer. Represents the minutes component
 * of the start time of the timespan. Valid values
 * are 0-59. An error is thrown if the integer is not specified or is not within
 * the valid range.
 * @param {number} inDuration Positive Integer representing the duration of the
 * timespan in [minutes]. An error is thrown if this argument is not
 * specified or it is not a valid, positive integer.
 * @return {object} A new instance of the TimeSpan object.
 */
let timeSpan = function timeSpanCtor(inHourOfDay, inMinutes, inDuration) {

  /** private *****************************************************************/

  /* new instance of object */
  const that = {};
  /* hour when the timespan begins during the day. */
  const hourOfDay = inHourOfDay;
  /* minutes after the hour when timespan begins. */
  const minutes = inMinutes;
  /* duration of the timespan in [minutes] */
  const duration = inDuration;

  // check values are within permitted ranges
  if(_.isInteger(inHourOfDay) == false
      || inHourOfDay < 0
      || inHourOfDay > MAX_HOUR_OF_DAY) {
    throw new Error('Invalid inHourOfDay argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inMinutes) == false
      || inMinutes < 0
      || inMinutes > MAX_MINUTES) {
    throw new Error('Invalid inMinutes argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inDuration) == false
      || inDuration <= 0
      || inDuration > MAX_MINS_PER_DAY) {
    throw new Error('Invalid inDuration argument passed to timeSpan constructor.');
  };
  // check end time of timespan
  if((inHourOfDay*60)+inMinutes+duration > MAX_MINS_PER_DAY) {
    throw new Error('End of timespan rolled over past midnight.');
  }

  /** public methods **********************************************************/

  /**
   * Get the hour of the day value.
   * @return {number} Integer between 0 and 23.
   */
  that.getHourOfDay = function getHourOfDayFunc() {

    return hourOfDay;
  }

  /**
   * Get the minutes value i.e. minutes of the time.
   * @return {number} Integer between 0 and 59.
   */
  that.getMinutes = function getMinutesFunc() {

    return minutes;
  }

  /**
   * Get the duration value.
   * @return {number} Integer between 1 and MAX_MINS_PER_DAY.
   * Units are [minutes].
   */
  that.getDuration = function getDurationFunc() {

    return duration;
  }

  /** private methods *********************************************************/

  /* functional constructor returns a new instance */
  return that;
};

/* module exports the functional constructor */
module.exports.timeSpan = timeSpan;
module.exports.MAX_MINS_PER_DAY = MAX_MINS_PER_DAY;
