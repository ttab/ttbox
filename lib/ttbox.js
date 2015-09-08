(function() {
  var I, IEVer, Trigger, Type, UA, appendAfter, appendBefore, arrayFilter, cursor, def, doc, entireTextAtCursor, filter, filterA0, filterZwnj, find, findInRange, firstIsWhite, glob, hexdump, hold, isChrome, isIE, isParent, last, lastIsWhite, later, merge, rangeStr, ref, ref1, ref2, setCursorEl, setCursorPos, skipZwnj, suggestHtml, toHtml, toText, ttbox, wordRangeAtCursor, zwnj,
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

  arrayFilter = function(as, fn) {
    var a, j, len1, results;
    results = [];
    for (j = 0, len1 = as.length; j < len1; j++) {
      a = as[j];
      if (fn(a)) {
        results.push(a);
      }
    }
    return results;
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
    styles = ".ttbox * { box-sizing: border-box; width: auto; } .ttbox { position: relative; box-sizing: border-box; } .ttbox dfn { font-style: normal; display: inline-block; margin: 0; padding: 0; } .ttbox-overflow { /* border: 1px solid #bbb; */ /* border-radius: 3px; */ overflow-x: auto; overflow-y: hidden; } .ttbox-overflow::-webkit-scrollbar { display: none; } .ttbox-showing-suggest .ttbox-overflow { border-bottom-left-radius: 0; border-bottom-right-radius: 0; } .ttbox-input { padding-left: 4px; white-space: nowrap; outline: none; } .ttbox-input * { outline: none; } .ttbox-input * { display: inline-block; white-space: nowrap; } .ttbox-input br { display: inline; } .ttbox-sug-overflow { position: absolute; left: 0; /* border: 1px solid #bbb; */ /* border-radius: 3px; */ border-top: none; border-top-left-radius: 0; border-top-right-radius: 0; border-top: none; box-shadow: 0 2px 2px rgba(0,0,0,0.3); max-height: 300px; overflow-x: hidden; overflow-y: auto; } .ttbox-suggest { min-height: 5px; background: white; line-height: 38px; } .ttbox-suggest > .ttbox-suggest-item:first-child { padding-top: 5px; } .ttbox-suggest > .ttbox-suggest-item:last-child { padding-bottom: 5px; } .ttbox-suggest-item { cursor: pointer; padding: 0 10px 0 25px; white-space: nowrap; } .ttbox-suggest-item.disabled { display: none; } .ttbox-suggest-item dfn { min-width: 70px; position: relative; } .ttbox-suggest-item span { color: #ccc; } .ttbox-suggest-divider { position: relative; padding: 0 10px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-suggest-divider span { position: relative; z-index: 1; background: white; color: #929292; padding-right: 20px; cursor: default; } .ttbox-suggest-divider hr { position: absolute; margin-top: 1.15em; left: 20px; right: 10px; border-top: 1px solid #ddd; border-bottom: none; } .ttbox-selected { background: #eee; } .ttbox-pill { position: relative; line-height: 24px; margin: 0 4px; background: #5cb85c; border: 1px solid #58b658; border-radius: 3px; padding: 0 12px; color: white; min-width: 30px; } .ttbox-pill dfn { padding: 0 3px 0 14px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; cursor: default; } .ttbox-pill-prefix dfn { padding-right: 0; display: block; } .ttbox-pill-close { display: inline-block; position: absolute; top: 0; left: 0; padding: 0 5px; line-height: 22px; height: 24px; border-right: 1px solid rgba(255,255,255,0.2); cursor: pointer; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-pill span { min-width: 5px; } .ttbox-placeholder { display: none; opacity: 0.4; position: absolute; top: 0; left: 5px; pointer-events: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; }";
    css = doc.createElement('style');
    css.type = 'text/css';
    css.innerHTML = styles;
    return doc.head.appendChild(css);
  })();

  Type = (function() {
    function Type(name1, opts) {
      var disabled;
      this.name = name1;
      disabled = {
        setDisabled: (function(_this) {
          return function(disabled) {
            _this.disabled = !!disabled;
            return _this;
          };
        })(this),
        isDisabled: (function(_this) {
          return function() {
            return !!_this.disabled;
          };
        })(this)
      };
      merge(this, {
        format: I
      }, opts, disabled);
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
      if (str.indexOf(symbol) >= 0) {
        return;
      }
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
    el.addEventListener('ttbox:pillremove', function(ev) {
      var ref3;
      if ((ref3 = ev.pill) != null) {
        ref3.type.setDisabled(false);
      }
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
      var fntypes, ftypes, sugselectfor, word;
      ftypes = arrayFilter(types, function(type) {
        return !type.isDisabled();
      });
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
        return cb(ftypes);
      };
      if (types.length === 1) {
        sugselect = sugselectfor(ftypes[0]);
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
        ftypes: ftypes
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
      },
      paste: function(e) {
        var r, ref3, txt;
        e.preventDefault();
        e = (ref3 = e.originalEvent) != null ? ref3 : e;
        if (e != null ? e.clipboardData : void 0) {
          txt = e.clipboardData.getData('text/plain');
          doc.execCommand('insertText', false, txt);
        } else if (window.clipboardData) {
          txt = window.clipboardData.getData('Text');
          if (!(r = cursor(el))) {
            return;
          }
          r.insertNode(doc.createTextNode(txt));
        }
        update();
        return false;
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
          var $pill, $span, dfn, format, id, pill, remove, scrollIn, tooMany, trig;
          if (type.limitOne) {
            type.setDisabled(true);
            tooMany = !!$('.ttbox-pill').filter(function(i, pill) {
              return $(pill).data('type') === type.name;
            }).length;
            if (tooMany) {
              return false;
            }
          }
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
          $pill.attr('data-type', type.name);
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

//# sourceMappingURL=data:application/json;base64,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S0FBSixFQUFXO0lBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxNQUFkO0dBQVg7O0VBR0EsSUFBRyxPQUFPLE1BQVAsS0FBaUIsUUFBcEI7SUFDSSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQURyQjtHQUFBLE1BRUssSUFBRyxPQUFPLE1BQVAsS0FBaUIsVUFBakIsSUFBZ0MsTUFBTSxDQUFDLEdBQTFDO0lBQ0QsTUFBQSxDQUFPLFNBQUE7YUFBRztJQUFILENBQVAsRUFEQztHQUFBLE1BQUE7SUFHRCxJQUFJLENBQUMsS0FBTCxHQUFhLE1BSFo7O0FBcDhCTCIsImZpbGUiOiJ0dGJveC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImdsb2IgPSBnbG9iYWwgPyB3aW5kb3dcblxuZG9jICAgPSBnbG9iLmRvY3VtZW50XG5JICAgICA9IChhKSAtPiBhXG5tZXJnZSA9ICh0LCBvcy4uLikgLT4gdFtrXSA9IHYgZm9yIGssdiBvZiBvIHdoZW4gdiAhPSB1bmRlZmluZWQgZm9yIG8gaW4gb3M7IHRcbmxhdGVyID0gKGZuKSAtPiBzZXRUaW1lb3V0IGZuLCAxXG5ob2xkICA9IChtcywgZikgLT4gbGFzdCA9IDA7IHRpbSA9IG51bGw7IChhcy4uLikgLT5cbiAgICBjbGVhclRpbWVvdXQgdGltIGlmIHRpbVxuICAgIHRpbSA9IHNldFRpbWVvdXQgKC0+ZiBhcy4uLiksIG1zXG5sYXN0ICA9IChhcykgLT4gYXM/W2FzLmxlbmd0aCAtIDFdXG5maW5kICA9IChhcywgZm4pIC0+IHJldHVybiBhIGZvciBhIGluIGFzIHdoZW4gZm4oYSlcbmFycmF5RmlsdGVyID0gKGFzLGZuKSAtPiAoYSBmb3IgYSBpbiBhcyB3aGVuIGZuKGEpKVxuXG5VQSA9IGdsb2I/Lm5hdmlnYXRvcj8udXNlckFnZW50XG5baXNJRSwgSUVWZXJdID0gL01TSUUgKFswLTldezEsfVsuMC05XXswLH0pLy5leGVjKFVBKSA/IFtdXG5JRVZlciA9IHBhcnNlSW50IElFVmVyIGlmIElFVmVyXG5pc0Nocm9tZSAgPSBVQS5pbmRleE9mKCdDaHJvbWUnKSA+IDBcblxuIyBkZWZpbmUgYW4gaW52aXNpYmxlIHByb3BlcnR5XG5kZWYgPSAob2JqLCBwcm9wcykgLT4gZm9yIG5hbWUsIHZhbHVlIG9mIHByb3BzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iaiwgbmFtZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICBudWxsXG5cbnp3bmogICAgICAgICA9IFwi4oCLXCIgIyAmenduajtcbmZpbHRlckEwICAgICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTAwYTAvZywgJyAnICMgbmJzcFxuZmlsdGVyWnduaiAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MjAwYi9nLCAnJ1xuZmlsdGVyICAgICAgID0gKHMpIC0+IGZpbHRlckEwIGZpbHRlclp3bmogc1xuYXBwZW5kQWZ0ZXIgID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbC5uZXh0U2libGluZylcbmFwcGVuZEJlZm9yZSA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwpXG5oZXhkdW1wICAgICAgPSAocykgLT4gKGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikgZm9yIGMgaW4gcykuam9pbignICcpXG5cbiMgaW5qZWN0IGNzc1xuZG8gLT5cbiAgICBzdHlsZXMgPSBcIlxuLnR0Ym94ICoge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgd2lkdGg6IGF1dG87XG59XG5cbi50dGJveCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG4udHRib3ggZGZuIHtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG4udHRib3gtb3ZlcmZsb3cge1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7ICovXG4gICAgLyogYm9yZGVyLXJhZGl1czogM3B4OyAqL1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuLnR0Ym94LW92ZXJmbG93Ojotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgZGlzcGxheTogbm9uZTtcbn1cbi50dGJveC1zaG93aW5nLXN1Z2dlc3QgLnR0Ym94LW92ZXJmbG93IHtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xufVxuXG4udHRib3gtaW5wdXQge1xuICAgIHBhZGRpbmctbGVmdDogNHB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cbi50dGJveC1pbnB1dCAqIHtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuXG4udHRib3gtaW5wdXQgKiB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4udHRib3gtaW5wdXQgYnIge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbn1cblxuLnR0Ym94LXN1Zy1vdmVyZmxvdyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm94LXNoYWRvdzogMCAycHggMnB4IHJnYmEoMCwwLDAsMC4zKTtcbiAgICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi50dGJveC1zdWdnZXN0IHtcbiAgICBtaW4taGVpZ2h0OiA1cHg7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgbGluZS1oZWlnaHQ6IDM4cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06Zmlyc3QtY2hpbGQge1xuICAgIHBhZGRpbmctdG9wOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06bGFzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0ge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBwYWRkaW5nOiAwIDEwcHggMCAyNXB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi50dGJveC1zdWdnZXN0LWl0ZW0uZGlzYWJsZWQge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG5cbi50dGJveC1zdWdnZXN0LWl0ZW0gZGZuIHtcbiAgICBtaW4td2lkdGg6IDcwcHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSBzcGFuIHtcbiAgICBjb2xvcjogI2NjYztcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiAwIDEwcHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIgc3BhbiB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDE7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgY29sb3I6ICM5MjkyOTI7XG4gICAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIGhyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbWFyZ2luLXRvcDogMS4xNWVtO1xuICAgIGxlZnQ6IDIwcHg7XG4gICAgcmlnaHQ6IDEwcHg7XG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQ7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbn1cbi50dGJveC1zZWxlY3RlZCB7XG4gICAgYmFja2dyb3VuZDogI2VlZTtcbn1cblxuLnR0Ym94LXBpbGwge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsaW5lLWhlaWdodDogMjRweDtcbiAgICBtYXJnaW46IDAgNHB4O1xuICAgIGJhY2tncm91bmQ6ICM1Y2I4NWM7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzU4YjY1ODtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMCAxMnB4O1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBtaW4td2lkdGg6IDMwcHg7XG59XG4udHRib3gtcGlsbCBkZm4ge1xuICAgIHBhZGRpbmc6IDAgM3B4IDAgMTRweDtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbn1cbi50dGJveC1waWxsLXByZWZpeCBkZm4ge1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG4udHRib3gtcGlsbC1jbG9zZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBwYWRkaW5nOiAwIDVweDtcbiAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXBpbGwgc3BhbiB7XG4gICAgbWluLXdpZHRoOiA1cHg7XG59XG5cbi50dGJveC1wbGFjZWhvbGRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiA1cHg7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cblwiXG4gICAgY3NzID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBjc3MudHlwZSA9ICd0ZXh0L2NzcydcbiAgICBjc3MuaW5uZXJIVE1MID0gc3R5bGVzXG4gICAgZG9jLmhlYWQuYXBwZW5kQ2hpbGQgY3NzXG5cbmNsYXNzIFR5cGVcbiAgICBjb25zdHJ1Y3RvcjogKEBuYW1lLCBvcHRzKSAtPlxuICAgICAgICBkaXNhYmxlZCA9XG4gICAgICAgICAgICBzZXREaXNhYmxlZDogKGRpc2FibGVkKT0+IEBkaXNhYmxlZCA9ICEhZGlzYWJsZWQ7IEBcbiAgICAgICAgICAgIGlzRGlzYWJsZWQ6ID0+ICEhQGRpc2FibGVkXG4gICAgICAgIG1lcmdlIEAsIHtmb3JtYXQ6SX0sIG9wdHMsIGRpc2FibGVkXG5cbmNsYXNzIFRyaWdnZXJcbiAgICBjb25zdHJ1Y3RvcjogKEBzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgICAgICBtZXJnZSBALCBvcHRzXG4gICAgICAgIEB0eXBlcyA9IGlmIEFycmF5LmlzQXJyYXkgdHlwZXMgdGhlbiB0eXBlcyBlbHNlIFt0eXBlc11cbiAgICAgICAgIyBzZXQgYmFjayByZWZlcmVuY2VcbiAgICAgICAgdC50cmlnID0gdGhpcyBmb3IgdCBpbiBAdHlwZXNcbiAgICAgICAgaWYgQHByZWZpeFxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudCBoYXZlIG11bHRpcGxlIHR5cGVzIHdpdGggcHJlZml4IHRyaWdnZXJcIikgaWYgQHR5cGVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHJlID0gUmVnRXhwIFwiXihcXFxcdyopXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuXG4jIFNraXAgenduaiBjaGFycyB3aGVuIG1vdmluZyBsZWZ0L3JpZ2h0XG5za2lwWnduaiA9IChwZWwsIGQsIGVuZCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIG4gPSBpZiBlbmQgdGhlbiByLmVuZENvbnRhaW5lciBlbHNlIHIuc3RhcnRDb250YWluZXJcbiAgICBpID0gaWYgZW5kIHRoZW4gci5lbmRPZmZzZXQgZWxzZSByLnN0YXJ0T2Zmc2V0XG4gICAgcmV0dXJuIHVubGVzcyBuLm5vZGVUeXBlID09IDNcbiAgICBjID0gbi5ub2RlVmFsdWUuY2hhckNvZGVBdCAoaWYgZCA8IDAgdGhlbiBpICsgZCBlbHNlIGkpXG4gICAgaWYgYyA9PSA4MjAzXG4gICAgICAgICMgbW92ZVxuICAgICAgICBzZXRDdXJzb3JQb3MgciwgaSArIGRcbiAgICAgICAgc2tpcFp3bmogZCwgZW5kICMgYW5kIG1heWJlIGNvbnRpbnVlIG1vdmluZz9cblxuaXNQYXJlbnQgPSAocG4sIG4pIC0+XG4gICAgaWYgbiA9PSBudWxsIHRoZW4gZmFsc2UgZWxzZSBpZiBwbiA9PSBuIHRoZW4gdHJ1ZSBlbHNlIGlzUGFyZW50KHBuLCBuLnBhcmVudE5vZGUpXG5cbiMgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbmN1cnNvciA9IChwZWwpIC0+XG4gICAgcyA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHJldHVybiB1bmxlc3Mgcy5yYW5nZUNvdW50XG4gICAgciA9IHMuZ2V0UmFuZ2VBdCgwKVxuICAgIGlmIGlzUGFyZW50KHBlbCwgci5zdGFydENvbnRhaW5lcikgdGhlbiByIGVsc2UgbnVsbFxuXG4jIGZpbHRlciB0aGUgcmFuZ2UgdG8gZ2V0IHJpZCBvZiB1bndhbnRlZCBjaGFyc1xucmFuZ2VTdHIgPSAocikgLT4gZmlsdGVyIHIudG9TdHJpbmcoKVxuXG5maXJzdElzV2hpdGUgPSAocykgLT4gL15cXHMuKi8udGVzdChzID8gJycpXG5sYXN0SXNXaGl0ZSAgPSAocykgLT4gLy4qXFxzJC8udGVzdChzID8gJycpXG5cbndvcmRSYW5nZUF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgIyBleHBhbmQgYmVnaW5uaW5nXG4gICAgd2hpbGUgdC5zdGFydE9mZnNldCA+IDAgYW5kIG5vdCBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgLSAxXG4gICAgIyBvbmUgZm9yd2FyZCBhZ2FpblxuICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCArIDEgaWYgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAjIGV4cGFuZCBlbmRcbiAgICBsZW4gPSB0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwXG4gICAgd2hpbGUgdC5lbmRPZmZzZXQgPCBsZW4gYW5kIG5vdCBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCArIDFcbiAgICAjIG9uZSBiYWNrIGFnYWluXG4gICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0IC0gMSBpZiBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgcmV0dXJuIHRcblxuZW50aXJlVGV4dEF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgdC5zZWxlY3ROb2RlQ29udGVudHMgdC5zdGFydENvbnRhaW5lclxuICAgIHJldHVybiB0XG5cbmZpbmRJblJhbmdlID0gKHIsIGNoYXIpIC0+XG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgbWF4ID0gKHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDApIC0gMVxuICAgIGZvciBpIGluIFt0LnN0YXJ0T2Zmc2V0Li5tYXhdIGJ5IDFcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCBpXG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCBpICsgMVxuICAgICAgICByZXR1cm4gaSBpZiB0LnRvU3RyaW5nKCkgPT0gY2hhclxuICAgIHJldHVybiAtMVxuXG5zZXRDdXJzb3JQb3MgPSAociwgcG9zID0gMCkgLT5cbiAgICB0ID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICB0LnNldFN0YXJ0IHIuc3RhcnRDb250YWluZXIsIHBvc1xuICAgIHQuc2V0RW5kIHIuc3RhcnRDb250YWluZXIsIHBvc1xuICAgIHNlbCA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgIHNlbC5hZGRSYW5nZSB0XG5cbnNldEN1cnNvckVsID0gKGVsLCBwb3MgPSAwKSAtPlxuICAgIHIgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHIuc2VsZWN0Tm9kZUNvbnRlbnRzIGVsXG4gICAgcG9zID0gZWw/Lm5vZGVWYWx1ZT8ubGVuZ3RoIGlmIHBvcyA8IDBcbiAgICBzZXRDdXJzb3JQb3MgciwgcG9zXG5cbiMgRnVuY3Rpb24gdG8gbWFrZSB0dGJveCBvdXQgb2YgYW4gZWxlbWVudCB3aXRoIHRyaWdnZXJzXG4jXG50dGJveCA9IChlbCwgdHJpZ3MuLi4pIC0+XG5cbiAgICAjIGxvY2FsIHJlZmVyZW5jZSB0byByZW5kZXIgcGx1Z1xuICAgIHJlbmRlciA9IHR0Ym94LnJlbmRlcigpXG5cbiAgICAjIGxldCByZW5kZXIgZGVjaWRlIHdlIGhhdmUgYSBnb29kIGVsXG4gICAgZWwgPSByZW5kZXIuaW5pdChlbClcblxuICAgICMgYW5kIGNoZWNrIHdlIGdvdCBhIGdvb2QgdGhpbmcgYmFja1xuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIERJVicpIHVubGVzcyBlbC50YWdOYW1lID09ICdESVYnXG5cbiAgICAjIGRpc3BhdGNoIGV2ZW50cyBvbiBpbmNvbWluZyBkaXZcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50ICdFdmVudCdcbiAgICAgICAgbWVyZ2UgZSwgb3B0cywge3R0Ym94OmZhw6dhZGV9XG4gICAgICAgIGUuaW5pdEV2ZW50IFwidHRib3g6I3tuYW1lfVwiLCB0cnVlLCBmYWxzZVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50IGVcblxuICAgICMgYWRkIGEgbmV3IHBpbGwgdG8gaW5wdXRcbiAgICBhZGRwaWxsID0gKHR5cGUsIGl0ZW0pIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgIyBpbXBsaWNpdGx5IGRvZXMgdGlkeVxuICAgICAgICByZXR1cm4gcmVuZGVyLnBpbGxpZnkgciwgdHlwZSwgaXRlbSwgZGlzcGF0Y2hcbiAgICBhZGR0ZXh0ID0gKHRleHQpIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgIHJldHVybiByXG4gICAgY2xlYXIgPSAtPlxuICAgICAgICByZW5kZXIuY2xlYXIoKVxuICAgICAgICB1cGRhdGUoKVxuICAgIHRyaWdnZXIgPSAoc3ltYm9sKSAtPlxuICAgICAgICAjIG1ha2Ugc3VyZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICByZW5kZXIuZm9jdXMoKSAjIGVuc3VyZSB3ZSBoYXZlIGZvY3VzXG4gICAgICAgICMgd2Ugd2FudCB0byBiZSB0byB0aGUgcmlnaHQgb2YgYW55IHp3bmpcbiAgICAgICAgIyBpbiB0aGUgY3VycmVudCB0ZXh0IGJsb2NrXG4gICAgICAgIHNraXBad25qIGVsLCAxXG4gICAgICAgICMgZ2V0IHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICBzdHIgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGRvIG5vdGhpbmcgaWYgY3VycmVudCB3b3JkIGFscmVhZHkgY29udGFpbnMgdHJpZ2dlciBzeW1ib2xcbiAgICAgICAgcmV0dXJuIGlmIHN0ci5pbmRleE9mKHN5bWJvbCkgPj0gMFxuICAgICAgICAjIGluc2VydCBzcGFjZSBpZiB3ZSBoYXZlIGNvbnRlbnQgYmVmb3JlaGFuZFxuICAgICAgICBpbnNlcnQgPSBpZiBzdHIgPT0gJycgdGhlbiBzeW1ib2wgZWxzZSBcIiAje3N5bWJvbH1cIlxuICAgICAgICBjdXJzb3IoZWwpLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlIGluc2VydFxuICAgICAgICAjIG1ha2UgY29udGlndW91cyB0ZXh0IG5vZGVzXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgIyBwb3NpdGlvbiBhdCB0aGUgdmVyeSBlbmQgb2YgdGhpc1xuICAgICAgICByID0gZW50aXJlVGV4dEF0Q3Vyc29yKGVsKVxuICAgICAgICBzZXRDdXJzb3JQb3Mgciwgci5lbmRPZmZzZXQgLSBzeW1ib2wubGVuZ3RoXG4gICAgICAgICMgdHJpZ2dlciBzdWdnZXN0XG4gICAgICAgIHVwZGF0ZSgpXG5cbiAgICAjIGV4cG9zZWQgb3BlcmF0aW9uc1xuICAgIGZhw6dhZGUgPSB7XG4gICAgICAgIGFkZHBpbGwsIGFkZHRleHQsIHJlbmRlciwgY2xlYXIsIHRyaWdnZXJcbiAgICAgICAgdmFsdWVzOiAtPiByZW5kZXIudmFsdWVzKClcbiAgICAgICAgc2V0dmFsdWVzOiAodmFsdWVzKSAtPlxuICAgICAgICAgICAgY2xlYXIoKVxuICAgICAgICAgICAgdmFsdWVzLmZvckVhY2ggKHYpIC0+XG4gICAgICAgICAgICAgICAgaWYgdHlwZW9mIHYgPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgYWRkdGV4dCB2XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBhZGRwaWxsIHYudHlwZSwgdi5pdGVtXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICBmb2N1czogLT4gcmVuZGVyLmZvY3VzKClcbiAgICAgICAgcGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICAgICByZW5kZXIuc2V0UGxhY2Vob2xkZXIodHh0KVxuICAgICAgICAgICAgdXBkYXRlKCkgIyB0b2dnbGUgcGxhY2Vob2xkZXJcbiAgICB9XG5cbiAgICBwcmV2dmFsdWVzID0gW11cblxuICAgIHVwZGF0ZSA9IGhvbGQgMywgKGNoYXIpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHJlbmRlci52YWx1ZXMoKVxuICAgICAgICAjIHNob3cgcGxhY2Vob2xkZXIgaWYgaXQncyBlbXB0eVxuICAgICAgICByZW5kZXIudG9nZ2xlUGxhY2Vob2xkZXIgdmFsdWVzLmxlbmd0aCA9PSAwXG4gICAgICAgIHVubGVzcyB2YWx1ZXMucmVkdWNlICgocCwgYywgaSkgLT4gcCBhbmQgYyA9PSBwcmV2dmFsdWVzW2ldKSwgdHJ1ZVxuICAgICAgICAgICAgcHJldnZhbHVlcyA9IHZhbHVlc1xuICAgICAgICAgICAgZGlzcGF0Y2ggJ2NoYW5nZScsIHt2YWx1ZXN9XG4gICAgICAgICMgYSBwaWxsIGVkaXQgdHJ1bWZzIGFsbFxuICAgICAgICByZXR1cm4gaWYgaGFuZGxlcGlsbCgpXG4gICAgICAgICMgY3Vyc29yIHJhbmdlIGZvciB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcihlbClcbiAgICAgICAgIyBYWFggb3B0aW1pemUgd2l0aCBiZWxvdz9cbiAgICAgICAgdW5sZXNzIHJcbiAgICAgICAgICAgIHN0b3BzdWc/KClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBhIHRyaWdnZXIgaW4gdGhlIHdvcmQ/XG4gICAgICAgIHRyaWcgPSBmaW5kIHRyaWdzLCAodCkgLT4gdC5yZS50ZXN0IHdvcmRcbiAgICAgICAgIyBubyB0cmlnZ2VyIGZvdW5kIGluIGN1cnJlbnQgd29yZCwgYWJvcnRcbiAgICAgICAgdW5sZXNzIHRyaWdcbiAgICAgICAgICAgIHN0b3BzdWc/KClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIGV4ZWMgdHJpZ2dlciB0byBnZXQgcGFydHNcbiAgICAgICAgW18sIHR5cGVuYW1lLCB2YWx1ZV0gPSB0cmlnLnJlLmV4ZWMgd29yZFxuICAgICAgICAjIGZpbmQgcG9zc2libGUgdHlwZXNcbiAgICAgICAgdHlwZXMgPSB0cmlnLnR5cGVzLmZpbHRlciAodCkgLT4gdHJpZy5wcmVmaXggb3IgdC5uYW1lPy5pbmRleE9mKHR5cGVuYW1lKSA9PSAwXG4gICAgICAgICMgaGFuZCBvZmYgdG8gZGVhbCB3aXRoIGZvdW5kIGlucHV0XG4gICAgICAgIGhhbmRsZXR5cGVzIHIsIHRyaWcsIHR5cGVzLCBjaGFyXG5cbiAgICBzdWdzZWxlY3QgPSBzdWdtb3ZlciA9IHN1Z3dvcmQgPSBudWxsXG4gICAgc2V0U3VnbW92ZXIgPSAoX3N1Z21vdmVyKSAtPiBzdWdtb3ZlciA9IF9zdWdtb3ZlclxuICAgIHN0b3BzdWcgPSAtPlxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdtb3ZlciA9IHN1Z3dvcmQgPSBudWxsXG4gICAgICAgIHJlbmRlci51bnN1Z2dlc3QoKVxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHN0b3AnXG5cbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxscyBsZWF2ZVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxyZW1vdmUnLCAoZXYpLT5cbiAgICAgICAgZXYucGlsbD8udHlwZS5zZXREaXNhYmxlZChmYWxzZSlcbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHVwZGF0ZSgpICMgdHJpZ2dlciB2YWx1ZS1jaGFuZ2VcbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxsIGxvc2UgZm9jdXNcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxsZm9jdXNvdXQnLCBzdG9wc3VnXG5cbiAgICBoYW5kbGV0eXBlcyA9IChyYW5nZSwgdHJpZywgdHlwZXMsIGNoYXIpIC0+XG4gICAgICAgICMgdGhlIHRyaWdnZXIgcG9zaXRpb24gaW4gdGhlIHdvcmQgcmFuZ2VcbiAgICAgICAgdHBvcyA9IGZpbmRJblJhbmdlIHJhbmdlLCB0cmlnLnN5bWJvbFxuICAgICAgICAjIG5vIHRwb3M/IVxuICAgICAgICByZXR1cm4gaWYgdHBvcyA8IDBcbiAgICAgICAgIyByYW5nZSBmb3IgdHlwZSBuYW1lICh3aGljaCBtYXkgbm90IGJlIHRoZSBlbnRpcmUgbmFtZSlcbiAgICAgICAgdHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgIHRyYW5nZS5zZXRFbmQgdHJhbmdlLmVuZENvbnRhaW5lciwgdHBvc1xuICAgICAgICAjIHdoZXRoZXIgdGhlIGxhc3QgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyXG4gICAgICAgIHdhc3RyaWcgPSBjaGFyID09IHRyaWcuc3ltYm9sXG4gICAgICAgICMgaGVscGVyIHdoZW4gZmluaXNoZWQgc2VsZWN0aW5nIGEgdHlwZVxuICAgICAgICBzZWxlY3RUeXBlID0gKHR5cGUpIC0+XG4gICAgICAgICAgICByZW5kZXIucGlsbGlmeSByYW5nZSwgdHlwZSwgbnVsbCwgZGlzcGF0Y2hcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzZWxlY3QnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgaWYgdHlwZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBlbHNlIGlmIHR5cGVzLmxlbmd0aCA9PSAxIGFuZCBub3Qgc3VnbW92ZXJcbiAgICAgICAgICAgICMgb25lIHBvc3NpYmxlIHNvbHV0aW9uXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBmb3IgdHJpZ2dlciBjaGFyLCB3ZSBzZWxlY3QgdGhlIGZpcnN0IHR5cGUgc3RyYWlnaHQgYXdheVxuICAgICAgICAgICAgICAgIHNlbGVjdFR5cGUgZmluZCB0eXBlcywgKHQpIC0+ICF0LmRpdmlkZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyB3aGVuIHRoZSBrZXkgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyIGFuZCB0aGVyZSBhcmVcbiAgICAgICAgICAgICMgbXVsdGlwbGUgcG9zc2libGUgdmFsdWVzLCBwb3NpdGlvbi4gbW92ZSB0byBqdXN0IGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgdHJpZ2dlciBjaGFyLlxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgbW92ZSB0aGUgY3Vyc29yIHRvIGFsbG93IGZvciBzdWdnZXN0IGlucHV0XG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHJhbmdlLCB0cG9zXG4gICAgICAgICAgICAjIHN0YXJ0IGEgc3VnZ2VzdCBmb3IgY3VycmVudCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICAgICAgdHlwZXN1Z2dlc3QgdHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlc1xuXG5cbiAgICAjIHN1Z2dlc3QgZm9yIGdpdmVuIHR5cGVzXG4gICAgdHlwZXN1Z2dlc3QgPSAocmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzKSAtPlxuICAgICAgICAjIGZpbHRlciB0byBvbmx5IHNob3cgdHlwZXMgdGhhdCBhcmUgbm90IGRpc2FibGVkXG4gICAgICAgIGZ0eXBlcyA9IGFycmF5RmlsdGVyKHR5cGVzLCAodHlwZSktPiAhdHlwZS5pc0Rpc2FibGVkKCkpXG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgaGVscGVyIHRvIGNyZWF0ZSBzdWdzZWxlY3QgZnVuY3Rpb25zXG4gICAgICAgIHN1Z3NlbGVjdGZvciA9IChpdGVtKSAtPiAtPlxuICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgIyB0aGUgdHlwZSBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgc2VsZWN0VHlwZSBpdGVtXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgIyBmdW5jdGlvbiB0aGF0IHN1Z2dlc3QgdHlwZXNcbiAgICAgICAgZm50eXBlcyA9IChfLCBjYikgLT4gY2IgZnR5cGVzXG4gICAgICAgICMgaWYgdGhlcmUgaXMgb25seSBvbmUsIHNldCBpdCBhcyBwb3NzaWJsZSBmb3IgcmV0dXJuIGtleVxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgZnR5cGVzWzBdIGlmIHR5cGVzLmxlbmd0aCA9PSAxXG4gICAgICAgICMgcmVuZGVyIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudHlwZXMsIHJhbmdlLCAtMSwgc2V0U3VnbW92ZXIsICh0eXBlLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlJywge3RyaWcsIHR5cGV9XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlcycsIHt0cmlnLCBmdHlwZXN9XG5cbiAgICBoYW5kbGVwaWxsID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gZW50aXJlVGV4dEF0Q3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHR5cGVvZiBwaWxsLnR5cGU/LnN1Z2dlc3QgPT0gJ2Z1bmN0aW9uJyAjIGRlZmluaXRlbHkgYSBzdWdnZXN0XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBzdWdnZXN0IGZ1bmN0aW9uIGFzIGZuIHRvIHJlbmRlci5zdWdnZXN0XG4gICAgICAgIGZudmFscyA9ICh3b3JkLCBjYikgLT4gcGlsbC50eXBlLnN1Z2dlc3Qgd29yZCwgY2IsIHBpbGwudHlwZSwgcGlsbC50cmlnXG4gICAgICAgICMgaGVscGVyIHdoZW4gd2UgZGVjaWRlIG9uIGFuIGl0ZW1cbiAgICAgICAgc2VsZWN0SXRlbSA9IChpdGVtKSAtPlxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgICAgICMgbGF0ZXIgc2luY2UgaXQgbWF5IGJlIHNlbGVjdCBmcm9tIGNsaWNrLCB3aGljaCBpcyBtb3VzZWRvd25cbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtc2VsZWN0Jywge3BpbGwsIGl0ZW19XG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudmFscywgciwgLTEsIHNldFN1Z21vdmVyLCAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPlxuICAgICAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAgICAgIyBzZWxlY3QgdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtIGl0ZW1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW0nLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZCBhYm91dCBpdFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zJywge3BpbGx9XG4gICAgICAgIHJldHVybiB0cnVlICMgc2lnbmFsIHdlIGRlYWx0IHdpdGggaXRcblxuICAgICMgbW92ZSB0aGUgaW5wdXQgb3V0IG9mIGEgcGlsbCAoaWYgd2UncmUgaW4gYSBwaWxsKVxuICAgIHBpbGxqdW1wID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjIHRoZSBldmVudCBoYW5kbGVyc1xuICAgIGhhbmRsZXJzID1cbiAgICAgICAga2V5ZG93bjogIChlKSAtPlxuXG4gICAgICAgICAgICAjIHRoaXMgZG9lcyBhbiBpbXBvcnRhbnQgZWwubm9ybWFsaXplKCkgdGhhdCBlbnN1cmVzIHdlIGhhdmVcbiAgICAgICAgICAgICMgY29udGlndW91cyB0ZXh0IG5vZGVzLCBjcnVjaWFsIGZvciB0aGUgcmFuZ2UgbG9naWMuXG4gICAgICAgICAgICByZW5kZXIudGlkeSgpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIGRvbnQgd2FudCBET00gY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgc3Vnc2VsZWN0PygpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgcGlsbGp1bXAoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBzdWdtb3ZlclxuICAgICAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAzOCAgICAgICMgdXBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigtMSlcbiAgICAgICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSA9PSA0MCAjIGRvd25cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigrMSlcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlIGluIFszNywgOF1cbiAgICAgICAgICAgICAgICBza2lwWnduaiBlbCwgLTEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogYmFja3dhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgaW4gWzM5LCA0Nl1cbiAgICAgICAgICAgICAgICBza2lwWnduaiBlbCwgKzEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogZm9yd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG5cbiAgICAgICAgICAgIHVwZGF0ZSgpICMgZG8gYW4gdXBkYXRlLCBidXQgbWF5IGNhbmNlbCB3aXRoIGtleXByZXNzIHRvIGdldCBjaGFyXG5cbiAgICAgICAgICAgICMgYW5kIGtlZXAgbWFrZSBzdXJlIGl0J3MgdGlkeVxuICAgICAgICAgICAgbGF0ZXIgLT4gcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgIGtleXByZXNzOiAoZSkgLT5cbiAgICAgICAgICAgICMgY2FuY2VsIHByZXZpb3VzIHVwZGF0ZSBzaW5jZSB3ZSBoYXZlIGEgY2hhcmNvZGVcbiAgICAgICAgICAgIHVwZGF0ZSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpXG5cbiAgICAgICAgcGFzdGU6IChlKSAtPlxuICAgICAgICAgICAgIyBzdG9wIGRlZmF1bHQgcGFzdGUgYWN0aW9uXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgICAgIyBncmFiIHRoZSBhY3R1YWwgZXZlbnQgKGluIGNhc2UgalF1ZXJ5IHdyYXBwZWQpXG4gICAgICAgICAgICBlID0gKGUub3JpZ2luYWxFdmVudCA/IGUpXG5cbiAgICAgICAgICAgIGlmIGU/LmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICAgICAjIFN0YW5kYXJkIHN0eWxlXG4gICAgICAgICAgICAgICAgdHh0ID0gZS5jbGlwYm9hcmREYXRhLmdldERhdGEgJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAgICAgZG9jLmV4ZWNDb21tYW5kICdpbnNlcnRUZXh0JywgZmFsc2UsIHR4dFxuICAgICAgICAgICAgZWxzZSBpZiB3aW5kb3cuY2xpcGJvYXJkRGF0YVxuICAgICAgICAgICAgICAgICMgSUUgc3R5bGVcbiAgICAgICAgICAgICAgICB0eHQgPSB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhICdUZXh0J1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihlbClcbiAgICAgICAgICAgICAgICByLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlIHR4dFxuXG4gICAgICAgICAgICB1cGRhdGUoKVxuXG4gICAgICAgICAgICBmYWxzZVxuXG5cbiAgICAjIGZpcnN0IGRyYXdpbmdcbiAgICBkbyBkcmF3ID0gLT5cbiAgICAgICAgIyBkcmF3IGFuZCBhdHRhY2ggaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLmRyYXcgaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgIyBmaXJzdCBldmVudFxuICAgIGxhdGVyIC0+IGRpc3BhdGNoICdpbml0J1xuXG4gICAgIyByZXR1cm4gdGhlIGZhY2FkZSB0byBpbnRlcmFjdFxuICAgIHJldHVybiBmYcOnYWRlXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBtYWtpbmcgdHJpZ2dlcnMuXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJzonLCB0eXBlcyk7XG4jICAgdmFyIHRyaWcxID0gdHRib3gudHJpZygnQCcsIHtwcmVmaXg6IHRydWV9LCB0eXBlcyk7XG50dGJveC50cmlnID0gKHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAyXG4gICAgICAgIHR5cGVzID0gb3B0c1xuICAgICAgICBvcHRzID0ge31cbiAgICBuZXcgVHJpZ2dlciBzeW1ib2wsIG9wdHMsIHR5cGVzXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBkaXZpZGVycyBpbiB0eXBlIGxpc3RzXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0eXBlcyA9IFtcbiMgICAgIHR0Ym94LmRpdmlkZXIoJ0xpbWl0IHNlYXJjaCBvbicpLFxuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3guZGl2aWRlciA9IChuYW1lLCBvcHRzKSAtPiBuZXcgVHlwZSBuYW1lLCBtZXJnZSB7XG4gICAgZGl2aWRlcjp0cnVlXG4gICAgaHRtbDogLT4gXCI8ZGl2Pjxocj48c3Bhbj4je0BuYW1lfTwvc3Bhbj48L2Rpdj5cIlxufSwgb3B0c1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHR5cGVzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC50eXBlKCdwcm9kdWN0Jywge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgICAgdHRib3gudHlwZSgncGVyc29uJywgIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICBdXG50dGJveC50eXBlID0gKG5hbWUsIG9wdHMsIHR5cGVzKSAtPiBuZXcgVHlwZSBuYW1lLCBvcHRzXG5cblxuIyBIZWxwZXIgbWV0aG9kIHRvIG1ha2UgaHRtbCBmb3IgYSBzdWdnZXN0LlxuIyBcIjxkaXY+PGRmbj48Yj53b3JkPC9iPmlzcGFydG9mPC9kZm4+OiBzb21lIGRlc2NyaXB0aW9uPC9kaXY+XCJcbnN1Z2dlc3RIdG1sID0gKHdvcmQsIHByZWZpeCwgbmFtZSwgc3VmZml4LCBkZXNjID0gJycpIC0+XG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2PicgdW5sZXNzIG5hbWVcbiAgICBbaGlnaCwgdW5oaWdoXSA9IGlmIG5hbWUuaW5kZXhPZih3b3JkKSA9PSAwIHRoZW4gW3dvcmQsIG5hbWVbd29yZC5sZW5ndGguLl1dIGVsc2UgW1wiXCIsIG5hbWVdXG4gICAgXCI8ZGl2PjxkZm4+I3twcmVmaXh9PGI+I3toaWdofTwvYj4je3VuaGlnaH0je3N1ZmZpeH08L2Rmbj4gPHNwYW4+I3tkZXNjfTwvc3Bhbj48L2Rpdj5cIlxuVHlwZTo6aHRtbCA9ICh3b3JkKSAtPlxuICAgIGlmIEB0cmlnLnByZWZpeFxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBAdHJpZy5zeW1ib2wsIEBuYW1lLCBcIlwiLCBAZGVzY1xuICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgQG5hbWUsIEB0cmlnLnN5bWJvbCwgQGRlc2NcblxuXG4jIGdvZXMgdGhyb3VnaCBhbiBlbGVtZW50IHBhcnNpbmcgcGlsbHMgYW5kXG4jIHRleHQgaW50byBhIGRhdGFzdHJ1Y3R1cmVcbiMgaGVscGVyIHRvIHR1cm4gYSBzdWdnZXN0IGl0ZW0gaW50byBodG1sXG50b0h0bWwgPSAod29yZCkgLT4gKGl0ZW0pIC0+XG4gICAgaWYgdHlwZW9mIGl0ZW0/Lmh0bWwgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICBpdGVtLmh0bWwod29yZClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLnZhbHVlLCBcIlwiLCBpdGVtLmRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIGl0ZW0sIFwiXCJcblxuXG4jIGhlbHBlciB0byB0dXJuIGFuIGl0ZW0gaW50byB0ZXh0XG50b1RleHQgPSAoaXRlbSA9ICcnKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBpdGVtLnZhbHVlXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcoaXRlbSlcblxuIyBqcXVlcnkgZHJhd2luZyBob29rXG5kZWYgdHRib3gsIGpxdWVyeTogLT5cblxuICAgICQgICAgPSBudWxsICMgc2V0IG9uIGluaXRcbiAgICAkZWwgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGJveCA9IC0+ICRlbC5maW5kKCcudHRib3gnKVxuICAgICMgaHRtbCBmb3IgYm94XG4gICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwidHRib3hcIj48ZGl2IGNsYXNzPVwidHRib3gtb3ZlcmZsb3dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0dGJveC1pbnB1dFwiIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIj48L2Rpdj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0dGJveC1wbGFjZWhvbGRlclwiPjwvZGl2PjwvZGl2PidcbiAgICBzdWdnZXN0ID0gJzxkaXYgY2xhc3M9XCJ0dGJveC1zdWctb3ZlcmZsb3dcIj48ZGl2IGNsYXNzPVwidHRib3gtc3VnZ2VzdFwiPjwvZGl2PjwvZGl2PidcbiAgICAjIGNhY2hlIG9mIHBpbGwgPHBpbGxpZCwgcGlsbD4gc3RydWN0dXJlc1xuICAgIHBpbGxzID0ge31cbiAgICAjIGhlbHBlciB0byB0aWR5IGNhY2hlXG4gICAgdGlkeXBpbGxzID0gaG9sZCA1MDAwLCAtPlxuICAgICAgICBwcmVzZW50ID0gJGVsLmZpbmQoJy50dGJveC1waWxsJykubWFwKC0+ICQoQCkuYXR0ciAnaWQnKS50b0FycmF5KClcbiAgICAgICAgZGVsZXRlIHBpbGxzW2lkXSBmb3IgaWQgaW4gT2JqZWN0LmtleXMocGlsbHMpIHdoZW4gcHJlc2VudC5pbmRleE9mKGlkKSA8IDBcbiAgICAgICAgbnVsbFxuICAgICMgcmV0dXJuIHRoZSBwaWxsIHN0cnVjdHVyZSBmb3IgYW4gZWxlbWVudFxuICAgIHBpbGxmb3IgPSAoZWwpIC0+IHBpbGxzWyQoZWwpLmNsb3Nlc3QoJy50dGJveC1waWxsJykuYXR0cignaWQnKV1cbiAgICAjIGdvIHRocm91Z2ggY2FjaGUgYW5kIGVuc3VyZSBhbGwgcGlsbHMgaGF2ZSB0aGUgaXRlbSB2YWx1ZSBvZiB0aGVcbiAgICAjIGVsZW1lbnQgdmFsdWUuXG4gICAgZW5zdXJlSXRlbXMgPSAtPlxuICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKSBmb3IgaywgcGlsbCBvZiBwaWxsc1xuICAgICAgICBudWxsXG5cbiAgICAjIGNhbGwgb2Z0ZW4uIGZpeCB0aGluZ3MuXG4gICAgdGlkeSA9IC0+XG4gICAgICAgICRpbnAgPSAkZWwuZmluZCgnLnR0Ym94LWlucHV0JylcbiAgICAgICAgaW5wID0gJGlucFswXVxuICAgICAgICAjIG1lcmdlIHN0dWZmIHRvZ2V0aGVyIGFuZCByZW1vdmUgZW1wdHkgdGV4dG5vZGVzLlxuICAgICAgICBpbnAubm9ybWFsaXplKClcbiAgICAgICAgIyBmaXJzdCBlbnN1cmUgdGhlcmUncyBhIDxicj4gYXQgdGhlIGVuZCAob3IgPGk+IGZvciBJRSlcbiAgICAgICAgdGFnID0gaWYgaXNJRSB0aGVuICdpJyBlbHNlICdicidcbiAgICAgICAgdW5sZXNzICRpbnAuY2hpbGRyZW4oKS5sYXN0KCkuaXMgdGFnXG4gICAgICAgICAgICAkaW5wLmZpbmQoXCI+ICN7dGFnfVwiKS5yZW1vdmUoKVxuICAgICAgICAgICAgJGlucC5hcHBlbmQgXCI8I3t0YWd9PlwiXG4gICAgICAgIGNoaWxkcyA9IGlucC5jaGlsZE5vZGVzXG4gICAgICAgIGZpcnN0ID0gY2hpbGRzWzBdXG4gICAgICAgICMgZW5zdXJlIHRoZSB3aG9sZSB0aGluZ3Mgc3RhcnRzIHdpdGggYSB6d25qXG4gICAgICAgIGlmIGZpcnN0Py5ub2RlVHlwZSAhPSAzIG9yIGZpcnN0Py5ub2RlVmFsdWU/WzBdICE9IHp3bmpcbiAgICAgICAgICAgICRpbnBbMF0uaW5zZXJ0QmVmb3JlIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKSwgZmlyc3RcbiAgICAgICAgIyBlbnN1cmUgdGhlcmUncyBhbHdheXMgYSB6d25qIGFmdGVyIGV2ZXJ5IGVsZW1lbnQgbm9kZVxuICAgICAgICBmb3IgbiBpbiBjaGlsZHMgd2hlbiBuPy5ub2RlVHlwZSA9PSAxIGFuZCBuPy5uZXh0U2libGluZz8ubm9kZVR5cGUgPT0gMVxuICAgICAgICAgICAgYXBwZW5kQWZ0ZXIgbiwgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopXG4gICAgICAgICMgcmVtb3ZlIGFueSBuZXN0ZWQgc3BhbiBpbiBwaWxsc1xuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBpbGwgc3BhbiBzcGFuJykucmVtb3ZlKClcbiAgICAgICAgIyBhZ2FpbiwgZW5zdXJlIGNvbnRpZ291cyBub2Rlc1xuICAgICAgICBpbnAubm9ybWFsaXplKClcbiAgICAgICAgIyBtb3ZlIGN1cnNvciB0byBub3QgYmUgb24gYmFkIGVsZW1lbnQgcG9zaXRpb25zXG4gICAgICAgIGlmIHIgPSBjdXJzb3IoJGVsWzBdKVxuICAgICAgICAgICAgaWYgKHIuc3RhcnRDb250YWluZXIgPT0gaW5wIG9yIHIuZW5kQ29udGFpbmVyID09IGlucClcbiAgICAgICAgICAgICAgICBjcyA9IEFycmF5OjpzbGljZS5jYWxsIGNoaWxkc1xuICAgICAgICAgICAgICAgICMgY3VycmVudCB0ZXh0IG5vZGUsIHRoZW4gcmlnaHQsIHRoZSBsZWZ0LlxuICAgICAgICAgICAgICAgIGlzVGV4dCA9IChuKSAtPiBpZiBuPy5ub2RlVHlwZSA9PSAzIHRoZW4gbiBlbHNlIG51bGxcbiAgICAgICAgICAgICAgICBpID0gci5zdGFydE9mZnNldFxuICAgICAgICAgICAgICAgIG4gPSBpc1RleHQoY3NbaV0pID8gaXNUZXh0KGNzW2kgKyAxXSkgPyBpc1RleHQoY3NbaSAtIDFdKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIG4gaWYgblxuICAgICAgICAgICAgIyBmaXJlZm94IG1hbmFnZXMgdG8gZm9jdXMgYW55dGhpbmcgYnV0IHRoZSBvbmx5XG4gICAgICAgICAgICAjIGNvbnRlbnRlZGl0YWJsZT10cnVlIG9mIHRoZSBwaWxsXG4gICAgICAgICAgICBwYXJlbiA9IHIuc3RhcnRDb250YWluZXIucGFyZW50Tm9kZVxuICAgICAgICAgICAgaWYgcGFyZW4/Lm5vZGVOYW1lICE9ICdTUEFOJyBhbmQgcGlsbCA9IHBpbGxmb3IgcGFyZW5cbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgIyBrZWVwIGNhY2hlIGNsZWFuXG4gICAgICAgIHRpZHlwaWxscygpXG4gICAgICAgIG51bGxcblxuICAgICMgaW5pdGlhbGlzZSBib3hcbiAgICBpbml0OiAoZWwpIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpZG4ndCBmaW5kIGpRdWVyeVwiKSB1bmxlc3MgJCA9IGpRdWVyeVxuICAgICAgICAkZWwgPSAkKGVsKVxuICAgICAgICAkZWxbMF1cblxuICAgICMgZHJhdyBzdHVmZiBhbmQgaG9vayB1cCBldmVudCBoYW5kbGVyc1xuICAgIGRyYXc6IChoYW5kbGVycykgLT5cbiAgICAgICAgJGVsLmh0bWwgaHRtbFxuICAgICAgICAkZWwub24oZXZlbnQsIGhhbmRsZXIpIGZvciBldmVudCwgaGFuZGxlciBvZiBoYW5kbGVyc1xuXG4gICAgIyBjbGVhciB0aGUgc3RhdGUgb2YgdGhlIGlucHV0XG4gICAgY2xlYXI6IC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtaW5wdXQnKS5lbXB0eSgpXG4gICAgICAgIHRpZHkoKVxuXG4gICAgIyBmb2N1cyB0aGUgaW5wdXQgKGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBoYXZlIGZvY3VzKVxuICAgIGZvY3VzOiAtPlxuICAgICAgICByZXR1cm4gaWYgY3Vyc29yKCRlbFswXSkgIyBhbHJlYWR5IGhhcyBmb2N1c1xuICAgICAgICB0aWR5KCkgIyBlbnN1cmUgd2UgaGF2ZSBhIGxhc3Qgbm9kZSB0byBwb3NpdGlvbiBiZWZvcmVcbiAgICAgICAgbnMgPSAkZWwuZmluZCgnLnR0Ym94LWlucHV0JylbMF0uY2hpbGROb2Rlc1xuICAgICAgICBuID0gbnNbbnMubGVuZ3RoIC0gMl1cbiAgICAgICAgc2V0Q3Vyc29yRWwgbiwgLTFcblxuICAgICMgcmV0dXJuIGFuIGFycmF5IG9mIHZhbHVlcyBmb3IgdGhlIGJveFxuICAgIHZhbHVlczogLT5cbiAgICAgICAgZW5zdXJlSXRlbXMoKVxuICAgICAgICBBcnJheTo6c2xpY2UuY2FsbCgkZWwuZmluZCgnLnR0Ym94LWlucHV0JylbMF0uY2hpbGROb2RlcykubWFwIChuKSAtPlxuICAgICAgICAgICAgaWYgbi5ub2RlVHlwZSA9PSAxIGFuZCBuPy5jbGFzc05hbWU/LmluZGV4T2YoJ3R0Ym94LXBpbGwnKSA+PSAwXG4gICAgICAgICAgICAgICAgcGlsbGZvciBuXG4gICAgICAgICAgICBlbHNlIGlmIG4ubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgICAgIGZpbHRlciBuLm5vZGVWYWx1ZVxuICAgICAgICAuZmlsdGVyIElcblxuICAgICMgcmVtb3ZlIHN1Z2dnZXN0XG4gICAgdW5zdWdnZXN0OiB1bnN1Z2dlc3QgPSAtPlxuICAgICAgICAkKCcudHRib3gtc3VnLW92ZXJmbG93JykucmVtb3ZlKClcbiAgICAgICAgJGJveCgpLnJlbW92ZUNsYXNzICd0dGJveC1zaG93aW5nLXN1Z2dlc3QnXG5cbiAgICAjIHN0YXJ0IHN1Z2dlc3RcbiAgICBzdWdnZXN0OiAoZm4sIHJhbmdlLCBpZHgsIG1vdmVjYiwgc2VsZWN0Y2IpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZmluZC9jcmVhdGUgc3VnZ2VzdC1ib3hcbiAgICAgICAgJHN1ZyA9ICQoJy50dGJveC1zdWdnZXN0JylcbiAgICAgICAgdW5sZXNzICRzdWcubGVuZ3RoXG4gICAgICAgICAgICAkb3ZlcmZsdyA9ICQoc3VnZ2VzdClcbiAgICAgICAgICAgICRzdWcgPSAkb3ZlcmZsdy5maW5kICcudHRib3gtc3VnZ2VzdCdcbiAgICAgICAgICAgICMgbG9jayB3aWR0aCB0byBwYXJlbnRcbiAgICAgICAgICAgICRvdmVyZmx3LmNzcyAnbWluLXdpZHRoJywgJGJveCgpLm91dGVyV2lkdGgoKVxuICAgICAgICAgICAgIyBhZGp1c3QgZm9yIGJvcmRlciBvZiBwYXJlbnRcbiAgICAgICAgICAgIGJvcmQgPSBwYXJzZUludCAkZWwuZmluZCgnLnR0Ym94LW92ZXJmbG93JykuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJylcbiAgICAgICAgICAgICRvdmVyZmx3LmNzcyB0b3A6JGVsLm91dGVySGVpZ2h0KCkgLSBib3JkXG4gICAgICAgICAgICAjIGFwcGVuZCB0byBib3hcbiAgICAgICAgICAgICRib3goKS5hcHBlbmQgJG92ZXJmbHdcbiAgICAgICAgICAgICMgaW5kaWNhdGUgd2UgYXJlIHNob3dpbmdcbiAgICAgICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc2hvd2luZy1zdWdnZXN0JylcbiAgICAgICAgIyBlbXB0eSBzdWdnZXN0IGJveCB0byBzdGFydCBmcmVzaFxuICAgICAgICAkc3VnLmh0bWwoJycpOyAkc3VnLm9mZigpXG4gICAgICAgICMgY2xhc3MgdG8gaG9vayBzdHlsaW5nIHdoZW4gc3VnZ2VzdGluZ1xuICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCcpXG4gICAgICAgICMgcmVxdWVzdCB0byBnZXQgc3VnZ2VzdCBlbGVtZW50c1xuICAgICAgICBmbiB3b3JkLCAobGlzdCkgLT5cbiAgICAgICAgICAgICMgbm90IHJlcXVlc3RpbmcgYW55bW9yZVxuICAgICAgICAgICAgJGJveCgpLnJlbW92ZUNsYXNzICd0dGJveC1zdWdnZXN0LXJlcXVlc3QnXG4gICAgICAgICAgICAjIGxvY2FsIHRvSHRtbCB3aXRoIHdvcmRcbiAgICAgICAgICAgIGxvY1RvSHRtbCA9IHRvSHRtbCh3b3JkKVxuICAgICAgICAgICAgIyB0dXJuIGxpc3QgaW50byBodG1sXG4gICAgICAgICAgICBsaXN0LmZvckVhY2ggKGwpIC0+XG4gICAgICAgICAgICAgICAgJGggPSAkKGxvY1RvSHRtbChsKSlcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBpZiBsLmRpdmlkZXJcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtZGl2aWRlcidcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWl0ZW0nXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgbC5jbGFzc05hbWUgaWYgbC5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAkc3VnLmFwcGVuZCAkaFxuICAgICAgICAgICAgIyBsaXN0IHdpdGhvdXQgZGl2aWRlcnNcbiAgICAgICAgICAgIG5vZGl2aWQgPSBsaXN0LmZpbHRlciAobCkgLT4gIWwuZGl2aWRlclxuICAgICAgICAgICAgcHJldmlkeCA9IG51bGxcbiAgICAgICAgICAgIGRvIHNlbGVjdElkeCA9IChkb3N0YXJ0ID0gZmFsc2UpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIGlkeCA8IDAgYW5kICFkb3N0YXJ0XG4gICAgICAgICAgICAgICAgaWR4ID0gMCBpZiBpZHggPCAwXG4gICAgICAgICAgICAgICAgaWR4ID0gbm9kaXZpZC5sZW5ndGggLSAxIGlmIGlkeCA+PSBub2RpdmlkLmxlbmd0aFxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBwcmV2aWR4ID09IGlkeFxuICAgICAgICAgICAgICAgIHByZXZpZHggPSBpZHhcbiAgICAgICAgICAgICAgICAkc3VnLmZpbmQoJy50dGJveC1zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgJHNlbCA9ICRzdWcuY2hpbGRyZW4oJy50dGJveC1zdWdnZXN0LWl0ZW0nKS5lcShpZHgpXG4gICAgICAgICAgICAgICAgJHNlbC5hZGRDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWxbMF0/LnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2lkeF1cbiAgICAgICAgICAgICMgaGFuZGxlIGNsaWNrIG9uIGEgc3VnZ2VzdCBpdGVtLCBtb3VzZWRvd24gc2luY2UgY2xpY2tcbiAgICAgICAgICAgICMgd2lsbCBmaWdodCB3aXRoIGZvY3Vzb3V0IG9uIHRoZSBwaWxsXG4gICAgICAgICAgICAkc3VnLm9uICdtb3VzZWRvd24nLCAoZXYpIC0+XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpICMgbm8gbG9zZSBmb2N1c1xuICAgICAgICAgICAgICAgICRpdCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KCcudHRib3gtc3VnZ2VzdC1pdGVtJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzICRpdC5sZW5ndGhcbiAgICAgICAgICAgICAgICBpID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmluZGV4ICRpdFxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgaSA+PSAwXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpXSwgdHJ1ZVxuICAgICAgICAgICAgIyBjYWxsYmFjayBwYXNzZWQgdG8gcGFyZW50IGZvciBrZXkgbmF2aWdhdGlvblxuICAgICAgICAgICAgbW92ZWNiIChvZmZzKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3Mgb2Zmc1xuICAgICAgICAgICAgICAgIGlkeCA9IGlkeCArIG9mZnNcbiAgICAgICAgICAgICAgICBzZWxlY3RJZHggdHJ1ZVxuXG4gICAgIyBpbnNlcnQgYSBwaWxsIGZvciB0eXBlL2l0ZW0gYXQgZ2l2ZW4gcmFuZ2VcbiAgICBwaWxsaWZ5OiAocmFuZ2UsIHR5cGUsIGl0ZW0sIGRpc3BhdGNoKSAtPlxuXG4gICAgICAgICMgaWYgcGlsbCBpcyByZXN0cmljdGVkIHRvIHNpbmdsZSBvY2N1cmVuY2VzXG4gICAgICAgIGlmIHR5cGUubGltaXRPbmVcbiAgICAgICAgICAgICMgc2V0IHR5cGUgZGlzYWJsZWQgYW5kIHJldHVybiBpZiBwaWxsIGFscmVhZHkgaW4gc2VhcmNoXG4gICAgICAgICAgICB0eXBlLnNldERpc2FibGVkKHRydWUpXG4gICAgICAgICAgICB0b29NYW55ID0gISEkKCcudHRib3gtcGlsbCcpLmZpbHRlciggKGksIHBpbGwpIC0+ICQocGlsbCkuZGF0YSgndHlwZScpID09IHR5cGUubmFtZSkubGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2UgaWYgdG9vTWFueVxuXG4gICAgICAgICMgdGhlIHRyaWcgaXMgcmVhZCBmcm9tIHRoZSB0eXBlXG4gICAgICAgIHRyaWcgPSB0eXBlLnRyaWdcbiAgICAgICAgIyBjcmVhdGUgcGlsbCBodG1sXG4gICAgICAgIGRmbiA9IGlmIHRyaWdcbiAgICAgICAgICAgIGlmIHRyaWcucHJlZml4IHRoZW4gdHJpZy5zeW1ib2wgZWxzZSB0eXBlLm5hbWUgKyB0cmlnLnN5bWJvbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0eXBlLm5hbWVcbiAgICAgICAgJHBpbGwgPSAkKFwiPGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbFxcXCI+PGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbC1jbG9zZVxcXCI+w5c8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIjxkZm4+I3tkZm59PC9kZm4+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKVxuICAgICAgICAkcGlsbC5maW5kKCcqJykuYW5kU2VsZigpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZSdcbiAgICAgICAgKCRzcGFuID0gJHBpbGwuZmluZCgnc3BhbicpKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZSdcbiAgICAgICAgIyBpZiBwcmVmaXggc3R5bGUgcGlsbFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyAndHRib3gtcGlsbC1wcmVmaXgnIGlmIHR5cGUudHJpZy5wcmVmaXhcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS50cmlnLmNsYXNzTmFtZSBpZiB0eXBlLnRyaWcuY2xhc3NOYW1lXG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUuY2xhc3NOYW1lIGlmIHR5cGUuY2xhc3NOYW1lXG4gICAgICAgICRwaWxsLmF0dHIgJ2RhdGEtdHlwZScsIHR5cGUubmFtZVxuXG4gICAgICAgICMgZ2VuZXJhdGUgaWQgdG8gYXNzb2NpYXRlIHdpdGggbWVtIHN0cnVjdHVyZVxuICAgICAgICBpZCA9IFwidHRib3hwaWxsI3tEYXRlLm5vdygpfVwiXG4gICAgICAgICRwaWxsLmF0dHIgJ2lkJywgaWRcbiAgICAgICAgIyByZXBsYWNlIGNvbnRlbnRzIHdpdGggcGlsbFxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUgJHBpbGxbMF1cbiAgICAgICAgIyByZW1vdmUgcGlsbCBmcm9tIERPTSwgd2hpY2ggaW4gdHVybiByZW1vdmVzIGl0IGNvbXBsZXRlbHlcbiAgICAgICAgcmVtb3ZlID0gLT5cbiAgICAgICAgICAgICRwaWxsLnJlbW92ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbHJlbW92ZScsIHtwaWxsfVxuICAgICAgICAjIHdpcmUgdXAgY2xvc2UgYnV0dG9uXG4gICAgICAgICRwaWxsLmZpbmQoJy50dGJveC1waWxsLWNsb3NlJykub24gJ2NsaWNrJywgcmVtb3ZlXG4gICAgICAgICMgZm9ybWF0IHRoZSB0ZXh0IHVzaW5nIHRoZSB0eXBlIGZvcm1hdHRlclxuICAgICAgICBmb3JtYXQgPSAtPiAkc3Bhbi50ZXh0IHR5cGUuZm9ybWF0ICRzcGFuLnRleHQoKVxuICAgICAgICAjIG1heWJlIHJ1biBmb3JtYXQgb24gZm9jdXNvdXRcbiAgICAgICAgJHBpbGwub24gJ2ZvY3Vzb3V0JywgLT5cbiAgICAgICAgICAgICMgZGlzcGF0Y2ggbGF0ZXIgdG8gYWxsb3cgZm9yIGNsaWNrIG9uIHN1Z2dlc3RcbiAgICAgICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpXG4gICAgICAgICAgICBmb3JtYXQoKSBpZiBwaWxsLml0ZW0/Ll90ZXh0XG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbGZvY3Vzb3V0Jywge3BpbGx9XG4gICAgICAgICMgaGVscGVyIGZ1bmN0aW9uIHRvIHNjb2xsIHBpbGwgaW50byB2aWV3XG4gICAgICAgIHNjcm9sbEluID0gLT5cbiAgICAgICAgICAgICRwaWxsLmFmdGVyICR0ID0gJCgnPHNwYW4gc3R5bGU9XCJ3aWR0aDoxcHhcIj4nKVxuICAgICAgICAgICAgJHRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNpYiA9ICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIHNpYiBpZiBzaWJcbiAgICAgICAgICAgICAgICBza2lwWnduaiAkZWxbMF0sICsxICMgRkYgc2hvd3Mgbm8gY3Vyc29yIGlmIHdlIHN0YW5kIG9uIDBcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuaXRlbSA9IHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=