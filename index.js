/**
 * Top-level module which provides all of the functions and constants.
 * @module caltime
 * @version 0.0.1
 *
 * @author Michael McCarthy
 * @copyright Michael McCarthy <michael.mccarthy@ieee.org> 2017
 * @license MIT
 */

'use strict';

/* private ********************************************************************/

const timespanModule = require('./lib/timespan');
const datespanModule = require('./lib/datespan');
const timeruleModule = require('./lib/timerule');
const timezoneModule = require('./lib/timeZone');


/* exported functional constructors *******************************************/

/** Functional constructor which creates a TimeSpan object.
 * @public
 * @see {@link module:schedtime/timespan~timeSpan} */
module.exports.timeSpan = timespanModule.timeSpan;

/** Functional constructor which creates a DateSpan object.
 * @public
 * @see {@link module:schedtime/datespan~dateSpan}
 */
module.exports.dateSpan = datespanModule.dateSpan;

/** Functional constructor which creates a TimeRule object.
 * @public
 * @see {@link module:schedtime/timerule~timeRule}
 */
module.exports.timeRule = timeruleModule.timeRule;

/** Functional constructor which creates a TimeZone object.
 * @public
 * @see {@link module:schedtime/timezone~timeZone}
 */
module.exports.timeZone = timezoneModule.timeZone;

/* exported functions ++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/** Function used to merge several DateSpan objects.
 * @public
 * @see {@link module:schedtime/datespan~mergeSpans}
 */
module.exports.mergeDateSpans = datespanModule.mergeSpans;

/* exported constants *********************************************************/

/** @constant {number} */
module.exports.MONDAY = timeruleModule.MONDAY;

/** @constant {number} */
module.exports.TUESDAY = timeruleModule.TUESDAY;

/** @constant {number} */
module.exports.WEDNESDAY = timeruleModule.WEDNESDAY;

/** @constant {number} */
module.exports.THURSDAY = timeruleModule.THURSDAY;

/** @constant {number} */
module.exports.FRIDAY = timeruleModule.FRIDAY;

/** @constant {number} */
module.exports.SATURDAY = timeruleModule.SATURDAY;

/** @constant {number} */
module.exports.SUNDAY = timeruleModule.SUNDAY;

/** @constant {number}
  * @see {*link module:caltime/timerule~MAX_MINS_PER_DAY} */
module.exports.MAX_MINS_PER_DAY = timespanModule.MAX_MINS_PER_DAY;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_DAY_OF_WEEK} */
module.exports.CONSTRAINT_DAY_OF_WEEK = timeruleModule.CONSTRAINT_DAY_OF_WEEK;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_DAY_OF_MONTH} */
module.exports.CONSTRAINT_DAY_OF_MONTH = timeruleModule.CONSTRAINT_DAY_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_FIRST_OF_MONTH} */
module.exports.CONSTRAINT_FIRST_OF_MONTH = timeruleModule.CONSTRAINT_FIRST_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_SECOND_OF_MONTH} */
module.exports.CONSTRAINT_SECOND_OF_MONTH = timeruleModule.CONSTRAINT_SECOND_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_THIRD_OF_MONTH} */
module.exports.CONSTRAINT_THIRD_OF_MONTH = timeruleModule.CONSTRAINT_THIRD_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_FOURTH_OF_MONTH} */
module.exports.CONSTRAINT_FOURTH_OF_MONTH = timeruleModule.CONSTRAINT_FOURTH_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_FIFTH_OF_MONTH} */
module.exports.CONSTRAINT_FIFTH_OF_MONTH = timeruleModule.CONSTRAINT_FIFTH_OF_MONTH;
/** @constant {number}
  * @see {*link module:caltime/timerule~CONSTRAINT_LAST_OF_MONTH} */
module.exports.CONSTRAINT_LAST_OF_MONTH = timeruleModule.CONSTRAINT_LAST_OF_MONTH;
