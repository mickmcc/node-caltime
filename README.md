# CalTime

`caltime` is a Node.js package which provides objects, methods and functions
which help to generate, sort, add and subtract timespans. Operations which are
supported by the package include:
- query if timespans overlap with each other
- calculate the overlap (intersection) of timespans
- calculate the addition (union) of timespans
- calculate the remainder left after subtracting timespans
- calculate the difference between timespans
- merge the timespans in an array which overlap
- sort an array of timespans
- calculate the total duration of an array of timespans
- calculate the intersections between two arrays of timespans

A feature provided by `caltime` is the ability to define time-based rules using
`TimeRule` objects. This allows timespans to be generated according to a
specific period and within certain constraints. Examples of the timespans which
can be generated are:
- 2-3pm on Monday of every week in UTC timezone.
- 14:00-16:00 on the 24th of every month in New York timezone.
- 9-10am on the third Tuesday of every month in Delhi timezone.
- 9am-6pm on Friday and Saturday of every week in Dubai timezone.

`caltime` does not attempt to provide functionality which is already provided by
packages such as [Moment](http://momentjs.com). For this reason, `caltime`
avoids converting dates or times to or from their string representation.


## API Usage


The `caltime` module provides a top-level object with several member functions
and objects. All of these functions and objects can be accessed by installing
the `caltime` module.

```sh
$ cd <myproject>
$ npm install --save caltime
```

Currently, the `caltime` module provides three object constructors, five functions
and the constants object.

```js
var caltime = require('caltime');
// functional constructor to create TimeSpan objects
var timespan = caltime.timeSpan;
// function to merge TimeSpans in an array
var mergeTimeSpans = caltime.mergeTimeSpans;
// function to sort TimeSpans in an array
var sortTimeSpans = caltime.sortTimeSpans;
// functional constructor to create DateSpan objects
var datespan = caltime.dateSpan;
// function to merge DateSpans in an array
var mergeDateSpans = caltime.mergeDateSpans;
// function to sort DateSpans in an array
var sortDateSpans = caltime.sortDateSpans;
// functional constructor to create TimeRule objects
var timerule = caltime.timeRule;
// Constants object provides all of the constants defined by the module
var caltimeConstants = caltime.constants;
```

## TimeSpan

A `TimeSpan` is an immutable object which defines an interval of time during
a single day. The interval starts at a defined time of the day and has a defined
duration. The `TimeSpan` is not associated with any specific date or timezone.

`TimeSpan` is deliberately not date specific. It does not take into
account factors such as the timezone, leap seconds or Daylight Savings Time.
If a date-specific timespan must be represented then it is better to use
`DateSpan`.

The end time of a `TimeSpan` does not form part of the timespan i.e. In
mathematical terms, the `TimeSpan` object represents a *half-open* interval of
time where the end time is *exclusive* and the begin time is *inclusive*.

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
A `TimeSpan` which is longer than 1 hour will have a duration of greater
than 60 minutes.

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

Method calculates the intersection (overlap), if any, between two `TimeSpan` objects
and returns a new `TimeSpan` object or null if there is no intersection.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:30am - 10:00am.
var spanA = timespanCtor(9, 30, 0, 0, 30, 0, 0);
// create a TimeSpan object which represents 09:45am - 10:00am.
var spanB = timespanCtor(9, 45, 0, 0, 15, 0, 0);
// create a TimeSpan object which represents 10:00am - 10:15am.
var spanC = timespanCtor(10, 0, 0, 0, 15, 0, 0);
// these two timespans do overlap
let newSpan = spanA.intersect(spanB);
newSpan.getHours(); // 9
newSpan.getMinutes(); // 45
newSpan.getDurationMins(); // 15 minutes
// these timespans do not overlap
newSpan = spanA.intersect(spanC); // null
```

An example of the intersection of two overlapping timespans:

![Timespan Intersection](https://mickmcc.github.io/node-caltime/img/intersect_1.png)

### union()

Method calculates the union between two intersecting `TimeSpan` objects. It
returns a new `TimeSpan` or null if there is no intersection.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:30am - 10:00am.
var spanA = timespanCtor(9, 30, 0, 0, 30, 0, 0);
// create a TimeSpan object which represents 09:45am - 10:05am.
var spanB = timespanCtor(9, 45, 0, 0, 20, 0, 0);
// create a TimeSpan object which represents 10:00am - 10:15am.
var spanC = timespanCtor(10, 0, 0, 0, 15, 0, 0);
// these two timespans do overlap
let newSpan = spanA.intersect(spanB);
newSpan.getHours(); // 9
newSpan.getMinutes(); // 30
newSpan.getDurationMins(); // 35 minutes
// these timespans do not intersect
newSpan = spanA.intersect(spanC); // null
```

An example of the union of two overlapping timespans:

![Timespan Union](https://mickmcc.github.io/node-caltime/img/union_1.png)

### subtract()

Method calculates the remainder(s) after subtracting one `TimeSpan` from
another.  It returns an array containing one or two new `TimeSpan` objects
which represent the remainders.  The array is empty if there is an exact
overlap between the timespans and there is no remainder. The method returns
null if subtraction could not be performed because there wasn't sufficient
overlap.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:30am - 10:00am.
var spanA = timespanCtor(9, 30, 0, 0, 30, 0, 0);
// create a TimeSpan object which represents 09:45am - 10:00am.
var spanB = timespanCtor(9, 45, 0, 0, 15, 0, 0);
// create a TimeSpan object which represents 10:00am - 10:15am.
var spanC = timespanCtor(10, 0, 0, 0, 15, 0, 0);
// these two timespans do intersect
let result = spanA.subtract(spanB);
result.length; // 1 element in array
result[0].getHours(); // 9
result[0].getMinutes(); // 30
result[0].getDurationMins(); // 15 minutes
// these timespans do not intersect
result = spanA.intersect(spanC); // null
result.length; // 0
```

An example of the subtraction of two overlapping timespans:

![Timespan Subtraction](https://mickmcc.github.io/node-caltime/img/subtract_1.png)

### difference()

Method calculates the part of one `TimeSpan` (the primary) which does not
intersect with another `TimeSpan` (the secondary). It returns an array
containing one or two new `TimeSpan` objects which represent the non-overlapping
intervals.  The array is empty if there is a complete overlap between the
timespans. The method returns the primary `TimeSpan` if there is no overlap.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
// create a TimeSpan object which represents 09:30am - 10:00am.
var spanA = timespanCtor(9, 30, 0, 0, 30, 0, 0);
// create a TimeSpan object which represents 09:45am - 10:30am.
var spanB = timespanCtor(9, 45, 0, 0, 45, 0, 0);
// these two timespans do intersect
let result = spanA.subtract(spanB);
result.length; // 1 element in array
result[0].getHours(); // 9
result[0].getMinutes(); // 30
result[0].getDurationMins(); // 15 minutes
```

An example of the difference between two partially overlapping timespans:

![Timespan Difference](https://mickmcc.github.io/node-caltime/img/difference_1.png)

### mergeTimeSpans()

Function is passed an Array of `TimeSpan` objects and sorts the objects in
the array based on the start time. It then merges any of the `TimeSpan` objects
which are overlapping. A new array is returned (merging is not in-situ) which
contains the merged and non-merged `TimeSpan` objects.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
var mergeTimeSpans = caltime.mergeTimeSpans;
var spanList = null;
// create TimeSpan objects which overlap
const timeSpanA = timespanCtor(9, 0, 0, 0, 60, 0, 0, 0);  // 9:00-10:00
const timeSpanB = timespanCtor(9, 30, 0, 0, 60, 0, 0, 0); // 9:30-10:30
const timeSpanC = timespanCtor(10, 0, 0, 0, 60, 0, 0, 0); // 10:00-11:00
// this TimeSpan does not overlap with others
const timeSpanD = timespanCtor(11, 30, 0, 0, 60, 0, 0, 0); // 11:30-12:30
// add TimeSpans to array in ascending order
const list = [timeSpanA, timeSpanB, timeSpanC, timeSpanD];
const result = mergeTimeSpans(list);
result.length; // 2
result[0].getHours(); // 9 as merged TimeSpan is 9:00-11:00
result[0].getMinutes(); // 0
result[0].getDurationMins(); // 120
result[1].getHours(); // 11 as TimeSpan is not merged
result[1].getMinutes(); // 30
result[1].getDurationMins(); // 60
```

### sortTimeSpans()

Function takes an Array of `TimeSpan` objects and returns a new Array which
contains the same `TimeSpan` objects, sorted by their start time.

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
var sortTimeSpans = caltime.sortTimeSpans;
var spanList = null;
// create TimeSpan objects
const timeSpanA = timespanCtor(9, 0, 0, 0, 60, 0, 0, 0);  // 9:00-10:00
const timeSpanB = timespanCtor(10, 0, 0, 0, 60, 0, 0, 0); // 10:00-11:00
const timeSpanC = timespanCtor(11, 0, 0, 0, 60, 0, 0, 0); // 11:00-12:00
const timeSpanD = timespanCtor(12, 0, 0, 0, 60, 0, 0, 0); // 12:00-13:00
// add TimeSpans to array in ascending order
const list = [timeSpanA, timeSpanB, timeSpanC, timeSpanD];
// sort list in descending order
const result = sortTimeSpans(list, true);
result.length; // 4
result[0].getHours(); // 12 (is timeSpanD)
result[1].getHours(); // 11 (is timeSpanC)
result[2].getHours(); // 10 (is timeSpanB)
result[3].getHours(); // 9 (is timeSpanA)
// sort list in ascending order again
const result = sortTimeSpans(list);
result.length; // 4
result[0].getHours(); // 9 (is timeSpanA)
result[1].getHours(); // 10 (is timeSpanB)
result[2].getHours(); // 11 (is timeSpanC)
result[3].getHours(); // 12 (is timeSpanD)
```

### toString()

Method returns a string which represents the state of the `TimeSpan`. This
method is only intended to help debugging and the format of the string
can change between releases.

## DateSpan

Similar to a `TimeSpan`, a `DateSpan` object specifies a start time and
duration, however the `DateSpan` is tied to a specific date. This means that
it has a specific end time as factors such as clock changes for Daylight Savings
Time can be taken into account.

The end time of a `DateSpan` does not form part of the time interval i.e. in
mathematical terms, the `DateSpan` object represents a *half-open* interval of
time where the end time is *exclusive* and the begin time is *inclusive*.

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
  A `DateSpan` which is longer than 1 hour will have a duration which is
  greater than 60 minutes.

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

### getTotalDuration()

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

### isEqual()

  Method returns true if two `DateSpan` objects have exactly the same start times
  and durations.

  ```js
  var caltime = require('caltime');
  var datespanCtor = caltime.dateSpan;
  // DateSpan object which represents 09:00am - 9:45:00am, 15.Nov.2017.
  var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
  var spanA = datespanCtor(beginDate, 45, 0, 0);
  // create a DateSpan object with same start and duration
  var spanB = datespanCtor(beginDate, 45, 0, 0);
  // create a DateSpan object a different start time
  var otherDate = new Date(2017, 10, 15, 10, 0, 0, 0);
  var spanC = datespanCtor(otherDate, 45, 0, 0);
  // create a DateSpan object with same start but different duration
  var spanC = datespanCtor(beginDate, 40, 0, 0);
  spanA.isEqual(spanA); // true
  spanA.isEqual(spanB); // true
  spanA.isEqual(spanC); // false
  spanA.isEqual(spanD); // false
  ```

### isIntersect

Method returns true if two `DateSpan` objects intersect each other i.e. they
overlap.  Since the end time of a `DateSpan` is exclusive, overlapping the
beginning of one `DateSpan` with the end time of another does not count as
an intersection.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00am - 9:45:00am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 45, 0, 0);
// create a DateSpan object which represents 09:30am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
spanA.isIntersect(spanB); // true
spanA.isIntersect(spanC); // false
```

### intersect()

Method calculates the intersection, if any, between two `DateSpan` objects
and returns a new `DateSpan` object or null if there is no intersection.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00am - 09:45am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 45, 0, 0);
// create a DateSpan object which represents 09:30am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
// date-spans with intersection
var result = spanA.intersect(spanB);
result.getBegin(); // 9:30am
result.getEnd(); // 09:45am
// date-spans with no intersection
result = spanA.intersect(spanC); // null
```


### union()

Method calculates the union between two intersecting `DateSpan` objects. It
returns a new `DateSpan` or null if there is no intersection.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00am - 09:45am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 45, 0, 0);
// create a DateSpan object which represents 09:30am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
// date-spans with intersection
var result = spanA.intersect(spanB);
result.getBegin(); // 9:00am
result.getEnd(); // 10:00am
// date-spans with no intersection
result = spanA.intersect(spanC); // null
```

### subtract()

This method calculates the remainder(s) after subtracting one `DateSpan` from
another.  It returns an array containing one or two new `DateSpan` objects
which represent the remainders.  The array is empty if there is an exact
overlap between the date-spans and there is no remainder. The method returns
null if subtraction could not be performed because there wasn't sufficient
overlap.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00am - 10:00am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 60, 0, 0);
// create a DateSpan object which represents 09:30am - 09:45am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 15, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
// date-spans with intersection
var result = spanA.subtract(spanB);
result.length; // 2
result[0].getBegin(); // 9:00am
result[0].getEnd(); // 09:30am
result[1].getBegin(); // 9:45am
result[1].getEnd(); // 10:00am
// date-spans with no intersection
result = spanA.intersect(spanC); // null
```

### difference()

Method calculates the part of one `DateSpan` (the primary) which does
not intersect with another `DateSpan` (the secondary). It returns an array
containing one or two new `DateSpan` objects which represent the non-overlapping
intervals.  The array is empty if there is a complete overlap between the
date-spans. The method returns the primary `DateSpan` if there is no overlap.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
// DateSpan object which represents 09:00am - 10:00am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
let dateSpanA = datespanCtor(beginDate, null, 60);
// DateSpan object which represents 09:30am - 10:30am, 15.Nov.2017.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
let dateSpanB = datespanCtor(beginDate, null, 60);
// primary date-span starts before the secondary
let result = dateSpanA.difference(dateSpanB);
result.length; // 1
result[0].getBegin(); // 9:00
result[0].getEnd(); // 9:30
```

### toString()

Method returns a string which represents the state of the `DateSpan`. This
method is only intended to help debugging and the format of the string
can change between releases.

### mergeDateSpans()

Function is passed an Array of `DateSpan` objects and sorts the objects in
the array based on the start time. It then merges any of the `DateSpan` objects
which are overlapping. A new array is returned (merging is not in-situ) which
contains the merged and non-merged `DateSpan` objects.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
var mergeDateSpans = caltime.mergeDateSpans;
var spanList = null;
// DateSpan object which represents 09:00am - 09:45am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 45, 0, 0);
// create a DateSpan object which represents 09:30am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
spanList = [ spanA, spanB, spanC ];
// merge the intersecting date-spans
var result = mergeDateSpans(spanList);
result.length; // 2
result[0].getBegin(); // 9:00am
result[0].getEnd();   // 10:00am
result[1].getBegin(); // 10:00am
result[1].getEnd();   // 10:15am
```

### sortDateSpans()

Function takes an Array of `DateSpan` objects and returns a new Array which
contains the same `DateSpan` objects, sorted by their start time.

```js
var caltime = require('caltime');
var datespanCtor = caltime.dateSpan;
var sortDateSpans = caltime.sortDateSpans;
var spanList = null;
// DateSpan object which represents 09:00am - 09:30am, 15.Nov.2017.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 45, 0, 0);
// create a DateSpan object which represents 09:30am - 10:00am.
beginDate = new Date(2017, 10, 15, 9, 30, 0, 0);
var spanB = datespanCtor(beginDate, 30, 0, 0);
// create a DateSpan object which represents 10:00am - 10:15am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
spanList = [ spanA, spanB, spanC ];
// sort in descending order
var result = sortDateSpans(spanList, true);
result.length; // 3
result[0].getBegin(); // 10:00am
result[1].getBegin(); // 09:30am
result[2].getBegin(); // 09:00am
// sort in ascending order
var result = sortDateSpans(spanList);
result.length; // 3
result[0].getBegin(); // 09:00am
result[1].getBegin(); // 09:30am
result[2].getBegin(); // 10:00am
```

### measureDateSpans()

Function is passed an Array of `DateSpan` objects, sorts the objects based on
their start time and then merges any which overlap. The function then examines
each remaining 'DateSpan' object and calculates the total duration. The duration
is calculated using one of many available rules. The simplest way to calculate
the duration is the raw number of milliseconds i.e. `DURATION_RAW_MSECS`. Other
options round-up the duration based on the number of *natural* time units which
the `DateSpan` objects overlap with.

A *natural* time unit is an interval of time within the boundaries defined by
a clock or calendar. For example, a *natural day* is the interval of time
between 00:00 midnight and the following midnight. A *natural minute* is the
interval of clock time from when the millisecond count is zero until the
following occurrence of zero milliseconds.

*Natural* durations can be useful when you need to know how many whole units of
time are used by multiple time-spans. Rounding up the raw total duration is not
possible as some some time-spans may overlap with the same *natural* time
intervals. An example of this situation could be where a resource charges per
day even where they are only partially utilised on some days.

The options (constants) available to control how the duration is calculated:
- `DURATION_RAW_MSECS`
- `DURATION_NATURAL_SECS`
- `DURATION_NATURAL_MINS`
- `DURATION_NATURAL_HOURS`
- `DURATION_NATURAL_DAYS`

```js
const caltime = require('caltime');
const datespanCtor = caltime.dateSpan;
const measureDateSpans = caltime.measureDateSpans;
const spanList = [];
// DateSpan object which represents 09:00am 15.Nov.2017 - 9:00am 16.Nov.2017.
const dateA = new Date(2017, 10, 15, 9, 0, 0, 0);
const dateSpanA = tc.dateSpanCtor(dateA, null, 24*60); // 24 hours
spanList.push(dateSpanA);
// DateSpan object which represents 10:00am 16.Nov.2017 - 10:00am 17.Nov.2017.
const dateB = new Date(2017, 10, 16, 10, 0, 0, 0);
const dateSpanB = tc.dateSpanCtor(dateB, null, 24*60); // 24 hours
spanList.push(dateSpanB);
tc.measureDateSpans(spanList, tc.constants.DURATION_NATURAL_DAYS); // 3 natural days
```

### intersectDateSpans()

Function takes two Arrays of `DateSpan` objects and returns a new Array which
contains new `DateSpan` objects, each representing an intersection between
a `DateSpan` object from each Array.

```js
const caltime = require('caltime');
const datespanCtor = caltime.dateSpan;
const intersectDateSpans = caltime.intersectDateSpans;
let spanListA = null;
let spanListB = null;
// DateSpan object which represents 09:00am - 10:00am.
var beginDate = new Date(2017, 10, 15, 9, 0, 0, 0);
var spanA = datespanCtor(beginDate, 60, 0, 0);
// create a DateSpan object which represents 10:00am - 11:00am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanB = datespanCtor(beginDate, 60, 0, 0);
// create a DateSpan object which represents 10:00am - 10:30am.
beginDate = new Date(2017, 10, 15, 10, 0, 0, 0);
var spanC = datespanCtor(beginDate, 15, 0, 0);
// create a DateSpan object which represents 14:00 - 15:00.
beginDate = new Date(2017, 10, 15, 14, 0, 0, 0);
var spanD = datespanCtor(beginDate, 60, 0, 0);
// populate the arrays
spanListA = [ spanA, spanB ];
spanListB = [ spanC, spanD ];
// sort in descending order
let result = intersectDateSpans(spanListA, spanListB);
result.length; // 1 overlap between spanB and spanC
result[0].getBegin(); // 10:00am
result[0].getEnd(); // 10:30am
```

## TimeRule

The `TimeRule` object allows logic to be defined which can then be used to
automatically generate `DateSpan` objects for a range of time. Several types
of rules can be created. The constraint applied to the rule controls for which
days or dates the `DateSpan` objects are created. Possible constraints are:
- The same day(s) of the week, every week e.g. every Monday from 9-10am.
- The same date every month e.g. 4th of every month from 1-2pm.
- The Nth weekday of every month e.g. 3rd Tuesday of the month from 9-10pm.
- The last weekday of every month e.g. last Friday of every month.

### timeRule()

The `timeRule` function is a functional constructor, therefore it should not be
called with the `new` operator. The function accepts several arguments:
- inTimeSpan: `TimeSpan` object describing the start time and duration of the `DateSpan`
  objects which will be generated by the rule.
- inConstraint: Controls how the rule generates `DateSpan` objects. Constants
  for each type of constraint are provided by the `caltime` module's constants object.
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

```js
var caltime = require('caltime');
var timespanCtor = caltime.timeSpan;
var timeruleCtor = caltime.timeRule;
var modconstants = caltime.constants;
// Rule will generate date-spans
var spanA = timespanCtor(9, 0, 0, 0, 30, 0, 0);
var rule = timeruleCtor(spanA,
                          modconstants.CONSTRAINT_DAY_OF_WEEK,
                          modconstants.WEDNESDAY,
                          'America/New_York');
// now generate DateSpan objects based on the rule constraints
var beginDate = new Date(2017, 5, 1, 12, 0, 0, 0, 0); // 12:00, 1 June 2017
var endDate = new Date(2017, 5, 20, 12, 0, 0, 0, 0); // 12:00, 20 June 2017
var result = rule.generateDateSpans(beginDate, endDate);
result.length; // 2
result[0].getBegin(); // 7 June 2017, 09:00-09:30am Eastern Daylight Time (-0400)
result[1].getBegin(); // 14 June 2017, 09:00-09:30am Eastern Daylight Time (-0400)
```

## Constants

The module makes several constants available in the `constants` object. Each
constant is a data member of this object. Constants are available which can
be used to convert values between different units of time.

Examples of constants for time conversion:
```js
var caltime = require('caltime');
var module_constants = caltime.constants;
module_constants.MSECS_PER_MIN; // milliseconds per minute
module_constants.MSECS_PER_HOUR; // milliseconds per hour
module_constants.MAX_MINS_PER_DAY; // maximum number of minutes in a 24 hour day
```

Constants are available which define the day of the week. These values are the
same as those used by the Javascript `Date` object.

```js
var caltime = require('caltime');
var module_constants = caltime.constants;
module_constants.SUNDAY;    // 0
module_constants.MONDAY;    // 1
module_constants.TUESDAY;   // 2
module_constants.WEDNESDAY; // 3
module_constants.THURSDAY;  // 4
module_constants.FRIDAY;    // 5
module_constants.SATURDAY;  // 6
```

Constants are available which define the months of the year. These values are
the same as those used by the Javascript `Date` object.

```js
var caltime = require('caltime');
var module_constants = caltime.constants;
module_constants.JAN; // January
module_constants.FEB; // February
module_constants.MAR; // March
module_constants.APR; // April
module_constants.MAY; // May
module_constants.JUN; // June
module_constants.JUL; // July
module_constants.AUG; // August
module_constants.SEPT; // September
module_constants.OCT; // October
module_constants.NOV; // November
module_constants.DEC; // December
```

Constants are also available for use with the `TimeRule` functional constructor.

These constants define more than one day of the week. They represent commonly
used working weeks and weekends from various cultures. They can be passed as
the `inDay` argument to the `timeRule` constructor.

```js
var caltime = require('caltime');
var module_constants = caltime.constants;
module_constants.WEEKDAYS_MON_FRI; // 5 days, Monday - Friday
module_constants.WEEKDAYS_SUN_THURS; // 5 days, Sunday - Thursday
module_constants.WEEKDAYS_MON_SAT; // 6 days, Monday - Saturday
module_constants.WEEKDAYS_MON_SUN; // 7 days, Monday - Sunday
module_constants.WEEKDAYS_SUN_FRI; // 6 days, Sunday - Friday
module_constants.WEEKDAYS_SAT_WED; // 5 days, Sunday - Wednesday and Saturday
module_constants.WEEKDAYS_SAT_THURS; // 6 days, Sunday - Thursday and Saturday
module_constants.WEEKDAYS_BRUNEI; // 5 days, Monday - Thursday and Saturday
module_constants.WEEKDAYS_SAT_SUN; // 2 days, Saturday and Sunday
module_constants.WEEKDAYS_FRI_SAT; // 2 days, Friday and Saturday
module_constants.WEEKDAYS_THURS_FRI; // 2 days, Thursday and Friday
module_constants.WEEKDAYS_BRUNEI_WEEKEND; // 2 days, Friday and Sunday
```

These constants define the type of constraint applied by the `TimeRule`.

```js
var caltime = require('caltime');
var module_constants = caltime.constants;
module_constants.CONSTRAINT_DAY_OF_WEEK; // example: every Tuesday
module_constants.CONSTRAINT_DAY_OF_MONTH; // example: 4th day of every month
module_constants.CONSTRAINT_FIRST_OF_MONTH; // example: 1st Wed. of every month
module_constants.CONSTRAINT_SECOND_OF_MONTH; // example: 2nd Thurs. of every month
module_constants.CONSTRAINT_THIRD_OF_MONTH; // example: 3rd Sat. of every month
module_constants.CONSTRAINT_FOURTH_OF_MONTH; // example: 4th Monday of every month
module_constants.CONSTRAINT_FIFTH_OF_MONTH; // example: 5th Wed. of every month
module_constants.CONSTRAINT_LAST_OF_MONTH; // example: Last Monday of every month
```

## API Documentation

Documentation describing the last major release of `caltime` is available at
[CalTime API](https://mickmcc.github.io/node-caltime/).

The latest version of the API documentation can be generated using `jsdoc`. The
documentation is created in the `docs/` directory.

```sh
$ cd <caltime-git-clone>
$ npm run -s doc
```

## Support

*Bug Reports* and *New Feature Requests* should be reported at the [CalTime GitHub Issues Page](https://github.com/mickmcc/node-caltime/issues).


## Dependencies

`caltime` currently depends on two modules when in production. Other modules are
required to test or develop `caltime`. The production dependencies are:
- [Lodash](https://lodash.com/)
- [Moment Timezone](https://momentjs.com/timezone/)


## License

`caltime` is copyright (c) 2017-2018 Michael McCarthy <michael.mccarthy@ieee.org>.

`caltime` is free software, licensed under the MIT licence. See the file `LICENSE`
in this distribution for more information.
