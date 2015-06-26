glob = global ? window

doc   = glob.document
I     = (a) -> a
merge = (t, os...) -> t[k] = v for k,v of o when v != undefined for o in os; t

# inject css
do ->
    styles = "%%%CSSSTYLES%%%%"
    css = doc.createElement('style')
    css.type = 'text/css'
    css.innerHTML = styles
    doc.head.appendChild css

class Group    then constructor: (@cats)         ->
class Category then constructor: (@name, opts)   -> merge @, opts
class Trigger  then constructor: (@symbol, opts) -> merge @, opts

# Function to make ttbox out of an element with triggers
#
ttbox = (el, trigs...) ->
    # pass ref to element and tell to initialize
    el = ttbox.render.init el

    # and check we got a good thing back
    throw new Error('Need a DIV') unless el.tagName == 'DIV'

    # the event handlers
    handlers =
        keydown: (el) ->
        focusin: (el) ->
        focusout: (el) ->

    # first drawing
    do draw = ->
        # draw and attach handlers
        ttbox.render.draw handlers


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


# define an invisible property on ttbox
def = (name, value) -> Object.defineProperty ttbox, name,
    enumerable: false
    configurable: false
    value: value

# jquery drawing hook
do ->
    $    = null # set on init
    $el  = null # set on init
    html = '<div class="ttbox"><div class="ttbox-area"></div></div>'
    def 'jquery',
        init: (el) ->
            throw new Error("Didn't find jQuery") unless $ = jQuery
            $el = $(el)
            $el[0]
        draw: (handlers) ->
            $el.html html
            $el.on(event, handler) for event, handler in handlers

# use jquery render default
def 'render', ttbox.jquery

# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox