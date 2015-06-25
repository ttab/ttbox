glob = global || window
$ = glob.jQuery

I     = (a) -> a
merge = (t, os...) -> t[k] = v for k,v of o when v != undefined for o in os; t

class Group    then constructor: (@cats)         ->
class Category then constructor: (@name, opts)   -> merge @, opts
class Trigger  then constructor: (@symbol, opts) -> merge @, opts

html = """
<div class="ttbox">
  <div class="ttbox-area">
  </div>
</div>
"""

# Function to make ttbox out of an element with triggers
#
ttbox = (el, trigs...) ->
    throw new Error('Need a DIV') unless el.tagName == 'DIV'
    $el = $(el)
    $el.html html


# Factory function for making categories and groups of categories
#
# Usage:
#   var cats = ttbox.cat(
#     ttbox.cat('product', {suggest: function (txt, callback, opts) { ... } }),
#     ttbox.cat('person',  {suggest: function (txt, callback, opts) { ... } }),
#   );
ttbox.cat = (name, opts) ->
    if typeof name == 'string'
        new Category name, opts
    else
        as = arguments
        if as.filter((a) -> not (a instanceof Category)).length
            throw new Error 'Groups can only consist of categories'
        new Group as


# Factory function for making triggers.
#
# Usage:
#   var trig = ttbox.trig(':', {
#     prefix: true,
#     postfix: true,
#     category: cats
#   });
ttbox.trig = (symbol, opts) -> new Trigger symbol, opts


# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox
