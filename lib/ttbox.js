(function() {
  var I, IEVer, Trigger, Type, UA, appendAfter, appendBefore, cursor, def, doc, entireTextAtCursor, filter, filterA0, filterZwnj, find, findInRange, firstIsWhite, glob, hexdump, hold, isChrome, isIE, isParent, last, lastIsWhite, later, merge, rangeStr, ref, ref1, ref2, setCursorEl, setCursorPos, skipZwnj, suggestHtml, toHtml, toText, ttbox, wordRangeAtCursor, zwnj,
    slice = [].slice;

  glob = typeof global !== "undefined" && global !== null ? global : window;

  doc = glob.document;

  I = function(a) {
    return a;
  };

  merge = function() {
    var j, k, len1, o, os, t, v;
    t = arguments[0], os = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (j = 0, len1 = os.length; j < len1; j++) {
      o = os[j];
      for (k in o) {
        v = o[k];
        if (v !== void 0) {
          t[k] = v;
        }
      }
    }
    return t;
  };

  later = function(fn) {
    return setTimeout(fn, 1);
  };

  hold = function(ms, f) {
    var last, tim;
    last = 0;
    tim = null;
    return function() {
      var as;
      as = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (tim) {
        clearTimeout(tim);
      }
      return tim = setTimeout((function() {
        return f.apply(null, as);
      }), ms);
    };
  };

  last = function(as) {
    return as != null ? as[as.length - 1] : void 0;
  };

  find = function(as, fn) {
    var a, j, len1;
    for (j = 0, len1 = as.length; j < len1; j++) {
      a = as[j];
      if (fn(a)) {
        return a;
      }
    }
  };

  UA = glob != null ? (ref = glob.navigator) != null ? ref.userAgent : void 0 : void 0;

  ref2 = (ref1 = /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(UA)) != null ? ref1 : [], isIE = ref2[0], IEVer = ref2[1];

  if (IEVer) {
    IEVer = parseInt(IEVer);
  }

  isChrome = UA.indexOf('Chrome') > 0;

  def = function(obj, props) {
    var name, results, value;
    results = [];
    for (name in props) {
      value = props[name];
      Object.defineProperty(obj, name, {
        enumerable: false,
        configurable: false,
        value: value
      });
      results.push(null);
    }
    return results;
  };

  zwnj = "​";

  filterA0 = function(s) {
    return s.replace(/\u00a0/g, ' ');
  };

  filterZwnj = function(s) {
    return s.replace(/\u200b/g, '');
  };

  filter = function(s) {
    return filterA0(filterZwnj(s));
  };

  appendAfter = function(el, node) {
    return el.parentNode.insertBefore(node, el.nextSibling);
  };

  appendBefore = function(el, node) {
    return el.parentNode.insertBefore(node, el);
  };

  hexdump = function(s) {
    var c;
    return ((function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = s.length; j < len1; j++) {
        c = s[j];
        results.push(c.charCodeAt(0).toString(16));
      }
      return results;
    })()).join(' ');
  };

  (function() {
    var css, styles;
    styles = ".ttbox * { box-sizing: border-box; width: auto; } .ttbox { position: relative; box-sizing: border-box; } .ttbox dfn { font-style: normal; display: inline-block; margin: 0; padding: 0; } .ttbox-overflow { /* border: 1px solid #bbb; */ /* border-radius: 3px; */ overflow-x: auto; overflow-y: hidden; } .ttbox-overflow::-webkit-scrollbar { display: none; } .ttbox-showing-suggest .ttbox-overflow { border-bottom-left-radius: 0; border-bottom-right-radius: 0; } .ttbox-input { padding-left: 4px; white-space: nowrap; outline: none; } .ttbox-input * { outline: none; } .ttbox-input * { display: inline-block; white-space: nowrap; } .ttbox-input br { display: inline; } .ttbox-sug-overflow { position: absolute; left: 0; /* border: 1px solid #bbb; */ /* border-radius: 3px; */ border-top: none; border-top-left-radius: 0; border-top-right-radius: 0; border-top: none; box-shadow: 0 2px 2px rgba(0,0,0,0.3); max-height: 300px; overflow-x: hidden; overflow-y: auto; } .ttbox-suggest { min-height: 5px; background: white; line-height: 38px; } .ttbox-suggest > .ttbox-suggest-item:first-child { padding-top: 5px; } .ttbox-suggest > .ttbox-suggest-item:last-child { padding-bottom: 5px; } .ttbox-suggest-item { cursor: pointer; padding: 0 10px 0 25px; white-space: nowrap; } .ttbox-suggest-item dfn { min-width: 70px; position: relative; } .ttbox-suggest-item span { color: #ccc; } .ttbox-suggest-divider { position: relative; padding: 0 10px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-suggest-divider span { position: relative; z-index: 1; background: white; color: #929292; padding-right: 20px; cursor: default; } .ttbox-suggest-divider hr { position: absolute; margin-top: 1.15em; left: 20px; right: 10px; border-top: 1px solid #ddd; border-bottom: none; } .ttbox-selected { background: #eee; } .ttbox-pill { position: relative; line-height: 24px; margin: 0 4px; background: #5cb85c; border: 1px solid #58b658; border-radius: 3px; padding: 0 12px; color: white; min-width: 30px; } .ttbox-pill dfn { padding: 0 3px 0 14px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; cursor: default; } .ttbox-pill-prefix dfn { padding-right: 0; display: block; } .ttbox-pill-close { display: inline-block; position: absolute; top: 0; left: 0; padding: 0 5px; line-height: 22px; height: 24px; border-right: 1px solid rgba(255,255,255,0.2); cursor: pointer; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-pill span { min-width: 5px; } .ttbox-placeholder { display: none; opacity: 0.4; position: absolute; top: 0; left: 5px; pointer-events: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; }";
    css = doc.createElement('style');
    css.type = 'text/css';
    css.innerHTML = styles;
    return doc.head.appendChild(css);
  })();

  Type = (function() {
    function Type(name1, opts) {
      this.name = name1;
      merge(this, {
        format: I
      }, opts);
    }

    return Type;

  })();

  Trigger = (function() {
    function Trigger(symbol1, opts, types) {
      var j, len1, ref3, t;
      this.symbol = symbol1;
      merge(this, opts);
      this.types = Array.isArray(types) ? types : [types];
      ref3 = this.types;
      for (j = 0, len1 = ref3.length; j < len1; j++) {
        t = ref3[j];
        t.trig = this;
      }
      if (this.prefix) {
        if (this.types.length > 1) {
          throw new Error("Cant have multiple types with prefix trigger");
        }
        this.re = RegExp("^()\\" + this.symbol + "(\\w*)$");
      } else {
        this.re = RegExp("^(\\w*)\\" + this.symbol + "(\\w*)$");
      }
    }

    return Trigger;

  })();

  skipZwnj = function(pel, d, end) {
    var c, i, n, r;
    if (!(r = cursor(pel))) {
      return;
    }
    n = end ? r.endContainer : r.startContainer;
    i = end ? r.endOffset : r.startOffset;
    if (n.nodeType !== 3) {
      return;
    }
    c = n.nodeValue.charCodeAt((d < 0 ? i + d : i));
    if (c === 8203) {
      setCursorPos(r, i + d);
      return skipZwnj(d, end);
    }
  };

  isParent = function(pn, n) {
    if (n === null) {
      return false;
    } else if (pn === n) {
      return true;
    } else {
      return isParent(pn, n.parentNode);
    }
  };

  cursor = function(pel) {
    var r, s;
    s = doc.getSelection();
    if (!s.rangeCount) {
      return;
    }
    r = s.getRangeAt(0);
    if (isParent(pel, r.startContainer)) {
      return r;
    } else {
      return null;
    }
  };

  rangeStr = function(r) {
    return filter(r.toString());
  };

  firstIsWhite = function(s) {
    return /^\s.*/.test(s != null ? s : '');
  };

  lastIsWhite = function(s) {
    return /.*\s$/.test(s != null ? s : '');
  };

  wordRangeAtCursor = function(pel) {
    var len, r, ref3, ref4, ref5, t;
    if (!(r = cursor(pel))) {
      return null;
    }
    t = r.cloneRange();
    while (t.startOffset > 0 && !firstIsWhite(rangeStr(t))) {
      t.setStart(t.startContainer, t.startOffset - 1);
    }
    if (firstIsWhite(rangeStr(t))) {
      t.setStart(t.startContainer, t.startOffset + 1);
    }
    len = (ref3 = (ref4 = t.endContainer) != null ? (ref5 = ref4.nodeValue) != null ? ref5.length : void 0 : void 0) != null ? ref3 : 0;
    while (t.endOffset < len && !lastIsWhite(rangeStr(t))) {
      t.setEnd(t.endContainer, t.endOffset + 1);
    }
    if (lastIsWhite(rangeStr(t))) {
      t.setEnd(t.endContainer, t.endOffset - 1);
    }
    return t;
  };

  entireTextAtCursor = function(pel) {
    var r, t;
    if (!(r = cursor(pel))) {
      return null;
    }
    t = r.cloneRange();
    t.selectNodeContents(t.startContainer);
    return t;
  };

  findInRange = function(r, char) {
    var i, j, max, ref3, ref4, ref5, ref6, ref7, t;
    t = r.cloneRange();
    max = ((ref3 = (ref4 = t.endContainer) != null ? (ref5 = ref4.nodeValue) != null ? ref5.length : void 0 : void 0) != null ? ref3 : 0) - 1;
    for (i = j = ref6 = t.startOffset, ref7 = max; j <= ref7; i = j += 1) {
      t.setStart(t.startContainer, i);
      t.setEnd(t.endContainer, i + 1);
      if (t.toString() === char) {
        return i;
      }
    }
    return -1;
  };

  setCursorPos = function(r, pos) {
    var sel, t;
    if (pos == null) {
      pos = 0;
    }
    t = doc.createRange();
    t.setStart(r.startContainer, pos);
    t.setEnd(r.startContainer, pos);
    sel = doc.getSelection();
    sel.removeAllRanges();
    return sel.addRange(t);
  };

  setCursorEl = function(el, pos) {
    var r, ref3;
    if (pos == null) {
      pos = 0;
    }
    r = doc.createRange();
    r.selectNodeContents(el);
    if (pos < 0) {
      pos = el != null ? (ref3 = el.nodeValue) != null ? ref3.length : void 0 : void 0;
    }
    return setCursorPos(r, pos);
  };

  ttbox = function() {
    var addpill, addtext, clear, dispatch, draw, el, façade, handlepill, handlers, handletypes, pilljump, prevvalues, render, setSugmover, stopsug, sugmover, sugselect, sugword, trigger, trigs, typesuggest, update;
    el = arguments[0], trigs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    render = ttbox.render();
    el = render.init(el);
    if (el.tagName !== 'DIV') {
      throw new Error('Need a DIV');
    }
    dispatch = function(name, opts) {
      var e;
      e = doc.createEvent('Event');
      merge(e, opts, {
        ttbox: façade
      });
      e.initEvent("ttbox:" + name, true, false);
      return el.dispatchEvent(e);
    };
    addpill = function(type, item) {
      var r, ref3;
      r = (ref3 = cursor(el)) != null ? ref3 : render.rangelast();
      return render.pillify(r, type, item, dispatch);
    };
    addtext = function(text) {
      var r, ref3;
      r = (ref3 = cursor(el)) != null ? ref3 : render.rangelast();
      r.insertNode(doc.createTextNode(text));
      render.tidy();
      return r;
    };
    clear = function() {
      render.clear();
      return update();
    };
    trigger = function(symbol) {
      var insert, r, str;
      render.tidy();
      render.focus();
      skipZwnj(el, 1);
      r = wordRangeAtCursor(el);
      str = rangeStr(r);
      insert = str === '' ? symbol : " " + symbol;
      cursor(el).insertNode(doc.createTextNode(insert));
      render.tidy();
      r = entireTextAtCursor(el);
      setCursorPos(r, r.endOffset - symbol.length);
      return update();
    };
    façade = {
      addpill: addpill,
      addtext: addtext,
      render: render,
      clear: clear,
      trigger: trigger,
      values: function() {
        return render.values();
      },
      setvalues: function(values) {
        clear();
        values.forEach(function(v) {
          if (typeof v === 'string') {
            return addtext(v);
          } else {
            return addpill(v.type, v.item);
          }
        });
        return update();
      },
      focus: function() {
        return render.focus();
      },
      placeholder: function(txt) {
        render.setPlaceholder(txt);
        return update();
      }
    };
    prevvalues = [];
    update = hold(3, function(char) {
      var _, r, ref3, trig, typename, types, value, values, word;
      values = render.values();
      render.togglePlaceholder(values.length === 0);
      if (!values.reduce((function(p, c, i) {
        return p && c === prevvalues[i];
      }), true)) {
        prevvalues = values;
        dispatch('change', {
          values: values
        });
      }
      if (handlepill()) {
        return;
      }
      r = wordRangeAtCursor(el);
      if (!r) {
        if (typeof stopsug === "function") {
          stopsug();
        }
        return;
      }
      word = rangeStr(r);
      trig = find(trigs, function(t) {
        return t.re.test(word);
      });
      if (!trig) {
        if (typeof stopsug === "function") {
          stopsug();
        }
        return;
      }
      ref3 = trig.re.exec(word), _ = ref3[0], typename = ref3[1], value = ref3[2];
      types = trig.types.filter(function(t) {
        var ref4;
        return trig.prefix || ((ref4 = t.name) != null ? ref4.indexOf(typename) : void 0) === 0;
      });
      return handletypes(r, trig, types, char);
    });
    sugselect = sugmover = sugword = null;
    setSugmover = function(_sugmover) {
      return sugmover = _sugmover;
    };
    stopsug = function() {
      sugselect = sugmover = sugword = null;
      render.unsuggest();
      return dispatch('suggeststop');
    };
    el.addEventListener('ttbox:pillremove', function() {
      stopsug();
      return update();
    });
    el.addEventListener('ttbox:pillfocusout', stopsug);
    handletypes = function(range, trig, types, char) {
      var selectType, tpos, trange, wastrig;
      tpos = findInRange(range, trig.symbol);
      if (tpos < 0) {
        return;
      }
      trange = range.cloneRange();
      trange.setEnd(trange.endContainer, tpos);
      wastrig = char === trig.symbol;
      selectType = function(type) {
        render.pillify(range, type, null, dispatch);
        update();
        return dispatch('suggesttypeselect', {
          trig: trig,
          type: type
        });
      };
      if (types.length === 0) {
        return stopsug();
      } else if (types.length === 1 && !sugmover) {
        if (wastrig) {
          return selectType(find(types, function(t) {
            return !t.divider;
          }));
        }
      } else {
        if (wastrig) {
          setCursorPos(range, tpos);
        }
        return typesuggest(trange, tpos, trig, selectType, types);
      }
    };
    typesuggest = function(range, tpos, trig, selectType, types) {
      var fntypes, sugselectfor, word;
      word = rangeStr(range);
      if (sugword === word) {
        return true;
      }
      sugword = word;
      sugselectfor = function(item) {
        return function() {
          stopsug();
          selectType(item);
          return true;
        };
      };
      fntypes = function(_, cb) {
        return cb(types);
      };
      if (types.length === 1) {
        sugselect = sugselectfor(types[0]);
      }
      render.suggest(fntypes, range, -1, setSugmover, function(type, doset) {
        sugselect = sugselectfor(type);
        if (doset) {
          sugselect();
        }
        return dispatch('suggesttype', {
          trig: trig,
          type: type
        });
      });
      return dispatch('suggesttypes', {
        trig: trig,
        types: types
      });
    };
    handlepill = function() {
      var fnvals, pill, r, ref3, ref4, selectItem, word;
      if (!(r = entireTextAtCursor(el))) {
        return;
      }
      if (!(pill = render.pillfor((ref3 = r.startContainer) != null ? ref3.parentNode : void 0))) {
        return;
      }
      if (typeof ((ref4 = pill.type) != null ? ref4.suggest : void 0) !== 'function') {
        return;
      }
      word = rangeStr(r);
      if (sugword === word) {
        return true;
      }
      sugword = word;
      fnvals = function(word, cb) {
        return pill.type.suggest(word, cb, pill.type, pill.trig);
      };
      selectItem = function(item) {
        pill.setItem(item);
        later(function() {
          return pill.setCursorAfter();
        });
        return dispatch('suggestitemselect', {
          pill: pill,
          item: item
        });
      };
      render.suggest(fnvals, r, -1, setSugmover, function(item, doset) {
        sugselect = function() {
          stopsug();
          selectItem(item);
          return true;
        };
        if (doset) {
          sugselect();
        }
        return dispatch('suggestitem', {
          pill: pill,
          item: item
        });
      });
      dispatch('suggestitems', {
        pill: pill
      });
      return true;
    };
    pilljump = function() {
      var pill, r, ref3;
      if (!(r = cursor(el))) {
        return;
      }
      if (!(pill = render.pillfor((ref3 = r.startContainer) != null ? ref3.parentNode : void 0))) {
        return;
      }
      stopsug();
      pill.setCursorAfter();
      return true;
    };
    handlers = {
      keydown: function(e) {
        var ref3, ref4;
        render.tidy();
        if (e.keyCode === 13) {
          e.preventDefault();
          if (typeof sugselect === "function" ? sugselect() : void 0) {
            e.stopPropagation();
            return;
          }
          if (pilljump()) {
            e.stopPropagation();
            return;
          }
        }
        if (sugmover) {
          if (e.keyCode === 38) {
            e.preventDefault();
            return sugmover(-1);
          } else if (e.keyCode === 40) {
            e.preventDefault();
            return sugmover(+1);
          }
        }
        if ((ref3 = e.keyCode) === 37 || ref3 === 8) {
          skipZwnj(el, -1, e.shiftKey);
        } else if ((ref4 = e.keyCode) === 39 || ref4 === 46) {
          skipZwnj(el, +1, e.shiftKey);
        }
        update();
        return later(function() {
          return render.tidy();
        });
      },
      keypress: function(e) {
        return update(String.fromCharCode(e.which));
      }
    };
    (draw = function() {
      render.draw(handlers);
      return render.tidy();
    })();
    later(function() {
      return dispatch('init');
    });
    return façade;
  };

  ttbox.trig = function(symbol, opts, types) {
    if (arguments.length === 2) {
      types = opts;
      opts = {};
    }
    return new Trigger(symbol, opts, types);
  };

  ttbox.divider = function(name, opts) {
    return new Type(name, merge({
      divider: true,
      html: function() {
        return "<div><hr><span>" + this.name + "</span></div>";
      }
    }, opts));
  };

  ttbox.type = function(name, opts, types) {
    return new Type(name, opts);
  };

  suggestHtml = function(word, prefix, name, suffix, desc) {
    var high, ref3, unhigh;
    if (desc == null) {
      desc = '';
    }
    if (!name) {
      return '<div></div>';
    }
    ref3 = name.indexOf(word) === 0 ? [word, name.slice(word.length)] : ["", name], high = ref3[0], unhigh = ref3[1];
    return "<div><dfn>" + prefix + "<b>" + high + "</b>" + unhigh + suffix + "</dfn> <span>" + desc + "</span></div>";
  };

  Type.prototype.html = function(word) {
    if (this.trig.prefix) {
      return suggestHtml(word, this.trig.symbol, this.name, "", this.desc);
    } else {
      return suggestHtml(word, "", this.name, this.trig.symbol, this.desc);
    }
  };

  toHtml = function(word) {
    return function(item) {
      if (typeof (item != null ? item.html : void 0) === 'function') {
        return item.html(word);
      } else if (typeof (item != null ? item.value : void 0) === 'string') {
        return suggestHtml(word, "", item.value, "", item.desc);
      } else {
        return suggestHtml(word, "", item, "");
      }
    };
  };

  toText = function(item) {
    if (item == null) {
      item = '';
    }
    if (typeof (item != null ? item.value : void 0) === 'string') {
      return item.value;
    } else {
      return String(item);
    }
  };

  def(ttbox, {
    jquery: function() {
      var $, $box, $el, ensureItems, html, pillfor, pills, suggest, tidy, tidypills, unsuggest;
      $ = null;
      $el = null;
      $box = function() {
        return $el.find('.ttbox');
      };
      html = '<div class="ttbox"><div class="ttbox-overflow">' + '<div class="ttbox-input" contenteditable="true"></div></div>' + '<div class="ttbox-placeholder"></div></div>';
      suggest = '<div class="ttbox-sug-overflow"><div class="ttbox-suggest"></div></div>';
      pills = {};
      tidypills = hold(5000, function() {
        var id, j, len1, present, ref3;
        present = $el.find('.ttbox-pill').map(function() {
          return $(this).attr('id');
        }).toArray();
        ref3 = Object.keys(pills);
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          id = ref3[j];
          if (present.indexOf(id) < 0) {
            delete pills[id];
          }
        }
        return null;
      });
      pillfor = function(el) {
        return pills[$(el).closest('.ttbox-pill').attr('id')];
      };
      ensureItems = function() {
        var k, pill;
        for (k in pills) {
          pill = pills[k];
          pill.ensureItem();
        }
        return null;
      };
      tidy = function() {
        var $inp, childs, cs, first, i, inp, isText, j, len1, n, paren, pill, r, ref3, ref4, ref5, ref6, tag;
        $inp = $el.find('.ttbox-input');
        inp = $inp[0];
        inp.normalize();
        tag = isIE ? 'i' : 'br';
        if (!$inp.children().last().is(tag)) {
          $inp.find("> " + tag).remove();
          $inp.append("<" + tag + ">");
        }
        childs = inp.childNodes;
        first = childs[0];
        if ((first != null ? first.nodeType : void 0) !== 3 || (first != null ? (ref3 = first.nodeValue) != null ? ref3[0] : void 0 : void 0) !== zwnj) {
          $inp[0].insertBefore(doc.createTextNode(zwnj), first);
        }
        for (j = 0, len1 = childs.length; j < len1; j++) {
          n = childs[j];
          if ((n != null ? n.nodeType : void 0) === 1 && (n != null ? (ref4 = n.nextSibling) != null ? ref4.nodeType : void 0 : void 0) === 1) {
            appendAfter(n, doc.createTextNode(zwnj));
          }
        }
        $el.find('.ttbox-pill span span').remove();
        inp.normalize();
        if (r = cursor($el[0])) {
          if (r.startContainer === inp || r.endContainer === inp) {
            cs = Array.prototype.slice.call(childs);
            isText = function(n) {
              if ((n != null ? n.nodeType : void 0) === 3) {
                return n;
              } else {
                return null;
              }
            };
            i = r.startOffset;
            n = (ref5 = (ref6 = isText(cs[i])) != null ? ref6 : isText(cs[i + 1])) != null ? ref5 : isText(cs[i - 1]);
            if (n) {
              setCursorEl(n);
            }
          }
          paren = r.startContainer.parentNode;
          if ((paren != null ? paren.nodeName : void 0) !== 'SPAN' && (pill = pillfor(paren))) {
            pill.setCursorIn();
          }
        }
        tidypills();
        return null;
      };
      return {
        init: function(el) {
          if (!($ = jQuery)) {
            throw new Error("Didn't find jQuery");
          }
          $el = $(el);
          return $el[0];
        },
        draw: function(handlers) {
          var event, handler, results;
          $el.html(html);
          results = [];
          for (event in handlers) {
            handler = handlers[event];
            results.push($el.on(event, handler));
          }
          return results;
        },
        clear: function() {
          $el.find('.ttbox-input').empty();
          return tidy();
        },
        focus: function() {
          var n, ns;
          if (cursor($el[0])) {
            return;
          }
          tidy();
          ns = $el.find('.ttbox-input')[0].childNodes;
          n = ns[ns.length - 2];
          return setCursorEl(n, -1);
        },
        values: function() {
          ensureItems();
          return Array.prototype.slice.call($el.find('.ttbox-input')[0].childNodes).map(function(n) {
            var ref3;
            if (n.nodeType === 1 && (n != null ? (ref3 = n.className) != null ? ref3.indexOf('ttbox-pill') : void 0 : void 0) >= 0) {
              return pillfor(n);
            } else if (n.nodeType === 3) {
              return filter(n.nodeValue);
            }
          }).filter(I);
        },
        unsuggest: unsuggest = function() {
          $('.ttbox-sug-overflow').remove();
          return $box().removeClass('ttbox-showing-suggest');
        },
        suggest: function(fn, range, idx, movecb, selectcb) {
          var $overflw, $sug, bord, word;
          word = rangeStr(range);
          $sug = $('.ttbox-suggest');
          if (!$sug.length) {
            $overflw = $(suggest);
            $sug = $overflw.find('.ttbox-suggest');
            $overflw.css('min-width', $box().outerWidth());
            bord = parseInt($el.find('.ttbox-overflow').css('border-bottom-width'));
            $overflw.css({
              top: $el.outerHeight() - bord
            });
            $box().append($overflw);
            $box().addClass('ttbox-showing-suggest');
          }
          $sug.html('');
          $sug.off();
          $box().addClass('ttbox-suggest-request');
          return fn(word, function(list) {
            var locToHtml, nodivid, previdx, selectIdx;
            $box().removeClass('ttbox-suggest-request');
            locToHtml = toHtml(word);
            list.forEach(function(l) {
              var $h;
              $h = $(locToHtml(l));
              $h.addClass(l.divider ? 'ttbox-suggest-divider' : 'ttbox-suggest-item');
              if (l.className) {
                $h.addClass(l.className);
              }
              return $sug.append($h);
            });
            nodivid = list.filter(function(l) {
              return !l.divider;
            });
            previdx = null;
            (selectIdx = function(dostart) {
              var $sel, ref3;
              if (idx < 0 && !dostart) {
                return;
              }
              if (idx < 0) {
                idx = 0;
              }
              if (idx >= nodivid.length) {
                idx = nodivid.length - 1;
              }
              if (previdx === idx) {
                return;
              }
              previdx = idx;
              $sug.find('.ttbox-selected').removeClass('ttbox-selected');
              $sel = $sug.children('.ttbox-suggest-item').eq(idx);
              $sel.addClass('ttbox-selected');
              if ((ref3 = $sel[0]) != null) {
                ref3.scrollIntoView();
              }
              return selectcb(nodivid[idx]);
            })(false);
            $sug.on('mousedown', function(ev) {
              var $it, i;
              ev.stopPropagation();
              ev.preventDefault();
              $it = $(ev.target).closest('.ttbox-suggest-item');
              if (!$it.length) {
                return;
              }
              i = $sug.children('.ttbox-suggest-item').index($it);
              if (!(i >= 0)) {
                return;
              }
              return selectcb(nodivid[i], true);
            });
            return movecb(function(offs) {
              if (!offs) {
                return;
              }
              idx = idx + offs;
              return selectIdx(true);
            });
          });
        },
        pillify: function(range, type, item, dispatch) {
          var $pill, $span, dfn, format, id, pill, remove, scrollIn, trig;
          trig = type.trig;
          dfn = trig ? trig.prefix ? trig.symbol : type.name + trig.symbol : type.name;
          $pill = $("<div class=\"ttbox-pill\"><div class=\"ttbox-pill-close\">×</div>" + ("<dfn>" + dfn + "</dfn><span></span></div>"));
          $pill.find('*').andSelf().prop('contenteditable', 'false');
          ($span = $pill.find('span')).prop('contenteditable', 'true');
          if (type.trig.prefix) {
            $pill.addClass('ttbox-pill-prefix');
          }
          if (type.trig.className) {
            $pill.addClass(type.trig.className);
          }
          if (type.className) {
            $pill.addClass(type.className);
          }
          id = "ttboxpill" + (Date.now());
          $pill.attr('id', id);
          range.deleteContents();
          range.insertNode($pill[0]);
          remove = function() {
            $pill.remove();
            return dispatch('pillremove', {
              pill: pill
            });
          };
          $pill.find('.ttbox-pill-close').on('click', remove);
          format = function() {
            return $span.text(type.format($span.text()));
          };
          $pill.on('focusout', function() {
            var ref3;
            pill.ensureItem();
            if ((ref3 = pill.item) != null ? ref3._text : void 0) {
              format();
            }
            return dispatch('pillfocusout', {
              pill: pill
            });
          });
          scrollIn = function() {
            var $t;
            $pill.after($t = $('<span style="width:1px">'));
            $t[0].scrollIntoView();
            return $t.remove();
          };
          if (isIE) {
            $pill.on('mousedown', function(e) {
              e.preventDefault();
              pill.setCursorIn();
              return false;
            });
          }
          pill = pills[id] = {
            id: id,
            trig: trig,
            type: type,
            remove: remove,
            setItem: function(item1) {
              this.item = item1;
              return $span.text(toText(this.item));
            },
            setCursorIn: function() {
              scrollIn();
              return setCursorEl($span[0]);
            },
            setCursorAfter: function() {
              var ref3, sib;
              scrollIn();
              sib = (ref3 = $pill[0]) != null ? ref3.nextSibling : void 0;
              if (sib) {
                setCursorEl(sib);
              }
              return skipZwnj($el[0], +1);
            }
          };
          def(pill, {
            ensureItem: function() {
              var ptxt, stxt;
              stxt = $span.text().trim();
              ptxt = toText(pill != null ? pill.item : void 0);
              if (stxt !== ptxt) {
                return pill.item = {
                  value: stxt,
                  _text: true
                };
              }
            }
          });
          scrollIn();
          tidy();
          if (item) {
            pill.setItem(item);
          } else {
            later(function() {
              return pill.setCursorIn();
            });
          }
          dispatch('pilladd', {
            pill: pill
          });
          return pill;
        },
        pillfor: pillfor,
        tidy: tidy,
        rangelast: function() {
          var n, ns, r;
          tidy();
          ns = $el.find('.ttbox-input')[0].childNodes;
          n = ns[ns.length - 2];
          r = doc.createRange();
          r.setStart(n, n.nodeValue.length);
          r.setEnd(n, n.nodeValue.length);
          return r;
        },
        setPlaceholder: function(txt) {
          return $el.find('.ttbox-placeholder').text(txt);
        },
        togglePlaceholder: function(show) {
          return $el.find('.ttbox-placeholder').toggle(show && (!isIE || IEVer >= 11));
        }
      };
    }
  });

  def(ttbox, {
    render: ttbox.jquery
  });

  if (typeof module === 'object') {
    module.exports = ttbox;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return ttbox;
    });
  } else {
    this.ttbox = ttbox;
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,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QSxHQUFJLEdBQUcsQ0FBQyxXQUFKLENBQUE7VUFDSixDQUFDLENBQUMsUUFBRixDQUFXLENBQVgsRUFBYyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQTFCO1VBQ0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUF4QjtBQUNBLGlCQUFPO1FBUEEsQ0FuTVg7UUE0TUEsY0FBQSxFQUFnQixTQUFDLEdBQUQ7aUJBQ1osR0FBRyxDQUFDLElBQUosQ0FBUyxvQkFBVCxDQUE4QixDQUFDLElBQS9CLENBQW9DLEdBQXBDO1FBRFksQ0E1TWhCO1FBK01BLGlCQUFBLEVBQW1CLFNBQUMsSUFBRDtpQkFDZixHQUFHLENBQUMsSUFBSixDQUFTLG9CQUFULENBQThCLENBQUMsTUFBL0IsQ0FBc0MsSUFBQSxJQUFTLENBQUMsQ0FBQyxJQUFELElBQVMsS0FBQSxJQUFTLEVBQW5CLENBQS9DO1FBRGUsQ0EvTW5COztJQW5FZSxDQUFSO0dBQVg7O0VBc1JBLEdBQUEsQ0FBSSxLQUFKLEVBQVc7SUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQWQ7R0FBWDs7RUFHQSxJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFwQjtJQUNJLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BRHJCO0dBQUEsTUFFSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixVQUFqQixJQUFnQyxNQUFNLENBQUMsR0FBMUM7SUFDRCxNQUFBLENBQU8sU0FBQTthQUFHO0lBQUgsQ0FBUCxFQURDO0dBQUEsTUFBQTtJQUdELElBQUksQ0FBQyxLQUFMLEdBQWEsTUFIWjs7QUFsNUJMIiwiZmlsZSI6InR0Ym94LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZ2xvYiA9IGdsb2JhbCA/IHdpbmRvd1xuXG5kb2MgICA9IGdsb2IuZG9jdW1lbnRcbkkgICAgID0gKGEpIC0+IGFcbm1lcmdlID0gKHQsIG9zLi4uKSAtPiB0W2tdID0gdiBmb3Igayx2IG9mIG8gd2hlbiB2ICE9IHVuZGVmaW5lZCBmb3IgbyBpbiBvczsgdFxubGF0ZXIgPSAoZm4pIC0+IHNldFRpbWVvdXQgZm4sIDFcbmhvbGQgID0gKG1zLCBmKSAtPiBsYXN0ID0gMDsgdGltID0gbnVsbDsgKGFzLi4uKSAtPlxuICAgIGNsZWFyVGltZW91dCB0aW0gaWYgdGltXG4gICAgdGltID0gc2V0VGltZW91dCAoLT5mIGFzLi4uKSwgbXNcbmxhc3QgID0gKGFzKSAtPiBhcz9bYXMubGVuZ3RoIC0gMV1cbmZpbmQgID0gKGFzLCBmbikgLT4gcmV0dXJuIGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKVxuXG5VQSA9IGdsb2I/Lm5hdmlnYXRvcj8udXNlckFnZW50XG5baXNJRSwgSUVWZXJdID0gL01TSUUgKFswLTldezEsfVsuMC05XXswLH0pLy5leGVjKFVBKSA/IFtdXG5JRVZlciA9IHBhcnNlSW50IElFVmVyIGlmIElFVmVyXG5pc0Nocm9tZSAgPSBVQS5pbmRleE9mKCdDaHJvbWUnKSA+IDBcblxuIyBkZWZpbmUgYW4gaW52aXNpYmxlIHByb3BlcnR5XG5kZWYgPSAob2JqLCBwcm9wcykgLT4gZm9yIG5hbWUsIHZhbHVlIG9mIHByb3BzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iaiwgbmFtZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICBudWxsXG5cbnp3bmogICAgICAgICA9IFwi4oCLXCIgIyAmenduajtcbmZpbHRlckEwICAgICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTAwYTAvZywgJyAnICMgbmJzcFxuZmlsdGVyWnduaiAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MjAwYi9nLCAnJ1xuZmlsdGVyICAgICAgID0gKHMpIC0+IGZpbHRlckEwIGZpbHRlclp3bmogc1xuYXBwZW5kQWZ0ZXIgID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbC5uZXh0U2libGluZylcbmFwcGVuZEJlZm9yZSA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwpXG5oZXhkdW1wICAgICAgPSAocykgLT4gKGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikgZm9yIGMgaW4gcykuam9pbignICcpXG5cbiMgaW5qZWN0IGNzc1xuZG8gLT5cbiAgICBzdHlsZXMgPSBcIlxuLnR0Ym94ICoge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgd2lkdGg6IGF1dG87XG59XG5cbi50dGJveCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG4udHRib3ggZGZuIHtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG4udHRib3gtb3ZlcmZsb3cge1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7ICovXG4gICAgLyogYm9yZGVyLXJhZGl1czogM3B4OyAqL1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuLnR0Ym94LW92ZXJmbG93Ojotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgZGlzcGxheTogbm9uZTtcbn1cbi50dGJveC1zaG93aW5nLXN1Z2dlc3QgLnR0Ym94LW92ZXJmbG93IHtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xufVxuXG4udHRib3gtaW5wdXQge1xuICAgIHBhZGRpbmctbGVmdDogNHB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cbi50dGJveC1pbnB1dCAqIHtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuXG4udHRib3gtaW5wdXQgKiB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4udHRib3gtaW5wdXQgYnIge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbn1cblxuLnR0Ym94LXN1Zy1vdmVyZmxvdyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm94LXNoYWRvdzogMCAycHggMnB4IHJnYmEoMCwwLDAsMC4zKTtcbiAgICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi50dGJveC1zdWdnZXN0IHtcbiAgICBtaW4taGVpZ2h0OiA1cHg7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgbGluZS1oZWlnaHQ6IDM4cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06Zmlyc3QtY2hpbGQge1xuICAgIHBhZGRpbmctdG9wOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06bGFzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0ge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBwYWRkaW5nOiAwIDEwcHggMCAyNXB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIGRmbiB7XG4gICAgbWluLXdpZHRoOiA3MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gc3BhbiB7XG4gICAgY29sb3I6ICNjY2M7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHNwYW4ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGNvbG9yOiAjOTI5MjkyO1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBociB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG1hcmdpbi10b3A6IDEuMTVlbTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4udHRib3gtc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi50dGJveC1waWxsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gICAgbWFyZ2luOiAwIDRweDtcbiAgICBiYWNrZ3JvdW5kOiAjNWNiODVjO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICM1OGI2NTg7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWluLXdpZHRoOiAzMHB4O1xufVxuLnR0Ym94LXBpbGwgZGZuIHtcbiAgICBwYWRkaW5nOiAwIDNweCAwIDE0cHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtcGlsbC1wcmVmaXggZGZuIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuLnR0Ym94LXBpbGwtY2xvc2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcGFkZGluZzogMCA1cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1waWxsIHNwYW4ge1xuICAgIG1pbi13aWR0aDogNXB4O1xufVxuXG4udHRib3gtcGxhY2Vob2xkZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgb3BhY2l0eTogMC40O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogNXB4O1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cIlxuICAgIGNzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY3NzLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgY3NzLmlubmVySFRNTCA9IHN0eWxlc1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkIGNzc1xuXG5jbGFzcyBUeXBlIHRoZW4gY29uc3RydWN0b3I6IChAbmFtZSwgb3B0cykgLT4gbWVyZ2UgQCwge2Zvcm1hdDpJfSwgb3B0c1xuY2xhc3MgVHJpZ2dlciB0aGVuIGNvbnN0cnVjdG9yOiAoQHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgbWVyZ2UgQCwgb3B0c1xuICAgIEB0eXBlcyA9IGlmIEFycmF5LmlzQXJyYXkgdHlwZXMgdGhlbiB0eXBlcyBlbHNlIFt0eXBlc11cbiAgICAjIHNldCBiYWNrIHJlZmVyZW5jZVxuICAgIHQudHJpZyA9IHRoaXMgZm9yIHQgaW4gQHR5cGVzXG4gICAgaWYgQHByZWZpeFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW50IGhhdmUgbXVsdGlwbGUgdHlwZXMgd2l0aCBwcmVmaXggdHJpZ2dlclwiKSBpZiBAdHlwZXMubGVuZ3RoID4gMVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKClcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG4gICAgZWxzZVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKFxcXFx3KilcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG5cbiMgU2tpcCB6d25qIGNoYXJzIHdoZW4gbW92aW5nIGxlZnQvcmlnaHRcbnNraXBad25qID0gKHBlbCwgZCwgZW5kKSAtPlxuICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgbiA9IGlmIGVuZCB0aGVuIHIuZW5kQ29udGFpbmVyIGVsc2Ugci5zdGFydENvbnRhaW5lclxuICAgIGkgPSBpZiBlbmQgdGhlbiByLmVuZE9mZnNldCBlbHNlIHIuc3RhcnRPZmZzZXRcbiAgICByZXR1cm4gdW5sZXNzIG4ubm9kZVR5cGUgPT0gM1xuICAgIGMgPSBuLm5vZGVWYWx1ZS5jaGFyQ29kZUF0IChpZiBkIDwgMCB0aGVuIGkgKyBkIGVsc2UgaSlcbiAgICBpZiBjID09IDgyMDNcbiAgICAgICAgIyBtb3ZlXG4gICAgICAgIHNldEN1cnNvclBvcyByLCBpICsgZFxuICAgICAgICBza2lwWnduaiBkLCBlbmQgIyBhbmQgbWF5YmUgY29udGludWUgbW92aW5nP1xuXG5pc1BhcmVudCA9IChwbiwgbikgLT5cbiAgICBpZiBuID09IG51bGwgdGhlbiBmYWxzZSBlbHNlIGlmIHBuID09IG4gdGhlbiB0cnVlIGVsc2UgaXNQYXJlbnQocG4sIG4ucGFyZW50Tm9kZSlcblxuIyBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuY3Vyc29yID0gKHBlbCkgLT5cbiAgICBzID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgcmV0dXJuIHVubGVzcyBzLnJhbmdlQ291bnRcbiAgICByID0gcy5nZXRSYW5nZUF0KDApXG4gICAgaWYgaXNQYXJlbnQocGVsLCByLnN0YXJ0Q29udGFpbmVyKSB0aGVuIHIgZWxzZSBudWxsXG5cbiMgZmlsdGVyIHRoZSByYW5nZSB0byBnZXQgcmlkIG9mIHVud2FudGVkIGNoYXJzXG5yYW5nZVN0ciA9IChyKSAtPiBmaWx0ZXIgci50b1N0cmluZygpXG5cbmZpcnN0SXNXaGl0ZSA9IChzKSAtPiAvXlxccy4qLy50ZXN0KHMgPyAnJylcbmxhc3RJc1doaXRlICA9IChzKSAtPiAvLipcXHMkLy50ZXN0KHMgPyAnJylcblxud29yZFJhbmdlQXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICAjIGV4cGFuZCBiZWdpbm5pbmdcbiAgICB3aGlsZSB0LnN0YXJ0T2Zmc2V0ID4gMCBhbmQgbm90IGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCAtIDFcbiAgICAjIG9uZSBmb3J3YXJkIGFnYWluXG4gICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0ICsgMSBpZiBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICMgZXhwYW5kIGVuZFxuICAgIGxlbiA9IHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDBcbiAgICB3aGlsZSB0LmVuZE9mZnNldCA8IGxlbiBhbmQgbm90IGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0ICsgMVxuICAgICMgb25lIGJhY2sgYWdhaW5cbiAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgLSAxIGlmIGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICByZXR1cm4gdFxuXG5lbnRpcmVUZXh0QXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICB0LnNlbGVjdE5vZGVDb250ZW50cyB0LnN0YXJ0Q29udGFpbmVyXG4gICAgcmV0dXJuIHRcblxuZmluZEluUmFuZ2UgPSAociwgY2hhcikgLT5cbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICBtYXggPSAodC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMCkgLSAxXG4gICAgZm9yIGkgaW4gW3Quc3RhcnRPZmZzZXQuLm1heF0gYnkgMVxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIGlcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIGkgKyAxXG4gICAgICAgIHJldHVybiBpIGlmIHQudG9TdHJpbmcoKSA9PSBjaGFyXG4gICAgcmV0dXJuIC0xXG5cbnNldEN1cnNvclBvcyA9IChyLCBwb3MgPSAwKSAtPlxuICAgIHQgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHQuc2V0U3RhcnQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgdC5zZXRFbmQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgc2VsID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgc2VsLmFkZFJhbmdlIHRcblxuc2V0Q3Vyc29yRWwgPSAoZWwsIHBvcyA9IDApIC0+XG4gICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgci5zZWxlY3ROb2RlQ29udGVudHMgZWxcbiAgICBwb3MgPSBlbD8ubm9kZVZhbHVlPy5sZW5ndGggaWYgcG9zIDwgMFxuICAgIHNldEN1cnNvclBvcyByLCBwb3NcblxuIyBGdW5jdGlvbiB0byBtYWtlIHR0Ym94IG91dCBvZiBhbiBlbGVtZW50IHdpdGggdHJpZ2dlcnNcbiNcbnR0Ym94ID0gKGVsLCB0cmlncy4uLikgLT5cblxuICAgICMgbG9jYWwgcmVmZXJlbmNlIHRvIHJlbmRlciBwbHVnXG4gICAgcmVuZGVyID0gdHRib3gucmVuZGVyKClcblxuICAgICMgbGV0IHJlbmRlciBkZWNpZGUgd2UgaGF2ZSBhIGdvb2QgZWxcbiAgICBlbCA9IHJlbmRlci5pbml0KGVsKVxuXG4gICAgIyBhbmQgY2hlY2sgd2UgZ290IGEgZ29vZCB0aGluZyBiYWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgRElWJykgdW5sZXNzIGVsLnRhZ05hbWUgPT0gJ0RJVidcblxuICAgICMgZGlzcGF0Y2ggZXZlbnRzIG9uIGluY29taW5nIGRpdlxuICAgIGRpc3BhdGNoID0gKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQgJ0V2ZW50J1xuICAgICAgICBtZXJnZSBlLCBvcHRzLCB7dHRib3g6ZmHDp2FkZX1cbiAgICAgICAgZS5pbml0RXZlbnQgXCJ0dGJveDoje25hbWV9XCIsIHRydWUsIGZhbHNlXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQgZVxuXG4gICAgIyBhZGQgYSBuZXcgcGlsbCB0byBpbnB1dFxuICAgIGFkZHBpbGwgPSAodHlwZSwgaXRlbSkgLT5cbiAgICAgICAgIyBlaXRoZXIgdXNlIGN1cnNvciBwb3NpdGlvbiwgb3IgdGhlIGxhc3QgY2hpbGQgZWxlbWVudFxuICAgICAgICByID0gY3Vyc29yKGVsKSA/IHJlbmRlci5yYW5nZWxhc3QoKVxuICAgICAgICAjIGltcGxpY2l0bHkgZG9lcyB0aWR5XG4gICAgICAgIHJldHVybiByZW5kZXIucGlsbGlmeSByLCB0eXBlLCBpdGVtLCBkaXNwYXRjaFxuICAgIGFkZHRleHQgPSAodGV4dCkgLT5cbiAgICAgICAgIyBlaXRoZXIgdXNlIGN1cnNvciBwb3NpdGlvbiwgb3IgdGhlIGxhc3QgY2hpbGQgZWxlbWVudFxuICAgICAgICByID0gY3Vyc29yKGVsKSA/IHJlbmRlci5yYW5nZWxhc3QoKVxuICAgICAgICByLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlKHRleHQpXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgcmV0dXJuIHJcbiAgICBjbGVhciA9IC0+XG4gICAgICAgIHJlbmRlci5jbGVhcigpXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgdHJpZ2dlciA9IChzeW1ib2wpIC0+XG4gICAgICAgICMgbWFrZSBzdXJlIGNvbnRpZ3VvdXMgdGV4dCBub2Rlc1xuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgIHJlbmRlci5mb2N1cygpICMgZW5zdXJlIHdlIGhhdmUgZm9jdXNcbiAgICAgICAgIyB3ZSB3YW50IHRvIGJlIHRvIHRoZSByaWdodCBvZiBhbnkgendualxuICAgICAgICAjIGluIHRoZSBjdXJyZW50IHRleHQgYmxvY2tcbiAgICAgICAgc2tpcFp3bmogZWwsIDFcbiAgICAgICAgIyBnZXQgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICByID0gd29yZFJhbmdlQXRDdXJzb3IoZWwpXG4gICAgICAgIHN0ciA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgaW5zZXJ0IHNwYWNlIGlmIHdlIGhhdmUgY29udGVudCBiZWZvcmVoYW5kXG4gICAgICAgIGluc2VydCA9IGlmIHN0ciA9PSAnJyB0aGVuIHN5bWJvbCBlbHNlIFwiICN7c3ltYm9sfVwiXG4gICAgICAgIGN1cnNvcihlbCkuaW5zZXJ0Tm9kZSBkb2MuY3JlYXRlVGV4dE5vZGUgaW5zZXJ0XG4gICAgICAgICMgbWFrZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICAjIHBvc2l0aW9uIGF0IHRoZSB2ZXJ5IGVuZCBvZiB0aGlzXG4gICAgICAgIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHNldEN1cnNvclBvcyByLCByLmVuZE9mZnNldCAtIHN5bWJvbC5sZW5ndGhcbiAgICAgICAgIyB0cmlnZ2VyIHN1Z2dlc3RcbiAgICAgICAgdXBkYXRlKClcblxuICAgICMgZXhwb3NlZCBvcGVyYXRpb25zXG4gICAgZmHDp2FkZSA9IHtcbiAgICAgICAgYWRkcGlsbCwgYWRkdGV4dCwgcmVuZGVyLCBjbGVhciwgdHJpZ2dlclxuICAgICAgICB2YWx1ZXM6IC0+IHJlbmRlci52YWx1ZXMoKVxuICAgICAgICBzZXR2YWx1ZXM6ICh2YWx1ZXMpIC0+XG4gICAgICAgICAgICBjbGVhcigpXG4gICAgICAgICAgICB2YWx1ZXMuZm9yRWFjaCAodikgLT5cbiAgICAgICAgICAgICAgICBpZiB0eXBlb2YgdiA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICBhZGR0ZXh0IHZcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFkZHBpbGwgdi50eXBlLCB2Lml0ZW1cbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIGZvY3VzOiAtPiByZW5kZXIuZm9jdXMoKVxuICAgICAgICBwbGFjZWhvbGRlcjogKHR4dCkgLT5cbiAgICAgICAgICAgIHJlbmRlci5zZXRQbGFjZWhvbGRlcih0eHQpXG4gICAgICAgICAgICB1cGRhdGUoKSAjIHRvZ2dsZSBwbGFjZWhvbGRlclxuICAgIH1cblxuICAgIHByZXZ2YWx1ZXMgPSBbXVxuXG4gICAgdXBkYXRlID0gaG9sZCAzLCAoY2hhcikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcmVuZGVyLnZhbHVlcygpXG4gICAgICAgICMgc2hvdyBwbGFjZWhvbGRlciBpZiBpdCdzIGVtcHR5XG4gICAgICAgIHJlbmRlci50b2dnbGVQbGFjZWhvbGRlciB2YWx1ZXMubGVuZ3RoID09IDBcbiAgICAgICAgdW5sZXNzIHZhbHVlcy5yZWR1Y2UgKChwLCBjLCBpKSAtPiBwIGFuZCBjID09IHByZXZ2YWx1ZXNbaV0pLCB0cnVlXG4gICAgICAgICAgICBwcmV2dmFsdWVzID0gdmFsdWVzXG4gICAgICAgICAgICBkaXNwYXRjaCAnY2hhbmdlJywge3ZhbHVlc31cbiAgICAgICAgIyBhIHBpbGwgZWRpdCB0cnVtZnMgYWxsXG4gICAgICAgIHJldHVybiBpZiBoYW5kbGVwaWxsKClcbiAgICAgICAgIyBjdXJzb3IgcmFuZ2UgZm9yIHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICAjIFhYWCBvcHRpbWl6ZSB3aXRoIGJlbG93P1xuICAgICAgICB1bmxlc3MgclxuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGEgdHJpZ2dlciBpbiB0aGUgd29yZD9cbiAgICAgICAgdHJpZyA9IGZpbmQgdHJpZ3MsICh0KSAtPiB0LnJlLnRlc3Qgd29yZFxuICAgICAgICAjIG5vIHRyaWdnZXIgZm91bmQgaW4gY3VycmVudCB3b3JkLCBhYm9ydFxuICAgICAgICB1bmxlc3MgdHJpZ1xuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICMgZXhlYyB0cmlnZ2VyIHRvIGdldCBwYXJ0c1xuICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICMgZmluZCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICB0eXBlcyA9IHRyaWcudHlwZXMuZmlsdGVyICh0KSAtPiB0cmlnLnByZWZpeCBvciB0Lm5hbWU/LmluZGV4T2YodHlwZW5hbWUpID09IDBcbiAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgaGFuZGxldHlwZXMgciwgdHJpZywgdHlwZXMsIGNoYXJcblxuICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICBzZXRTdWdtb3ZlciA9IChfc3VnbW92ZXIpIC0+IHN1Z21vdmVyID0gX3N1Z21vdmVyXG4gICAgc3RvcHN1ZyA9IC0+XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICAgICAgcmVuZGVyLnVuc3VnZ2VzdCgpXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0c3RvcCdcblxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGxzIGxlYXZlXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbHJlbW92ZScsIC0+XG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICB1cGRhdGUoKSAjIHRyaWdnZXIgdmFsdWUtY2hhbmdlXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbCBsb3NlIGZvY3VzXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbGZvY3Vzb3V0Jywgc3RvcHN1Z1xuXG4gICAgaGFuZGxldHlwZXMgPSAocmFuZ2UsIHRyaWcsIHR5cGVzLCBjaGFyKSAtPlxuICAgICAgICAjIHRoZSB0cmlnZ2VyIHBvc2l0aW9uIGluIHRoZSB3b3JkIHJhbmdlXG4gICAgICAgIHRwb3MgPSBmaW5kSW5SYW5nZSByYW5nZSwgdHJpZy5zeW1ib2xcbiAgICAgICAgIyBubyB0cG9zPyFcbiAgICAgICAgcmV0dXJuIGlmIHRwb3MgPCAwXG4gICAgICAgICMgcmFuZ2UgZm9yIHR5cGUgbmFtZSAod2hpY2ggbWF5IG5vdCBiZSB0aGUgZW50aXJlIG5hbWUpXG4gICAgICAgIHRyYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKVxuICAgICAgICB0cmFuZ2Uuc2V0RW5kIHRyYW5nZS5lbmRDb250YWluZXIsIHRwb3NcbiAgICAgICAgIyB3aGV0aGVyIHRoZSBsYXN0IGlucHV0IHdhcyB0aGUgdHJpZ2dlclxuICAgICAgICB3YXN0cmlnID0gY2hhciA9PSB0cmlnLnN5bWJvbFxuICAgICAgICAjIGhlbHBlciB3aGVuIGZpbmlzaGVkIHNlbGVjdGluZyBhIHR5cGVcbiAgICAgICAgc2VsZWN0VHlwZSA9ICh0eXBlKSAtPlxuICAgICAgICAgICAgcmVuZGVyLnBpbGxpZnkgcmFuZ2UsIHR5cGUsIG51bGwsIGRpc3BhdGNoXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlc2VsZWN0Jywge3RyaWcsIHR5cGV9XG4gICAgICAgIGlmIHR5cGVzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgZWxzZSBpZiB0eXBlcy5sZW5ndGggPT0gMSBhbmQgbm90IHN1Z21vdmVyXG4gICAgICAgICAgICAjIG9uZSBwb3NzaWJsZSBzb2x1dGlvblxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgZm9yIHRyaWdnZXIgY2hhciwgd2Ugc2VsZWN0IHRoZSBmaXJzdCB0eXBlIHN0cmFpZ2h0IGF3YXlcbiAgICAgICAgICAgICAgICBzZWxlY3RUeXBlIGZpbmQgdHlwZXMsICh0KSAtPiAhdC5kaXZpZGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgd2hlbiB0aGUga2V5IGlucHV0IHdhcyB0aGUgdHJpZ2dlciBhbmQgdGhlcmUgYXJlXG4gICAgICAgICAgICAjIG11bHRpcGxlIHBvc3NpYmxlIHZhbHVlcywgcG9zaXRpb24uIG1vdmUgdG8ganVzdCBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIHRyaWdnZXIgY2hhci5cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIG1vdmUgdGhlIGN1cnNvciB0byBhbGxvdyBmb3Igc3VnZ2VzdCBpbnB1dFxuICAgICAgICAgICAgICAgIHNldEN1cnNvclBvcyByYW5nZSwgdHBvc1xuICAgICAgICAgICAgIyBzdGFydCBhIHN1Z2dlc3QgZm9yIGN1cnJlbnQgcG9zc2libGUgdHlwZXNcbiAgICAgICAgICAgIHR5cGVzdWdnZXN0IHRyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXNcblxuXG4gICAgIyBzdWdnZXN0IGZvciBnaXZlbiB0eXBlc1xuICAgIHR5cGVzdWdnZXN0ID0gKHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlcykgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBoZWxwZXIgdG8gY3JlYXRlIHN1Z3NlbGVjdCBmdW5jdGlvbnNcbiAgICAgICAgc3Vnc2VsZWN0Zm9yID0gKGl0ZW0pIC0+IC0+XG4gICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAjIHRoZSB0eXBlIGlzIHNlbGVjdGVkXG4gICAgICAgICAgICBzZWxlY3RUeXBlIGl0ZW1cbiAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAjIGZ1bmN0aW9uIHRoYXQgc3VnZ2VzdCB0eXBlc1xuICAgICAgICBmbnR5cGVzID0gKF8sIGNiKSAtPiBjYiB0eXBlc1xuICAgICAgICAjIGlmIHRoZXJlIGlzIG9ubHkgb25lLCBzZXQgaXQgYXMgcG9zc2libGUgZm9yIHJldHVybiBrZXlcbiAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIHR5cGVzWzBdIGlmIHR5cGVzLmxlbmd0aCA9PSAxXG4gICAgICAgICMgcmVuZGVyIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudHlwZXMsIHJhbmdlLCAtMSwgc2V0U3VnbW92ZXIsICh0eXBlLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlJywge3RyaWcsIHR5cGV9XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlcycsIHt0cmlnLCB0eXBlc31cblxuICAgIGhhbmRsZXBpbGwgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHJldHVybiB1bmxlc3MgdHlwZW9mIHBpbGwudHlwZT8uc3VnZ2VzdCA9PSAnZnVuY3Rpb24nICMgZGVmaW5pdGVseSBhIHN1Z2dlc3RcbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIHN1Z2dlc3QgZnVuY3Rpb24gYXMgZm4gdG8gcmVuZGVyLnN1Z2dlc3RcbiAgICAgICAgZm52YWxzID0gKHdvcmQsIGNiKSAtPiBwaWxsLnR5cGUuc3VnZ2VzdCB3b3JkLCBjYiwgcGlsbC50eXBlLCBwaWxsLnRyaWdcbiAgICAgICAgIyBoZWxwZXIgd2hlbiB3ZSBkZWNpZGUgb24gYW4gaXRlbVxuICAgICAgICBzZWxlY3RJdGVtID0gKGl0ZW0pIC0+XG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICAgICAgIyBsYXRlciBzaW5jZSBpdCBtYXkgYmUgc2VsZWN0IGZyb20gY2xpY2ssIHdoaWNoIGlzIG1vdXNlZG93blxuICAgICAgICAgICAgbGF0ZXIgLT4gcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zZWxlY3QnLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm52YWxzLCByLCAtMSwgc2V0U3VnbW92ZXIsIChpdGVtLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IC0+XG4gICAgICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICAgICAjIHNlbGVjdCB0aGUgaXRlbVxuICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0gaXRlbVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbScsIHtwaWxsLCBpdGVtfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkIGFib3V0IGl0XG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXMnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHRydWUgIyBzaWduYWwgd2UgZGVhbHQgd2l0aCBpdFxuXG4gICAgIyBtb3ZlIHRoZSBpbnB1dCBvdXQgb2YgYSBwaWxsIChpZiB3ZSdyZSBpbiBhIHBpbGwpXG4gICAgcGlsbGp1bXAgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgaGFuZGxlcnMgPVxuICAgICAgICBrZXlkb3duOiAgKGUpIC0+XG5cbiAgICAgICAgICAgICMgdGhpcyBkb2VzIGFuIGltcG9ydGFudCBlbC5ub3JtYWxpemUoKSB0aGF0IGVuc3VyZXMgd2UgaGF2ZVxuICAgICAgICAgICAgIyBjb250aWd1b3VzIHRleHQgbm9kZXMsIGNydWNpYWwgZm9yIHRoZSByYW5nZSBsb2dpYy5cbiAgICAgICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDEzXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICMgZG9udCB3YW50IERPTSBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiBzdWdzZWxlY3Q/KClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiBwaWxsanVtcCgpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHN1Z21vdmVyXG4gICAgICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDM4ICAgICAgIyB1cFxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKC0xKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlID09IDQwICMgZG93blxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKCsxKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgaW4gWzM3LCA4XVxuICAgICAgICAgICAgICAgIHNraXBad25qIGVsLCAtMSwgZS5zaGlmdEtleSAjIHNraXAgenduaiBiYWNrd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG4gICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSBpbiBbMzksIDQ2XVxuICAgICAgICAgICAgICAgIHNraXBad25qIGVsLCArMSwgZS5zaGlmdEtleSAjIHNraXAgenduaiBmb3J3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcblxuICAgICAgICAgICAgdXBkYXRlKCkgIyBkbyBhbiB1cGRhdGUsIGJ1dCBtYXkgY2FuY2VsIHdpdGgga2V5cHJlc3MgdG8gZ2V0IGNoYXJcblxuICAgICAgICAgICAgIyBhbmQga2VlcCBtYWtlIHN1cmUgaXQncyB0aWR5XG4gICAgICAgICAgICBsYXRlciAtPiByZW5kZXIudGlkeSgpXG5cbiAgICAgICAga2V5cHJlc3M6IChlKSAtPlxuICAgICAgICAgICAgIyBjYW5jZWwgcHJldmlvdXMgdXBkYXRlIHNpbmNlIHdlIGhhdmUgYSBjaGFyY29kZVxuICAgICAgICAgICAgdXBkYXRlIFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaClcblxuICAgICMgZmlyc3QgZHJhd2luZ1xuICAgIGRvIGRyYXcgPSAtPlxuICAgICAgICAjIGRyYXcgYW5kIGF0dGFjaCBoYW5kbGVyc1xuICAgICAgICByZW5kZXIuZHJhdyBoYW5kbGVyc1xuICAgICAgICByZW5kZXIudGlkeSgpXG5cbiAgICAjIGZpcnN0IGV2ZW50XG4gICAgbGF0ZXIgLT4gZGlzcGF0Y2ggJ2luaXQnXG5cbiAgICAjIHJldHVybiB0aGUgZmFjYWRlIHRvIGludGVyYWN0XG4gICAgcmV0dXJuIGZhw6dhZGVcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0cmlnZ2Vycy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHRyaWcxID0gdHRib3gudHJpZygnOicsIHR5cGVzKTtcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCdAJywge3ByZWZpeDogdHJ1ZX0sIHR5cGVzKTtcbnR0Ym94LnRyaWcgPSAoc3ltYm9sLCBvcHRzLCB0eXBlcykgLT5cbiAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDJcbiAgICAgICAgdHlwZXMgPSBvcHRzXG4gICAgICAgIG9wdHMgPSB7fVxuICAgIG5ldyBUcmlnZ2VyIHN5bWJvbCwgb3B0cywgdHlwZXNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIGRpdmlkZXJzIGluIHR5cGUgbGlzdHNcbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3guZGl2aWRlcignTGltaXQgc2VhcmNoIG9uJyksXG4jICAgICB0dGJveC50eXBlKCdwcm9kdWN0Jywge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgICAgdHRib3gudHlwZSgncGVyc29uJywgIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICBdXG50dGJveC5kaXZpZGVyID0gKG5hbWUsIG9wdHMpIC0+IG5ldyBUeXBlIG5hbWUsIG1lcmdlIHtcbiAgICBkaXZpZGVyOnRydWVcbiAgICBodG1sOiAtPiBcIjxkaXY+PGhyPjxzcGFuPiN7QG5hbWV9PC9zcGFuPjwvZGl2PlwiXG59LCBvcHRzXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBtYWtpbmcgdHlwZXMuXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0eXBlcyA9IFtcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LnR5cGUgPSAobmFtZSwgb3B0cywgdHlwZXMpIC0+IG5ldyBUeXBlIG5hbWUsIG9wdHNcblxuXG4jIEhlbHBlciBtZXRob2QgdG8gbWFrZSBodG1sIGZvciBhIHN1Z2dlc3QuXG4jIFwiPGRpdj48ZGZuPjxiPndvcmQ8L2I+aXNwYXJ0b2Y8L2Rmbj46IHNvbWUgZGVzY3JpcHRpb248L2Rpdj5cIlxuc3VnZ2VzdEh0bWwgPSAod29yZCwgcHJlZml4LCBuYW1lLCBzdWZmaXgsIGRlc2MgPSAnJykgLT5cbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JyB1bmxlc3MgbmFtZVxuICAgIFtoaWdoLCB1bmhpZ2hdID0gaWYgbmFtZS5pbmRleE9mKHdvcmQpID09IDAgdGhlbiBbd29yZCwgbmFtZVt3b3JkLmxlbmd0aC4uXV0gZWxzZSBbXCJcIiwgbmFtZV1cbiAgICBcIjxkaXY+PGRmbj4je3ByZWZpeH08Yj4je2hpZ2h9PC9iPiN7dW5oaWdofSN7c3VmZml4fTwvZGZuPiA8c3Bhbj4je2Rlc2N9PC9zcGFuPjwvZGl2PlwiXG5UeXBlOjpodG1sID0gKHdvcmQpIC0+XG4gICAgaWYgQHRyaWcucHJlZml4XG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIEB0cmlnLnN5bWJvbCwgQG5hbWUsIFwiXCIsIEBkZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBAbmFtZSwgQHRyaWcuc3ltYm9sLCBAZGVzY1xuXG5cbiMgZ29lcyB0aHJvdWdoIGFuIGVsZW1lbnQgcGFyc2luZyBwaWxscyBhbmRcbiMgdGV4dCBpbnRvIGEgZGF0YXN0cnVjdHVyZVxuIyBoZWxwZXIgdG8gdHVybiBhIHN1Z2dlc3QgaXRlbSBpbnRvIGh0bWxcbnRvSHRtbCA9ICh3b3JkKSAtPiAoaXRlbSkgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8uaHRtbCA9PSAnZnVuY3Rpb24nXG4gICAgICAgIGl0ZW0uaHRtbCh3b3JkKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0/LnZhbHVlID09ICdzdHJpbmcnXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIGl0ZW0udmFsdWUsIFwiXCIsIGl0ZW0uZGVzY1xuICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbSwgXCJcIlxuXG5cbiMgaGVscGVyIHRvIHR1cm4gYW4gaXRlbSBpbnRvIHRleHRcbnRvVGV4dCA9IChpdGVtID0gJycpIC0+XG4gICAgaWYgdHlwZW9mIGl0ZW0/LnZhbHVlID09ICdzdHJpbmcnXG4gICAgICAgIGl0ZW0udmFsdWVcbiAgICBlbHNlXG4gICAgICAgIFN0cmluZyhpdGVtKVxuXG4jIGpxdWVyeSBkcmF3aW5nIGhvb2tcbmRlZiB0dGJveCwganF1ZXJ5OiAtPlxuXG4gICAgJCAgICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRlbCAgPSBudWxsICMgc2V0IG9uIGluaXRcbiAgICAkYm94ID0gLT4gJGVsLmZpbmQoJy50dGJveCcpXG4gICAgIyBodG1sIGZvciBib3hcbiAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJ0dGJveFwiPjxkaXYgY2xhc3M9XCJ0dGJveC1vdmVyZmxvd1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInR0Ym94LWlucHV0XCIgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiPjwvZGl2PjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInR0Ym94LXBsYWNlaG9sZGVyXCI+PC9kaXY+PC9kaXY+J1xuICAgIHN1Z2dlc3QgPSAnPGRpdiBjbGFzcz1cInR0Ym94LXN1Zy1vdmVyZmxvd1wiPjxkaXYgY2xhc3M9XCJ0dGJveC1zdWdnZXN0XCI+PC9kaXY+PC9kaXY+J1xuICAgICMgY2FjaGUgb2YgcGlsbCA8cGlsbGlkLCBwaWxsPiBzdHJ1Y3R1cmVzXG4gICAgcGlsbHMgPSB7fVxuICAgICMgaGVscGVyIHRvIHRpZHkgY2FjaGVcbiAgICB0aWR5cGlsbHMgPSBob2xkIDUwMDAsIC0+XG4gICAgICAgIHByZXNlbnQgPSAkZWwuZmluZCgnLnR0Ym94LXBpbGwnKS5tYXAoLT4gJChAKS5hdHRyICdpZCcpLnRvQXJyYXkoKVxuICAgICAgICBkZWxldGUgcGlsbHNbaWRdIGZvciBpZCBpbiBPYmplY3Qua2V5cyhwaWxscykgd2hlbiBwcmVzZW50LmluZGV4T2YoaWQpIDwgMFxuICAgICAgICBudWxsXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgc3RydWN0dXJlIGZvciBhbiBlbGVtZW50XG4gICAgcGlsbGZvciA9IChlbCkgLT4gcGlsbHNbJChlbCkuY2xvc2VzdCgnLnR0Ym94LXBpbGwnKS5hdHRyKCdpZCcpXVxuICAgICMgZ28gdGhyb3VnaCBjYWNoZSBhbmQgZW5zdXJlIGFsbCBwaWxscyBoYXZlIHRoZSBpdGVtIHZhbHVlIG9mIHRoZVxuICAgICMgZWxlbWVudCB2YWx1ZS5cbiAgICBlbnN1cmVJdGVtcyA9IC0+XG4gICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpIGZvciBrLCBwaWxsIG9mIHBpbGxzXG4gICAgICAgIG51bGxcblxuICAgICMgY2FsbCBvZnRlbi4gZml4IHRoaW5ncy5cbiAgICB0aWR5ID0gLT5cbiAgICAgICAgJGlucCA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVxuICAgICAgICBpbnAgPSAkaW5wWzBdXG4gICAgICAgICMgbWVyZ2Ugc3R1ZmYgdG9nZXRoZXIgYW5kIHJlbW92ZSBlbXB0eSB0ZXh0bm9kZXMuXG4gICAgICAgIGlucC5ub3JtYWxpemUoKVxuICAgICAgICAjIGZpcnN0IGVuc3VyZSB0aGVyZSdzIGEgPGJyPiBhdCB0aGUgZW5kIChvciA8aT4gZm9yIElFKVxuICAgICAgICB0YWcgPSBpZiBpc0lFIHRoZW4gJ2knIGVsc2UgJ2JyJ1xuICAgICAgICB1bmxlc3MgJGlucC5jaGlsZHJlbigpLmxhc3QoKS5pcyB0YWdcbiAgICAgICAgICAgICRpbnAuZmluZChcIj4gI3t0YWd9XCIpLnJlbW92ZSgpXG4gICAgICAgICAgICAkaW5wLmFwcGVuZCBcIjwje3RhZ30+XCJcbiAgICAgICAgY2hpbGRzID0gaW5wLmNoaWxkTm9kZXNcbiAgICAgICAgZmlyc3QgPSBjaGlsZHNbMF1cbiAgICAgICAgIyBlbnN1cmUgdGhlIHdob2xlIHRoaW5ncyBzdGFydHMgd2l0aCBhIHp3bmpcbiAgICAgICAgaWYgZmlyc3Q/Lm5vZGVUeXBlICE9IDMgb3IgZmlyc3Q/Lm5vZGVWYWx1ZT9bMF0gIT0gendualxuICAgICAgICAgICAgJGlucFswXS5pbnNlcnRCZWZvcmUgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopLCBmaXJzdFxuICAgICAgICAjIGVuc3VyZSB0aGVyZSdzIGFsd2F5cyBhIHp3bmogYWZ0ZXIgZXZlcnkgZWxlbWVudCBub2RlXG4gICAgICAgIGZvciBuIGluIGNoaWxkcyB3aGVuIG4/Lm5vZGVUeXBlID09IDEgYW5kIG4/Lm5leHRTaWJsaW5nPy5ub2RlVHlwZSA9PSAxXG4gICAgICAgICAgICBhcHBlbmRBZnRlciBuLCBkb2MuY3JlYXRlVGV4dE5vZGUoenduailcbiAgICAgICAgIyByZW1vdmUgYW55IG5lc3RlZCBzcGFuIGluIHBpbGxzXG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGlsbCBzcGFuIHNwYW4nKS5yZW1vdmUoKVxuICAgICAgICAjIGFnYWluLCBlbnN1cmUgY29udGlnb3VzIG5vZGVzXG4gICAgICAgIGlucC5ub3JtYWxpemUoKVxuICAgICAgICAjIG1vdmUgY3Vyc29yIHRvIG5vdCBiZSBvbiBiYWQgZWxlbWVudCBwb3NpdGlvbnNcbiAgICAgICAgaWYgciA9IGN1cnNvcigkZWxbMF0pXG4gICAgICAgICAgICBpZiAoci5zdGFydENvbnRhaW5lciA9PSBpbnAgb3Igci5lbmRDb250YWluZXIgPT0gaW5wKVxuICAgICAgICAgICAgICAgIGNzID0gQXJyYXk6OnNsaWNlLmNhbGwgY2hpbGRzXG4gICAgICAgICAgICAgICAgIyBjdXJyZW50IHRleHQgbm9kZSwgdGhlbiByaWdodCwgdGhlIGxlZnQuXG4gICAgICAgICAgICAgICAgaXNUZXh0ID0gKG4pIC0+IGlmIG4/Lm5vZGVUeXBlID09IDMgdGhlbiBuIGVsc2UgbnVsbFxuICAgICAgICAgICAgICAgIGkgPSByLnN0YXJ0T2Zmc2V0XG4gICAgICAgICAgICAgICAgbiA9IGlzVGV4dChjc1tpXSkgPyBpc1RleHQoY3NbaSArIDFdKSA/IGlzVGV4dChjc1tpIC0gMV0pXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgbiBpZiBuXG4gICAgICAgICAgICAjIGZpcmVmb3ggbWFuYWdlcyB0byBmb2N1cyBhbnl0aGluZyBidXQgdGhlIG9ubHlcbiAgICAgICAgICAgICMgY29udGVudGVkaXRhYmxlPXRydWUgb2YgdGhlIHBpbGxcbiAgICAgICAgICAgIHBhcmVuID0gci5zdGFydENvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiBwYXJlbj8ubm9kZU5hbWUgIT0gJ1NQQU4nIGFuZCBwaWxsID0gcGlsbGZvciBwYXJlblxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAjIGtlZXAgY2FjaGUgY2xlYW5cbiAgICAgICAgdGlkeXBpbGxzKClcbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0aWFsaXNlIGJveFxuICAgIGluaXQ6IChlbCkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkbid0IGZpbmQgalF1ZXJ5XCIpIHVubGVzcyAkID0galF1ZXJ5XG4gICAgICAgICRlbCA9ICQoZWwpXG4gICAgICAgICRlbFswXVxuXG4gICAgIyBkcmF3IHN0dWZmIGFuZCBob29rIHVwIGV2ZW50IGhhbmRsZXJzXG4gICAgZHJhdzogKGhhbmRsZXJzKSAtPlxuICAgICAgICAkZWwuaHRtbCBodG1sXG4gICAgICAgICRlbC5vbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LCBoYW5kbGVyIG9mIGhhbmRsZXJzXG5cbiAgICAjIGNsZWFyIHRoZSBzdGF0ZSBvZiB0aGUgaW5wdXRcbiAgICBjbGVhcjogLT5cbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpLmVtcHR5KClcbiAgICAgICAgdGlkeSgpXG5cbiAgICAjIGZvY3VzIHRoZSBpbnB1dCAoaWYgaXQgZG9lc24ndCBhbHJlYWR5IGhhdmUgZm9jdXMpXG4gICAgZm9jdXM6IC0+XG4gICAgICAgIHJldHVybiBpZiBjdXJzb3IoJGVsWzBdKSAjIGFscmVhZHkgaGFzIGZvY3VzXG4gICAgICAgIHRpZHkoKSAjIGVuc3VyZSB3ZSBoYXZlIGEgbGFzdCBub2RlIHRvIHBvc2l0aW9uIGJlZm9yZVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGggLSAyXVxuICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMVxuXG4gICAgIyByZXR1cm4gYW4gYXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgYm94XG4gICAgdmFsdWVzOiAtPlxuICAgICAgICBlbnN1cmVJdGVtcygpXG4gICAgICAgIEFycmF5OjpzbGljZS5jYWxsKCRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzKS5tYXAgKG4pIC0+XG4gICAgICAgICAgICBpZiBuLm5vZGVUeXBlID09IDEgYW5kIG4/LmNsYXNzTmFtZT8uaW5kZXhPZigndHRib3gtcGlsbCcpID49IDBcbiAgICAgICAgICAgICAgICBwaWxsZm9yIG5cbiAgICAgICAgICAgIGVsc2UgaWYgbi5ub2RlVHlwZSA9PSAzXG4gICAgICAgICAgICAgICAgZmlsdGVyIG4ubm9kZVZhbHVlXG4gICAgICAgIC5maWx0ZXIgSVxuXG4gICAgIyByZW1vdmUgc3VnZ2dlc3RcbiAgICB1bnN1Z2dlc3Q6IHVuc3VnZ2VzdCA9IC0+XG4gICAgICAgICQoJy50dGJveC1zdWctb3ZlcmZsb3cnKS5yZW1vdmUoKVxuICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCdcblxuICAgICMgc3RhcnQgc3VnZ2VzdFxuICAgIHN1Z2dlc3Q6IChmbiwgcmFuZ2UsIGlkeCwgbW92ZWNiLCBzZWxlY3RjYikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBmaW5kL2NyZWF0ZSBzdWdnZXN0LWJveFxuICAgICAgICAkc3VnID0gJCgnLnR0Ym94LXN1Z2dlc3QnKVxuICAgICAgICB1bmxlc3MgJHN1Zy5sZW5ndGhcbiAgICAgICAgICAgICRvdmVyZmx3ID0gJChzdWdnZXN0KVxuICAgICAgICAgICAgJHN1ZyA9ICRvdmVyZmx3LmZpbmQgJy50dGJveC1zdWdnZXN0J1xuICAgICAgICAgICAgIyBsb2NrIHdpZHRoIHRvIHBhcmVudFxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzICdtaW4td2lkdGgnLCAkYm94KCkub3V0ZXJXaWR0aCgpXG4gICAgICAgICAgICAjIGFkanVzdCBmb3IgYm9yZGVyIG9mIHBhcmVudFxuICAgICAgICAgICAgYm9yZCA9IHBhcnNlSW50ICRlbC5maW5kKCcudHRib3gtb3ZlcmZsb3cnKS5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKVxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzIHRvcDokZWwub3V0ZXJIZWlnaHQoKSAtIGJvcmRcbiAgICAgICAgICAgICMgYXBwZW5kIHRvIGJveFxuICAgICAgICAgICAgJGJveCgpLmFwcGVuZCAkb3ZlcmZsd1xuICAgICAgICAgICAgIyBpbmRpY2F0ZSB3ZSBhcmUgc2hvd2luZ1xuICAgICAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zaG93aW5nLXN1Z2dlc3QnKVxuICAgICAgICAjIGVtcHR5IHN1Z2dlc3QgYm94IHRvIHN0YXJ0IGZyZXNoXG4gICAgICAgICRzdWcuaHRtbCgnJyk7ICRzdWcub2ZmKClcbiAgICAgICAgIyBjbGFzcyB0byBob29rIHN0eWxpbmcgd2hlbiBzdWdnZXN0aW5nXG4gICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc3VnZ2VzdC1yZXF1ZXN0JylcbiAgICAgICAgIyByZXF1ZXN0IHRvIGdldCBzdWdnZXN0IGVsZW1lbnRzXG4gICAgICAgIGZuIHdvcmQsIChsaXN0KSAtPlxuICAgICAgICAgICAgIyBub3QgcmVxdWVzdGluZyBhbnltb3JlXG4gICAgICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCdcbiAgICAgICAgICAgICMgbG9jYWwgdG9IdG1sIHdpdGggd29yZFxuICAgICAgICAgICAgbG9jVG9IdG1sID0gdG9IdG1sKHdvcmQpXG4gICAgICAgICAgICAjIHR1cm4gbGlzdCBpbnRvIGh0bWxcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCAobCkgLT5cbiAgICAgICAgICAgICAgICAkaCA9ICQobG9jVG9IdG1sKGwpKVxuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGlmIGwuZGl2aWRlclxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1kaXZpZGVyJ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtaXRlbSdcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBsLmNsYXNzTmFtZSBpZiBsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICRzdWcuYXBwZW5kICRoXG4gICAgICAgICAgICAjIGxpc3Qgd2l0aG91dCBkaXZpZGVyc1xuICAgICAgICAgICAgbm9kaXZpZCA9IGxpc3QuZmlsdGVyIChsKSAtPiAhbC5kaXZpZGVyXG4gICAgICAgICAgICBwcmV2aWR4ID0gbnVsbFxuICAgICAgICAgICAgZG8gc2VsZWN0SWR4ID0gKGRvc3RhcnQgPSBmYWxzZSkgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgaWR4IDwgMCBhbmQgIWRvc3RhcnRcbiAgICAgICAgICAgICAgICBpZHggPSAwIGlmIGlkeCA8IDBcbiAgICAgICAgICAgICAgICBpZHggPSBub2RpdmlkLmxlbmd0aCAtIDEgaWYgaWR4ID49IG5vZGl2aWQubGVuZ3RoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHByZXZpZHggPT0gaWR4XG4gICAgICAgICAgICAgICAgcHJldmlkeCA9IGlkeFxuICAgICAgICAgICAgICAgICRzdWcuZmluZCgnLnR0Ym94LXNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmVxKGlkeClcbiAgICAgICAgICAgICAgICAkc2VsLmFkZENsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgJHNlbFswXT8uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaWR4XVxuICAgICAgICAgICAgIyBoYW5kbGUgY2xpY2sgb24gYSBzdWdnZXN0IGl0ZW0sIG1vdXNlZG93biBzaW5jZSBjbGlja1xuICAgICAgICAgICAgIyB3aWxsIGZpZ2h0IHdpdGggZm9jdXNvdXQgb24gdGhlIHBpbGxcbiAgICAgICAgICAgICRzdWcub24gJ21vdXNlZG93bicsIChldikgLT5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCkgIyBubyBsb3NlIGZvY3VzXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG4gICAgICAgICMgdGhlIHRyaWcgaXMgcmVhZCBmcm9tIHRoZSB0eXBlXG4gICAgICAgIHRyaWcgPSB0eXBlLnRyaWdcbiAgICAgICAgIyBjcmVhdGUgcGlsbCBodG1sXG4gICAgICAgIGRmbiA9IGlmIHRyaWdcbiAgICAgICAgICAgIGlmIHRyaWcucHJlZml4IHRoZW4gdHJpZy5zeW1ib2wgZWxzZSB0eXBlLm5hbWUgKyB0cmlnLnN5bWJvbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0eXBlLm5hbWVcbiAgICAgICAgJHBpbGwgPSAkKFwiPGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbFxcXCI+PGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbC1jbG9zZVxcXCI+w5c8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIjxkZm4+I3tkZm59PC9kZm4+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKVxuICAgICAgICAkcGlsbC5maW5kKCcqJykuYW5kU2VsZigpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZSdcbiAgICAgICAgKCRzcGFuID0gJHBpbGwuZmluZCgnc3BhbicpKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZSdcbiAgICAgICAgIyBpZiBwcmVmaXggc3R5bGUgcGlsbFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyAndHRib3gtcGlsbC1wcmVmaXgnIGlmIHR5cGUudHJpZy5wcmVmaXhcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS50cmlnLmNsYXNzTmFtZSBpZiB0eXBlLnRyaWcuY2xhc3NOYW1lXG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUuY2xhc3NOYW1lIGlmIHR5cGUuY2xhc3NOYW1lXG4gICAgICAgICMgZ2VuZXJhdGUgaWQgdG8gYXNzb2NpYXRlIHdpdGggbWVtIHN0cnVjdHVyZVxuICAgICAgICBpZCA9IFwidHRib3hwaWxsI3tEYXRlLm5vdygpfVwiXG4gICAgICAgICRwaWxsLmF0dHIgJ2lkJywgaWRcbiAgICAgICAgIyByZXBsYWNlIGNvbnRlbnRzIHdpdGggcGlsbFxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUgJHBpbGxbMF1cbiAgICAgICAgIyByZW1vdmUgcGlsbCBmcm9tIERPTSwgd2hpY2ggaW4gdHVybiByZW1vdmVzIGl0IGNvbXBsZXRlbHlcbiAgICAgICAgcmVtb3ZlID0gLT5cbiAgICAgICAgICAgICRwaWxsLnJlbW92ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbHJlbW92ZScsIHtwaWxsfVxuICAgICAgICAjIHdpcmUgdXAgY2xvc2UgYnV0dG9uXG4gICAgICAgICRwaWxsLmZpbmQoJy50dGJveC1waWxsLWNsb3NlJykub24gJ2NsaWNrJywgcmVtb3ZlXG4gICAgICAgICMgZm9ybWF0IHRoZSB0ZXh0IHVzaW5nIHRoZSB0eXBlIGZvcm1hdHRlclxuICAgICAgICBmb3JtYXQgPSAtPiAkc3Bhbi50ZXh0IHR5cGUuZm9ybWF0ICRzcGFuLnRleHQoKVxuICAgICAgICAjIG1heWJlIHJ1biBmb3JtYXQgb24gZm9jdXNvdXRcbiAgICAgICAgJHBpbGwub24gJ2ZvY3Vzb3V0JywgLT5cbiAgICAgICAgICAgICMgZGlzcGF0Y2ggbGF0ZXIgdG8gYWxsb3cgZm9yIGNsaWNrIG9uIHN1Z2dlc3RcbiAgICAgICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpXG4gICAgICAgICAgICBmb3JtYXQoKSBpZiBwaWxsLml0ZW0/Ll90ZXh0XG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbGZvY3Vzb3V0Jywge3BpbGx9XG4gICAgICAgICMgaGVscGVyIGZ1bmN0aW9uIHRvIHNjb2xsIHBpbGwgaW50byB2aWV3XG4gICAgICAgIHNjcm9sbEluID0gLT5cbiAgICAgICAgICAgICRwaWxsLmFmdGVyICR0ID0gJCgnPHNwYW4gc3R5bGU9XCJ3aWR0aDoxcHhcIj4nKVxuICAgICAgICAgICAgJHRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNpYiA9ICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIHNpYiBpZiBzaWJcbiAgICAgICAgICAgICAgICBza2lwWnduaiAkZWxbMF0sICsxICMgRkYgc2hvd3Mgbm8gY3Vyc29yIGlmIHdlIHN0YW5kIG9uIDBcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuaXRlbSA9IHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=