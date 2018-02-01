/** @module caltime/DateSpan
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017-2018
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');
const moment = require('moment-timezone');
const modconst = require('./constants');

/* local constants */
/* maximum seconds duration */
const MAX_SECS = (59);
/* maximum milliseconds duration */
const MAX_MSECS = (999);


/**
 * Functional constructor which creates an instance of a DateSpan object.
 * Each DateSpan object is immutable.
 * A DateSpan represents a slice of time between a definite begin time
 * and a definite end time. This means that a DateSpan object is anchored
 * to a specific date and time.
 * @param {Date} inBegin Date object representing the starting time of
 * the DateSpan.
 * @param {Date} [inEnd=null] Date object representing the end time of
 * the DateSpan.  If null is passed then inDurationMins must be specified. An
 * error is thrown if neither inEnd nor inDurationMins are specified.
 * inEnd must be equal to or after inBegin.
 * @param {number} [inDurationMins=0] Integer representing the duration of the
 * DateSpan in [minutes]. Must be greater than zero if inEnd is not
 * specified.  An error is thrown if both inEnd and inDurationMins
 * are specified.
 * @param {number} [inDurationSecs=0] Integer representing the [seconds]
 * component of the duration. Value defaults to zero if not specified.
 * An error is thrown if both inEnd and inDurationMins are specified.
 * @param {number} [inDurationMs=0] Integer representing the [milliseconds]
 * component of the duration. Value defaults to zero if not specified.
 * An error is thrown if both inEnd and inDurationMins are specified.
 * @return {@link module:caltime/datespan} Instance of DateSpan object.
 * @throws {Error}
 */
let dateSpan = function dateSpanFunc(inBegin,
                                      inEnd=null,
                                      inDurationMins=0,
                                      inDurationSecs=0,
                                      inDurationMs=0) {
  /** private *****************************************************************/
  /* new instance of object */
  const that = {};
  /* moment the datespan begins. Must be a Date object. */
  const begin = inBegin;
  /* Number holding the duration of the datespan in [minutes] */
  let durationMins = inDurationMins;
  /* Number holding the [seconds] component of the duration */
  let durationSecs = inDurationSecs;
  /* Number holding the [milliseconds] component of the duration */
  let durationMSecs = inDurationMs;

  if (_.isNil(inBegin)
        || _.isDate(inBegin) === false) {
    throw new Error('Invalid inBegin argument.');
  };
  if (_.isInteger(inDurationMins)
        && (inDurationMins < 0
            || inDurationMins > Number.MAX_SAFE_INTEGER)) {
    throw new Error('Invalid inDurationMins argument.');
  };
  if (_.isInteger(inDurationSecs)
        && (inDurationSecs < 0
            || inDurationSecs > MAX_SECS)) {
    throw new Error('Invalid inDurationSecs argument.');
  };
  if (_.isInteger(inDurationMs)
        && (inDurationMs < 0
            || inDurationMs > MAX_MSECS)) {
    throw new Error('Invalid inDurationMs argument.');
  };
  if (_.isDate(inEnd)
      && (_.toSafeInteger(inDurationMins) > 0
          || _.toSafeInteger(inDurationSecs) > 0
          || _.toSafeInteger(inDurationMs)) > 0) {
    throw new Error('inEnd and a duration cannot be specified together.');
  }
  if (_.isDate(inEnd) === false
      && (_.isInteger(inDurationMins) === false
          || _.isInteger(inDurationSecs) === false
          || _.isInteger(inDurationMs) === false)) {
    throw new Error('inEnd or a duration must be specified.');
  }
  if (_.isDate(inEnd)
    && inEnd.getTime() < inBegin.getTime()) {
    throw new Error('inBegin must be before or the same as inEnd.');
  }
  if (_.isDate(inEnd)) {
    let delta = inEnd.getTime() - inBegin.getTime();
    durationMins = Math.floor(delta / modconst.MSECS_PER_MIN);
    delta = delta - (durationMins * modconst.MSECS_PER_MIN);
    durationSecs = Math.floor(delta / 1000);
    durationMSecs = Math.floor(delta - (durationSecs * 1000));
  }

  /** public methods **********************************************************/

  /**
   * Get the beginning moment of the DateSpan.
   * @return {Date} Date object representing the inclusive starting moment
   * of the DateSpan.
   */
  that.getBegin = function getBeginFunc() {
    return begin;
  };

  /**
   * Get the [minutes] component of the duration. The total duration of the
   * DateSpan is the sum of the [minutes], [seconds] and [milliseconds]
   * components of the duration.
   * @return {number} Integer with a component of the duration in [minutes].
   */
  that.getDurationMins = function getDurationMinsFunc() {
    return durationMins;
  };

  /**
   * Get the [seconds] component of the duration. The total duration of the
   * DateSpan is the sum of the [minutes], [seconds] and [milliseconds]
   * components of the duration.
   * @return {number} Integer with a component of the duration in [seconds].
   */
  that.getDurationSecs = function getDurationSecsFunc() {
    return durationSecs;
  };

  /**
   * Get the [milliseconds] component of the duration. The total duration of the
   * DateSpan is the sum of the [minutes], [seconds] and [milliseconds]
   * components of the duration.
   * @return {number} Integer with [milliseconds] component of the duration.
   */
  that.getDurationMs = function getDurationMsFunc() {
    return durationMSecs;
  };

  /**
   * Get the total duration. The total duration of the
   * DateSpan is the sum of the [minutes], [seconds] and [milliseconds]
   * components of the duration.
   * @return {number} Integer with the duration in [milliseconds].
   */
  that.getTotalDuration = function getTotalDurationFunc() {
    let retval = durationMSecs;
    retval += (durationSecs*1000);
    retval += (durationMins*60*1000);
    return retval;
  };

  /**
   * Get the exclusive end moment of the DateSpan.
   * @return {Date} Date object which represents the final, non-inclusive
   * moment of the DateSpan.
   */
  that.getEnd = function getEndFunc() {
    const retval = new Date(begin);
    retval.setUTCMinutes(retval.getUTCMinutes()+durationMins);
    retval.setUTCSeconds(retval.getUTCSeconds()+durationSecs);
    retval.setUTCMilliseconds(retval.getUTCMilliseconds()+durationMSecs);
    return retval;
  };

  /**
   * Query if two DateSpan objects are equal. Equality means they have the
   * exact same start time and duration.
   * @param {Object} inDateSpan Another instance of DateSpan. A TypeError is
   * thrown if this is not a valid DateSpan object.
   * @return {boolean} true if the DateSpan objects are equal, otherwise false.
   * @throws {TypeError}
   */
  that.isEqual = function isEqualFunc(inDateSpan) {
    let retval = false;
    if (_.isObject(inDateSpan) === false) {
      throw new TypeError('Method expects a valid DateSpan object.');
    }
    if (that === inDateSpan
        || (begin.getTime() === inDateSpan.getBegin().getTime()
            && durationMins === inDateSpan.getDurationMins()
            && durationSecs === inDateSpan.getDurationSecs()
            && durationMSecs === inDateSpan.getDurationMs())) {
      retval = true;
    }
    return retval;
  };

  /**
   * Create a new DateSpan by adding two spans of time which overlap. If there
   * is no overlap then the method will return null.
   * @param {@link module:caltime/datespan} inSpan Other DateSpan object which
   * will be added to this datespan. A TypeError is thrown if an incorrect type
   * is passed as the argument.
   * @return {@link module:caltime/datespan|null} New DateSpan object or null
   * if there was no overlap.
   * @throws {TypeError}
   */
  that.union = function unionFunc(inSpan) {
    let retval = null;
    if (_.isObject(inSpan) === false) {
      throw new TypeError('Method expects a valid DateSpan object as argument.');
    } else if (that.isIntersect(inSpan)) {
      const newBegin = (begin.getTime() <= inSpan.getBegin().getTime()
                          ? begin
                          : inSpan.getBegin());
      const newEnd = (that.getEnd().getTime() >= inSpan.getEnd().getTime()
                        ? that.getEnd()
                        : inSpan.getEnd());
      retval = dateSpan(newBegin, newEnd);
    }
    return retval;
  };

  /**
   * Subtract one DateSpan from another.  The DateSpan, upon which the method
   * is being called, must overlap completely with the subtracted DateSpan.
   * null is returned if this DateSpan does not overlap sufficiently.
   * @param {@link module:caltime/datespan} inSpan Other DateSpan object
   * which will be subtracted from this DateSpan.
   * @return {Array|null} Array containing one or two new DateSpan objects.
   * These are the remainders after the subtraction. null is returned if there
   * wasn't sufficient overlap of the date-spans to complete the subtraction.
   * DateSpan objects in the array are sorted by the begin dates.
   * @throws {TypeError}
   */
  that.subtract = function subtractFunc(inSpan) {
    let retval = [];
    if (_.isObject(inSpan) === false) {
      throw new TypeError('Invalid argument passed as argument to method.');
    }
    if (that.isIntersect(inSpan)
        && that.getBegin().getTime() <= inSpan.getBegin().getTime()
        && that.getEnd().getTime() >= inSpan.getEnd().getTime()) {
          // datespans start at the same time, only one remainder datespan.
          if (that.getBegin().getTime() === inSpan.getBegin().getTime()
              && that.getEnd().getTime() > inSpan.getEnd().getTime()) {
            const newBegin = inSpan.getEnd();
            const newEnd = that.getEnd();
            retval.push(dateSpan(newBegin, newEnd));
          // datespans end at the same time, only on remainder datespan.
          } else if (that.getEnd().getTime() === inSpan.getEnd().getTime()
                    && that.getBegin().getTime() < inSpan.getBegin().getTime()) {
            const newBegin = that.getBegin();
            const newEnd = inSpan.getBegin();
            retval.push(dateSpan(newBegin, newEnd));
          // two remainder datespans.
          } else if (that.getBegin().getTime() < inSpan.getBegin().getTime()
                    && that.getEnd().getTime() > inSpan.getEnd().getTime()) {
            // first remainder
            let newBegin = that.getBegin();
            let newEnd = inSpan.getBegin();
            retval.push(dateSpan(newBegin, newEnd));
            // second remainder
            newBegin = inSpan.getEnd();
            newEnd = that.getEnd();
            retval.push(dateSpan(newBegin, newEnd));
          }
    } else if (that.getBegin().getTime() > inSpan.getBegin().getTime()
            || that.getEnd().getTime() < inSpan.getEnd().getTime()) {
      // insufficient overlap
      retval = null;
    }
    return retval;
  };

  /**
   * Create one or two DateSpan objects which represent the part(s) of
   * one DateSpan which do not overlap with another. inDateSpan does not have
   * to overlap with this datespan but if it does, the intervals which overlap
   * are not returned in the result.
   * @param {@link module:caltime/datespan} inSpan Other DateSpan object.
   * @return {Array|null} Array containing one or two new DateSpan objects.
   * These represent the parts of this DateSpan which do not overlap with
   * inDateSpan. The array is empty if there are no parts which
   * do not overlap.
   * DateSpan objects in the array are sorted by the begin dates.
   * @throws {TypeError}
   */
  that.difference = function differenceFunc(inSpan) {
    let retval = [];
    if (_.isObject(inSpan) === false) {
      throw new TypeError('Invalid argument passed as argument to method.');
    }
    if (that.isIntersect(inSpan)) {
          // end of primary exceeds secondary
          if (that.getBegin().getTime() >= inSpan.getBegin().getTime()
              && that.getEnd().getTime() > inSpan.getEnd().getTime()) {
            const newBegin = inSpan.getEnd();
            const newEnd = that.getEnd();
            retval.push(dateSpan(newBegin, newEnd));
          // beginning of primary exceeds secondary
        } else if (that.getEnd().getTime() <= inSpan.getEnd().getTime()
                    && that.getBegin().getTime() < inSpan.getBegin().getTime()) {
            const newBegin = that.getBegin();
            const newEnd = inSpan.getBegin();
            retval.push(dateSpan(newBegin, newEnd));
          // beginning and end of primary exceed secondary
          } else if (that.getBegin().getTime() < inSpan.getBegin().getTime()
                    && that.getEnd().getTime() > inSpan.getEnd().getTime()) {
            // first remainder
            let newBegin = that.getBegin();
            let newEnd = inSpan.getBegin();
            retval.push(dateSpan(newBegin, newEnd));
            // second remainder
            newBegin = inSpan.getEnd();
            newEnd = that.getEnd();
            retval.push(dateSpan(newBegin, newEnd));
          }
    } else if(that.isIntersect(inSpan) === false) {
      retval.push(that);
    }
    return retval;
  };

  /**
   * Create a new DateSpan by finding the intersection between two datespans. If
   * there is no intersection/overlap then the method will return null.
   * @param {@link module:caltime/datespan} inSpan Other DateSpan object
   * which will be 'intersected' with this DateSpan.
   * @return {@link module:caltime/datespan|null} New DateSpan object or null
   * if there was no overlap.
   * @throws {TypeError}
   */
  that.intersect = function intersectFunc(inSpan) {
    let retval = null;
    if (_.isObject(inSpan) === false) {
      throw new TypeError('Method expects a valid DateSpan object as argument.');
    } else if (that.isIntersect(inSpan)) {
      const newBegin = (begin.getTime() <= inSpan.getBegin().getTime()
                          ? inSpan.getBegin()
                          : begin);
      const newEnd = (that.getEnd().getTime() >= inSpan.getEnd().getTime()
                        ? inSpan.getEnd()
                        : that.getEnd());
      retval = dateSpan(newBegin, newEnd);
    }
    return retval;
  };

  /**
   * Check if two date-spans are intersecting. As end times are exclusive i.e.
   * not part of the duration, there is no intersection if the end time of
   * one date-span is equal to the begin time of another date-span.
   * @param {@link module:caltime/datespan} inSpan DateSpan object. Error
   * thrown if not an object.
  * @return {boolean} True indicates there is an overlap/intersection, otherwise
  * false is returned.
  * @throws {TypeError}
  */
  that.isIntersect = function isIntersectFunc(inSpan) {
    let retval = true;
    if (_.isObject(inSpan) === false) {
      throw new TypeError('Method expects DateSpan object as argument.');
    }
    if (that.getEnd().getTime() <= inSpan.getBegin().getTime()
        || that.getBegin().getTime() >= inSpan.getEnd().getTime()) {
          retval = false;
    }
    return retval;
  };

  /**
   * Convert the state of the DateSpan object to a string. Method is only
   * intended for debugging purposes. The format of the string will change
   * in future releases.
   * @return {string} String holding the state of the date-span.
   */
  that.toString = function toStringFunc() {
    let retval = `[ ${begin.toISOString()}, `;
    retval = retval + `${durationMins}:${durationSecs}:`;
    retval = retval + `${durationMSecs} ]`;
    return retval;
  };

  /* functional constructor returns new instance */
  return that;
};


/** public functions **********************************************************/


/**
 * Merge multiple, intersecting and non-intersecting date-spans within an array.
 * @param {Array} inSpans Array of date-spans. All of the date-spans do
 * not have to be intersecting but those which are will be merged together using
 * a union operation. A TypeError is thrown if an array is not passed as
 * the argument.
 * @return {Array} Array containing the merged and unmerged date-spans.
 * @throws {TypeError}
 */
const mergeSpans = function mergeSpansFunc(inSpans) {
  const retval = [];
  let newBegin = null;
  let newEnd = null;
  if (_.isArray(inSpans) === false) {
    throw new TypeError('Function expects an array as argument.');
  }
  const sorted = _.sortBy(inSpans,
                          function(obj) {
                            return obj.getBegin().getTime();
                          });

  for (let i=0; i<sorted.length; i++) {
    let currentSpan = sorted[i];
    /* do we have enough to make a datespan after last iteration. only create
       where previous datespan does not intersect with current. */
    if (newBegin !== null
        && newEnd !== null
        && newEnd.getTime() < currentSpan.getBegin().getTime()) {
      let newSpan = dateSpan(newBegin, newEnd);
      retval.push(newSpan);
      newBegin = null;
      newEnd = null;
    }
    if (newBegin === null) {
      newBegin = currentSpan.getBegin();
    }
    if (newEnd === null
        || newEnd.getTime() < currentSpan.getEnd().getTime()) {
      newEnd = currentSpan.getEnd();
    }
  }
  if (newBegin !== null
      && newEnd != null) {
    let newSpan = dateSpan(newBegin, newEnd);
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
const sortSpans = function sortSpansFunc(inSpans, inIsDescending=false) {
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
                              return obj.getBegin().getTime();
                            }],
                          [order]);
  return retval;
};


/**
 * Calculate the total duration of all of the date-spans in an array. The
 * date-spans are first merged and then the sum of their durations are combined.
 * @param {Array} inSpans Array of date-spans. All of the date-spans do
 * not have to be intersecting but those which are will be merged together
 * before the duration is calculated. A TypeError is thrown if an array is not
 * passed as the argument.
 * @param {number} inDurationType Specifies how the total duration is to be
 * calculated. Options are:
 * - DURATION_RAW_MSECS. Total sum of all non-overlapping intervals in milliseconds.
 * - DURATION_NATURAL_SECS. Number of natural (clock) seconds which overlap
 *   with all non-overlapping intervals.
 * - DURATION_NATURAL_MINS. Number of natural (clock) minutes which overlap
 *   with all non-overlapping intervals.
 * - DURATION_NATURAL_HOURS. Number of natural (clock) hours which overlap
 *   with all non-overlapping intervals.
 * - DURATION_NATURAL_DAYS. Number of natural (clock) days which overlap
 *   with all non-overlapping intervals.
 * Valid options are defined as constants in the Constants module.
 * @param {string} inTZ Timezone identifier as defined by the
 * tz database - sometimes called the TZ environment variable value.
 * See https://www.iana.org/time-zones for more details.
 * If no timezone argument is passed then the local timezone will be used. The
 * timezone always influences calculations using DURATION_NATURAL_DAYS. In some
 * rare cases it is required by calculations using DURATION_NATURAL_HOURS where
 * the timezone offset is not a multiple of 60 minutes. The timezone does not
 * have to be passed for calculations using DURATION_RAW_MSECS,
 * DURATION_NATURAL_SECS and DURATION_NATURAL_MINS as it has no effect.
 * @return {number} Number (either an integer or floating point number) which
 * is the total duration of the DateSpan objects.
 * @throws {TypeError}
 * @throws {RangeError}
 * @throws {Error}
 */
const measureSpans = function measureSpansFunc(inSpans, inDurationType, inTZ=null) {
  let retval = 0;
  let timezone = inTZ;
  let mergedSpans = null;
  // beginning of first whole time unit of an interval
  let fullSpanBegin = null;
  // end of last whole time unit of an interval
  let fullSpanEnd = null;
  // end of time unit containing the end of the previous date-span
  let lastTimeUnitEnd = null;
  // units used by moment functions
  const units = { startOf: null, diff: null };
  if (_.isArray(inSpans) === false) {
    throw new TypeError('Function expects an array as first argument.');
  }
  if(inDurationType < modconst.DURATION_MIN_VALUE
      || inDurationType > modconst.DURATION_MAX_VALUE) {
    throw new RangeError('inDurationType outside permitted range.');
  }
  if(inTZ !== null
      && (_.isString(inTZ) === false
          || moment.tz.zone(inTZ) === null
          || moment.tz('2001-01-01', inTZ).isValid() === false)) {
    throw new Error(`Invalid argument. Invalid TZ identifier string: ${inTZ}`);
  }
  // caller didn't specify timezone so use local timezone
  if(timezone === null) {
    timezone = moment().format('ZZ');
  }
  // merge any overlaps so they are not double counted
  mergedSpans = mergeSpans(inSpans);

  for (let i=0; i<mergedSpans.length; i++) {
    let currentSpan = mergedSpans[i];
    if(inDurationType === modconst.DURATION_RAW_MSECS) {
      retval += currentSpan.getTotalDuration();
    }
    else {
      if(inDurationType === modconst.DURATION_NATURAL_SECS) {
        units.startOf = 'second';
        units.diff = 'seconds';
      }
      else if(inDurationType === modconst.DURATION_NATURAL_MINS) {
        units.startOf = 'minute';
        units.diff = 'minutes';
      }
      else if(inDurationType === modconst.DURATION_NATURAL_HOURS) {
        units.startOf = 'hours';
        units.diff = 'hours';
      }
      else if(inDurationType === modconst.DURATION_NATURAL_DAYS) {
        units.startOf = 'day';
        units.diff = 'days';
      }
      fullSpanBegin = moment(currentSpan.getBegin(), timezone);
      fullSpanBegin.add(1, units.diff);
      fullSpanBegin.startOf(units.startOf);
      fullSpanEnd = moment(currentSpan.getEnd(), timezone);
      fullSpanEnd.startOf(units.startOf);
      // fullspan is central part of interval which consists of whole time units
      if(currentSpan.getTotalDuration() > 0
          && fullSpanEnd.diff(fullSpanBegin, units.diff) > 0) {
        retval += fullSpanEnd.diff(fullSpanBegin, units.diff);
      }
      // check for interval before fullspan
      if(fullSpanBegin.diff(currentSpan.getBegin()) > 0
          && currentSpan.getTotalDuration() > 0
          && (lastTimeUnitEnd === null
              || currentSpan.getBegin().getTime() > lastTimeUnitEnd.toDate().getTime())) {
        retval++;
      }
      // check for interval after the fullspan
      if(fullSpanEnd.diff(currentSpan.getEnd()) < 0
          && fullSpanEnd.diff(fullSpanBegin) >= 0
          && currentSpan.getTotalDuration() > 0) {
        retval++;
      }
      // save moment for end of natural time-unit after end of date-span
      lastTimeUnitEnd = moment(currentSpan.getEnd(), timezone);
      lastTimeUnitEnd.endOf(units.startOf);
    }
  }
  return retval;
};

/**
 * Provided with two arrays of DateSpan objects, generate an array containing
 * DateSpan objects for each of the intervals of intersection between the two
 * arrays.
 * @param {Array} inSpansA Array of DateSpan objects.
 * @param {Array} inSpansB Array of DateSpan objects.
 * @return {Array} Array of DateSpan objects. Array is empty if there is no
 * intersection between the two arrays.
 */
const intersectSpans = function(inSpansA, inSpansB) {

  const retList = [];
  const mergedListA = mergeSpans(inSpansA);
  const mergedListB = mergeSpans(inSpansB);
  let overlapSpan = null;
  let i = 0;
  let j = 0;
  // index of inSpansB which last had an overlap. null means no overlaps yet.
  let lastIndex = null;
  for(i=0;i<mergedListA.length;i++) {
    lastIndex = null;
    for(j=0;j<mergedListB.length;j++) {
      overlapSpan = mergedListA[i].intersect(mergedListB[j]);
      if(overlapSpan !== null) {
        retList.push(overlapSpan);
        lastIndex = j;
      }
      // previous span had overlapped, this span doesn't therefore, because
      // the spans are sorted, no further matches are possible.
      else if(lastIndex !== null) {
        break;
      }
    }
  }
  return retList;
}

/* interface exported by the module */
module.exports.dateSpan = dateSpan;
module.exports.mergeSpans = mergeSpans;
module.exports.sortSpans = sortSpans;
module.exports.measureSpans = measureSpans;
module.exports.intersectSpans = intersectSpans;

/** private functions *********************************************************/
