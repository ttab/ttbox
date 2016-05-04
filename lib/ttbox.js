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
      return handletypes(r, trig, types, char, values);
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
      console.log('in handleTypes');
      console.log('range: ', range);
      console.log('char: ', char);
      console.log('values: ', values);
      console.log('types: ', types);
      console.log('triggerSymbol: ', trig.symbol);
      triggerSymbol = trig.symbol === 'default' ? values[0] : trig.symbol;
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
      } else if (trig.symbol === 'default') {
        return typesuggest(trange, tpos, trig, selectType, types, values);
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
      console.log('in typesuggest()');
      console.log('range: ', range);
      console.log('tpos: ', tpos);
      console.log('types: ', types);
      console.log('values: ', values);
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
      console.log('sugselect: ', sugselect);
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

//# sourceMappingURL=data:application/json;base64,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LE1BSFo7O0FBaDlCTCIsImZpbGUiOiJ0dGJveC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImdsb2IgPSBnbG9iYWwgPyB3aW5kb3dcblxuZG9jICAgPSBnbG9iLmRvY3VtZW50XG5JICAgICA9IChhKSAtPiBhXG5tZXJnZSA9ICh0LCBvcy4uLikgLT4gdFtrXSA9IHYgZm9yIGssdiBvZiBvIHdoZW4gdiAhPSB1bmRlZmluZWQgZm9yIG8gaW4gb3M7IHRcbmxhdGVyID0gKGZuKSAtPiBzZXRUaW1lb3V0IGZuLCAxXG5ob2xkICA9IChtcywgZikgLT4gbGFzdCA9IDA7IHRpbSA9IG51bGw7IChhcy4uLikgLT5cbiAgICBjbGVhclRpbWVvdXQgdGltIGlmIHRpbVxuICAgIHRpbSA9IHNldFRpbWVvdXQgKC0+ZiBhcy4uLiksIG1zXG5sYXN0ICA9IChhcykgLT4gYXM/W2FzLmxlbmd0aCAtIDFdXG5maW5kICA9IChhcywgZm4pIC0+IHJldHVybiBhIGZvciBhIGluIGFzIHdoZW4gZm4oYSlcbmFycmF5RmlsdGVyID0gKGFzLGZuKSAtPiAoYSBmb3IgYSBpbiBhcyB3aGVuIGZuKGEpKVxuXG5VQSA9IGdsb2I/Lm5hdmlnYXRvcj8udXNlckFnZW50XG5baXNJRSwgSUVWZXJdID0gL01TSUUgKFswLTldezEsfVsuMC05XXswLH0pLy5leGVjKFVBKSA/IFtdXG5JRVZlciA9IHBhcnNlSW50IElFVmVyIGlmIElFVmVyXG5pc0Nocm9tZSAgPSBVQS5pbmRleE9mKCdDaHJvbWUnKSA+IDBcblxuIyBkZWZpbmUgYW4gaW52aXNpYmxlIHByb3BlcnR5XG5kZWYgPSAob2JqLCBwcm9wcykgLT4gZm9yIG5hbWUsIHZhbHVlIG9mIHByb3BzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iaiwgbmFtZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICBudWxsXG5cbnp3bmogICAgICAgICA9IFwi4oCLXCIgIyAmenduajtcbmZpbHRlckEwICAgICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTAwYTAvZywgJyAnICMgbmJzcFxuZmlsdGVyWnduaiAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MjAwYi9nLCAnJ1xuZmlsdGVyICAgICAgID0gKHMpIC0+IGZpbHRlckEwIGZpbHRlclp3bmogc1xuYXBwZW5kQWZ0ZXIgID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbC5uZXh0U2libGluZylcbmFwcGVuZEJlZm9yZSA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwpXG5oZXhkdW1wICAgICAgPSAocykgLT4gKGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikgZm9yIGMgaW4gcykuam9pbignICcpXG5cbiMgaW5qZWN0IGNzc1xuZG8gLT5cbiAgICBzdHlsZXMgPSBcIlxuLnR0Ym94ICoge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgd2lkdGg6IGF1dG87XG59XG5cbi50dGJveCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG4udHRib3ggZGZuIHtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG4udHRib3gtb3ZlcmZsb3cge1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7ICovXG4gICAgLyogYm9yZGVyLXJhZGl1czogM3B4OyAqL1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuLnR0Ym94LW92ZXJmbG93Ojotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgZGlzcGxheTogbm9uZTtcbn1cbi50dGJveC1zaG93aW5nLXN1Z2dlc3QgLnR0Ym94LW92ZXJmbG93IHtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xufVxuXG4udHRib3gtaW5wdXQge1xuICAgIHBhZGRpbmctbGVmdDogNHB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cbi50dGJveC1pbnB1dCAqIHtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuXG4udHRib3gtaW5wdXQgKiB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4udHRib3gtaW5wdXQgYnIge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbn1cblxuLnR0Ym94LXN1Zy1vdmVyZmxvdyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm94LXNoYWRvdzogMCAycHggMnB4IHJnYmEoMCwwLDAsMC4zKTtcbiAgICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi50dGJveC1zdWdnZXN0IHtcbiAgICBtaW4taGVpZ2h0OiA1cHg7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgbGluZS1oZWlnaHQ6IDM4cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06Zmlyc3QtY2hpbGQge1xuICAgIHBhZGRpbmctdG9wOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdCA+IC50dGJveC1zdWdnZXN0LWl0ZW06bGFzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0ge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBwYWRkaW5nOiAwIDEwcHggMCAyNXB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIGRmbiB7XG4gICAgbWluLXdpZHRoOiA3MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gc3BhbiB7XG4gICAgY29sb3I6ICNjY2M7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHNwYW4ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGNvbG9yOiAjOTI5MjkyO1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBociB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG1hcmdpbi10b3A6IDEuMTVlbTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4udHRib3gtc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi50dGJveC1waWxsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gICAgbWFyZ2luOiAwIDRweDtcbiAgICBiYWNrZ3JvdW5kOiAjNWNiODVjO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICM1OGI2NTg7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWluLXdpZHRoOiAzMHB4O1xufVxuLnR0Ym94LXBpbGwgZGZuIHtcbiAgICBwYWRkaW5nOiAwIDNweCAwIDE0cHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtcGlsbC1wcmVmaXggZGZuIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuLnR0Ym94LXBpbGwtY2xvc2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcGFkZGluZzogMCA1cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1waWxsIHNwYW4ge1xuICAgIG1pbi13aWR0aDogNXB4O1xufVxuXG4udHRib3gtcGxhY2Vob2xkZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgb3BhY2l0eTogMC40O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogNXB4O1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cIlxuICAgIGNzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY3NzLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgY3NzLmlubmVySFRNTCA9IHN0eWxlc1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkIGNzc1xuXG5jbGFzcyBUeXBlXG4gICAgY29uc3RydWN0b3I6IChAbmFtZSwgb3B0cykgLT5cbiAgICAgICAgbWVyZ2UgQCwge2Zvcm1hdDpJfSwgb3B0c1xuXG5jbGFzcyBUcmlnZ2VyXG4gICAgY29uc3RydWN0b3I6IChAc3ltYm9sLCBvcHRzLCB0eXBlcykgLT5cbiAgICAgICAgbWVyZ2UgQCwgb3B0c1xuICAgICAgICBAdHlwZXMgPSBpZiBBcnJheS5pc0FycmF5IHR5cGVzIHRoZW4gdHlwZXMgZWxzZSBbdHlwZXNdXG4gICAgICAgICMgc2V0IGJhY2sgcmVmZXJlbmNlXG4gICAgICAgIHQudHJpZyA9IHRoaXMgZm9yIHQgaW4gQHR5cGVzXG4gICAgICAgIGlmIEBwcmVmaXhcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbnQgaGF2ZSBtdWx0aXBsZSB0eXBlcyB3aXRoIHByZWZpeCB0cmlnZ2VyXCIpIGlmIEB0eXBlcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKClcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oXFxcXHcqKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcblxuIyBTa2lwIHp3bmogY2hhcnMgd2hlbiBtb3ZpbmcgbGVmdC9yaWdodFxuc2tpcFp3bmogPSAocGVsLCBkLCBlbmQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICBuID0gaWYgZW5kIHRoZW4gci5lbmRDb250YWluZXIgZWxzZSByLnN0YXJ0Q29udGFpbmVyXG4gICAgaSA9IGlmIGVuZCB0aGVuIHIuZW5kT2Zmc2V0IGVsc2Ugci5zdGFydE9mZnNldFxuICAgIHJldHVybiB1bmxlc3Mgbi5ub2RlVHlwZSA9PSAzXG4gICAgYyA9IG4ubm9kZVZhbHVlLmNoYXJDb2RlQXQgKGlmIGQgPCAwIHRoZW4gaSArIGQgZWxzZSBpKVxuICAgIGlmIGMgPT0gODIwM1xuICAgICAgICAjIG1vdmVcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIGkgKyBkXG4gICAgICAgIHNraXBad25qIGQsIGVuZCAjIGFuZCBtYXliZSBjb250aW51ZSBtb3Zpbmc/XG5cbmlzUGFyZW50ID0gKHBuLCBuKSAtPlxuICAgIGlmIG4gPT0gbnVsbCB0aGVuIGZhbHNlIGVsc2UgaWYgcG4gPT0gbiB0aGVuIHRydWUgZWxzZSBpc1BhcmVudChwbiwgbi5wYXJlbnROb2RlKVxuXG4jIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG5jdXJzb3IgPSAocGVsKSAtPlxuICAgIHMgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICByZXR1cm4gdW5sZXNzIHMucmFuZ2VDb3VudFxuICAgIHIgPSBzLmdldFJhbmdlQXQoMClcbiAgICBpZiBpc1BhcmVudChwZWwsIHIuc3RhcnRDb250YWluZXIpIHRoZW4gciBlbHNlIG51bGxcblxuIyBmaWx0ZXIgdGhlIHJhbmdlIHRvIGdldCByaWQgb2YgdW53YW50ZWQgY2hhcnNcbnJhbmdlU3RyID0gKHIpIC0+IGZpbHRlciByLnRvU3RyaW5nKClcblxuZmlyc3RJc1doaXRlID0gKHMpIC0+IC9eXFxzLiovLnRlc3QocyA/ICcnKVxubGFzdElzV2hpdGUgID0gKHMpIC0+IC8uKlxccyQvLnRlc3QocyA/ICcnKVxuXG53b3JkUmFuZ2VBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgICMgZXhwYW5kIGJlZ2lubmluZ1xuICAgIHdoaWxlIHQuc3RhcnRPZmZzZXQgPiAwIGFuZCBub3QgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0IC0gMVxuICAgICMgb25lIGZvcndhcmQgYWdhaW5cbiAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgKyAxIGlmIGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgIyBleHBhbmQgZW5kXG4gICAgbGVuID0gdC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMFxuICAgIHdoaWxlIHQuZW5kT2Zmc2V0IDwgbGVuIGFuZCBub3QgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgKyAxXG4gICAgIyBvbmUgYmFjayBhZ2FpblxuICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCAtIDEgaWYgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgIHJldHVybiB0XG5cbmVudGlyZVRleHRBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIHQuc2VsZWN0Tm9kZUNvbnRlbnRzIHQuc3RhcnRDb250YWluZXJcbiAgICByZXR1cm4gdFxuXG5maW5kSW5SYW5nZSA9IChyLCBjaGFyKSAtPlxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIG1heCA9ICh0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwKSAtIDFcbiAgICBmb3IgaSBpbiBbdC5zdGFydE9mZnNldC4ubWF4XSBieSAxXG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgaVxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgaSArIDFcbiAgICAgICAgcmV0dXJuIGkgaWYgdC50b1N0cmluZygpID09IGNoYXJcbiAgICByZXR1cm4gLTFcblxuc2V0Q3Vyc29yUG9zID0gKHIsIHBvcyA9IDApIC0+XG4gICAgdCA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgdC5zZXRTdGFydCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICB0LnNldEVuZCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICBzZWwgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBzZWwuYWRkUmFuZ2UgdFxuXG5zZXRDdXJzb3JFbCA9IChlbCwgcG9zID0gMCkgLT5cbiAgICByID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICByLnNlbGVjdE5vZGVDb250ZW50cyBlbFxuICAgIHBvcyA9IGVsPy5ub2RlVmFsdWU/Lmxlbmd0aCBpZiBwb3MgPCAwXG4gICAgc2V0Q3Vyc29yUG9zIHIsIHBvc1xuXG4jIEZ1bmN0aW9uIHRvIG1ha2UgdHRib3ggb3V0IG9mIGFuIGVsZW1lbnQgd2l0aCB0cmlnZ2Vyc1xuI1xudHRib3ggPSAoZWwsIHRyaWdzLi4uKSAtPlxuXG4gICAgIyBsb2NhbCByZWZlcmVuY2UgdG8gcmVuZGVyIHBsdWdcbiAgICByZW5kZXIgPSB0dGJveC5yZW5kZXIoKVxuXG4gICAgIyBsZXQgcmVuZGVyIGRlY2lkZSB3ZSBoYXZlIGEgZ29vZCBlbFxuICAgIGVsID0gcmVuZGVyLmluaXQoZWwpXG5cbiAgICAjIGFuZCBjaGVjayB3ZSBnb3QgYSBnb29kIHRoaW5nIGJhY2tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSBESVYnKSB1bmxlc3MgZWwudGFnTmFtZSA9PSAnRElWJ1xuXG4gICAgIyBkaXNwYXRjaCBldmVudHMgb24gaW5jb21pbmcgZGl2XG4gICAgZGlzcGF0Y2ggPSAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgZSA9IGRvYy5jcmVhdGVFdmVudCAnRXZlbnQnXG4gICAgICAgIG1lcmdlIGUsIG9wdHMsIHt0dGJveDpmYcOnYWRlfVxuICAgICAgICBlLmluaXRFdmVudCBcInR0Ym94OiN7bmFtZX1cIiwgdHJ1ZSwgZmFsc2VcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudCBlXG5cbiAgICAjIGFkZCBhIG5ldyBwaWxsIHRvIGlucHV0XG4gICAgYWRkcGlsbCA9ICh0eXBlLCBpdGVtKSAtPlxuICAgICAgICAjIGVpdGhlciB1c2UgY3Vyc29yIHBvc2l0aW9uLCBvciB0aGUgbGFzdCBjaGlsZCBlbGVtZW50XG4gICAgICAgIHIgPSBjdXJzb3IoZWwpID8gcmVuZGVyLnJhbmdlbGFzdCgpXG4gICAgICAgICMgaW1wbGljaXRseSBkb2VzIHRpZHlcbiAgICAgICAgcmV0dXJuIHJlbmRlci5waWxsaWZ5IHIsIHR5cGUsIGl0ZW0sIGRpc3BhdGNoXG4gICAgYWRkdGV4dCA9ICh0ZXh0KSAtPlxuICAgICAgICAjIGVpdGhlciB1c2UgY3Vyc29yIHBvc2l0aW9uLCBvciB0aGUgbGFzdCBjaGlsZCBlbGVtZW50XG4gICAgICAgIHIgPSBjdXJzb3IoZWwpID8gcmVuZGVyLnJhbmdlbGFzdCgpXG4gICAgICAgIHIuaW5zZXJ0Tm9kZSBkb2MuY3JlYXRlVGV4dE5vZGUodGV4dClcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICByZXR1cm4gclxuICAgIGNsZWFyID0gLT5cbiAgICAgICAgcmVuZGVyLmNsZWFyKClcbiAgICAgICAgdXBkYXRlKClcbiAgICB0cmlnZ2VyID0gKHN5bWJvbCkgLT5cbiAgICAgICAgIyBtYWtlIHN1cmUgY29udGlndW91cyB0ZXh0IG5vZGVzXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgcmVuZGVyLmZvY3VzKCkgIyBlbnN1cmUgd2UgaGF2ZSBmb2N1c1xuICAgICAgICAjIHdlIHdhbnQgdG8gYmUgdG8gdGhlIHJpZ2h0IG9mIGFueSB6d25qXG4gICAgICAgICMgaW4gdGhlIGN1cnJlbnQgdGV4dCBibG9ja1xuICAgICAgICBza2lwWnduaiBlbCwgMVxuICAgICAgICAjIGdldCB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcihlbClcbiAgICAgICAgc3RyID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBkbyBub3RoaW5nIGlmIGN1cnJlbnQgd29yZCBhbHJlYWR5IGNvbnRhaW5zIHRyaWdnZXIgc3ltYm9sXG4gICAgICAgIHJldHVybiBpZiBzdHIuaW5kZXhPZihzeW1ib2wpID49IDBcbiAgICAgICAgIyBpbnNlcnQgc3BhY2UgaWYgd2UgaGF2ZSBjb250ZW50IGJlZm9yZWhhbmRcbiAgICAgICAgaW5zZXJ0ID0gaWYgc3RyID09ICcnIHRoZW4gc3ltYm9sIGVsc2UgXCIgI3tzeW1ib2x9XCJcbiAgICAgICAgY3Vyc29yKGVsKS5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSBpbnNlcnRcbiAgICAgICAgIyBtYWtlIGNvbnRpZ3VvdXMgdGV4dCBub2Rlc1xuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgICMgcG9zaXRpb24gYXQgdGhlIHZlcnkgZW5kIG9mIHRoaXNcbiAgICAgICAgciA9IGVudGlyZVRleHRBdEN1cnNvcihlbClcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIHIuZW5kT2Zmc2V0IC0gc3ltYm9sLmxlbmd0aFxuICAgICAgICAjIHRyaWdnZXIgc3VnZ2VzdFxuICAgICAgICB1cGRhdGUoKVxuXG4gICAgIyBleHBvc2VkIG9wZXJhdGlvbnNcbiAgICBmYcOnYWRlID0ge1xuICAgICAgICBhZGRwaWxsLCBhZGR0ZXh0LCByZW5kZXIsIGNsZWFyLCB0cmlnZ2VyXG4gICAgICAgIHZhbHVlczogLT4gcmVuZGVyLnZhbHVlcygpXG4gICAgICAgIHNldHZhbHVlczogKHZhbHVlcykgLT5cbiAgICAgICAgICAgIGNsZWFyKClcbiAgICAgICAgICAgIHZhbHVlcy5mb3JFYWNoICh2KSAtPlxuICAgICAgICAgICAgICAgIGlmIHR5cGVvZiB2ID09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgIGFkZHRleHQgdlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYWRkcGlsbCB2LnR5cGUsIHYuaXRlbVxuICAgICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgZm9jdXM6IC0+IHJlbmRlci5mb2N1cygpXG4gICAgICAgIHBsYWNlaG9sZGVyOiAodHh0KSAtPlxuICAgICAgICAgICAgcmVuZGVyLnNldFBsYWNlaG9sZGVyKHR4dClcbiAgICAgICAgICAgIHVwZGF0ZSgpICMgdG9nZ2xlIHBsYWNlaG9sZGVyXG4gICAgfVxuXG4gICAgcHJldnZhbHVlcyA9IFtdXG5cbiAgICB1cGRhdGUgPSBob2xkIDMsIChjaGFyKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHZhbHVlc1xuICAgICAgICB2YWx1ZXMgPSByZW5kZXIudmFsdWVzKClcbiAgICAgICAgIyBzaG93IHBsYWNlaG9sZGVyIGlmIGl0J3MgZW1wdHlcbiAgICAgICAgcmVuZGVyLnRvZ2dsZVBsYWNlaG9sZGVyIHZhbHVlcy5sZW5ndGggPT0gMFxuICAgICAgICB1bmxlc3MgdmFsdWVzLnJlZHVjZSAoKHAsIGMsIGkpIC0+IHAgYW5kIGMgPT0gcHJldnZhbHVlc1tpXSksIHRydWVcbiAgICAgICAgICAgIHByZXZ2YWx1ZXMgPSB2YWx1ZXNcbiAgICAgICAgICAgIGRpc3BhdGNoICdjaGFuZ2UnLCB7dmFsdWVzfVxuICAgICAgICAjIGEgcGlsbCBlZGl0IHRydW1mcyBhbGxcbiAgICAgICAgcmV0dXJuIGlmIGhhbmRsZXBpbGwoKVxuICAgICAgICAjIGN1cnNvciByYW5nZSBmb3Igd29yZFxuICAgICAgICByID0gd29yZFJhbmdlQXRDdXJzb3IoZWwpXG4gICAgICAgICMgWFhYIG9wdGltaXplIHdpdGggYmVsb3c/XG4gICAgICAgIHVubGVzcyByXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgYSB0cmlnZ2VyIGluIHRoZSB3b3JkP1xuICAgICAgICB0cmlnID0gZmluZCB0cmlncywgKHQpIC0+IHQucmUudGVzdCB3b3JkXG4gICAgICAgICMgbm8gdHJpZ2dlciBmb3VuZCBpbiBjdXJyZW50IHdvcmQsIGFib3J0XG4gICAgICAgIHVubGVzcyB0cmlnXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIyBleGVjIHRyaWdnZXIgdG8gZ2V0IHBhcnRzXG4gICAgICAgIFtfLCB0eXBlbmFtZSwgdmFsdWVdID0gdHJpZy5yZS5leGVjIHdvcmRcbiAgICAgICAgIyBmaW5kIHBvc3NpYmxlIHR5cGVzXG4gICAgICAgIHR5cGVzID0gdHJpZy50eXBlcy5maWx0ZXIgKHQpIC0+IHRyaWcucHJlZml4IG9yIHQubmFtZT8uaW5kZXhPZih0eXBlbmFtZSkgPT0gMFxuICAgICAgICAjIGhhbmQgb2ZmIHRvIGRlYWwgd2l0aCBmb3VuZCBpbnB1dFxuICAgICAgICBoYW5kbGV0eXBlcyByLCB0cmlnLCB0eXBlcywgY2hhciwgdmFsdWVzXG5cbiAgICBzdWdzZWxlY3QgPSBzdWdtb3ZlciA9IHN1Z3dvcmQgPSBudWxsXG4gICAgc2V0U3VnbW92ZXIgPSAoX3N1Z21vdmVyKSAtPiBzdWdtb3ZlciA9IF9zdWdtb3ZlclxuICAgIHN0b3BzdWcgPSAtPlxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdtb3ZlciA9IHN1Z3dvcmQgPSBudWxsXG4gICAgICAgIHJlbmRlci51bnN1Z2dlc3QoKVxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHN0b3AnXG5cbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxscyBsZWF2ZVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxyZW1vdmUnLCAoZXYpLT5cbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHVwZGF0ZSgpICMgdHJpZ2dlciB2YWx1ZS1jaGFuZ2VcbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxsIGxvc2UgZm9jdXNcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxsZm9jdXNvdXQnLCBzdG9wc3VnXG5cbiAgICBoYW5kbGV0eXBlcyA9IChyYW5nZSwgdHJpZywgdHlwZXMsIGNoYXIsIHZhbHVlcykgLT5cbiAgICAgICAgY29uc29sZS5sb2cgJ2luIGhhbmRsZVR5cGVzJ1xuICAgICAgICBjb25zb2xlLmxvZyAncmFuZ2U6ICcscmFuZ2VcbiAgICAgICAgY29uc29sZS5sb2cgJ2NoYXI6ICcsY2hhclxuICAgICAgICBjb25zb2xlLmxvZyAndmFsdWVzOiAnLHZhbHVlc1xuICAgICAgICBjb25zb2xlLmxvZyAndHlwZXM6ICcsdHlwZXNcbiAgICAgICAgY29uc29sZS5sb2cgJ3RyaWdnZXJTeW1ib2w6ICcsdHJpZy5zeW1ib2xcbiAgICAgICAgIyBpZiB0cmlnZ2VyIGlzICdkZWZhdWx0JywgdGhlIGFjdHVhbCB0cmlnZ2VyIGlzIHRoZSBlbnRpcmUgc2VhcmNoIHN0cmluZ1xuICAgICAgICAjIGluIG90aGVyIGNhc2VzIHRoZSB0cmlnZ2VyIGlzIHRoZSB0cmlnLnN5bWJvbFxuICAgICAgICB0cmlnZ2VyU3ltYm9sID0gaWYgdHJpZy5zeW1ib2wgaXMgJ2RlZmF1bHQnIHRoZW4gdmFsdWVzWzBdIGVsc2UgdHJpZy5zeW1ib2xcbiAgICAgICAgIyB0aGUgdHJpZ2dlciBwb3NpdGlvbiBpbiB0aGUgd29yZCByYW5nZVxuICAgICAgICB0cG9zID0gZmluZEluUmFuZ2UgcmFuZ2UsIHRyaWdnZXJTeW1ib2xcbiAgICAgICAgIyBubyB0cG9zPyFcbiAgICAgICAgcmV0dXJuIGlmIHRwb3MgPCAwXG4gICAgICAgICMgcmFuZ2UgZm9yIHR5cGUgbmFtZSAod2hpY2ggbWF5IG5vdCBiZSB0aGUgZW50aXJlIG5hbWUpXG4gICAgICAgIHRyYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKVxuICAgICAgICB0cmFuZ2Uuc2V0RW5kIHRyYW5nZS5lbmRDb250YWluZXIsIHRwb3NcbiAgICAgICAgIyB3aGV0aGVyIHRoZSBsYXN0IGlucHV0IHdhcyB0aGUgdHJpZ2dlclxuICAgICAgICB3YXN0cmlnID0gY2hhciA9PSB0cmlnLnN5bWJvbFxuICAgICAgICAjIGhlbHBlciB3aGVuIGZpbmlzaGVkIHNlbGVjdGluZyBhIHR5cGVcbiAgICAgICAgc2VsZWN0VHlwZSA9ICh0eXBlKSAtPlxuICAgICAgICAgICAgcmVuZGVyLnBpbGxpZnkgcmFuZ2UsIHR5cGUsIG51bGwsIGRpc3BhdGNoXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlc2VsZWN0Jywge3RyaWcsIHR5cGV9XG5cbiAgICAgICAgaWYgdHlwZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBlbHNlIGlmIHRyaWcuc3ltYm9sIGlzICdkZWZhdWx0J1xuICAgICAgICAgICAgIyBHZXQgc3VnZ2VzdGlvbnMgZm9yIHNlYXJjaCBzdHJpbmdcbiAgICAgICAgICAgIHR5cGVzdWdnZXN0IHRyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMsIHZhbHVlc1xuICAgICAgICBlbHNlIGlmIHR5cGVzLmxlbmd0aCA9PSAxIGFuZCBub3Qgc3VnbW92ZXJcbiAgICAgICAgICAgICMgb25lIHBvc3NpYmxlIHNvbHV0aW9uXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBmb3IgdHJpZ2dlciBjaGFyLCB3ZSBzZWxlY3QgdGhlIGZpcnN0IHR5cGUgc3RyYWlnaHQgYXdheVxuICAgICAgICAgICAgICAgIHNlbGVjdFR5cGUgZmluZCB0eXBlcywgKHQpIC0+ICF0LmRpdmlkZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyB3aGVuIHRoZSBrZXkgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyIGFuZCB0aGVyZSBhcmVcbiAgICAgICAgICAgICMgbXVsdGlwbGUgcG9zc2libGUgdmFsdWVzLCBwb3NpdGlvbi4gbW92ZSB0byBqdXN0IGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgdHJpZ2dlciBjaGFyLlxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgbW92ZSB0aGUgY3Vyc29yIHRvIGFsbG93IGZvciBzdWdnZXN0IGlucHV0XG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHJhbmdlLCB0cG9zXG4gICAgICAgICAgICAjIHN0YXJ0IGEgc3VnZ2VzdCBmb3IgY3VycmVudCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICAgICAgdHlwZXN1Z2dlc3QgdHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlcywgdmFsdWVzXG5cblxuICAgICMgc3VnZ2VzdCBmb3IgZ2l2ZW4gdHlwZXNcbiAgICB0eXBlc3VnZ2VzdCA9IChyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMsIHZhbHVlcykgLT5cbiAgICAgICAgY29uc29sZS5sb2cgJ2luIHR5cGVzdWdnZXN0KCknXG4gICAgICAgIGNvbnNvbGUubG9nICdyYW5nZTogJyxyYW5nZVxuICAgICAgICBjb25zb2xlLmxvZyAndHBvczogJyx0cG9zXG4gICAgICAgIGNvbnNvbGUubG9nICd0eXBlczogJyx0eXBlc1xuICAgICAgICBjb25zb2xlLmxvZyAndmFsdWVzOiAnLHZhbHVlc1xuICAgICAgICAjIGZpbHRlciB0byBvbmx5IHNob3cgdHlwZXMgdGhhdCBhcmUgc3VwcG9zZWQgdG8gYmUgdGhlcmVcbiAgICAgICAgIyBnaXZlbiBsaW1pdE9uZTpjb25kaXRpb25cbiAgICAgICAgZnR5cGVzID0gZG8gLT5cbiAgICAgICAgICAgIG5vdEluVmFsdWVzID0gKHQpIC0+ICEodmFsdWVzPy5maWx0ZXIgKHYpIC0+IHY/LnR5cGU/Lm5hbWUgPT0gdC5uYW1lKT8ubGVuZ3RoXG4gICAgICAgICAgICBhcnJheUZpbHRlciB0eXBlcywgKHR5cGUpIC0+ICF0eXBlLmxpbWl0T25lIHx8IG5vdEluVmFsdWVzKHR5cGUpXG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgaGVscGVyIHRvIGNyZWF0ZSBzdWdzZWxlY3QgZnVuY3Rpb25zXG4gICAgICAgIHN1Z3NlbGVjdGZvciA9IChpdGVtKSAtPiAtPlxuICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgIyB0aGUgdHlwZSBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgc2VsZWN0VHlwZSBpdGVtXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgIyBmdW5jdGlvbiB0aGF0IHN1Z2dlc3QgdHlwZXNcbiAgICAgICAgZm50eXBlcyA9IChfLCBjYikgLT4gY2IgZnR5cGVzXG4gICAgICAgICMgaWYgdGhlcmUgaXMgb25seSBvbmUsIHNldCBpdCBhcyBwb3NzaWJsZSBmb3IgcmV0dXJuIGtleVxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgZnR5cGVzWzBdIGlmIHR5cGVzLmxlbmd0aCA9PSAxXG4gICAgICAgIGNvbnNvbGUubG9nICdzdWdzZWxlY3Q6ICcsc3Vnc2VsZWN0XG4gICAgICAgICMgcmVuZGVyIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudHlwZXMsIHJhbmdlLCAtMSwgc2V0U3VnbW92ZXIsICh0eXBlLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlJywge3RyaWcsIHR5cGV9XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlcycsIHt0cmlnLCBmdHlwZXN9XG5cbiAgICBoYW5kbGVwaWxsID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gZW50aXJlVGV4dEF0Q3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHR5cGVvZiBwaWxsLnR5cGU/LnN1Z2dlc3QgPT0gJ2Z1bmN0aW9uJyAjIGRlZmluaXRlbHkgYSBzdWdnZXN0XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBzdWdnZXN0IGZ1bmN0aW9uIGFzIGZuIHRvIHJlbmRlci5zdWdnZXN0XG4gICAgICAgIGZudmFscyA9ICh3b3JkLCBjYikgLT4gcGlsbC50eXBlLnN1Z2dlc3Qgd29yZCwgY2IsIHBpbGwudHlwZSwgcGlsbC50cmlnXG4gICAgICAgICMgaGVscGVyIHdoZW4gd2UgZGVjaWRlIG9uIGFuIGl0ZW1cbiAgICAgICAgc2VsZWN0SXRlbSA9IChpdGVtKSAtPlxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgICAgICMgbGF0ZXIgc2luY2UgaXQgbWF5IGJlIHNlbGVjdCBmcm9tIGNsaWNrLCB3aGljaCBpcyBtb3VzZWRvd25cbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtc2VsZWN0Jywge3BpbGwsIGl0ZW19XG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudmFscywgciwgLTEsIHNldFN1Z21vdmVyLCAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPlxuICAgICAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAgICAgIyBzZWxlY3QgdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtIGl0ZW1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW0nLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZCBhYm91dCBpdFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zJywge3BpbGx9XG4gICAgICAgIHJldHVybiB0cnVlICMgc2lnbmFsIHdlIGRlYWx0IHdpdGggaXRcblxuICAgICMgbW92ZSB0aGUgaW5wdXQgb3V0IG9mIGEgcGlsbCAoaWYgd2UncmUgaW4gYSBwaWxsKVxuICAgIHBpbGxqdW1wID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjIHRoZSBldmVudCBoYW5kbGVyc1xuICAgIGhhbmRsZXJzID1cbiAgICAgICAga2V5ZG93bjogKGUpIC0+XG4gICAgICAgICAgICAjIHRoaXMgZG9lcyBhbiBpbXBvcnRhbnQgZWwubm9ybWFsaXplKCkgdGhhdCBlbnN1cmVzIHdlIGhhdmVcbiAgICAgICAgICAgICMgY29udGlndW91cyB0ZXh0IG5vZGVzLCBjcnVjaWFsIGZvciB0aGUgcmFuZ2UgbG9naWMuXG4gICAgICAgICAgICByZW5kZXIudGlkeSgpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIGRvbnQgd2FudCBET00gY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgc3Vnc2VsZWN0PygpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgcGlsbGp1bXAoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBzdWdtb3ZlclxuICAgICAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAzOCAgICAgICMgdXBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKC0xKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlID09IDQwICMgZG93blxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoKzEpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSBpbiBbMzcsIDhdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsIC0xLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGJhY2t3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcbiAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlIGluIFszOSwgNDZdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgICAgIHBhc3RlOiAoZSkgLT5cbiAgICAgICAgICAgICMgc3RvcCBkZWZhdWx0IHBhc3RlIGFjdGlvblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgICAgICMgZ3JhYiB0aGUgYWN0dWFsIGV2ZW50IChpbiBjYXNlIGpRdWVyeSB3cmFwcGVkKVxuICAgICAgICAgICAgZSA9IChlLm9yaWdpbmFsRXZlbnQgPyBlKVxuXG4gICAgICAgICAgICBpZiBlPy5jbGlwYm9hcmREYXRhXG4gICAgICAgICAgICAgICAgIyBTdGFuZGFyZCBzdHlsZVxuICAgICAgICAgICAgICAgIHR4dCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgICAgIGRvYy5leGVjQ29tbWFuZCAnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0eHRcbiAgICAgICAgICAgIGVsc2UgaWYgd2luZG93LmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICAgICAjIElFIHN0eWxlXG4gICAgICAgICAgICAgICAgdHh0ID0gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSAnVGV4dCdcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgICAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSB0eHRcblxuICAgICAgICAgICAgdXBkYXRlKClcblxuICAgICAgICAgICAgZmFsc2VcblxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtcGxhY2Vob2xkZXJcIj48L2Rpdj48L2Rpdj4nXG4gICAgc3VnZ2VzdCA9ICc8ZGl2IGNsYXNzPVwidHRib3gtc3VnLW92ZXJmbG93XCI+PGRpdiBjbGFzcz1cInR0Ym94LXN1Z2dlc3RcIj48L2Rpdj48L2Rpdj4nXG4gICAgIyBjYWNoZSBvZiBwaWxsIDxwaWxsaWQsIHBpbGw+IHN0cnVjdHVyZXNcbiAgICBwaWxscyA9IHt9XG4gICAgIyBoZWxwZXIgdG8gdGlkeSBjYWNoZVxuICAgIHRpZHlwaWxscyA9IGhvbGQgNTAwMCwgLT5cbiAgICAgICAgcHJlc2VudCA9ICRlbC5maW5kKCcudHRib3gtcGlsbCcpLm1hcCgtPiAkKEApLmF0dHIgJ2lkJykudG9BcnJheSgpXG4gICAgICAgIGRlbGV0ZSBwaWxsc1tpZF0gZm9yIGlkIGluIE9iamVjdC5rZXlzKHBpbGxzKSB3aGVuIHByZXNlbnQuaW5kZXhPZihpZCkgPCAwXG4gICAgICAgIG51bGxcbiAgICAjIHJldHVybiB0aGUgcGlsbCBzdHJ1Y3R1cmUgZm9yIGFuIGVsZW1lbnRcbiAgICBwaWxsZm9yID0gKGVsKSAtPiBwaWxsc1skKGVsKS5jbG9zZXN0KCcudHRib3gtcGlsbCcpLmF0dHIoJ2lkJyldXG4gICAgIyBnbyB0aHJvdWdoIGNhY2hlIGFuZCBlbnN1cmUgYWxsIHBpbGxzIGhhdmUgdGhlIGl0ZW0gdmFsdWUgb2YgdGhlXG4gICAgIyBlbGVtZW50IHZhbHVlLlxuICAgIGVuc3VyZUl0ZW1zID0gLT5cbiAgICAgICAgcGlsbC5lbnN1cmVJdGVtKCkgZm9yIGssIHBpbGwgb2YgcGlsbHNcbiAgICAgICAgbnVsbFxuXG4gICAgIyBjYWxsIG9mdGVuLiBmaXggdGhpbmdzLlxuICAgIHRpZHkgPSAtPlxuICAgICAgICAkaW5wID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgIGlucCA9ICRpbnBbMF1cbiAgICAgICAgIyBtZXJnZSBzdHVmZiB0b2dldGhlciBhbmQgcmVtb3ZlIGVtcHR5IHRleHRub2Rlcy5cbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgZmlyc3QgZW5zdXJlIHRoZXJlJ3MgYSA8YnI+IGF0IHRoZSBlbmQgKG9yIDxpPiBmb3IgSUUpXG4gICAgICAgIHRhZyA9IGlmIGlzSUUgdGhlbiAnaScgZWxzZSAnYnInXG4gICAgICAgIHVubGVzcyAkaW5wLmNoaWxkcmVuKCkubGFzdCgpLmlzIHRhZ1xuICAgICAgICAgICAgJGlucC5maW5kKFwiPiAje3RhZ31cIikucmVtb3ZlKClcbiAgICAgICAgICAgICRpbnAuYXBwZW5kIFwiPCN7dGFnfT5cIlxuICAgICAgICBjaGlsZHMgPSBpbnAuY2hpbGROb2Rlc1xuICAgICAgICBmaXJzdCA9IGNoaWxkc1swXVxuICAgICAgICAjIGVuc3VyZSB0aGUgd2hvbGUgdGhpbmdzIHN0YXJ0cyB3aXRoIGEgendualxuICAgICAgICBpZiBmaXJzdD8ubm9kZVR5cGUgIT0gMyBvciBmaXJzdD8ubm9kZVZhbHVlP1swXSAhPSB6d25qXG4gICAgICAgICAgICAkaW5wWzBdLmluc2VydEJlZm9yZSBkb2MuY3JlYXRlVGV4dE5vZGUoenduaiksIGZpcnN0XG4gICAgICAgICMgZW5zdXJlIHRoZXJlJ3MgYWx3YXlzIGEgenduaiBhZnRlciBldmVyeSBlbGVtZW50IG5vZGVcbiAgICAgICAgZm9yIG4gaW4gY2hpbGRzIHdoZW4gbj8ubm9kZVR5cGUgPT0gMSBhbmQgbj8ubmV4dFNpYmxpbmc/Lm5vZGVUeXBlID09IDFcbiAgICAgICAgICAgIGFwcGVuZEFmdGVyIG4sIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMgYWdhaW4sIGVuc3VyZSBjb250aWdvdXMgbm9kZXNcbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgbW92ZSBjdXJzb3IgdG8gbm90IGJlIG9uIGJhZCBlbGVtZW50IHBvc2l0aW9uc1xuICAgICAgICBpZiByID0gY3Vyc29yKCRlbFswXSlcbiAgICAgICAgICAgIGlmIChyLnN0YXJ0Q29udGFpbmVyID09IGlucCBvciByLmVuZENvbnRhaW5lciA9PSBpbnApXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMSBpZiBuXG4gICAgICAgICAgICAjIGZpcmVmb3ggbWFuYWdlcyB0byBmb2N1cyBhbnl0aGluZyBidXQgdGhlIG9ubHlcbiAgICAgICAgICAgICMgY29udGVudGVkaXRhYmxlPXRydWUgb2YgdGhlIHBpbGxcbiAgICAgICAgICAgIHBhcmVuID0gci5zdGFydENvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiBwYXJlbj8ubm9kZU5hbWUgIT0gJ1NQQU4nIGFuZCBwaWxsID0gcGlsbGZvciBwYXJlblxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAjIGtlZXAgY2FjaGUgY2xlYW5cbiAgICAgICAgdGlkeXBpbGxzKClcbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0aWFsaXNlIGJveFxuICAgIGluaXQ6IChlbCkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkbid0IGZpbmQgalF1ZXJ5XCIpIHVubGVzcyAkID0galF1ZXJ5XG4gICAgICAgICRlbCA9ICQoZWwpXG4gICAgICAgICRlbFswXVxuXG4gICAgIyBkcmF3IHN0dWZmIGFuZCBob29rIHVwIGV2ZW50IGhhbmRsZXJzXG4gICAgZHJhdzogKGhhbmRsZXJzKSAtPlxuICAgICAgICAkZWwuaHRtbCBodG1sXG4gICAgICAgICRlbC5vbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LCBoYW5kbGVyIG9mIGhhbmRsZXJzXG5cbiAgICAjIGNsZWFyIHRoZSBzdGF0ZSBvZiB0aGUgaW5wdXRcbiAgICBjbGVhcjogLT5cbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpLmVtcHR5KClcbiAgICAgICAgdGlkeSgpXG5cbiAgICAjIGZvY3VzIHRoZSBpbnB1dCAoaWYgaXQgZG9lc24ndCBhbHJlYWR5IGhhdmUgZm9jdXMpXG4gICAgZm9jdXM6IC0+XG4gICAgICAgIHJldHVybiBpZiBjdXJzb3IoJGVsWzBdKSAjIGFscmVhZHkgaGFzIGZvY3VzXG4gICAgICAgIHRpZHkoKSAjIGVuc3VyZSB3ZSBoYXZlIGEgbGFzdCBub2RlIHRvIHBvc2l0aW9uIGJlZm9yZVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGggLSAyXVxuICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMVxuXG4gICAgIyByZXR1cm4gYW4gYXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgYm94XG4gICAgdmFsdWVzOiAtPlxuICAgICAgICBlbnN1cmVJdGVtcygpXG4gICAgICAgIEFycmF5OjpzbGljZS5jYWxsKCRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzKS5tYXAgKG4pIC0+XG4gICAgICAgICAgICBpZiBuLm5vZGVUeXBlID09IDEgYW5kIG4/LmNsYXNzTmFtZT8uaW5kZXhPZigndHRib3gtcGlsbCcpID49IDBcbiAgICAgICAgICAgICAgICBwaWxsZm9yIG5cbiAgICAgICAgICAgIGVsc2UgaWYgbi5ub2RlVHlwZSA9PSAzXG4gICAgICAgICAgICAgICAgZmlsdGVyIG4ubm9kZVZhbHVlXG4gICAgICAgIC5maWx0ZXIgSVxuXG4gICAgIyByZW1vdmUgc3VnZ2dlc3RcbiAgICB1bnN1Z2dlc3Q6IHVuc3VnZ2VzdCA9IC0+XG4gICAgICAgICQoJy50dGJveC1zdWctb3ZlcmZsb3cnKS5yZW1vdmUoKVxuICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCdcblxuICAgICMgc3RhcnQgc3VnZ2VzdFxuICAgIHN1Z2dlc3Q6IChmbiwgcmFuZ2UsIGlkeCwgbW92ZWNiLCBzZWxlY3RjYikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBmaW5kL2NyZWF0ZSBzdWdnZXN0LWJveFxuICAgICAgICAkc3VnID0gJCgnLnR0Ym94LXN1Z2dlc3QnKVxuICAgICAgICB1bmxlc3MgJHN1Zy5sZW5ndGhcbiAgICAgICAgICAgICRvdmVyZmx3ID0gJChzdWdnZXN0KVxuICAgICAgICAgICAgJHN1ZyA9ICRvdmVyZmx3LmZpbmQgJy50dGJveC1zdWdnZXN0J1xuICAgICAgICAgICAgIyBsb2NrIHdpZHRoIHRvIHBhcmVudFxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzICdtaW4td2lkdGgnLCAkYm94KCkub3V0ZXJXaWR0aCgpXG4gICAgICAgICAgICAjIGFkanVzdCBmb3IgYm9yZGVyIG9mIHBhcmVudFxuICAgICAgICAgICAgYm9yZCA9IHBhcnNlSW50ICRlbC5maW5kKCcudHRib3gtb3ZlcmZsb3cnKS5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKVxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzIHRvcDokZWwub3V0ZXJIZWlnaHQoKSAtIGJvcmRcbiAgICAgICAgICAgICMgYXBwZW5kIHRvIGJveFxuICAgICAgICAgICAgJGJveCgpLmFwcGVuZCAkb3ZlcmZsd1xuICAgICAgICAgICAgIyBpbmRpY2F0ZSB3ZSBhcmUgc2hvd2luZ1xuICAgICAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zaG93aW5nLXN1Z2dlc3QnKVxuICAgICAgICAjIGVtcHR5IHN1Z2dlc3QgYm94IHRvIHN0YXJ0IGZyZXNoXG4gICAgICAgICRzdWcuaHRtbCgnJyk7ICRzdWcub2ZmKClcbiAgICAgICAgIyBjbGFzcyB0byBob29rIHN0eWxpbmcgd2hlbiBzdWdnZXN0aW5nXG4gICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc3VnZ2VzdC1yZXF1ZXN0JylcbiAgICAgICAgIyByZXF1ZXN0IHRvIGdldCBzdWdnZXN0IGVsZW1lbnRzXG4gICAgICAgIGZuIHdvcmQsIChsaXN0KSAtPlxuICAgICAgICAgICAgIyBub3QgcmVxdWVzdGluZyBhbnltb3JlXG4gICAgICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCdcbiAgICAgICAgICAgICMgbG9jYWwgdG9IdG1sIHdpdGggd29yZFxuICAgICAgICAgICAgbG9jVG9IdG1sID0gdG9IdG1sKHdvcmQpXG4gICAgICAgICAgICAjIHR1cm4gbGlzdCBpbnRvIGh0bWxcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCAobCkgLT5cbiAgICAgICAgICAgICAgICAkaCA9ICQobG9jVG9IdG1sKGwpKVxuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGlmIGwuZGl2aWRlclxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1kaXZpZGVyJ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtaXRlbSdcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBsLmNsYXNzTmFtZSBpZiBsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICRzdWcuYXBwZW5kICRoXG4gICAgICAgICAgICAjIGxpc3Qgd2l0aG91dCBkaXZpZGVyc1xuICAgICAgICAgICAgbm9kaXZpZCA9IGxpc3QuZmlsdGVyIChsKSAtPiAhbC5kaXZpZGVyXG4gICAgICAgICAgICBwcmV2aWR4ID0gbnVsbFxuICAgICAgICAgICAgZG8gc2VsZWN0SWR4ID0gKGRvc3RhcnQgPSBmYWxzZSkgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgaWR4IDwgMCBhbmQgIWRvc3RhcnRcbiAgICAgICAgICAgICAgICBpZHggPSAwIGlmIGlkeCA8IDBcbiAgICAgICAgICAgICAgICBpZHggPSBub2RpdmlkLmxlbmd0aCAtIDEgaWYgaWR4ID49IG5vZGl2aWQubGVuZ3RoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHByZXZpZHggPT0gaWR4XG4gICAgICAgICAgICAgICAgcHJldmlkeCA9IGlkeFxuICAgICAgICAgICAgICAgICRzdWcuZmluZCgnLnR0Ym94LXNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmVxKGlkeClcbiAgICAgICAgICAgICAgICAkc2VsLmFkZENsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgc2N0b3AgPSAkc2VsPy5jbG9zZXN0KCcudHRib3gtc3VnLW92ZXJmbG93Jykuc2Nyb2xsVG9wKClcbiAgICAgICAgICAgICAgICBwb3MgPSAkc2VsPy5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgJHNlbD8uY2xvc2VzdCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnNjcm9sbFRvcCAocG9zLnRvcCArIHNjdG9wKVxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaWR4XVxuICAgICAgICAgICAgIyBoYW5kbGUgY2xpY2sgb24gYSBzdWdnZXN0IGl0ZW0sIG1vdXNlZG93biBzaW5jZSBjbGlja1xuICAgICAgICAgICAgIyB3aWxsIGZpZ2h0IHdpdGggZm9jdXNvdXQgb24gdGhlIHBpbGxcbiAgICAgICAgICAgICRzdWcub24gJ21vdXNlZG93bicsIChldikgLT5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCkgIyBubyBsb3NlIGZvY3VzXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG5cbiAgICAgICAgIyB0aGUgdHJpZyBpcyByZWFkIGZyb20gdGhlIHR5cGVcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0cmlnID0gdHlwZT8udHJpZ1xuXG4gICAgICAgICMgY3JlYXRlIHBpbGwgaHRtbFxuICAgICAgICBkZm4gPSBpZiB0cmlnXG4gICAgICAgICAgICBpZiB0cmlnLnByZWZpeCB0aGVuIHRyaWcuc3ltYm9sIGVsc2UgdHlwZS5uYW1lICsgdHJpZy5zeW1ib2xcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdHlwZS5uYW1lXG4gICAgICAgICRwaWxsID0gJChcIjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGxcXFwiPjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGwtY2xvc2VcXFwiPsOXPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8ZGZuPiN7ZGZufTwvZGZuPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIilcbiAgICAgICAgJHBpbGwuZmluZCgnKicpLmFuZFNlbGYoKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAnZmFsc2UnXG4gICAgICAgICgkc3BhbiA9ICRwaWxsLmZpbmQoJ3NwYW4nKSkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ3RydWUnXG4gICAgICAgICMgaWYgcHJlZml4IHN0eWxlIHBpbGxcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgJ3R0Ym94LXBpbGwtcHJlZml4JyBpZiB0cmlnLnByZWZpeFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0cmlnLmNsYXNzTmFtZSBpZiB0cmlnLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLmNsYXNzTmFtZSBpZiB0eXBlLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hdHRyICdkYXRhLXR5cGUnLCB0eXBlLm5hbWVcblxuICAgICAgICAjIGdlbmVyYXRlIGlkIHRvIGFzc29jaWF0ZSB3aXRoIG1lbSBzdHJ1Y3R1cmVcbiAgICAgICAgaWQgPSBcInR0Ym94cGlsbCN7RGF0ZS5ub3coKX1cIlxuICAgICAgICAkcGlsbC5hdHRyICdpZCcsIGlkXG4gICAgICAgICMgcmVwbGFjZSBjb250ZW50cyB3aXRoIHBpbGxcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlICRwaWxsWzBdXG4gICAgICAgICMgcmVtb3ZlIHBpbGwgZnJvbSBET00sIHdoaWNoIGluIHR1cm4gcmVtb3ZlcyBpdCBjb21wbGV0ZWx5XG4gICAgICAgIHJlbW92ZSA9IC0+XG4gICAgICAgICAgICAkcGlsbC5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxyZW1vdmUnLCB7cGlsbH1cbiAgICAgICAgIyB3aXJlIHVwIGNsb3NlIGJ1dHRvblxuICAgICAgICAkcGlsbC5maW5kKCcudHRib3gtcGlsbC1jbG9zZScpLm9uICdjbGljaycsIHJlbW92ZVxuICAgICAgICAjIGZvcm1hdCB0aGUgdGV4dCB1c2luZyB0aGUgdHlwZSBmb3JtYXR0ZXJcbiAgICAgICAgZm9ybWF0ID0gLT4gJHNwYW4udGV4dCB0eXBlLmZvcm1hdCAkc3Bhbi50ZXh0KClcbiAgICAgICAgIyBtYXliZSBydW4gZm9ybWF0IG9uIGZvY3Vzb3V0XG4gICAgICAgICRwaWxsLm9uICdmb2N1c291dCcsIC0+XG4gICAgICAgICAgICAjIGRpc3BhdGNoIGxhdGVyIHRvIGFsbG93IGZvciBjbGljayBvbiBzdWdnZXN0XG4gICAgICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKVxuICAgICAgICAgICAgZm9ybWF0KCkgaWYgcGlsbC5pdGVtPy5fdGV4dFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxmb2N1c291dCcsIHtwaWxsfVxuICAgICAgICAjIGhlbHBlciBmdW5jdGlvbiB0byBzY29sbCBwaWxsIGludG8gdmlld1xuICAgICAgICBzY3JvbGxJbiA9IC0+XG4gICAgICAgICAgICAkcGlsbC5hZnRlciAkdCA9ICQoJzxzcGFuIHN0eWxlPVwid2lkdGg6MXB4XCI+JylcbiAgICAgICAgICAgIHNjbGVmdCA9ICR0LmNsb3Nlc3QoJy50dGJveC1vdmVyZmxvdycpLnNjcm9sbExlZnQoKVxuICAgICAgICAgICAgcG9zID0gJHQucG9zaXRpb24oKVxuICAgICAgICAgICAgJHQuY2xvc2VzdCgnLnR0Ym94LW92ZXJmbG93Jykuc2Nyb2xsTGVmdCBwb3MubGVmdCArIHNjbGVmdFxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNpYiA9ICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIHNpYiBpZiBzaWJcbiAgICAgICAgICAgICAgICBza2lwWnduaiAkZWxbMF0sICsxICMgRkYgc2hvd3Mgbm8gY3Vyc29yIGlmIHdlIHN0YW5kIG9uIDBcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuaXRlbSA9IHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=
