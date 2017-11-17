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


/* exported functional constructors *******************************************/

/** Functional constructor which creates a TimeSpan object.
 * @public
 * @see {@link module:caltime/timespan~timeSpan} */
module.exports.timeSpan = timespanModule.timeSpan;

/** Functional constructor which creates a DateSpan object.
 * @public
 * @see {@link module:caltime/datespan~dateSpan}
 */
module.exports.dateSpan = datespanModule.dateSpan;

/** Functional constructor which creates a TimeRule object.
 * @public
 * @see {@link module:caltime/timerule~timeRule}
 */
module.exports.timeRule = timeruleModule.timeRule;


/* exported functions ++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/** Function used to merge DateSpan objects in an array.
 * @public
 * @see {@link module:caltime/datespan~mergeSpans}
 */
module.exports.mergeDateSpans = datespanModule.mergeSpans;

/** Function used to sort DateSpan objects in an array.
 * @public
 * @see {@link module:caltime/datespan~sortSpans}
 */
module.exports.sortDateSpans = datespanModule.sortSpans;

/* exported constants *********************************************************/

/** Object's data members provides all of the constants which are made
    available by the package. */
module.exports.constants = require('./lib/constants');

/** Version number of the module in SemVer string format. */
module.exports.VERSION = '0.0.1';
