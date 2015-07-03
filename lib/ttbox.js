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
                return pill.setItem({
                  value: stxt,
                  _text: true
                });
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

//# sourceMappingURL=data:application/json;base64,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UCxDQUFBLEdBQUksR0FBRyxDQUFDLFdBQUosQ0FBQTtVQUNKLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBWCxFQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBMUI7VUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsRUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQXhCO0FBQ0EsaUJBQU87UUFQQSxDQW5NWDtRQTRNQSxjQUFBLEVBQWdCLFNBQUMsR0FBRDtpQkFDWixHQUFHLENBQUMsSUFBSixDQUFTLG9CQUFULENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEM7UUFEWSxDQTVNaEI7UUErTUEsaUJBQUEsRUFBbUIsU0FBQyxJQUFEO2lCQUNmLEdBQUcsQ0FBQyxJQUFKLENBQVMsb0JBQVQsQ0FBOEIsQ0FBQyxNQUEvQixDQUFzQyxJQUFBLElBQVMsQ0FBQyxDQUFDLElBQUQsSUFBUyxLQUFBLElBQVMsRUFBbkIsQ0FBL0M7UUFEZSxDQS9NbkI7O0lBbkVlLENBQVI7R0FBWDs7RUFzUkEsR0FBQSxDQUFJLEtBQUosRUFBVztJQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsTUFBZDtHQUFYOztFQUdBLElBQUcsT0FBTyxNQUFQLEtBQWlCLFFBQXBCO0lBQ0ksTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFEckI7R0FBQSxNQUVLLElBQUcsT0FBTyxNQUFQLEtBQWlCLFVBQWpCLElBQWdDLE1BQU0sQ0FBQyxHQUExQztJQUNELE1BQUEsQ0FBTyxTQUFBO2FBQUc7SUFBSCxDQUFQLEVBREM7R0FBQSxNQUFBO0lBR0QsSUFBSSxDQUFDLEtBQUwsR0FBYSxNQUhaOztBQWw1QkwiLCJmaWxlIjoidHRib3guanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJnbG9iID0gZ2xvYmFsID8gd2luZG93XG5cbmRvYyAgID0gZ2xvYi5kb2N1bWVudFxuSSAgICAgPSAoYSkgLT4gYVxubWVyZ2UgPSAodCwgb3MuLi4pIC0+IHRba10gPSB2IGZvciBrLHYgb2YgbyB3aGVuIHYgIT0gdW5kZWZpbmVkIGZvciBvIGluIG9zOyB0XG5sYXRlciA9IChmbikgLT4gc2V0VGltZW91dCBmbiwgMVxuaG9sZCAgPSAobXMsIGYpIC0+IGxhc3QgPSAwOyB0aW0gPSBudWxsOyAoYXMuLi4pIC0+XG4gICAgY2xlYXJUaW1lb3V0IHRpbSBpZiB0aW1cbiAgICB0aW0gPSBzZXRUaW1lb3V0ICgtPmYgYXMuLi4pLCBtc1xubGFzdCAgPSAoYXMpIC0+IGFzP1thcy5sZW5ndGggLSAxXVxuZmluZCAgPSAoYXMsIGZuKSAtPiByZXR1cm4gYSBmb3IgYSBpbiBhcyB3aGVuIGZuKGEpXG5cblVBID0gZ2xvYj8ubmF2aWdhdG9yPy51c2VyQWdlbnRcbltpc0lFLCBJRVZlcl0gPSAvTVNJRSAoWzAtOV17MSx9Wy4wLTldezAsfSkvLmV4ZWMoVUEpID8gW11cbklFVmVyID0gcGFyc2VJbnQgSUVWZXIgaWYgSUVWZXJcbmlzQ2hyb21lICA9IFVBLmluZGV4T2YoJ0Nocm9tZScpID4gMFxuXG4jIGRlZmluZSBhbiBpbnZpc2libGUgcHJvcGVydHlcbmRlZiA9IChvYmosIHByb3BzKSAtPiBmb3IgbmFtZSwgdmFsdWUgb2YgcHJvcHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqLCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIG51bGxcblxuenduaiAgICAgICAgID0gXCLigItcIiAjICZ6d25qO1xuZmlsdGVyQTAgICAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MDBhMC9nLCAnICcgIyBuYnNwXG5maWx0ZXJad25qICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUyMDBiL2csICcnXG5maWx0ZXIgICAgICAgPSAocykgLT4gZmlsdGVyQTAgZmlsdGVyWnduaiBzXG5hcHBlbmRBZnRlciAgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsLm5leHRTaWJsaW5nKVxuYXBwZW5kQmVmb3JlID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbClcbmhleGR1bXAgICAgICA9IChzKSAtPiAoYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSBmb3IgYyBpbiBzKS5qb2luKCcgJylcblxuIyBpbmplY3QgY3NzXG5kbyAtPlxuICAgIHN0eWxlcyA9IFwiXG4udHRib3ggKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB3aWR0aDogYXV0bztcbn1cblxuLnR0Ym94IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbi50dGJveCBkZm4ge1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG59XG5cbi50dGJveC1vdmVyZmxvdyB7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgb3ZlcmZsb3cteDogYXV0bztcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG4udHRib3gtb3ZlcmZsb3c6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuLnR0Ym94LXNob3dpbmctc3VnZ2VzdCAudHRib3gtb3ZlcmZsb3cge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG5cbi50dGJveC1pbnB1dCB7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuLnR0Ym94LWlucHV0ICoge1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG5cbi50dGJveC1pbnB1dCAqIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1pbnB1dCBiciB7XG4gICAgZGlzcGxheTogaW5saW5lO1xufVxuXG4udHRib3gtc3VnLW92ZXJmbG93IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICAvKiBib3JkZXI6IDFweCBzb2xpZCAjYmJiOyAqL1xuICAgIC8qIGJvcmRlci1yYWRpdXM6IDNweDsgKi9cbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3gtc2hhZG93OiAwIDJweCAycHggcmdiYSgwLDAsMCwwLjMpO1xuICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLnR0Ym94LXN1Z2dlc3Qge1xuICAgIG1pbi1oZWlnaHQ6IDVweDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBsaW5lLWhlaWdodDogMzhweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpmaXJzdC1jaGlsZCB7XG4gICAgcGFkZGluZy10b3A6IDVweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDAgMTBweCAwIDI1cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gZGZuIHtcbiAgICBtaW4td2lkdGg6IDcwcHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSBzcGFuIHtcbiAgICBjb2xvcjogI2NjYztcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiAwIDEwcHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIgc3BhbiB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDE7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgY29sb3I6ICM5MjkyOTI7XG4gICAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIGhyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbWFyZ2luLXRvcDogMS4xNWVtO1xuICAgIGxlZnQ6IDIwcHg7XG4gICAgcmlnaHQ6IDEwcHg7XG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQ7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbn1cbi50dGJveC1zZWxlY3RlZCB7XG4gICAgYmFja2dyb3VuZDogI2VlZTtcbn1cblxuLnR0Ym94LXBpbGwge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsaW5lLWhlaWdodDogMjRweDtcbiAgICBtYXJnaW46IDAgNHB4O1xuICAgIGJhY2tncm91bmQ6ICM1Y2I4NWM7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzU4YjY1ODtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMCAxMnB4O1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBtaW4td2lkdGg6IDMwcHg7XG59XG4udHRib3gtcGlsbCBkZm4ge1xuICAgIHBhZGRpbmc6IDAgM3B4IDAgMTRweDtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbn1cbi50dGJveC1waWxsLXByZWZpeCBkZm4ge1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG4udHRib3gtcGlsbC1jbG9zZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBwYWRkaW5nOiAwIDVweDtcbiAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXBpbGwgc3BhbiB7XG4gICAgbWluLXdpZHRoOiA1cHg7XG59XG5cbi50dGJveC1wbGFjZWhvbGRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiA1cHg7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cblwiXG4gICAgY3NzID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBjc3MudHlwZSA9ICd0ZXh0L2NzcydcbiAgICBjc3MuaW5uZXJIVE1MID0gc3R5bGVzXG4gICAgZG9jLmhlYWQuYXBwZW5kQ2hpbGQgY3NzXG5cbmNsYXNzIFR5cGUgdGhlbiBjb25zdHJ1Y3RvcjogKEBuYW1lLCBvcHRzKSAtPiBtZXJnZSBALCB7Zm9ybWF0Okl9LCBvcHRzXG5jbGFzcyBUcmlnZ2VyIHRoZW4gY29uc3RydWN0b3I6IChAc3ltYm9sLCBvcHRzLCB0eXBlcykgLT5cbiAgICBtZXJnZSBALCBvcHRzXG4gICAgQHR5cGVzID0gaWYgQXJyYXkuaXNBcnJheSB0eXBlcyB0aGVuIHR5cGVzIGVsc2UgW3R5cGVzXVxuICAgICMgc2V0IGJhY2sgcmVmZXJlbmNlXG4gICAgdC50cmlnID0gdGhpcyBmb3IgdCBpbiBAdHlwZXNcbiAgICBpZiBAcHJlZml4XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbnQgaGF2ZSBtdWx0aXBsZSB0eXBlcyB3aXRoIHByZWZpeCB0cmlnZ2VyXCIpIGlmIEB0eXBlcy5sZW5ndGggPiAxXG4gICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcbiAgICBlbHNlXG4gICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oXFxcXHcqKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcblxuIyBTa2lwIHp3bmogY2hhcnMgd2hlbiBtb3ZpbmcgbGVmdC9yaWdodFxuc2tpcFp3bmogPSAocGVsLCBkLCBlbmQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICBuID0gaWYgZW5kIHRoZW4gci5lbmRDb250YWluZXIgZWxzZSByLnN0YXJ0Q29udGFpbmVyXG4gICAgaSA9IGlmIGVuZCB0aGVuIHIuZW5kT2Zmc2V0IGVsc2Ugci5zdGFydE9mZnNldFxuICAgIHJldHVybiB1bmxlc3Mgbi5ub2RlVHlwZSA9PSAzXG4gICAgYyA9IG4ubm9kZVZhbHVlLmNoYXJDb2RlQXQgKGlmIGQgPCAwIHRoZW4gaSArIGQgZWxzZSBpKVxuICAgIGlmIGMgPT0gODIwM1xuICAgICAgICAjIG1vdmVcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIGkgKyBkXG4gICAgICAgIHNraXBad25qIGQsIGVuZCAjIGFuZCBtYXliZSBjb250aW51ZSBtb3Zpbmc/XG5cbmlzUGFyZW50ID0gKHBuLCBuKSAtPlxuICAgIGlmIG4gPT0gbnVsbCB0aGVuIGZhbHNlIGVsc2UgaWYgcG4gPT0gbiB0aGVuIHRydWUgZWxzZSBpc1BhcmVudChwbiwgbi5wYXJlbnROb2RlKVxuXG4jIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG5jdXJzb3IgPSAocGVsKSAtPlxuICAgIHMgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICByZXR1cm4gdW5sZXNzIHMucmFuZ2VDb3VudFxuICAgIHIgPSBzLmdldFJhbmdlQXQoMClcbiAgICBpZiBpc1BhcmVudChwZWwsIHIuc3RhcnRDb250YWluZXIpIHRoZW4gciBlbHNlIG51bGxcblxuIyBmaWx0ZXIgdGhlIHJhbmdlIHRvIGdldCByaWQgb2YgdW53YW50ZWQgY2hhcnNcbnJhbmdlU3RyID0gKHIpIC0+IGZpbHRlciByLnRvU3RyaW5nKClcblxuZmlyc3RJc1doaXRlID0gKHMpIC0+IC9eXFxzLiovLnRlc3QocyA/ICcnKVxubGFzdElzV2hpdGUgID0gKHMpIC0+IC8uKlxccyQvLnRlc3QocyA/ICcnKVxuXG53b3JkUmFuZ2VBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgICMgZXhwYW5kIGJlZ2lubmluZ1xuICAgIHdoaWxlIHQuc3RhcnRPZmZzZXQgPiAwIGFuZCBub3QgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0IC0gMVxuICAgICMgb25lIGZvcndhcmQgYWdhaW5cbiAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgKyAxIGlmIGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgIyBleHBhbmQgZW5kXG4gICAgbGVuID0gdC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMFxuICAgIHdoaWxlIHQuZW5kT2Zmc2V0IDwgbGVuIGFuZCBub3QgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgKyAxXG4gICAgIyBvbmUgYmFjayBhZ2FpblxuICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCAtIDEgaWYgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgIHJldHVybiB0XG5cbmVudGlyZVRleHRBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIHQuc2VsZWN0Tm9kZUNvbnRlbnRzIHQuc3RhcnRDb250YWluZXJcbiAgICByZXR1cm4gdFxuXG5maW5kSW5SYW5nZSA9IChyLCBjaGFyKSAtPlxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIG1heCA9ICh0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwKSAtIDFcbiAgICBmb3IgaSBpbiBbdC5zdGFydE9mZnNldC4ubWF4XSBieSAxXG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgaVxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgaSArIDFcbiAgICAgICAgcmV0dXJuIGkgaWYgdC50b1N0cmluZygpID09IGNoYXJcbiAgICByZXR1cm4gLTFcblxuc2V0Q3Vyc29yUG9zID0gKHIsIHBvcyA9IDApIC0+XG4gICAgdCA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgdC5zZXRTdGFydCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICB0LnNldEVuZCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICBzZWwgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBzZWwuYWRkUmFuZ2UgdFxuXG5zZXRDdXJzb3JFbCA9IChlbCwgcG9zID0gMCkgLT5cbiAgICByID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICByLnNlbGVjdE5vZGVDb250ZW50cyBlbFxuICAgIHBvcyA9IGVsPy5ub2RlVmFsdWU/Lmxlbmd0aCBpZiBwb3MgPCAwXG4gICAgc2V0Q3Vyc29yUG9zIHIsIHBvc1xuXG4jIEZ1bmN0aW9uIHRvIG1ha2UgdHRib3ggb3V0IG9mIGFuIGVsZW1lbnQgd2l0aCB0cmlnZ2Vyc1xuI1xudHRib3ggPSAoZWwsIHRyaWdzLi4uKSAtPlxuXG4gICAgIyBsb2NhbCByZWZlcmVuY2UgdG8gcmVuZGVyIHBsdWdcbiAgICByZW5kZXIgPSB0dGJveC5yZW5kZXIoKVxuXG4gICAgIyBsZXQgcmVuZGVyIGRlY2lkZSB3ZSBoYXZlIGEgZ29vZCBlbFxuICAgIGVsID0gcmVuZGVyLmluaXQoZWwpXG5cbiAgICAjIGFuZCBjaGVjayB3ZSBnb3QgYSBnb29kIHRoaW5nIGJhY2tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSBESVYnKSB1bmxlc3MgZWwudGFnTmFtZSA9PSAnRElWJ1xuXG4gICAgIyBkaXNwYXRjaCBldmVudHMgb24gaW5jb21pbmcgZGl2XG4gICAgZGlzcGF0Y2ggPSAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgZSA9IGRvYy5jcmVhdGVFdmVudCAnRXZlbnQnXG4gICAgICAgIG1lcmdlIGUsIG9wdHMsIHt0dGJveDpmYcOnYWRlfVxuICAgICAgICBlLmluaXRFdmVudCBcInR0Ym94OiN7bmFtZX1cIiwgdHJ1ZSwgZmFsc2VcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudCBlXG5cbiAgICAjIGFkZCBhIG5ldyBwaWxsIHRvIGlucHV0XG4gICAgYWRkcGlsbCA9ICh0eXBlLCBpdGVtKSAtPlxuICAgICAgICAjIGVpdGhlciB1c2UgY3Vyc29yIHBvc2l0aW9uLCBvciB0aGUgbGFzdCBjaGlsZCBlbGVtZW50XG4gICAgICAgIHIgPSBjdXJzb3IoZWwpID8gcmVuZGVyLnJhbmdlbGFzdCgpXG4gICAgICAgICMgaW1wbGljaXRseSBkb2VzIHRpZHlcbiAgICAgICAgcmV0dXJuIHJlbmRlci5waWxsaWZ5IHIsIHR5cGUsIGl0ZW0sIGRpc3BhdGNoXG4gICAgYWRkdGV4dCA9ICh0ZXh0KSAtPlxuICAgICAgICAjIGVpdGhlciB1c2UgY3Vyc29yIHBvc2l0aW9uLCBvciB0aGUgbGFzdCBjaGlsZCBlbGVtZW50XG4gICAgICAgIHIgPSBjdXJzb3IoZWwpID8gcmVuZGVyLnJhbmdlbGFzdCgpXG4gICAgICAgIHIuaW5zZXJ0Tm9kZSBkb2MuY3JlYXRlVGV4dE5vZGUodGV4dClcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICByZXR1cm4gclxuICAgIGNsZWFyID0gLT5cbiAgICAgICAgcmVuZGVyLmNsZWFyKClcbiAgICAgICAgdXBkYXRlKClcbiAgICB0cmlnZ2VyID0gKHN5bWJvbCkgLT5cbiAgICAgICAgIyBtYWtlIHN1cmUgY29udGlndW91cyB0ZXh0IG5vZGVzXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgcmVuZGVyLmZvY3VzKCkgIyBlbnN1cmUgd2UgaGF2ZSBmb2N1c1xuICAgICAgICAjIHdlIHdhbnQgdG8gYmUgdG8gdGhlIHJpZ2h0IG9mIGFueSB6d25qXG4gICAgICAgICMgaW4gdGhlIGN1cnJlbnQgdGV4dCBibG9ja1xuICAgICAgICBza2lwWnduaiBlbCwgMVxuICAgICAgICAjIGdldCB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcihlbClcbiAgICAgICAgc3RyID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBpbnNlcnQgc3BhY2UgaWYgd2UgaGF2ZSBjb250ZW50IGJlZm9yZWhhbmRcbiAgICAgICAgaW5zZXJ0ID0gaWYgc3RyID09ICcnIHRoZW4gc3ltYm9sIGVsc2UgXCIgI3tzeW1ib2x9XCJcbiAgICAgICAgY3Vyc29yKGVsKS5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSBpbnNlcnRcbiAgICAgICAgIyBtYWtlIGNvbnRpZ3VvdXMgdGV4dCBub2Rlc1xuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgICMgcG9zaXRpb24gYXQgdGhlIHZlcnkgZW5kIG9mIHRoaXNcbiAgICAgICAgciA9IGVudGlyZVRleHRBdEN1cnNvcihlbClcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIHIuZW5kT2Zmc2V0IC0gc3ltYm9sLmxlbmd0aFxuICAgICAgICAjIHRyaWdnZXIgc3VnZ2VzdFxuICAgICAgICB1cGRhdGUoKVxuXG4gICAgIyBleHBvc2VkIG9wZXJhdGlvbnNcbiAgICBmYcOnYWRlID0ge1xuICAgICAgICBhZGRwaWxsLCBhZGR0ZXh0LCByZW5kZXIsIGNsZWFyLCB0cmlnZ2VyXG4gICAgICAgIHZhbHVlczogLT4gcmVuZGVyLnZhbHVlcygpXG4gICAgICAgIHNldHZhbHVlczogKHZhbHVlcykgLT5cbiAgICAgICAgICAgIGNsZWFyKClcbiAgICAgICAgICAgIHZhbHVlcy5mb3JFYWNoICh2KSAtPlxuICAgICAgICAgICAgICAgIGlmIHR5cGVvZiB2ID09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgIGFkZHRleHQgdlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYWRkcGlsbCB2LnR5cGUsIHYuaXRlbVxuICAgICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgZm9jdXM6IC0+IHJlbmRlci5mb2N1cygpXG4gICAgICAgIHBsYWNlaG9sZGVyOiAodHh0KSAtPlxuICAgICAgICAgICAgcmVuZGVyLnNldFBsYWNlaG9sZGVyKHR4dClcbiAgICAgICAgICAgIHVwZGF0ZSgpICMgdG9nZ2xlIHBsYWNlaG9sZGVyXG4gICAgfVxuXG4gICAgcHJldnZhbHVlcyA9IFtdXG5cbiAgICB1cGRhdGUgPSBob2xkIDMsIChjaGFyKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSByZW5kZXIudmFsdWVzKClcbiAgICAgICAgIyBzaG93IHBsYWNlaG9sZGVyIGlmIGl0J3MgZW1wdHlcbiAgICAgICAgcmVuZGVyLnRvZ2dsZVBsYWNlaG9sZGVyIHZhbHVlcy5sZW5ndGggPT0gMFxuICAgICAgICB1bmxlc3MgdmFsdWVzLnJlZHVjZSAoKHAsIGMsIGkpIC0+IHAgYW5kIGMgPT0gcHJldnZhbHVlc1tpXSksIHRydWVcbiAgICAgICAgICAgIHByZXZ2YWx1ZXMgPSB2YWx1ZXNcbiAgICAgICAgICAgIGRpc3BhdGNoICdjaGFuZ2UnLCB7dmFsdWVzfVxuICAgICAgICAjIGEgcGlsbCBlZGl0IHRydW1mcyBhbGxcbiAgICAgICAgcmV0dXJuIGlmIGhhbmRsZXBpbGwoKVxuICAgICAgICAjIGN1cnNvciByYW5nZSBmb3Igd29yZFxuICAgICAgICByID0gd29yZFJhbmdlQXRDdXJzb3IoZWwpXG4gICAgICAgICMgWFhYIG9wdGltaXplIHdpdGggYmVsb3c/XG4gICAgICAgIHVubGVzcyByXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgYSB0cmlnZ2VyIGluIHRoZSB3b3JkP1xuICAgICAgICB0cmlnID0gZmluZCB0cmlncywgKHQpIC0+IHQucmUudGVzdCB3b3JkXG4gICAgICAgICMgbm8gdHJpZ2dlciBmb3VuZCBpbiBjdXJyZW50IHdvcmQsIGFib3J0XG4gICAgICAgIHVubGVzcyB0cmlnXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIyBleGVjIHRyaWdnZXIgdG8gZ2V0IHBhcnRzXG4gICAgICAgIFtfLCB0eXBlbmFtZSwgdmFsdWVdID0gdHJpZy5yZS5leGVjIHdvcmRcbiAgICAgICAgIyBmaW5kIHBvc3NpYmxlIHR5cGVzXG4gICAgICAgIHR5cGVzID0gdHJpZy50eXBlcy5maWx0ZXIgKHQpIC0+IHRyaWcucHJlZml4IG9yIHQubmFtZT8uaW5kZXhPZih0eXBlbmFtZSkgPT0gMFxuICAgICAgICAjIGhhbmQgb2ZmIHRvIGRlYWwgd2l0aCBmb3VuZCBpbnB1dFxuICAgICAgICBoYW5kbGV0eXBlcyByLCB0cmlnLCB0eXBlcywgY2hhclxuXG4gICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgIHNldFN1Z21vdmVyID0gKF9zdWdtb3ZlcikgLT4gc3VnbW92ZXIgPSBfc3VnbW92ZXJcbiAgICBzdG9wc3VnID0gLT5cbiAgICAgICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgICAgICByZW5kZXIudW5zdWdnZXN0KClcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RzdG9wJ1xuXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbHMgbGVhdmVcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxscmVtb3ZlJywgLT5cbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHVwZGF0ZSgpICMgdHJpZ2dlciB2YWx1ZS1jaGFuZ2VcbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxsIGxvc2UgZm9jdXNcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxsZm9jdXNvdXQnLCBzdG9wc3VnXG5cbiAgICBoYW5kbGV0eXBlcyA9IChyYW5nZSwgdHJpZywgdHlwZXMsIGNoYXIpIC0+XG4gICAgICAgICMgdGhlIHRyaWdnZXIgcG9zaXRpb24gaW4gdGhlIHdvcmQgcmFuZ2VcbiAgICAgICAgdHBvcyA9IGZpbmRJblJhbmdlIHJhbmdlLCB0cmlnLnN5bWJvbFxuICAgICAgICAjIG5vIHRwb3M/IVxuICAgICAgICByZXR1cm4gaWYgdHBvcyA8IDBcbiAgICAgICAgIyByYW5nZSBmb3IgdHlwZSBuYW1lICh3aGljaCBtYXkgbm90IGJlIHRoZSBlbnRpcmUgbmFtZSlcbiAgICAgICAgdHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgIHRyYW5nZS5zZXRFbmQgdHJhbmdlLmVuZENvbnRhaW5lciwgdHBvc1xuICAgICAgICAjIHdoZXRoZXIgdGhlIGxhc3QgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyXG4gICAgICAgIHdhc3RyaWcgPSBjaGFyID09IHRyaWcuc3ltYm9sXG4gICAgICAgICMgaGVscGVyIHdoZW4gZmluaXNoZWQgc2VsZWN0aW5nIGEgdHlwZVxuICAgICAgICBzZWxlY3RUeXBlID0gKHR5cGUpIC0+XG4gICAgICAgICAgICByZW5kZXIucGlsbGlmeSByYW5nZSwgdHlwZSwgbnVsbCwgZGlzcGF0Y2hcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzZWxlY3QnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgaWYgdHlwZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBlbHNlIGlmIHR5cGVzLmxlbmd0aCA9PSAxIGFuZCBub3Qgc3VnbW92ZXJcbiAgICAgICAgICAgICMgb25lIHBvc3NpYmxlIHNvbHV0aW9uXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBmb3IgdHJpZ2dlciBjaGFyLCB3ZSBzZWxlY3QgdGhlIGZpcnN0IHR5cGUgc3RyYWlnaHQgYXdheVxuICAgICAgICAgICAgICAgIHNlbGVjdFR5cGUgZmluZCB0eXBlcywgKHQpIC0+ICF0LmRpdmlkZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyB3aGVuIHRoZSBrZXkgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyIGFuZCB0aGVyZSBhcmVcbiAgICAgICAgICAgICMgbXVsdGlwbGUgcG9zc2libGUgdmFsdWVzLCBwb3NpdGlvbi4gbW92ZSB0byBqdXN0IGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgdHJpZ2dlciBjaGFyLlxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgbW92ZSB0aGUgY3Vyc29yIHRvIGFsbG93IGZvciBzdWdnZXN0IGlucHV0XG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHJhbmdlLCB0cG9zXG4gICAgICAgICAgICAjIHN0YXJ0IGEgc3VnZ2VzdCBmb3IgY3VycmVudCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICAgICAgdHlwZXN1Z2dlc3QgdHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlc1xuXG5cbiAgICAjIHN1Z2dlc3QgZm9yIGdpdmVuIHR5cGVzXG4gICAgdHlwZXN1Z2dlc3QgPSAocmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIGhlbHBlciB0byBjcmVhdGUgc3Vnc2VsZWN0IGZ1bmN0aW9uc1xuICAgICAgICBzdWdzZWxlY3Rmb3IgPSAoaXRlbSkgLT4gLT5cbiAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICMgdGhlIHR5cGUgaXMgc2VsZWN0ZWRcbiAgICAgICAgICAgIHNlbGVjdFR5cGUgaXRlbVxuICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICMgZnVuY3Rpb24gdGhhdCBzdWdnZXN0IHR5cGVzXG4gICAgICAgIGZudHlwZXMgPSAoXywgY2IpIC0+IGNiIHR5cGVzXG4gICAgICAgICMgaWYgdGhlcmUgaXMgb25seSBvbmUsIHNldCBpdCBhcyBwb3NzaWJsZSBmb3IgcmV0dXJuIGtleVxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgdHlwZXNbMF0gaWYgdHlwZXMubGVuZ3RoID09IDFcbiAgICAgICAgIyByZW5kZXIgc3VnZ2VzdGlvbnNcbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm50eXBlcywgcmFuZ2UsIC0xLCBzZXRTdWdtb3ZlciwgKHR5cGUsIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIHR5cGVcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGUnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzJywge3RyaWcsIHR5cGVzfVxuXG4gICAgaGFuZGxlcGlsbCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGVudGlyZVRleHRBdEN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0eXBlb2YgcGlsbC50eXBlPy5zdWdnZXN0ID09ICdmdW5jdGlvbicgIyBkZWZpbml0ZWx5IGEgc3VnZ2VzdFxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgc3VnZ2VzdCBmdW5jdGlvbiBhcyBmbiB0byByZW5kZXIuc3VnZ2VzdFxuICAgICAgICBmbnZhbHMgPSAod29yZCwgY2IpIC0+IHBpbGwudHlwZS5zdWdnZXN0IHdvcmQsIGNiLCBwaWxsLnR5cGUsIHBpbGwudHJpZ1xuICAgICAgICAjIGhlbHBlciB3aGVuIHdlIGRlY2lkZSBvbiBhbiBpdGVtXG4gICAgICAgIHNlbGVjdEl0ZW0gPSAoaXRlbSkgLT5cbiAgICAgICAgICAgIHBpbGwuc2V0SXRlbSBpdGVtXG4gICAgICAgICAgICAjIGxhdGVyIHNpbmNlIGl0IG1heSBiZSBzZWxlY3QgZnJvbSBjbGljaywgd2hpY2ggaXMgbW91c2Vkb3duXG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXNlbGVjdCcsIHtwaWxsLCBpdGVtfVxuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnZhbHMsIHIsIC0xLCBzZXRTdWdtb3ZlciwgKGl0ZW0sIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gLT5cbiAgICAgICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgICAgICMgc2VsZWN0IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbSBpdGVtXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtJywge3BpbGwsIGl0ZW19XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGQgYWJvdXQgaXRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtcycsIHtwaWxsfVxuICAgICAgICByZXR1cm4gdHJ1ZSAjIHNpZ25hbCB3ZSBkZWFsdCB3aXRoIGl0XG5cbiAgICAjIG1vdmUgdGhlIGlucHV0IG91dCBvZiBhIHBpbGwgKGlmIHdlJ3JlIGluIGEgcGlsbClcbiAgICBwaWxsanVtcCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICBoYW5kbGVycyA9XG4gICAgICAgIGtleWRvd246ICAoZSkgLT5cblxuICAgICAgICAgICAgIyB0aGlzIGRvZXMgYW4gaW1wb3J0YW50IGVsLm5vcm1hbGl6ZSgpIHRoYXQgZW5zdXJlcyB3ZSBoYXZlXG4gICAgICAgICAgICAjIGNvbnRpZ3VvdXMgdGV4dCBub2RlcywgY3J1Y2lhbCBmb3IgdGhlIHJhbmdlIGxvZ2ljLlxuICAgICAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMTNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBkb250IHdhbnQgRE9NIGNoYW5nZVxuICAgICAgICAgICAgICAgIGlmIHN1Z3NlbGVjdD8oKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGlmIHBpbGxqdW1wKClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgc3VnbW92ZXJcbiAgICAgICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMzggICAgICAjIHVwXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoLTEpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgPT0gNDAgIyBkb3duXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoKzEpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSBpbiBbMzcsIDhdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsIC0xLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGJhY2t3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcbiAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlIGluIFszOSwgNDZdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtcGxhY2Vob2xkZXJcIj48L2Rpdj48L2Rpdj4nXG4gICAgc3VnZ2VzdCA9ICc8ZGl2IGNsYXNzPVwidHRib3gtc3VnLW92ZXJmbG93XCI+PGRpdiBjbGFzcz1cInR0Ym94LXN1Z2dlc3RcIj48L2Rpdj48L2Rpdj4nXG4gICAgIyBjYWNoZSBvZiBwaWxsIDxwaWxsaWQsIHBpbGw+IHN0cnVjdHVyZXNcbiAgICBwaWxscyA9IHt9XG4gICAgIyBoZWxwZXIgdG8gdGlkeSBjYWNoZVxuICAgIHRpZHlwaWxscyA9IGhvbGQgNTAwMCwgLT5cbiAgICAgICAgcHJlc2VudCA9ICRlbC5maW5kKCcudHRib3gtcGlsbCcpLm1hcCgtPiAkKEApLmF0dHIgJ2lkJykudG9BcnJheSgpXG4gICAgICAgIGRlbGV0ZSBwaWxsc1tpZF0gZm9yIGlkIGluIE9iamVjdC5rZXlzKHBpbGxzKSB3aGVuIHByZXNlbnQuaW5kZXhPZihpZCkgPCAwXG4gICAgICAgIG51bGxcbiAgICAjIHJldHVybiB0aGUgcGlsbCBzdHJ1Y3R1cmUgZm9yIGFuIGVsZW1lbnRcbiAgICBwaWxsZm9yID0gKGVsKSAtPiBwaWxsc1skKGVsKS5jbG9zZXN0KCcudHRib3gtcGlsbCcpLmF0dHIoJ2lkJyldXG4gICAgIyBnbyB0aHJvdWdoIGNhY2hlIGFuZCBlbnN1cmUgYWxsIHBpbGxzIGhhdmUgdGhlIGl0ZW0gdmFsdWUgb2YgdGhlXG4gICAgIyBlbGVtZW50IHZhbHVlLlxuICAgIGVuc3VyZUl0ZW1zID0gLT5cbiAgICAgICAgcGlsbC5lbnN1cmVJdGVtKCkgZm9yIGssIHBpbGwgb2YgcGlsbHNcbiAgICAgICAgbnVsbFxuXG4gICAgIyBjYWxsIG9mdGVuLiBmaXggdGhpbmdzLlxuICAgIHRpZHkgPSAtPlxuICAgICAgICAkaW5wID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgIGlucCA9ICRpbnBbMF1cbiAgICAgICAgIyBtZXJnZSBzdHVmZiB0b2dldGhlciBhbmQgcmVtb3ZlIGVtcHR5IHRleHRub2Rlcy5cbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgZmlyc3QgZW5zdXJlIHRoZXJlJ3MgYSA8YnI+IGF0IHRoZSBlbmQgKG9yIDxpPiBmb3IgSUUpXG4gICAgICAgIHRhZyA9IGlmIGlzSUUgdGhlbiAnaScgZWxzZSAnYnInXG4gICAgICAgIHVubGVzcyAkaW5wLmNoaWxkcmVuKCkubGFzdCgpLmlzIHRhZ1xuICAgICAgICAgICAgJGlucC5maW5kKFwiPiAje3RhZ31cIikucmVtb3ZlKClcbiAgICAgICAgICAgICRpbnAuYXBwZW5kIFwiPCN7dGFnfT5cIlxuICAgICAgICBjaGlsZHMgPSBpbnAuY2hpbGROb2Rlc1xuICAgICAgICBmaXJzdCA9IGNoaWxkc1swXVxuICAgICAgICAjIGVuc3VyZSB0aGUgd2hvbGUgdGhpbmdzIHN0YXJ0cyB3aXRoIGEgendualxuICAgICAgICBpZiBmaXJzdD8ubm9kZVR5cGUgIT0gMyBvciBmaXJzdD8ubm9kZVZhbHVlP1swXSAhPSB6d25qXG4gICAgICAgICAgICAkaW5wWzBdLmluc2VydEJlZm9yZSBkb2MuY3JlYXRlVGV4dE5vZGUoenduaiksIGZpcnN0XG4gICAgICAgICMgZW5zdXJlIHRoZXJlJ3MgYWx3YXlzIGEgenduaiBhZnRlciBldmVyeSBlbGVtZW50IG5vZGVcbiAgICAgICAgZm9yIG4gaW4gY2hpbGRzIHdoZW4gbj8ubm9kZVR5cGUgPT0gMSBhbmQgbj8ubmV4dFNpYmxpbmc/Lm5vZGVUeXBlID09IDFcbiAgICAgICAgICAgIGFwcGVuZEFmdGVyIG4sIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMgYWdhaW4sIGVuc3VyZSBjb250aWdvdXMgbm9kZXNcbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgbW92ZSBjdXJzb3IgdG8gbm90IGJlIG9uIGJhZCBlbGVtZW50IHBvc2l0aW9uc1xuICAgICAgICBpZiByID0gY3Vyc29yKCRlbFswXSlcbiAgICAgICAgICAgIGlmIChyLnN0YXJ0Q29udGFpbmVyID09IGlucCBvciByLmVuZENvbnRhaW5lciA9PSBpbnApXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBuIGlmIG5cbiAgICAgICAgICAgICMgZmlyZWZveCBtYW5hZ2VzIHRvIGZvY3VzIGFueXRoaW5nIGJ1dCB0aGUgb25seVxuICAgICAgICAgICAgIyBjb250ZW50ZWRpdGFibGU9dHJ1ZSBvZiB0aGUgcGlsbFxuICAgICAgICAgICAgcGFyZW4gPSByLnN0YXJ0Q29udGFpbmVyLnBhcmVudE5vZGVcbiAgICAgICAgICAgIGlmIHBhcmVuPy5ub2RlTmFtZSAhPSAnU1BBTicgYW5kIHBpbGwgPSBwaWxsZm9yIHBhcmVuXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICMga2VlcCBjYWNoZSBjbGVhblxuICAgICAgICB0aWR5cGlsbHMoKVxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRpYWxpc2UgYm94XG4gICAgaW5pdDogKGVsKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWRuJ3QgZmluZCBqUXVlcnlcIikgdW5sZXNzICQgPSBqUXVlcnlcbiAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgJGVsWzBdXG5cbiAgICAjIGRyYXcgc3R1ZmYgYW5kIGhvb2sgdXAgZXZlbnQgaGFuZGxlcnNcbiAgICBkcmF3OiAoaGFuZGxlcnMpIC0+XG4gICAgICAgICRlbC5odG1sIGh0bWxcbiAgICAgICAgJGVsLm9uKGV2ZW50LCBoYW5kbGVyKSBmb3IgZXZlbnQsIGhhbmRsZXIgb2YgaGFuZGxlcnNcblxuICAgICMgY2xlYXIgdGhlIHN0YXRlIG9mIHRoZSBpbnB1dFxuICAgIGNsZWFyOiAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LWlucHV0JykuZW1wdHkoKVxuICAgICAgICB0aWR5KClcblxuICAgICMgZm9jdXMgdGhlIGlucHV0IChpZiBpdCBkb2Vzbid0IGFscmVhZHkgaGF2ZSBmb2N1cylcbiAgICBmb2N1czogLT5cbiAgICAgICAgcmV0dXJuIGlmIGN1cnNvcigkZWxbMF0pICMgYWxyZWFkeSBoYXMgZm9jdXNcbiAgICAgICAgdGlkeSgpICMgZW5zdXJlIHdlIGhhdmUgYSBsYXN0IG5vZGUgdG8gcG9zaXRpb24gYmVmb3JlXG4gICAgICAgIG5zID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXNcbiAgICAgICAgbiA9IG5zW25zLmxlbmd0aCAtIDJdXG4gICAgICAgIHNldEN1cnNvckVsIG4sIC0xXG5cbiAgICAjIHJldHVybiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBib3hcbiAgICB2YWx1ZXM6IC0+XG4gICAgICAgIGVuc3VyZUl0ZW1zKClcbiAgICAgICAgQXJyYXk6OnNsaWNlLmNhbGwoJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXMpLm1hcCAobikgLT5cbiAgICAgICAgICAgIGlmIG4ubm9kZVR5cGUgPT0gMSBhbmQgbj8uY2xhc3NOYW1lPy5pbmRleE9mKCd0dGJveC1waWxsJykgPj0gMFxuICAgICAgICAgICAgICAgIHBpbGxmb3IgblxuICAgICAgICAgICAgZWxzZSBpZiBuLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICAgICBmaWx0ZXIgbi5ub2RlVmFsdWVcbiAgICAgICAgLmZpbHRlciBJXG5cbiAgICAjIHJlbW92ZSBzdWdnZ2VzdFxuICAgIHVuc3VnZ2VzdDogdW5zdWdnZXN0ID0gLT5cbiAgICAgICAgJCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnJlbW92ZSgpXG4gICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc2hvd2luZy1zdWdnZXN0J1xuXG4gICAgIyBzdGFydCBzdWdnZXN0XG4gICAgc3VnZ2VzdDogKGZuLCByYW5nZSwgaWR4LCBtb3ZlY2IsIHNlbGVjdGNiKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGZpbmQvY3JlYXRlIHN1Z2dlc3QtYm94XG4gICAgICAgICRzdWcgPSAkKCcudHRib3gtc3VnZ2VzdCcpXG4gICAgICAgIHVubGVzcyAkc3VnLmxlbmd0aFxuICAgICAgICAgICAgJG92ZXJmbHcgPSAkKHN1Z2dlc3QpXG4gICAgICAgICAgICAkc3VnID0gJG92ZXJmbHcuZmluZCAnLnR0Ym94LXN1Z2dlc3QnXG4gICAgICAgICAgICAjIGxvY2sgd2lkdGggdG8gcGFyZW50XG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgJ21pbi13aWR0aCcsICRib3goKS5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICMgYWRqdXN0IGZvciBib3JkZXIgb2YgcGFyZW50XG4gICAgICAgICAgICBib3JkID0gcGFyc2VJbnQgJGVsLmZpbmQoJy50dGJveC1vdmVyZmxvdycpLmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpXG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgdG9wOiRlbC5vdXRlckhlaWdodCgpIC0gYm9yZFxuICAgICAgICAgICAgIyBhcHBlbmQgdG8gYm94XG4gICAgICAgICAgICAkYm94KCkuYXBwZW5kICRvdmVyZmx3XG4gICAgICAgICAgICAjIGluZGljYXRlIHdlIGFyZSBzaG93aW5nXG4gICAgICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCcpXG4gICAgICAgICMgZW1wdHkgc3VnZ2VzdCBib3ggdG8gc3RhcnQgZnJlc2hcbiAgICAgICAgJHN1Zy5odG1sKCcnKTsgJHN1Zy5vZmYoKVxuICAgICAgICAjIGNsYXNzIHRvIGhvb2sgc3R5bGluZyB3aGVuIHN1Z2dlc3RpbmdcbiAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LXJlcXVlc3QnKVxuICAgICAgICAjIHJlcXVlc3QgdG8gZ2V0IHN1Z2dlc3QgZWxlbWVudHNcbiAgICAgICAgZm4gd29yZCwgKGxpc3QpIC0+XG4gICAgICAgICAgICAjIG5vdCByZXF1ZXN0aW5nIGFueW1vcmVcbiAgICAgICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc3VnZ2VzdC1yZXF1ZXN0J1xuICAgICAgICAgICAgIyBsb2NhbCB0b0h0bWwgd2l0aCB3b3JkXG4gICAgICAgICAgICBsb2NUb0h0bWwgPSB0b0h0bWwod29yZClcbiAgICAgICAgICAgICMgdHVybiBsaXN0IGludG8gaHRtbFxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoIChsKSAtPlxuICAgICAgICAgICAgICAgICRoID0gJChsb2NUb0h0bWwobCkpXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgaWYgbC5kaXZpZGVyXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWRpdmlkZXInXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1pdGVtJ1xuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGwuY2xhc3NOYW1lIGlmIGwuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgJHN1Zy5hcHBlbmQgJGhcbiAgICAgICAgICAgICMgbGlzdCB3aXRob3V0IGRpdmlkZXJzXG4gICAgICAgICAgICBub2RpdmlkID0gbGlzdC5maWx0ZXIgKGwpIC0+ICFsLmRpdmlkZXJcbiAgICAgICAgICAgIHByZXZpZHggPSBudWxsXG4gICAgICAgICAgICBkbyBzZWxlY3RJZHggPSAoZG9zdGFydCA9IGZhbHNlKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBpZHggPCAwIGFuZCAhZG9zdGFydFxuICAgICAgICAgICAgICAgIGlkeCA9IDAgaWYgaWR4IDwgMFxuICAgICAgICAgICAgICAgIGlkeCA9IG5vZGl2aWQubGVuZ3RoIC0gMSBpZiBpZHggPj0gbm9kaXZpZC5sZW5ndGhcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcHJldmlkeCA9PSBpZHhcbiAgICAgICAgICAgICAgICBwcmV2aWR4ID0gaWR4XG4gICAgICAgICAgICAgICAgJHN1Zy5maW5kKCcudHRib3gtc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWwgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuZXEoaWR4KVxuICAgICAgICAgICAgICAgICRzZWwuYWRkQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsWzBdPy5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpZHhdXG4gICAgICAgICAgICAjIGhhbmRsZSBjbGljayBvbiBhIHN1Z2dlc3QgaXRlbSwgbW91c2Vkb3duIHNpbmNlIGNsaWNrXG4gICAgICAgICAgICAjIHdpbGwgZmlnaHQgd2l0aCBmb2N1c291dCBvbiB0aGUgcGlsbFxuICAgICAgICAgICAgJHN1Zy5vbiAnbW91c2Vkb3duJywgKGV2KSAtPlxuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKSAjIG5vIGxvc2UgZm9jdXNcbiAgICAgICAgICAgICAgICAkaXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdCgnLnR0Ym94LXN1Z2dlc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyAkaXQubGVuZ3RoXG4gICAgICAgICAgICAgICAgaSA9ICRzdWcuY2hpbGRyZW4oJy50dGJveC1zdWdnZXN0LWl0ZW0nKS5pbmRleCAkaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIGkgPj0gMFxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaV0sIHRydWVcbiAgICAgICAgICAgICMgY2FsbGJhY2sgcGFzc2VkIHRvIHBhcmVudCBmb3Iga2V5IG5hdmlnYXRpb25cbiAgICAgICAgICAgIG1vdmVjYiAob2ZmcykgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIG9mZnNcbiAgICAgICAgICAgICAgICBpZHggPSBpZHggKyBvZmZzXG4gICAgICAgICAgICAgICAgc2VsZWN0SWR4IHRydWVcblxuICAgICMgaW5zZXJ0IGEgcGlsbCBmb3IgdHlwZS9pdGVtIGF0IGdpdmVuIHJhbmdlXG4gICAgcGlsbGlmeTogKHJhbmdlLCB0eXBlLCBpdGVtLCBkaXNwYXRjaCkgLT5cbiAgICAgICAgIyB0aGUgdHJpZyBpcyByZWFkIGZyb20gdGhlIHR5cGVcbiAgICAgICAgdHJpZyA9IHR5cGUudHJpZ1xuICAgICAgICAjIGNyZWF0ZSBwaWxsIGh0bWxcbiAgICAgICAgZGZuID0gaWYgdHJpZ1xuICAgICAgICAgICAgaWYgdHJpZy5wcmVmaXggdGhlbiB0cmlnLnN5bWJvbCBlbHNlIHR5cGUubmFtZSArIHRyaWcuc3ltYm9sXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHR5cGUubmFtZVxuICAgICAgICAkcGlsbCA9ICQoXCI8ZGl2IGNsYXNzPVxcXCJ0dGJveC1waWxsXFxcIj48ZGl2IGNsYXNzPVxcXCJ0dGJveC1waWxsLWNsb3NlXFxcIj7DlzwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPGRmbj4je2Rmbn08L2Rmbj48c3Bhbj48L3NwYW4+PC9kaXY+XCIpXG4gICAgICAgICRwaWxsLmZpbmQoJyonKS5hbmRTZWxmKCkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJ1xuICAgICAgICAoJHNwYW4gPSAkcGlsbC5maW5kKCdzcGFuJykpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICd0cnVlJ1xuICAgICAgICAjIGlmIHByZWZpeCBzdHlsZSBwaWxsXG4gICAgICAgICRwaWxsLmFkZENsYXNzICd0dGJveC1waWxsLXByZWZpeCcgaWYgdHlwZS50cmlnLnByZWZpeFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLnRyaWcuY2xhc3NOYW1lIGlmIHR5cGUudHJpZy5jbGFzc05hbWVcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS5jbGFzc05hbWUgaWYgdHlwZS5jbGFzc05hbWVcbiAgICAgICAgIyBnZW5lcmF0ZSBpZCB0byBhc3NvY2lhdGUgd2l0aCBtZW0gc3RydWN0dXJlXG4gICAgICAgIGlkID0gXCJ0dGJveHBpbGwje0RhdGUubm93KCl9XCJcbiAgICAgICAgJHBpbGwuYXR0ciAnaWQnLCBpZFxuICAgICAgICAjIHJlcGxhY2UgY29udGVudHMgd2l0aCBwaWxsXG4gICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKClcbiAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSAkcGlsbFswXVxuICAgICAgICAjIHJlbW92ZSBwaWxsIGZyb20gRE9NLCB3aGljaCBpbiB0dXJuIHJlbW92ZXMgaXQgY29tcGxldGVseVxuICAgICAgICByZW1vdmUgPSAtPlxuICAgICAgICAgICAgJHBpbGwucmVtb3ZlKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdwaWxscmVtb3ZlJywge3BpbGx9XG4gICAgICAgICMgd2lyZSB1cCBjbG9zZSBidXR0b25cbiAgICAgICAgJHBpbGwuZmluZCgnLnR0Ym94LXBpbGwtY2xvc2UnKS5vbiAnY2xpY2snLCByZW1vdmVcbiAgICAgICAgIyBmb3JtYXQgdGhlIHRleHQgdXNpbmcgdGhlIHR5cGUgZm9ybWF0dGVyXG4gICAgICAgIGZvcm1hdCA9IC0+ICRzcGFuLnRleHQgdHlwZS5mb3JtYXQgJHNwYW4udGV4dCgpXG4gICAgICAgICMgbWF5YmUgcnVuIGZvcm1hdCBvbiBmb2N1c291dFxuICAgICAgICAkcGlsbC5vbiAnZm9jdXNvdXQnLCAtPlxuICAgICAgICAgICAgIyBkaXNwYXRjaCBsYXRlciB0byBhbGxvdyBmb3IgY2xpY2sgb24gc3VnZ2VzdFxuICAgICAgICAgICAgcGlsbC5lbnN1cmVJdGVtKClcbiAgICAgICAgICAgIGZvcm1hdCgpIGlmIHBpbGwuaXRlbT8uX3RleHRcbiAgICAgICAgICAgIGRpc3BhdGNoICdwaWxsZm9jdXNvdXQnLCB7cGlsbH1cbiAgICAgICAgIyBoZWxwZXIgZnVuY3Rpb24gdG8gc2NvbGwgcGlsbCBpbnRvIHZpZXdcbiAgICAgICAgc2Nyb2xsSW4gPSAtPlxuICAgICAgICAgICAgJHBpbGwuYWZ0ZXIgJHQgPSAkKCc8c3BhbiBzdHlsZT1cIndpZHRoOjFweFwiPicpXG4gICAgICAgICAgICAkdFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAkdC5yZW1vdmUoKVxuICAgICAgICAjIHN0b3AgcmVzaXplIGhhbmRsZXMgaW4gSUVcbiAgICAgICAgaWYgaXNJRVxuICAgICAgICAgICAgJHBpbGwub24gJ21vdXNlZG93bicsIChlKSAtPlxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAjIHRoZSBwaWxsIGZhY2FkZVxuICAgICAgICBwaWxsID0gcGlsbHNbaWRdID0ge1xuICAgICAgICAgICAgaWQsIHRyaWcsIHR5cGUsIHJlbW92ZSxcbiAgICAgICAgICAgICMgc2V0IHRoZSBpdGVtIHZhbHVlIGZvciB0aGlzIHBpbGxcbiAgICAgICAgICAgIHNldEl0ZW06IChAaXRlbSkgLT4gJHNwYW4udGV4dCB0b1RleHQgQGl0ZW1cbiAgICAgICAgICAgICMgcG9zaXRpb24gaW4gdGhlIHBpbGwgdmFsdWVcbiAgICAgICAgICAgIHNldEN1cnNvckluOiAtPlxuICAgICAgICAgICAgICAgIHNjcm9sbEluKClcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCAkc3BhblswXVxuICAgICAgICAgICAgIyBwb3NpdGlvbiB0aGUgY3Vyc29yIGFmdGVyIHRoZSBwaWxsXG4gICAgICAgICAgICBzZXRDdXJzb3JBZnRlcjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2liID0gJHBpbGxbMF0/Lm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgc2liIGlmIHNpYlxuICAgICAgICAgICAgICAgIHNraXBad25qICRlbFswXSwgKzEgIyBGRiBzaG93cyBubyBjdXJzb3IgaWYgd2Ugc3RhbmQgb24gMFxuICAgICAgICB9XG4gICAgICAgIGRlZiBwaWxsLFxuICAgICAgICAgICAgIyBlbnN1cmUgdGhlIHRleHQgb2YgdGhlIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIEBpdGVtXG4gICAgICAgICAgICBlbnN1cmVJdGVtOiAtPlxuICAgICAgICAgICAgICAgIHN0eHQgPSAkc3Bhbi50ZXh0KCkudHJpbSgpXG4gICAgICAgICAgICAgICAgcHR4dCA9IHRvVGV4dCBwaWxsPy5pdGVtXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRJdGVtIHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=