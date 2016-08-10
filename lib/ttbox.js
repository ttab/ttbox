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
    var addpill, addtext, clear, defaultSuggest, dispatch, draw, el, façade, handlepill, handlers, handletypes, pilljump, prevvalues, render, setSugmover, stopsug, sugmover, sugselect, sugword, trigger, trigs, typesuggest, update;
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
      if (trig.symbol === 'default') {
        return defaultSuggest(trig.fn, r, -1);
      } else {
        ref3 = trig.re.exec(word), _ = ref3[0], typename = ref3[1], value = ref3[2];
        types = trig.types.filter(function(t) {
          var ref4;
          return trig.prefix || ((ref4 = t.name) != null ? ref4.indexOf(typename) : void 0) === 0;
        });
        return handletypes(r, trig, types, char, values);
      }
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
      stopsug();
      return update();
    });
    el.addEventListener('ttbox:pillfocusout', stopsug);
    handletypes = function(range, trig, types, char, values) {
      var selectType, tpos, trange, triggerSymbol, wastrig;
      triggerSymbol = trig.symbol;
      tpos = findInRange(range, triggerSymbol);
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
        return typesuggest(trange, tpos, trig, selectType, types, values);
      }
    };
    typesuggest = function(range, tpos, trig, selectType, types, values) {
      var fntypes, ftypes, sugselectfor, word;
      ftypes = (function() {
        var notInValues;
        notInValues = function(t) {
          var ref3;
          return !((ref3 = values != null ? values.filter(function(v) {
            var ref4;
            return (v != null ? (ref4 = v.type) != null ? ref4.name : void 0 : void 0) === t.name;
          }) : void 0) != null ? ref3.length : void 0);
        };
        return arrayFilter(types, function(type) {
          return !type.limitOne || notInValues(type);
        });
      })();
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
    defaultSuggest = function(triggerFn, range, sugStartIndex) {
      var selectItem, sugSelectFn;
      selectItem = function(item) {
        var input, j, len1, ref3;
        ref3 = $('.ttbox-input');
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          input = ref3[j];
          input.childNodes[0].nodeValue = item.value;
        }
        return dispatch('suggestitemselect', item);
      };
      sugSelectFn = function(item, doset) {
        sugselect = function() {
          stopsug();
          selectItem(item);
          return true;
        };
        if (doset) {
          sugselect();
        }
        return dispatch('suggestitem', item);
      };
      range.setStart(range.startContainer, 0);
      return render.suggest(triggerFn, range, sugStartIndex, setSugmover, sugSelectFn);
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
        var highlightedText, ref3, ref4, ttboxContent;
        ttboxContent = render.values()[0];
        highlightedText = window.getSelection().toString();
        if (highlightedText.indexOf(ttboxContent) > -1) {
          render.clear();
        }
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
            e.stopPropagation();
            return sugmover(-1);
          } else if (e.keyCode === 40) {
            e.preventDefault();
            e.stopPropagation();
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
              setCursorEl(n, -1);
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
              var $sel, pos, sctop;
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
              sctop = $sel != null ? $sel.closest('.ttbox-sug-overflow').scrollTop() : void 0;
              pos = $sel != null ? $sel.position() : void 0;
              if ($sel != null) {
                $sel.closest('.ttbox-sug-overflow').scrollTop(pos.top + sctop);
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
          if (!(trig = type != null ? type.trig : void 0)) {
            return;
          }
          dfn = trig ? trig.prefix ? trig.symbol : type.name + trig.symbol : type.name;
          $pill = $("<div class=\"ttbox-pill\"><div class=\"ttbox-pill-close\">×</div>" + ("<dfn>" + dfn + "</dfn><span></span></div>"));
          $pill.find('*').andSelf().prop('contenteditable', 'false');
          ($span = $pill.find('span')).prop('contenteditable', 'true');
          if (trig.prefix) {
            $pill.addClass('ttbox-pill-prefix');
          }
          if (trig.className) {
            $pill.addClass(trig.className);
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
            var $t, pos, scleft;
            $pill.after($t = $('<span style="width:1px">'));
            scleft = $t.closest('.ttbox-overflow').scrollLeft();
            pos = $t.position();
            $t.closest('.ttbox-overflow').scrollLeft(pos.left + scleft);
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

//# sourceMappingURL=data:application/json;base64,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TUFBUCxLQUFpQixRQUFwQjtJQUNJLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BRHJCO0dBQUEsTUFFSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixVQUFqQixJQUFnQyxNQUFNLENBQUMsR0FBMUM7SUFDRCxNQUFBLENBQU8sU0FBQTthQUFHO0lBQUgsQ0FBUCxFQURDO0dBQUEsTUFBQTtJQUdELElBQUksQ0FBQyxLQUFMLEdBQWEsTUFIWjs7QUFoK0JMIiwiZmlsZSI6InR0Ym94LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZ2xvYiA9IGdsb2JhbCA/IHdpbmRvd1xuXG5kb2MgICA9IGdsb2IuZG9jdW1lbnRcbkkgICAgID0gKGEpIC0+IGFcbm1lcmdlID0gKHQsIG9zLi4uKSAtPiB0W2tdID0gdiBmb3Igayx2IG9mIG8gd2hlbiB2ICE9IHVuZGVmaW5lZCBmb3IgbyBpbiBvczsgdFxubGF0ZXIgPSAoZm4pIC0+IHNldFRpbWVvdXQgZm4sIDFcbmhvbGQgID0gKG1zLCBmKSAtPiBsYXN0ID0gMDsgdGltID0gbnVsbDsgKGFzLi4uKSAtPlxuICAgIGNsZWFyVGltZW91dCB0aW0gaWYgdGltXG4gICAgdGltID0gc2V0VGltZW91dCAoLT5mIGFzLi4uKSwgbXNcbmxhc3QgID0gKGFzKSAtPiBhcz9bYXMubGVuZ3RoIC0gMV1cbmZpbmQgID0gKGFzLCBmbikgLT4gcmV0dXJuIGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKVxuYXJyYXlGaWx0ZXIgPSAoYXMsZm4pIC0+IChhIGZvciBhIGluIGFzIHdoZW4gZm4oYSkpXG5cblVBID0gZ2xvYj8ubmF2aWdhdG9yPy51c2VyQWdlbnRcbltpc0lFLCBJRVZlcl0gPSAvTVNJRSAoWzAtOV17MSx9Wy4wLTldezAsfSkvLmV4ZWMoVUEpID8gW11cbklFVmVyID0gcGFyc2VJbnQgSUVWZXIgaWYgSUVWZXJcbmlzQ2hyb21lICA9IFVBLmluZGV4T2YoJ0Nocm9tZScpID4gMFxuXG4jIGRlZmluZSBhbiBpbnZpc2libGUgcHJvcGVydHlcbmRlZiA9IChvYmosIHByb3BzKSAtPiBmb3IgbmFtZSwgdmFsdWUgb2YgcHJvcHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqLCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIG51bGxcblxuenduaiAgICAgICAgID0gXCLigItcIiAjICZ6d25qO1xuZmlsdGVyQTAgICAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MDBhMC9nLCAnICcgIyBuYnNwXG5maWx0ZXJad25qICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUyMDBiL2csICcnXG5maWx0ZXIgICAgICAgPSAocykgLT4gZmlsdGVyQTAgZmlsdGVyWnduaiBzXG5hcHBlbmRBZnRlciAgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsLm5leHRTaWJsaW5nKVxuYXBwZW5kQmVmb3JlID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbClcbmhleGR1bXAgICAgICA9IChzKSAtPiAoYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSBmb3IgYyBpbiBzKS5qb2luKCcgJylcblxuIyBpbmplY3QgY3NzXG5kbyAtPlxuICAgIHN0eWxlcyA9IFwiXG4udHRib3ggKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB3aWR0aDogYXV0bztcbn1cblxuLnR0Ym94IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbi50dGJveCBkZm4ge1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG59XG5cbi50dGJveC1vdmVyZmxvdyB7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgb3ZlcmZsb3cteDogYXV0bztcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG4udHRib3gtb3ZlcmZsb3c6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuLnR0Ym94LXNob3dpbmctc3VnZ2VzdCAudHRib3gtb3ZlcmZsb3cge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG5cbi50dGJveC1pbnB1dCB7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuLnR0Ym94LWlucHV0ICoge1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG5cbi50dGJveC1pbnB1dCAqIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1pbnB1dCBiciB7XG4gICAgZGlzcGxheTogaW5saW5lO1xufVxuXG4udHRib3gtc3VnLW92ZXJmbG93IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICAvKiBib3JkZXI6IDFweCBzb2xpZCAjYmJiOyAqL1xuICAgIC8qIGJvcmRlci1yYWRpdXM6IDNweDsgKi9cbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3gtc2hhZG93OiAwIDJweCAycHggcmdiYSgwLDAsMCwwLjMpO1xuICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLnR0Ym94LXN1Z2dlc3Qge1xuICAgIG1pbi1oZWlnaHQ6IDVweDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBsaW5lLWhlaWdodDogMzhweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpmaXJzdC1jaGlsZCB7XG4gICAgcGFkZGluZy10b3A6IDVweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDAgMTBweCAwIDI1cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gZGZuIHtcbiAgICBtaW4td2lkdGg6IDcwcHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSBzcGFuIHtcbiAgICBjb2xvcjogI2NjYztcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiAwIDEwcHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIgc3BhbiB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDE7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgY29sb3I6ICM5MjkyOTI7XG4gICAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIGhyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbWFyZ2luLXRvcDogMS4xNWVtO1xuICAgIGxlZnQ6IDIwcHg7XG4gICAgcmlnaHQ6IDEwcHg7XG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQ7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbn1cbi50dGJveC1zZWxlY3RlZCB7XG4gICAgYmFja2dyb3VuZDogI2VlZTtcbn1cblxuLnR0Ym94LXBpbGwge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsaW5lLWhlaWdodDogMjRweDtcbiAgICBtYXJnaW46IDAgNHB4O1xuICAgIGJhY2tncm91bmQ6ICM1Y2I4NWM7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzU4YjY1ODtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMCAxMnB4O1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBtaW4td2lkdGg6IDMwcHg7XG59XG4udHRib3gtcGlsbCBkZm4ge1xuICAgIHBhZGRpbmc6IDAgM3B4IDAgMTRweDtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbn1cbi50dGJveC1waWxsLXByZWZpeCBkZm4ge1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG4udHRib3gtcGlsbC1jbG9zZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBwYWRkaW5nOiAwIDVweDtcbiAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXBpbGwgc3BhbiB7XG4gICAgbWluLXdpZHRoOiA1cHg7XG59XG5cbi50dGJveC1wbGFjZWhvbGRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiA1cHg7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cblwiXG4gICAgY3NzID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBjc3MudHlwZSA9ICd0ZXh0L2NzcydcbiAgICBjc3MuaW5uZXJIVE1MID0gc3R5bGVzXG4gICAgZG9jLmhlYWQuYXBwZW5kQ2hpbGQgY3NzXG5cbmNsYXNzIFR5cGVcbiAgICBjb25zdHJ1Y3RvcjogKEBuYW1lLCBvcHRzKSAtPlxuICAgICAgICBtZXJnZSBALCB7Zm9ybWF0Okl9LCBvcHRzXG5cbmNsYXNzIFRyaWdnZXJcbiAgICBjb25zdHJ1Y3RvcjogKEBzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgICAgICBtZXJnZSBALCBvcHRzXG4gICAgICAgIEB0eXBlcyA9IGlmIEFycmF5LmlzQXJyYXkgdHlwZXMgdGhlbiB0eXBlcyBlbHNlIFt0eXBlc11cbiAgICAgICAgIyBzZXQgYmFjayByZWZlcmVuY2VcbiAgICAgICAgdC50cmlnID0gdGhpcyBmb3IgdCBpbiBAdHlwZXNcbiAgICAgICAgaWYgQHByZWZpeFxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudCBoYXZlIG11bHRpcGxlIHR5cGVzIHdpdGggcHJlZml4IHRyaWdnZXJcIikgaWYgQHR5cGVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHJlID0gUmVnRXhwIFwiXihcXFxcdyopXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuXG4jIFNraXAgenduaiBjaGFycyB3aGVuIG1vdmluZyBsZWZ0L3JpZ2h0XG5za2lwWnduaiA9IChwZWwsIGQsIGVuZCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIG4gPSBpZiBlbmQgdGhlbiByLmVuZENvbnRhaW5lciBlbHNlIHIuc3RhcnRDb250YWluZXJcbiAgICBpID0gaWYgZW5kIHRoZW4gci5lbmRPZmZzZXQgZWxzZSByLnN0YXJ0T2Zmc2V0XG4gICAgcmV0dXJuIHVubGVzcyBuLm5vZGVUeXBlID09IDNcbiAgICBjID0gbi5ub2RlVmFsdWUuY2hhckNvZGVBdCAoaWYgZCA8IDAgdGhlbiBpICsgZCBlbHNlIGkpXG4gICAgaWYgYyA9PSA4MjAzXG4gICAgICAgICMgbW92ZVxuICAgICAgICBzZXRDdXJzb3JQb3MgciwgaSArIGRcbiAgICAgICAgc2tpcFp3bmogZCwgZW5kICMgYW5kIG1heWJlIGNvbnRpbnVlIG1vdmluZz9cblxuaXNQYXJlbnQgPSAocG4sIG4pIC0+XG4gICAgaWYgbiA9PSBudWxsIHRoZW4gZmFsc2UgZWxzZSBpZiBwbiA9PSBuIHRoZW4gdHJ1ZSBlbHNlIGlzUGFyZW50KHBuLCBuLnBhcmVudE5vZGUpXG5cbiMgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbmN1cnNvciA9IChwZWwpIC0+XG4gICAgcyA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHJldHVybiB1bmxlc3Mgcy5yYW5nZUNvdW50XG4gICAgciA9IHMuZ2V0UmFuZ2VBdCgwKVxuICAgIGlmIGlzUGFyZW50KHBlbCwgci5zdGFydENvbnRhaW5lcikgdGhlbiByIGVsc2UgbnVsbFxuXG4jIGZpbHRlciB0aGUgcmFuZ2UgdG8gZ2V0IHJpZCBvZiB1bndhbnRlZCBjaGFyc1xucmFuZ2VTdHIgPSAocikgLT4gZmlsdGVyIHIudG9TdHJpbmcoKVxuXG5maXJzdElzV2hpdGUgPSAocykgLT4gL15cXHMuKi8udGVzdChzID8gJycpXG5sYXN0SXNXaGl0ZSAgPSAocykgLT4gLy4qXFxzJC8udGVzdChzID8gJycpXG5cbndvcmRSYW5nZUF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgIyBleHBhbmQgYmVnaW5uaW5nXG4gICAgd2hpbGUgdC5zdGFydE9mZnNldCA+IDAgYW5kIG5vdCBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgLSAxXG4gICAgIyBvbmUgZm9yd2FyZCBhZ2FpblxuICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCArIDEgaWYgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAjIGV4cGFuZCBlbmRcbiAgICBsZW4gPSB0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwXG4gICAgd2hpbGUgdC5lbmRPZmZzZXQgPCBsZW4gYW5kIG5vdCBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCArIDFcbiAgICAjIG9uZSBiYWNrIGFnYWluXG4gICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0IC0gMSBpZiBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgcmV0dXJuIHRcblxuZW50aXJlVGV4dEF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgdC5zZWxlY3ROb2RlQ29udGVudHMgdC5zdGFydENvbnRhaW5lclxuICAgIHJldHVybiB0XG5cbmZpbmRJblJhbmdlID0gKHIsIGNoYXIpIC0+XG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgbWF4ID0gKHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDApIC0gMVxuICAgIGZvciBpIGluIFt0LnN0YXJ0T2Zmc2V0Li5tYXhdIGJ5IDFcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCBpXG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCBpICsgMVxuICAgICAgICByZXR1cm4gaSBpZiB0LnRvU3RyaW5nKCkgPT0gY2hhclxuICAgIHJldHVybiAtMVxuXG5zZXRDdXJzb3JQb3MgPSAociwgcG9zID0gMCkgLT5cbiAgICB0ID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICB0LnNldFN0YXJ0IHIuc3RhcnRDb250YWluZXIsIHBvc1xuICAgIHQuc2V0RW5kIHIuc3RhcnRDb250YWluZXIsIHBvc1xuICAgIHNlbCA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgIHNlbC5hZGRSYW5nZSB0XG5cbnNldEN1cnNvckVsID0gKGVsLCBwb3MgPSAwKSAtPlxuICAgIHIgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHIuc2VsZWN0Tm9kZUNvbnRlbnRzIGVsXG4gICAgcG9zID0gZWw/Lm5vZGVWYWx1ZT8ubGVuZ3RoIGlmIHBvcyA8IDBcbiAgICBzZXRDdXJzb3JQb3MgciwgcG9zXG5cbiMgRnVuY3Rpb24gdG8gbWFrZSB0dGJveCBvdXQgb2YgYW4gZWxlbWVudCB3aXRoIHRyaWdnZXJzXG4jXG50dGJveCA9IChlbCwgdHJpZ3MuLi4pIC0+XG5cbiAgICAjIGxvY2FsIHJlZmVyZW5jZSB0byByZW5kZXIgcGx1Z1xuICAgIHJlbmRlciA9IHR0Ym94LnJlbmRlcigpXG5cbiAgICAjIGxldCByZW5kZXIgZGVjaWRlIHdlIGhhdmUgYSBnb29kIGVsXG4gICAgZWwgPSByZW5kZXIuaW5pdChlbClcblxuICAgICMgYW5kIGNoZWNrIHdlIGdvdCBhIGdvb2QgdGhpbmcgYmFja1xuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIERJVicpIHVubGVzcyBlbC50YWdOYW1lID09ICdESVYnXG5cbiAgICAjIGRpc3BhdGNoIGV2ZW50cyBvbiBpbmNvbWluZyBkaXZcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50ICdFdmVudCdcbiAgICAgICAgbWVyZ2UgZSwgb3B0cywge3R0Ym94OmZhw6dhZGV9XG4gICAgICAgIGUuaW5pdEV2ZW50IFwidHRib3g6I3tuYW1lfVwiLCB0cnVlLCBmYWxzZVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50IGVcblxuICAgICMgYWRkIGEgbmV3IHBpbGwgdG8gaW5wdXRcbiAgICBhZGRwaWxsID0gKHR5cGUsIGl0ZW0pIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgIyBpbXBsaWNpdGx5IGRvZXMgdGlkeVxuICAgICAgICByZXR1cm4gcmVuZGVyLnBpbGxpZnkgciwgdHlwZSwgaXRlbSwgZGlzcGF0Y2hcbiAgICBhZGR0ZXh0ID0gKHRleHQpIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgIHJldHVybiByXG4gICAgY2xlYXIgPSAtPlxuICAgICAgICByZW5kZXIuY2xlYXIoKVxuICAgICAgICB1cGRhdGUoKVxuICAgIHRyaWdnZXIgPSAoc3ltYm9sKSAtPlxuICAgICAgICAjIG1ha2Ugc3VyZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICByZW5kZXIuZm9jdXMoKSAjIGVuc3VyZSB3ZSBoYXZlIGZvY3VzXG4gICAgICAgICMgd2Ugd2FudCB0byBiZSB0byB0aGUgcmlnaHQgb2YgYW55IHp3bmpcbiAgICAgICAgIyBpbiB0aGUgY3VycmVudCB0ZXh0IGJsb2NrXG4gICAgICAgIHNraXBad25qIGVsLCAxXG4gICAgICAgICMgZ2V0IHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICBzdHIgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGRvIG5vdGhpbmcgaWYgY3VycmVudCB3b3JkIGFscmVhZHkgY29udGFpbnMgdHJpZ2dlciBzeW1ib2xcbiAgICAgICAgcmV0dXJuIGlmIHN0ci5pbmRleE9mKHN5bWJvbCkgPj0gMFxuICAgICAgICAjIGluc2VydCBzcGFjZSBpZiB3ZSBoYXZlIGNvbnRlbnQgYmVmb3JlaGFuZFxuICAgICAgICBpbnNlcnQgPSBpZiBzdHIgPT0gJycgdGhlbiBzeW1ib2wgZWxzZSBcIiAje3N5bWJvbH1cIlxuICAgICAgICBjdXJzb3IoZWwpLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlIGluc2VydFxuICAgICAgICAjIG1ha2UgY29udGlndW91cyB0ZXh0IG5vZGVzXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgIyBwb3NpdGlvbiBhdCB0aGUgdmVyeSBlbmQgb2YgdGhpc1xuICAgICAgICByID0gZW50aXJlVGV4dEF0Q3Vyc29yKGVsKVxuICAgICAgICBzZXRDdXJzb3JQb3Mgciwgci5lbmRPZmZzZXQgLSBzeW1ib2wubGVuZ3RoXG4gICAgICAgICMgdHJpZ2dlciBzdWdnZXN0XG4gICAgICAgIHVwZGF0ZSgpXG5cbiAgICAjIGV4cG9zZWQgb3BlcmF0aW9uc1xuICAgIGZhw6dhZGUgPSB7XG4gICAgICAgIGFkZHBpbGwsIGFkZHRleHQsIHJlbmRlciwgY2xlYXIsIHRyaWdnZXJcbiAgICAgICAgdmFsdWVzOiAtPiByZW5kZXIudmFsdWVzKClcbiAgICAgICAgc2V0dmFsdWVzOiAodmFsdWVzKSAtPlxuICAgICAgICAgICAgY2xlYXIoKVxuICAgICAgICAgICAgdmFsdWVzLmZvckVhY2ggKHYpIC0+XG4gICAgICAgICAgICAgICAgaWYgdHlwZW9mIHYgPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgYWRkdGV4dCB2XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBhZGRwaWxsIHYudHlwZSwgdi5pdGVtXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICBmb2N1czogLT4gcmVuZGVyLmZvY3VzKClcbiAgICAgICAgcGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICAgICByZW5kZXIuc2V0UGxhY2Vob2xkZXIodHh0KVxuICAgICAgICAgICAgdXBkYXRlKCkgIyB0b2dnbGUgcGxhY2Vob2xkZXJcbiAgICB9XG5cbiAgICBwcmV2dmFsdWVzID0gW11cblxuICAgIHVwZGF0ZSA9IGhvbGQgMywgKGNoYXIpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgdmFsdWVzXG4gICAgICAgIHZhbHVlcyA9IHJlbmRlci52YWx1ZXMoKVxuICAgICAgICAjIHNob3cgcGxhY2Vob2xkZXIgaWYgaXQncyBlbXB0eVxuICAgICAgICByZW5kZXIudG9nZ2xlUGxhY2Vob2xkZXIgdmFsdWVzLmxlbmd0aCA9PSAwXG4gICAgICAgIHVubGVzcyB2YWx1ZXMucmVkdWNlICgocCwgYywgaSkgLT4gcCBhbmQgYyA9PSBwcmV2dmFsdWVzW2ldKSwgdHJ1ZVxuICAgICAgICAgICAgcHJldnZhbHVlcyA9IHZhbHVlc1xuICAgICAgICAgICAgZGlzcGF0Y2ggJ2NoYW5nZScsIHt2YWx1ZXN9XG4gICAgICAgICMgYSBwaWxsIGVkaXQgdHJ1bWZzIGFsbFxuICAgICAgICByZXR1cm4gaWYgaGFuZGxlcGlsbCgpXG4gICAgICAgICMgY3Vyc29yIHJhbmdlIGZvciB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcihlbClcbiAgICAgICAgIyBYWFggb3B0aW1pemUgd2l0aCBiZWxvdz9cbiAgICAgICAgdW5sZXNzIHJcbiAgICAgICAgICAgIHN0b3BzdWc/KClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBhIHRyaWdnZXIgaW4gdGhlIHdvcmQ/XG4gICAgICAgIHRyaWcgPSBmaW5kIHRyaWdzLCAodCkgLT4gdC5yZS50ZXN0IHdvcmRcbiAgICAgICAgIyBubyB0cmlnZ2VyIGZvdW5kIGluIGN1cnJlbnQgd29yZCwgYWJvcnRcbiAgICAgICAgdW5sZXNzIHRyaWdcbiAgICAgICAgICAgIHN0b3BzdWc/KClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmIHRyaWcuc3ltYm9sIGlzICdkZWZhdWx0J1xuICAgICAgICAgICAgZGVmYXVsdFN1Z2dlc3QgdHJpZy5mbiwgciwgLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBleGVjIHRyaWdnZXIgdG8gZ2V0IHBhcnRzXG4gICAgICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICAgICAjIGZpbmQgcG9zc2libGUgdHlwZXNcbiAgICAgICAgICAgIHR5cGVzID0gdHJpZy50eXBlcy5maWx0ZXIgKHQpIC0+IHRyaWcucHJlZml4IG9yIHQubmFtZT8uaW5kZXhPZih0eXBlbmFtZSkgPT0gMFxuICAgICAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgICAgIGhhbmRsZXR5cGVzIHIsIHRyaWcsIHR5cGVzLCBjaGFyLCB2YWx1ZXNcblxuICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICBzZXRTdWdtb3ZlciA9IChfc3VnbW92ZXIpIC0+IHN1Z21vdmVyID0gX3N1Z21vdmVyXG4gICAgc3RvcHN1ZyA9IC0+XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICAgICAgcmVuZGVyLnVuc3VnZ2VzdCgpXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0c3RvcCdcblxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGxzIGxlYXZlXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbHJlbW92ZScsIChldiktPlxuICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgdXBkYXRlKCkgIyB0cmlnZ2VyIHZhbHVlLWNoYW5nZVxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGwgbG9zZSBmb2N1c1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxmb2N1c291dCcsIHN0b3BzdWdcblxuICAgIGhhbmRsZXR5cGVzID0gKHJhbmdlLCB0cmlnLCB0eXBlcywgY2hhciwgdmFsdWVzKSAtPlxuICAgICAgICAjIGlmIHRyaWdnZXIgaXMgJ2RlZmF1bHQnLCB0aGUgYWN0dWFsIHRyaWdnZXIgaXMgdGhlIGVudGlyZSBzZWFyY2ggc3RyaW5nXG4gICAgICAgICMgaW4gb3RoZXIgY2FzZXMgdGhlIHRyaWdnZXIgaXMgdGhlIHRyaWcuc3ltYm9sXG4gICAgICAgIHRyaWdnZXJTeW1ib2wgPSB0cmlnLnN5bWJvbFxuICAgICAgICAjIHRoZSB0cmlnZ2VyIHBvc2l0aW9uIGluIHRoZSB3b3JkIHJhbmdlXG4gICAgICAgIHRwb3MgPSBmaW5kSW5SYW5nZSByYW5nZSwgdHJpZ2dlclN5bWJvbFxuICAgICAgICAjIG5vIHRwb3M/IVxuICAgICAgICByZXR1cm4gaWYgdHBvcyA8IDBcbiAgICAgICAgIyByYW5nZSBmb3IgdHlwZSBuYW1lICh3aGljaCBtYXkgbm90IGJlIHRoZSBlbnRpcmUgbmFtZSlcbiAgICAgICAgdHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgIHRyYW5nZS5zZXRFbmQgdHJhbmdlLmVuZENvbnRhaW5lciwgdHBvc1xuICAgICAgICAjIHdoZXRoZXIgdGhlIGxhc3QgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyXG4gICAgICAgIHdhc3RyaWcgPSBjaGFyID09IHRyaWcuc3ltYm9sXG4gICAgICAgICMgaGVscGVyIHdoZW4gZmluaXNoZWQgc2VsZWN0aW5nIGEgdHlwZVxuICAgICAgICBzZWxlY3RUeXBlID0gKHR5cGUpIC0+XG4gICAgICAgICAgICByZW5kZXIucGlsbGlmeSByYW5nZSwgdHlwZSwgbnVsbCwgZGlzcGF0Y2hcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzZWxlY3QnLCB7dHJpZywgdHlwZX1cblxuICAgICAgICBpZiB0eXBlcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIGVsc2UgaWYgdHlwZXMubGVuZ3RoID09IDEgYW5kIG5vdCBzdWdtb3ZlclxuICAgICAgICAgICAgIyBvbmUgcG9zc2libGUgc29sdXRpb25cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIGZvciB0cmlnZ2VyIGNoYXIsIHdlIHNlbGVjdCB0aGUgZmlyc3QgdHlwZSBzdHJhaWdodCBhd2F5XG4gICAgICAgICAgICAgICAgc2VsZWN0VHlwZSBmaW5kIHR5cGVzLCAodCkgLT4gIXQuZGl2aWRlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHdoZW4gdGhlIGtleSBpbnB1dCB3YXMgdGhlIHRyaWdnZXIgYW5kIHRoZXJlIGFyZVxuICAgICAgICAgICAgIyBtdWx0aXBsZSBwb3NzaWJsZSB2YWx1ZXMsIHBvc2l0aW9uLiBtb3ZlIHRvIGp1c3QgYmVmb3JlXG4gICAgICAgICAgICAjIHRoZSB0cmlnZ2VyIGNoYXIuXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBtb3ZlIHRoZSBjdXJzb3IgdG8gYWxsb3cgZm9yIHN1Z2dlc3QgaW5wdXRcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3MgcmFuZ2UsIHRwb3NcbiAgICAgICAgICAgICMgc3RhcnQgYSBzdWdnZXN0IGZvciBjdXJyZW50IHBvc3NpYmxlIHR5cGVzXG4gICAgICAgICAgICB0eXBlc3VnZ2VzdCB0cmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzLCB2YWx1ZXNcblxuXG4gICAgIyBzdWdnZXN0IGZvciBnaXZlbiB0eXBlc1xuICAgIHR5cGVzdWdnZXN0ID0gKHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlcywgdmFsdWVzKSAtPlxuICAgICAgICAjIGZpbHRlciB0byBvbmx5IHNob3cgdHlwZXMgdGhhdCBhcmUgc3VwcG9zZWQgdG8gYmUgdGhlcmVcbiAgICAgICAgIyBnaXZlbiBsaW1pdE9uZTpjb25kaXRpb25cbiAgICAgICAgZnR5cGVzID0gZG8gLT5cbiAgICAgICAgICAgIG5vdEluVmFsdWVzID0gKHQpIC0+ICEodmFsdWVzPy5maWx0ZXIgKHYpIC0+IHY/LnR5cGU/Lm5hbWUgPT0gdC5uYW1lKT8ubGVuZ3RoXG4gICAgICAgICAgICBhcnJheUZpbHRlciB0eXBlcywgKHR5cGUpIC0+ICF0eXBlLmxpbWl0T25lIHx8IG5vdEluVmFsdWVzKHR5cGUpXG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgaGVscGVyIHRvIGNyZWF0ZSBzdWdzZWxlY3QgZnVuY3Rpb25zXG4gICAgICAgIHN1Z3NlbGVjdGZvciA9IChpdGVtKSAtPiAtPlxuICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgIyB0aGUgdHlwZSBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgc2VsZWN0VHlwZSBpdGVtXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgIyBmdW5jdGlvbiB0aGF0IHN1Z2dlc3QgdHlwZXNcbiAgICAgICAgZm50eXBlcyA9IChfLCBjYikgLT4gY2IgZnR5cGVzXG4gICAgICAgICMgaWYgdGhlcmUgaXMgb25seSBvbmUsIHNldCBpdCBhcyBwb3NzaWJsZSBmb3IgcmV0dXJuIGtleVxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgZnR5cGVzWzBdIGlmIHR5cGVzLmxlbmd0aCA9PSAxXG4gICAgICAgICMgcmVuZGVyIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudHlwZXMsIHJhbmdlLCAtMSwgc2V0U3VnbW92ZXIsICh0eXBlLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlJywge3RyaWcsIHR5cGV9XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlcycsIHt0cmlnLCBmdHlwZXN9XG5cbiAgICBkZWZhdWx0U3VnZ2VzdCA9ICh0cmlnZ2VyRm4sIHJhbmdlLCBzdWdTdGFydEluZGV4KS0+XG5cbiAgICAgICAgc2VsZWN0SXRlbSA9IChpdGVtKSAtPlxuICAgICAgICAgICAgIyBTZXQgc2VsZWN0ZWQgaXRlbSBpbiBzZWFyY2ggYm94IGFuZCB0cmlnZ2VyIHNlYXJjaFxuICAgICAgICAgICAgZm9yIGlucHV0IGluICQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgICAgICAgICAgaW5wdXQuY2hpbGROb2Rlc1swXS5ub2RlVmFsdWUgPSBpdGVtLnZhbHVlXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zZWxlY3QnLCBpdGVtXG5cbiAgICAgICAgc3VnU2VsZWN0Rm4gPSAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPlxuICAgICAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAgICAgIyBzZWxlY3QgdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtIGl0ZW1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW0nLCBpdGVtXG5cbiAgICAgICAgIyBXaGVuIHBlcmZvcm1pbmcgZGVmYXVsdCBzdWdnZXN0aW9ucyB3ZSB3YW50IHRvIG1hdGNoIG9uIGFsbFxuICAgICAgICAjIHNlYXJjaCB0ZXJtc1xuICAgICAgICByYW5nZS5zZXRTdGFydCByYW5nZS5zdGFydENvbnRhaW5lciwgMFxuICAgICAgICByZW5kZXIuc3VnZ2VzdCB0cmlnZ2VyRm4sIHJhbmdlLCBzdWdTdGFydEluZGV4LCBzZXRTdWdtb3Zlciwgc3VnU2VsZWN0Rm5cblxuICAgIGhhbmRsZXBpbGwgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHJldHVybiB1bmxlc3MgdHlwZW9mIHBpbGwudHlwZT8uc3VnZ2VzdCA9PSAnZnVuY3Rpb24nICMgZGVmaW5pdGVseSBhIHN1Z2dlc3RcbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIHN1Z2dlc3QgZnVuY3Rpb24gYXMgZm4gdG8gcmVuZGVyLnN1Z2dlc3RcbiAgICAgICAgZm52YWxzID0gKHdvcmQsIGNiKSAtPiBwaWxsLnR5cGUuc3VnZ2VzdCB3b3JkLCBjYiwgcGlsbC50eXBlLCBwaWxsLnRyaWdcbiAgICAgICAgIyBoZWxwZXIgd2hlbiB3ZSBkZWNpZGUgb24gYW4gaXRlbVxuICAgICAgICBzZWxlY3RJdGVtID0gKGl0ZW0pIC0+XG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICAgICAgIyBsYXRlciBzaW5jZSBpdCBtYXkgYmUgc2VsZWN0IGZyb20gY2xpY2ssIHdoaWNoIGlzIG1vdXNlZG93blxuICAgICAgICAgICAgbGF0ZXIgLT4gcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zZWxlY3QnLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm52YWxzLCByLCAtMSwgc2V0U3VnbW92ZXIsIChpdGVtLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IC0+XG4gICAgICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICAgICAjIHNlbGVjdCB0aGUgaXRlbVxuICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0gaXRlbVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbScsIHtwaWxsLCBpdGVtfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkIGFib3V0IGl0XG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXMnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHRydWUgIyBzaWduYWwgd2UgZGVhbHQgd2l0aCBpdFxuXG4gICAgIyBtb3ZlIHRoZSBpbnB1dCBvdXQgb2YgYSBwaWxsIChpZiB3ZSdyZSBpbiBhIHBpbGwpXG4gICAgcGlsbGp1bXAgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgaGFuZGxlcnMgPVxuICAgICAgICBrZXlkb3duOiAoZSkgLT5cbiAgICAgICAgICAgICMgZml4IEZpcmVmb3ggaGlnaGxpZ2ggYnVnIGNhdXNpbmcgaGlnaGxpZ2h0ZWQgd29yZHMgbm90IHRvIGJlIHJlbW92ZWQgb24gbmV3IGlucHV0XG4gICAgICAgICAgICB0dGJveENvbnRlbnQgPSByZW5kZXIudmFsdWVzKClbMF1cbiAgICAgICAgICAgIGhpZ2hsaWdodGVkVGV4dCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpXG4gICAgICAgICAgICByZW5kZXIuY2xlYXIoKSBpZiBoaWdobGlnaHRlZFRleHQuaW5kZXhPZih0dGJveENvbnRlbnQpPi0xXG5cbiAgICAgICAgICAgICMgdGhpcyBkb2VzIGFuIGltcG9ydGFudCBlbC5ub3JtYWxpemUoKSB0aGF0IGVuc3VyZXMgd2UgaGF2ZVxuICAgICAgICAgICAgIyBjb250aWd1b3VzIHRleHQgbm9kZXMsIGNydWNpYWwgZm9yIHRoZSByYW5nZSBsb2dpYy5cbiAgICAgICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIGRvbnQgd2FudCBET00gY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgc3Vnc2VsZWN0PygpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgcGlsbGp1bXAoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBzdWdtb3ZlclxuICAgICAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAzOCAgICAgICMgdXBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKC0xKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlID09IDQwICMgZG93blxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoKzEpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSBpbiBbMzcsIDhdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsIC0xLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGJhY2t3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcbiAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlIGluIFszOSwgNDZdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgICAgIHBhc3RlOiAoZSkgLT5cbiAgICAgICAgICAgICMgc3RvcCBkZWZhdWx0IHBhc3RlIGFjdGlvblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgICAgICMgZ3JhYiB0aGUgYWN0dWFsIGV2ZW50IChpbiBjYXNlIGpRdWVyeSB3cmFwcGVkKVxuICAgICAgICAgICAgZSA9IChlLm9yaWdpbmFsRXZlbnQgPyBlKVxuXG4gICAgICAgICAgICBpZiBlPy5jbGlwYm9hcmREYXRhXG4gICAgICAgICAgICAgICAgIyBTdGFuZGFyZCBzdHlsZVxuICAgICAgICAgICAgICAgIHR4dCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgICAgIGRvYy5leGVjQ29tbWFuZCAnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0eHRcbiAgICAgICAgICAgIGVsc2UgaWYgd2luZG93LmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICAgICAjIElFIHN0eWxlXG4gICAgICAgICAgICAgICAgdHh0ID0gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSAnVGV4dCdcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgICAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSB0eHRcblxuICAgICAgICAgICAgdXBkYXRlKClcblxuICAgICAgICAgICAgZmFsc2VcblxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtcGxhY2Vob2xkZXJcIj48L2Rpdj48L2Rpdj4nXG4gICAgc3VnZ2VzdCA9ICc8ZGl2IGNsYXNzPVwidHRib3gtc3VnLW92ZXJmbG93XCI+PGRpdiBjbGFzcz1cInR0Ym94LXN1Z2dlc3RcIj48L2Rpdj48L2Rpdj4nXG4gICAgIyBjYWNoZSBvZiBwaWxsIDxwaWxsaWQsIHBpbGw+IHN0cnVjdHVyZXNcbiAgICBwaWxscyA9IHt9XG4gICAgIyBoZWxwZXIgdG8gdGlkeSBjYWNoZVxuICAgIHRpZHlwaWxscyA9IGhvbGQgNTAwMCwgLT5cbiAgICAgICAgcHJlc2VudCA9ICRlbC5maW5kKCcudHRib3gtcGlsbCcpLm1hcCgtPiAkKEApLmF0dHIgJ2lkJykudG9BcnJheSgpXG4gICAgICAgIGRlbGV0ZSBwaWxsc1tpZF0gZm9yIGlkIGluIE9iamVjdC5rZXlzKHBpbGxzKSB3aGVuIHByZXNlbnQuaW5kZXhPZihpZCkgPCAwXG4gICAgICAgIG51bGxcbiAgICAjIHJldHVybiB0aGUgcGlsbCBzdHJ1Y3R1cmUgZm9yIGFuIGVsZW1lbnRcbiAgICBwaWxsZm9yID0gKGVsKSAtPiBwaWxsc1skKGVsKS5jbG9zZXN0KCcudHRib3gtcGlsbCcpLmF0dHIoJ2lkJyldXG4gICAgIyBnbyB0aHJvdWdoIGNhY2hlIGFuZCBlbnN1cmUgYWxsIHBpbGxzIGhhdmUgdGhlIGl0ZW0gdmFsdWUgb2YgdGhlXG4gICAgIyBlbGVtZW50IHZhbHVlLlxuICAgIGVuc3VyZUl0ZW1zID0gLT5cbiAgICAgICAgcGlsbC5lbnN1cmVJdGVtKCkgZm9yIGssIHBpbGwgb2YgcGlsbHNcbiAgICAgICAgbnVsbFxuXG4gICAgIyBjYWxsIG9mdGVuLiBmaXggdGhpbmdzLlxuICAgIHRpZHkgPSAtPlxuICAgICAgICAkaW5wID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgIGlucCA9ICRpbnBbMF1cbiAgICAgICAgIyBtZXJnZSBzdHVmZiB0b2dldGhlciBhbmQgcmVtb3ZlIGVtcHR5IHRleHRub2Rlcy5cbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgZmlyc3QgZW5zdXJlIHRoZXJlJ3MgYSA8YnI+IGF0IHRoZSBlbmQgKG9yIDxpPiBmb3IgSUUpXG4gICAgICAgIHRhZyA9IGlmIGlzSUUgdGhlbiAnaScgZWxzZSAnYnInXG4gICAgICAgIHVubGVzcyAkaW5wLmNoaWxkcmVuKCkubGFzdCgpLmlzIHRhZ1xuICAgICAgICAgICAgJGlucC5maW5kKFwiPiAje3RhZ31cIikucmVtb3ZlKClcbiAgICAgICAgICAgICRpbnAuYXBwZW5kIFwiPCN7dGFnfT5cIlxuICAgICAgICBjaGlsZHMgPSBpbnAuY2hpbGROb2Rlc1xuICAgICAgICBmaXJzdCA9IGNoaWxkc1swXVxuICAgICAgICAjIGVuc3VyZSB0aGUgd2hvbGUgdGhpbmdzIHN0YXJ0cyB3aXRoIGEgendualxuICAgICAgICBpZiBmaXJzdD8ubm9kZVR5cGUgIT0gMyBvciBmaXJzdD8ubm9kZVZhbHVlP1swXSAhPSB6d25qXG4gICAgICAgICAgICAkaW5wWzBdLmluc2VydEJlZm9yZSBkb2MuY3JlYXRlVGV4dE5vZGUoenduaiksIGZpcnN0XG4gICAgICAgICMgZW5zdXJlIHRoZXJlJ3MgYWx3YXlzIGEgenduaiBhZnRlciBldmVyeSBlbGVtZW50IG5vZGVcbiAgICAgICAgZm9yIG4gaW4gY2hpbGRzIHdoZW4gbj8ubm9kZVR5cGUgPT0gMSBhbmQgbj8ubmV4dFNpYmxpbmc/Lm5vZGVUeXBlID09IDFcbiAgICAgICAgICAgIGFwcGVuZEFmdGVyIG4sIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMgYWdhaW4sIGVuc3VyZSBjb250aWdvdXMgbm9kZXNcbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgbW92ZSBjdXJzb3IgdG8gbm90IGJlIG9uIGJhZCBlbGVtZW50IHBvc2l0aW9uc1xuICAgICAgICBpZiByID0gY3Vyc29yKCRlbFswXSlcbiAgICAgICAgICAgIGlmIChyLnN0YXJ0Q29udGFpbmVyID09IGlucCBvciByLmVuZENvbnRhaW5lciA9PSBpbnApXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMSBpZiBuXG4gICAgICAgICAgICAjIGZpcmVmb3ggbWFuYWdlcyB0byBmb2N1cyBhbnl0aGluZyBidXQgdGhlIG9ubHlcbiAgICAgICAgICAgICMgY29udGVudGVkaXRhYmxlPXRydWUgb2YgdGhlIHBpbGxcbiAgICAgICAgICAgIHBhcmVuID0gci5zdGFydENvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiBwYXJlbj8ubm9kZU5hbWUgIT0gJ1NQQU4nIGFuZCBwaWxsID0gcGlsbGZvciBwYXJlblxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAjIGtlZXAgY2FjaGUgY2xlYW5cbiAgICAgICAgdGlkeXBpbGxzKClcbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0aWFsaXNlIGJveFxuICAgIGluaXQ6IChlbCkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkbid0IGZpbmQgalF1ZXJ5XCIpIHVubGVzcyAkID0galF1ZXJ5XG4gICAgICAgICRlbCA9ICQoZWwpXG4gICAgICAgICRlbFswXVxuXG4gICAgIyBkcmF3IHN0dWZmIGFuZCBob29rIHVwIGV2ZW50IGhhbmRsZXJzXG4gICAgZHJhdzogKGhhbmRsZXJzKSAtPlxuICAgICAgICAkZWwuaHRtbCBodG1sXG4gICAgICAgICRlbC5vbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LCBoYW5kbGVyIG9mIGhhbmRsZXJzXG5cbiAgICAjIGNsZWFyIHRoZSBzdGF0ZSBvZiB0aGUgaW5wdXRcbiAgICBjbGVhcjogLT5cbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpLmVtcHR5KClcbiAgICAgICAgdGlkeSgpXG5cbiAgICAjIGZvY3VzIHRoZSBpbnB1dCAoaWYgaXQgZG9lc24ndCBhbHJlYWR5IGhhdmUgZm9jdXMpXG4gICAgZm9jdXM6IC0+XG4gICAgICAgIHJldHVybiBpZiBjdXJzb3IoJGVsWzBdKSAjIGFscmVhZHkgaGFzIGZvY3VzXG4gICAgICAgIHRpZHkoKSAjIGVuc3VyZSB3ZSBoYXZlIGEgbGFzdCBub2RlIHRvIHBvc2l0aW9uIGJlZm9yZVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGggLSAyXVxuICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMVxuXG4gICAgIyByZXR1cm4gYW4gYXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgYm94XG4gICAgdmFsdWVzOiAtPlxuICAgICAgICBlbnN1cmVJdGVtcygpXG4gICAgICAgIEFycmF5OjpzbGljZS5jYWxsKCRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzKS5tYXAgKG4pIC0+XG4gICAgICAgICAgICBpZiBuLm5vZGVUeXBlID09IDEgYW5kIG4/LmNsYXNzTmFtZT8uaW5kZXhPZigndHRib3gtcGlsbCcpID49IDBcbiAgICAgICAgICAgICAgICBwaWxsZm9yIG5cbiAgICAgICAgICAgIGVsc2UgaWYgbi5ub2RlVHlwZSA9PSAzXG4gICAgICAgICAgICAgICAgZmlsdGVyIG4ubm9kZVZhbHVlXG4gICAgICAgIC5maWx0ZXIgSVxuXG4gICAgIyByZW1vdmUgc3VnZ2dlc3RcbiAgICB1bnN1Z2dlc3Q6IHVuc3VnZ2VzdCA9IC0+XG4gICAgICAgICQoJy50dGJveC1zdWctb3ZlcmZsb3cnKS5yZW1vdmUoKVxuICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCdcblxuICAgICMgc3RhcnQgc3VnZ2VzdFxuICAgIHN1Z2dlc3Q6IChmbiwgcmFuZ2UsIGlkeCwgbW92ZWNiLCBzZWxlY3RjYikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBmaW5kL2NyZWF0ZSBzdWdnZXN0LWJveFxuICAgICAgICAkc3VnID0gJCgnLnR0Ym94LXN1Z2dlc3QnKVxuICAgICAgICB1bmxlc3MgJHN1Zy5sZW5ndGhcbiAgICAgICAgICAgICRvdmVyZmx3ID0gJChzdWdnZXN0KVxuICAgICAgICAgICAgJHN1ZyA9ICRvdmVyZmx3LmZpbmQgJy50dGJveC1zdWdnZXN0J1xuICAgICAgICAgICAgIyBsb2NrIHdpZHRoIHRvIHBhcmVudFxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzICdtaW4td2lkdGgnLCAkYm94KCkub3V0ZXJXaWR0aCgpXG4gICAgICAgICAgICAjIGFkanVzdCBmb3IgYm9yZGVyIG9mIHBhcmVudFxuICAgICAgICAgICAgYm9yZCA9IHBhcnNlSW50ICRlbC5maW5kKCcudHRib3gtb3ZlcmZsb3cnKS5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKVxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzIHRvcDokZWwub3V0ZXJIZWlnaHQoKSAtIGJvcmRcbiAgICAgICAgICAgICMgYXBwZW5kIHRvIGJveFxuICAgICAgICAgICAgJGJveCgpLmFwcGVuZCAkb3ZlcmZsd1xuICAgICAgICAgICAgIyBpbmRpY2F0ZSB3ZSBhcmUgc2hvd2luZ1xuICAgICAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zaG93aW5nLXN1Z2dlc3QnKVxuICAgICAgICAjIGVtcHR5IHN1Z2dlc3QgYm94IHRvIHN0YXJ0IGZyZXNoXG4gICAgICAgICRzdWcuaHRtbCgnJyk7ICRzdWcub2ZmKClcbiAgICAgICAgIyBjbGFzcyB0byBob29rIHN0eWxpbmcgd2hlbiBzdWdnZXN0aW5nXG4gICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc3VnZ2VzdC1yZXF1ZXN0JylcbiAgICAgICAgIyByZXF1ZXN0IHRvIGdldCBzdWdnZXN0IGVsZW1lbnRzXG4gICAgICAgIGZuIHdvcmQsIChsaXN0KSAtPlxuICAgICAgICAgICAgIyBub3QgcmVxdWVzdGluZyBhbnltb3JlXG4gICAgICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCdcbiAgICAgICAgICAgICMgbG9jYWwgdG9IdG1sIHdpdGggd29yZFxuICAgICAgICAgICAgbG9jVG9IdG1sID0gdG9IdG1sKHdvcmQpXG4gICAgICAgICAgICAjIHR1cm4gbGlzdCBpbnRvIGh0bWxcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCAobCkgLT5cbiAgICAgICAgICAgICAgICAkaCA9ICQobG9jVG9IdG1sKGwpKVxuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGlmIGwuZGl2aWRlclxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1kaXZpZGVyJ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtaXRlbSdcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBsLmNsYXNzTmFtZSBpZiBsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICRzdWcuYXBwZW5kICRoXG4gICAgICAgICAgICAjIGxpc3Qgd2l0aG91dCBkaXZpZGVyc1xuICAgICAgICAgICAgbm9kaXZpZCA9IGxpc3QuZmlsdGVyIChsKSAtPiAhbC5kaXZpZGVyXG4gICAgICAgICAgICBwcmV2aWR4ID0gbnVsbFxuICAgICAgICAgICAgZG8gc2VsZWN0SWR4ID0gKGRvc3RhcnQgPSBmYWxzZSkgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgaWR4IDwgMCBhbmQgIWRvc3RhcnRcbiAgICAgICAgICAgICAgICBpZHggPSAwIGlmIGlkeCA8IDBcbiAgICAgICAgICAgICAgICBpZHggPSBub2RpdmlkLmxlbmd0aCAtIDEgaWYgaWR4ID49IG5vZGl2aWQubGVuZ3RoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHByZXZpZHggPT0gaWR4XG4gICAgICAgICAgICAgICAgcHJldmlkeCA9IGlkeFxuICAgICAgICAgICAgICAgICRzdWcuZmluZCgnLnR0Ym94LXNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmVxKGlkeClcbiAgICAgICAgICAgICAgICAkc2VsLmFkZENsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgc2N0b3AgPSAkc2VsPy5jbG9zZXN0KCcudHRib3gtc3VnLW92ZXJmbG93Jykuc2Nyb2xsVG9wKClcbiAgICAgICAgICAgICAgICBwb3MgPSAkc2VsPy5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgJHNlbD8uY2xvc2VzdCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnNjcm9sbFRvcCAocG9zLnRvcCArIHNjdG9wKVxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaWR4XVxuICAgICAgICAgICAgIyBoYW5kbGUgY2xpY2sgb24gYSBzdWdnZXN0IGl0ZW0sIG1vdXNlZG93biBzaW5jZSBjbGlja1xuICAgICAgICAgICAgIyB3aWxsIGZpZ2h0IHdpdGggZm9jdXNvdXQgb24gdGhlIHBpbGxcbiAgICAgICAgICAgICRzdWcub24gJ21vdXNlZG93bicsIChldikgLT5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCkgIyBubyBsb3NlIGZvY3VzXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG5cbiAgICAgICAgIyB0aGUgdHJpZyBpcyByZWFkIGZyb20gdGhlIHR5cGVcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0cmlnID0gdHlwZT8udHJpZ1xuXG4gICAgICAgICMgY3JlYXRlIHBpbGwgaHRtbFxuICAgICAgICBkZm4gPSBpZiB0cmlnXG4gICAgICAgICAgICBpZiB0cmlnLnByZWZpeCB0aGVuIHRyaWcuc3ltYm9sIGVsc2UgdHlwZS5uYW1lICsgdHJpZy5zeW1ib2xcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdHlwZS5uYW1lXG4gICAgICAgICRwaWxsID0gJChcIjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGxcXFwiPjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGwtY2xvc2VcXFwiPsOXPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8ZGZuPiN7ZGZufTwvZGZuPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIilcbiAgICAgICAgJHBpbGwuZmluZCgnKicpLmFuZFNlbGYoKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAnZmFsc2UnXG4gICAgICAgICgkc3BhbiA9ICRwaWxsLmZpbmQoJ3NwYW4nKSkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ3RydWUnXG4gICAgICAgICMgaWYgcHJlZml4IHN0eWxlIHBpbGxcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgJ3R0Ym94LXBpbGwtcHJlZml4JyBpZiB0cmlnLnByZWZpeFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0cmlnLmNsYXNzTmFtZSBpZiB0cmlnLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLmNsYXNzTmFtZSBpZiB0eXBlLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hdHRyICdkYXRhLXR5cGUnLCB0eXBlLm5hbWVcblxuICAgICAgICAjIGdlbmVyYXRlIGlkIHRvIGFzc29jaWF0ZSB3aXRoIG1lbSBzdHJ1Y3R1cmVcbiAgICAgICAgaWQgPSBcInR0Ym94cGlsbCN7RGF0ZS5ub3coKX1cIlxuICAgICAgICAkcGlsbC5hdHRyICdpZCcsIGlkXG4gICAgICAgICMgcmVwbGFjZSBjb250ZW50cyB3aXRoIHBpbGxcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlICRwaWxsWzBdXG4gICAgICAgICMgcmVtb3ZlIHBpbGwgZnJvbSBET00sIHdoaWNoIGluIHR1cm4gcmVtb3ZlcyBpdCBjb21wbGV0ZWx5XG4gICAgICAgIHJlbW92ZSA9IC0+XG4gICAgICAgICAgICAkcGlsbC5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxyZW1vdmUnLCB7cGlsbH1cbiAgICAgICAgIyB3aXJlIHVwIGNsb3NlIGJ1dHRvblxuICAgICAgICAkcGlsbC5maW5kKCcudHRib3gtcGlsbC1jbG9zZScpLm9uICdjbGljaycsIHJlbW92ZVxuICAgICAgICAjIGZvcm1hdCB0aGUgdGV4dCB1c2luZyB0aGUgdHlwZSBmb3JtYXR0ZXJcbiAgICAgICAgZm9ybWF0ID0gLT4gJHNwYW4udGV4dCB0eXBlLmZvcm1hdCAkc3Bhbi50ZXh0KClcbiAgICAgICAgIyBtYXliZSBydW4gZm9ybWF0IG9uIGZvY3Vzb3V0XG4gICAgICAgICRwaWxsLm9uICdmb2N1c291dCcsIC0+XG4gICAgICAgICAgICAjIGRpc3BhdGNoIGxhdGVyIHRvIGFsbG93IGZvciBjbGljayBvbiBzdWdnZXN0XG4gICAgICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKVxuICAgICAgICAgICAgZm9ybWF0KCkgaWYgcGlsbC5pdGVtPy5fdGV4dFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxmb2N1c291dCcsIHtwaWxsfVxuICAgICAgICAjIGhlbHBlciBmdW5jdGlvbiB0byBzY29sbCBwaWxsIGludG8gdmlld1xuICAgICAgICBzY3JvbGxJbiA9IC0+XG4gICAgICAgICAgICAkcGlsbC5hZnRlciAkdCA9ICQoJzxzcGFuIHN0eWxlPVwid2lkdGg6MXB4XCI+JylcbiAgICAgICAgICAgIHNjbGVmdCA9ICR0LmNsb3Nlc3QoJy50dGJveC1vdmVyZmxvdycpLnNjcm9sbExlZnQoKVxuICAgICAgICAgICAgcG9zID0gJHQucG9zaXRpb24oKVxuICAgICAgICAgICAgJHQuY2xvc2VzdCgnLnR0Ym94LW92ZXJmbG93Jykuc2Nyb2xsTGVmdCBwb3MubGVmdCArIHNjbGVmdFxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNpYiA9ICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIHNpYiBpZiBzaWJcbiAgICAgICAgICAgICAgICBza2lwWnduaiAkZWxbMF0sICsxICMgRkYgc2hvd3Mgbm8gY3Vyc29yIGlmIHdlIHN0YW5kIG9uIDBcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuaXRlbSA9IHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=
