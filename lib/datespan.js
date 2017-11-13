/** @module schedtime/datespan
 *
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017
 * @license MIT
 */

'use strict';

/* dependencies */
const _ = require('lodash');


/* constants */
/* milliseconds per minute */
const MSECS_PER_MIN = (1000 * 60);

/**
 * Functional constructor which creates an instance of a DateSpan object.
 * Each DateSpan object is immutable.
 * A DateSpan represents a slice of time between a definite begin time
 * and a definite end time. This means that a DateSpan object is anchored
 * to a specific date and time.
 * @param {Date} inBegin Date object representing the starting time of
 * the datespan.
 * @param {Date} [inEnd] Date object representing the end time of
 * the datespan.  If null is passed then inDuration must be specified. An
 * error is thrown if neither inEnd and inDuration are specified.
 * inEnd must be equal to or after inBegin.
 * @param {Number} [inDuration] Integer representing the duration of the
 * datespan in [minutes]. Must be greater than zero if inEnd is not
 * specified.  An error is thrown if both inEnd and inDuration are specified.
 * @return {@link module:schedtime/datespan} Instance of DateSpan object.
 * @throws {Error}
 */
let dateSpan = function timeSpanFunc(inBegin, inEnd=null, inDuration=0) {
  /** private *****************************************************************/
  /* new instance of object */
  const that = {};
  /* moment the datespan begins. Must be a Date object. */
  const begin = inBegin;
  /* Number holding the duration of the datespan in [minutes] */
  let duration = inDuration;

  if (_.isNil(inBegin)
        || typeof inBegin !== 'object'
        || _.isNil(inDuration)
        || typeof inDuration !== 'number'
        || inDuration < 0
        || inDuration > Number.MAX_SAFE_INTEGER
        || Number.isInteger(inDuration) === false) {
    throw new Error('Invalid argument passed to DateSpan constructor.');
  };
  if(_.isObject(inEnd)
      && Number.isInteger(inDuration)
      && inDuration !== 0) {
    throw new Error('inEnd and inDuration cannot be specified.');
  }
  if(_.isObject(inEnd)
    && inEnd < inBegin) {
    throw new Error('inBegin must be before or the same as inEnd.');
  }
  if(_.isObject(inEnd)) {

    let delta = inEnd.getTime() - inBegin.getTime();
    duration = delta / MSECS_PER_MIN;
  }

  /** public methods **********************************************************/

  /**
   * Get the beginning moment of the datespan.
   * @return {Date} Date object representing the inclusive starting moment
   * of the datespan.
   */
  that.getBegin = function getBeginFunc() {
    return begin;
  };

  /**
   * Get the duration of the datespan.
   * @return {Number} Integer with the duration in [minutes].
   */
  that.getDuration = function getDurationFunc() {
    return duration;
  };

  /**
   * Get the end moment of the datespan.
   * @return {Date} Date object which represents the final, non-inclusive
   * moment of the datespan.
   */
  that.getEnd = function getEndFunc() {
    const retval = new Date(begin);
    retval.setUTCMinutes(duration);
    return retval;
  };

  /**
   * Create a new DateSpan by merging two slices of time which overlap. If there is
   * no overlap then the method will return null.
   * @param {@link module:schedtime/datespan} inSpan Other DateSpan object which will be merged with
   * this datespan.
   * @return {@link module:schedtime/datespan} New DateSpan object or null if there was no overlap.
   * @throws {Error}
   */
  that.merge = function mergeFunc(inSpan) {

    let retval = null;
    if(_.isObject(inSpan) === false) {
      throw new Error('Method expects a valid DateSpan object as argument.');
    }
    else if(that.isOverlapping(inSpan)) {
      const newBegin = (begin.getTime() <= inSpan.getBegin().getTime()? begin: inSpan.getBegin());
      const newEnd = (that.getEnd().getTime() >= inSpan.getEnd().getTime()? that.getEnd(): inSpan.getEnd());
      retval = dateSpan(newBegin, newEnd);
    }
    return retval;
  };

  /**
   * Subtract one datespan from another.  The datespan, upon which the method
   * is being called, must overlap completely with the
   * subtracted datespan i.e. this datespan must have the same or greater
   * length. This datespan must also start before or after the datespan
   * which will be subtracted. An error is thrown if this datespan does
   * not overlap sufficiently.
   * @param {@link module:schedtime/datespan} inSpan Other DateSpan object which will be subtracted
   * from this datespan.
   * @return {Array} Array containing one or two new DateSpan objects. These
   * are the remainders after the subtraction.
   */
  that.subtract = function subtractFunc(inSpan) {
    let retval = [];
    if (_.isObject(inSpan)
        && that.isOverlapping(inSpan)
        && that.getBegin().getTime() <= inSpan.getBegin().getTime()
        && that.getEnd().getTime() >= inSpan.getEnd().getTime()) {
          // datespans start at the same time, only one remainder datespan.
          if(that.getBegin().getTime() === inSpan.getBegin().getTime()
              && that.getEnd().getTime() > inSpan.getEnd().getTime()) {
            const newBegin = inSpan.getEnd();
            const newEnd = that.getEnd();
            retval.push(dateSpan(newBegin, newEnd));
          // datespans end at the same time, only on remainder datespan.
          } else if(that.getEnd().getTime() === inSpan.getEnd().getTime()
                    && that.getBegin().getTime() < inSpan.getBegin().getTime()) {
            const newBegin = that.getBegin();
            const newEnd = inSpan.getBegin();
            retval.push(dateSpan(newBegin, newEnd));
          // two remainder datespans.
          } else if(that.getBegin().getTime() < inSpan.getBegin().getTime()
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
    } else if(_.isObject(inSpan) === false) {
      throw new Error('Invalid object passed as argument to method.');
    }
    else if(that.getBegin().getTime() > inSpan.getBegin().getTime()
            || that.getEnd().getTime() < inSpan.getEnd().getTime()) {
      throw new Error('inSpan cannot be subtracted from datespan.');
    }
    return retval;
  };

  /**
   * Create a new DateSpan by finding the overlap between two datespans. If
   * there is no overlap then the method will return null.
   * @param {@link module:schedtime/datespan} inSpan Other DateSpan object which will be 'overlapped'
   * with this datespan.
   * @return {object} New DateSpan object or null if there was no overlap.
   */
  that.overlap = function overlapFunc(inSpan) {

    let retval = null;
    if(_.isObject(inSpan) === false) {
      throw new Error('Method expects a valid DateSpan object as argument.');
    }
    else if(that.isOverlapping(inSpan)) {
      const newBegin = (begin.getTime() <= inSpan.getBegin().getTime()? inSpan.getBegin(): begin);
      const newEnd = (that.getEnd().getTime() >= inSpan.getEnd().getTime()? inSpan.getEnd(): that.getEnd());
      retval = dateSpan(newBegin, newEnd);
    }
    return retval;
  };

  /**
   * Check if two time periods are overlapping.
   * @param {@link module:schedtime/datespan} inSpan DateSpan object. Error thrown if not an object.
  * @return {boolean} True indicates there is an overlap, otherwise false
  * is returned.
  */
  that.isOverlapping = function isOverlapFunc(inSpan) {
    let retval = true;
    if (_.isObject(inSpan) === false) {
      throw new Error('Method expects DateSpan object as argument.');
    }
    if (that.getEnd().getTime() <= inSpan.getBegin().getTime()
        || that.getBegin().getTime() >= inSpan.getEnd().getTime()) {
          retval = false;
    }
    return retval;
  };

  /* functional constructor returns new instance */
  return that;
};


/** public functions **********************************************************/


/**
 * Merge multiple, overlapping time-periods within an array.
 * @param {Array} inSpans Array of time-periods. All of the time-periods do
 * not have to be overlapping but those which are will be merged together.
 * @return {Array} Array containing the merged and unmerged time-periods.
 */
var mergeSpans = function mergeSpansFunc(inSpans) {
  const retval = [];
  let newBegin = null;
  let newEnd = null;

  const sorted = _.sortBy(inSpans,
                          function(obj) {
                            return obj.getBegin;
                          });

  for(var i=0; i<sorted.length; i++) {
    let currentSpan = sorted[i];
    /* do we have enough to make a datespan after last iteration. only create
       where previous datespan does not overlap with current. */
    if(newBegin !== null
        && newEnd !== null
        && newEnd.getTime() < currentSpan.getBegin().getTime()) {
      let newSpan = dateSpan(newBegin, newEnd);
      retval.push(newSpan);
      newBegin = null;
      newEnd = null;
    }
    if(newBegin === null) {
      newBegin = currentSpan.getBegin();
    }
    if(newEnd === null
        || newEnd.getTime() < currentSpan.getEnd().getTime()) {
      newEnd = currentSpan.getEnd();
    }
  }
  if(newBegin !== null
      && newEnd != null) {
    let newSpan = dateSpan(newBegin, newEnd);
    retval.push(newSpan);
  }
  return retval;
};


/* interface exported by the module */
module.exports.dateSpan = dateSpan;
module.exports.mergeSpans = mergeSpans;


/** private functions *********************************************************/


/**
 * Get the difference in [minutes] between two times.
 * @param {Date} inDateA The first Date object. Error thrown if not a valid
 * Date object.
 * @param {Date} inDateB The second Date object. Error thrown if not a valid
 * Date object.
 * @return {Number} Difference in [minutes]. If the first Date is after the
 * second date, the returned integer will be positive. If the first Date is
 * before the second date, then the returned integer will be negative.
 */
const getDiffInMins = function getDiffInMinsFunc(inDateA, inDateB) {

  let retval = 0;
  const MINS_PER_MSEC = 1000*60;
  if(_.isObject(inDateA) === false
      || _.isObject(inDateB) === false) {
    throw new Error('Invalid Date object passed to function.');
  }
  const minsA = inDateA.getTime() / MINS_PER_MSEC;
  const minsB = inDateB.getTime() / MINS_PER_MSEC;
  retval = minsA - minsB;
  return retval;
}
