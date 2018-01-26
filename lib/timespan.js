/** @module caltime/timespan
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017-2018
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');

const modconst = require('./constants');

/* constants */
/* maximum value of the hour of the day */
const MAX_HOUR_OF_DAY = 23;
/* maximum value of minutes past the hour */
const MAX_MINUTES = 59;
/* maximum value of seconds in the arguments inSeconds and inDurationSecs. */
const MAX_SECONDS = 59;
/* maximum value of milliseconds permitted in the arguments inMilliseconds
 * and inDurationMs. */
const MAX_MILLISECONDS = 999;

/**
 * Functional constructor which creates an instance of a TimeSpan.
 * Do not use with the 'new' operator.
 * Each TimeSpan object is immutable. The inclusive end time of a timespan
 * cannot exceed 23:59:59:999 i.e. the exclusive end time cannot exceed
 * 12 midnight (00:00:00:000 of the following day).
 * The total duration of a timespan is equal to:
 * inDurationMins + inDurationSecs + inDurationMs
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
 * @param {number} [inDurationMs] Positive integer representing the
 * [milliseconds] component of the duration. An error is thrown if this argument
 * is not specified or it is not a valid, positive integer.
 * Valid range is 0-999.
 * @return {object} A new instance of the TimeSpan object.
 * @throws {Error}
 * @throws {RangeError}
 */
let timeSpan = function timeSpanCtor(inHours,
                                      inMinutes,
                                      inSeconds,
                                      inMilliseconds,
                                      inDurationMins,
                                      inDurationSecs=0,
                                      inDurationMs=0) {
  /* private ******************************************************************/

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
  const durationMs = inDurationMs;

  // check values are within permitted ranges and of correct type
  if (_.isInteger(inHours) === false
      || inHours < 0
      || inHours > MAX_HOUR_OF_DAY) {
    throw new Error('Invalid inHours argument.');
  };
  if (_.isInteger(inMinutes) === false
      || inMinutes < 0
      || inMinutes > MAX_MINUTES) {
    throw new Error('Invalid inMinutes argument.');
  };
  if (_.isInteger(inSeconds) === false
      || inSeconds < 0
      || inSeconds > MAX_SECONDS) {
    throw new Error('Invalid inSeconds argument.');
  };
  if (_.isInteger(inMilliseconds) === false
      || inMilliseconds < 0
      || inMilliseconds > MAX_MILLISECONDS) {
    throw new Error('Invalid inMilliseconds argument.');
  };
  if (_.isInteger(inDurationMins) === false
      || inDurationMins < 0
      || inDurationMins > modconst.MAX_MINS_PER_DAY) {
    throw new Error('Invalid inDurationMins argument.');
  };
  if (_.isInteger(inDurationSecs)
      && (inDurationSecs < 0
          || inDurationSecs > MAX_SECONDS)) {
    throw new Error('Invalid inDurationSecs argument.');
  };
  if (_.isInteger(inDurationMs)
      && (inDurationMs < 0
          || inDurationMs > MAX_MILLISECONDS)) {
    throw new Error('Invalid inDurationMs argument.');
  };
  // check end time of timespan hasn't passed midnight
  if (((hours * modconst.MSECS_PER_HOUR)
      + (minutes * modconst.MSECS_PER_MIN)
      + (seconds * 1000)
      + (milliseconds)
      + (inDurationMins * modconst.MSECS_PER_MIN)
      + (inDurationSecs * 1000)
      + (inDurationMs)) > (modconst.MAX_MINS_PER_DAY * modconst.MSECS_PER_MIN)) {
    throw new RangeError('End time of timespan exceeds midnight.');
  };

  /* public methods ***********************************************************/

  /**
   * Get the hour of the day value.
   * @return {number} Integer between 0 and 23.
   */
  that.getHours = function getHoursFunc() {
    return hours;
  };

  /**
   * Get the minutes value i.e. minutes of the time.
   * @return {number} Integer between 0 and 59.
   */
  that.getMinutes = function getMinutesFunc() {
    return minutes;
  };

  /**
   * Get the seconds value i.e. seconds component of the start time.
   * @return {number} Integer between 0 and 59.
   */
  that.getSeconds = function getSecondsFunc() {
    return seconds;
  };

  /**
   * Get the milliseconds value i.e. milliseconds component of the start time.
   * @return {number} Integer between 0 and 999.
   */
  that.getMilliseconds = function getMillisecondsFunc() {
    return milliseconds;
  };

  /**
   * Get the [minutes] component of the duration. This is not the total
   * duration, as this also has [seconds] and [milliseconds] components.
   * @return {number} Integer between 1 and MAX_MINS_PER_DAY.
   * Units are [minutes].
   */
  that.getDurationMins = function getDurationMinsFunc() {
    return durationMins;
  };

  /**
   * Get the [seconds] component of the duration. This is not the total
   * duration, as this also has [minutes] and [milliseconds] components.
   * @return {number} Integer between 1 and 59. Units are [seconds].
   */
  that.getDurationSecs = function getDurationSecsFunc() {
    return durationSecs;
  };

  /**
   * Get the [milliseconds] component of the duration. This is not the total
   * duration, as this also has [minutes] and [seconds] components.
   * @return {number} Integer between 1 and 999. Units are [milliseconds].
   */
  that.getDurationMs = function getDurationMsFunc() {
    return durationMs;
  };

  /**
   * Get the total duration of the timespan in [milliseconds].
   * @return {number} Integer representing the duration of the timespan.
   * Units are [milliseconds].
   */
  that.getTotalDuration = function getTotalDurationFunc() {
    let retval = 0;
    retval += (durationMins * modconst.MSECS_PER_MIN);
    retval += (durationSecs * 1000);
    retval += durationMs;
    return retval;
  };

  /**
   * Query if two TimeSpan objects are equal. Equality means they have the
   * exact same start time and duration.
   * @param {Object} inTimeSpan Another instance of TimeSpan. A TypeError is
   * thrown if this is not a valid TimeSpan object.
   * @return {boolean} true if the TimeSpan objects are equal, otherwise false.
   * @throws {TypeError}
   */
  that.isEqual = function isEqualFunc(inTimeSpan) {
    let retval = false;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Method expects a valid TimeSpan object.');
    }
    if (that === inTimeSpan
        || (hours == inTimeSpan.getHours()
            && minutes == inTimeSpan.getMinutes()
            && seconds == inTimeSpan.getSeconds()
            && milliseconds === inTimeSpan.getMilliseconds()
            && that.getTotalDuration() === inTimeSpan.getTotalDuration())) {
      retval = true;
    }
    return retval;
  };

  /**
   * Query if a timespan intersects (overlaps) with a different timespan.
   * The end-times of timespans are exclusive therefore more than the end
   * time must overlap.
   * @param {Object} inTimeSpan TimeSpan object. A TypeError is thrown if the
   * argument is not a valid TimeSpan object.
   * @return {boolean} true if the TimeSpan objects intersect, otherwise
   * false is returned.
   * @throws {TypeError}
   */
  that.isIntersect = function isIntersectFunc(inTimeSpan) {
    let retval = true;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Invalid argument. Expects TimeSpan object.');
    }
    if (calcEndMs(that) <= calcBeginMs(inTimeSpan)
        || calcBeginMs(that) >= calcEndMs(inTimeSpan)) {
      retval = false;
    }
    return retval;
  };

  /**
   * Create a new TimeSpan object which represents the intersection of
   * two other TimeSpan objects.
   * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
   * if an invalid value is passed.
   * @return {Object|null} A TimeSpan object or null if there is no
   * intersection (overlapping).
   * @throws {TypeError}
   *
   */
  that.intersect = function intersectFunc(inTimeSpan) {
    let retval = null;
    let beginSpan = null;
    let endSpan = null;
    let newDurationMs = 0;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Invalid TimeSpan argument passed to function.');
    }
    if (that.isIntersect(inTimeSpan)) {
      beginSpan = (calcBeginMs(that) > calcBeginMs(inTimeSpan)
                    && calcBeginMs(that) < calcEndMs(inTimeSpan))?that:inTimeSpan;
      endSpan = (calcEndMs(that) > calcBeginMs(inTimeSpan)
                  && calcEndMs(that) < calcEndMs(inTimeSpan))?that:inTimeSpan;
      newDurationMs = calcEndMs(endSpan) - calcBeginMs(beginSpan);
      retval = timeSpan(beginSpan.getHours(),
                          beginSpan.getMinutes(),
                          beginSpan.getSeconds(),
                          beginSpan.getMilliseconds(),
                          Math.floor(newDurationMs / modconst.MSECS_PER_MIN),
                          Math.floor((newDurationMs % modconst.MSECS_PER_MIN) / modconst.MSECS_PER_SEC),
                          Math.floor(newDurationMs % modconst.MSECS_PER_SEC));
    }
    return retval;
  };

  /**
   * Create a new TimeSpan object which represents the union of
   * this TimeSpan object with another TimeSpan object. The timespans must
   * intersect for the union to be possible.
   * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
   * if an invalid value is passed.
   * @return {Object|null} A TimeSpan object or null if there is no
   * intersection (overlapping).
   * @throws {TypeError}
   *
   */
  that.union = function unionFunc(inTimeSpan) {
    let retval = null;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Invalid TimeSpan argument passed to function.');
    }
    const beginSpan = (calcBeginMs(that) < calcBeginMs(inTimeSpan))?that:inTimeSpan;
    const endSpan = (calcEndMs(that) > calcEndMs(inTimeSpan))?that:inTimeSpan;
    if (that.isIntersect(inTimeSpan)) {
      let newDurationMs = calcEndMs(endSpan) - calcBeginMs(beginSpan);
      retval = timeSpan(beginSpan.getHours(),
                          beginSpan.getMinutes(),
                          beginSpan.getSeconds(),
                          beginSpan.getMilliseconds(),
                          Math.floor(newDurationMs / modconst.MSECS_PER_MIN),
                          Math.floor((newDurationMs % modconst.MSECS_PER_MIN) / modconst.MSECS_PER_SEC),
                          Math.floor(newDurationMs % modconst.MSECS_PER_SEC));
    }
    return retval;
  };

  /**
   * Create one or two TimeSpan objects which represent the subtraction of
   * one timespan from another timespan. inTimeSpan must fully overlap
   * with this timespan. inTimeSpan is subtracted from this TimeSpan.
   * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
   * if an invalid value is passed.
   * @return {Array|null} An array of TimeSpan objects or null if there was
   * not enough intersection (overlapping) for the subtraction to be performed.
   * Subtracting two equal timespans will produce an empty array.
   * @throws {TypeError}
   */
  that.subtract = function subtractFunc(inTimeSpan) {
    let retval = [];
    let newBeginSplit = null;
    let newDurationSplit = null;
    let newSpan = null;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Invalid TimeSpan argument passed to function.');
    }
    if (that.isIntersect(inTimeSpan)
        && calcBeginMs(that) <= calcBeginMs(inTimeSpan)
        && calcEndMs(that) >= calcEndMs(inTimeSpan)) {
          // remainder timespan at beginning of this timespan
          if (calcEndMs(that) >= calcEndMs(inTimeSpan)
                    && calcBeginMs(that) < calcBeginMs(inTimeSpan)) {
            newBeginSplit = splitTime(calcBeginMs(that));
            newDurationSplit = splitTime(calcBeginMs(inTimeSpan) - calcBeginMs(that));
            newSpan = timeSpan(newBeginSplit.hours,
                                newBeginSplit.minutes,
                                newBeginSplit.seconds,
                                newBeginSplit.milliseconds,
                                (newDurationSplit.hours * 60) + newDurationSplit.minutes,
                                newDurationSplit.seconds,
                                newDurationSplit.milliseconds);
            retval.push(newSpan);
          }
          // remainder timespan at end of this timespan.
          if (calcBeginMs(that) <= calcBeginMs(inTimeSpan)
              && calcEndMs(that) > calcEndMs(inTimeSpan)) {
            newBeginSplit = splitTime(calcEndMs(inTimeSpan));
            newDurationSplit = splitTime(calcEndMs(that) - calcEndMs(inTimeSpan));
            newSpan = timeSpan(newBeginSplit.hours,
                                newBeginSplit.minutes,
                                newBeginSplit.seconds,
                                newBeginSplit.milliseconds,
                                (newDurationSplit.hours * 60) + newDurationSplit.minutes,
                                newDurationSplit.seconds,
                                newDurationSplit.milliseconds);
            retval.push(newSpan);
          }
    } else if (calcBeginMs(that) > calcBeginMs(inTimeSpan)
            || calcEndMs(that) < calcEndMs(inTimeSpan)) {
      // insufficient overlap for subtraction
      retval = null;
    }
    return retval;
  };

  /**
   * Create one or two TimeSpan objects which represent the section of
   * one TimeSpan which does not overlap with another. inTimeSpan does not have
   * to overlap with this timespan but if it does, the intervals which overlap
   * are not returned in the result.
   * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
   * if an invalid value is passed.
   * @return {Array} An array of TimeSpan objects. An empty array can be
   * be returned if there is a complete overlap between the timespans.
   * @throws {TypeError}
   */
  that.difference = function differenceFunc(inTimeSpan) {
    let retval = [];
    let newBeginSplit = null;
    let newDurationSplit = null;
    let newSpan = null;
    if (_.isObject(inTimeSpan) === false) {
      throw new TypeError('Invalid TimeSpan argument passed to function.');
    }
    if (that.isIntersect(inTimeSpan)) {
          // remainder timespan at beginning of this timespan
          if (calcBeginMs(that) < calcBeginMs(inTimeSpan)) {
            newBeginSplit = splitTime(calcBeginMs(that));
            newDurationSplit = splitTime(calcBeginMs(inTimeSpan) - calcBeginMs(that));
            newSpan = timeSpan(newBeginSplit.hours,
                                newBeginSplit.minutes,
                                newBeginSplit.seconds,
                                newBeginSplit.milliseconds,
                                (newDurationSplit.hours * 60) + newDurationSplit.minutes,
                                newDurationSplit.seconds,
                                newDurationSplit.milliseconds);
            retval.push(newSpan);
          }
          // remainder timespan at end of this timespan.
          if (calcEndMs(that) > calcEndMs(inTimeSpan)) {
            newBeginSplit = splitTime(calcEndMs(inTimeSpan));
            newDurationSplit = splitTime(calcEndMs(that) - calcEndMs(inTimeSpan));
            newSpan = timeSpan(newBeginSplit.hours,
                                newBeginSplit.minutes,
                                newBeginSplit.seconds,
                                newBeginSplit.milliseconds,
                                (newDurationSplit.hours * 60) + newDurationSplit.minutes,
                                newDurationSplit.seconds,
                                newDurationSplit.milliseconds);
            retval.push(newSpan);
          }
    } else if (that.isIntersect(inTimeSpan) === false) {
      // no intersection so unmodified, whole timespan is returned
      retval.push(that);
    }
    return retval;
  };

  /**
   * Convert the state of the TimeSpan object to a string. Method is only
   * intended for debugging purposes. The format of the string will change
   * in future releases.
   * @return {string} String holding the state of the timespan.
   */
  that.toString = function toStringFunc() {
    let retval = `[ ${hours}:${minutes}:${seconds}:`;
    retval = retval + `${milliseconds}, `;
    retval = retval + `${durationMins}:${durationSecs}:`;
    retval = retval + `${durationMs} ]`;
    return retval;
  };

  /* functional constructor returns a new instance of TimeSpan object. */
  return that;
};


/* private module functions ***************************************************/

/**
 * Get the inclusive begin time of a TimeSpan in milliseconds. This is
 * the time elapsed since 00:00:00 (midnight) of the same day.
 * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
 * if the object is not an instance of TimeSpan.
 * @return {number} Start time in [milliseconds].
 * @throws {TypeError}
 */
const calcBeginMs = function calcBeginMsFunc(inTimeSpan) {
  let retval = 0;
  if (_.isObject(inTimeSpan) === false) {
    throw new TypeError('Invalid TimeSpan argument passed to function.');
  }
  retval += (inTimeSpan.getHours() * modconst.MSECS_PER_HOUR);
  retval += (inTimeSpan.getMinutes() * modconst.MSECS_PER_MIN);
  retval += (inTimeSpan.getSeconds() * 1000);
  retval += inTimeSpan.getMilliseconds();
  return retval;
};

/**
 * Get the exclusive end time of a TimeSpan in milliseconds. This is
 * the time elapsed since 00:00:00 (midnight) of the same day.
 * @param {Object} inTimeSpan A valid TimeSpan object. A TypeError is thrown
 * if the object is not an instance of TimeSpan.
 * @return {number} End time in [milliseconds].
 * @throws {TypeError}
 */
const calcEndMs = function calcEndMsecsFunc(inTimeSpan) {
  let retval = 0;
  if (_.isObject(inTimeSpan) === false) {
    throw new TypeError('Invalid TimeSpan argument passed to function.');
  }
  retval = calcBeginMs(inTimeSpan);
  retval += inTimeSpan.getTotalDuration();
  return retval;
};


/**
 * Split the time of the day, when expressed in [milliseconds] into hours,
 * minutes, seconds and milliseconds.
 * @param {number} inMilliseconds Time of the day in milliseconds i.e. time
 * elapsed since the previous midnight.
 * @return {Object} An object with four data members, one each for the time
 * component in hours, minutes, seconds and milliseconds.
 */
const splitTime = function splitTimeFunc(inMilliseconds) {
  let retval = {};
  let doneMs = 0;
  retval.hours = Math.floor(inMilliseconds / modconst.MSECS_PER_HOUR);
  doneMs = retval.hours * modconst.MSECS_PER_HOUR;
  retval.minutes = Math.floor((inMilliseconds - doneMs) / modconst.MSECS_PER_MIN);
  doneMs += retval.minutes * modconst.MSECS_PER_MIN;
  retval.seconds = Math.floor((inMilliseconds - doneMs) / modconst.MSECS_PER_SEC);
  retval.milliseconds = Math.floor(inMilliseconds % modconst.MSECS_PER_SEC); ;
  return retval;
};


/** public functions **********************************************************/


/**
 * Merge multiple, intersecting and non-intersecting timespans within an array.
 * @param {Array} inSpans Array of timespans. All of the timespans do
 * not have to be intersecting but those which are will be merged together using
 * a union operation. A TypeError is thrown if an array is not passed as
 * the argument.
 * @return {Array} Array containing the merged and unmerged timespans.
 * @throws {TypeError}
 * TODO verify returned array is always sorted.
 */
let mergeSpans = function mergeSpansFunc(inSpans) {
  const retval = [];
  let newBegin = null;
  let newEnd = null;
  if (_.isArray(inSpans) === false) {
    throw new TypeError('Function expects an array as argument.');
  }
  const sorted = _.sortBy(inSpans,
                          function(obj) {
                            return obj.getBegin;
                          });

  for (let i=0; i<sorted.length; i++) {
    let currentSpan = sorted[i];
    /* do we have enough to make a timespan after last iteration. only create
       where previous timespan does not intersect with current. */
    if (newBegin !== null
        && newEnd !== null
        && calcEndMs(newEnd) <= calcBeginMs(currentSpan)) {
      let durationSplit = splitTime(calcEndMs(newEnd)-calcBeginMs(newBegin));
      let newSpan = timeSpan(newBegin.getHours(),
                              newBegin.getMinutes(),
                              newBegin.getSeconds(),
                              newBegin.getMilliseconds(),
                              (durationSplit.hours * 60) + durationSplit.minutes,
                              durationSplit.seconds,
                              durationSplit.milliseconds);
      retval.push(newSpan);
      newBegin = null;
      newEnd = null;
    }
    if (newBegin === null) {
      newBegin = currentSpan;
    }
    if (newEnd === null
        || calcEndMs(newEnd) <= calcEndMs(currentSpan)) {
      newEnd = currentSpan;
    }
  } // end of loop
  if (newBegin !== null
      && newEnd != null) {
      let durationSplit = splitTime(calcEndMs(newEnd)-calcBeginMs(newBegin));
      let newSpan = timeSpan(newBegin.getHours(),
                              newBegin.getMinutes(),
                              newBegin.getSeconds(),
                              newBegin.getMilliseconds(),
                              (durationSplit.hours * 60) + durationSplit.minutes,
                              durationSplit.seconds,
                              durationSplit.milliseconds);
    retval.push(newSpan);
  }
  return retval;
};

/**
 * Sort multiple date-spans within an array by their start time.
 * @param {Array} inSpans Array of date-spans.
 * A TypeError is thrown if an array is not passed as the argument.
 * @param {boolean} [inIsDescending=false] true if date-spans should be sorted
 * in descending order. The default is true which means the date-spans should
 * be sorted in ascending order.
 * @return {Array} Array containing the sorted date-spans.
 * @throws {TypeError}
 */
let sortSpans = function sortSpansFunc(inSpans, inIsDescending=false) {
  let retval = null;
  let order = 'asc';
  if (_.isArray(inSpans) === false) {
    throw new TypeError('Function expects an array as argument.');
  }
  if (_.isBoolean(inIsDescending)
      && inIsDescending) {
    order = 'desc';
  }
  retval = _.orderBy(inSpans,
                          [function(obj) {
                              return calcBeginMs(obj);
                            }],
                          [order]);
  return retval;
};


/* module exports the functional constructor */
module.exports.timeSpan = timeSpan;
module.exports.sortSpans = sortSpans;
module.exports.mergeSpans = mergeSpans;
