# CalTime

`CalTime` is a Node.js module which provides objects, methods and functions which
help you manipulate time-spans.  Time-spans can be associated with any timezone and the operations
which manipulate them will take their timezone into account.

The most powerful functionality provided by `CalTime` is the ability to define
time-based rules. This allows time-spans to be defined following periodic
rules. Examples are:
- 2-3pm on Monday of every week in xx timezone.
- 14:00-16:00 on the 24th of every month in xx timezone.
- 9-10am on the third Tuesday of every month in xx timezone.

Suggested uses include:
- Time tracking. Track the effort assigned to multiple resources across multiple timezones.
- Calculate the cost of resource usage using a calendar of costs which change over time.
- Schedule meetings across multiple timezones and book the required resources.

`CalTime` does not attempt to provide functionality which is already provided by
other packages such as [Moment](http://momentjs.com). For this reason, `CalTime` is not
interested in converting dates or times to or from their string representation.


## API Usage


The `CalTime` package provides a top-level object with several member functions
and objects. All of these functions and objects can be accessed by requiring
the `caltime` package.

```js
var caltime = require('caltime');
// functional constructor for TimeSpan
var timespan = caltime.timeSpan;
// functional constructor for DateSpan
var datespan = caltime.dateSpan;
// function to merge DateSpans in an array
var mergeDateSpans = caltime.mergeDateSpans;
// function to sort DateSpans in an array
var sortDateSpans = caltime.sortDateSpans;
// functional constructor for TimeRule
var timerule = caltime.timeRule;
// Constants object provides all constants
var caltimeConstants = caltime.constants;
```

## TimeSpan

A `TimeSpan` object defines an arc of time which starts at a defined time of the day
and which has a defined duration and end time. The `TimeSpan` is not associated
with any specific date or timezone. It just defines the span between two points
in time during a single day.
`TimeSpan` is deliberately not date specific. It does not take into
account factors such as the timezone, leap seconds or Daylight Savings Time.

```js
var caltime = require('caltime');
// call the functional constructor. do not use the new operator.
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:00am - 10:00am.
var spanA = timespanCtor(9, 0, 0, 0, 60, 0, 0);
```

### timeSpan()

The `timeSpan` function is a functional constructor therefore it should not be
called with the `new` operator. The function accepts several arguments:
- inHours: Hour component of the start time of the `TimeSpan` (24 hour clock). Valid range is 0-23.
- inMinute: Minutes component of the start time. Valid range is 0-59.
- inSeconds: Seconds component of the start time. Valid range is 0-59.
- inMilliseconds: Milliseconds component of the start time. Valid range is 0-999.
- inDurationMins: Minutes component of the duration of the `TimeSpan` in minutes.
  Durations can exceed one hour and in this case this argument can exceed the value 59.
- inDurationSecs: Seconds component of the duration. Valid range is 0-59.
- inDurationMs: Milliseconds component of the duration. Valid range is 0-999.

### getHours(), getMinutes, getSeconds() and getMilliseconds()

These methods return the various components of the start time of the `TimeSpan`.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:01:30:444am - 09:31:30:444am.
var spanA = timespanCtor(9, 1, 34, 444, 30, 0, 0);
spanA.getHours(); // 9 hours
spanA.getMinutes(); // 1 minute
spanA.getSeconds(); // 34 seconds
spanA.getMilliseconds(); // 444 milliseconds
```

### getDurationMins(), getDurationSecs() and getDurationMs()

These methods return the various components of the duration of the `TimeSpan`.
A `TimeSpan` which is longer than 1 hour will have a duration with > 60 minutes.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:00:0:000am - 09:04:05:006am.
var spanA = timespanCtor(9, 0, 0, 0, 4, 5, 6);
spanA.getDurationMins(); // 4 minutes
spanA.getDurationSecs(); // 5 seconds
spanA.getDurationMs(); // 6 milliseconds
```

### getTotalDuration()

This method returns the total duration of the `TimeSpan` in milliseconds.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:00:0:000am - 09:01:01:001am.
var spanA = timespanCtor(9, 0, 0, 0, 1, 1, 1);
spanA.getTotalDuration(); // 60000+1000+1 = 61001
```

### isEqual()

Method returns true if two `TimeSpan` objects have exactly the same start times
and total durations.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:00:0:000am - 09:01:01:001am.
var spanA = timespanCtor(9, 0, 0, 0, 1, 1, 1);
var spanB = timespanCtor(9, 0, 0, 0, 1, 1, 1);
// create a TimeSpan object which represents 09:00:0:000am - 09:02:00:000am.
var spanC = timespanCtor(9, 2, 0, 0, 0, 0, 0);
spanA.isEqual(spanB); // true
spanA.isEqual(spanC); // false
```

### isIntersect()

Method returns true if two `TimeSpan` objects intersect each other i.e. they
overlap.  Since the end time of a `TimeSpan` is exclusive, overlapping the
beginning of one `TimeSpan` with the end time of another does not count as
an intersection.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:30am - 10:00am.
var spanA = timespanCtor(9, 30, 0, 0, 30, 0, 0);
// create a TimeSpan object which represents 09:45am - 10:00am.
var spanB = timespanCtor(9, 45, 0, 0, 15, 0, 0);
// create a TimeSpan object which represents 10:00am - 10:15am.
var spanC = timespanCtor(10, 0, 0, 0, 15, 0, 0);
spanA.isIntersect(spanB); // true
spanA.isIntersect(spanC); // false
```

### intersect()

Method calculates the intersection, if any, between two `TimeSpan` objects
and returns a new `TimeSpan` object or null if there was no intersection.

### union()

Method calculates the union between two intersecting `TimeSpan` objects. It
returns a new `TimeSpan` or null if there is no intersection.

### subtract()

Method calculates the remainder(s) after subtracting one `TimeSpan` from
another.  It returns an array containing one or two new `TimeSpan` objects
which represent the remainders.  The array is empty if there was an exact
overlap between the time-spans and there was no remainder. The method returns
null if subtraction could not be performed because there wasn't sufficient
overlap.

### toString()

Method returns a string which represents the state of the `TimeSpan`. This
method is only made available for debugging and the format of the string
can change between releases.

## DateSpan

Similar to a `TimeSpan`, a `DateSpan` object specifies a start time and duration, however
the `DateSpan` is tied to a specific point in time i.e. a specific date which
is affected by timezone, leap years and Daylight Savings Time.

### dateSpan()

The `dateSpan` function is a functional constructor therefore it should not be
called with the `new` operator. The function accepts several arguments:
- inBegin: A valid Date object which indicates the start time and date.
- inEnd: Optional argument. A valid Date object which indicates the end time and
  date. Pass null when it is preferred to specify the duration.
- inDurationMins: Minutes component of the duration of the `DateSpan` in minutes.
  Durations can exceed one hour and in this case this argument can exceed the value 59.
  The argument is optional and should not be passed if inEnd is specified.
- inDurationSecs: Seconds component of the duration. Valid range is 0-59.
  The argument is optional and should not be passed if inEnd is specified.
- inDurationMs: Milliseconds component of the duration. Valid range is 0-999.
  The argument is optional and should not be passed if inEnd is specified.

  ```js
  var caltime = require('caltime');
  var datespanCtor = caltime.dateSpan;
  // DateSpan object which represents 09:00:00:000am - 09:30:00:000am, 15.Nov.2017.
  var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
  var spanA = datespanCtor(beginDate, 30, 0, 0);
  ```

### getBegin()

  This method returns the start time of the `DateSpan` as a Date object.

  ```js
  var caltime = require('caltime');
  var datespanCtor = caltime.dateSpan;
  // DateSpan object which represents 09:00:00:000am - 09:30:00:000am, 15.Nov.2017.
  var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
  var spanA = datespanCtor(beginDate, 30, 0, 0);
  spanA.getBegin(); // Date object
  ```

### getDurationMins(), getDurationSecs() and getDurationMs()

  These methods return the various components of the duration of the `DateSpan`.
  A `DateSpan` which is longer than 1 hour will have a duration with > 60 minutes.

  ```js
  var caltime = require('caltime');
  var datespanCtor = caltime.dateSpan;
  // DateSpan object which represents 09:00:00:000am - 09:30:11:222am, 15.Nov.2017.
  var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
  var spanA = datespanCtor(beginDate, 30, 11, 222);
  spanA.getDurationMins(); // 30 minutes
  spanA.getDurationSecs(); // 11 seconds
  spanA.getDurationMs(); // 222 milliseconds
  ```

### getTotalDuration

Method returns the total duration of the `DateSpan` in milliseconds.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00:00:000am - 09:31:02:003am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 1, 2, 3);
spanA.getTotalDuration(); // (1*60000)+(2*1000)+(3) = 62003 milliseconds
```

### getEnd()

  This method returns the end time of the `DateSpan` as a Date object.

  ```js
  var caltime = require('caltime');
  var datespanCtor = caltime.dateSpan;
  // DateSpan object which represents 09:00:00:000am - 09:30:00:000am, 15.Nov.2017.
  var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
  var spanA = datespanCtor(beginDate, 30, 0, 0);
  spanA.getEnd(); // Date object with time 09:30am
  ```

### isIntersect

Method returns true if two `DateSpan` objects intersect each other i.e. they
overlap.  Since the end time of a `DateSpan` is exclusive, overlapping the
beginning of one `DateSpan` with the end time of another does not count as
an intersection.

```js
var caltime = require('caltime');
var datespanCtor = caltime.timeSpan;
// DateSpan object which represents 09:00:00:000am - 09:30:00:000am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 09:45am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 45, 0, 0);
var spanB = datespanCtor(beginDate, 15, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
spanA.isIntersect(spanB); // true
spanA.isIntersect(spanC); // false
```

### intersect()

Method calculates the intersection, if any, between two `DateSpan` objects
and returns a new `DateSpan` object or null if there was no intersection.

### union()

Method calculates the union between two intersecting `DateSpan` objects. It
returns a new `DateSpan` or null if there is no intersection.

### subtract()

Method calculates the remainder(s) after subtracting one `DateSpan` from
another.  It returns an array containing one or two new `DateSpan` objects
which represent the remainders.  The array is empty if there was an exact
overlap between the date-spans and there was no remainder. The method returns
null if subtraction could not be performed because there wasn't sufficient
overlap.

### toString()

Method returns a string which represents the state of the `DateSpan`. This
method is only made available for debugging and the format of the string
can change between releases.

### mergeSpans()

Function is passed an Array of `DateSpan` objects and sorts the objects in
the array based on the start time. It then merges any of the `DateSpan` objects
which are overlapping. A new array is returned (merging is not in-situ) which
contains the merged and non-merged `DateSpan` objects.

### sortSpans()

Function creates and returns a new Array which contains the same `DateSpan`
objects which are sorted by their start time.

## TimeRule

The `TimeRule` object allows logic to be defined which can then be used to
automatically generate `DateSpan` objects for a range of time. Several types
of rules can be created. The constraint applied to the rule controls for which
days or dates the `DateSpan` objects are created. Possible constraints are:
- The same day of the week, every week e.g. every Monday from 9-10am.
- The same date every month e.g. 4th of every month from 1-2pm.
- The Nth weekday of every month e.g. 3rd Tuesday of the month from 9-10pm.

### timeRule()

The `timeRule` function is a functional constructor, therefore it should not be
called with the `new` operator. The function accepts several arguments:
- inTimeSpan: `TimeSpan` object describing the start time and duration of the `DateSpan`
  objects which will be generated by the rule.
- inConstraint: Controls how the rule generates `DateSpan` objects. Constants
  for each type of constraint are provided by the `CalTime` module's constants object.
- inDay: Specifies the day of the week or day of the month. How this value is
  interpreted depends on `inConstraint`.
- inTZ: String defining the timezone used when generating the `DateSpan` objects.
  See https://www.iana.org/time-zones for valid timezone identifier strings.
  The timezone is required because the `inTimeSpan` argument is timezone agnostic.
- inBegin: Optional argument. Defines a start time before which the rule does
  not apply and therefore does not generate any `DateSpan` objects.
- inEnd: Optional argument. Defines an end time after which the rule does
  not apply and therefore does not generate any `DateSpan` objects.


### getTimeSpan()

Method returns a `TimeSpan` object which defines the span of time during the day
which is used when generating the `DateSpan` objects.

### getDay()

Method returns the day (0 (Sunday) - 6 (Saturday) of the week or day of the month (1-31)
which indicates which days which the rule will generate a `DateSpan` object.

### getTZ()

Method returns a string which indicates the timezone used when generating the
`DateSpan` objects.

### getBegin()

This method returns the start time from which the rule begins generating
`DateSpan` objects.

### getEnd()

This method returns the end time up to which the rule generates `DateSpan` objects.

### generateDateSpans()

The method generates an Array of `DateSpan` objects which meet all of the constraints
imposed by the `TimeRule`.

## API Documentation

Documentation for the last major release is available at [CalTime API](https://mickmcc.github.io/node-caltime/index.html).

## Dependencies

`CalTime` currently depends on two packages when in production. Other packages are
required to test or develop `CalTime`. The production dependencies are:
- [Lodash](https://lodash.com/)
- [Moment Timezone](https://momentjs.com/timezone/)


## License

CalTime is copyright (c) 2017 Michael McCarthy <michael.mccarthy@ieee.org>.

CalTime is free software, licensed under the MIT licence. See the file `LICENSE`
in this distribution for more information.
