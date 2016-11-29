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
arrayFilter = (as,fn) -> (a for a in as when fn(a))

UA = glob?.navigator?.userAgent
[isIE, IEVer] = /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(UA) ? []
IEVer = parseInt IEVer if IEVer
isChrome  = UA.indexOf('Chrome') > 0

# define an invisible property
def = (obj, props) -> for name, value of props
    Object.defineProperty obj, name,
        enumerable: false
        configurable: false
        value: value
    null

zwnj         = "​" # &zwnj;
filterA0     = (s) -> s.replace /\u00a0/g, ' ' # nbsp
filterZwnj   = (s) -> s.replace /\u200b/g, ''
filter       = (s) -> filterA0 filterZwnj s
appendAfter  = (el, node) -> el.parentNode.insertBefore(node, el.nextSibling)
appendBefore = (el, node) -> el.parentNode.insertBefore(node, el)
hexdump      = (s) -> (c.charCodeAt(0).toString(16) for c in s).join(' ')

# inject css
do ->
    styles = "%%%CSSSTYLES%%%%"
    css = doc.createElement('style')
    css.type = 'text/css'
    css.innerHTML = styles
    doc.head.appendChild css

class Type
    constructor: (@name, opts) ->
        merge @, {format:I}, opts

class Trigger
    constructor: (@symbol, opts, types) ->
        merge @, opts
        @types = if Array.isArray types then types else [types]
        # set back reference
        t.trig = this for t in @types
        if @prefix
            throw new Error("Cant have multiple types with prefix trigger") if @types.length > 1
            @re = RegExp "^()\\#{@symbol}(\\w*)$"
        else
            @re = RegExp "^(\\w*)\\#{@symbol}(\\w*)$"

# Skip zwnj chars when moving left/right
skipZwnj = (pel, d, end) ->
    return unless r = cursor(pel)
    n = if end then r.endContainer else r.startContainer
    i = if end then r.endOffset else r.startOffset
    return unless n.nodeType == 3
    c = n.nodeValue.charCodeAt (if d < 0 then i + d else i)
    if c == 8203
        # move
        setCursorPos r, i + d
        skipZwnj d, end # and maybe continue moving?

isParent = (pn, n) ->
    if n == null then false else if pn == n then true else isParent(pn, n.parentNode)

# current cursor position
cursor = (pel) ->
    s = doc.getSelection()
    return unless s.rangeCount
    r = s.getRangeAt(0)
    if isParent(pel, r.startContainer) then r else null

# filter the range to get rid of unwanted chars
rangeStr = (r) -> filter r.toString()

firstIsWhite = (s) -> /^\s.*/.test(s ? '')
lastIsWhite  = (s) -> /.*\s$/.test(s ? '')

wordRangeAtCursor = (pel) ->
    return null unless r = cursor(pel)
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

entireTextAtCursor = (pel) ->
    return null unless r = cursor(pel)
    t = r.cloneRange()
    t.selectNodeContents t.startContainer
    return t

findInRange = (r, char) ->
    t = r.cloneRange()
    max = (t.endContainer?.nodeValue?.length ? 0) - 1
    for i in [t.startOffset..max] by 1
        t.setStart t.startContainer, i
        t.setEnd t.endContainer, i + 1
        return i if t.toString() == char
    return -1

setCursorPos = (r, pos = 0) ->
    t = doc.createRange()
    t.setStart r.startContainer, pos
    t.setEnd r.startContainer, pos
    sel = doc.getSelection()
    sel.removeAllRanges()
    sel.addRange t

setCursorEl = (el, pos = 0) ->
    r = doc.createRange()
    r.selectNodeContents el
    pos = el?.nodeValue?.length if pos < 0
    setCursorPos r, pos

# Function to make ttbox out of an element with triggers
#
ttbox = (el, trigs...) ->

    # local reference to render plug
    render = ttbox.render()

    # let render decide we have a good el
    el = render.init(el)

    # and check we got a good thing back
    throw new Error('Need a DIV') unless el.tagName == 'DIV'

    # dispatch events on incoming div
    dispatch = (name, opts) ->
        e = doc.createEvent 'Event'
        merge e, opts, {ttbox:façade}
        e.initEvent "ttbox:#{name}", true, false
        el.dispatchEvent e

    # add a new pill to input
    addpill = (type, item) ->
        # either use cursor position, or the last child element
        r = cursor(el) ? render.rangelast()
        # implicitly does tidy
        return render.pillify r, type, item, dispatch
    addtext = (text) ->
        # either use cursor position, or the last child element
        r = cursor(el) ? render.rangelast()
        r.insertNode doc.createTextNode(text)
        render.tidy()
        return r
    clear = ->
        render.clear()
        update()
    trigger = (symbol) ->
        # make sure contiguous text nodes
        render.tidy()
        render.focus() # ensure we have focus
        # we want to be to the right of any zwnj
        # in the current text block
        skipZwnj el, 1
        # get the current word
        r = wordRangeAtCursor(el)
        str = rangeStr(r)
        # do nothing if current word already contains trigger symbol
        return if str.indexOf(symbol) >= 0
        # insert space if we have content beforehand
        insert = if str == '' then symbol else " #{symbol}"
        cursor(el).insertNode doc.createTextNode insert
        # make contiguous text nodes
        render.tidy()
        # position at the very end of this
        r = entireTextAtCursor(el)
        setCursorPos r, r.endOffset - symbol.length
        # trigger suggest
        update()

    # exposed operations
    façade = {
        addpill, addtext, render, clear, trigger
        values: -> render.values()
        setvalues: (values) ->
            clear()
            values.forEach (v) ->
                if typeof v == 'string'
                    addtext v
                else
                    addpill v.type, v.item
            update()
        focus: -> render.focus()
        placeholder: (txt) ->
            render.setPlaceholder(txt)
            update() # toggle placeholder
    }

    prevvalues = []

    update = hold 3, (char) ->
        # the current values
        values = render.values()
        # show placeholder if it's empty
        render.togglePlaceholder values.length == 0
        unless values.reduce ((p, c, i) -> p and c == prevvalues[i]), true
            prevvalues = values
            dispatch 'change', {values}
        # a pill edit trumfs all
        return if handlepill()
        # cursor range for word
        r = wordRangeAtCursor(el)
        # XXX optimize with below?
        unless r
            stopsug?()
            return
        word = rangeStr(r)
        # a trigger in the word?
        trig = find trigs, (t) -> t.re.test word
        # no trigger found in current word, abort
        unless trig
            stopsug?()
            return

        if trig.symbol is 'default'
            defaultSuggest trig.fn, r, -1
        else
            # exec trigger to get parts
            [_, typename, value] = trig.re.exec word
            # find possible types
            types = trig.types.filter (t) -> trig.prefix or t.name?.indexOf(typename) == 0
            # hand off to deal with found input
            handletypes r, trig, types, char, values

    sugselect = sugmover = sugword = null
    setSugmover = (_sugmover) -> sugmover = _sugmover
    stopsug = ->
        sugselect = sugmover = sugword = null
        render.unsuggest()
        dispatch 'suggeststop'

    # close suggest when pills leave
    el.addEventListener 'ttbox:pillremove', (ev)->
        stopsug()
        update() # trigger value-change
    # close suggest when pill lose focus
    el.addEventListener 'ttbox:pillfocusout', stopsug

    handletypes = (range, trig, types, char, values) ->
        # if trigger is 'default', the actual trigger is the entire search string
        # in other cases the trigger is the trig.symbol
        triggerSymbol = trig.symbol
        # the trigger position in the word range
        tpos = findInRange range, triggerSymbol
        # no tpos?!
        return if tpos < 0
        # range for type name (which may not be the entire name)
        trange = range.cloneRange()
        trange.setEnd trange.endContainer, tpos
        # whether the last input was the trigger
        wastrig = char == trig.symbol
        # helper when finished selecting a type
        selectType = (type) ->
            render.pillify range, type, null, dispatch
            update()
            dispatch 'suggesttypeselect', {trig, type}

        if types.length == 0
            stopsug()
        else if types.length == 1 and not sugmover
            # one possible solution
            if wastrig
                # for trigger char, we select the first type straight away
                selectType find types, (t) -> !t.divider
        else
            # when the key input was the trigger and there are
            # multiple possible values, position. move to just before
            # the trigger char.
            if wastrig
                # move the cursor to allow for suggest input
                setCursorPos range, tpos
            # start a suggest for current possible types
            typesuggest trange, tpos, trig, selectType, types, values


    # suggest for given types
    typesuggest = (range, tpos, trig, selectType, types, values) ->
        # filter to only show types that are supposed to be there
        # given limitOne:condition
        ftypes = do ->
            notInValues = (t) -> !(values?.filter (v) -> v?.type?.name == t.name)?.length
            arrayFilter types, (type) -> !type.limitOne || notInValues(type)
        # the current word
        word = rangeStr(range)
        # dont suggest for same word
        return true if sugword == word
        sugword = word
        # helper to create sugselect functions
        sugselectfor = (item) -> ->
            # stop suggesting
            stopsug()
            # the type is selected
            selectType item
            return true # indicate handled
        # function that suggest types
        fntypes = (_, cb) -> cb ftypes
        # if there is only one, set it as possible for return key
        sugselect = sugselectfor ftypes[0] if types.length == 1
        # render suggestions
        render.suggest fntypes, range, -1, setSugmover, (type, doset) ->
            sugselect = sugselectfor type
            sugselect() if doset
            dispatch 'suggesttype', {trig, type}
        # tell the world
        dispatch 'suggesttypes', {trig, ftypes}

    defaultSuggest = (triggerFn, range, sugStartIndex)->

        selectItem = (item) ->
            # Set selected item in search box and trigger search
            for input in $('.ttbox-input')
                input.childNodes[0].nodeValue = item.value
            dispatch 'suggestitemselect', item

        sugSelectFn = (item, doset) ->
            sugselect = ->
                # stop suggesting
                stopsug()
                # select the item
                selectItem item
                return true # indicate handled
            sugselect() if doset
            dispatch 'suggestitem', item

        # When performing default suggestions we want to match on all
        # search terms
        range.setStart range.startContainer, 0
        render.suggest triggerFn, range, sugStartIndex, setSugmover, sugSelectFn

    handlepill = ->
        return unless r = entireTextAtCursor(el)
        return unless pill = render.pillfor(r.startContainer?.parentNode)
        return unless typeof pill.type?.suggest == 'function' # definitely a suggest
        # the current word
        word = rangeStr(r)
        # dont suggest for same word
        return true if sugword == word
        sugword = word
        # suggest function as fn to render.suggest
        fnvals = (word, cb) -> pill.type.suggest word, cb, pill.type, pill.trig
        # helper when we decide on an item
        selectItem = (item) ->
            pill.setItem item
            # later since it may be select from click, which is mousedown
            later -> pill.setCursorAfter()
            dispatch 'suggestitemselect', {pill, item}
        render.suggest fnvals, r, -1, setSugmover, (item, doset) ->
            sugselect = ->
                # stop suggesting
                stopsug()
                # select the item
                selectItem item
                return true # indicate handled
            sugselect() if doset
            dispatch 'suggestitem', {pill, item}
        # tell the world about it
        dispatch 'suggestitems', {pill}
        return true # signal we dealt with it

    # move the input out of a pill (if we're in a pill)
    pilljump = ->
        return unless r = cursor(el)
        return unless pill = render.pillfor(r.startContainer?.parentNode)
        stopsug()
        pill.setCursorAfter()
        return true

    # the event handlers
    handlers =
        keydown: (e) ->
            # this does an important el.normalize() that ensures we have
            # contiguous text nodes, crucial for the range logic.
            render.tidy()

            if e.keyCode == 13
                e.preventDefault() # dont want DOM change
                if sugselect?()
                    e.stopPropagation()
                    return
                if pilljump()
                    e.stopPropagation()
                    return

            if sugmover
                if e.keyCode == 38      # up
                    e.preventDefault()  # no cursor move
                    e.stopPropagation()
                    return sugmover(-1)
                else if e.keyCode == 40 # down
                    e.preventDefault()  # no cursor move
                    e.stopPropagation()
                    return sugmover(+1)

            if e.keyCode in [37, 8]
                skipZwnj el, -1, e.shiftKey # skip zwnj backwards to first non-zwnj pos
            else if e.keyCode in [39, 46]
                skipZwnj el, +1, e.shiftKey # skip zwnj forwards to first non-zwnj pos

            update() # do an update, but may cancel with keypress to get char

            # and keep make sure it's tidy
            later -> render.tidy()

        keypress: (e) ->
            # cancel previous update since we have a charcode
            update String.fromCharCode(e.which)

        paste: (e) ->
            # stop default paste action
            e.preventDefault()

            # grab the actual event (in case jQuery wrapped)
            e = (e.originalEvent ? e)

            if e?.clipboardData
                # Standard style
                txt = e.clipboardData.getData 'text/plain'
                doc.execCommand 'insertText', false, txt
            else if window.clipboardData
                # IE style
                txt = window.clipboardData.getData 'Text'
                return unless r = cursor(el)
                r.insertNode doc.createTextNode txt

            update()

            false


    # first drawing
    do draw = ->
        # draw and attach handlers
        render.draw handlers
        render.tidy()

    # first event
    later -> dispatch 'init'

    # return the facade to interact
    return façade


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


# Factory function for dividers in type lists
#
# Usage:
#   var types = [
#     ttbox.divider('Limit search on'),
#     ttbox.type('product', {suggest: function (txt, callback, opts) { ... } }),
#     ttbox.type('person',  {suggest: function (txt, callback, opts) { ... } }),
#   ]
ttbox.divider = (name, opts) -> new Type name, merge {
    divider:true
    html: -> "<div><hr><span>#{@name}</span></div>"
}, opts


# Factory function for making types.
#
# Usage:
#   var types = [
#     ttbox.type('product', {suggest: function (txt, callback, opts) { ... } }),
#     ttbox.type('person',  {suggest: function (txt, callback, opts) { ... } }),
#   ]
ttbox.type = (name, opts, types) -> new Type name, opts


# Helper method to make html for a suggest.
# "<div><dfn><b>word</b>ispartof</dfn>: some description</div>"
suggestHtml = (word, prefix, name, suffix, desc = '') ->
    return '<div></div>' unless name
    [high, unhigh] = if name.indexOf(word) == 0 then [word, name[word.length..]] else ["", name]
    "<div><dfn>#{prefix}<b>#{high}</b>#{unhigh}#{suffix}</dfn> <span>#{desc}</span></div>"
Type::html = (word) ->
    if @trig.prefix
        suggestHtml word, @trig.symbol, @name, "", @desc
    else
        suggestHtml word, "", @name, @trig.symbol, @desc


# goes through an element parsing pills and
# text into a datastructure
# helper to turn a suggest item into html
toHtml = (word) -> (item) ->
    if typeof item?.html == 'function'
        item.html(word)
    else if typeof item?.value == 'string'
        suggestHtml word, "", item.value, "", item.desc
    else
        suggestHtml word, "", item, ""


# helper to turn an item into text
toText = (item = '') ->
    if typeof item?.value == 'string'
        item.value
    else
        String(item)

# jquery drawing hook
def ttbox, jquery: ->

    $    = null # set on init
    $el  = null # set on init
    $box = -> $el.find('.ttbox')
    # html for box
    html = '<div class="ttbox"><div class="ttbox-overflow">' +
        '<div class="ttbox-input" contenteditable="true"></div></div>' +
        '<div class="ttbox-placeholder"></div></div>'
    suggest = '<div class="ttbox-sug-overflow"><div class="ttbox-suggest"></div></div>'
    # cache of pill <pillid, pill> structures
    pills = {}
    # helper to tidy cache
    tidypills = hold 5000, ->
        present = $el.find('.ttbox-pill').map(-> $(@).attr 'id').toArray()
        delete pills[id] for id in Object.keys(pills) when present.indexOf(id) < 0
        null
    # return the pill structure for an element
    pillfor = (el) -> pills[$(el).closest('.ttbox-pill').attr('id')]
    # go through cache and ensure all pills have the item value of the
    # element value.
    ensureItems = ->
        pill.ensureItem() for k, pill of pills
        null

    # call often. fix things.
    tidy = ->
        $inp = $el.find('.ttbox-input')
        inp = $inp[0]
        # merge stuff together and remove empty textnodes.
        inp.normalize()
        # first ensure there's a <br> at the end (or <i> for IE)
        tag = if isIE then 'i' else 'br'
        unless $inp.children().last().is tag
            $inp.find("> #{tag}").remove()
            $inp.append "<#{tag}>"
        childs = inp.childNodes
        first = childs[0]
        # ensure the whole things starts with a zwnj
        if first?.nodeType != 3 or first?.nodeValue?[0] != zwnj
            $inp[0].insertBefore doc.createTextNode(zwnj), first
        # ensure there's always a zwnj after every element node
        for n in childs when n?.nodeType == 1 and n?.nextSibling?.nodeType == 1
            appendAfter n, doc.createTextNode(zwnj)
        # remove any nested span in pills
        $el.find('.ttbox-pill span span').remove()
        # again, ensure contigous nodes
        inp.normalize()
        # move cursor to not be on bad element positions
        if r = cursor($el[0])
            if (r.startContainer == inp or r.endContainer == inp)
                cs = Array::slice.call childs
                # current text node, then right, the left.
                isText = (n) -> if n?.nodeType == 3 then n else null
                i = r.startOffset
                n = isText(cs[i]) ? isText(cs[i + 1]) ? isText(cs[i - 1])
                setCursorEl n, -1 if n
            # firefox manages to focus anything but the only
            # contenteditable=true of the pill
            paren = r.startContainer.parentNode
            if paren?.nodeName != 'SPAN' and pill = pillfor paren
                pill.setCursorIn()
        # keep cache clean
        tidypills()
        null

    # initialise box
    init: (el) ->
        throw new Error("Didn't find jQuery") unless $ = jQuery
        $el = $(el)
        $el[0]

    # draw stuff and hook up event handlers
    draw: (handlers) ->
        $el.html html
        $el.on(event, handler) for event, handler of handlers

    # clear the state of the input
    clear: ->
        $el.find('.ttbox-input').empty()
        tidy()

    # focus the input (if it doesn't already have focus)
    focus: ->
        return if cursor($el[0]) # already has focus
        tidy() # ensure we have a last node to position before
        ns = $el.find('.ttbox-input')[0].childNodes
        n = ns[ns.length - 2]
        setCursorEl n, -1

    # return an array of values for the box
    values: ->
        ensureItems()
        Array::slice.call($el.find('.ttbox-input')[0].childNodes).map (n) ->
            if n.nodeType == 1 and n?.className?.indexOf('ttbox-pill') >= 0
                pillfor n
            else if n.nodeType == 3
                filter n.nodeValue
        .filter I

    # remove sugggest
    unsuggest: unsuggest = ->
        $('.ttbox-sug-overflow').remove()
        $box().removeClass 'ttbox-showing-suggest'

    # start suggest
    suggest: (fn, range, idx, movecb, selectcb) ->
        # the current word
        word = rangeStr(range)
        # find/create suggest-box
        $sug = $('.ttbox-suggest')
        unless $sug.length
            $overflw = $(suggest)
            $sug = $overflw.find '.ttbox-suggest'
            # lock width to parent
            $overflw.css 'min-width', $box().outerWidth()
            # adjust for border of parent
            bord = parseInt $el.find('.ttbox-overflow').css('border-bottom-width')
            $overflw.css top:$el.outerHeight() - bord
            # append to box
            $box().append $overflw
            # indicate we are showing
            $box().addClass('ttbox-showing-suggest')
        # empty suggest box to start fresh
        $sug.html(''); $sug.off()
        # class to hook styling when suggesting
        $box().addClass('ttbox-suggest-request')
        # request to get suggest elements
        fn word, (list) ->
            # not requesting anymore
            $box().removeClass 'ttbox-suggest-request'
            # local toHtml with word
            locToHtml = toHtml(word)
            # turn list into html
            list.forEach (l) ->
                $h = $(locToHtml(l))
                $h.addClass if l.divider
                    'ttbox-suggest-divider'
                else
                    'ttbox-suggest-item'
                $h.addClass l.className if l.className
                $sug.append $h
            # list without dividers
            nodivid = list.filter (l) -> !l.divider
            previdx = null
            do selectIdx = (dostart = false) ->
                return if idx < 0 and !dostart
                idx = 0 if idx < 0
                idx = nodivid.length - 1 if idx >= nodivid.length
                return if previdx == idx
                previdx = idx
                $sug.find('.ttbox-selected').removeClass('ttbox-selected')
                $sel = $sug.children('.ttbox-suggest-item').eq(idx)
                $sel.addClass('ttbox-selected')
                sctop = $sel?.closest('.ttbox-sug-overflow').scrollTop()
                pos = $sel?.position()
                $sel?.closest('.ttbox-sug-overflow').scrollTop (pos.top + sctop)
                selectcb nodivid[idx]
            # handle click on a suggest item, mousedown since click
            # will fight with focusout on the pill
            $sug.on 'mousedown', (ev) ->
                ev.stopPropagation()
                ev.preventDefault() # no lose focus
                $it = $(ev.target).closest('.ttbox-suggest-item')
                return unless $it.length
                i = $sug.children('.ttbox-suggest-item').index $it
                return unless i >= 0
                selectcb nodivid[i], true
            # callback passed to parent for key navigation
            movecb (offs) ->
                return unless offs
                idx = idx + offs
                selectIdx true

    # insert a pill for type/item at given range
    pillify: (range, type, item, dispatch) ->

        # the trig is read from the type
        return unless trig = type?.trig

        # create pill html
        dfn = if trig
            if trig.prefix then trig.symbol else type.name + trig.symbol
        else
            type.name
        $pill = $("<div class=\"ttbox-pill\"><div class=\"ttbox-pill-close\">×</div>" +
            "<dfn>#{dfn}</dfn><span></span></div>")
        $pill.find('*').andSelf().prop 'contenteditable', 'false'
        ($span = $pill.find('span')).prop 'contenteditable', 'true'
        # if prefix style pill
        $pill.addClass 'ttbox-pill-prefix' if trig.prefix
        $pill.addClass trig.className if trig.className
        $pill.addClass type.className if type.className
        $pill.attr 'data-type', type.name

        # generate id to associate with mem structure
        id = "ttboxpill#{Date.now()}"
        $pill.attr 'id', id
        # replace contents with pill
        range.deleteContents()
        range.insertNode $pill[0]
        # remove pill from DOM, which in turn removes it completely
        remove = ->
            $pill.remove()
            dispatch 'pillremove', {pill}
        # wire up close button
        $pill.find('.ttbox-pill-close').on 'click', remove
        # format the text using the type formatter
        format = -> $span.text type.format $span.text()
        # maybe run format on focusout
        $pill.on 'focusout', ->
            # dispatch later to allow for click on suggest
            pill.ensureItem()
            format() if pill.item?._text
            dispatch 'pillfocusout', {pill}
        # helper function to scoll pill into view
        scrollIn = ->
            $pill.after $t = $('<span style="width:1px">')
            scleft = $t.closest('.ttbox-overflow').scrollLeft()
            pos = $t.position()
            $t.closest('.ttbox-overflow').scrollLeft pos.left + scleft
            $t.remove()
        # stop resize handles in IE
        if isIE
            $pill.on 'mousedown', (e) ->
                e.preventDefault()
                pill.setCursorIn()
                return false
        # the pill facade
        pill = pills[id] = {
            id, trig, type, remove,
            # set the item value for this pill
            setItem: (@item) -> $span.text toText @item
            # position in the pill value
            setCursorIn: ->
                scrollIn()
                setCursorEl $span[0]
            # position the cursor after the pill
            setCursorAfter: ->
                scrollIn()
                sib = $pill[0]?.nextSibling
                setCursorEl sib if sib
                skipZwnj $el[0], +1 # FF shows no cursor if we stand on 0
        }
        def pill,
            # ensure the text of the item corresponds to the value of @item
            ensureItem: ->
                stxt = $span.text().trim()
                ptxt = toText pill?.item
                pill.item = {value:stxt, _text:true} if stxt != ptxt
        scrollIn()
        tidy()
        if item
            # set the value
            pill.setItem item
        else
            # position cursor in pill. do it later, because we
            # may have created a pill as a result of a mousedown click
            # on a suggest
            later -> pill.setCursorIn()
        dispatch 'pilladd', {pill}
        return pill

    # return the pill for element
    pillfor: pillfor

    # keep input box tidy with various contenteditable bug corrections
    tidy: tidy

    # range for last input element
    rangelast: ->
        tidy()
        ns = $el.find('.ttbox-input')[0].childNodes
        n = ns[ns.length-2]
        r = doc.createRange()
        r.setStart n, n.nodeValue.length
        r.setEnd n, n.nodeValue.length
        return r

    setPlaceholder: (txt) ->
        $el.find('.ttbox-placeholder').text txt

    togglePlaceholder: (show) ->
        $el.find('.ttbox-placeholder').toggle show and (!isIE or IEVer >= 11)

# use jquery render default
def ttbox, render: ttbox.jquery

# Export the module in various different ways
if typeof module == 'object'
    module.exports = ttbox
else if typeof define == 'function' and define.amd
    define -> ttbox
else
    this.ttbox = ttbox
