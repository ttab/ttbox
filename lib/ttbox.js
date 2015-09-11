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

//# sourceMappingURL=data:application/json;base64,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Q0FBQSxFQUFFLENBQUMsTUFBSCxHQUFVLENBQVY7VUFDUCxDQUFBLEdBQUksR0FBRyxDQUFDLFdBQUosQ0FBQTtVQUNKLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBWCxFQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBMUI7VUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsRUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQXhCO0FBQ0EsaUJBQU87UUFQQSxDQXRNWDtRQStNQSxjQUFBLEVBQWdCLFNBQUMsR0FBRDtpQkFDWixHQUFHLENBQUMsSUFBSixDQUFTLG9CQUFULENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEM7UUFEWSxDQS9NaEI7UUFrTkEsaUJBQUEsRUFBbUIsU0FBQyxJQUFEO2lCQUNmLEdBQUcsQ0FBQyxJQUFKLENBQVMsb0JBQVQsQ0FBOEIsQ0FBQyxNQUEvQixDQUFzQyxJQUFBLElBQVMsQ0FBQyxDQUFDLElBQUQsSUFBUyxLQUFBLElBQVMsRUFBbkIsQ0FBL0M7UUFEZSxDQWxObkI7O0lBbkVlLENBQVI7R0FBWDs7RUF5UkEsR0FBQSxDQUFJLEtBQUosRUFBVztJQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsTUFBZDtHQUFYOztFQUdBLElBQUcsT0FBTyxNQUFQLEtBQWlCLFFBQXBCO0lBQ0ksTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFEckI7R0FBQSxNQUVLLElBQUcsT0FBTyxNQUFQLEtBQWlCLFVBQWpCLElBQWdDLE1BQU0sQ0FBQyxHQUExQztJQUNELE1BQUEsQ0FBTyxTQUFBO2FBQUc7SUFBSCxDQUFQLEVBREM7R0FBQSxNQUFBO0lBR0QsSUFBSSxDQUFDLEtBQUwsR0FBYSxNQUhaOztBQXY3QkwiLCJmaWxlIjoidHRib3guanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJnbG9iID0gZ2xvYmFsID8gd2luZG93XG5cbmRvYyAgID0gZ2xvYi5kb2N1bWVudFxuSSAgICAgPSAoYSkgLT4gYVxubWVyZ2UgPSAodCwgb3MuLi4pIC0+IHRba10gPSB2IGZvciBrLHYgb2YgbyB3aGVuIHYgIT0gdW5kZWZpbmVkIGZvciBvIGluIG9zOyB0XG5sYXRlciA9IChmbikgLT4gc2V0VGltZW91dCBmbiwgMVxuaG9sZCAgPSAobXMsIGYpIC0+IGxhc3QgPSAwOyB0aW0gPSBudWxsOyAoYXMuLi4pIC0+XG4gICAgY2xlYXJUaW1lb3V0IHRpbSBpZiB0aW1cbiAgICB0aW0gPSBzZXRUaW1lb3V0ICgtPmYgYXMuLi4pLCBtc1xubGFzdCAgPSAoYXMpIC0+IGFzP1thcy5sZW5ndGggLSAxXVxuZmluZCAgPSAoYXMsIGZuKSAtPiByZXR1cm4gYSBmb3IgYSBpbiBhcyB3aGVuIGZuKGEpXG5hcnJheUZpbHRlciA9IChhcyxmbikgLT4gKGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKSlcblxuVUEgPSBnbG9iPy5uYXZpZ2F0b3I/LnVzZXJBZ2VudFxuW2lzSUUsIElFVmVyXSA9IC9NU0lFIChbMC05XXsxLH1bLjAtOV17MCx9KS8uZXhlYyhVQSkgPyBbXVxuSUVWZXIgPSBwYXJzZUludCBJRVZlciBpZiBJRVZlclxuaXNDaHJvbWUgID0gVUEuaW5kZXhPZignQ2hyb21lJykgPiAwXG5cbiMgZGVmaW5lIGFuIGludmlzaWJsZSBwcm9wZXJ0eVxuZGVmID0gKG9iaiwgcHJvcHMpIC0+IGZvciBuYW1lLCB2YWx1ZSBvZiBwcm9wc1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBvYmosIG5hbWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgbnVsbFxuXG56d25qICAgICAgICAgPSBcIuKAi1wiICMgJnp3bmo7XG5maWx0ZXJBMCAgICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUwMGEwL2csICcgJyAjIG5ic3BcbmZpbHRlclp3bmogICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTIwMGIvZywgJydcbmZpbHRlciAgICAgICA9IChzKSAtPiBmaWx0ZXJBMCBmaWx0ZXJad25qIHNcbmFwcGVuZEFmdGVyICA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwubmV4dFNpYmxpbmcpXG5hcHBlbmRCZWZvcmUgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsKVxuaGV4ZHVtcCAgICAgID0gKHMpIC0+IChjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpIGZvciBjIGluIHMpLmpvaW4oJyAnKVxuXG4jIGluamVjdCBjc3NcbmRvIC0+XG4gICAgc3R5bGVzID0gXCJcbi50dGJveCAqIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIHdpZHRoOiBhdXRvO1xufVxuXG4udHRib3gge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuLnR0Ym94IGRmbiB7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbn1cblxuLnR0Ym94LW92ZXJmbG93IHtcbiAgICAvKiBib3JkZXI6IDFweCBzb2xpZCAjYmJiOyAqL1xuICAgIC8qIGJvcmRlci1yYWRpdXM6IDNweDsgKi9cbiAgICBvdmVyZmxvdy14OiBhdXRvO1xuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcbn1cbi50dGJveC1vdmVyZmxvdzo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG4udHRib3gtc2hvd2luZy1zdWdnZXN0IC50dGJveC1vdmVyZmxvdyB7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbn1cblxuLnR0Ym94LWlucHV0IHtcbiAgICBwYWRkaW5nLWxlZnQ6IDRweDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG4udHRib3gtaW5wdXQgKiB7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cblxuLnR0Ym94LWlucHV0ICoge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuLnR0Ym94LWlucHV0IGJyIHtcbiAgICBkaXNwbGF5OiBpbmxpbmU7XG59XG5cbi50dGJveC1zdWctb3ZlcmZsb3cge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7ICovXG4gICAgLyogYm9yZGVyLXJhZGl1czogM3B4OyAqL1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDJweCByZ2JhKDAsMCwwLDAuMyk7XG4gICAgbWF4LWhlaWdodDogMzAwcHg7XG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG59XG4udHRib3gtc3VnZ2VzdCB7XG4gICAgbWluLWhlaWdodDogNXB4O1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGxpbmUtaGVpZ2h0OiAzOHB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmZpcnN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmxhc3QtY2hpbGQge1xuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZzogMCAxMHB4IDAgMjVweDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSBkZm4ge1xuICAgIG1pbi13aWR0aDogNzBweDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIHNwYW4ge1xuICAgIGNvbG9yOiAjY2NjO1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBzcGFuIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgei1pbmRleDogMTtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBjb2xvcjogIzkyOTI5MjtcbiAgICBwYWRkaW5nLXJpZ2h0OiAyMHB4O1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIgaHIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBtYXJnaW4tdG9wOiAxLjE1ZW07XG4gICAgbGVmdDogMjBweDtcbiAgICByaWdodDogMTBweDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2RkZDtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xufVxuLnR0Ym94LXNlbGVjdGVkIHtcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xufVxuXG4udHRib3gtcGlsbCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGxpbmUtaGVpZ2h0OiAyNHB4O1xuICAgIG1hcmdpbjogMCA0cHg7XG4gICAgYmFja2dyb3VuZDogIzVjYjg1YztcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjNThiNjU4O1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIG1pbi13aWR0aDogMzBweDtcbn1cbi50dGJveC1waWxsIGRmbiB7XG4gICAgcGFkZGluZzogMCAzcHggMCAxNHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXBpbGwtcHJlZml4IGRmbiB7XG4gICAgcGFkZGluZy1yaWdodDogMDtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cbi50dGJveC1waWxsLWNsb3NlIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHBhZGRpbmc6IDAgNXB4O1xuICAgIGxpbmUtaGVpZ2h0OiAyMnB4O1xuICAgIGhlaWdodDogMjRweDtcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMik7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtcGlsbCBzcGFuIHtcbiAgICBtaW4td2lkdGg6IDVweDtcbn1cblxuLnR0Ym94LXBsYWNlaG9sZGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIG9wYWNpdHk6IDAuNDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDVweDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuXCJcbiAgICBjc3MgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIGNzcy50eXBlID0gJ3RleHQvY3NzJ1xuICAgIGNzcy5pbm5lckhUTUwgPSBzdHlsZXNcbiAgICBkb2MuaGVhZC5hcHBlbmRDaGlsZCBjc3NcblxuY2xhc3MgVHlwZVxuICAgIGNvbnN0cnVjdG9yOiAoQG5hbWUsIG9wdHMpIC0+XG4gICAgICAgIG1lcmdlIEAsIHtmb3JtYXQ6SX0sIG9wdHNcblxuY2xhc3MgVHJpZ2dlclxuICAgIGNvbnN0cnVjdG9yOiAoQHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgICAgIG1lcmdlIEAsIG9wdHNcbiAgICAgICAgQHR5cGVzID0gaWYgQXJyYXkuaXNBcnJheSB0eXBlcyB0aGVuIHR5cGVzIGVsc2UgW3R5cGVzXVxuICAgICAgICAjIHNldCBiYWNrIHJlZmVyZW5jZVxuICAgICAgICB0LnRyaWcgPSB0aGlzIGZvciB0IGluIEB0eXBlc1xuICAgICAgICBpZiBAcHJlZml4XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW50IGhhdmUgbXVsdGlwbGUgdHlwZXMgd2l0aCBwcmVmaXggdHJpZ2dlclwiKSBpZiBAdHlwZXMubGVuZ3RoID4gMVxuICAgICAgICAgICAgQHJlID0gUmVnRXhwIFwiXigpXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKFxcXFx3KilcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG5cbiMgU2tpcCB6d25qIGNoYXJzIHdoZW4gbW92aW5nIGxlZnQvcmlnaHRcbnNraXBad25qID0gKHBlbCwgZCwgZW5kKSAtPlxuICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgbiA9IGlmIGVuZCB0aGVuIHIuZW5kQ29udGFpbmVyIGVsc2Ugci5zdGFydENvbnRhaW5lclxuICAgIGkgPSBpZiBlbmQgdGhlbiByLmVuZE9mZnNldCBlbHNlIHIuc3RhcnRPZmZzZXRcbiAgICByZXR1cm4gdW5sZXNzIG4ubm9kZVR5cGUgPT0gM1xuICAgIGMgPSBuLm5vZGVWYWx1ZS5jaGFyQ29kZUF0IChpZiBkIDwgMCB0aGVuIGkgKyBkIGVsc2UgaSlcbiAgICBpZiBjID09IDgyMDNcbiAgICAgICAgIyBtb3ZlXG4gICAgICAgIHNldEN1cnNvclBvcyByLCBpICsgZFxuICAgICAgICBza2lwWnduaiBkLCBlbmQgIyBhbmQgbWF5YmUgY29udGludWUgbW92aW5nP1xuXG5pc1BhcmVudCA9IChwbiwgbikgLT5cbiAgICBpZiBuID09IG51bGwgdGhlbiBmYWxzZSBlbHNlIGlmIHBuID09IG4gdGhlbiB0cnVlIGVsc2UgaXNQYXJlbnQocG4sIG4ucGFyZW50Tm9kZSlcblxuIyBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuY3Vyc29yID0gKHBlbCkgLT5cbiAgICBzID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgcmV0dXJuIHVubGVzcyBzLnJhbmdlQ291bnRcbiAgICByID0gcy5nZXRSYW5nZUF0KDApXG4gICAgaWYgaXNQYXJlbnQocGVsLCByLnN0YXJ0Q29udGFpbmVyKSB0aGVuIHIgZWxzZSBudWxsXG5cbiMgZmlsdGVyIHRoZSByYW5nZSB0byBnZXQgcmlkIG9mIHVud2FudGVkIGNoYXJzXG5yYW5nZVN0ciA9IChyKSAtPiBmaWx0ZXIgci50b1N0cmluZygpXG5cbmZpcnN0SXNXaGl0ZSA9IChzKSAtPiAvXlxccy4qLy50ZXN0KHMgPyAnJylcbmxhc3RJc1doaXRlICA9IChzKSAtPiAvLipcXHMkLy50ZXN0KHMgPyAnJylcblxud29yZFJhbmdlQXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICAjIGV4cGFuZCBiZWdpbm5pbmdcbiAgICB3aGlsZSB0LnN0YXJ0T2Zmc2V0ID4gMCBhbmQgbm90IGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCAtIDFcbiAgICAjIG9uZSBmb3J3YXJkIGFnYWluXG4gICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0ICsgMSBpZiBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICMgZXhwYW5kIGVuZFxuICAgIGxlbiA9IHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDBcbiAgICB3aGlsZSB0LmVuZE9mZnNldCA8IGxlbiBhbmQgbm90IGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0ICsgMVxuICAgICMgb25lIGJhY2sgYWdhaW5cbiAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgLSAxIGlmIGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICByZXR1cm4gdFxuXG5lbnRpcmVUZXh0QXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICB0LnNlbGVjdE5vZGVDb250ZW50cyB0LnN0YXJ0Q29udGFpbmVyXG4gICAgcmV0dXJuIHRcblxuZmluZEluUmFuZ2UgPSAociwgY2hhcikgLT5cbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICBtYXggPSAodC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMCkgLSAxXG4gICAgZm9yIGkgaW4gW3Quc3RhcnRPZmZzZXQuLm1heF0gYnkgMVxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIGlcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIGkgKyAxXG4gICAgICAgIHJldHVybiBpIGlmIHQudG9TdHJpbmcoKSA9PSBjaGFyXG4gICAgcmV0dXJuIC0xXG5cbnNldEN1cnNvclBvcyA9IChyLCBwb3MgPSAwKSAtPlxuICAgIHQgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHQuc2V0U3RhcnQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgdC5zZXRFbmQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgc2VsID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgc2VsLmFkZFJhbmdlIHRcblxuc2V0Q3Vyc29yRWwgPSAoZWwsIHBvcyA9IDApIC0+XG4gICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgci5zZWxlY3ROb2RlQ29udGVudHMgZWxcbiAgICBwb3MgPSBlbD8ubm9kZVZhbHVlPy5sZW5ndGggaWYgcG9zIDwgMFxuICAgIHNldEN1cnNvclBvcyByLCBwb3NcblxuIyBGdW5jdGlvbiB0byBtYWtlIHR0Ym94IG91dCBvZiBhbiBlbGVtZW50IHdpdGggdHJpZ2dlcnNcbiNcbnR0Ym94ID0gKGVsLCB0cmlncy4uLikgLT5cblxuICAgICMgbG9jYWwgcmVmZXJlbmNlIHRvIHJlbmRlciBwbHVnXG4gICAgcmVuZGVyID0gdHRib3gucmVuZGVyKClcblxuICAgICMgbGV0IHJlbmRlciBkZWNpZGUgd2UgaGF2ZSBhIGdvb2QgZWxcbiAgICBlbCA9IHJlbmRlci5pbml0KGVsKVxuXG4gICAgIyBhbmQgY2hlY2sgd2UgZ290IGEgZ29vZCB0aGluZyBiYWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgRElWJykgdW5sZXNzIGVsLnRhZ05hbWUgPT0gJ0RJVidcblxuICAgICMgZGlzcGF0Y2ggZXZlbnRzIG9uIGluY29taW5nIGRpdlxuICAgIGRpc3BhdGNoID0gKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQgJ0V2ZW50J1xuICAgICAgICBtZXJnZSBlLCBvcHRzLCB7dHRib3g6ZmHDp2FkZX1cbiAgICAgICAgZS5pbml0RXZlbnQgXCJ0dGJveDoje25hbWV9XCIsIHRydWUsIGZhbHNlXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQgZVxuXG4gICAgIyBhZGQgYSBuZXcgcGlsbCB0byBpbnB1dFxuICAgIGFkZHBpbGwgPSAodHlwZSwgaXRlbSkgLT5cbiAgICAgICAgIyBlaXRoZXIgdXNlIGN1cnNvciBwb3NpdGlvbiwgb3IgdGhlIGxhc3QgY2hpbGQgZWxlbWVudFxuICAgICAgICByID0gY3Vyc29yKGVsKSA/IHJlbmRlci5yYW5nZWxhc3QoKVxuICAgICAgICAjIGltcGxpY2l0bHkgZG9lcyB0aWR5XG4gICAgICAgIHJldHVybiByZW5kZXIucGlsbGlmeSByLCB0eXBlLCBpdGVtLCBkaXNwYXRjaFxuICAgIGFkZHRleHQgPSAodGV4dCkgLT5cbiAgICAgICAgIyBlaXRoZXIgdXNlIGN1cnNvciBwb3NpdGlvbiwgb3IgdGhlIGxhc3QgY2hpbGQgZWxlbWVudFxuICAgICAgICByID0gY3Vyc29yKGVsKSA/IHJlbmRlci5yYW5nZWxhc3QoKVxuICAgICAgICByLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlKHRleHQpXG4gICAgICAgIHJlbmRlci50aWR5KClcbiAgICAgICAgcmV0dXJuIHJcbiAgICBjbGVhciA9IC0+XG4gICAgICAgIHJlbmRlci5jbGVhcigpXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgdHJpZ2dlciA9IChzeW1ib2wpIC0+XG4gICAgICAgICMgbWFrZSBzdXJlIGNvbnRpZ3VvdXMgdGV4dCBub2Rlc1xuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgIHJlbmRlci5mb2N1cygpICMgZW5zdXJlIHdlIGhhdmUgZm9jdXNcbiAgICAgICAgIyB3ZSB3YW50IHRvIGJlIHRvIHRoZSByaWdodCBvZiBhbnkgendualxuICAgICAgICAjIGluIHRoZSBjdXJyZW50IHRleHQgYmxvY2tcbiAgICAgICAgc2tpcFp3bmogZWwsIDFcbiAgICAgICAgIyBnZXQgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICByID0gd29yZFJhbmdlQXRDdXJzb3IoZWwpXG4gICAgICAgIHN0ciA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgZG8gbm90aGluZyBpZiBjdXJyZW50IHdvcmQgYWxyZWFkeSBjb250YWlucyB0cmlnZ2VyIHN5bWJvbFxuICAgICAgICByZXR1cm4gaWYgc3RyLmluZGV4T2Yoc3ltYm9sKSA+PSAwXG4gICAgICAgICMgaW5zZXJ0IHNwYWNlIGlmIHdlIGhhdmUgY29udGVudCBiZWZvcmVoYW5kXG4gICAgICAgIGluc2VydCA9IGlmIHN0ciA9PSAnJyB0aGVuIHN5bWJvbCBlbHNlIFwiICN7c3ltYm9sfVwiXG4gICAgICAgIGN1cnNvcihlbCkuaW5zZXJ0Tm9kZSBkb2MuY3JlYXRlVGV4dE5vZGUgaW5zZXJ0XG4gICAgICAgICMgbWFrZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICAjIHBvc2l0aW9uIGF0IHRoZSB2ZXJ5IGVuZCBvZiB0aGlzXG4gICAgICAgIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHNldEN1cnNvclBvcyByLCByLmVuZE9mZnNldCAtIHN5bWJvbC5sZW5ndGhcbiAgICAgICAgIyB0cmlnZ2VyIHN1Z2dlc3RcbiAgICAgICAgdXBkYXRlKClcblxuICAgICMgZXhwb3NlZCBvcGVyYXRpb25zXG4gICAgZmHDp2FkZSA9IHtcbiAgICAgICAgYWRkcGlsbCwgYWRkdGV4dCwgcmVuZGVyLCBjbGVhciwgdHJpZ2dlclxuICAgICAgICB2YWx1ZXM6IC0+IHJlbmRlci52YWx1ZXMoKVxuICAgICAgICBzZXR2YWx1ZXM6ICh2YWx1ZXMpIC0+XG4gICAgICAgICAgICBjbGVhcigpXG4gICAgICAgICAgICB2YWx1ZXMuZm9yRWFjaCAodikgLT5cbiAgICAgICAgICAgICAgICBpZiB0eXBlb2YgdiA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICBhZGR0ZXh0IHZcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFkZHBpbGwgdi50eXBlLCB2Lml0ZW1cbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIGZvY3VzOiAtPiByZW5kZXIuZm9jdXMoKVxuICAgICAgICBwbGFjZWhvbGRlcjogKHR4dCkgLT5cbiAgICAgICAgICAgIHJlbmRlci5zZXRQbGFjZWhvbGRlcih0eHQpXG4gICAgICAgICAgICB1cGRhdGUoKSAjIHRvZ2dsZSBwbGFjZWhvbGRlclxuICAgIH1cblxuICAgIHByZXZ2YWx1ZXMgPSBbXVxuXG4gICAgdXBkYXRlID0gaG9sZCAzLCAoY2hhcikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcmVuZGVyLnZhbHVlcygpXG4gICAgICAgICMgc2hvdyBwbGFjZWhvbGRlciBpZiBpdCdzIGVtcHR5XG4gICAgICAgIHJlbmRlci50b2dnbGVQbGFjZWhvbGRlciB2YWx1ZXMubGVuZ3RoID09IDBcbiAgICAgICAgdW5sZXNzIHZhbHVlcy5yZWR1Y2UgKChwLCBjLCBpKSAtPiBwIGFuZCBjID09IHByZXZ2YWx1ZXNbaV0pLCB0cnVlXG4gICAgICAgICAgICBwcmV2dmFsdWVzID0gdmFsdWVzXG4gICAgICAgICAgICBkaXNwYXRjaCAnY2hhbmdlJywge3ZhbHVlc31cbiAgICAgICAgIyBhIHBpbGwgZWRpdCB0cnVtZnMgYWxsXG4gICAgICAgIHJldHVybiBpZiBoYW5kbGVwaWxsKClcbiAgICAgICAgIyBjdXJzb3IgcmFuZ2UgZm9yIHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICAjIFhYWCBvcHRpbWl6ZSB3aXRoIGJlbG93P1xuICAgICAgICB1bmxlc3MgclxuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGEgdHJpZ2dlciBpbiB0aGUgd29yZD9cbiAgICAgICAgdHJpZyA9IGZpbmQgdHJpZ3MsICh0KSAtPiB0LnJlLnRlc3Qgd29yZFxuICAgICAgICAjIG5vIHRyaWdnZXIgZm91bmQgaW4gY3VycmVudCB3b3JkLCBhYm9ydFxuICAgICAgICB1bmxlc3MgdHJpZ1xuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICMgZXhlYyB0cmlnZ2VyIHRvIGdldCBwYXJ0c1xuICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICMgZmluZCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICB0eXBlcyA9IHRyaWcudHlwZXMuZmlsdGVyICh0KSAtPiB0cmlnLnByZWZpeCBvciB0Lm5hbWU/LmluZGV4T2YodHlwZW5hbWUpID09IDBcbiAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgaGFuZGxldHlwZXMgciwgdHJpZywgdHlwZXMsIGNoYXIsIHZhbHVlc1xuXG4gICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgIHNldFN1Z21vdmVyID0gKF9zdWdtb3ZlcikgLT4gc3VnbW92ZXIgPSBfc3VnbW92ZXJcbiAgICBzdG9wc3VnID0gLT5cbiAgICAgICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgICAgICByZW5kZXIudW5zdWdnZXN0KClcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RzdG9wJ1xuXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbHMgbGVhdmVcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxscmVtb3ZlJywgKGV2KS0+XG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICB1cGRhdGUoKSAjIHRyaWdnZXIgdmFsdWUtY2hhbmdlXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbCBsb3NlIGZvY3VzXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbGZvY3Vzb3V0Jywgc3RvcHN1Z1xuXG4gICAgaGFuZGxldHlwZXMgPSAocmFuZ2UsIHRyaWcsIHR5cGVzLCBjaGFyLCB2YWx1ZXMpIC0+XG4gICAgICAgICMgdGhlIHRyaWdnZXIgcG9zaXRpb24gaW4gdGhlIHdvcmQgcmFuZ2VcbiAgICAgICAgdHBvcyA9IGZpbmRJblJhbmdlIHJhbmdlLCB0cmlnLnN5bWJvbFxuICAgICAgICAjIG5vIHRwb3M/IVxuICAgICAgICByZXR1cm4gaWYgdHBvcyA8IDBcbiAgICAgICAgIyByYW5nZSBmb3IgdHlwZSBuYW1lICh3aGljaCBtYXkgbm90IGJlIHRoZSBlbnRpcmUgbmFtZSlcbiAgICAgICAgdHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgIHRyYW5nZS5zZXRFbmQgdHJhbmdlLmVuZENvbnRhaW5lciwgdHBvc1xuICAgICAgICAjIHdoZXRoZXIgdGhlIGxhc3QgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyXG4gICAgICAgIHdhc3RyaWcgPSBjaGFyID09IHRyaWcuc3ltYm9sXG4gICAgICAgICMgaGVscGVyIHdoZW4gZmluaXNoZWQgc2VsZWN0aW5nIGEgdHlwZVxuICAgICAgICBzZWxlY3RUeXBlID0gKHR5cGUpIC0+XG4gICAgICAgICAgICByZW5kZXIucGlsbGlmeSByYW5nZSwgdHlwZSwgbnVsbCwgZGlzcGF0Y2hcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzZWxlY3QnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgaWYgdHlwZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBlbHNlIGlmIHR5cGVzLmxlbmd0aCA9PSAxIGFuZCBub3Qgc3VnbW92ZXJcbiAgICAgICAgICAgICMgb25lIHBvc3NpYmxlIHNvbHV0aW9uXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBmb3IgdHJpZ2dlciBjaGFyLCB3ZSBzZWxlY3QgdGhlIGZpcnN0IHR5cGUgc3RyYWlnaHQgYXdheVxuICAgICAgICAgICAgICAgIHNlbGVjdFR5cGUgZmluZCB0eXBlcywgKHQpIC0+ICF0LmRpdmlkZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyB3aGVuIHRoZSBrZXkgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyIGFuZCB0aGVyZSBhcmVcbiAgICAgICAgICAgICMgbXVsdGlwbGUgcG9zc2libGUgdmFsdWVzLCBwb3NpdGlvbi4gbW92ZSB0byBqdXN0IGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgdHJpZ2dlciBjaGFyLlxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgbW92ZSB0aGUgY3Vyc29yIHRvIGFsbG93IGZvciBzdWdnZXN0IGlucHV0XG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHJhbmdlLCB0cG9zXG4gICAgICAgICAgICAjIHN0YXJ0IGEgc3VnZ2VzdCBmb3IgY3VycmVudCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICAgICAgdHlwZXN1Z2dlc3QgdHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlcywgdmFsdWVzXG5cblxuICAgICMgc3VnZ2VzdCBmb3IgZ2l2ZW4gdHlwZXNcbiAgICB0eXBlc3VnZ2VzdCA9IChyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMsIHZhbHVlcykgLT5cbiAgICAgICAgIyBmaWx0ZXIgdG8gb25seSBzaG93IHR5cGVzIHRoYXQgYXJlIHN1cHBvc2VkIHRvIGJlIHRoZXJlXG4gICAgICAgICMgZ2l2ZW4gbGltaXRPbmU6Y29uZGl0aW9uXG4gICAgICAgIGZ0eXBlcyA9IGRvIC0+XG4gICAgICAgICAgICBub3RJblZhbHVlcyA9ICh0KSAtPiAhKHZhbHVlcz8uZmlsdGVyICh2KSAtPiB2Py50eXBlPy5uYW1lID09IHQubmFtZSk/Lmxlbmd0aFxuICAgICAgICAgICAgYXJyYXlGaWx0ZXIgdHlwZXMsICh0eXBlKSAtPiAhdHlwZS5saW1pdE9uZSB8fCBub3RJblZhbHVlcyh0eXBlKVxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIGhlbHBlciB0byBjcmVhdGUgc3Vnc2VsZWN0IGZ1bmN0aW9uc1xuICAgICAgICBzdWdzZWxlY3Rmb3IgPSAoaXRlbSkgLT4gLT5cbiAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICMgdGhlIHR5cGUgaXMgc2VsZWN0ZWRcbiAgICAgICAgICAgIHNlbGVjdFR5cGUgaXRlbVxuICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICMgZnVuY3Rpb24gdGhhdCBzdWdnZXN0IHR5cGVzXG4gICAgICAgIGZudHlwZXMgPSAoXywgY2IpIC0+IGNiIGZ0eXBlc1xuICAgICAgICAjIGlmIHRoZXJlIGlzIG9ubHkgb25lLCBzZXQgaXQgYXMgcG9zc2libGUgZm9yIHJldHVybiBrZXlcbiAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIGZ0eXBlc1swXSBpZiB0eXBlcy5sZW5ndGggPT0gMVxuICAgICAgICAjIHJlbmRlciBzdWdnZXN0aW9uc1xuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnR5cGVzLCByYW5nZSwgLTEsIHNldFN1Z21vdmVyLCAodHlwZSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgdHlwZVxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZScsIHt0cmlnLCB0eXBlfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZXMnLCB7dHJpZywgZnR5cGVzfVxuXG4gICAgaGFuZGxlcGlsbCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGVudGlyZVRleHRBdEN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0eXBlb2YgcGlsbC50eXBlPy5zdWdnZXN0ID09ICdmdW5jdGlvbicgIyBkZWZpbml0ZWx5IGEgc3VnZ2VzdFxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgc3VnZ2VzdCBmdW5jdGlvbiBhcyBmbiB0byByZW5kZXIuc3VnZ2VzdFxuICAgICAgICBmbnZhbHMgPSAod29yZCwgY2IpIC0+IHBpbGwudHlwZS5zdWdnZXN0IHdvcmQsIGNiLCBwaWxsLnR5cGUsIHBpbGwudHJpZ1xuICAgICAgICAjIGhlbHBlciB3aGVuIHdlIGRlY2lkZSBvbiBhbiBpdGVtXG4gICAgICAgIHNlbGVjdEl0ZW0gPSAoaXRlbSkgLT5cbiAgICAgICAgICAgIHBpbGwuc2V0SXRlbSBpdGVtXG4gICAgICAgICAgICAjIGxhdGVyIHNpbmNlIGl0IG1heSBiZSBzZWxlY3QgZnJvbSBjbGljaywgd2hpY2ggaXMgbW91c2Vkb3duXG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXNlbGVjdCcsIHtwaWxsLCBpdGVtfVxuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnZhbHMsIHIsIC0xLCBzZXRTdWdtb3ZlciwgKGl0ZW0sIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gLT5cbiAgICAgICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgICAgICMgc2VsZWN0IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbSBpdGVtXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtJywge3BpbGwsIGl0ZW19XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGQgYWJvdXQgaXRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtcycsIHtwaWxsfVxuICAgICAgICByZXR1cm4gdHJ1ZSAjIHNpZ25hbCB3ZSBkZWFsdCB3aXRoIGl0XG5cbiAgICAjIG1vdmUgdGhlIGlucHV0IG91dCBvZiBhIHBpbGwgKGlmIHdlJ3JlIGluIGEgcGlsbClcbiAgICBwaWxsanVtcCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICBoYW5kbGVycyA9XG4gICAgICAgIGtleWRvd246ICAoZSkgLT5cblxuICAgICAgICAgICAgIyB0aGlzIGRvZXMgYW4gaW1wb3J0YW50IGVsLm5vcm1hbGl6ZSgpIHRoYXQgZW5zdXJlcyB3ZSBoYXZlXG4gICAgICAgICAgICAjIGNvbnRpZ3VvdXMgdGV4dCBub2RlcywgY3J1Y2lhbCBmb3IgdGhlIHJhbmdlIGxvZ2ljLlxuICAgICAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMTNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBkb250IHdhbnQgRE9NIGNoYW5nZVxuICAgICAgICAgICAgICAgIGlmIHN1Z3NlbGVjdD8oKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGlmIHBpbGxqdW1wKClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgc3VnbW92ZXJcbiAgICAgICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMzggICAgICAjIHVwXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoLTEpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgPT0gNDAgIyBkb3duXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoKzEpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSBpbiBbMzcsIDhdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsIC0xLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGJhY2t3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcbiAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlIGluIFszOSwgNDZdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogZWwsICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgICAgIHBhc3RlOiAoZSkgLT5cbiAgICAgICAgICAgICMgc3RvcCBkZWZhdWx0IHBhc3RlIGFjdGlvblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgICAgICMgZ3JhYiB0aGUgYWN0dWFsIGV2ZW50IChpbiBjYXNlIGpRdWVyeSB3cmFwcGVkKVxuICAgICAgICAgICAgZSA9IChlLm9yaWdpbmFsRXZlbnQgPyBlKVxuXG4gICAgICAgICAgICBpZiBlPy5jbGlwYm9hcmREYXRhXG4gICAgICAgICAgICAgICAgIyBTdGFuZGFyZCBzdHlsZVxuICAgICAgICAgICAgICAgIHR4dCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgICAgIGRvYy5leGVjQ29tbWFuZCAnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0eHRcbiAgICAgICAgICAgIGVsc2UgaWYgd2luZG93LmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICAgICAjIElFIHN0eWxlXG4gICAgICAgICAgICAgICAgdHh0ID0gd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSAnVGV4dCdcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgICAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSB0eHRcblxuICAgICAgICAgICAgdXBkYXRlKClcblxuICAgICAgICAgICAgZmFsc2VcblxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtcGxhY2Vob2xkZXJcIj48L2Rpdj48L2Rpdj4nXG4gICAgc3VnZ2VzdCA9ICc8ZGl2IGNsYXNzPVwidHRib3gtc3VnLW92ZXJmbG93XCI+PGRpdiBjbGFzcz1cInR0Ym94LXN1Z2dlc3RcIj48L2Rpdj48L2Rpdj4nXG4gICAgIyBjYWNoZSBvZiBwaWxsIDxwaWxsaWQsIHBpbGw+IHN0cnVjdHVyZXNcbiAgICBwaWxscyA9IHt9XG4gICAgIyBoZWxwZXIgdG8gdGlkeSBjYWNoZVxuICAgIHRpZHlwaWxscyA9IGhvbGQgNTAwMCwgLT5cbiAgICAgICAgcHJlc2VudCA9ICRlbC5maW5kKCcudHRib3gtcGlsbCcpLm1hcCgtPiAkKEApLmF0dHIgJ2lkJykudG9BcnJheSgpXG4gICAgICAgIGRlbGV0ZSBwaWxsc1tpZF0gZm9yIGlkIGluIE9iamVjdC5rZXlzKHBpbGxzKSB3aGVuIHByZXNlbnQuaW5kZXhPZihpZCkgPCAwXG4gICAgICAgIG51bGxcbiAgICAjIHJldHVybiB0aGUgcGlsbCBzdHJ1Y3R1cmUgZm9yIGFuIGVsZW1lbnRcbiAgICBwaWxsZm9yID0gKGVsKSAtPiBwaWxsc1skKGVsKS5jbG9zZXN0KCcudHRib3gtcGlsbCcpLmF0dHIoJ2lkJyldXG4gICAgIyBnbyB0aHJvdWdoIGNhY2hlIGFuZCBlbnN1cmUgYWxsIHBpbGxzIGhhdmUgdGhlIGl0ZW0gdmFsdWUgb2YgdGhlXG4gICAgIyBlbGVtZW50IHZhbHVlLlxuICAgIGVuc3VyZUl0ZW1zID0gLT5cbiAgICAgICAgcGlsbC5lbnN1cmVJdGVtKCkgZm9yIGssIHBpbGwgb2YgcGlsbHNcbiAgICAgICAgbnVsbFxuXG4gICAgIyBjYWxsIG9mdGVuLiBmaXggdGhpbmdzLlxuICAgIHRpZHkgPSAtPlxuICAgICAgICAkaW5wID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgIGlucCA9ICRpbnBbMF1cbiAgICAgICAgIyBtZXJnZSBzdHVmZiB0b2dldGhlciBhbmQgcmVtb3ZlIGVtcHR5IHRleHRub2Rlcy5cbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgZmlyc3QgZW5zdXJlIHRoZXJlJ3MgYSA8YnI+IGF0IHRoZSBlbmQgKG9yIDxpPiBmb3IgSUUpXG4gICAgICAgIHRhZyA9IGlmIGlzSUUgdGhlbiAnaScgZWxzZSAnYnInXG4gICAgICAgIHVubGVzcyAkaW5wLmNoaWxkcmVuKCkubGFzdCgpLmlzIHRhZ1xuICAgICAgICAgICAgJGlucC5maW5kKFwiPiAje3RhZ31cIikucmVtb3ZlKClcbiAgICAgICAgICAgICRpbnAuYXBwZW5kIFwiPCN7dGFnfT5cIlxuICAgICAgICBjaGlsZHMgPSBpbnAuY2hpbGROb2Rlc1xuICAgICAgICBmaXJzdCA9IGNoaWxkc1swXVxuICAgICAgICAjIGVuc3VyZSB0aGUgd2hvbGUgdGhpbmdzIHN0YXJ0cyB3aXRoIGEgendualxuICAgICAgICBpZiBmaXJzdD8ubm9kZVR5cGUgIT0gMyBvciBmaXJzdD8ubm9kZVZhbHVlP1swXSAhPSB6d25qXG4gICAgICAgICAgICAkaW5wWzBdLmluc2VydEJlZm9yZSBkb2MuY3JlYXRlVGV4dE5vZGUoenduaiksIGZpcnN0XG4gICAgICAgICMgZW5zdXJlIHRoZXJlJ3MgYWx3YXlzIGEgenduaiBhZnRlciBldmVyeSBlbGVtZW50IG5vZGVcbiAgICAgICAgZm9yIG4gaW4gY2hpbGRzIHdoZW4gbj8ubm9kZVR5cGUgPT0gMSBhbmQgbj8ubmV4dFNpYmxpbmc/Lm5vZGVUeXBlID09IDFcbiAgICAgICAgICAgIGFwcGVuZEFmdGVyIG4sIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMgYWdhaW4sIGVuc3VyZSBjb250aWdvdXMgbm9kZXNcbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgbW92ZSBjdXJzb3IgdG8gbm90IGJlIG9uIGJhZCBlbGVtZW50IHBvc2l0aW9uc1xuICAgICAgICBpZiByID0gY3Vyc29yKCRlbFswXSlcbiAgICAgICAgICAgIGlmIChyLnN0YXJ0Q29udGFpbmVyID09IGlucCBvciByLmVuZENvbnRhaW5lciA9PSBpbnApXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBuIGlmIG5cbiAgICAgICAgICAgICMgZmlyZWZveCBtYW5hZ2VzIHRvIGZvY3VzIGFueXRoaW5nIGJ1dCB0aGUgb25seVxuICAgICAgICAgICAgIyBjb250ZW50ZWRpdGFibGU9dHJ1ZSBvZiB0aGUgcGlsbFxuICAgICAgICAgICAgcGFyZW4gPSByLnN0YXJ0Q29udGFpbmVyLnBhcmVudE5vZGVcbiAgICAgICAgICAgIGlmIHBhcmVuPy5ub2RlTmFtZSAhPSAnU1BBTicgYW5kIHBpbGwgPSBwaWxsZm9yIHBhcmVuXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICMga2VlcCBjYWNoZSBjbGVhblxuICAgICAgICB0aWR5cGlsbHMoKVxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRpYWxpc2UgYm94XG4gICAgaW5pdDogKGVsKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWRuJ3QgZmluZCBqUXVlcnlcIikgdW5sZXNzICQgPSBqUXVlcnlcbiAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgJGVsWzBdXG5cbiAgICAjIGRyYXcgc3R1ZmYgYW5kIGhvb2sgdXAgZXZlbnQgaGFuZGxlcnNcbiAgICBkcmF3OiAoaGFuZGxlcnMpIC0+XG4gICAgICAgICRlbC5odG1sIGh0bWxcbiAgICAgICAgJGVsLm9uKGV2ZW50LCBoYW5kbGVyKSBmb3IgZXZlbnQsIGhhbmRsZXIgb2YgaGFuZGxlcnNcblxuICAgICMgY2xlYXIgdGhlIHN0YXRlIG9mIHRoZSBpbnB1dFxuICAgIGNsZWFyOiAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LWlucHV0JykuZW1wdHkoKVxuICAgICAgICB0aWR5KClcblxuICAgICMgZm9jdXMgdGhlIGlucHV0IChpZiBpdCBkb2Vzbid0IGFscmVhZHkgaGF2ZSBmb2N1cylcbiAgICBmb2N1czogLT5cbiAgICAgICAgcmV0dXJuIGlmIGN1cnNvcigkZWxbMF0pICMgYWxyZWFkeSBoYXMgZm9jdXNcbiAgICAgICAgdGlkeSgpICMgZW5zdXJlIHdlIGhhdmUgYSBsYXN0IG5vZGUgdG8gcG9zaXRpb24gYmVmb3JlXG4gICAgICAgIG5zID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXNcbiAgICAgICAgbiA9IG5zW25zLmxlbmd0aCAtIDJdXG4gICAgICAgIHNldEN1cnNvckVsIG4sIC0xXG5cbiAgICAjIHJldHVybiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBib3hcbiAgICB2YWx1ZXM6IC0+XG4gICAgICAgIGVuc3VyZUl0ZW1zKClcbiAgICAgICAgQXJyYXk6OnNsaWNlLmNhbGwoJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXMpLm1hcCAobikgLT5cbiAgICAgICAgICAgIGlmIG4ubm9kZVR5cGUgPT0gMSBhbmQgbj8uY2xhc3NOYW1lPy5pbmRleE9mKCd0dGJveC1waWxsJykgPj0gMFxuICAgICAgICAgICAgICAgIHBpbGxmb3IgblxuICAgICAgICAgICAgZWxzZSBpZiBuLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICAgICBmaWx0ZXIgbi5ub2RlVmFsdWVcbiAgICAgICAgLmZpbHRlciBJXG5cbiAgICAjIHJlbW92ZSBzdWdnZ2VzdFxuICAgIHVuc3VnZ2VzdDogdW5zdWdnZXN0ID0gLT5cbiAgICAgICAgJCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnJlbW92ZSgpXG4gICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc2hvd2luZy1zdWdnZXN0J1xuXG4gICAgIyBzdGFydCBzdWdnZXN0XG4gICAgc3VnZ2VzdDogKGZuLCByYW5nZSwgaWR4LCBtb3ZlY2IsIHNlbGVjdGNiKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGZpbmQvY3JlYXRlIHN1Z2dlc3QtYm94XG4gICAgICAgICRzdWcgPSAkKCcudHRib3gtc3VnZ2VzdCcpXG4gICAgICAgIHVubGVzcyAkc3VnLmxlbmd0aFxuICAgICAgICAgICAgJG92ZXJmbHcgPSAkKHN1Z2dlc3QpXG4gICAgICAgICAgICAkc3VnID0gJG92ZXJmbHcuZmluZCAnLnR0Ym94LXN1Z2dlc3QnXG4gICAgICAgICAgICAjIGxvY2sgd2lkdGggdG8gcGFyZW50XG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgJ21pbi13aWR0aCcsICRib3goKS5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICMgYWRqdXN0IGZvciBib3JkZXIgb2YgcGFyZW50XG4gICAgICAgICAgICBib3JkID0gcGFyc2VJbnQgJGVsLmZpbmQoJy50dGJveC1vdmVyZmxvdycpLmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpXG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgdG9wOiRlbC5vdXRlckhlaWdodCgpIC0gYm9yZFxuICAgICAgICAgICAgIyBhcHBlbmQgdG8gYm94XG4gICAgICAgICAgICAkYm94KCkuYXBwZW5kICRvdmVyZmx3XG4gICAgICAgICAgICAjIGluZGljYXRlIHdlIGFyZSBzaG93aW5nXG4gICAgICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCcpXG4gICAgICAgICMgZW1wdHkgc3VnZ2VzdCBib3ggdG8gc3RhcnQgZnJlc2hcbiAgICAgICAgJHN1Zy5odG1sKCcnKTsgJHN1Zy5vZmYoKVxuICAgICAgICAjIGNsYXNzIHRvIGhvb2sgc3R5bGluZyB3aGVuIHN1Z2dlc3RpbmdcbiAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LXJlcXVlc3QnKVxuICAgICAgICAjIHJlcXVlc3QgdG8gZ2V0IHN1Z2dlc3QgZWxlbWVudHNcbiAgICAgICAgZm4gd29yZCwgKGxpc3QpIC0+XG4gICAgICAgICAgICAjIG5vdCByZXF1ZXN0aW5nIGFueW1vcmVcbiAgICAgICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc3VnZ2VzdC1yZXF1ZXN0J1xuICAgICAgICAgICAgIyBsb2NhbCB0b0h0bWwgd2l0aCB3b3JkXG4gICAgICAgICAgICBsb2NUb0h0bWwgPSB0b0h0bWwod29yZClcbiAgICAgICAgICAgICMgdHVybiBsaXN0IGludG8gaHRtbFxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoIChsKSAtPlxuICAgICAgICAgICAgICAgICRoID0gJChsb2NUb0h0bWwobCkpXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgaWYgbC5kaXZpZGVyXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWRpdmlkZXInXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1pdGVtJ1xuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGwuY2xhc3NOYW1lIGlmIGwuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgJHN1Zy5hcHBlbmQgJGhcbiAgICAgICAgICAgICMgbGlzdCB3aXRob3V0IGRpdmlkZXJzXG4gICAgICAgICAgICBub2RpdmlkID0gbGlzdC5maWx0ZXIgKGwpIC0+ICFsLmRpdmlkZXJcbiAgICAgICAgICAgIHByZXZpZHggPSBudWxsXG4gICAgICAgICAgICBkbyBzZWxlY3RJZHggPSAoZG9zdGFydCA9IGZhbHNlKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBpZHggPCAwIGFuZCAhZG9zdGFydFxuICAgICAgICAgICAgICAgIGlkeCA9IDAgaWYgaWR4IDwgMFxuICAgICAgICAgICAgICAgIGlkeCA9IG5vZGl2aWQubGVuZ3RoIC0gMSBpZiBpZHggPj0gbm9kaXZpZC5sZW5ndGhcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcHJldmlkeCA9PSBpZHhcbiAgICAgICAgICAgICAgICBwcmV2aWR4ID0gaWR4XG4gICAgICAgICAgICAgICAgJHN1Zy5maW5kKCcudHRib3gtc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWwgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuZXEoaWR4KVxuICAgICAgICAgICAgICAgICRzZWwuYWRkQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsWzBdPy5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpZHhdXG4gICAgICAgICAgICAjIGhhbmRsZSBjbGljayBvbiBhIHN1Z2dlc3QgaXRlbSwgbW91c2Vkb3duIHNpbmNlIGNsaWNrXG4gICAgICAgICAgICAjIHdpbGwgZmlnaHQgd2l0aCBmb2N1c291dCBvbiB0aGUgcGlsbFxuICAgICAgICAgICAgJHN1Zy5vbiAnbW91c2Vkb3duJywgKGV2KSAtPlxuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKSAjIG5vIGxvc2UgZm9jdXNcbiAgICAgICAgICAgICAgICAkaXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdCgnLnR0Ym94LXN1Z2dlc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyAkaXQubGVuZ3RoXG4gICAgICAgICAgICAgICAgaSA9ICRzdWcuY2hpbGRyZW4oJy50dGJveC1zdWdnZXN0LWl0ZW0nKS5pbmRleCAkaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIGkgPj0gMFxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaV0sIHRydWVcbiAgICAgICAgICAgICMgY2FsbGJhY2sgcGFzc2VkIHRvIHBhcmVudCBmb3Iga2V5IG5hdmlnYXRpb25cbiAgICAgICAgICAgIG1vdmVjYiAob2ZmcykgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIG9mZnNcbiAgICAgICAgICAgICAgICBpZHggPSBpZHggKyBvZmZzXG4gICAgICAgICAgICAgICAgc2VsZWN0SWR4IHRydWVcblxuICAgICMgaW5zZXJ0IGEgcGlsbCBmb3IgdHlwZS9pdGVtIGF0IGdpdmVuIHJhbmdlXG4gICAgcGlsbGlmeTogKHJhbmdlLCB0eXBlLCBpdGVtLCBkaXNwYXRjaCkgLT5cblxuICAgICAgICAjIHRoZSB0cmlnIGlzIHJlYWQgZnJvbSB0aGUgdHlwZVxuICAgICAgICB0cmlnID0gdHlwZS50cmlnXG4gICAgICAgICMgY3JlYXRlIHBpbGwgaHRtbFxuICAgICAgICBkZm4gPSBpZiB0cmlnXG4gICAgICAgICAgICBpZiB0cmlnLnByZWZpeCB0aGVuIHRyaWcuc3ltYm9sIGVsc2UgdHlwZS5uYW1lICsgdHJpZy5zeW1ib2xcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdHlwZS5uYW1lXG4gICAgICAgICRwaWxsID0gJChcIjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGxcXFwiPjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGwtY2xvc2VcXFwiPsOXPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8ZGZuPiN7ZGZufTwvZGZuPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIilcbiAgICAgICAgJHBpbGwuZmluZCgnKicpLmFuZFNlbGYoKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAnZmFsc2UnXG4gICAgICAgICgkc3BhbiA9ICRwaWxsLmZpbmQoJ3NwYW4nKSkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ3RydWUnXG4gICAgICAgICMgaWYgcHJlZml4IHN0eWxlIHBpbGxcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgJ3R0Ym94LXBpbGwtcHJlZml4JyBpZiB0eXBlLnRyaWcucHJlZml4XG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUudHJpZy5jbGFzc05hbWUgaWYgdHlwZS50cmlnLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLmNsYXNzTmFtZSBpZiB0eXBlLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hdHRyICdkYXRhLXR5cGUnLCB0eXBlLm5hbWVcblxuICAgICAgICAjIGdlbmVyYXRlIGlkIHRvIGFzc29jaWF0ZSB3aXRoIG1lbSBzdHJ1Y3R1cmVcbiAgICAgICAgaWQgPSBcInR0Ym94cGlsbCN7RGF0ZS5ub3coKX1cIlxuICAgICAgICAkcGlsbC5hdHRyICdpZCcsIGlkXG4gICAgICAgICMgcmVwbGFjZSBjb250ZW50cyB3aXRoIHBpbGxcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlICRwaWxsWzBdXG4gICAgICAgICMgcmVtb3ZlIHBpbGwgZnJvbSBET00sIHdoaWNoIGluIHR1cm4gcmVtb3ZlcyBpdCBjb21wbGV0ZWx5XG4gICAgICAgIHJlbW92ZSA9IC0+XG4gICAgICAgICAgICAkcGlsbC5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxyZW1vdmUnLCB7cGlsbH1cbiAgICAgICAgIyB3aXJlIHVwIGNsb3NlIGJ1dHRvblxuICAgICAgICAkcGlsbC5maW5kKCcudHRib3gtcGlsbC1jbG9zZScpLm9uICdjbGljaycsIHJlbW92ZVxuICAgICAgICAjIGZvcm1hdCB0aGUgdGV4dCB1c2luZyB0aGUgdHlwZSBmb3JtYXR0ZXJcbiAgICAgICAgZm9ybWF0ID0gLT4gJHNwYW4udGV4dCB0eXBlLmZvcm1hdCAkc3Bhbi50ZXh0KClcbiAgICAgICAgIyBtYXliZSBydW4gZm9ybWF0IG9uIGZvY3Vzb3V0XG4gICAgICAgICRwaWxsLm9uICdmb2N1c291dCcsIC0+XG4gICAgICAgICAgICAjIGRpc3BhdGNoIGxhdGVyIHRvIGFsbG93IGZvciBjbGljayBvbiBzdWdnZXN0XG4gICAgICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKVxuICAgICAgICAgICAgZm9ybWF0KCkgaWYgcGlsbC5pdGVtPy5fdGV4dFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxmb2N1c291dCcsIHtwaWxsfVxuICAgICAgICAjIGhlbHBlciBmdW5jdGlvbiB0byBzY29sbCBwaWxsIGludG8gdmlld1xuICAgICAgICBzY3JvbGxJbiA9IC0+XG4gICAgICAgICAgICAkcGlsbC5hZnRlciAkdCA9ICQoJzxzcGFuIHN0eWxlPVwid2lkdGg6MXB4XCI+JylcbiAgICAgICAgICAgICR0WzBdLnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgICAgICR0LnJlbW92ZSgpXG4gICAgICAgICMgc3RvcCByZXNpemUgaGFuZGxlcyBpbiBJRVxuICAgICAgICBpZiBpc0lFXG4gICAgICAgICAgICAkcGlsbC5vbiAnbW91c2Vkb3duJywgKGUpIC0+XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICMgdGhlIHBpbGwgZmFjYWRlXG4gICAgICAgIHBpbGwgPSBwaWxsc1tpZF0gPSB7XG4gICAgICAgICAgICBpZCwgdHJpZywgdHlwZSwgcmVtb3ZlLFxuICAgICAgICAgICAgIyBzZXQgdGhlIGl0ZW0gdmFsdWUgZm9yIHRoaXMgcGlsbFxuICAgICAgICAgICAgc2V0SXRlbTogKEBpdGVtKSAtPiAkc3Bhbi50ZXh0IHRvVGV4dCBAaXRlbVxuICAgICAgICAgICAgIyBwb3NpdGlvbiBpbiB0aGUgcGlsbCB2YWx1ZVxuICAgICAgICAgICAgc2V0Q3Vyc29ySW46IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsICRzcGFuWzBdXG4gICAgICAgICAgICAjIHBvc2l0aW9uIHRoZSBjdXJzb3IgYWZ0ZXIgdGhlIHBpbGxcbiAgICAgICAgICAgIHNldEN1cnNvckFmdGVyOiAtPlxuICAgICAgICAgICAgICAgIHNjcm9sbEluKClcbiAgICAgICAgICAgICAgICBzaWIgPSAkcGlsbFswXT8ubmV4dFNpYmxpbmdcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBzaWIgaWYgc2liXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogJGVsWzBdLCArMSAjIEZGIHNob3dzIG5vIGN1cnNvciBpZiB3ZSBzdGFuZCBvbiAwXG4gICAgICAgIH1cbiAgICAgICAgZGVmIHBpbGwsXG4gICAgICAgICAgICAjIGVuc3VyZSB0aGUgdGV4dCBvZiB0aGUgaXRlbSBjb3JyZXNwb25kcyB0byB0aGUgdmFsdWUgb2YgQGl0ZW1cbiAgICAgICAgICAgIGVuc3VyZUl0ZW06IC0+XG4gICAgICAgICAgICAgICAgc3R4dCA9ICRzcGFuLnRleHQoKS50cmltKClcbiAgICAgICAgICAgICAgICBwdHh0ID0gdG9UZXh0IHBpbGw/Lml0ZW1cbiAgICAgICAgICAgICAgICBwaWxsLml0ZW0gPSB7dmFsdWU6c3R4dCwgX3RleHQ6dHJ1ZX0gaWYgc3R4dCAhPSBwdHh0XG4gICAgICAgIHNjcm9sbEluKClcbiAgICAgICAgdGlkeSgpXG4gICAgICAgIGlmIGl0ZW1cbiAgICAgICAgICAgICMgc2V0IHRoZSB2YWx1ZVxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBwb3NpdGlvbiBjdXJzb3IgaW4gcGlsbC4gZG8gaXQgbGF0ZXIsIGJlY2F1c2Ugd2VcbiAgICAgICAgICAgICMgbWF5IGhhdmUgY3JlYXRlZCBhIHBpbGwgYXMgYSByZXN1bHQgb2YgYSBtb3VzZWRvd24gY2xpY2tcbiAgICAgICAgICAgICMgb24gYSBzdWdnZXN0XG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgZGlzcGF0Y2ggJ3BpbGxhZGQnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHBpbGxcblxuICAgICMgcmV0dXJuIHRoZSBwaWxsIGZvciBlbGVtZW50XG4gICAgcGlsbGZvcjogcGlsbGZvclxuXG4gICAgIyBrZWVwIGlucHV0IGJveCB0aWR5IHdpdGggdmFyaW91cyBjb250ZW50ZWRpdGFibGUgYnVnIGNvcnJlY3Rpb25zXG4gICAgdGlkeTogdGlkeVxuXG4gICAgIyByYW5nZSBmb3IgbGFzdCBpbnB1dCBlbGVtZW50XG4gICAgcmFuZ2VsYXN0OiAtPlxuICAgICAgICB0aWR5KClcbiAgICAgICAgbnMgPSAkZWwuZmluZCgnLnR0Ym94LWlucHV0JylbMF0uY2hpbGROb2Rlc1xuICAgICAgICBuID0gbnNbbnMubGVuZ3RoLTJdXG4gICAgICAgIHIgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgICAgICByLnNldFN0YXJ0IG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByLnNldEVuZCBuLCBuLm5vZGVWYWx1ZS5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJcblxuICAgIHNldFBsYWNlaG9sZGVyOiAodHh0KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudGV4dCB0eHRcblxuICAgIHRvZ2dsZVBsYWNlaG9sZGVyOiAoc2hvdykgLT5cbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1wbGFjZWhvbGRlcicpLnRvZ2dsZSBzaG93IGFuZCAoIWlzSUUgb3IgSUVWZXIgPj0gMTEpXG5cbiMgdXNlIGpxdWVyeSByZW5kZXIgZGVmYXVsdFxuZGVmIHR0Ym94LCByZW5kZXI6IHR0Ym94LmpxdWVyeVxuXG4jIEV4cG9ydCB0aGUgbW9kdWxlIGluIHZhcmlvdXMgZGlmZmVyZW50IHdheXNcbmlmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCdcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHR0Ym94XG5lbHNlIGlmIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyBhbmQgZGVmaW5lLmFtZFxuICAgIGRlZmluZSAtPiB0dGJveFxuZWxzZVxuICAgIHRoaXMudHRib3ggPSB0dGJveFxuIl19