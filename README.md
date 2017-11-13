CalTime
=======

`CalTime` provides objects, methods and functions which help you manipulate
time-spans.  Time-spans can be associated with any timezone and the operations
which manipulate them will take their timezone into account.

The most powerful functionality provided by `CalTime` is the ability to define
time-based rules. This allows time-spans to be defined following periodic
rules. Examples are:
- 2-3pm on Monday of every week.
- 14:00-16:00 on the 24th of every month.

Suggested uses include:
- Time tracking. Track the effort assigned to multiple resources across multiple timezones.
- Calculate the cost of resource usage using a calendar of costs which change over time.
- Schedule meetings across multiple timezones and book required resources.

CalTime does not attempt to provide functionality which is already provided by
other packages such as [Moment](http://momentjs.com). For this reason, `CalTime` is not
interested in converting dates or times to or from their string representation.


API Usage
---------

The `CalTime` package provides a top-level object with several members.

```js
var caltime = require('caltime');
var timespan = caltime.timeSpan;
var datespan = caltime.dateSpan;
var timerule = caltime.timeRule;
var timezone = caltime.timeZone;
```

TimeSpan
--------

A `TimeSpan` defines an arc of time which starts at a defined time of day and
which has a defined duration and end time. The `TimeSpan` is not associated
with any specific date or timezone. It defines the time between two times of
day which is not date specific.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
var spanA = timespanCtor(9, 0, 60);
```


DateSpan
--------

Like a `TimeSpan`, a `DateSpan` specifies a start time and duration however
the `DateSpan` is tied to a specific point in time i.e. a specific date which
is affected by timezone and Daylight Savings Time.

TimeZone
--------

The `TimeZone` object represents a specific world timezone.

TimeRule
--------




Dependencies
------------

`CalTime` currently depends on two packages at runtime. Other packages are
required to test or develop `CalTime`. The packages are:
- [Lodash](https://lodash.com/)
- [Moment Timezone](https://momentjs.com/timezone/)


License
-------

CalTime is copyright (c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>.

CalTime is free software, licensed under the MIT licence. See the file `LICENSE.md`
in this distribution for more information.
