ttbox - pillified suggestbox
============================

## Motivation

Suggest search box with pill constraints.

## Compatibility

* Chrome, Safari, Firefox, IE9+, iOS5+, Android

## Installing with NPM

```bash
npm install -S ttbox
```

### Installing with Bower

```bash
bower install -S ttbox
```
## API

### ttbox(div, trig1, trig2, ...)

Constructs a ttbox around a given div. Returns a façade for
interacting with the box.

#### Example

```javascript
ttbox($('#myinput'), ttbox.trig('@', {prefix:true}, ttbox.type('person', {
    suggest: function(word, cb, type) {
        ...
    }
})));
```


### The façade

A façade is returned by the `ttbox` function and is provided in all events.

#### façade.values()

Returns the current values of the box.

#### façade.addpill(type, item)

Adds a new pill to the box. Item is optional.

#### façade.clear()

Clear the input

#### façade.focus()

Focus the input (or do nothing if cursor already there).

#### façade.placeholder(txt)

XXX TODO

Set placeholder text (shown when input is empty).


### ttbox.trig(symbol, opts, type or typelist)

Declares a triggers with the nested types for that trigger.  Opts can
be omitted.

Options:

* `prefix` boolean indicating whether trigger is a prefix
* `className` items belonging to this trigger (suggest/pills) will
  have this class.

#### Example

```javascript
ttbox.trig('@', {
    prefix: true,
    className: 'persontrig'
}, ttbox.type('person', { ... }));
```


### ttbox.type(name, opts)

Declare a type belonging to a trigger. Opts can be omitted.

Options:

* `desc` description for this type. displayed in suggests.
* `suggest` to do suggestions for input `function(word, callback, type)`
* `limitOne` to limit number of pills of type to one (boolean).
* `html` to take control of what html represents the type in suggest
  list. `function(word)` and return a string with the html.
* `format` to get a chance to format (such as upper/lower-case) input
  that wasn't controlled by a suggest.

### Suggest returns:

Callback can be provided with

1. List of string
2. List of objects with `{value:'value'}`

Item options (for object form)

* `value` mandatory unless `html` is provided.
* `html` function to control html representation in suggests.
* `desc` value description
* `className` additional class in suggests.

### Example

Simplest form, no suggest.

```javascript
ttbox.type('mytype')
```

Suggest with fixed values returned

```javascript
ttbox.type('mytype', {
    suggest: function(word, cb, type) {
        cb(['my', 'list']);
}});
```

Fixed list with descriptions

```javascript
ttbox.type('product', {
    className: 'productype',
    desc: 'my products',
    suggest: function(word, cb, type) {
      return cb([
        {
          value: 'PHOTO',
          desc: 'All photos'
          html: function() { ... }
        }, {
          value: 'VIDEO',
          desc: 'All videos'
        }
      ].filter(function(i) {
        return i.value.indexOf(word.toUpperCase()) === 0;
      }));
    },
    format: function(t) {
        return t.toUpperCase();
    }
});
```


### ttbox.divider(title)

Special type inserted in type lists to `ttbox.trig` to make visual dividers.

#### Example

```javascript
var types = [
    ttbox.divider('Limit result to'),
    ttbox.type('product', { ... })
    ...
    ttbox.divider('Other options'),
    ttbox.type('quality', { ... })
```


## Events

A number of events are dispatched on the DOM element provided.

* `ttbox:init` after initialization.
* `ttbox:suggesttypes` when there are multiple possible types to select from.
* `ttbox:suggesttype` whenever one single type is highlighted (cursor move)
* `ttbox:suggesttypeselect` when a type is selected
* `ttbox:suggestitems` when there are multiple item choices
* `ttbox:suggestitem` when a single item is highlighted (cursor move)
* `ttbox:suggestitemselect` when a single item is selected
* `ttbox:suggeststop` when suggest is hidden.
* `ttbox:pilladd` when a pill is added
* `ttbox:pillremove` when a pill is removed

License
-------

The MIT License (MIT)

Copyright © 2015 TT Nyhetsbyrån

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
