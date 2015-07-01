(function() {
  var I, Trigger, Type, appendAfter, appendBefore, cursor, def, doc, entireTextAtCursor, filter, filterA0, filterZwnj, find, findInRange, firstIsWhite, glob, hexdump, hold, isChrome, isIE, isParent, last, lastIsWhite, later, merge, rangeStr, setCursorEl, setCursorPos, skipZwnj, suggestHtml, toHtml, toText, ttbox, wordRangeAtCursor, zwnj,
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

  isIE = glob.navigator.userAgent.indexOf('MSIE') > 0;

  isChrome = glob.navigator.userAgent.indexOf('Chrome') > 0;

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
    styles = ".ttbox * { box-sizing: border-box; width: auto; } .ttbox { position: relative; box-sizing: border-box; } .ttbox dfn { font-style: normal; display: inline-block; margin: 0; padding: 0; } .ttbox-overflow { /* border: 1px solid #bbb; */ /* border-radius: 3px; */ overflow-x: auto; overflow-y: hidden; } .ttbox-overflow::-webkit-scrollbar { display: none; } .ttbox-showing-suggest .ttbox-overflow { border-bottom-left-radius: 0; border-bottom-right-radius: 0; } .ttbox-input { padding-left: 4px; white-space: nowrap; outline: none; } .ttbox-input * { outline: none; } .ttbox-input * { display: inline-block; white-space: nowrap; } .ttbox-input br { display: inline; } .ttbox-sug-overflow { position: absolute; left: 0; /* border: 1px solid #bbb; */ /* border-radius: 3px; */ border-top: none; border-top-left-radius: 0; border-top-right-radius: 0; border-top: none; box-shadow: 0 2px 2px rgba(0,0,0,0.3); max-height: 300px; overflow-x: hidden; overflow-y: auto; } .ttbox-suggest { min-height: 5px; background: white; line-height: 38px; } .ttbox-suggest > .ttbox-suggest-item:first-child { padding-top: 5px; } .ttbox-suggest > .ttbox-suggest-item:last-child { padding-bottom: 5px; } .ttbox-suggest-item { cursor: pointer; padding: 0 10px 0 25px; } .ttbox-suggest-item dfn { min-width: 70px; position: relative; } .ttbox-suggest-item span { color: #ccc; } .ttbox-suggest-divider { position: relative; padding: 0 10px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-suggest-divider span { position: relative; z-index: 1; background: white; color: #929292; padding-right: 20px; cursor: default; } .ttbox-suggest-divider hr { position: absolute; margin-top: 1.15em; left: 20px; right: 10px; border-top: 1px solid #ddd; border-bottom: none; } .ttbox-selected { background: #eee; } .ttbox-pill { position: relative; line-height: 24px; margin: 0 4px; background: #5cb85c; border: 1px solid #58b658; border-radius: 3px; padding: 0 12px; color: white; min-width: 30px; } .ttbox-pill dfn { padding: 0 3px 0 14px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; cursor: default; } .ttbox-pill-prefix dfn { padding-right: 0; display: block; } .ttbox-pill-close { display: inline-block; position: absolute; top: 0; left: 0; padding: 0 5px; line-height: 22px; height: 24px; border-right: 1px solid rgba(255,255,255,0.2); cursor: pointer; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-pill span { min-width: 5px; }";
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
      var j, len1, ref, t;
      this.symbol = symbol1;
      merge(this, opts);
      this.types = Array.isArray(types) ? types : [types];
      ref = this.types;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        t = ref[j];
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
    var len, r, ref, ref1, ref2, t;
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
    len = (ref = (ref1 = t.endContainer) != null ? (ref2 = ref1.nodeValue) != null ? ref2.length : void 0 : void 0) != null ? ref : 0;
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
    var i, j, max, ref, ref1, ref2, ref3, ref4, t;
    t = r.cloneRange();
    max = ((ref = (ref1 = t.endContainer) != null ? (ref2 = ref1.nodeValue) != null ? ref2.length : void 0 : void 0) != null ? ref : 0) - 1;
    for (i = j = ref3 = t.startOffset, ref4 = max; j <= ref4; i = j += 1) {
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
    t = doc.createRange();
    t.setStart(r.startContainer, pos);
    t.setEnd(r.endContainer, pos);
    sel = doc.getSelection();
    sel.removeAllRanges();
    return sel.addRange(t);
  };

  setCursorEl = function(el) {
    var r;
    r = doc.createRange();
    r.selectNodeContents(el);
    return setCursorPos(r, 0);
  };

  ttbox = function() {
    var dispatch, draw, el, façade, handlepill, handlers, handletypes, pilljump, render, setSugmover, stopsug, sugmover, sugselect, sugword, trigs, typesuggest, update;
    el = arguments[0], trigs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    render = ttbox.render();
    el = render.init(el);
    if (el.tagName !== 'DIV') {
      throw new Error('Need a DIV');
    }
    façade = {
      values: render.values,
      addpill: function(type, item) {
        render.focus();
        return render.pillify(cursor(el), type, item, dispatch);
      },
      clear: function() {
        render.clear();
        return update();
      },
      focus: function() {
        return render.focus();
      },
      placeholder: function(txt) {}
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
    update = hold(3, function(char) {
      var _, r, ref, trig, typename, types, value, word;
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
      ref = trig.re.exec(word), _ = ref[0], typename = ref[1], value = ref[2];
      types = trig.types.filter(function(t) {
        var ref1;
        return trig.prefix || ((ref1 = t.name) != null ? ref1.indexOf(typename) : void 0) === 0;
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
    el.addEventListener('ttbox:pillremove', stopsug);
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
      var fnvals, pill, r, ref, ref1, selectItem, word;
      if (!(r = entireTextAtCursor(el))) {
        return;
      }
      if (!(pill = render.pillfor((ref = r.startContainer) != null ? ref.parentNode : void 0))) {
        return;
      }
      if (typeof ((ref1 = pill.type) != null ? ref1.suggest : void 0) !== 'function') {
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
      var pill, r, ref;
      if (!(r = cursor(el))) {
        return;
      }
      if (!(pill = render.pillfor((ref = r.startContainer) != null ? ref.parentNode : void 0))) {
        return;
      }
      stopsug();
      pill.setCursorAfter();
      return true;
    };
    handlers = {
      keydown: function(e) {
        var ref, ref1;
        render.tidy();
        if (e.keyCode === 13) {
          e.preventDefault();
          if (typeof sugselect === "function" ? sugselect() : void 0) {
            return;
          }
          if (pilljump()) {
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
        if ((ref = e.keyCode) === 37 || ref === 8) {
          skipZwnj(-1, e.shiftKey);
        } else if ((ref1 = e.keyCode) === 39 || ref1 === 46) {
          skipZwnj(+1, e.shiftKey);
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
    var high, ref, unhigh;
    if (desc == null) {
      desc = '';
    }
    if (!name) {
      return '<div></div>';
    }
    ref = name.indexOf(word) === 0 ? [word, name.slice(word.length)] : ["", name], high = ref[0], unhigh = ref[1];
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
      var $, $box, $el, ensureItems, html, pillfor, pills, suggest, tidypills, unsuggest;
      $ = null;
      $el = null;
      $box = function() {
        return $el.find('.ttbox');
      };
      html = '<div class="ttbox"><div class="ttbox-overflow">' + '<div class="ttbox-input" contenteditable="true"></div></div></div>';
      suggest = '<div class="ttbox-sug-overflow"><div class="ttbox-suggest"></div></div>';
      pills = {};
      tidypills = hold(5000, function() {
        var id, j, len1, present, ref;
        present = $el.find('.ttbox-pill').map(function() {
          return $(this).attr('id');
        }).toArray();
        ref = Object.keys(pills);
        for (j = 0, len1 = ref.length; j < len1; j++) {
          id = ref[j];
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
          return this.tidy();
        },
        focus: function() {
          if (cursor($el[0])) {
            return;
          }
          return $el.find('.ttbox-input').focus();
        },
        values: function() {
          ensureItems();
          return Array.prototype.slice.call($el.find('.ttbox-input')[0].childNodes).map(function(n) {
            var ref;
            if (n.nodeType === 1 && (n != null ? (ref = n.className) != null ? ref.indexOf('ttbox-pill') : void 0 : void 0) >= 0) {
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
            $overflw.width($box().outerWidth());
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
              var $sel, ref;
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
              if ((ref = $sel[0]) != null) {
                ref.scrollIntoView();
              }
              return selectcb(nodivid[idx]);
            })(false);
            $sug.on('mousedown', function(ev) {
              var $it, i;
              ev.stopPropagation();
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
            var ref;
            pill.ensureItem();
            if ((ref = pill.item) != null ? ref._text : void 0) {
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
              var ref;
              scrollIn();
              return setCursorEl((ref = $pill[0]) != null ? ref.nextSibling : void 0);
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
          if (item) {
            pill.setItem(item);
          } else {
            later(function() {
              return pill.setCursorIn();
            });
          }
          $pill[0].scrollIntoView();
          this.tidy();
          dispatch('pilladd', {
            pill: pill
          });
          return pill;
        },
        pillfor: pillfor,
        tidy: function() {
          var $inp, childs, cs, first, i, inp, isText, j, len1, n, paren, pill, r, ref, ref1, ref2, ref3, tag;
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
          if ((first != null ? first.nodeType : void 0) !== 3 || (first != null ? (ref = first.nodeValue) != null ? ref[0] : void 0 : void 0) !== zwnj) {
            $inp[0].insertBefore(doc.createTextNode(zwnj), first);
          }
          for (j = 0, len1 = childs.length; j < len1; j++) {
            n = childs[j];
            if ((n != null ? n.nodeType : void 0) === 1 && (n != null ? (ref1 = n.nextSibling) != null ? ref1.nodeType : void 0 : void 0) === 1) {
              appendAfter(n, doc.createTextNode(zwnj));
            }
          }
          if (r = cursor($el[0])) {
            if ((r.startContainer === inp || r.endContainer === inp) && isChrome) {
              cs = Array.prototype.slice.call(childs);
              isText = function(n) {
                if ((n != null ? n.nodeType : void 0) === 3) {
                  return n;
                } else {
                  return null;
                }
              };
              i = r.startOffset;
              n = (ref2 = (ref3 = isText(cs[i])) != null ? ref3 : isText(cs[i + 1])) != null ? ref2 : isText(cs[i - 1]);
              if (n) {
                setCursorPos(r);
              }
            }
            paren = r.startContainer.parentNode;
            if ((paren != null ? paren.nodeName : void 0) !== 'SPAN' && (pill = pillfor(paren))) {
              pill.setCursorIn();
            }
          }
          $el.find('.ttbox-pill span span').remove();
          tidypills();
          return null;
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

//# sourceMappingURL=data:application/json;base64,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TUFFSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixVQUFqQixJQUFnQyxNQUFNLENBQUMsR0FBMUM7SUFDRCxNQUFBLENBQU8sU0FBQTthQUFHO0lBQUgsQ0FBUCxFQURDO0dBQUEsTUFBQTtJQUdELElBQUksQ0FBQyxLQUFMLEdBQWEsTUFIWjs7QUE5eUJMIiwiZmlsZSI6InR0Ym94LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZ2xvYiA9IGdsb2JhbCA/IHdpbmRvd1xuXG5kb2MgICA9IGdsb2IuZG9jdW1lbnRcbkkgICAgID0gKGEpIC0+IGFcbm1lcmdlID0gKHQsIG9zLi4uKSAtPiB0W2tdID0gdiBmb3Igayx2IG9mIG8gd2hlbiB2ICE9IHVuZGVmaW5lZCBmb3IgbyBpbiBvczsgdFxubGF0ZXIgPSAoZm4pIC0+IHNldFRpbWVvdXQgZm4sIDFcbmhvbGQgID0gKG1zLCBmKSAtPiBsYXN0ID0gMDsgdGltID0gbnVsbDsgKGFzLi4uKSAtPlxuICAgIGNsZWFyVGltZW91dCB0aW0gaWYgdGltXG4gICAgdGltID0gc2V0VGltZW91dCAoLT5mIGFzLi4uKSwgbXNcbmxhc3QgID0gKGFzKSAtPiBhcz9bYXMubGVuZ3RoIC0gMV1cbmZpbmQgID0gKGFzLCBmbikgLT4gcmV0dXJuIGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKVxuXG5pc0lFICAgICAgPSBnbG9iLm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRScpID4gMFxuaXNDaHJvbWUgID0gZ2xvYi5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gMFxuXG4jIGRlZmluZSBhbiBpbnZpc2libGUgcHJvcGVydHlcbmRlZiA9IChvYmosIHByb3BzKSAtPiBmb3IgbmFtZSwgdmFsdWUgb2YgcHJvcHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqLCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIG51bGxcblxuenduaiAgICAgICAgID0gXCLigItcIiAjICZ6d25qO1xuZmlsdGVyQTAgICAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MDBhMC9nLCAnICcgIyBuYnNwXG5maWx0ZXJad25qICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUyMDBiL2csICcnXG5maWx0ZXIgICAgICAgPSAocykgLT4gZmlsdGVyQTAgZmlsdGVyWnduaiBzXG5hcHBlbmRBZnRlciAgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsLm5leHRTaWJsaW5nKVxuYXBwZW5kQmVmb3JlID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbClcbmhleGR1bXAgICAgICA9IChzKSAtPiAoYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSBmb3IgYyBpbiBzKS5qb2luKCcgJylcblxuIyBpbmplY3QgY3NzXG5kbyAtPlxuICAgIHN0eWxlcyA9IFwiXG4udHRib3ggKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB3aWR0aDogYXV0bztcbn1cblxuLnR0Ym94IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbi50dGJveCBkZm4ge1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG59XG5cbi50dGJveC1vdmVyZmxvdyB7XG4gICAgLyogYm9yZGVyOiAxcHggc29saWQgI2JiYjsgKi9cbiAgICAvKiBib3JkZXItcmFkaXVzOiAzcHg7ICovXG4gICAgb3ZlcmZsb3cteDogYXV0bztcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG4udHRib3gtb3ZlcmZsb3c6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuLnR0Ym94LXNob3dpbmctc3VnZ2VzdCAudHRib3gtb3ZlcmZsb3cge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG5cbi50dGJveC1pbnB1dCB7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuLnR0Ym94LWlucHV0ICoge1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG5cbi50dGJveC1pbnB1dCAqIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1pbnB1dCBiciB7XG4gICAgZGlzcGxheTogaW5saW5lO1xufVxuXG4udHRib3gtc3VnLW92ZXJmbG93IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICAvKiBib3JkZXI6IDFweCBzb2xpZCAjYmJiOyAqL1xuICAgIC8qIGJvcmRlci1yYWRpdXM6IDNweDsgKi9cbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3gtc2hhZG93OiAwIDJweCAycHggcmdiYSgwLDAsMCwwLjMpO1xuICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLnR0Ym94LXN1Z2dlc3Qge1xuICAgIG1pbi1oZWlnaHQ6IDVweDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBsaW5lLWhlaWdodDogMzhweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpmaXJzdC1jaGlsZCB7XG4gICAgcGFkZGluZy10b3A6IDVweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDAgMTBweCAwIDI1cHg7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIGRmbiB7XG4gICAgbWluLXdpZHRoOiA3MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gc3BhbiB7XG4gICAgY29sb3I6ICNjY2M7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHNwYW4ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGNvbG9yOiAjOTI5MjkyO1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBociB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG1hcmdpbi10b3A6IDEuMTVlbTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4udHRib3gtc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi50dGJveC1waWxsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gICAgbWFyZ2luOiAwIDRweDtcbiAgICBiYWNrZ3JvdW5kOiAjNWNiODVjO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICM1OGI2NTg7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWluLXdpZHRoOiAzMHB4O1xufVxuLnR0Ym94LXBpbGwgZGZuIHtcbiAgICBwYWRkaW5nOiAwIDNweCAwIDE0cHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtcGlsbC1wcmVmaXggZGZuIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuLnR0Ym94LXBpbGwtY2xvc2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcGFkZGluZzogMCA1cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1waWxsIHNwYW4ge1xuICAgIG1pbi13aWR0aDogNXB4O1xufVxuXCJcbiAgICBjc3MgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIGNzcy50eXBlID0gJ3RleHQvY3NzJ1xuICAgIGNzcy5pbm5lckhUTUwgPSBzdHlsZXNcbiAgICBkb2MuaGVhZC5hcHBlbmRDaGlsZCBjc3NcblxuY2xhc3MgVHlwZSB0aGVuIGNvbnN0cnVjdG9yOiAoQG5hbWUsIG9wdHMpIC0+IG1lcmdlIEAsIHtmb3JtYXQ6SX0sIG9wdHNcbmNsYXNzIFRyaWdnZXIgdGhlbiBjb25zdHJ1Y3RvcjogKEBzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIG1lcmdlIEAsIG9wdHNcbiAgICBAdHlwZXMgPSBpZiBBcnJheS5pc0FycmF5IHR5cGVzIHRoZW4gdHlwZXMgZWxzZSBbdHlwZXNdXG4gICAgIyBzZXQgYmFjayByZWZlcmVuY2VcbiAgICB0LnRyaWcgPSB0aGlzIGZvciB0IGluIEB0eXBlc1xuICAgIGlmIEBwcmVmaXhcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudCBoYXZlIG11bHRpcGxlIHR5cGVzIHdpdGggcHJlZml4IHRyaWdnZXJcIikgaWYgQHR5cGVzLmxlbmd0aCA+IDFcbiAgICAgICAgQHJlID0gUmVnRXhwIFwiXigpXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuICAgIGVsc2VcbiAgICAgICAgQHJlID0gUmVnRXhwIFwiXihcXFxcdyopXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuXG4jIFNraXAgenduaiBjaGFycyB3aGVuIG1vdmluZyBsZWZ0L3JpZ2h0XG5za2lwWnduaiA9IChwZWwsIGQsIGVuZCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IocGVsKVxuICAgIG4gPSBpZiBlbmQgdGhlbiByLmVuZENvbnRhaW5lciBlbHNlIHIuc3RhcnRDb250YWluZXJcbiAgICBpID0gaWYgZW5kIHRoZW4gci5lbmRPZmZzZXQgZWxzZSByLnN0YXJ0T2Zmc2V0XG4gICAgcmV0dXJuIHVubGVzcyBuLm5vZGVUeXBlID09IDNcbiAgICBjID0gbi5ub2RlVmFsdWUuY2hhckNvZGVBdCAoaWYgZCA8IDAgdGhlbiBpICsgZCBlbHNlIGkpXG4gICAgaWYgYyA9PSA4MjAzXG4gICAgICAgICMgbW92ZVxuICAgICAgICBzZXRDdXJzb3JQb3MgciwgaSArIGRcbiAgICAgICAgc2tpcFp3bmogZCwgZW5kICMgYW5kIG1heWJlIGNvbnRpbnVlIG1vdmluZz9cblxuaXNQYXJlbnQgPSAocG4sIG4pIC0+XG4gICAgaWYgbiA9PSBudWxsIHRoZW4gZmFsc2UgZWxzZSBpZiBwbiA9PSBuIHRoZW4gdHJ1ZSBlbHNlIGlzUGFyZW50KHBuLCBuLnBhcmVudE5vZGUpXG5cbiMgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbmN1cnNvciA9IChwZWwpIC0+XG4gICAgcyA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHJldHVybiB1bmxlc3Mgcy5yYW5nZUNvdW50XG4gICAgciA9IHMuZ2V0UmFuZ2VBdCgwKVxuICAgIGlmIGlzUGFyZW50KHBlbCwgci5zdGFydENvbnRhaW5lcikgdGhlbiByIGVsc2UgbnVsbFxuXG4jIGZpbHRlciB0aGUgcmFuZ2UgdG8gZ2V0IHJpZCBvZiB1bndhbnRlZCBjaGFyc1xucmFuZ2VTdHIgPSAocikgLT4gZmlsdGVyIHIudG9TdHJpbmcoKVxuXG5maXJzdElzV2hpdGUgPSAocykgLT4gL15cXHMuKi8udGVzdChzID8gJycpXG5sYXN0SXNXaGl0ZSAgPSAocykgLT4gLy4qXFxzJC8udGVzdChzID8gJycpXG5cbndvcmRSYW5nZUF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgIyBleHBhbmQgYmVnaW5uaW5nXG4gICAgd2hpbGUgdC5zdGFydE9mZnNldCA+IDAgYW5kIG5vdCBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgLSAxXG4gICAgIyBvbmUgZm9yd2FyZCBhZ2FpblxuICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCArIDEgaWYgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAjIGV4cGFuZCBlbmRcbiAgICBsZW4gPSB0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwXG4gICAgd2hpbGUgdC5lbmRPZmZzZXQgPCBsZW4gYW5kIG5vdCBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCArIDFcbiAgICAjIG9uZSBiYWNrIGFnYWluXG4gICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0IC0gMSBpZiBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgcmV0dXJuIHRcblxuZW50aXJlVGV4dEF0Q3Vyc29yID0gKHBlbCkgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgdC5zZWxlY3ROb2RlQ29udGVudHMgdC5zdGFydENvbnRhaW5lclxuICAgIHJldHVybiB0XG5cbmZpbmRJblJhbmdlID0gKHIsIGNoYXIpIC0+XG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgbWF4ID0gKHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDApIC0gMVxuICAgIGZvciBpIGluIFt0LnN0YXJ0T2Zmc2V0Li5tYXhdIGJ5IDFcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCBpXG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCBpICsgMVxuICAgICAgICByZXR1cm4gaSBpZiB0LnRvU3RyaW5nKCkgPT0gY2hhclxuICAgIHJldHVybiAtMVxuXG5zZXRDdXJzb3JQb3MgPSAociwgcG9zKSAtPlxuICAgIHQgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHQuc2V0U3RhcnQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgdC5zZXRFbmQgci5lbmRDb250YWluZXIsIHBvc1xuICAgIHNlbCA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgIHNlbC5hZGRSYW5nZSB0XG5cbnNldEN1cnNvckVsID0gKGVsKSAtPlxuICAgIHIgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHIuc2VsZWN0Tm9kZUNvbnRlbnRzIGVsXG4gICAgc2V0Q3Vyc29yUG9zIHIsIDBcblxuIyBGdW5jdGlvbiB0byBtYWtlIHR0Ym94IG91dCBvZiBhbiBlbGVtZW50IHdpdGggdHJpZ2dlcnNcbiNcbnR0Ym94ID0gKGVsLCB0cmlncy4uLikgLT5cblxuICAgICMgbG9jYWwgcmVmZXJlbmNlIHRvIHJlbmRlciBwbHVnXG4gICAgcmVuZGVyID0gdHRib3gucmVuZGVyKClcblxuICAgICMgbGV0IHJlbmRlciBkZWNpZGUgd2UgaGF2ZSBhIGdvb2QgZWxcbiAgICBlbCA9IHJlbmRlci5pbml0KGVsKVxuXG4gICAgIyBhbmQgY2hlY2sgd2UgZ290IGEgZ29vZCB0aGluZyBiYWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgRElWJykgdW5sZXNzIGVsLnRhZ05hbWUgPT0gJ0RJVidcblxuICAgICMgZXhwb3NlZCBvcGVyYXRpb25zXG4gICAgZmHDp2FkZSA9IHtcbiAgICAgICAgdmFsdWVzOiByZW5kZXIudmFsdWVzXG4gICAgICAgIGFkZHBpbGw6ICh0eXBlLCBpdGVtKSAtPlxuICAgICAgICAgICAgcmVuZGVyLmZvY3VzKClcbiAgICAgICAgICAgIHJlbmRlci5waWxsaWZ5IGN1cnNvcihlbCksIHR5cGUsIGl0ZW0sIGRpc3BhdGNoXG4gICAgICAgIGNsZWFyOiAtPlxuICAgICAgICAgICAgcmVuZGVyLmNsZWFyKClcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIGZvY3VzOiAtPiByZW5kZXIuZm9jdXMoKVxuICAgICAgICBwbGFjZWhvbGRlcjogKHR4dCkgLT4gIyBYWFggZml4bWVcblxuICAgIH1cblxuICAgICMgZGlzcGF0Y2ggZXZlbnRzIG9uIGluY29taW5nIGRpdlxuICAgIGRpc3BhdGNoID0gKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQgJ0V2ZW50J1xuICAgICAgICBtZXJnZSBlLCBvcHRzLCB7dHRib3g6ZmHDp2FkZX1cbiAgICAgICAgZS5pbml0RXZlbnQgXCJ0dGJveDoje25hbWV9XCIsIHRydWUsIGZhbHNlXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQgZVxuXG4gICAgdXBkYXRlID0gaG9sZCAzLCAoY2hhcikgLT5cbiAgICAgICAgIyBhIHBpbGwgZWRpdCB0cnVtZnMgYWxsXG4gICAgICAgIHJldHVybiBpZiBoYW5kbGVwaWxsKClcbiAgICAgICAgIyBjdXJzb3IgcmFuZ2UgZm9yIHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKGVsKVxuICAgICAgICAjIFhYWCBvcHRpbWl6ZSB3aXRoIGJlbG93P1xuICAgICAgICB1bmxlc3MgclxuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGEgdHJpZ2dlciBpbiB0aGUgd29yZD9cbiAgICAgICAgdHJpZyA9IGZpbmQgdHJpZ3MsICh0KSAtPiB0LnJlLnRlc3Qgd29yZFxuICAgICAgICAjIG5vIHRyaWdnZXIgZm91bmQgaW4gY3VycmVudCB3b3JkLCBhYm9ydFxuICAgICAgICB1bmxlc3MgdHJpZ1xuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICMgZXhlYyB0cmlnZ2VyIHRvIGdldCBwYXJ0c1xuICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICMgZmluZCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICB0eXBlcyA9IHRyaWcudHlwZXMuZmlsdGVyICh0KSAtPiB0cmlnLnByZWZpeCBvciB0Lm5hbWU/LmluZGV4T2YodHlwZW5hbWUpID09IDBcbiAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgaGFuZGxldHlwZXMgciwgdHJpZywgdHlwZXMsIGNoYXJcblxuICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICBzZXRTdWdtb3ZlciA9IChfc3VnbW92ZXIpIC0+IHN1Z21vdmVyID0gX3N1Z21vdmVyXG4gICAgc3RvcHN1ZyA9IC0+XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICAgICAgcmVuZGVyLnVuc3VnZ2VzdCgpXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0c3RvcCdcblxuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGxzIGxlYXZlXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbHJlbW92ZScsIHN0b3BzdWdcbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxsIGxvc2UgZm9jdXNcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxsZm9jdXNvdXQnLCBzdG9wc3VnXG5cbiAgICBoYW5kbGV0eXBlcyA9IChyYW5nZSwgdHJpZywgdHlwZXMsIGNoYXIpIC0+XG4gICAgICAgICMgdGhlIHRyaWdnZXIgcG9zaXRpb24gaW4gdGhlIHdvcmQgcmFuZ2VcbiAgICAgICAgdHBvcyA9IGZpbmRJblJhbmdlIHJhbmdlLCB0cmlnLnN5bWJvbFxuICAgICAgICAjIG5vIHRwb3M/IVxuICAgICAgICByZXR1cm4gaWYgdHBvcyA8IDBcbiAgICAgICAgIyByYW5nZSBmb3IgdHlwZSBuYW1lICh3aGljaCBtYXkgbm90IGJlIHRoZSBlbnRpcmUgbmFtZSlcbiAgICAgICAgdHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgIHRyYW5nZS5zZXRFbmQgdHJhbmdlLmVuZENvbnRhaW5lciwgdHBvc1xuICAgICAgICAjIHdoZXRoZXIgdGhlIGxhc3QgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyXG4gICAgICAgIHdhc3RyaWcgPSBjaGFyID09IHRyaWcuc3ltYm9sXG4gICAgICAgICMgaGVscGVyIHdoZW4gZmluaXNoZWQgc2VsZWN0aW5nIGEgdHlwZVxuICAgICAgICBzZWxlY3RUeXBlID0gKHR5cGUpIC0+XG4gICAgICAgICAgICByZW5kZXIucGlsbGlmeSByYW5nZSwgdHlwZSwgbnVsbCwgZGlzcGF0Y2hcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzZWxlY3QnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgaWYgdHlwZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBlbHNlIGlmIHR5cGVzLmxlbmd0aCA9PSAxIGFuZCBub3Qgc3VnbW92ZXJcbiAgICAgICAgICAgICMgb25lIHBvc3NpYmxlIHNvbHV0aW9uXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBmb3IgdHJpZ2dlciBjaGFyLCB3ZSBzZWxlY3QgdGhlIGZpcnN0IHR5cGUgc3RyYWlnaHQgYXdheVxuICAgICAgICAgICAgICAgIHNlbGVjdFR5cGUgZmluZCB0eXBlcywgKHQpIC0+ICF0LmRpdmlkZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyB3aGVuIHRoZSBrZXkgaW5wdXQgd2FzIHRoZSB0cmlnZ2VyIGFuZCB0aGVyZSBhcmVcbiAgICAgICAgICAgICMgbXVsdGlwbGUgcG9zc2libGUgdmFsdWVzLCBwb3NpdGlvbi4gbW92ZSB0byBqdXN0IGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgdHJpZ2dlciBjaGFyLlxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgbW92ZSB0aGUgY3Vyc29yIHRvIGFsbG93IGZvciBzdWdnZXN0IGlucHV0XG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHJhbmdlLCB0cG9zXG4gICAgICAgICAgICAjIHN0YXJ0IGEgc3VnZ2VzdCBmb3IgY3VycmVudCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICAgICAgdHlwZXN1Z2dlc3QgdHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlc1xuXG5cbiAgICAjIHN1Z2dlc3QgZm9yIGdpdmVuIHR5cGVzXG4gICAgdHlwZXN1Z2dlc3QgPSAocmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGRvbnQgc3VnZ2VzdCBmb3Igc2FtZSB3b3JkXG4gICAgICAgIHJldHVybiB0cnVlIGlmIHN1Z3dvcmQgPT0gd29yZFxuICAgICAgICBzdWd3b3JkID0gd29yZFxuICAgICAgICAjIGhlbHBlciB0byBjcmVhdGUgc3Vnc2VsZWN0IGZ1bmN0aW9uc1xuICAgICAgICBzdWdzZWxlY3Rmb3IgPSAoaXRlbSkgLT4gLT5cbiAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgICAgICMgdGhlIHR5cGUgaXMgc2VsZWN0ZWRcbiAgICAgICAgICAgIHNlbGVjdFR5cGUgaXRlbVxuICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICMgZnVuY3Rpb24gdGhhdCBzdWdnZXN0IHR5cGVzXG4gICAgICAgIGZudHlwZXMgPSAoXywgY2IpIC0+IGNiIHR5cGVzXG4gICAgICAgICMgaWYgdGhlcmUgaXMgb25seSBvbmUsIHNldCBpdCBhcyBwb3NzaWJsZSBmb3IgcmV0dXJuIGtleVxuICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgdHlwZXNbMF0gaWYgdHlwZXMubGVuZ3RoID09IDFcbiAgICAgICAgIyByZW5kZXIgc3VnZ2VzdGlvbnNcbiAgICAgICAgcmVuZGVyLnN1Z2dlc3QgZm50eXBlcywgcmFuZ2UsIC0xLCBzZXRTdWdtb3ZlciwgKHR5cGUsIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIHR5cGVcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGUnLCB7dHJpZywgdHlwZX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdHR5cGVzJywge3RyaWcsIHR5cGVzfVxuXG4gICAgaGFuZGxlcGlsbCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGVudGlyZVRleHRBdEN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0eXBlb2YgcGlsbC50eXBlPy5zdWdnZXN0ID09ICdmdW5jdGlvbicgIyBkZWZpbml0ZWx5IGEgc3VnZ2VzdFxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgc3VnZ2VzdCBmdW5jdGlvbiBhcyBmbiB0byByZW5kZXIuc3VnZ2VzdFxuICAgICAgICBmbnZhbHMgPSAod29yZCwgY2IpIC0+IHBpbGwudHlwZS5zdWdnZXN0IHdvcmQsIGNiLCBwaWxsLnR5cGUsIHBpbGwudHJpZ1xuICAgICAgICAjIGhlbHBlciB3aGVuIHdlIGRlY2lkZSBvbiBhbiBpdGVtXG4gICAgICAgIHNlbGVjdEl0ZW0gPSAoaXRlbSkgLT5cbiAgICAgICAgICAgIHBpbGwuc2V0SXRlbSBpdGVtXG4gICAgICAgICAgICAjIGxhdGVyIHNpbmNlIGl0IG1heSBiZSBzZWxlY3QgZnJvbSBjbGljaywgd2hpY2ggaXMgbW91c2Vkb3duXG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXNlbGVjdCcsIHtwaWxsLCBpdGVtfVxuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnZhbHMsIHIsIC0xLCBzZXRTdWdtb3ZlciwgKGl0ZW0sIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gLT5cbiAgICAgICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgICAgICMgc2VsZWN0IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbSBpdGVtXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtJywge3BpbGwsIGl0ZW19XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGQgYWJvdXQgaXRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtcycsIHtwaWxsfVxuICAgICAgICByZXR1cm4gdHJ1ZSAjIHNpZ25hbCB3ZSBkZWFsdCB3aXRoIGl0XG5cbiAgICAjIG1vdmUgdGhlIGlucHV0IG91dCBvZiBhIHBpbGwgKGlmIHdlJ3JlIGluIGEgcGlsbClcbiAgICBwaWxsanVtcCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihlbClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICBoYW5kbGVycyA9XG4gICAgICAgIGtleWRvd246ICAoZSkgLT5cblxuICAgICAgICAgICAgIyB0aGlzIGRvZXMgYW4gaW1wb3J0YW50IGVsLm5vcm1hbGl6ZSgpIHRoYXQgZW5zdXJlcyB3ZSBoYXZlXG4gICAgICAgICAgICAjIGNvbnRpZ3VvdXMgdGV4dCBub2RlcywgY3J1Y2lhbCBmb3IgdGhlIHJhbmdlIGxvZ2ljLlxuICAgICAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMTNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBkb250IHdhbnQgRE9NIGNoYW5nZVxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBzdWdzZWxlY3Q/KClcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcGlsbGp1bXAoKVxuXG4gICAgICAgICAgICBpZiBzdWdtb3ZlclxuICAgICAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAzOCAgICAgICMgdXBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigtMSlcbiAgICAgICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSA9PSA0MCAjIGRvd25cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigrMSlcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlIGluIFszNywgOF1cbiAgICAgICAgICAgICAgICBza2lwWnduaiAtMSwgZS5zaGlmdEtleSAjIHNraXAgenduaiBiYWNrd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG4gICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSBpbiBbMzksIDQ2XVxuICAgICAgICAgICAgICAgIHNraXBad25qICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+PC9kaXY+J1xuICAgIHN1Z2dlc3QgPSAnPGRpdiBjbGFzcz1cInR0Ym94LXN1Zy1vdmVyZmxvd1wiPjxkaXYgY2xhc3M9XCJ0dGJveC1zdWdnZXN0XCI+PC9kaXY+PC9kaXY+J1xuICAgICMgY2FjaGUgb2YgcGlsbCA8cGlsbGlkLCBwaWxsPiBzdHJ1Y3R1cmVzXG4gICAgcGlsbHMgPSB7fVxuICAgICMgaGVscGVyIHRvIHRpZHkgY2FjaGVcbiAgICB0aWR5cGlsbHMgPSBob2xkIDUwMDAsIC0+XG4gICAgICAgIHByZXNlbnQgPSAkZWwuZmluZCgnLnR0Ym94LXBpbGwnKS5tYXAoLT4gJChAKS5hdHRyICdpZCcpLnRvQXJyYXkoKVxuICAgICAgICBkZWxldGUgcGlsbHNbaWRdIGZvciBpZCBpbiBPYmplY3Qua2V5cyhwaWxscykgd2hlbiBwcmVzZW50LmluZGV4T2YoaWQpIDwgMFxuICAgICAgICBudWxsXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgc3RydWN0dXJlIGZvciBhbiBlbGVtZW50XG4gICAgcGlsbGZvciA9IChlbCkgLT4gcGlsbHNbJChlbCkuY2xvc2VzdCgnLnR0Ym94LXBpbGwnKS5hdHRyKCdpZCcpXVxuICAgICMgZ28gdGhyb3VnaCBjYWNoZSBhbmQgZW5zdXJlIGFsbCBwaWxscyBoYXZlIHRoZSBpdGVtIHZhbHVlIG9mIHRoZVxuICAgICMgZWxlbWVudCB2YWx1ZS5cbiAgICBlbnN1cmVJdGVtcyA9IC0+XG4gICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpIGZvciBrLCBwaWxsIG9mIHBpbGxzXG4gICAgICAgIG51bGxcblxuICAgICMgaW5pdGlhbGlzZSBib3hcbiAgICBpbml0OiAoZWwpIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpZG4ndCBmaW5kIGpRdWVyeVwiKSB1bmxlc3MgJCA9IGpRdWVyeVxuICAgICAgICAkZWwgPSAkKGVsKVxuICAgICAgICAkZWxbMF1cblxuICAgICMgZHJhdyBzdHVmZiBhbmQgaG9vayB1cCBldmVudCBoYW5kbGVyc1xuICAgIGRyYXc6IChoYW5kbGVycykgLT5cbiAgICAgICAgJGVsLmh0bWwgaHRtbFxuICAgICAgICAkZWwub24oZXZlbnQsIGhhbmRsZXIpIGZvciBldmVudCwgaGFuZGxlciBvZiBoYW5kbGVyc1xuXG4gICAgIyBjbGVhciB0aGUgc3RhdGUgb2YgdGhlIGlucHV0XG4gICAgY2xlYXI6IC0+XG4gICAgICAgICRlbC5maW5kKCcudHRib3gtaW5wdXQnKS5lbXB0eSgpXG4gICAgICAgIEB0aWR5KClcblxuICAgICMgZm9jdXMgdGhlIGlucHV0IChpZiBpdCBkb2Vzbid0IGFscmVhZHkgaGF2ZSBmb2N1cylcbiAgICBmb2N1czogLT5cbiAgICAgICAgcmV0dXJuIGlmIGN1cnNvcigkZWxbMF0pICMgYWxyZWFkeSBoYXMgZm9jdXNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpLmZvY3VzKClcblxuICAgICMgcmV0dXJuIGFuIGFycmF5IG9mIHZhbHVlcyBmb3IgdGhlIGJveFxuICAgIHZhbHVlczogLT5cbiAgICAgICAgZW5zdXJlSXRlbXMoKVxuICAgICAgICBBcnJheTo6c2xpY2UuY2FsbCgkZWwuZmluZCgnLnR0Ym94LWlucHV0JylbMF0uY2hpbGROb2RlcykubWFwIChuKSAtPlxuICAgICAgICAgICAgaWYgbi5ub2RlVHlwZSA9PSAxIGFuZCBuPy5jbGFzc05hbWU/LmluZGV4T2YoJ3R0Ym94LXBpbGwnKSA+PSAwXG4gICAgICAgICAgICAgICAgcGlsbGZvciBuXG4gICAgICAgICAgICBlbHNlIGlmIG4ubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgICAgIGZpbHRlciBuLm5vZGVWYWx1ZVxuICAgICAgICAuZmlsdGVyIElcblxuICAgICMgcmVtb3ZlIHN1Z2dnZXN0XG4gICAgdW5zdWdnZXN0OiB1bnN1Z2dlc3QgPSAtPlxuICAgICAgICAkKCcudHRib3gtc3VnLW92ZXJmbG93JykucmVtb3ZlKClcbiAgICAgICAgJGJveCgpLnJlbW92ZUNsYXNzICd0dGJveC1zaG93aW5nLXN1Z2dlc3QnXG5cbiAgICAjIHN0YXJ0IHN1Z2dlc3RcbiAgICBzdWdnZXN0OiAoZm4sIHJhbmdlLCBpZHgsIG1vdmVjYiwgc2VsZWN0Y2IpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZmluZC9jcmVhdGUgc3VnZ2VzdC1ib3hcbiAgICAgICAgJHN1ZyA9ICQoJy50dGJveC1zdWdnZXN0JylcbiAgICAgICAgdW5sZXNzICRzdWcubGVuZ3RoXG4gICAgICAgICAgICAkb3ZlcmZsdyA9ICQoc3VnZ2VzdClcbiAgICAgICAgICAgICRzdWcgPSAkb3ZlcmZsdy5maW5kICcudHRib3gtc3VnZ2VzdCdcbiAgICAgICAgICAgICMgbG9jayB3aWR0aCB0byBwYXJlbnRcbiAgICAgICAgICAgICRvdmVyZmx3LndpZHRoICRib3goKS5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICMgYWRqdXN0IGZvciBib3JkZXIgb2YgcGFyZW50XG4gICAgICAgICAgICBib3JkID0gcGFyc2VJbnQgJGVsLmZpbmQoJy50dGJveC1vdmVyZmxvdycpLmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpXG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgdG9wOiRlbC5vdXRlckhlaWdodCgpIC0gYm9yZFxuICAgICAgICAgICAgIyBhcHBlbmQgdG8gYm94XG4gICAgICAgICAgICAkYm94KCkuYXBwZW5kICRvdmVyZmx3XG4gICAgICAgICAgICAjIGluZGljYXRlIHdlIGFyZSBzaG93aW5nXG4gICAgICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCcpXG4gICAgICAgICMgZW1wdHkgc3VnZ2VzdCBib3ggdG8gc3RhcnQgZnJlc2hcbiAgICAgICAgJHN1Zy5odG1sKCcnKTsgJHN1Zy5vZmYoKVxuICAgICAgICAjIGNsYXNzIHRvIGhvb2sgc3R5bGluZyB3aGVuIHN1Z2dlc3RpbmdcbiAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LXJlcXVlc3QnKVxuICAgICAgICAjIHJlcXVlc3QgdG8gZ2V0IHN1Z2dlc3QgZWxlbWVudHNcbiAgICAgICAgZm4gd29yZCwgKGxpc3QpIC0+XG4gICAgICAgICAgICAjIG5vdCByZXF1ZXN0aW5nIGFueW1vcmVcbiAgICAgICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc3VnZ2VzdC1yZXF1ZXN0J1xuICAgICAgICAgICAgIyBsb2NhbCB0b0h0bWwgd2l0aCB3b3JkXG4gICAgICAgICAgICBsb2NUb0h0bWwgPSB0b0h0bWwod29yZClcbiAgICAgICAgICAgICMgdHVybiBsaXN0IGludG8gaHRtbFxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoIChsKSAtPlxuICAgICAgICAgICAgICAgICRoID0gJChsb2NUb0h0bWwobCkpXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgaWYgbC5kaXZpZGVyXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWRpdmlkZXInXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1pdGVtJ1xuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGwuY2xhc3NOYW1lIGlmIGwuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgJHN1Zy5hcHBlbmQgJGhcbiAgICAgICAgICAgICMgbGlzdCB3aXRob3V0IGRpdmlkZXJzXG4gICAgICAgICAgICBub2RpdmlkID0gbGlzdC5maWx0ZXIgKGwpIC0+ICFsLmRpdmlkZXJcbiAgICAgICAgICAgIHByZXZpZHggPSBudWxsXG4gICAgICAgICAgICBkbyBzZWxlY3RJZHggPSAoZG9zdGFydCA9IGZhbHNlKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBpZHggPCAwIGFuZCAhZG9zdGFydFxuICAgICAgICAgICAgICAgIGlkeCA9IDAgaWYgaWR4IDwgMFxuICAgICAgICAgICAgICAgIGlkeCA9IG5vZGl2aWQubGVuZ3RoIC0gMSBpZiBpZHggPj0gbm9kaXZpZC5sZW5ndGhcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcHJldmlkeCA9PSBpZHhcbiAgICAgICAgICAgICAgICBwcmV2aWR4ID0gaWR4XG4gICAgICAgICAgICAgICAgJHN1Zy5maW5kKCcudHRib3gtc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWwgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuZXEoaWR4KVxuICAgICAgICAgICAgICAgICRzZWwuYWRkQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsWzBdPy5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpZHhdXG4gICAgICAgICAgICAjIGhhbmRsZSBjbGljayBvbiBhIHN1Z2dlc3QgaXRlbSwgbW91c2Vkb3duIHNpbmNlIGNsaWNrXG4gICAgICAgICAgICAjIHdpbGwgZmlnaHQgd2l0aCBmb2N1c291dCBvbiB0aGUgcGlsbFxuICAgICAgICAgICAgJHN1Zy5vbiAnbW91c2Vkb3duJywgKGV2KSAtPlxuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG4gICAgICAgICMgdGhlIHRyaWcgaXMgcmVhZCBmcm9tIHRoZSB0eXBlXG4gICAgICAgIHRyaWcgPSB0eXBlLnRyaWdcbiAgICAgICAgIyBjcmVhdGUgcGlsbCBodG1sXG4gICAgICAgIGRmbiA9IGlmIHRyaWdcbiAgICAgICAgICAgIGlmIHRyaWcucHJlZml4IHRoZW4gdHJpZy5zeW1ib2wgZWxzZSB0eXBlLm5hbWUgKyB0cmlnLnN5bWJvbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0eXBlLm5hbWVcbiAgICAgICAgJHBpbGwgPSAkKFwiPGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbFxcXCI+PGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbC1jbG9zZVxcXCI+w5c8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIjxkZm4+I3tkZm59PC9kZm4+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKVxuICAgICAgICAkcGlsbC5maW5kKCcqJykuYW5kU2VsZigpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZSdcbiAgICAgICAgKCRzcGFuID0gJHBpbGwuZmluZCgnc3BhbicpKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZSdcbiAgICAgICAgIyBpZiBwcmVmaXggc3R5bGUgcGlsbFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyAndHRib3gtcGlsbC1wcmVmaXgnIGlmIHR5cGUudHJpZy5wcmVmaXhcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS50cmlnLmNsYXNzTmFtZSBpZiB0eXBlLnRyaWcuY2xhc3NOYW1lXG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUuY2xhc3NOYW1lIGlmIHR5cGUuY2xhc3NOYW1lXG4gICAgICAgICMgZ2VuZXJhdGUgaWQgdG8gYXNzb2NpYXRlIHdpdGggbWVtIHN0cnVjdHVyZVxuICAgICAgICBpZCA9IFwidHRib3hwaWxsI3tEYXRlLm5vdygpfVwiXG4gICAgICAgICRwaWxsLmF0dHIgJ2lkJywgaWRcbiAgICAgICAgIyByZXBsYWNlIGNvbnRlbnRzIHdpdGggcGlsbFxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUgJHBpbGxbMF1cbiAgICAgICAgIyByZW1vdmUgcGlsbCBmcm9tIERPTSwgd2hpY2ggaW4gdHVybiByZW1vdmVzIGl0IGNvbXBsZXRlbHlcbiAgICAgICAgcmVtb3ZlID0gLT5cbiAgICAgICAgICAgICRwaWxsLnJlbW92ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbHJlbW92ZScsIHtwaWxsfVxuICAgICAgICAjIHdpcmUgdXAgY2xvc2UgYnV0dG9uXG4gICAgICAgICRwaWxsLmZpbmQoJy50dGJveC1waWxsLWNsb3NlJykub24gJ2NsaWNrJywgcmVtb3ZlXG4gICAgICAgICMgZm9ybWF0IHRoZSB0ZXh0IHVzaW5nIHRoZSB0eXBlIGZvcm1hdHRlclxuICAgICAgICBmb3JtYXQgPSAtPiAkc3Bhbi50ZXh0IHR5cGUuZm9ybWF0ICRzcGFuLnRleHQoKVxuICAgICAgICAjIG1heWJlIHJ1biBmb3JtYXQgb24gZm9jdXNvdXRcbiAgICAgICAgJHBpbGwub24gJ2ZvY3Vzb3V0JywgLT5cbiAgICAgICAgICAgICMgZGlzcGF0Y2ggbGF0ZXIgdG8gYWxsb3cgZm9yIGNsaWNrIG9uIHN1Z2dlc3RcbiAgICAgICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpXG4gICAgICAgICAgICBmb3JtYXQoKSBpZiBwaWxsLml0ZW0/Ll90ZXh0XG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbGZvY3Vzb3V0Jywge3BpbGx9XG4gICAgICAgICMgaGVscGVyIGZ1bmN0aW9uIHRvIHNjb2xsIHBpbGwgaW50byB2aWV3XG4gICAgICAgIHNjcm9sbEluID0gLT5cbiAgICAgICAgICAgICRwaWxsLmFmdGVyICR0ID0gJCgnPHNwYW4gc3R5bGU9XCJ3aWR0aDoxcHhcIj4nKVxuICAgICAgICAgICAgJHRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICB9XG4gICAgICAgIGRlZiBwaWxsLFxuICAgICAgICAgICAgIyBlbnN1cmUgdGhlIHRleHQgb2YgdGhlIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIEBpdGVtXG4gICAgICAgICAgICBlbnN1cmVJdGVtOiAtPlxuICAgICAgICAgICAgICAgIHN0eHQgPSAkc3Bhbi50ZXh0KCkudHJpbSgpXG4gICAgICAgICAgICAgICAgcHR4dCA9IHRvVGV4dCBwaWxsPy5pdGVtXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRJdGVtIHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAkcGlsbFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgIEB0aWR5KClcbiAgICAgICAgZGlzcGF0Y2ggJ3BpbGxhZGQnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHBpbGxcblxuICAgICMgcmV0dXJuIHRoZSBwaWxsIGZvciBlbGVtZW50XG4gICAgcGlsbGZvcjogcGlsbGZvclxuXG4gICAgIyBrZWVwIGlucHV0IGJveCB0aWR5IHdpdGggdmFyaW91cyBjb250ZW50ZWRpdGFibGUgYnVnIGNvcnJlY3Rpb25zXG4gICAgdGlkeTogLT5cbiAgICAgICAgJGlucCA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVxuICAgICAgICBpbnAgPSAkaW5wWzBdXG4gICAgICAgICMgbWVyZ2Ugc3R1ZmYgdG9nZXRoZXIgYW5kIHJlbW92ZSBlbXB0eSB0ZXh0bm9kZXMuXG4gICAgICAgIGlucC5ub3JtYWxpemUoKVxuICAgICAgICAjIGZpcnN0IGVuc3VyZSB0aGVyZSdzIGEgPGJyPiBhdCB0aGUgZW5kIChvciA8aT4gZm9yIElFKVxuICAgICAgICB0YWcgPSBpZiBpc0lFIHRoZW4gJ2knIGVsc2UgJ2JyJ1xuICAgICAgICB1bmxlc3MgJGlucC5jaGlsZHJlbigpLmxhc3QoKS5pcyB0YWdcbiAgICAgICAgICAgICRpbnAuZmluZChcIj4gI3t0YWd9XCIpLnJlbW92ZSgpXG4gICAgICAgICAgICAkaW5wLmFwcGVuZCBcIjwje3RhZ30+XCJcbiAgICAgICAgY2hpbGRzID0gaW5wLmNoaWxkTm9kZXNcbiAgICAgICAgZmlyc3QgPSBjaGlsZHNbMF1cbiAgICAgICAgIyBlbnN1cmUgdGhlIHdob2xlIHRoaW5ncyBzdGFydHMgd2l0aCBhIHp3bmpcbiAgICAgICAgaWYgZmlyc3Q/Lm5vZGVUeXBlICE9IDMgb3IgZmlyc3Q/Lm5vZGVWYWx1ZT9bMF0gIT0gendualxuICAgICAgICAgICAgJGlucFswXS5pbnNlcnRCZWZvcmUgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopLCBmaXJzdFxuICAgICAgICAjIGVuc3VyZSB0aGVyZSdzIGFsd2F5cyBhIHp3bmogYWZ0ZXIgZXZlcnkgZWxlbWVudCBub2RlXG4gICAgICAgIGZvciBuIGluIGNoaWxkcyB3aGVuIG4/Lm5vZGVUeXBlID09IDEgYW5kIG4/Lm5leHRTaWJsaW5nPy5ub2RlVHlwZSA9PSAxXG4gICAgICAgICAgICBhcHBlbmRBZnRlciBuLCBkb2MuY3JlYXRlVGV4dE5vZGUoenduailcbiAgICAgICAgIyBtb3ZlIGN1cnNvciB0byBub3QgYmUgb24gYmFkIGVsZW1lbnQgcG9zaXRpb25zXG4gICAgICAgIGlmIHIgPSBjdXJzb3IoJGVsWzBdKVxuICAgICAgICAgICAgaWYgKHIuc3RhcnRDb250YWluZXIgPT0gaW5wIG9yIHIuZW5kQ29udGFpbmVyID09IGlucCkgYW5kIGlzQ2hyb21lXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3MgciBpZiBuXG4gICAgICAgICAgICAjIGZpcmVmb3ggbWFuYWdlcyB0byBmb2N1cyBhbnl0aGluZyBidXQgdGhlIG9ubHlcbiAgICAgICAgICAgICMgY29udGVudGVkaXRhYmxlPXRydWUgb2YgdGhlIHBpbGxcbiAgICAgICAgICAgIHBhcmVuID0gci5zdGFydENvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiBwYXJlbj8ubm9kZU5hbWUgIT0gJ1NQQU4nIGFuZCBwaWxsID0gcGlsbGZvciBwYXJlblxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMga2VlcCBjYWNoZSBjbGVhblxuICAgICAgICB0aWR5cGlsbHMoKVxuICAgICAgICBudWxsXG5cbiMgdXNlIGpxdWVyeSByZW5kZXIgZGVmYXVsdFxuZGVmIHR0Ym94LCByZW5kZXI6IHR0Ym94LmpxdWVyeVxuXG4jIEV4cG9ydCB0aGUgbW9kdWxlIGluIHZhcmlvdXMgZGlmZmVyZW50IHdheXNcbmlmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCdcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHR0Ym94XG5lbHNlIGlmIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyBhbmQgZGVmaW5lLmFtZFxuICAgIGRlZmluZSAtPiB0dGJveFxuZWxzZVxuICAgIHRoaXMudHRib3ggPSB0dGJveFxuIl19