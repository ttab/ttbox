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
filterA0 =   (s) -> s.replace /\u00a0/g, ' ' # nbsp
filterZwnj = (s) -> s.replace /\u200b/g, ''
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

class Type then constructor: (@name, opts) -> merge @, opts
class Trigger then constructor: (@symbol, opts, types) ->
    merge @, opts
    @types = if Array.isArray types then types else [types]
    if @prefix
        throw new Error("Cant have multiple types with prefix trigger") if @types.length > 1
        @re = RegExp "^()\\#{@symbol}(\\w*)$"
    else
        @re = RegExp "^(\\w*)\\#{@symbol}(\\w*)$"

skipZwnj = (d, end) ->
    return unless r = cursor()
    n = if end then r.endContainer else r.startContainer
    i = if end then r.endOffset else r.startOffset
    return unless n.nodeType == 3
    c = n.nodeValue.charCodeAt (if d < 0 then i + d else i)
    if c == 8203
        # move
        setCursorPos r, i + d
        skipZwnj d, end # and maybe continue moving?

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
    for i in [t.startOffset..max] by 1
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
        # a pill edit trumfs all
        return if handlepill()
        # cursor range for word
        r = wordRangeAtCursor()
        word = rangeStr(r)
        # a trigger in the word?
        trig = find trigs, (t) -> t.re.test word
        # no trigger found in current word, abort
        unless trig
            stopsug?()
            return
        # exec trigger to get parts
        [_, typename, value] = trig.re.exec word
        # find possible types
        types = trig.types.filter (t) -> trig.prefix or t.name.indexOf(typename) == 0
        # hand off to deal with found input
        handletypes r, trig, types, char

    sugselect = null
    sugmover = null
    setSugmover = (_sugmover) -> sugmover = _sugmover
    stopsug = ->
        sugselect = sugmover = null
        render.unsuggest()

    handletypes = (range, trig, types, char) ->
        # the trigger position in the word range
        tpos = findInRange range, trig.symbol
        # no tpos?!
        return if tpos < 0
        # range for type name (which may not be the entire name)
        trange = range.cloneRange()
        trange.setEnd trange.endContainer, tpos
        # whether the last input was the trigger
        wastrig = char == trig.symbol
        # helper when finished selecting a type
        selectType = (type) ->
            #trange.deleteContents()
            #trange.insertNode doc.createTextNode type.name
            render.pillify range, trig, type
        if types.length == 0
            stopsug()
        else if types.length == 1 and not sugmover
            # one possible solution
            if wastrig
                # for trigger char, we select straight away
                selectType types[0]
        else
            # when the key input was the trigger and there are
            # multiple possible values, position. move to just before
            # the trigger char.
            if wastrig
                # move the cursor to allow for suggest input
                setCursorPos range, tpos
            # start a suggest for current possible types
            typesuggest trange, tpos, selectType, types


    typesuggest = (range, tpos, selectType, types) ->
        fntypes = (_, cb) -> cb types
        sugselectfor = (item) -> ->
            # stop suggesting
            stopsug()
            # the type is selected
            selectType item
        # if there is only one, set it as possible for return key
        sugselect = sugselectfor types[0] if types.length == 1
        # render suggestions
        render.suggest fntypes, range, -1, setSugmover, (item, doset) ->
            sugselect = sugselectfor item
            sugselect() if doset

    handlepill = ->
        return unless r = wordRangeAtCursor()
        return unless pill = render.pillfor(r.startContainer?.parentNode)
        return unless typeof pill.type?.suggest == 'function'
        # definitely a suggest
        fnvals = (word, cb) -> pill.type.suggest word, cb, pill.type, pill.trig
        render.suggest fnvals, r, -1, setSugmover, (item, doset) ->
            console.log item, doset
        true # signal we dealt with it

    # move the input out of a pill (if we're in a pill)
    pilljump = ->
        return unless r = cursor()
        return unless sib = render.pillsibling(r.startContainer?.parentNode)
        r.selectNodeContents sib
        setCursorPos r, 0

    # the event handlers
    handlers =
        keydown:  (e) ->

            # this does an important el.normalize() that ensures we have
            # contiguous text nodes, crucial for the range logic.
            render.tidy()

            if e.keyCode == 13
                e.preventDefault() # dont want DOM change
                sugselect?()
                return if pilljump()

            if sugmover
                if e.keyCode == 38      # up
                    e.preventDefault()  # no cursor move
                    return sugmover(-1)
                else if e.keyCode == 40 # down
                    e.preventDefault()  # no cursor move
                    return sugmover(+1)

            if e.keyCode in [37, 8]
                skipZwnj -1, e.shiftKey # skip zwnj backwards to first non-zwnj pos
            else if e.keyCode in [39, 46]
                skipZwnj +1, e.shiftKey # skip zwnj forwards to first non-zwnj pos

            update() # do an update, but may cancel with keypress to get char

            # and keep make sure it's tidy
            later -> render.tidy()

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


# Helper method to make html for a suggest. Used as backup
# if suggest items don't provide a .html() method.
# ttbox.sugestHtml('word', 'wordispartof', 'some description')
#   produces
# "<div><dfn><b>word</b>ispartof</dfn>: some description</div>"
ttbox.suggestHtml = (word, name, desc = '') ->
    [high, unhigh] = if name.indexOf(word) == 0 then [word, name[word.length..]] else ["", name]
    "<div><dfn><b>#{high}</b>#{unhigh}</dfn>: #{desc}</div>"
Type::html = (word) -> ttbox.suggestHtml word, @name, @desc

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
    cursugword = null
    pills = {} # <pillid, pill>
    tidypills = hold 5000, ->
        present = $el.find('.ttbox-pill').map(-> $(@).attr 'id').toArray()
        delete pills[id] for id in Object.keys(pills) when present.indexOf(id) < 0
        null
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
            cursugword = null
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
            # dont suggest for same word again
            return if cursugword == word
            cursugword = word
            # empty suggest box to start fresh
            $sug.html(''); $sug.off()
            # class to hook styling when suggesting
            $box().append($sug).addClass 'ttbox-showing-suggest'
            # request to get suggest elements
            fn word, (list) ->
                # not requesting anymore
                $box().removeClass 'ttbox-suggest-request'
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
            # create pill html
            dfn = if trig.prefix then trig.symbol else type.name + trig.symbol
            $pill = $("<div class=\"ttbox-pill\"><dfn>#{dfn}</dfn><span></span></div>")
            $pill.find('*').andSelf().prop 'contenteditable', 'false'
            ($span = $pill.find('span')).prop 'contenteditable', 'true'
            # generate id to associate with mem structure
            id = "ttboxpill#{Date.now()}"
            $pill.attr 'id', id
            # replace contents with pill
            range.deleteContents()
            range.insertNode $pill[0]
            # position cursor in pill
            r = doc.createRange()
            r.selectNodeContents $span[0]
            setCursorPos r, 0
            @tidy()
            value = -> $span.text()
            return pills[id] = {id, trig, type, value}
        pillsibling: (el) -> $(el).closest('.ttbox-pill')?[0]?.nextSibling
        pillfor: (el) -> pills[$(el).closest('.ttbox-pill').attr('id')]
        tidy: ->
            $inp = $el.find('.ttbox-input')
            inp = $inp[0]
            # merge stuff together and remove empty textnodes.
            inp.normalize()
            # first ensure there's a <br> at the end for non-IE
            unless isIE() or $inp.children().last().is 'br'
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
            # move cursor to not be on bad element positions
            if r = cursor()
                if r.startContainer == inp or r.endContainer == inp
                    cs = Array::slice.call childs
                    # current text node, then right, the left.
                    isText = (n) -> if n?.nodeType == 3 then n else null
                    i = r.startOffset
                    n = isText(cs[i]) ? isText(cs[i + 1]) ? isText(cs[i - 1])
                    if n
                        r.setStart n, 0
                        r.setEnd n, 0
            # remove any nested span in pills
            $el.find('.ttbox-pill span span').remove()
            # keep cache clean
            tidypills()
            null


isIE = -> glob.navigator.userAgent.indexOf('MSIE') > 0

# use jquery render default
def 'render', ttbox.jquery

# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox
