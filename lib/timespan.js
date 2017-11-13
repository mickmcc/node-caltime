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
/* maximum value of seconds in the arguments inSeconds and inDurationSecs. */
const MAX_SECONDS = 59;
/* maximum value of milliseconds permitted in the arguments inMilliseconds
 * and inDurationMSecs. */
const MAX_MILLISECONDS = 999;
/* maximum permitted number of minutes per day. */
const MAX_MINS_PER_DAY = (24*60);
/* milliseconds in an hour */
const MSECS_PER_HOUR = (60*60*1000);
/* milliseconds per minute */
const MSECS_PER_MIN = (60*1000);

/**
 * Functional constructor which creates an instance of a TimeSpan.
 * Do not use with the 'new' operator.
 * Each TimeSpan object is immutable. The inclusive end time of a timespan
 * cannot exceed 23:59:59:999 i.e. the exclusive end time cannot exceed
 * 12 midnight (00:00:00:000 of the following day).
 * The total duration of a timespan is equal to:
 * inDurationMins + inDurationSecs + inDurationMSecs
 * @param {number} inHours Integer. Represents the 'hour of day' component
 * of the start time of the timespan. Valid values are 0-23.
 * An error is thrown if the integer is not specified or is not
 * within the valid range.
 * @param {number} inMinutes Integer. Represents the minutes component
 * of the start time of the timespan. Valid values are 0-59.
 * An error is thrown if the integer is not specified or is not within
 * the valid range.
 * @param {number} inSeconds Integer. Represents the seconds component
 * of the start time of the timespan. Valid values are 0-59.
 * An error is thrown if the integer is not specified or is not within
 * the valid range.
 * @param {number} inMilliseconds Integer. Represents the milliseconds component
 * of the start time of the timespan. Valid values are 0-999.
 * An error is thrown if the integer is not specified or is not within
 * the valid range.
 * @param {number} inDurationMins Positive integer representing the duration of
 * the timespan in [minutes]. An error is thrown if this argument is not
 * specified or it is not a valid, positive integer. Valid range is 0-1440.
 * @param {number} [inDurationSecs] Positive integer representing the [seconds]
 * component of the duration. An error is thrown if this argument is not
 * specified or it is not a valid, positive integer. Valid range is 0-59.
 * @param {number} [inDurationMSecs] Positive integer representing the
 * [milliseconds] component of the duration. An error is thrown if this argument
 * is not specified or it is not a valid, positive integer. Valid range is 0-999.
 * @return {object} A new instance of the TimeSpan object.
 */
let timeSpan = function timeSpanCtor(inHours,
                                      inMinutes,
                                      inSeconds,
                                      inMilliseconds,
                                      inDurationMins,
                                      inDurationSecs=0,
                                      inDurationMSecs=0) {

  /** private *****************************************************************/

  /* new instance of object */
  const that = {};
  /* hour when the timespan begins during the day. */
  const hours = inHours;
  /* minutes after the hour when the timespan begins. */
  const minutes = inMinutes;
  /* seconds component of the time the timespan begins. */
  const seconds = inSeconds;
  /* milliseconds component of the time the timespan begins. */
  const milliseconds = inMilliseconds;
  /* duration of the timespan in [minutes] */
  const durationMins = inDurationMins;
  /* [seconds] component of the duration of the timespan */
  const durationSecs = inDurationSecs;
  /* [milliseconds] component of the duration of the timespan */
  const durationMSecs = inDurationMSecs;

  // check values are within permitted ranges
  if(_.isInteger(inHours) === false
      || inHours < 0
      || inHours > MAX_HOUR_OF_DAY) {
    throw new Error('Invalid inHours argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inMinutes) === false
      || inMinutes < 0
      || inMinutes > MAX_MINUTES) {
    throw new Error('Invalid inMinutes argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inSeconds) === false
      || inSeconds < 0
      || inSeconds > MAX_SECONDS) {
    throw new Error('Invalid inSeconds argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inMilliseconds) === false
      || inMilliseconds < 0
      || inMilliseconds > MAX_MILLISECONDS) {
    throw new Error('Invalid inMilliseconds argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inDurationMins) === false
      || inDurationMins < 0
      || inDurationMins > MAX_MINS_PER_DAY) {
    throw new Error('Invalid inDurationMins argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inDurationSecs)
      && (inDurationSecs < 0
          || inDurationSecs > MAX_SECONDS)) {
    throw new Error('Invalid inDurationSecs argument passed to timeSpan constructor.');
  };
  if(_.isInteger(inDurationMSecs)
      && (inDurationMSecs < 0
          || inDurationMSecs > MAX_MILLISECONDS)) {
    throw new Error('Invalid inDurationMSecs argument passed to timeSpan constructor.');
  };

  console.log(`timespan value: ${(hours*MSECS_PER_HOUR)+(minutes*MSECS_PER_MIN)+(seconds*1000)+(milliseconds)+(inDurationMins*MSECS_PER_MIN)+(inDurationSecs*1000)+(inDurationMSecs)}`);
  console.log(`timespan limit: ${MAX_MINS_PER_DAY*MSECS_PER_MIN}`); // debug
  console.log(`timespan hours: ${(hours*MSECS_PER_HOUR)}`);
  console.log(`timespan mins: ${(minutes*MSECS_PER_MIN)}`);
  console.log(`timespan secs: ${(seconds*1000)}`);
  console.log(`timespan ms: ${(milliseconds)}`);
  console.log(`timespan duration-mins: ${(inDurationMins*MSECS_PER_MIN)}`);
  console.log(`timespan duration-secs: ${(inDurationSecs*1000)}`);
  console.log(`timespan duration-ms: ${(inDurationMSecs)}`);
  // check end time of timespan hasn't passed midnight
  if(((hours*MSECS_PER_HOUR)
      + (minutes*MSECS_PER_MIN)
      + (seconds*1000)
      + (milliseconds)
      + (inDurationMins*MSECS_PER_MIN)
      + (inDurationSecs*1000)
      + (inDurationMSecs)) > (MAX_MINS_PER_DAY*MSECS_PER_MIN)) {
    throw new Error('End time of timespan exceeds midnight. Timespan cannot be created.');
  };

  /** public methods **********************************************************/

  /**
   * Get the hour of the day value.
   * @return {number} Integer between 0 and 23.
   */
  that.getHours = function getHoursFunc() {

    return hours;
  }

  /**
   * Get the minutes value i.e. minutes of the time.
   * @return {number} Integer between 0 and 59.
   */
  that.getMinutes = function getMinutesFunc() {

    return minutes;
  }

  /**
   * Get the seconds value i.e. seconds component of the start time.
   * @return {number} Integer between 0 and 59.
   */
  that.getSeconds = function getSecondsFunc() {

    return seconds;
  }

  /**
   * Get the milliseconds value i.e. milliseconds component of the start time.
   * @return {number} Integer between 0 and 999.
   */
  that.getMilliseconds = function getMillisecondsFunc() {

    return milliseconds;
  }

  /**
   * Get the [minutes] component of the duration. This is not the total
   * duration, as this also has [seconds] and [milliseconds] components.
   * @return {number} Integer between 1 and MAX_MINS_PER_DAY.
   * Units are [minutes].
   */
  that.getDurationMins = function getDurationMinsFunc() {

    return durationMins;
  }

  /**
   * Get the [seconds] component of the duration. This is not the total
   * duration, as this also has [minutes] and [milliseconds] components.
   * @return {number} Integer between 1 and 59. Units are [seconds].
   */
  that.getDurationSecs = function getDurationSecsFunc() {

    return durationSecs;
  }

  /**
   * Get the [milliseconds] component of the duration. This is not the total
   * duration, as this also has [minutes] and [seconds] components.
   * @return {number} Integer between 1 and 999. Units are [milliseconds].
   */
  that.getDurationMSecs = function getDurationMSecsFunc() {

    return durationMSecs;
  }


  /** private methods *********************************************************/

  /* functional constructor returns a new instance */
  return that;
};

/* module exports the functional constructor */
module.exports.timeSpan = timeSpan;
module.exports.MAX_MINS_PER_DAY = MAX_MINS_PER_DAY;
