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


/* exported functions ++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/** Function used to merge several DateSpan objects.
 * @public
 * @see {@link module:schedtime/datespan~mergeSpans}
 */
module.exports.mergeDateSpans = datespanModule.mergeSpans;

/* exported constants *********************************************************/

/** Object's data members provides all of the constants which are made
    available by the package. */
module.exports.constants = require('./lib/constants');

/** Version number of the module in SemVer string format. */
module.exports.version = '0.0.1';
