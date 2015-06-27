glob = global ? window

doc   = glob.document
I     = (a) -> a
merge = (t, os...) -> t[k] = v for k,v of o when v != undefined for o in os; t
later = (fn) -> setTimeout fn, 1
hold  = (ms, f) -> last = 0; tim = null; (as...) ->
    clearTimeout tim if tim
    tim = setTimeout (->f as...), ms
last  = (as) -> as?[as.length - 1]
find  = (as, fn) -> return a for a in as when fn(a)

# inject css
do ->
    styles = "%%%CSSSTYLES%%%%"
    css = doc.createElement('style')
    css.type = 'text/css'
    css.innerHTML = styles
    doc.head.appendChild css

class Type
    constructor: (@name, opts) -> merge @, opts
    html: (word) ->
        high = ""
        unhigh = @name
        desc = @desc ? ''
        if @name.indexOf(word) == 0
            high = word
            unhigh = @name[word.length..]
        "<div><dfn><b>#{high}</b>#{unhigh}</dfn>: #{desc}</div>"
class Trigger then constructor: (@symbol, types) ->
    @types = if Array.isArray types then types else [types]

rangeBefore = (r) ->
    t = doc.createRange()
    caret = r.startOffset
    t.setStart r.startContainer, 0
    t.setEnd r.endContainer, caret
    # the characters *just* before new insertion up to white
    # space: "bla bla foo@" would be "foo"
    word = t.toString().match(/(^|\s+[^\s]+)*(^|\s+)([^\s]+)$/)?[3]
    if caret and word?.length <= caret
        t.setStart r.startContainer, caret - word.length
        t.setEnd r.endContainer, caret - 1
    return t

adjustRange = (r, start, end) ->
    t = doc.createRange()
    t.setStart r.startContainer, r.startOffset + start
    t.setEnd r.endContainer, r.endOffset + end
    return t

setCursor = (el) ->
    r = doc.createRange()
    r.setStart el, el.length
    (sel = doc.getSelection()).removeAllRanges()
    sel.addRange r

MODE_INPUT       = 0 # normal input
MODE_TYPE_SELECT = 1 # when selecting one out of several possible types
MODE_PILLEDIT    = 2 # when we are text editing a pill

# Function to make ttbox out of an element with triggers
#
ttbox = (el, trigs...) ->

    # local reference to render plug
    render = ttbox.render

    mode = MODE_INPUT

    setMode = (_mode, _type) ->
        return if mode == _mode
        mode = _mode
        render.unsuggest() # mode change means suggest goes

    # pass ref to element and tell to initialize
    el = render.init el

    # and check we got a good thing back
    throw new Error('Need a DIV') unless el.tagName == 'DIV'

    # for whenever we maybe detect an update
    update = do -> prev = null; hold 1, (char) ->
        v = render.value()
        cur = v.map((t) -> "|#{t.type}:#{t.value}").join('')
        (prev = cur; changed v, char) if prev != cur

    changed = (v, char) ->
        # the word range before the current insert point
        range = rangeBefore doc.getSelection().getRangeAt(0)
        word = range.toString()
        # potentially find a trigger
        trig = find trigs, (t) -> t.symbol == char and (t.types.length != 1 or !word) if char
        # a trigger to fire
        typeselect range, trig if trig

    typeselect = (range, trig) ->
        word = range.toString()
        # the possible types given current word
        types = trig.types.filter (t) -> t.name.indexOf(word) == 0
        if types.length == 1
            # only one possibility
            pilledit render.pillify adjustRange(range, 0, 1), trig, types[0]
        else
            # suggest for possible types
            setMode MODE_TYPE_SELECT
            suggestTypes range, trig, types

    # function for moving up/down the suggest
    sugmover = null
    sugmovecb = (_sugmover) -> sugmover = _sugmover
    sugselect = null # for chosing the current selected

    suggestTypes = (range, trig, types) ->
        sugmover = sugselect = null
        fn = (text, cb) -> cb types
        wrange = adjustRange range, 0 , 1 # adjust to include trigger
        render.suggest fn, range.toString(), -1, sugmovecb, (type, doselect) ->
            pill = render.pillify wrange, trig, type
            sugselect = ->
                sugmover = sugselect = null
                pilledit pill # move cursor to pill input
            sugselect() if doselect

    # when ending a pill edit by either return, esc or losing focus.
    pilleditend = null

    pilledit = (pill) ->
        setMode MODE_PILLEDIT
        # end edit pill function
        pilleditend = (commit) ->
            pilleditend = null
            pill.finish commit
            setMode MODE_INPUT
        pill.focus()

    # the event handlers
    handlers =
        keydown:  (e) ->

            if e.keyCode == 13
                e.preventDefault() # dont want DOM change
                if sugselect
                    sugselect()       # if there is a suggest select
                else if pilleditend
                    pilleditend(true) # if there's a pill edit end

            if e.keyCode == 27
                pilleditend?(false)

            if mode == MODE_INPUT
                update() # may be cancelled by keypress with which

            if sugmover
                if e.keyCode == 38      # up
                    e.preventDefault()  # no cursor move
                    sugmover(-1)
                else if e.keyCode == 40 # down
                    e.preventDefault()  # no cursor move
                    sugmover(+1)

            if mode == MODE_TYPE_SELECT
                e.preventDefault()

        keypress: (e) ->
            if mode == MODE_INPUT
                update String.fromCharCode(e.which) # cancel keypress with actual code
        focusin:  (e) ->
        focusout: (e) ->

    # first drawing
    do draw = ->
        # draw and attach handlers
        render.draw handlers


# Factory function for making types.
#
# Usage:
#   var types = [
#     ttbox.type('product', {suggest: function (txt, callback, opts) { ... } }),
#     ttbox.type('person',  {suggest: function (txt, callback, opts) { ... } }),
#   ]
ttbox.type = (name, opts) -> new Type name, opts


# Factory function for making triggers.
#
# Usage:
#   var trig = ttbox.trig(':', {
#     prefix: true,
#     postfix: true,
#     types: types
#   });
ttbox.trig = (symbol, opts) -> new Trigger symbol, opts


# define an invisible property on ttbox
def = (name, value) -> Object.defineProperty ttbox, name,
    enumerable: false
    configurable: false
    value: value

# goes through an element parsing pills and
# text into a datastructure
valueOf = (pel) -> [].map.call pel.childNodes, (el) ->
    if el.nodeName == 'DIV'
        # xxx parse div to pill
        {}
    else
        {type:'_text',value:el.nodeValue}


# jquery drawing hook
do ->
    $    = null # set on init
    $el  = null # set on init
    $box = -> $el.find('.ttbox')
    html = '<div class="ttbox"><div class="ttbox-overflow">' +
        '<div class="ttbox-input" contenteditable="true"></div></div></div>'
    suggest = '<div class="ttbox-suggest"></div>'
    def 'jquery',
        init: (el) ->
            throw new Error("Didn't find jQuery") unless $ = jQuery
            $el = $(el)
            $el[0]
        draw: (handlers) ->
            $el.html html
            $el.on(event, handler) for event, handler of handlers
        value: -> valueOf $el.find('.ttbox-input')[0]
        unsuggest: ->
            $('.ttbox-suggest').remove()
            $box().removeClass 'ttbox-showing-suggest'
        suggest: (fn, word, idx, movecb, selectcb) ->
            # find/create suggest-box
            $sug = $('.ttbox-suggest')
            $sug = $(suggest) unless $sug.length
            # lock width to parent
            $sug.width $el.outerWidth()
            # adjust for border of parent
            bord = parseInt $el.find('.ttbox-overflow').css('border-bottom-width')
            $sug.css top:$el.outerHeight() - bord
            # class to hook styling when suggesting
            $box().append($sug).addClass 'ttbox-showing-suggest'
            # empty suggest box to start fresh
            $sug.html('')
            # ensure no lingering handlers
            $sug.off()
            # callback to get suggest elements
            fn word, (list) ->
                # append each element .html()
                list.forEach (l) -> $sug.append $(l.html(word)).addClass('ttbox-suggest-item')
                do selectIdx = (dostart = false) ->
                    return if idx < 0 and !dostart
                    idx = 0 if idx < 0
                    idx = list.length - 1 if idx >= list.length
                    $sug.children().eq(idx).addClass 'ttbox-selected'
                    selectcb list[idx]
                # handle click on a suggest item
                $sug.click (ev) ->
                    ev.stopPropagation()
                    $it = $(ev.target).closest('.ttbox-suggest-item')
                    return unless $it.length
                    i = $sug.children().index $it
                    return unless i >= 0
                    selectcb list[i], true
                # callback passed to parent for key navigation
                movecb (offs) ->
                    $sug.find('.ttbox-selected').removeClass('ttbox-selected')
                    return unless offs
                    idx = idx + offs
                    selectIdx true
        pillify: (range, trig, type) ->
            range.deleteContents()
            $pill = $("<span class=\"ttbox-pill\"><dfn>#{type.name}#{trig.symbol}</dfn>"+
                "<span></span></span>")
            $pill.prop('contenteditable', 'false')
            $pill.children().prop('contenteditable', 'false')
            $pill.find('span').prop('contenteditable', 'true')
            $pill.find('span')[0].appendChild (insert = doc.createTextNode(''))
            range.insertNode($pill[0])
            later -> $pill[0].scrollIntoView()
            value = -> $pill.find('span').text()
            {
                focus: -> setCursor insert
                trig: ->  trig
                type: ->  type
                value: value
                finish: (keep) ->
                    # trim
                    $pill.find('span').text value().trim()
                    return $pill.remove() unless keep and value()
                    $pill.find('span').prop('contenteditable', 'false')
                    $pill.after('&nbsp;')
                    # ensure we're scrolled
                    $dummy = $('<span style="width:10px">')
                    appendAfter $pill[0], $dummy[0]
                    later ->
                        $dummy[0].scrollIntoView()
                        $dummy.remove()
                    # append text to focus cursor on
                    text = doc.createTextNode(' ')
                    appendAfter $pill[0], text
                    setCursor text
            }

appendAfter = (el, node) -> el.parentNode.insertBefore(node, el.nextSibling)

# use jquery render default
def 'render', ttbox.jquery

# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox
