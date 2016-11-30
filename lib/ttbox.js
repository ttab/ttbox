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
    var addpill, addtext, clear, dispatch, draw, el, façade, handlepill, handlers, handletypes, hidesuggest, pilljump, prevvalues, render, setSugmover, showsuggest, stopsug, sugmover, sugselect, sugword, trigger, trigs, typesuggest, update;
    el = arguments[0], trigs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    render = ttbox.render();
    el = render.init(el);
    if (el.tagName !== 'DIV') {
      throw new Error('Need a DIV');
    }
    sugselect = sugmover = sugword = null;
    setSugmover = function(_sugmover) {
      return sugmover = _sugmover;
    };
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
        r.deleteContents();
      } else {
        insert = str === '' ? symbol : " " + symbol;
        cursor(el).insertNode(doc.createTextNode(insert));
      }
      render.tidy();
      r = entireTextAtCursor(el);
      setCursorPos(r, r.endOffset - symbol.length);
      return update();
    };
    showsuggest = function(fn, range, selectfn) {
      return render.suggest(fn, range, -1, setSugmover, function(item, doset) {
        return sugselect = function() {
          return selectfn(item);
        };
      });
    };
    hidesuggest = function() {
      return render.unsuggest();
    };
    façade = {
      addpill: addpill,
      addtext: addtext,
      render: render,
      clear: clear,
      trigger: trigger,
      showsuggest: showsuggest,
      hidesuggest: hidesuggest,
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
        dispatch('unhandled', {
          range: r,
          word: word
        });
        return;
      }
      dispatch('handled', {
        range: r,
        word: word
      });
      ref3 = trig.re.exec(word), _ = ref3[0], typename = ref3[1], value = ref3[2];
      types = trig.types.filter(function(t) {
        var ref4;
        return trig.prefix || ((ref4 = t.name) != null ? ref4.indexOf(typename) : void 0) === 0;
      });
      return handletypes(r, trig, types, char, values);
    });
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
        var $inp, childs, cs, first, i, inp, isText, j, len1, n, r, ref3, ref4, ref5, ref6, tag;
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
          $box().removeClass('ttbox-suggest-no-items');
          return fn(word, function(list) {
            var locToHtml, nodivid, previdx, selectIdx;
            $box().removeClass('ttbox-suggest-request');
            if (!list.length) {
              $box().addClass('ttbox-suggest-no-items');
            }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRib3guanMiLCJzb3VyY2VzIjpbInR0Ym94LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscVhBQUE7SUFBQTs7RUFBQSxJQUFBLHNEQUFPLFNBQVM7O0VBRWhCLEdBQUEsR0FBUSxJQUFJLENBQUM7O0VBQ2IsQ0FBQSxHQUFRLFNBQUMsQ0FBRDtXQUFPO0VBQVA7O0VBQ1IsS0FBQSxHQUFRLFNBQUE7QUFBYyxRQUFBO0lBQWIsa0JBQUc7QUFBVSxTQUFBLHNDQUFBOztBQUFBLFdBQUEsTUFBQTs7WUFBMkIsQ0FBQSxLQUFLO1VBQWhDLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTzs7QUFBUDtBQUFBO1dBQXVEO0VBQXJFOztFQUNSLEtBQUEsR0FBUSxTQUFDLEVBQUQ7V0FBUSxVQUFBLENBQVcsRUFBWCxFQUFlLENBQWY7RUFBUjs7RUFDUixJQUFBLEdBQVEsU0FBQyxFQUFELEVBQUssQ0FBTDtBQUFXLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFBRyxHQUFBLEdBQU07V0FBTSxTQUFBO0FBQ3JDLFVBQUE7TUFEc0M7TUFDdEMsSUFBb0IsR0FBcEI7UUFBQSxZQUFBLENBQWEsR0FBYixFQUFBOzthQUNBLEdBQUEsR0FBTSxVQUFBLENBQVcsQ0FBQyxTQUFBO2VBQUUsQ0FBQSxhQUFFLEVBQUY7TUFBRixDQUFELENBQVgsRUFBd0IsRUFBeEI7SUFGK0I7RUFBakM7O0VBR1IsSUFBQSxHQUFRLFNBQUMsRUFBRDt3QkFBUSxFQUFJLENBQUEsRUFBRSxDQUFDLE1BQUgsR0FBWSxDQUFaO0VBQVo7O0VBQ1IsSUFBQSxHQUFRLFNBQUMsRUFBRCxFQUFLLEVBQUw7QUFBWSxRQUFBO0FBQUEsU0FBQSxzQ0FBQTs7VUFBMEIsRUFBQSxDQUFHLENBQUg7QUFBMUIsZUFBTzs7QUFBUDtFQUFaOztFQUNSLFdBQUEsR0FBYyxTQUFDLEVBQUQsRUFBSSxFQUFKO0FBQVcsUUFBQTtBQUFDO1NBQUEsc0NBQUE7O1VBQW1CLEVBQUEsQ0FBRyxDQUFI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QUYsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUExQjtVQUNBLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBVCxFQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBeEI7QUFDQSxpQkFBTztRQVBBLENBL01YO1FBd05BLGNBQUEsRUFBZ0IsU0FBQyxHQUFEO2lCQUNaLEdBQUcsQ0FBQyxJQUFKLENBQVMsb0JBQVQsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxHQUFwQztRQURZLENBeE5oQjtRQTJOQSxpQkFBQSxFQUFtQixTQUFDLElBQUQ7aUJBQ2YsR0FBRyxDQUFDLElBQUosQ0FBUyxvQkFBVCxDQUE4QixDQUFDLE1BQS9CLENBQXNDLElBQUEsSUFBUyxDQUFDLENBQUMsSUFBRCxJQUFTLEtBQUEsSUFBUyxFQUFuQixDQUEvQztRQURlLENBM05uQjs7SUE5RGUsQ0FBUjtHQUFYOztFQTZSQSxHQUFBLENBQUksS0FBSixFQUFXO0lBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxNQUFkO0dBQVg7O0VBR0EsSUFBRyxPQUFPLE1BQVAsS0FBaUIsUUFBcEI7SUFDSSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQURyQjtHQUFBLE1BRUssSUFBRyxPQUFPLE1BQVAsS0FBaUIsVUFBakIsSUFBZ0MsTUFBTSxDQUFDLEdBQTFDO0lBQ0QsTUFBQSxDQUFPLFNBQUE7YUFBRztJQUFILENBQVAsRUFEQztHQUFBLE1BQUE7SUFHRCxJQUFJLENBQUMsS0FBTCxHQUFhLE1BSFo7O0FBNzhCTCIsInNvdXJjZXNDb250ZW50IjpbImdsb2IgPSBnbG9iYWwgPyB3aW5kb3dcblxuZG9jICAgPSBnbG9iLmRvY3VtZW50XG5JICAgICA9IChhKSAtPiBhXG5tZXJnZSA9ICh0LCBvcy4uLikgLT4gdFtrXSA9IHYgZm9yIGssdiBvZiBvIHdoZW4gdiAhPSB1bmRlZmluZWQgZm9yIG8gaW4gb3M7IHRcbmxhdGVyID0gKGZuKSAtPiBzZXRUaW1lb3V0IGZuLCAxXG5ob2xkICA9IChtcywgZikgLT4gbGFzdCA9IDA7IHRpbSA9IG51bGw7IChhcy4uLikgLT5cbiAgICBjbGVhclRpbWVvdXQgdGltIGlmIHRpbVxuICAgIHRpbSA9IHNldFRpbWVvdXQgKC0+ZiBhcy4uLiksIG1zXG5sYXN0ICA9IChhcykgLT4gYXM/W2FzLmxlbmd0aCAtIDFdXG5maW5kICA9IChhcywgZm4pIC0+IHJldHVybiBhIGZvciBhIGluIGFzIHdoZW4gZm4oYSlcbmFycmF5RmlsdGVyID0gKGFzLGZuKSAtPiAoYSBmb3IgYSBpbiBhcyB3aGVuIGZuKGEpKVxuXG5VQSA9IGdsb2I/Lm5hdmlnYXRvcj8udXNlckFnZW50XG5baXNJRSwgSUVWZXJdID0gL01TSUUgKFswLTldezEsfVsuMC05XXswLH0pLy5leGVjKFVBKSA/IFtdXG5JRVZlciA9IHBhcnNlSW50IElFVmVyIGlmIElFVmVyXG5pc0Nocm9tZSAgPSBVQS5pbmRleE9mKCdDaHJvbWUnKSA+IDBcblxuIyBkZWZpbmUgYW4gaW52aXNpYmxlIHByb3BlcnR5XG5kZWYgPSAob2JqLCBwcm9wcykgLT4gZm9yIG5hbWUsIHZhbHVlIG9mIHByb3BzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iaiwgbmFtZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICBudWxsXG5cbnp3bmogICAgICAgICA9IFwi4oCLXCIgIyAmenduajtcbmZpbHRlckEwICAgICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTAwYTAvZywgJyAnICMgbmJzcFxuZmlsdGVyWnduaiAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MjAwYi9nLCAnJ1xuZmlsdGVyICAgICAgID0gKHMpIC0+IGZpbHRlckEwIGZpbHRlclp3bmogc1xuYXBwZW5kQWZ0ZXIgID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbC5uZXh0U2libGluZylcbmFwcGVuZEJlZm9yZSA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwpXG5oZXhkdW1wICAgICAgPSAocykgLT4gKGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikgZm9yIGMgaW4gcykuam9pbignICcpXG5cbiMgaW5qZWN0IGNzc1xuZG8gLT5cbiAgICBzdHlsZXMgPSBcIiUlJUNTU1NUWUxFUyUlJSVcIlxuICAgIGNzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY3NzLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgY3NzLmlubmVySFRNTCA9IHN0eWxlc1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkIGNzc1xuXG5jbGFzcyBUeXBlXG4gICAgY29uc3RydWN0b3I6IChAbmFtZSwgb3B0cykgLT5cbiAgICAgICAgbWVyZ2UgQCwge2Zvcm1hdDpJfSwgb3B0c1xuXG5jbGFzcyBUcmlnZ2VyXG4gICAgY29uc3RydWN0b3I6IChAc3ltYm9sLCBvcHRzLCB0eXBlcykgLT5cbiAgICAgICAgbWVyZ2UgQCwgb3B0c1xuICAgICAgICBAdHlwZXMgPSBpZiBBcnJheS5pc0FycmF5IHR5cGVzIHRoZW4gdHlwZXMgZWxzZSBbdHlwZXNdXG4gICAgICAgICMgc2V0IGJhY2sgcmVmZXJlbmNlXG4gICAgICAgIHQudHJpZyA9IHRoaXMgZm9yIHQgaW4gQHR5cGVzXG4gICAgICAgIGlmIEBwcmVmaXhcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbnQgaGF2ZSBtdWx0aXBsZSB0eXBlcyB3aXRoIHByZWZpeCB0cmlnZ2VyXCIpIGlmIEB0eXBlcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKClcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEByZSA9IFJlZ0V4cCBcIl4oXFxcXHcqKVxcXFwje0BzeW1ib2x9KFxcXFx3KikkXCJcblxuIyBTa2lwIHp3bmogY2hhcnMgd2hlbiBtb3ZpbmcgbGVmdC9yaWdodFxuc2tpcFp3bmogPSAocGVsLCBkLCBlbmQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICBuID0gaWYgZW5kIHRoZW4gci5lbmRDb250YWluZXIgZWxzZSByLnN0YXJ0Q29udGFpbmVyXG4gICAgaSA9IGlmIGVuZCB0aGVuIHIuZW5kT2Zmc2V0IGVsc2Ugci5zdGFydE9mZnNldFxuICAgIHJldHVybiB1bmxlc3Mgbi5ub2RlVHlwZSA9PSAzXG4gICAgYyA9IG4ubm9kZVZhbHVlLmNoYXJDb2RlQXQgKGlmIGQgPCAwIHRoZW4gaSArIGQgZWxzZSBpKVxuICAgIGlmIGMgPT0gODIwM1xuICAgICAgICAjIG1vdmVcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIGkgKyBkXG4gICAgICAgIHNraXBad25qIGQsIGVuZCAjIGFuZCBtYXliZSBjb250aW51ZSBtb3Zpbmc/XG5cbmlzUGFyZW50ID0gKHBuLCBuKSAtPlxuICAgIGlmIG4gPT0gbnVsbCB0aGVuIGZhbHNlIGVsc2UgaWYgcG4gPT0gbiB0aGVuIHRydWUgZWxzZSBpc1BhcmVudChwbiwgbi5wYXJlbnROb2RlKVxuXG4jIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG5jdXJzb3IgPSAocGVsKSAtPlxuICAgIHMgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICByZXR1cm4gdW5sZXNzIHMucmFuZ2VDb3VudFxuICAgIHIgPSBzLmdldFJhbmdlQXQoMClcbiAgICBpZiBpc1BhcmVudChwZWwsIHIuc3RhcnRDb250YWluZXIpIHRoZW4gciBlbHNlIG51bGxcblxuIyBmaWx0ZXIgdGhlIHJhbmdlIHRvIGdldCByaWQgb2YgdW53YW50ZWQgY2hhcnNcbnJhbmdlU3RyID0gKHIpIC0+IGZpbHRlciByLnRvU3RyaW5nKClcblxuZmlyc3RJc1doaXRlID0gKHMpIC0+IC9eXFxzLiovLnRlc3QocyA/ICcnKVxubGFzdElzV2hpdGUgID0gKHMpIC0+IC8uKlxccyQvLnRlc3QocyA/ICcnKVxuXG53b3JkUmFuZ2VBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgICMgZXhwYW5kIGJlZ2lubmluZ1xuICAgIHdoaWxlIHQuc3RhcnRPZmZzZXQgPiAwIGFuZCBub3QgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0IC0gMVxuICAgICMgb25lIGZvcndhcmQgYWdhaW5cbiAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgKyAxIGlmIGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgIyBleHBhbmQgZW5kXG4gICAgbGVuID0gdC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMFxuICAgIHdoaWxlIHQuZW5kT2Zmc2V0IDwgbGVuIGFuZCBub3QgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgKyAxXG4gICAgIyBvbmUgYmFjayBhZ2FpblxuICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCAtIDEgaWYgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgIHJldHVybiB0XG5cbmVudGlyZVRleHRBdEN1cnNvciA9IChwZWwpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIHQuc2VsZWN0Tm9kZUNvbnRlbnRzIHQuc3RhcnRDb250YWluZXJcbiAgICByZXR1cm4gdFxuXG5maW5kSW5SYW5nZSA9IChyLCBjaGFyKSAtPlxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIG1heCA9ICh0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwKSAtIDFcbiAgICBmb3IgaSBpbiBbdC5zdGFydE9mZnNldC4ubWF4XSBieSAxXG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgaVxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgaSArIDFcbiAgICAgICAgcmV0dXJuIGkgaWYgdC50b1N0cmluZygpID09IGNoYXJcbiAgICByZXR1cm4gLTFcblxuc2V0Q3Vyc29yUG9zID0gKHIsIHBvcyA9IDApIC0+XG4gICAgdCA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgdC5zZXRTdGFydCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICB0LnNldEVuZCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICBzZWwgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBzZWwuYWRkUmFuZ2UgdFxuXG5zZXRDdXJzb3JFbCA9IChlbCwgcG9zID0gMCkgLT5cbiAgICByID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICByLnNlbGVjdE5vZGVDb250ZW50cyBlbFxuICAgIHBvcyA9IGVsPy5ub2RlVmFsdWU/Lmxlbmd0aCBpZiBwb3MgPCAwXG4gICAgc2V0Q3Vyc29yUG9zIHIsIHBvc1xuXG4jIEZ1bmN0aW9uIHRvIG1ha2UgdHRib3ggb3V0IG9mIGFuIGVsZW1lbnQgd2l0aCB0cmlnZ2Vyc1xuI1xudHRib3ggPSAoZWwsIHRyaWdzLi4uKSAtPlxuXG4gICAgIyBsb2NhbCByZWZlcmVuY2UgdG8gcmVuZGVyIHBsdWdcbiAgICByZW5kZXIgPSB0dGJveC5yZW5kZXIoKVxuXG4gICAgIyBsZXQgcmVuZGVyIGRlY2lkZSB3ZSBoYXZlIGEgZ29vZCBlbFxuICAgIGVsID0gcmVuZGVyLmluaXQoZWwpXG5cbiAgICAjIGFuZCBjaGVjayB3ZSBnb3QgYSBnb29kIHRoaW5nIGJhY2tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSBESVYnKSB1bmxlc3MgZWwudGFnTmFtZSA9PSAnRElWJ1xuXG4gICAgIyBzb21lIGRlY2xhcmF0aW9uc1xuICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICBzZXRTdWdtb3ZlciA9IChfc3VnbW92ZXIpIC0+IHN1Z21vdmVyID0gX3N1Z21vdmVyXG5cbiAgICAjIGRpc3BhdGNoIGV2ZW50cyBvbiBpbmNvbWluZyBkaXZcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50ICdFdmVudCdcbiAgICAgICAgbWVyZ2UgZSwgb3B0cywge3R0Ym94OmZhw6dhZGV9XG4gICAgICAgIGUuaW5pdEV2ZW50IFwidHRib3g6I3tuYW1lfVwiLCB0cnVlLCBmYWxzZVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50IGVcblxuICAgICMgYWRkIGEgbmV3IHBpbGwgdG8gaW5wdXRcbiAgICBhZGRwaWxsID0gKHR5cGUsIGl0ZW0pIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgIyBpbXBsaWNpdGx5IGRvZXMgdGlkeVxuICAgICAgICByZXR1cm4gcmVuZGVyLnBpbGxpZnkgciwgdHlwZSwgaXRlbSwgZGlzcGF0Y2hcbiAgICBhZGR0ZXh0ID0gKHRleHQpIC0+XG4gICAgICAgICMgZWl0aGVyIHVzZSBjdXJzb3IgcG9zaXRpb24sIG9yIHRoZSBsYXN0IGNoaWxkIGVsZW1lbnRcbiAgICAgICAgciA9IGN1cnNvcihlbCkgPyByZW5kZXIucmFuZ2VsYXN0KClcbiAgICAgICAgci5pbnNlcnROb2RlIGRvYy5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxuICAgICAgICByZW5kZXIudGlkeSgpXG4gICAgICAgIHJldHVybiByXG4gICAgY2xlYXIgPSAtPlxuICAgICAgICByZW5kZXIuY2xlYXIoKVxuICAgICAgICB1cGRhdGUoKVxuICAgIHRyaWdnZXIgPSAoc3ltYm9sKSAtPlxuICAgICAgICAjIG1ha2Ugc3VyZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICByZW5kZXIuZm9jdXMoKSAjIGVuc3VyZSB3ZSBoYXZlIGZvY3VzXG4gICAgICAgICMgd2Ugd2FudCB0byBiZSB0byB0aGUgcmlnaHQgb2YgYW55IHp3bmpcbiAgICAgICAgIyBpbiB0aGUgY3VycmVudCB0ZXh0IGJsb2NrXG4gICAgICAgIHNraXBad25qIGVsLCAxXG4gICAgICAgICMgZ2V0IHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICBzdHIgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGlmIHdvcmQgYWxyZWFkeSBjb250YWlucyB0aGUgdHJpZ2dlciBzeW1ib2wsIHJlbW92ZSBpdFxuICAgICAgICBpZiBzdHIuaW5kZXhPZihzeW1ib2wpID49IDBcbiAgICAgICAgICAgIHIuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIGluc2VydCBzcGFjZSBpZiB3ZSBoYXZlIGNvbnRlbnQgYmVmb3JlaGFuZFxuICAgICAgICAgICAgaW5zZXJ0ID0gaWYgc3RyID09ICcnIHRoZW4gc3ltYm9sIGVsc2UgXCIgI3tzeW1ib2x9XCJcbiAgICAgICAgICAgIGN1cnNvcihlbCkuaW5zZXJ0Tm9kZSBkb2MuY3JlYXRlVGV4dE5vZGUgaW5zZXJ0XG4gICAgICAgICMgbWFrZSBjb250aWd1b3VzIHRleHQgbm9kZXNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuICAgICAgICAjIHBvc2l0aW9uIGF0IHRoZSB2ZXJ5IGVuZCBvZiB0aGlzXG4gICAgICAgIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHNldEN1cnNvclBvcyByLCByLmVuZE9mZnNldCAtIHN5bWJvbC5sZW5ndGhcbiAgICAgICAgIyB0cmlnZ2VyIHN1Z2dlc3QgKG9yIHJlbW92ZSlcbiAgICAgICAgdXBkYXRlKClcblxuICAgICMgZm4gaXMgKHdvcmQsIGNiKVxuICAgICMgY2Igc2hvdWxkIHByb3ZpZGUgYSBsaXN0IG9mIHN1Z2dlc3RlZCBvbmUgb2ZcbiAgICAjICAgLSB7aHRtbDood29yZCktPn1cbiAgICAjICAgLSB7dmFsdWU6J3N0cicsIGRlc2M6J3N0cid9XG4gICAgIyAgIC0gc3RyaW5nXG4gICAgIyBzZWxlY3RmbiBpcyAoaXRlbSkgd2hlcmUgaXRlbSBpcyB0aGUgaXRlbSBwcm92aWRlZCBpbiBjYlxuICAgIHNob3dzdWdnZXN0ID0gKGZuLCByYW5nZSwgc2VsZWN0Zm4pIC0+XG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZuLCByYW5nZSwgLTEsIHNldFN1Z21vdmVyLCAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPiBzZWxlY3RmbihpdGVtKVxuICAgIGhpZGVzdWdnZXN0ID0gLT4gcmVuZGVyLnVuc3VnZ2VzdCgpXG5cbiAgICAjIGV4cG9zZWQgb3BlcmF0aW9uc1xuICAgIGZhw6dhZGUgPSB7XG4gICAgICAgIGFkZHBpbGwsIGFkZHRleHQsIHJlbmRlciwgY2xlYXIsIHRyaWdnZXIsIHNob3dzdWdnZXN0LCBoaWRlc3VnZ2VzdFxuICAgICAgICB2YWx1ZXM6IC0+IHJlbmRlci52YWx1ZXMoKVxuICAgICAgICBzZXR2YWx1ZXM6ICh2YWx1ZXMpIC0+XG4gICAgICAgICAgICBjbGVhcigpXG4gICAgICAgICAgICB2YWx1ZXMuZm9yRWFjaCAodikgLT5cbiAgICAgICAgICAgICAgICBpZiB0eXBlb2YgdiA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICBhZGR0ZXh0IHZcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFkZHBpbGwgdi50eXBlLCB2Lml0ZW1cbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIGZvY3VzOiAtPiByZW5kZXIuZm9jdXMoKVxuICAgICAgICBwbGFjZWhvbGRlcjogKHR4dCkgLT5cbiAgICAgICAgICAgIHJlbmRlci5zZXRQbGFjZWhvbGRlcih0eHQpXG4gICAgICAgICAgICB1cGRhdGUoKSAjIHRvZ2dsZSBwbGFjZWhvbGRlclxuICAgIH1cblxuICAgIHByZXZ2YWx1ZXMgPSBbXVxuXG4gICAgdXBkYXRlID0gaG9sZCAzLCAoY2hhcikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB2YWx1ZXNcbiAgICAgICAgdmFsdWVzID0gcmVuZGVyLnZhbHVlcygpXG4gICAgICAgICMgc2hvdyBwbGFjZWhvbGRlciBpZiBpdCdzIGVtcHR5XG4gICAgICAgIHJlbmRlci50b2dnbGVQbGFjZWhvbGRlciB2YWx1ZXMubGVuZ3RoID09IDBcbiAgICAgICAgdW5sZXNzIHZhbHVlcy5yZWR1Y2UgKChwLCBjLCBpKSAtPiBwIGFuZCBjID09IHByZXZ2YWx1ZXNbaV0pLCB0cnVlXG4gICAgICAgICAgICBwcmV2dmFsdWVzID0gdmFsdWVzXG4gICAgICAgICAgICBkaXNwYXRjaCAnY2hhbmdlJywge3ZhbHVlc31cbiAgICAgICAgIyBhIHBpbGwgZWRpdCB0cnVtZnMgYWxsXG4gICAgICAgIHJldHVybiBpZiBoYW5kbGVwaWxsKClcbiAgICAgICAgIyBjdXJzb3IgcmFuZ2UgZm9yIHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICAjIFhYWCBvcHRpbWl6ZSB3aXRoIGJlbG93P1xuICAgICAgICB1bmxlc3MgclxuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGEgdHJpZ2dlciBpbiB0aGUgd29yZD9cbiAgICAgICAgdHJpZyA9IGZpbmQgdHJpZ3MsICh0KSAtPiB0LnJlLnRlc3Qgd29yZFxuICAgICAgICAjIG5vIHRyaWdnZXIgZm91bmQgaW4gY3VycmVudCB3b3JkLCBhYm9ydFxuICAgICAgICB1bmxlc3MgdHJpZ1xuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3VuaGFuZGxlZCcsIHtyYW5nZTpyLCB3b3JkfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGRpc3BhdGNoICdoYW5kbGVkJywge3JhbmdlOnIsIHdvcmR9XG4gICAgICAgICMgZXhlYyB0cmlnZ2VyIHRvIGdldCBwYXJ0c1xuICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICMgZmluZCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICB0eXBlcyA9IHRyaWcudHlwZXMuZmlsdGVyICh0KSAtPiB0cmlnLnByZWZpeCBvciB0Lm5hbWU/LmluZGV4T2YodHlwZW5hbWUpID09IDBcbiAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgaGFuZGxldHlwZXMgciwgdHJpZywgdHlwZXMsIGNoYXIsIHZhbHVlc1xuXG4gICAgc3RvcHN1ZyA9IC0+XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICAgICAgcmVuZGVyLnVuc3VnZ2VzdCgpXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0c3RvcCdcblxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGxzIGxlYXZlXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbHJlbW92ZScsIChldiktPlxuICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgdXBkYXRlKCkgIyB0cmlnZ2VyIHZhbHVlLWNoYW5nZVxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGwgbG9zZSBmb2N1c1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxmb2N1c291dCcsIHN0b3BzdWdcblxuICAgIGhhbmRsZXR5cGVzID0gKHJhbmdlLCB0cmlnLCB0eXBlcywgY2hhciwgdmFsdWVzKSAtPlxuICAgICAgICAjIHRoZSB0cmlnZ2VyIHBvc2l0aW9uIGluIHRoZSB3b3JkIHJhbmdlXG4gICAgICAgIHRwb3MgPSBmaW5kSW5SYW5nZSByYW5nZSwgdHJpZy5zeW1ib2xcbiAgICAgICAgIyBubyB0cG9zPyFcbiAgICAgICAgcmV0dXJuIGlmIHRwb3MgPCAwXG4gICAgICAgICMgcmFuZ2UgZm9yIHR5cGUgbmFtZSAod2hpY2ggbWF5IG5vdCBiZSB0aGUgZW50aXJlIG5hbWUpXG4gICAgICAgIHRyYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKVxuICAgICAgICB0cmFuZ2Uuc2V0RW5kIHRyYW5nZS5lbmRDb250YWluZXIsIHRwb3NcbiAgICAgICAgIyB3aGV0aGVyIHRoZSBsYXN0IGlucHV0IHdhcyB0aGUgdHJpZ2dlclxuICAgICAgICB3YXN0cmlnID0gY2hhciA9PSB0cmlnLnN5bWJvbFxuICAgICAgICAjIGhlbHBlciB3aGVuIGZpbmlzaGVkIHNlbGVjdGluZyBhIHR5cGVcbiAgICAgICAgc2VsZWN0VHlwZSA9ICh0eXBlKSAtPlxuICAgICAgICAgICAgcmVuZGVyLnBpbGxpZnkgcmFuZ2UsIHR5cGUsIG51bGwsIGRpc3BhdGNoXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlc2VsZWN0Jywge3RyaWcsIHR5cGV9XG4gICAgICAgIGlmIHR5cGVzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgZWxzZSBpZiB0eXBlcy5sZW5ndGggPT0gMSBhbmQgbm90IHN1Z21vdmVyXG4gICAgICAgICAgICAjIG9uZSBwb3NzaWJsZSBzb2x1dGlvblxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgZm9yIHRyaWdnZXIgY2hhciwgd2Ugc2VsZWN0IHRoZSBmaXJzdCB0eXBlIHN0cmFpZ2h0IGF3YXlcbiAgICAgICAgICAgICAgICBzZWxlY3RUeXBlIGZpbmQgdHlwZXMsICh0KSAtPiAhdC5kaXZpZGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgd2hlbiB0aGUga2V5IGlucHV0IHdhcyB0aGUgdHJpZ2dlciBhbmQgdGhlcmUgYXJlXG4gICAgICAgICAgICAjIG11bHRpcGxlIHBvc3NpYmxlIHZhbHVlcywgcG9zaXRpb24uIG1vdmUgdG8ganVzdCBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIHRyaWdnZXIgY2hhci5cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIG1vdmUgdGhlIGN1cnNvciB0byBhbGxvdyBmb3Igc3VnZ2VzdCBpbnB1dFxuICAgICAgICAgICAgICAgIHNldEN1cnNvclBvcyByYW5nZSwgdHBvc1xuICAgICAgICAgICAgIyBzdGFydCBhIHN1Z2dlc3QgZm9yIGN1cnJlbnQgcG9zc2libGUgdHlwZXNcbiAgICAgICAgICAgIHR5cGVzdWdnZXN0IHRyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMsIHZhbHVlc1xuXG5cbiAgICAjIHN1Z2dlc3QgZm9yIGdpdmVuIHR5cGVzXG4gICAgdHlwZXN1Z2dlc3QgPSAocmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzLCB2YWx1ZXMpIC0+XG4gICAgICAgICMgZmlsdGVyIHRvIG9ubHkgc2hvdyB0eXBlcyB0aGF0IGFyZSBzdXBwb3NlZCB0byBiZSB0aGVyZVxuICAgICAgICAjIGdpdmVuIGxpbWl0T25lOmNvbmRpdGlvblxuICAgICAgICBmdHlwZXMgPSBkbyAtPlxuICAgICAgICAgICAgbm90SW5WYWx1ZXMgPSAodCkgLT4gISh2YWx1ZXM/LmZpbHRlciAodikgLT4gdj8udHlwZT8ubmFtZSA9PSB0Lm5hbWUpPy5sZW5ndGhcbiAgICAgICAgICAgIGFycmF5RmlsdGVyIHR5cGVzLCAodHlwZSkgLT4gIXR5cGUubGltaXRPbmUgfHwgbm90SW5WYWx1ZXModHlwZSlcbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBoZWxwZXIgdG8gY3JlYXRlIHN1Z3NlbGVjdCBmdW5jdGlvbnNcbiAgICAgICAgc3Vnc2VsZWN0Zm9yID0gKGl0ZW0pIC0+IC0+XG4gICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAjIHRoZSB0eXBlIGlzIHNlbGVjdGVkXG4gICAgICAgICAgICBzZWxlY3RUeXBlIGl0ZW1cbiAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAjIGZ1bmN0aW9uIHRoYXQgc3VnZ2VzdCB0eXBlc1xuICAgICAgICBmbnR5cGVzID0gKF8sIGNiKSAtPiBjYiBmdHlwZXNcbiAgICAgICAgIyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgc2V0IGl0IGFzIHBvc3NpYmxlIGZvciByZXR1cm4ga2V5XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciBmdHlwZXNbMF0gaWYgdHlwZXMubGVuZ3RoID09IDFcbiAgICAgICAgIyByZW5kZXIgc3VnZ2VzdGlvbnNcbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm50eXBlcywgcmFuZ2UsIC0xLCBzZXRTdWdtb3ZlciwgKHR5cGUsIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIHR5cGVcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGUnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzJywge3RyaWcsIGZ0eXBlc31cblxuICAgIGhhbmRsZXBpbGwgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHJldHVybiB1bmxlc3MgdHlwZW9mIHBpbGwudHlwZT8uc3VnZ2VzdCA9PSAnZnVuY3Rpb24nICMgZGVmaW5pdGVseSBhIHN1Z2dlc3RcbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIHN1Z2dlc3QgZnVuY3Rpb24gYXMgZm4gdG8gcmVuZGVyLnN1Z2dlc3RcbiAgICAgICAgZm52YWxzID0gKHdvcmQsIGNiKSAtPiBwaWxsLnR5cGUuc3VnZ2VzdCB3b3JkLCBjYiwgcGlsbC50eXBlLCBwaWxsLnRyaWdcbiAgICAgICAgIyBoZWxwZXIgd2hlbiB3ZSBkZWNpZGUgb24gYW4gaXRlbVxuICAgICAgICBzZWxlY3RJdGVtID0gKGl0ZW0pIC0+XG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICAgICAgIyBsYXRlciBzaW5jZSBpdCBtYXkgYmUgc2VsZWN0IGZyb20gY2xpY2ssIHdoaWNoIGlzIG1vdXNlZG93blxuICAgICAgICAgICAgbGF0ZXIgLT4gcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zZWxlY3QnLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm52YWxzLCByLCAtMSwgc2V0U3VnbW92ZXIsIChpdGVtLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IC0+XG4gICAgICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICAgICAjIHNlbGVjdCB0aGUgaXRlbVxuICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0gaXRlbVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbScsIHtwaWxsLCBpdGVtfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkIGFib3V0IGl0XG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXMnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHRydWUgIyBzaWduYWwgd2UgZGVhbHQgd2l0aCBpdFxuXG4gICAgIyBtb3ZlIHRoZSBpbnB1dCBvdXQgb2YgYSBwaWxsIChpZiB3ZSdyZSBpbiBhIHBpbGwpXG4gICAgcGlsbGp1bXAgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoZWwpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgaGFuZGxlcnMgPVxuICAgICAgICBrZXlkb3duOiAoZSkgLT5cbiAgICAgICAgICAgICMgdGhpcyBkb2VzIGFuIGltcG9ydGFudCBlbC5ub3JtYWxpemUoKSB0aGF0IGVuc3VyZXMgd2UgaGF2ZVxuICAgICAgICAgICAgIyBjb250aWd1b3VzIHRleHQgbm9kZXMsIGNydWNpYWwgZm9yIHRoZSByYW5nZSBsb2dpYy5cbiAgICAgICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDEzXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICMgZG9udCB3YW50IERPTSBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiBzdWdzZWxlY3Q/KClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiBwaWxsanVtcCgpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHN1Z21vdmVyXG4gICAgICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDM4ICAgICAgIyB1cFxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoLTEpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgPT0gNDAgIyBkb3duXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigrMSlcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlIGluIFszNywgOF1cbiAgICAgICAgICAgICAgICBza2lwWnduaiBlbCwgLTEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogYmFja3dhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgaW4gWzM5LCA0Nl1cbiAgICAgICAgICAgICAgICBza2lwWnduaiBlbCwgKzEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogZm9yd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG5cbiAgICAgICAgICAgIHVwZGF0ZSgpICMgZG8gYW4gdXBkYXRlLCBidXQgbWF5IGNhbmNlbCB3aXRoIGtleXByZXNzIHRvIGdldCBjaGFyXG5cbiAgICAgICAgICAgICMgYW5kIGtlZXAgbWFrZSBzdXJlIGl0J3MgdGlkeVxuICAgICAgICAgICAgbGF0ZXIgLT4gcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgIGtleXByZXNzOiAoZSkgLT5cbiAgICAgICAgICAgICMgY2FuY2VsIHByZXZpb3VzIHVwZGF0ZSBzaW5jZSB3ZSBoYXZlIGEgY2hhcmNvZGVcbiAgICAgICAgICAgIHVwZGF0ZSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpXG5cbiAgICAgICAgcGFzdGU6IChlKSAtPlxuICAgICAgICAgICAgIyBzdG9wIGRlZmF1bHQgcGFzdGUgYWN0aW9uXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgICAgIyBncmFiIHRoZSBhY3R1YWwgZXZlbnQgKGluIGNhc2UgalF1ZXJ5IHdyYXBwZWQpXG4gICAgICAgICAgICBlID0gKGUub3JpZ2luYWxFdmVudCA/IGUpXG5cbiAgICAgICAgICAgIGlmIGU/LmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICAgICAjIFN0YW5kYXJkIHN0eWxlXG4gICAgICAgICAgICAgICAgdHh0ID0gZS5jbGlwYm9hcmREYXRhLmdldERhdGEgJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAgICAgZG9jLmV4ZWNDb21tYW5kICdpbnNlcnRUZXh0JywgZmFsc2UsIHR4dFxuICAgICAgICAgICAgZWxzZSBpZiB3aW5kb3cuY2xpcGJvYXJkRGF0YVxuICAgICAgICAgICAgICAgICMgSUUgc3R5bGVcbiAgICAgICAgICAgICAgICB0eHQgPSB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhICdUZXh0J1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihlbClcbiAgICAgICAgICAgICAgICByLmluc2VydE5vZGUgZG9jLmNyZWF0ZVRleHROb2RlIHR4dFxuXG4gICAgICAgICAgICB1cGRhdGUoKVxuXG4gICAgICAgICAgICBmYWxzZVxuXG5cbiAgICAjIGZpcnN0IGRyYXdpbmdcbiAgICBkbyBkcmF3ID0gLT5cbiAgICAgICAgIyBkcmF3IGFuZCBhdHRhY2ggaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLmRyYXcgaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgIyBmaXJzdCBldmVudFxuICAgIGxhdGVyIC0+IGRpc3BhdGNoICdpbml0J1xuXG4gICAgIyByZXR1cm4gdGhlIGZhY2FkZSB0byBpbnRlcmFjdFxuICAgIHJldHVybiBmYcOnYWRlXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBtYWtpbmcgdHJpZ2dlcnMuXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJzonLCB0eXBlcyk7XG4jICAgdmFyIHRyaWcxID0gdHRib3gudHJpZygnQCcsIHtwcmVmaXg6IHRydWV9LCB0eXBlcyk7XG50dGJveC50cmlnID0gKHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAyXG4gICAgICAgIHR5cGVzID0gb3B0c1xuICAgICAgICBvcHRzID0ge31cbiAgICBuZXcgVHJpZ2dlciBzeW1ib2wsIG9wdHMsIHR5cGVzXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBkaXZpZGVycyBpbiB0eXBlIGxpc3RzXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0eXBlcyA9IFtcbiMgICAgIHR0Ym94LmRpdmlkZXIoJ0xpbWl0IHNlYXJjaCBvbicpLFxuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3guZGl2aWRlciA9IChuYW1lLCBvcHRzKSAtPiBuZXcgVHlwZSBuYW1lLCBtZXJnZSB7XG4gICAgZGl2aWRlcjp0cnVlXG4gICAgaHRtbDogLT4gXCI8ZGl2Pjxocj48c3Bhbj4je0BuYW1lfTwvc3Bhbj48L2Rpdj5cIlxufSwgb3B0c1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHR5cGVzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC50eXBlKCdwcm9kdWN0Jywge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgICAgdHRib3gudHlwZSgncGVyc29uJywgIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICBdXG50dGJveC50eXBlID0gKG5hbWUsIG9wdHMsIHR5cGVzKSAtPiBuZXcgVHlwZSBuYW1lLCBvcHRzXG5cblxuIyBIZWxwZXIgbWV0aG9kIHRvIG1ha2UgaHRtbCBmb3IgYSBzdWdnZXN0LlxuIyBcIjxkaXY+PGRmbj48Yj53b3JkPC9iPmlzcGFydG9mPC9kZm4+OiBzb21lIGRlc2NyaXB0aW9uPC9kaXY+XCJcbnN1Z2dlc3RIdG1sID0gKHdvcmQsIHByZWZpeCwgbmFtZSwgc3VmZml4LCBkZXNjID0gJycpIC0+XG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2PicgdW5sZXNzIG5hbWVcbiAgICBbaGlnaCwgdW5oaWdoXSA9IGlmIG5hbWUuaW5kZXhPZih3b3JkKSA9PSAwIHRoZW4gW3dvcmQsIG5hbWVbd29yZC5sZW5ndGguLl1dIGVsc2UgW1wiXCIsIG5hbWVdXG4gICAgXCI8ZGl2PjxkZm4+I3twcmVmaXh9PGI+I3toaWdofTwvYj4je3VuaGlnaH0je3N1ZmZpeH08L2Rmbj4gPHNwYW4+I3tkZXNjfTwvc3Bhbj48L2Rpdj5cIlxuVHlwZTo6aHRtbCA9ICh3b3JkKSAtPlxuICAgIGlmIEB0cmlnLnByZWZpeFxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBAdHJpZy5zeW1ib2wsIEBuYW1lLCBcIlwiLCBAZGVzY1xuICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgQG5hbWUsIEB0cmlnLnN5bWJvbCwgQGRlc2NcblxuXG4jIGdvZXMgdGhyb3VnaCBhbiBlbGVtZW50IHBhcnNpbmcgcGlsbHMgYW5kXG4jIHRleHQgaW50byBhIGRhdGFzdHJ1Y3R1cmVcbiMgaGVscGVyIHRvIHR1cm4gYSBzdWdnZXN0IGl0ZW0gaW50byBodG1sXG50b0h0bWwgPSAod29yZCkgLT4gKGl0ZW0pIC0+XG4gICAgaWYgdHlwZW9mIGl0ZW0/Lmh0bWwgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICBpdGVtLmh0bWwod29yZClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLnZhbHVlLCBcIlwiLCBpdGVtLmRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIGl0ZW0sIFwiXCJcblxuXG4jIGhlbHBlciB0byB0dXJuIGFuIGl0ZW0gaW50byB0ZXh0XG50b1RleHQgPSAoaXRlbSA9ICcnKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBpdGVtLnZhbHVlXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcoaXRlbSlcblxuIyBqcXVlcnkgZHJhd2luZyBob29rXG5kZWYgdHRib3gsIGpxdWVyeTogLT5cblxuICAgICQgICAgPSBudWxsICMgc2V0IG9uIGluaXRcbiAgICAkZWwgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGJveCA9IC0+ICRlbC5maW5kKCcudHRib3gnKVxuICAgICMgaHRtbCBmb3IgYm94XG4gICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwidHRib3hcIj48ZGl2IGNsYXNzPVwidHRib3gtb3ZlcmZsb3dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0dGJveC1pbnB1dFwiIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIj48L2Rpdj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0dGJveC1wbGFjZWhvbGRlclwiPjwvZGl2PjwvZGl2PidcbiAgICBzdWdnZXN0ID0gJzxkaXYgY2xhc3M9XCJ0dGJveC1zdWctb3ZlcmZsb3dcIj48ZGl2IGNsYXNzPVwidHRib3gtc3VnZ2VzdFwiPjwvZGl2PjwvZGl2PidcbiAgICAjIGNhY2hlIG9mIHBpbGwgPHBpbGxpZCwgcGlsbD4gc3RydWN0dXJlc1xuICAgIHBpbGxzID0ge31cbiAgICAjIGhlbHBlciB0byB0aWR5IGNhY2hlXG4gICAgdGlkeXBpbGxzID0gaG9sZCA1MDAwLCAtPlxuICAgICAgICBwcmVzZW50ID0gJGVsLmZpbmQoJy50dGJveC1waWxsJykubWFwKC0+ICQoQCkuYXR0ciAnaWQnKS50b0FycmF5KClcbiAgICAgICAgZGVsZXRlIHBpbGxzW2lkXSBmb3IgaWQgaW4gT2JqZWN0LmtleXMocGlsbHMpIHdoZW4gcHJlc2VudC5pbmRleE9mKGlkKSA8IDBcbiAgICAgICAgbnVsbFxuICAgICMgcmV0dXJuIHRoZSBwaWxsIHN0cnVjdHVyZSBmb3IgYW4gZWxlbWVudFxuICAgIHBpbGxmb3IgPSAoZWwpIC0+IHBpbGxzWyQoZWwpLmNsb3Nlc3QoJy50dGJveC1waWxsJykuYXR0cignaWQnKV1cbiAgICAjIGdvIHRocm91Z2ggY2FjaGUgYW5kIGVuc3VyZSBhbGwgcGlsbHMgaGF2ZSB0aGUgaXRlbSB2YWx1ZSBvZiB0aGVcbiAgICAjIGVsZW1lbnQgdmFsdWUuXG4gICAgZW5zdXJlSXRlbXMgPSAtPlxuICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKSBmb3IgaywgcGlsbCBvZiBwaWxsc1xuICAgICAgICBudWxsXG5cbiAgICAjIGNhbGwgb2Z0ZW4uIGZpeCB0aGluZ3MuXG4gICAgdGlkeSA9IC0+XG4gICAgICAgICRpbnAgPSAkZWwuZmluZCgnLnR0Ym94LWlucHV0JylcbiAgICAgICAgaW5wID0gJGlucFswXVxuICAgICAgICAjIG1lcmdlIHN0dWZmIHRvZ2V0aGVyIGFuZCByZW1vdmUgZW1wdHkgdGV4dG5vZGVzLlxuICAgICAgICBpbnAubm9ybWFsaXplKClcbiAgICAgICAgIyBmaXJzdCBlbnN1cmUgdGhlcmUncyBhIDxicj4gYXQgdGhlIGVuZCAob3IgPGk+IGZvciBJRSlcbiAgICAgICAgdGFnID0gaWYgaXNJRSB0aGVuICdpJyBlbHNlICdicidcbiAgICAgICAgdW5sZXNzICRpbnAuY2hpbGRyZW4oKS5sYXN0KCkuaXMgdGFnXG4gICAgICAgICAgICAkaW5wLmZpbmQoXCI+ICN7dGFnfVwiKS5yZW1vdmUoKVxuICAgICAgICAgICAgJGlucC5hcHBlbmQgXCI8I3t0YWd9PlwiXG4gICAgICAgIGNoaWxkcyA9IGlucC5jaGlsZE5vZGVzXG4gICAgICAgIGZpcnN0ID0gY2hpbGRzWzBdXG4gICAgICAgICMgZW5zdXJlIHRoZSB3aG9sZSB0aGluZ3Mgc3RhcnRzIHdpdGggYSB6d25qXG4gICAgICAgIGlmIGZpcnN0Py5ub2RlVHlwZSAhPSAzIG9yIGZpcnN0Py5ub2RlVmFsdWU/WzBdICE9IHp3bmpcbiAgICAgICAgICAgICRpbnBbMF0uaW5zZXJ0QmVmb3JlIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKSwgZmlyc3RcbiAgICAgICAgIyBlbnN1cmUgdGhlcmUncyBhbHdheXMgYSB6d25qIGFmdGVyIGV2ZXJ5IGVsZW1lbnQgbm9kZVxuICAgICAgICBmb3IgbiBpbiBjaGlsZHMgd2hlbiBuPy5ub2RlVHlwZSA9PSAxIGFuZCBuPy5uZXh0U2libGluZz8ubm9kZVR5cGUgPT0gMVxuICAgICAgICAgICAgYXBwZW5kQWZ0ZXIgbiwgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopXG4gICAgICAgICMgcmVtb3ZlIGFueSBuZXN0ZWQgc3BhbiBpbiBwaWxsc1xuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBpbGwgc3BhbiBzcGFuJykucmVtb3ZlKClcbiAgICAgICAgIyBhZ2FpbiwgZW5zdXJlIGNvbnRpZ291cyBub2Rlc1xuICAgICAgICBpbnAubm9ybWFsaXplKClcbiAgICAgICAgIyBtb3ZlIGN1cnNvciB0byBub3QgYmUgb24gYmFkIGVsZW1lbnQgcG9zaXRpb25zXG4gICAgICAgIGlmIHIgPSBjdXJzb3IoJGVsWzBdKVxuICAgICAgICAgICAgaWYgci5zdGFydENvbnRhaW5lciA9PSBpbnAgb3Igci5lbmRDb250YWluZXIgPT0gaW5wXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCBuLCAtMSBpZiBuXG4gICAgICAgICMga2VlcCBjYWNoZSBjbGVhblxuICAgICAgICB0aWR5cGlsbHMoKVxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRpYWxpc2UgYm94XG4gICAgaW5pdDogKGVsKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWRuJ3QgZmluZCBqUXVlcnlcIikgdW5sZXNzICQgPSBqUXVlcnlcbiAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgJGVsWzBdXG5cbiAgICAjIGRyYXcgc3R1ZmYgYW5kIGhvb2sgdXAgZXZlbnQgaGFuZGxlcnNcbiAgICBkcmF3OiAoaGFuZGxlcnMpIC0+XG4gICAgICAgICRlbC5odG1sIGh0bWxcbiAgICAgICAgJGVsLm9uKGV2ZW50LCBoYW5kbGVyKSBmb3IgZXZlbnQsIGhhbmRsZXIgb2YgaGFuZGxlcnNcblxuICAgICMgY2xlYXIgdGhlIHN0YXRlIG9mIHRoZSBpbnB1dFxuICAgIGNsZWFyOiAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LWlucHV0JykuZW1wdHkoKVxuICAgICAgICB0aWR5KClcblxuICAgICMgZm9jdXMgdGhlIGlucHV0IChpZiBpdCBkb2Vzbid0IGFscmVhZHkgaGF2ZSBmb2N1cylcbiAgICBmb2N1czogLT5cbiAgICAgICAgcmV0dXJuIGlmIGN1cnNvcigkZWxbMF0pICMgYWxyZWFkeSBoYXMgZm9jdXNcbiAgICAgICAgdGlkeSgpICMgZW5zdXJlIHdlIGhhdmUgYSBsYXN0IG5vZGUgdG8gcG9zaXRpb24gYmVmb3JlXG4gICAgICAgIG5zID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXNcbiAgICAgICAgbiA9IG5zW25zLmxlbmd0aCAtIDJdXG4gICAgICAgIHNldEN1cnNvckVsIG4sIC0xXG5cbiAgICAjIHJldHVybiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBib3hcbiAgICB2YWx1ZXM6IC0+XG4gICAgICAgIGVuc3VyZUl0ZW1zKClcbiAgICAgICAgQXJyYXk6OnNsaWNlLmNhbGwoJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXMpLm1hcCAobikgLT5cbiAgICAgICAgICAgIGlmIG4ubm9kZVR5cGUgPT0gMSBhbmQgbj8uY2xhc3NOYW1lPy5pbmRleE9mKCd0dGJveC1waWxsJykgPj0gMFxuICAgICAgICAgICAgICAgIHBpbGxmb3IgblxuICAgICAgICAgICAgZWxzZSBpZiBuLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICAgICBmaWx0ZXIgbi5ub2RlVmFsdWVcbiAgICAgICAgLmZpbHRlciBJXG5cbiAgICAjIHJlbW92ZSBzdWdnZ2VzdFxuICAgIHVuc3VnZ2VzdDogdW5zdWdnZXN0ID0gLT5cbiAgICAgICAgJCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnJlbW92ZSgpXG4gICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc2hvd2luZy1zdWdnZXN0J1xuXG4gICAgIyBzdGFydCBzdWdnZXN0XG4gICAgc3VnZ2VzdDogKGZuLCByYW5nZSwgaWR4LCBtb3ZlY2IsIHNlbGVjdGNiKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGZpbmQvY3JlYXRlIHN1Z2dlc3QtYm94XG4gICAgICAgICRzdWcgPSAkKCcudHRib3gtc3VnZ2VzdCcpXG4gICAgICAgIHVubGVzcyAkc3VnLmxlbmd0aFxuICAgICAgICAgICAgJG92ZXJmbHcgPSAkKHN1Z2dlc3QpXG4gICAgICAgICAgICAkc3VnID0gJG92ZXJmbHcuZmluZCAnLnR0Ym94LXN1Z2dlc3QnXG4gICAgICAgICAgICAjIGxvY2sgd2lkdGggdG8gcGFyZW50XG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgJ21pbi13aWR0aCcsICRib3goKS5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICMgYWRqdXN0IGZvciBib3JkZXIgb2YgcGFyZW50XG4gICAgICAgICAgICBib3JkID0gcGFyc2VJbnQgJGVsLmZpbmQoJy50dGJveC1vdmVyZmxvdycpLmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpXG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgdG9wOiRlbC5vdXRlckhlaWdodCgpIC0gYm9yZFxuICAgICAgICAgICAgIyBhcHBlbmQgdG8gYm94XG4gICAgICAgICAgICAkYm94KCkuYXBwZW5kICRvdmVyZmx3XG4gICAgICAgICAgICAjIGluZGljYXRlIHdlIGFyZSBzaG93aW5nXG4gICAgICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCcpXG4gICAgICAgICMgZW1wdHkgc3VnZ2VzdCBib3ggdG8gc3RhcnQgZnJlc2hcbiAgICAgICAgJHN1Zy5odG1sKCcnKTsgJHN1Zy5vZmYoKVxuICAgICAgICAjIGNsYXNzIHRvIGhvb2sgc3R5bGluZyB3aGVuIHN1Z2dlc3RpbmdcbiAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LXJlcXVlc3QnKVxuICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MoJ3R0Ym94LXN1Z2dlc3Qtbm8taXRlbXMnKVxuICAgICAgICAjIHJlcXVlc3QgdG8gZ2V0IHN1Z2dlc3QgZWxlbWVudHNcbiAgICAgICAgZm4gd29yZCwgKGxpc3QpIC0+XG4gICAgICAgICAgICAjIG5vdCByZXF1ZXN0aW5nIGFueW1vcmVcbiAgICAgICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc3VnZ2VzdC1yZXF1ZXN0J1xuICAgICAgICAgICAgIyBtYXliZSBubyBoaXRzP1xuICAgICAgICAgICAgdW5sZXNzIGxpc3QubGVuZ3RoXG4gICAgICAgICAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LW5vLWl0ZW1zJylcbiAgICAgICAgICAgICMgbG9jYWwgdG9IdG1sIHdpdGggd29yZFxuICAgICAgICAgICAgbG9jVG9IdG1sID0gdG9IdG1sKHdvcmQpXG4gICAgICAgICAgICAjIHR1cm4gbGlzdCBpbnRvIGh0bWxcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCAobCkgLT5cbiAgICAgICAgICAgICAgICAkaCA9ICQobG9jVG9IdG1sKGwpKVxuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGlmIGwuZGl2aWRlclxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1kaXZpZGVyJ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtaXRlbSdcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBsLmNsYXNzTmFtZSBpZiBsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICRzdWcuYXBwZW5kICRoXG4gICAgICAgICAgICAjIGxpc3Qgd2l0aG91dCBkaXZpZGVyc1xuICAgICAgICAgICAgbm9kaXZpZCA9IGxpc3QuZmlsdGVyIChsKSAtPiAhbC5kaXZpZGVyXG4gICAgICAgICAgICBwcmV2aWR4ID0gbnVsbFxuICAgICAgICAgICAgZG8gc2VsZWN0SWR4ID0gKGRvc3RhcnQgPSBmYWxzZSkgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgaWR4IDwgMCBhbmQgIWRvc3RhcnRcbiAgICAgICAgICAgICAgICBpZHggPSAwIGlmIGlkeCA8IDBcbiAgICAgICAgICAgICAgICBpZHggPSBub2RpdmlkLmxlbmd0aCAtIDEgaWYgaWR4ID49IG5vZGl2aWQubGVuZ3RoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHByZXZpZHggPT0gaWR4XG4gICAgICAgICAgICAgICAgcHJldmlkeCA9IGlkeFxuICAgICAgICAgICAgICAgICRzdWcuZmluZCgnLnR0Ym94LXNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmVxKGlkeClcbiAgICAgICAgICAgICAgICAkc2VsLmFkZENsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgc2N0b3AgPSAkc2VsPy5jbG9zZXN0KCcudHRib3gtc3VnLW92ZXJmbG93Jykuc2Nyb2xsVG9wKClcbiAgICAgICAgICAgICAgICBwb3MgPSAkc2VsPy5wb3NpdGlvbigpXG4gICAgICAgICAgICAgICAgJHNlbD8uY2xvc2VzdCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnNjcm9sbFRvcCAocG9zLnRvcCArIHNjdG9wKVxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaWR4XVxuICAgICAgICAgICAgIyBoYW5kbGUgY2xpY2sgb24gYSBzdWdnZXN0IGl0ZW0sIG1vdXNlZG93biBzaW5jZSBjbGlja1xuICAgICAgICAgICAgIyB3aWxsIGZpZ2h0IHdpdGggZm9jdXNvdXQgb24gdGhlIHBpbGxcbiAgICAgICAgICAgICRzdWcub24gJ21vdXNlZG93bicsIChldikgLT5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCkgIyBubyBsb3NlIGZvY3VzXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG5cbiAgICAgICAgIyB0aGUgdHJpZyBpcyByZWFkIGZyb20gdGhlIHR5cGVcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0cmlnID0gdHlwZT8udHJpZ1xuXG4gICAgICAgICMgY3JlYXRlIHBpbGwgaHRtbFxuICAgICAgICBkZm4gPSBpZiB0cmlnXG4gICAgICAgICAgICBpZiB0cmlnLnByZWZpeCB0aGVuIHRyaWcuc3ltYm9sIGVsc2UgdHlwZS5uYW1lICsgdHJpZy5zeW1ib2xcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdHlwZS5uYW1lXG4gICAgICAgICRwaWxsID0gJChcIjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGxcXFwiPjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGwtY2xvc2VcXFwiPsOXPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8ZGZuPiN7ZGZufTwvZGZuPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIilcbiAgICAgICAgJHBpbGwuZmluZCgnKicpLmFuZFNlbGYoKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAnZmFsc2UnXG4gICAgICAgICgkc3BhbiA9ICRwaWxsLmZpbmQoJ3NwYW4nKSkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ3RydWUnXG4gICAgICAgICMgaWYgcHJlZml4IHN0eWxlIHBpbGxcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgJ3R0Ym94LXBpbGwtcHJlZml4JyBpZiB0cmlnLnByZWZpeFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0cmlnLmNsYXNzTmFtZSBpZiB0cmlnLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLmNsYXNzTmFtZSBpZiB0eXBlLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hdHRyICdkYXRhLXR5cGUnLCB0eXBlLm5hbWVcblxuICAgICAgICAjIGdlbmVyYXRlIGlkIHRvIGFzc29jaWF0ZSB3aXRoIG1lbSBzdHJ1Y3R1cmVcbiAgICAgICAgaWQgPSBcInR0Ym94cGlsbCN7RGF0ZS5ub3coKX1cIlxuICAgICAgICAkcGlsbC5hdHRyICdpZCcsIGlkXG4gICAgICAgICMgcmVwbGFjZSBjb250ZW50cyB3aXRoIHBpbGxcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlICRwaWxsWzBdXG4gICAgICAgICMgcmVtb3ZlIHBpbGwgZnJvbSBET00sIHdoaWNoIGluIHR1cm4gcmVtb3ZlcyBpdCBjb21wbGV0ZWx5XG4gICAgICAgIHJlbW92ZSA9IC0+XG4gICAgICAgICAgICAkcGlsbC5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxyZW1vdmUnLCB7cGlsbH1cbiAgICAgICAgIyB3aXJlIHVwIGNsb3NlIGJ1dHRvblxuICAgICAgICAkcGlsbC5maW5kKCcudHRib3gtcGlsbC1jbG9zZScpLm9uICdjbGljaycsIHJlbW92ZVxuICAgICAgICAjIGZvcm1hdCB0aGUgdGV4dCB1c2luZyB0aGUgdHlwZSBmb3JtYXR0ZXJcbiAgICAgICAgZm9ybWF0ID0gLT4gJHNwYW4udGV4dCB0eXBlLmZvcm1hdCAkc3Bhbi50ZXh0KClcbiAgICAgICAgIyBtYXliZSBydW4gZm9ybWF0IG9uIGZvY3Vzb3V0XG4gICAgICAgICRwaWxsLm9uICdmb2N1c291dCcsIC0+XG4gICAgICAgICAgICAjIGRpc3BhdGNoIGxhdGVyIHRvIGFsbG93IGZvciBjbGljayBvbiBzdWdnZXN0XG4gICAgICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKVxuICAgICAgICAgICAgZm9ybWF0KCkgaWYgcGlsbC5pdGVtPy5fdGV4dFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxmb2N1c291dCcsIHtwaWxsfVxuICAgICAgICAjIGhlbHBlciBmdW5jdGlvbiB0byBzY29sbCBwaWxsIGludG8gdmlld1xuICAgICAgICBzY3JvbGxJbiA9IC0+XG4gICAgICAgICAgICAkcGlsbC5hZnRlciAkdCA9ICQoJzxzcGFuIHN0eWxlPVwid2lkdGg6MXB4XCI+JylcbiAgICAgICAgICAgIHNjbGVmdCA9ICR0LmNsb3Nlc3QoJy50dGJveC1vdmVyZmxvdycpLnNjcm9sbExlZnQoKVxuICAgICAgICAgICAgcG9zID0gJHQucG9zaXRpb24oKVxuICAgICAgICAgICAgJHQuY2xvc2VzdCgnLnR0Ym94LW92ZXJmbG93Jykuc2Nyb2xsTGVmdCBwb3MubGVmdCArIHNjbGVmdFxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNpYiA9ICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsIHNpYiBpZiBzaWJcbiAgICAgICAgICAgICAgICBza2lwWnduaiAkZWxbMF0sICsxICMgRkYgc2hvd3Mgbm8gY3Vyc29yIGlmIHdlIHN0YW5kIG9uIDBcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuaXRlbSA9IHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICB0aWR5KClcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiB0aWR5XG5cbiAgICAjIHJhbmdlIGZvciBsYXN0IGlucHV0IGVsZW1lbnRcbiAgICByYW5nZWxhc3Q6IC0+XG4gICAgICAgIHRpZHkoKVxuICAgICAgICBucyA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzXG4gICAgICAgIG4gPSBuc1tucy5sZW5ndGgtMl1cbiAgICAgICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHIuc2V0U3RhcnQgbiwgbi5ub2RlVmFsdWUubGVuZ3RoXG4gICAgICAgIHIuc2V0RW5kIG4sIG4ubm9kZVZhbHVlLmxlbmd0aFxuICAgICAgICByZXR1cm4gclxuXG4gICAgc2V0UGxhY2Vob2xkZXI6ICh0eHQpIC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGxhY2Vob2xkZXInKS50ZXh0IHR4dFxuXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IChzaG93KSAtPlxuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBsYWNlaG9sZGVyJykudG9nZ2xlIHNob3cgYW5kICghaXNJRSBvciBJRVZlciA+PSAxMSlcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=
