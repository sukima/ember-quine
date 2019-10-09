// https://tritarget.org/#maybe.js

export function safeRead(obj, selector) {
  if (obj == null) { return null; }
  if (!selector || selector.length === 0) { return obj; }
  if ('string' === typeof selector) { selector = selector.split('.'); }
  return safeRead(obj[selector.shift()], selector);
}

export default function maybe(value) {
  if (value && value.isMaybe) return value;
  function isNone() { return value == null; }
  var obj = {
    prop: function(k) { return isNone() ? obj : maybe(safeRead(value, k)); },
    bind: function(f) { return isNone() ? obj : maybe(f(value)); },
    nothing: function(f) { return !isNone() ? obj : maybe(f(value)); },
    value: function (n) { return isNone() ? n : value; },
    isNone: isNone,
    isMaybe: true
  };
  return obj;
}
