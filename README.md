# MyPromise — Promise Implementation From Scratch

This project is a custom implementation of JavaScript's native `Promise` to understand how asynchronous behavior works internally.

## Purpose

The goal of this project is to learn:

- How Promises manage state
- How `.then()` chaining works
- How errors propagate to `.catch()`
- How the JavaScript event loop and microtask queue affect execution order

## Features Implemented

- Promise states:
  - `pending`
  - `fulfilled`
  - `rejected`
- `.then()` method
- `.catch()` method
- Asynchronous callback execution using `queueMicrotask`
- Multiple `.then()` handlers support
- Error handling inside executor

## Example

```js
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("Success"), 1000);
});

p.then(data => {
  console.log(data);
  return "Next Step";
})
.then(step => {
  console.log(step);
})
.catch(err => {
  console.error(err);
});
