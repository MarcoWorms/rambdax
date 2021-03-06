# Rambdax

Extended version of Rambda(utility library) - [Documentation](https://selfrefactor.github.io/rambdax/#/)

## Simple example

```
const R = require("rambdax")
const result = R.compose(
  R.filter(val => val>2),
  R.flatten,
)([ [1], [2], [3], 4])
console.log(result) // => [3,4]
```

## How to use it?

Simple `npm i rambdax` is sufficient

## Differences between Rambda and Ramda

- Rambda's **equals** doesn't protect against circular structures as **Ramda.equals** does

- Rambda's **map/filter** works only for arrays, while Ramda's **map/filter** accept also objects

- Rambda's **type** detect async functions. The returned value is `"Async"`

## Differences between Rambda and Ramdax

Rambdax passthrough all `Rambda`'s methods and introduce some new functions.

The idea of `Rambdax` is to extend `Rambda` without worring for `Ramda` compatability.

## API

---

### API part I - Rambdax own methods

#### all

```
it("when returns true", () => {
  const numArr = [ 0, 1, 2, 3, 4 ]
  const fn = val => val > -1
  expect(R.all(fn, numArr)).toBeTruthy()
})
```

#### allPass

```
const obj = {
  a : 1,
  b : 2,
}
const conditionArr = [
  val => val.a === 1,
  val => val.b === 2,
]
expect(
  R.allPass(conditionArr, obj)
).toBeTruthy()
```

#### both

```
const fn = R.both(
  a => a > 10,
  a => a < 20
)
fn(15) //=> true
fn(30) //=> false
```

#### compact

```
const arr = [
  1,
  null,
  undefined,
  false,
  "",
  " ",
  "foo", {},
  [],
  [1],
  /\s/g
]
const result = R.compact(arr)
const expectedResult = [1, false, " ", "foo", [1]]
expect(result).toEqual(expectedResult)
```

#### composeAsync

> composeAsync(fn1: Function|Async, .. , fnN: Function|Async)(startValue: any): Async

- `compose` that accepts `async` functions as arguments

```
const delayAsync = async ms => delay(ms)

const delay = ms => new Promise(resolve=>{
  setTimeout(function () {
    resolve(ms+110)
  }, ms)
})

const result = await composeAsync(
  a => a - 1000,
  a => a,
  async a => delayAsync(a),
  a => a+11
)(await delay(20))
expect(
  result
).toEqual(-749)
```

#### debounce

```
it("", async() => {
  let counter = 0
  const inc = () => {
    counter++
  }

  const delay = ms => new Promise(resolve => {
    setTimeout(resolve, ms)
  })
  const incWrapped = debounce(inc, 500)
  incWrapped()
  expect(counter).toBe(0)
  await delay(200)
  incWrapped()
  expect(counter).toBe(0)
  await delay(200)
  incWrapped()
  expect(counter).toBe(0)
  await delay(200)
  incWrapped()
  expect(counter).toBe(0)
  await delay(700)
  expect(counter).toBe(1)
})
```

#### either

```
const fn = R.either(
  a => a > 10,
  a => a % 2 === 0
)
fn(15) //=> true
fn(6) //=> true
fn(7) //=> false
```

#### filterObj

```
const fn = (val, prop) => val > 2 || prop === "b"
const obj = {
  a: 1,
  b: 2,
  c: 3
}
const result = R.filterObj(fn)(obj)
expect(result).toEqual({
  b: 2,
  c: 3
})
```

#### flip

Switch first and second arguments of provided function
```
const fn = (a,b) => a-b
const flipped = R.flip(fn)
flipped(4,1) //=> -3
```

#### intersection

```
R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
```

#### isValid

Full copy of [json-validity](https://github.com/selfrefactor/json-validity) library

```
const songSchema = {
  published: "number",
  style: [ "rock", "jazz" ],
  title: "string",
}

const song = {
  published: 1975,
  style: "rock",
  title: "In my time of dying",
}

R.isValid(song,songSchema) // => true
```

#### mapAsync

> mapAsync(fn: Async|Promise, arr: Array): Promise<Array>

Sequential asynchronous mapping with `fn` over members of `arr`

```
const fn = a => new Promise(resolve => {
  setTimeout(() => {
    resolve(a + 100)
  }, 100)
})

const result = await R.composeAsync(
  R.mapAsync(async a => await fn(a)),
  R.mapAsync(fn),
  R.map(a => a * 10)
)([1, 2, 3])
expect(result).toEqual([210, 220, 230])
```

#### mapFastAsync

> mapAsync(fn: Async|Promise, arr: Array): Promise<Array>

Parrallel asynchronous mapping with `fn` over members of `arr`

```
const fn = a => new Promise(resolve => {
  setTimeout(() => {
    resolve(a + 100)
  }, 100)
})

const result = await R.composeAsync(
  R.mapAsync(async a => await fn(a)),
  R.mapAsync(fn),
  R.map(a => a * 10)
)([1, 2, 3])
expect(result).toEqual([210, 220, 230])
```

#### memoize

```
describe("memoize", () => {
  it("normal function", () => {
    let counter = 0
    const fn = (a,b) =>{
      counter++
      return a+b
    }
    const memoized = R.memoize(fn)
    expect(memoized(1,2)).toBe(3)
    expect(memoized(1,2)).toBe(3)
    expect(memoized(1,2)).toBe(3)
    expect(counter).toBe(1)
    expect(memoized(2,2)).toBe(4)
    expect(counter).toBe(2)
    expect(memoized(1,2)).toBe(3)
    expect(counter).toBe(2)
  })

  it("async function", async () => {
    let counter = 0
    const delay = ms => new Promise(resolve => {
      setTimeout(resolve, ms)
    })
    const fn = async (ms,a,b) => {
      await delay(ms)
      counter++
      return a+b
    }

    const memoized = R.memoize(fn)
    expect(await memoized(100,1,2)).toBe(3)
    expect(await memoized(100,1,2)).toBe(3)
    expect(await memoized(100,1,2)).toBe(3)
    expect(counter).toBe(1)
    expect(await memoized(100,2,2)).toBe(4)
    expect(counter).toBe(2)
    expect(await memoized(100,1,2)).toBe(3)
    expect(counter).toBe(2)
  })
})
```

#### mergeAll

```
const arr = [
  {a:1},
  {b:2},
  {c:3}
]
const expectedResult = {
  a:1,
  b:2,
  c:3
}
expect(R.mergeAll(arr)).toEqual(expectedResult)
```

#### omitBy

```
const input = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
}
const fn = (prop, val) => val < 3
const expectedResult = {
  c: 3,
  d: 4,
}
expect(R.omitBy(fn, input)).toEqual(expectedResult)
```

#### once

```
const addOneOnce = R.once((a, b, c) => a + b + c)

expect(addOneOnce(10,20,30)).toBe(60)
expect(addOneOnce(40)).toEqual(60)
```

#### pickBy

```
const input = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
}
const fn = (prop,val) => val > 2
const expectedResult = {
  c: 3,
  d: 4,
}
expect(R.pickBy(fn, input)).toEqual(expectedResult)
```

#### produce

> Typing:

```
R.produce(
fnObject: Object,
inputArgument: any
): Object
```

> Example:

```
const conditions = {
foo: a => a > 10,
bar: a => ({baz:a})
}

const result = R.produce(conditions, 7)

const expectedResult = {
foo: false,
bar: {baz: 7}
}
result === expectedResult // => true
```

> Description

`conditions` is an object with sync or async functions as values.

Those functions will be used to generate object with `conditions`'s props and
values, which are result of each `conditions` value when
`inputArgument` is the input.

#### race

> race(promises: Object): Object

`promises` is object with thenable values.

The thenables are resolved with `Promise.race` to object with a single property.
This property is the key of the first resolved(rejected) promise in `promises`.

```
const delay = ms => new Promise(resolve => {
  setTimeout(() => {
    resolve(ms)
  }, ms)
})
const promises = {
  a : delay(20),
  b : delay(10),
}

R.race(promises)
.then(result =>{
  // => { a: 10 }
})
```

```
const delay = ms => new Promise((resolve,reject) => {
  setTimeout(() => {
    reject(ms)
  }, ms)
})
const promises = {
  a : delay(1),
  b : delay(2),
}
R.race(promises)
.then(console.log)
.catch(err =>{
  // => { a: 1 }
})
```

#### random

```
const randomResult = R.random(1, 10)
expect(randomResult).toBeLessThanOrEqual(10)
expect(randomResult).toBeGreaterThanOrEqual(1)
```

#### rangeBy
```
expect(
  R.rangeBy(0, 10, 2)
).toEqual([0, 2, 4, 6, 8, 10])
expect(
  R.rangeBy(0, 2, 0.3)
).toEqual([0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8])
```

#### renameProps

> Typing:

```
R.renameProps(
  renameObj: Object,
  inputObj: Object
): Object
```

> Example:

```
const renameObj = {
  f: "foo",
  b: "bar"
}
const inputObj = {
  f:1,
  b:2
}
const result = R.renameProps(renameObj, inputObj)
const expectedResult = {
  foo:1,
  bar:2
}
```

#### resolveObj

> resolveObj(promises: Object): Object

`promises` is object with thenable values.

All the thenables are resolved with `Promise.all` to object, which
props are the keys of `promises` and which values are the resolved results.

```
const delay = ms => new Promise(resolve => {
  setTimeout(() => {
    resolve(ms)
  }, ms)
})
const promises = {
  a : delay(1),
  b : delay(2),
  c : delay(3),
}
const result = await R.resolveObj(promises)
// => { a:1, b:2, c:3 }
```

#### resolveSecure

> resolveObj(promises: Array): Array<{type: 'result'|'error', payload:any}>

`promises` is array with thenable values.

All the thenables are resolved with `Promise.all` to object, which
props are the keys of `promises` and which values are the resolved results.

```
const delay = ms => new Promise(res => {
  setTimeout(() => res(ms), ms)
})

const fail = async ms => {
  try {
    JSON.parse("{:a")
  }
  catch (err) {
    throw new Error(err)
  }
}

const arr = [delay(2000), fail(1000), delay(1000)]
const result = await R.resolveSecure(arr)
expect(result[0]).toEqual({
  "payload": 2000,
  "type": "result"
})
expect(result[1].type).toBe("error")
expect(result[2]).toEqual({
  "payload": 1000,
  "type": "result"
})
```

#### shuffle

> shuffle(arr: Array): Array

Returns randomized copy of `arr`

#### tap

> tap(fn: Function, inputArgument: T): T

Execute `fn` with `inputArgument` as argument and returns `inputArgument`

```
const fn = a => console.log(a)
const result = R.tap(fn, "foo")
// logs "foo"
// `result` is "foo"
```

#### throttle

> throttle(callback: Function, ms: Number): Function

```
let counter = 0
const inc = () => {
  counter++
}

const delay = ms => new Promise(resolve => {
  setTimeout(resolve, ms)
})
const incWrapped = throttle(inc, 1000)
await delay(500)
incWrapped()
incWrapped()
incWrapped()
expect(counter).toBe(1)
await delay(1500)
incWrapped()
expect(counter).toBe(2)
```

#### where

> where(conditions: Object, obj: Object): Boolean

```
const condition = R.where({
  a : aProp => typeof aProp === "string",
  b : bProp => bProp === 4
})

condition({
  a : "foo",
  b : 4,
  c : 11,
}) //=> true

condition({
  a : 1,
  b : 4,
  c : 11,
}) //=> false
```

---

### Methods inherited from Rambda


#### add

> add(a: Number, b: Number): Number

```javascript
R.add(2, 3) //=>  5
```

#### adjust

> adjust(replaceFn: Function, i:Number, arr:Array): Array

- Replaces `i` index in `arr` with the result of `replaceFn(arr[i])`

```javascript
R.adjust(a => a + 1, 0, [0, 100]) //=> [1, 100]
```

#### any

> any(condition: Function, arr: Array): Boolean

- Returns true if at least one member of `arr` returns true, when passed to the `condition` function

```javascript
R.any(a => a * a > 8)([1, 2, 3]) //=> true
R.any(a => a * a > 10)([1, 2, 3]) //=> false
```

#### append

> append(valueToAppend: any, arr: Array): Array

```javascript
R.append('foo', ['bar', 'baz']) //=> ['foo', 'bar', 'baz']
```

#### compose

> compose(fn1: Function, ... , fnN: Function): any

Performs right-to-left function composition
```
const result = R.compose(
  R.map(a => a*2)
  R.filter(val => val>2),
)([1, 2, 3, 4])
console.log(result) // => [6, 8]
```

#### contains

> contains(valueToFind: any, arr: Array): Boolean

Returns true if `valueToFind` is part of `arr`

```javascript
R.contains(2, [1, 2]) //=> true
R.contains(3, [1, 2]) //=> false
```

#### curry

> curry(fn: Function): Function

Returns curried version of `fn`

```javascript
const addFourNumbers = (a, b, c, d) => a + b + c + d
const curriedAddFourNumbers = R.curry(addFourNumbers)
const f = curriedAddFourNumbers(1, 2)
const g = f(3)
g(4) // => 10
```

#### defaultTo

> defaultTo(defaultArgument: T, inputArgument: any): T

Returns `defaultArgument` if `inputArgument` is `undefined` or the type of `inputArgument` is different of the type of `defaultArgument`.

Returns `inputArgument` in any other case.

```javascript
R.defaultTo('foo', undefined) //=> 'foo'
R.defaultTo('foo')('bar') //=> 'bar'
R.defaultTo('foo')(1) //=> 'foo'
```

#### drop

> drop(howManyToDrop: Number, arrOrStr: Array|String): Array|String

Returns `arrOrStr` with `howManyToDrop` items dropped from the left

```javascript
R.drop(1, ['foo', 'bar', 'baz']) //=> ['bar', 'baz']
R.drop(1, 'foo')  //=> 'oo'
```

#### dropLast

> dropLast(howManyToDrop: Number, arrOrStr: Array|String): Array|String

Returns `arrOrStr` with `howManyToDrop` items dropped from the right

```javascript
R.dropLast(1, ['foo', 'bar', 'baz']) //=> ['foo', 'bar']
R.dropLast(1, 'foo')  //=> 'fo'
```

#### equals

> equals(a: any, b: any): Boolean

- Returns equality match between `a` and `b`

Doesn't handles cyclical data structures

```javascript
R.equals(1, 1) //=> true
R.equals({}, {}) //=> false
R.equals([1, 2, 3], [1, 2, 3]) //=> true
```

#### filter

> filter(filterFn: Function, arr: Array): Array

Filters `arr` throw boolean returning `filterFn`

```javascript
const filterFn = a => a % 2 === 0

R.filter(filterFn, [1, 2, 3, 4]) //=> [2, 4]
```

#### find

> find(findFn: Function, arr: Array<T>): T|undefined

Returns `undefined` or the first element of `arr` satisfying `findFn`

```javascript
const findFn = a => R.type(a.foo) === "Number"
const arr = [{foo: "bar"}, {foo: 1}]
R.find(findFn, arr) //=> {foo: 1}
```

#### findIndex

> findIndex(findFn: Function, arr: Array): Number

Returns `-1` or the index of the first element of `arr` satisfying `findFn`

```javascript
const findFn = a => R.type(a.foo) === "Number"
const arr = [{foo: "bar"}, {foo: 1}]
R.find(findFn, arr) //=> 1
```

#### flatten

> flatten(arr: Array): Array

```javascript
R.flatten([ 1, [ 2, [ 3 ] ] ]
//=> [ 1, 2, 3 ]
```

#### has

> has(prop: String, obj: Object): Boolean

- Returns `true` if `obj` has property `prop`

```javascript
R.has("a", {a: 1}) //=> true
R.has("b", {a: 1}) //=> false
```

#### head

> head(arrOrStr: Array|String): any

- Returns the first element of `arrOrStr`

```javascript
R.head([1, 2, 3]) //=> 1
R.head('foo') //=> 'f'
```

#### indexOf

> indexOf(valueToFind: any, arr: Array): Number

Returns `-1` or the index of the first element of `arr` equal of `valueToFind`

```javascript
R.indexOf(1, [1, 2]) //=> 0
```

#### init

> init(arrOrStr: Array|String): Array|String

- Returns all but the last element of `arrOrStr`

```javascript
R.init([1, 2, 3])  //=> [1, 2]
R.init('foo')  //=> 'fo'
```

#### join

> join(separator: String, arr: Array): String

```javascript
R.join('-', [1, 2, 3])  //=> '1-2-3'
```

#### last

> last(arrOrStr: Array|String): any

- Returns the last element of `arrOrStr`

```javascript
R.last(['foo', 'bar', 'baz']) //=> 'baz'
R.last('foo') //=> 'o'
```

#### length

> length(arrOrStr: Array|String): Number

```javascript
R.length([1, 2, 3]) //=> 3
```

#### map

> map(mapFn: Function, arr: Array): Array

Returns the result of looping through `arr` with `mapFn`

```javascript
const mapFn = x => x * 2;
R.map(mapFn, [1, 2, 3]) //=> [2, 4, 6]
```

#### match

> map(regExpression: Regex, str: String): Array

```javascript
R.match(/([a-z]a)/g, 'bananas') //=> ['ba', 'na', 'na']
```

#### merge

> merge(a: Object, b: Object)

Returns result of `Object.assign({}, a, b)`

```javascript
R.merge({ 'foo': 0, 'bar': 1 }, { 'foo': 7 })
//=> { 'foo': 7, 'bar': 1 }
```

#### omit

> omit(propsToOmit: Array<String>, obj: Object): Object

- Returns a partial copy of an `obj` with omitting `propsToOmit`

```javascript
R.omit(['a', 'd'], {a: 1, b: 2, c: 3}) //=> {b: 2, c: 3}
```

#### path

> path(pathToSearch: Array<String>|String, obj: Object): any

- Retrieve the value at `pathToSearch` in object `obj`

```javascript
R.path('a.b', {a: {b: 2}}) //=> 2
R.path(['a', 'b'], {a: {b: 2}}) //=> 2
R.path(['a', 'c'], {a: {b: 2}}) //=> undefined
```

#### partialCurry

> partialCurry(fn: Function|Async, a: Object, b: Object): Function|Promise

When called with function `fn` and first set of input `a`, it will return a function.

This function will wait to be called with second set of input `b` and it will invoke `fn` with the merged object of `a` over `b`.

`fn` can be asynchronous function. In that case a `Promise` holding the result of `fn` is returned.

See the example below:

```javascript
const fn = ({a, b, c}) => {
  return (a * b) + c
}
const curried = R.partialCurry(fn, {a: 2})
curried({b: 3, c: 10}) //=> 16
```
- Note that `partialCurry` is method specific for **Rambda** and the method is not part of **Ramda**'s API

- You can read my argumentation for creating *partialCurry* [here](https://selfrefactor.gitbooks.io/blog/content/argumenting-rambdas-curry.html)

#### pick

> pick(propsToPick: Array<String>, obj: Object): Object

- Returns a partial copy of an `obj` containing only `propsToPick` properties

```
R.pick(['a', 'c'], {a: 1, b: 2}) //=> {a: 1}
```

#### pluck

> pluck(property: String, arr: Array): Array

- Returns list of the values of `property` taken from the objects in array of objects `arr`

```
R.pluck('a')([{a: 1}, {a: 2}, {b: 3}]) //=> [1, 2]
```

#### prepend

> prepend(valueToPrepend: any, arr: Array): Array

```javascript
R.prepend('foo', ['bar', 'baz']) //=> ['foo', 'bar', 'baz']
```

#### prop

> prop(propToFind: String, obj: Object): any

Returns `undefined` or the value of property `propToFind` in `obj`

```javascript
R.prop('x', {x: 100}) //=> 100
R.prop('x', {a: 1}) //=> undefined
```

#### propEq

> propEq(propToFind: String, valueToMatch: any, obj: Object): Boolean

Returns true if `obj` has property `propToFind` and its value is equal to `valueToMatch`

```javascript
const propToFind = "foo"
const valueToMatch = 0
R.propEq(propToFind, valueToMatch)({foo: 0}) //=> true
R.propEq(propToFind, valueToMatch)({foo: 1}) //=> false
```

#### range

> range(start: Number, end: Number): Array<Number>

- Returns a array of numbers from `start`(inclusive) to `end`(exclusive)

```javascript
R.range(0, 2)   //=> [0, 1]
```

#### reduce

> reduce(iteratorFn: Function, accumulator: any, array: Array): any

- Returns a single item by iterating through the list, successively calling the iterator function `iteratorFn` and passing it an `accumulator` value and the current value from the array, and then passing the result to the next call.

The iterator function behaves like the native callback of the [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method.

```javascript
const iteratorFn = (acc, val) => acc + val
R.reduce(iteratorFn, 1, [1, 2, 3])   //=> 7
```

#### repeat

> repeat(valueToRepeat: T, num: Number): Array<T>

```javascript
R.repeat('foo', 2) //=> ['foo', 'foo']
```

#### replace

> replace(strOrRegex: String|Regex, replacer: String, str: String): String

Replace `strOrRegex` found in `str` with `replacer`

```javascript
R.replace('foo', 'bar', 'foo foo') //=> 'bar foo'
R.replace(/foo/, 'bar', 'foo foo') //=> 'bar foo'
R.replace(/foo/g, 'bar', 'foo foo') //=> 'bar bar'
```

#### sort

> sort(sortFn: Function, arr: Array): Array

Returns copy of `arr` sorted by `sortFn`

`sortFn` must return `Number`

```javascript
const sortFn = (a, b) => a - b
R.sort(sortFn, [3, 1, 2]) //=> [1, 2, 3]
```

#### sortBy

> sortBy(sortFn: Function, arr: Array): Array

Returns copy of `arr` sorted by `sortFn`

`sortFn` must return value for comparison

```javascript
const sortFn = obj => obj.foo
R.sortBy(sortFn, [
  {foo: 1},
  {foo: 0}
])
//=> [{foo: 0}, {foo: 1}]
```

#### split

> split(separator: String, str: String): Array

```javascript
R.split('-', 'a-b-c') //=> ['a', 'b', 'c']
```

#### splitEvery

> splitEvery(sliceLength: Number, arrOrString: Array|String): Array

- Splits `arrOrStr` into slices of `sliceLength`

```javascript
R.splitEvery(2, [1, 2, 3]) //=> [[1, 2], [3]]
R.splitEvery(3, 'foobar') //=> ['foo', 'bar']
```

#### subtract

> subtract(a: Number, b: Number): Number

Returns `a` minus `b`

```javascript
R.subtract(3, 1) //=> 2
```

#### tail

> tail(arrOrStr: Array|String): Array|String

- Returns all but the first element of `arrOrStr`

```javascript
R.tail([1, 2, 3])  //=> [2, 3]
R.tail('foo')  //=> 'oo'
```

#### take

> take(num: Number, arrOrStr: Array|String): Array|String

- Returns the first `num` elements of `arrOrStr`

```javascript
R.take(1, ['foo', 'bar']) //=> ['foo']
R.take(2, ['foo']) //=> 'fo'
```

#### takeLast

> takeLast(num: Number, arrOrStr: Array|String): Array|String

- Returns the last `num` elements of `arrOrStr`

```javascript
R.takeLast(1, ['foo', 'bar']) //=> ['bar']
R.takeLast(2, ['foo']) //=> 'oo'
```

#### test

> test(regExpression: Regex, str: String): Boolean

- Determines whether `str` matches `regExpression`

```javascript
R.test(/^f/, 'foo') //=> true
R.test(/^f/, 'bar') //=> false
```

#### toLower

> toLower(str: String): String

```javascript
R.toLower('FOO') //=> 'foo'
```

#### toUpper

> toUpper(str: String): String

```javascript
R.toUpper('foo') //=> 'FOO'
```

#### trim

> trim(str: String): String
```javascript
R.trim('  foo  ') //=> 'foo'
```

#### type

> type(a: any): String

```javascript
R.type(() => {}) //=> "Function"
R.type(async () => {}) //=> "Async"
R.type([]) //=> "Array"
R.type({}) //=> "Object"
R.type('s') //=> "String"
R.type(1) //=> "Number"
R.type(false) //=> "Boolean"
R.type(null) //=> "Null"
R.type(/[A-z]/) //=> "RegExp"
```

#### uniq

> uniq(arr: Array): Array

- Returns a new array containing only one copy of each element in `arr`

```javascript
R.uniq([1, 1, 2, 1]) //=> [1, 2]
R.uniq([1, '1'])     //=> [1, '1']
```

#### update

> update(i: Number, replaceValue: any, arr: Array): Array

- Returns a new copy of the `arr` with the element at `i` index
replaced with `replaceValue`

```javascript
R.update(0, "foo", ['bar', 'baz']) //=> ['foo', baz]
```

#### values

> values(obj: Object): Array

- Returns array with of all values in `obj`

```javascript
R.values({a: 1, b: 2}) //=> [1, 2]
```
