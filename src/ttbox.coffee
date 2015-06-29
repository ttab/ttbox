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

zwnj = "​" # &zwnj;
filterA0 =   (s) -> s.replace /\u00a0/g, ' '  # nbsp
filterZwnj = (s) -> s.replace zwnj, ''
appendAfter  = (el, node) -> el.parentNode.insertBefore(node, el.nextSibling)
appendBefore = (el, node) -> el.parentNode.insertBefore(node, el)
hexdump = (s) -> (c.charCodeAt(0).toString(16) for c in s).join(' ')

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
class Trigger then constructor: (@symbol, opts, types) ->
    merge @, opts
    @types = if Array.isArray types then types else [types]
    if @prefix
        throw new Error("Cant have multiple types with prefix trigger") if @types.length > 1
        @re = RegExp "^()\\#{@symbol}(\\w*)$"
    else
        @re = RegExp "^(\\w*)\\#{@symbol}(\\w*)$"

isAlpha    = (ev) -> 65 <= ev.keyCode <= 90
isModifier = (ev) -> ev.ctrlKey || ev.metaKey || ev.altKey
isShift    = (ev) -> ev.shiftKey
isDel      = (ev) ->
    console.log ev.keyCode

# current cursor position
cursor = -> s = doc.getSelection(); if s.rangeCount then s.getRangeAt(0) else null

# filter the range to get rid of unwanted chars
rangeStr = (r) -> filterZwnj filterA0 r.toString()

firstIsWhite = (s) -> /^\s.*/.test(s ? '')
lastIsWhite  = (s) -> /.*\s$/.test(s ? '')

wordRangeAtCursor = ->
    return null unless r = cursor()
    t = r.cloneRange()
    # expand beginning
    while t.startOffset > 0 and not firstIsWhite rangeStr t
        t.setStart t.startContainer, t.startOffset - 1
    # one forward again
    t.setStart t.startContainer, t.startOffset + 1 if firstIsWhite rangeStr t
    # expand end
    len = t.endContainer?.nodeValue?.length ? 0
    while t.endOffset < len and not lastIsWhite rangeStr t
        t.setEnd t.endContainer, t.endOffset + 1
    # one back again
    t.setEnd t.endContainer, t.endOffset - 1 if lastIsWhite rangeStr t
    return t

findInRange = (r, char) ->
    t = r.cloneRange()
    max = (t.endContainer?.nodeValue?.length ? 0) - 1
    i = 0
    for i in [0..max] by 1
        t.setStart t.startContainer, i
        t.setEnd t.endContainer, i + 1
        return i if t.toString() == char
    return -1

setCursorPos = (r, pos) ->
    t = doc.createRange()
    t.setStart r.startContainer, pos
    t.setEnd r.endContainer, pos
    sel = doc.getSelection()
    sel.removeAllRanges()
    sel.addRange t

# Function to make ttbox out of an element with triggers
#
ttbox = (el, trigs...) ->

    # local reference to render plug
    render = ttbox.render

    # and check we got a good thing back
    throw new Error('Need a DIV') unless render.init(el).tagName == 'DIV'

    update = hold 3, (char) ->
        # here we go
        render.tidy()
        # cursor range for word
        r = wordRangeAtCursor()
        word = rangeStr(r)
        # a trigger in the word?
        trig = find trigs, (t) -> t.re.test word
        # no trigger found in current word, abort
        return unless trig
        # exec trigger to get parts
        [_, typename, value] = trig.re.exec word
        # find possible types
        types = trig.types.filter (t) -> trig.prefix or t.name.indexOf(typename) == 0
        # hand off to deal with found input
        handle r, trig, types, char

    sugselect = null
    sugmover = null
    setSugmover = (_sugmover) -> sugmover = _sugmover
    stopsug = ->
        sugselect = sugmover = null
        render.unsuggest()

    handle = (range, trig, types, char) ->
        # the trigger position in the word range
        tpos = findInRange range, trig.symbol
        # range for type name (which may not be the entire name)
        trange = range.cloneRange()
        trange.setEnd trange.endContainer, tpos
        # whether the last input was the trigger
        wastrig = char == trig.symbol
        # helper to replace the type name
        replaceTypename = (txt) ->
            trange.deleteContents()
            trange.insertNode doc.createTextNode txt
        if types.length == 0
            stopsug()
        else if types.length == 1 and not sugmover
            # one possible solution
            if wastrig
                # expand type name to only possible
                replaceTypename types[0].name
        else
            # when the key input was the trigger and there are
            # multiple possible values, position. move to just before
            # the trigger char.
            if wastrig
                # move the cursor to allow for suggest input
                setCursorPos range, tpos
            # start a suggest for current possible types
            typesuggest trange, tpos, replaceTypename, types


    typesuggest = (range, tpos, replace, types) ->
        fntypes = (_, cb) -> cb types
        sugselectfor = (item) -> ->
            # move cursor to just after the suggest
            setCursorPos range, tpos + 1
            # replace the type value with selected
            replace item.name
            # stop suggesting
            stopsug()
        # if there is only one, set it as possible for return key
        sugselect = sugselectfor types[0] if types.length == 1
        # render suggestions
        render.suggest fntypes, range, -1, setSugmover, (item, doset) ->
            sugselect = sugselectfor item
            sugselect() if doset


    # the event handlers
    handlers =
        keydown:  (e) ->

            if e.keyCode == 13
                e.preventDefault() # dont want DOM change
                sugselect?()

            if sugmover
                if e.keyCode == 38      # up
                    e.preventDefault()  # no cursor move
                    return sugmover(-1)
                else if e.keyCode == 40 # down
                    e.preventDefault()  # no cursor move
                    return sugmover(+1)

            update() # do an update, but may cancel with keypress to get char

        keypress: (e) ->
            # cancel previous update since we have a charcode
            update String.fromCharCode(e.which)

        focusin:  (e) ->
        focusout: (e) ->

    # first drawing
    do draw = ->
        # draw and attach handlers
        render.draw handlers
        render.tidy()


# Factory function for making types.
#
# Usage:
#   var types = [
#     ttbox.type('product', {suggest: function (txt, callback, opts) { ... } }),
#     ttbox.type('person',  {suggest: function (txt, callback, opts) { ... } }),
#   ]
ttbox.type = (name, opts, types) -> new Type name, opts


# Factory function for making triggers.
#
# Usage:
#   var trig1 = ttbox.trig(':', types);
#   var trig1 = ttbox.trig('@', {prefix: true}, types);
ttbox.trig = (symbol, opts, types) ->
    if arguments.length == 2
        types = opts
        opts = {}
    new Trigger symbol, opts, types


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
        '<div class="ttbox-input" contenteditable="true"><br/></div></div></div>'
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
        suggest: (fn, range, idx, movecb, selectcb) ->
            # the current word
            word = rangeStr(range)
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
        pillify: ->
        tidy: ->
            $inp = $el.find('.ttbox-input')
            inp = $inp[0]
            # merge stuff together and remove empty textnodes.
            inp.normalize()
            # first ensure there's a <br> at the end
            unless $inp.children().last().is 'br'
                $inp.find('br').remove()
                $inp.append '<br>'
            childs = inp.childNodes
            first = childs[0]
            # now ensure the whole things starts with a zwnj
            if first?.nodeType != 3 or first?.nodeValue?[0] != zwnj
                $inp[0].insertBefore doc.createTextNode(zwnj), first
            # ensure there's always a zwnj after every element node
            for n in childs when n?.nodeType == 1 and n?.nextSibling?.nodeType == 1
                appendAfter n, doc.createTextNode(zwnj)
            null



# use jquery render default
def 'render', ttbox.jquery

# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox
