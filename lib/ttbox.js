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
    styles = ".ttbox * { box-sizing: border-box; width: auto; } .ttbox { position: relative; box-sizing: border-box; } .ttbox-overflow { border: 1px solid #bbb; border-radius: 3px; overflow-x: auto; overflow-y: hidden; } .ttbox-overflow::-webkit-scrollbar { display: none; } .ttbox-showing-suggest .ttbox-overflow { border-bottom-left-radius: 0; border-bottom-right-radius: 0; } .ttbox-input { padding-left: 4px; white-space: nowrap; outline: none; } .ttbox-input * { outline: none; } .ttbox-input * { display: inline-block; white-space: nowrap; } .ttbox-input br { display: inline; } .ttbox-sug-overflow { position: absolute; left: 0; border-top: none; border: 1px solid #bbb; border-radius: 3px; border-top-left-radius: 0; border-top-right-radius: 0; border-top: none; box-shadow: 0 2px 2px rgba(0,0,0,0.3); max-height: 300px; overflow-x: hidden; overflow-y: auto; } .ttbox-suggest { min-height: 5px; background: white; line-height: 38px; } .ttbox-suggest > .ttbox-suggest-item:first-child { padding-top: 5px; } .ttbox-suggest > .ttbox-suggest-item:last-child { padding-bottom: 5px; } .ttbox-suggest-item { cursor: pointer; padding: 0 10px 0 25px; } .ttbox-suggest-item dfn { display: inline-block; min-width: 70px; position: relative; } .ttbox-suggest-item span { color: #ccc; } .ttbox-suggest-divider { position: relative; padding: 0 10px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-suggest-divider span { position: relative; z-index: 1; background: white; color: #929292; padding-right: 20px; cursor: default; } .ttbox-suggest-divider hr { position: absolute; margin-top: 1.15em; left: 20px; right: 10px; border-top: 1px solid #ddd; border-bottom: none; } .ttbox-selected { background: #eee; } .ttbox-pill { position: relative; line-height: 1.8; margin: 0 4px; background: #5cb85c; border: 1px solid #58b658; border-radius: 14px; padding: 0 12px; color: white; min-width: 30px; } .ttbox-pill dfn { padding: 0 3px 0 14px; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; cursor: default; } .ttbox-pill-prefix dfn { padding-right: 0; } .ttbox-pill-close { display: inline-block; position: absolute; top: 0.1em; left: 7px; padding: 3px; line-height: 15px; cursor: pointer; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; } .ttbox-pill span { min-width: 5px; }";
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
    r = cursor(pel);
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
        return render.pillify(cursor(el), type, item, dispatch);
      }
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

//# sourceMappingURL=data:application/json;base64,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LEdBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQztZQUN6QixxQkFBRyxLQUFLLENBQUUsa0JBQVAsS0FBbUIsTUFBbkIsSUFBOEIsQ0FBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLEtBQVIsQ0FBUCxDQUFqQztjQUNJLElBQUksQ0FBQyxXQUFMLENBQUEsRUFESjthQVhKOztVQWNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsdUJBQVQsQ0FBaUMsQ0FBQyxNQUFsQyxDQUFBO1VBRUEsU0FBQSxDQUFBO2lCQUNBO1FBcENFLENBaExOOztJQXpCZSxDQUFSO0dBQVg7O0VBZ1BBLEdBQUEsQ0FBSSxLQUFKLEVBQVc7SUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQWQ7R0FBWDs7RUFHQSxJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFwQjtJQUNJLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BRHJCO0dBQUEsTUFFSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixVQUFqQixJQUFnQyxNQUFNLENBQUMsR0FBMUM7SUFDRCxNQUFBLENBQU8sU0FBQTthQUFHO0lBQUgsQ0FBUCxFQURDO0dBQUEsTUFBQTtJQUdELElBQUksQ0FBQyxLQUFMLEdBQWEsTUFIWjs7QUFoeEJMIiwiZmlsZSI6InR0Ym94LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZ2xvYiA9IGdsb2JhbCA/IHdpbmRvd1xuXG5kb2MgICA9IGdsb2IuZG9jdW1lbnRcbkkgICAgID0gKGEpIC0+IGFcbm1lcmdlID0gKHQsIG9zLi4uKSAtPiB0W2tdID0gdiBmb3Igayx2IG9mIG8gd2hlbiB2ICE9IHVuZGVmaW5lZCBmb3IgbyBpbiBvczsgdFxubGF0ZXIgPSAoZm4pIC0+IHNldFRpbWVvdXQgZm4sIDFcbmhvbGQgID0gKG1zLCBmKSAtPiBsYXN0ID0gMDsgdGltID0gbnVsbDsgKGFzLi4uKSAtPlxuICAgIGNsZWFyVGltZW91dCB0aW0gaWYgdGltXG4gICAgdGltID0gc2V0VGltZW91dCAoLT5mIGFzLi4uKSwgbXNcbmxhc3QgID0gKGFzKSAtPiBhcz9bYXMubGVuZ3RoIC0gMV1cbmZpbmQgID0gKGFzLCBmbikgLT4gcmV0dXJuIGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKVxuXG5pc0lFICAgICAgPSBnbG9iLm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRScpID4gMFxuaXNDaHJvbWUgID0gZ2xvYi5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gMFxuXG4jIGRlZmluZSBhbiBpbnZpc2libGUgcHJvcGVydHlcbmRlZiA9IChvYmosIHByb3BzKSAtPiBmb3IgbmFtZSwgdmFsdWUgb2YgcHJvcHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqLCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIG51bGxcblxuenduaiAgICAgICAgID0gXCLigItcIiAjICZ6d25qO1xuZmlsdGVyQTAgICAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MDBhMC9nLCAnICcgIyBuYnNwXG5maWx0ZXJad25qICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUyMDBiL2csICcnXG5maWx0ZXIgICAgICAgPSAocykgLT4gZmlsdGVyQTAgZmlsdGVyWnduaiBzXG5hcHBlbmRBZnRlciAgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsLm5leHRTaWJsaW5nKVxuYXBwZW5kQmVmb3JlID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbClcbmhleGR1bXAgICAgICA9IChzKSAtPiAoYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSBmb3IgYyBpbiBzKS5qb2luKCcgJylcblxuIyBpbmplY3QgY3NzXG5kbyAtPlxuICAgIHN0eWxlcyA9IFwiXG4udHRib3ggKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB3aWR0aDogYXV0bztcbn1cblxuLnR0Ym94IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLnR0Ym94LW92ZXJmbG93IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYmJiO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcbn1cbi50dGJveC1vdmVyZmxvdzo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG4udHRib3gtc2hvd2luZy1zdWdnZXN0IC50dGJveC1vdmVyZmxvdyB7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbn1cblxuLnR0Ym94LWlucHV0IHtcbiAgICBwYWRkaW5nLWxlZnQ6IDRweDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG4udHRib3gtaW5wdXQgKiB7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cblxuLnR0Ym94LWlucHV0ICoge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuLnR0Ym94LWlucHV0IGJyIHtcbiAgICBkaXNwbGF5OiBpbmxpbmU7XG59XG5cbi50dGJveC1zdWctb3ZlcmZsb3cge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2JiYjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDJweCByZ2JhKDAsMCwwLDAuMyk7XG4gICAgbWF4LWhlaWdodDogMzAwcHg7XG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG59XG4udHRib3gtc3VnZ2VzdCB7XG4gICAgbWluLWhlaWdodDogNXB4O1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGxpbmUtaGVpZ2h0OiAzOHB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmZpcnN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmxhc3QtY2hpbGQge1xuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZzogMCAxMHB4IDAgMjVweDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gZGZuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWluLXdpZHRoOiA3MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gc3BhbiB7XG4gICAgY29sb3I6ICNjY2M7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHNwYW4ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGNvbG9yOiAjOTI5MjkyO1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBociB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG1hcmdpbi10b3A6IDEuMTVlbTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4udHRib3gtc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi50dGJveC1waWxsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDEuODtcbiAgICBtYXJnaW46IDAgNHB4O1xuICAgIGJhY2tncm91bmQ6ICM1Y2I4NWM7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzU4YjY1ODtcbiAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWluLXdpZHRoOiAzMHB4O1xufVxuLnR0Ym94LXBpbGwgZGZuIHtcbiAgICBwYWRkaW5nOiAwIDNweCAwIDE0cHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtcGlsbC1wcmVmaXggZGZuIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xufVxuLnR0Ym94LXBpbGwtY2xvc2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwLjFlbTtcbiAgICBsZWZ0OiA3cHg7XG4gICAgcGFkZGluZzogM3B4O1xuICAgIGxpbmUtaGVpZ2h0OiAxNXB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXBpbGwgc3BhbiB7XG4gICAgbWluLXdpZHRoOiA1cHg7XG59XG5cIlxuICAgIGNzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY3NzLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgY3NzLmlubmVySFRNTCA9IHN0eWxlc1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkIGNzc1xuXG5jbGFzcyBUeXBlIHRoZW4gY29uc3RydWN0b3I6IChAbmFtZSwgb3B0cykgLT4gbWVyZ2UgQCwge2Zvcm1hdDpJfSwgb3B0c1xuY2xhc3MgVHJpZ2dlciB0aGVuIGNvbnN0cnVjdG9yOiAoQHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgbWVyZ2UgQCwgb3B0c1xuICAgIEB0eXBlcyA9IGlmIEFycmF5LmlzQXJyYXkgdHlwZXMgdGhlbiB0eXBlcyBlbHNlIFt0eXBlc11cbiAgICAjIHNldCBiYWNrIHJlZmVyZW5jZVxuICAgIHQudHJpZyA9IHRoaXMgZm9yIHQgaW4gQHR5cGVzXG4gICAgaWYgQHByZWZpeFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW50IGhhdmUgbXVsdGlwbGUgdHlwZXMgd2l0aCBwcmVmaXggdHJpZ2dlclwiKSBpZiBAdHlwZXMubGVuZ3RoID4gMVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKClcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG4gICAgZWxzZVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKFxcXFx3KilcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG5cbiMgU2tpcCB6d25qIGNoYXJzIHdoZW4gbW92aW5nIGxlZnQvcmlnaHRcbnNraXBad25qID0gKHBlbCwgZCwgZW5kKSAtPlxuICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcihwZWwpXG4gICAgbiA9IGlmIGVuZCB0aGVuIHIuZW5kQ29udGFpbmVyIGVsc2Ugci5zdGFydENvbnRhaW5lclxuICAgIGkgPSBpZiBlbmQgdGhlbiByLmVuZE9mZnNldCBlbHNlIHIuc3RhcnRPZmZzZXRcbiAgICByZXR1cm4gdW5sZXNzIG4ubm9kZVR5cGUgPT0gM1xuICAgIGMgPSBuLm5vZGVWYWx1ZS5jaGFyQ29kZUF0IChpZiBkIDwgMCB0aGVuIGkgKyBkIGVsc2UgaSlcbiAgICBpZiBjID09IDgyMDNcbiAgICAgICAgIyBtb3ZlXG4gICAgICAgIHNldEN1cnNvclBvcyByLCBpICsgZFxuICAgICAgICBza2lwWnduaiBkLCBlbmQgIyBhbmQgbWF5YmUgY29udGludWUgbW92aW5nP1xuXG5pc1BhcmVudCA9IChwbiwgbikgLT5cbiAgICBpZiBuID09IG51bGwgdGhlbiBmYWxzZSBlbHNlIGlmIHBuID09IG4gdGhlbiB0cnVlIGVsc2UgaXNQYXJlbnQocG4sIG4ucGFyZW50Tm9kZSlcblxuIyBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuY3Vyc29yID0gKHBlbCkgLT5cbiAgICBzID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgcmV0dXJuIHVubGVzcyBzLnJhbmdlQ291bnRcbiAgICByID0gcy5nZXRSYW5nZUF0KDApXG4gICAgaWYgaXNQYXJlbnQocGVsLCByLnN0YXJ0Q29udGFpbmVyKSB0aGVuIHIgZWxzZSBudWxsXG5cbiMgZmlsdGVyIHRoZSByYW5nZSB0byBnZXQgcmlkIG9mIHVud2FudGVkIGNoYXJzXG5yYW5nZVN0ciA9IChyKSAtPiBmaWx0ZXIgci50b1N0cmluZygpXG5cbmZpcnN0SXNXaGl0ZSA9IChzKSAtPiAvXlxccy4qLy50ZXN0KHMgPyAnJylcbmxhc3RJc1doaXRlICA9IChzKSAtPiAvLipcXHMkLy50ZXN0KHMgPyAnJylcblxud29yZFJhbmdlQXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyByID0gY3Vyc29yKHBlbClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICAjIGV4cGFuZCBiZWdpbm5pbmdcbiAgICB3aGlsZSB0LnN0YXJ0T2Zmc2V0ID4gMCBhbmQgbm90IGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCAtIDFcbiAgICAjIG9uZSBmb3J3YXJkIGFnYWluXG4gICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0ICsgMSBpZiBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICMgZXhwYW5kIGVuZFxuICAgIGxlbiA9IHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDBcbiAgICB3aGlsZSB0LmVuZE9mZnNldCA8IGxlbiBhbmQgbm90IGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0ICsgMVxuICAgICMgb25lIGJhY2sgYWdhaW5cbiAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgLSAxIGlmIGxhc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICByZXR1cm4gdFxuXG5lbnRpcmVUZXh0QXRDdXJzb3IgPSAocGVsKSAtPlxuICAgIHIgPSBjdXJzb3IocGVsKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIHQuc2VsZWN0Tm9kZUNvbnRlbnRzIHQuc3RhcnRDb250YWluZXJcbiAgICByZXR1cm4gdFxuXG5maW5kSW5SYW5nZSA9IChyLCBjaGFyKSAtPlxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgIG1heCA9ICh0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwKSAtIDFcbiAgICBmb3IgaSBpbiBbdC5zdGFydE9mZnNldC4ubWF4XSBieSAxXG4gICAgICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgaVxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgaSArIDFcbiAgICAgICAgcmV0dXJuIGkgaWYgdC50b1N0cmluZygpID09IGNoYXJcbiAgICByZXR1cm4gLTFcblxuc2V0Q3Vyc29yUG9zID0gKHIsIHBvcykgLT5cbiAgICB0ID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICB0LnNldFN0YXJ0IHIuc3RhcnRDb250YWluZXIsIHBvc1xuICAgIHQuc2V0RW5kIHIuZW5kQ29udGFpbmVyLCBwb3NcbiAgICBzZWwgPSBkb2MuZ2V0U2VsZWN0aW9uKClcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBzZWwuYWRkUmFuZ2UgdFxuXG5zZXRDdXJzb3JFbCA9IChlbCkgLT5cbiAgICByID0gZG9jLmNyZWF0ZVJhbmdlKClcbiAgICByLnNlbGVjdE5vZGVDb250ZW50cyBlbFxuICAgIHNldEN1cnNvclBvcyByLCAwXG5cbiMgRnVuY3Rpb24gdG8gbWFrZSB0dGJveCBvdXQgb2YgYW4gZWxlbWVudCB3aXRoIHRyaWdnZXJzXG4jXG50dGJveCA9IChlbCwgdHJpZ3MuLi4pIC0+XG5cbiAgICAjIGxvY2FsIHJlZmVyZW5jZSB0byByZW5kZXIgcGx1Z1xuICAgIHJlbmRlciA9IHR0Ym94LnJlbmRlcigpXG5cbiAgICAjIGxldCByZW5kZXIgZGVjaWRlIHdlIGhhdmUgYSBnb29kIGVsXG4gICAgZWwgPSByZW5kZXIuaW5pdChlbClcblxuICAgICMgYW5kIGNoZWNrIHdlIGdvdCBhIGdvb2QgdGhpbmcgYmFja1xuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIERJVicpIHVubGVzcyBlbC50YWdOYW1lID09ICdESVYnXG5cbiAgICAjIGV4cG9zZWQgb3BlcmF0aW9uc1xuICAgIGZhw6dhZGUgPSB7XG4gICAgICAgIHZhbHVlczogcmVuZGVyLnZhbHVlc1xuICAgICAgICBhZGRwaWxsOiAodHlwZSwgaXRlbSkgLT4gcmVuZGVyLnBpbGxpZnkgY3Vyc29yKGVsKSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2hcbiAgICB9XG5cbiAgICAjIGRpc3BhdGNoIGV2ZW50cyBvbiBpbmNvbWluZyBkaXZcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50ICdFdmVudCdcbiAgICAgICAgbWVyZ2UgZSwgb3B0cywge3R0Ym94OmZhw6dhZGV9XG4gICAgICAgIGUuaW5pdEV2ZW50IFwidHRib3g6I3tuYW1lfVwiLCB0cnVlLCBmYWxzZVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50IGVcblxuICAgIHVwZGF0ZSA9IGhvbGQgMywgKGNoYXIpIC0+XG4gICAgICAgICMgYSBwaWxsIGVkaXQgdHJ1bWZzIGFsbFxuICAgICAgICByZXR1cm4gaWYgaGFuZGxlcGlsbCgpXG4gICAgICAgICMgY3Vyc29yIHJhbmdlIGZvciB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcihlbClcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgYSB0cmlnZ2VyIGluIHRoZSB3b3JkP1xuICAgICAgICB0cmlnID0gZmluZCB0cmlncywgKHQpIC0+IHQucmUudGVzdCB3b3JkXG4gICAgICAgICMgbm8gdHJpZ2dlciBmb3VuZCBpbiBjdXJyZW50IHdvcmQsIGFib3J0XG4gICAgICAgIHVubGVzcyB0cmlnXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIyBleGVjIHRyaWdnZXIgdG8gZ2V0IHBhcnRzXG4gICAgICAgIFtfLCB0eXBlbmFtZSwgdmFsdWVdID0gdHJpZy5yZS5leGVjIHdvcmRcbiAgICAgICAgIyBmaW5kIHBvc3NpYmxlIHR5cGVzXG4gICAgICAgIHR5cGVzID0gdHJpZy50eXBlcy5maWx0ZXIgKHQpIC0+IHRyaWcucHJlZml4IG9yIHQubmFtZT8uaW5kZXhPZih0eXBlbmFtZSkgPT0gMFxuICAgICAgICAjIGhhbmQgb2ZmIHRvIGRlYWwgd2l0aCBmb3VuZCBpbnB1dFxuICAgICAgICBoYW5kbGV0eXBlcyByLCB0cmlnLCB0eXBlcywgY2hhclxuXG4gICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgIHNldFN1Z21vdmVyID0gKF9zdWdtb3ZlcikgLT4gc3VnbW92ZXIgPSBfc3VnbW92ZXJcbiAgICBzdG9wc3VnID0gLT5cbiAgICAgICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgICAgICByZW5kZXIudW5zdWdnZXN0KClcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RzdG9wJ1xuXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbHMgbGVhdmVcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxscmVtb3ZlJywgc3RvcHN1Z1xuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGwgbG9zZSBmb2N1c1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxmb2N1c291dCcsIHN0b3BzdWdcblxuICAgIGhhbmRsZXR5cGVzID0gKHJhbmdlLCB0cmlnLCB0eXBlcywgY2hhcikgLT5cbiAgICAgICAgIyB0aGUgdHJpZ2dlciBwb3NpdGlvbiBpbiB0aGUgd29yZCByYW5nZVxuICAgICAgICB0cG9zID0gZmluZEluUmFuZ2UgcmFuZ2UsIHRyaWcuc3ltYm9sXG4gICAgICAgICMgbm8gdHBvcz8hXG4gICAgICAgIHJldHVybiBpZiB0cG9zIDwgMFxuICAgICAgICAjIHJhbmdlIGZvciB0eXBlIG5hbWUgKHdoaWNoIG1heSBub3QgYmUgdGhlIGVudGlyZSBuYW1lKVxuICAgICAgICB0cmFuZ2UgPSByYW5nZS5jbG9uZVJhbmdlKClcbiAgICAgICAgdHJhbmdlLnNldEVuZCB0cmFuZ2UuZW5kQ29udGFpbmVyLCB0cG9zXG4gICAgICAgICMgd2hldGhlciB0aGUgbGFzdCBpbnB1dCB3YXMgdGhlIHRyaWdnZXJcbiAgICAgICAgd2FzdHJpZyA9IGNoYXIgPT0gdHJpZy5zeW1ib2xcbiAgICAgICAgIyBoZWxwZXIgd2hlbiBmaW5pc2hlZCBzZWxlY3RpbmcgYSB0eXBlXG4gICAgICAgIHNlbGVjdFR5cGUgPSAodHlwZSkgLT5cbiAgICAgICAgICAgIHJlbmRlci5waWxsaWZ5IHJhbmdlLCB0eXBlLCBudWxsLCBkaXNwYXRjaFxuICAgICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZXNlbGVjdCcsIHt0cmlnLCB0eXBlfVxuICAgICAgICBpZiB0eXBlcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIGVsc2UgaWYgdHlwZXMubGVuZ3RoID09IDEgYW5kIG5vdCBzdWdtb3ZlclxuICAgICAgICAgICAgIyBvbmUgcG9zc2libGUgc29sdXRpb25cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIGZvciB0cmlnZ2VyIGNoYXIsIHdlIHNlbGVjdCB0aGUgZmlyc3QgdHlwZSBzdHJhaWdodCBhd2F5XG4gICAgICAgICAgICAgICAgc2VsZWN0VHlwZSBmaW5kIHR5cGVzLCAodCkgLT4gIXQuZGl2aWRlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHdoZW4gdGhlIGtleSBpbnB1dCB3YXMgdGhlIHRyaWdnZXIgYW5kIHRoZXJlIGFyZVxuICAgICAgICAgICAgIyBtdWx0aXBsZSBwb3NzaWJsZSB2YWx1ZXMsIHBvc2l0aW9uLiBtb3ZlIHRvIGp1c3QgYmVmb3JlXG4gICAgICAgICAgICAjIHRoZSB0cmlnZ2VyIGNoYXIuXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBtb3ZlIHRoZSBjdXJzb3IgdG8gYWxsb3cgZm9yIHN1Z2dlc3QgaW5wdXRcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3MgcmFuZ2UsIHRwb3NcbiAgICAgICAgICAgICMgc3RhcnQgYSBzdWdnZXN0IGZvciBjdXJyZW50IHBvc3NpYmxlIHR5cGVzXG4gICAgICAgICAgICB0eXBlc3VnZ2VzdCB0cmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzXG5cblxuICAgICMgc3VnZ2VzdCBmb3IgZ2l2ZW4gdHlwZXNcbiAgICB0eXBlc3VnZ2VzdCA9IChyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgaGVscGVyIHRvIGNyZWF0ZSBzdWdzZWxlY3QgZnVuY3Rpb25zXG4gICAgICAgIHN1Z3NlbGVjdGZvciA9IChpdGVtKSAtPiAtPlxuICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgIyB0aGUgdHlwZSBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgc2VsZWN0VHlwZSBpdGVtXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgIyBmdW5jdGlvbiB0aGF0IHN1Z2dlc3QgdHlwZXNcbiAgICAgICAgZm50eXBlcyA9IChfLCBjYikgLT4gY2IgdHlwZXNcbiAgICAgICAgIyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgc2V0IGl0IGFzIHBvc3NpYmxlIGZvciByZXR1cm4ga2V5XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlc1swXSBpZiB0eXBlcy5sZW5ndGggPT0gMVxuICAgICAgICAjIHJlbmRlciBzdWdnZXN0aW9uc1xuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnR5cGVzLCByYW5nZSwgLTEsIHNldFN1Z21vdmVyLCAodHlwZSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgdHlwZVxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZScsIHt0cmlnLCB0eXBlfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZXMnLCB7dHJpZywgdHlwZXN9XG5cbiAgICBoYW5kbGVwaWxsID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gZW50aXJlVGV4dEF0Q3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHR5cGVvZiBwaWxsLnR5cGU/LnN1Z2dlc3QgPT0gJ2Z1bmN0aW9uJyAjIGRlZmluaXRlbHkgYSBzdWdnZXN0XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBzdWdnZXN0IGZ1bmN0aW9uIGFzIGZuIHRvIHJlbmRlci5zdWdnZXN0XG4gICAgICAgIGZudmFscyA9ICh3b3JkLCBjYikgLT4gcGlsbC50eXBlLnN1Z2dlc3Qgd29yZCwgY2IsIHBpbGwudHlwZSwgcGlsbC50cmlnXG4gICAgICAgICMgaGVscGVyIHdoZW4gd2UgZGVjaWRlIG9uIGFuIGl0ZW1cbiAgICAgICAgc2VsZWN0SXRlbSA9IChpdGVtKSAtPlxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgICAgICMgbGF0ZXIgc2luY2UgaXQgbWF5IGJlIHNlbGVjdCBmcm9tIGNsaWNrLCB3aGljaCBpcyBtb3VzZWRvd25cbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtc2VsZWN0Jywge3BpbGwsIGl0ZW19XG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudmFscywgciwgLTEsIHNldFN1Z21vdmVyLCAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPlxuICAgICAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAgICAgIyBzZWxlY3QgdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtIGl0ZW1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW0nLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZCBhYm91dCBpdFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zJywge3BpbGx9XG4gICAgICAgIHJldHVybiB0cnVlICMgc2lnbmFsIHdlIGRlYWx0IHdpdGggaXRcblxuICAgICMgbW92ZSB0aGUgaW5wdXQgb3V0IG9mIGEgcGlsbCAoaWYgd2UncmUgaW4gYSBwaWxsKVxuICAgIHBpbGxqdW1wID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKGVsKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgcGlsbC5zZXRDdXJzb3JBZnRlcigpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjIHRoZSBldmVudCBoYW5kbGVyc1xuICAgIGhhbmRsZXJzID1cbiAgICAgICAga2V5ZG93bjogIChlKSAtPlxuXG4gICAgICAgICAgICAjIHRoaXMgZG9lcyBhbiBpbXBvcnRhbnQgZWwubm9ybWFsaXplKCkgdGhhdCBlbnN1cmVzIHdlIGhhdmVcbiAgICAgICAgICAgICMgY29udGlndW91cyB0ZXh0IG5vZGVzLCBjcnVjaWFsIGZvciB0aGUgcmFuZ2UgbG9naWMuXG4gICAgICAgICAgICByZW5kZXIudGlkeSgpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIGRvbnQgd2FudCBET00gY2hhbmdlXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHN1Z3NlbGVjdD8oKVxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBwaWxsanVtcCgpXG5cbiAgICAgICAgICAgIGlmIHN1Z21vdmVyXG4gICAgICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDM4ICAgICAgIyB1cFxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKC0xKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlID09IDQwICMgZG93blxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgICMgbm8gY3Vyc29yIG1vdmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z21vdmVyKCsxKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgaW4gWzM3LCA4XVxuICAgICAgICAgICAgICAgIHNraXBad25qIC0xLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGJhY2t3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcbiAgICAgICAgICAgIGVsc2UgaWYgZS5rZXlDb2RlIGluIFszOSwgNDZdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogKzEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogZm9yd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG5cbiAgICAgICAgICAgIHVwZGF0ZSgpICMgZG8gYW4gdXBkYXRlLCBidXQgbWF5IGNhbmNlbCB3aXRoIGtleXByZXNzIHRvIGdldCBjaGFyXG5cbiAgICAgICAgICAgICMgYW5kIGtlZXAgbWFrZSBzdXJlIGl0J3MgdGlkeVxuICAgICAgICAgICAgbGF0ZXIgLT4gcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgIGtleXByZXNzOiAoZSkgLT5cbiAgICAgICAgICAgICMgY2FuY2VsIHByZXZpb3VzIHVwZGF0ZSBzaW5jZSB3ZSBoYXZlIGEgY2hhcmNvZGVcbiAgICAgICAgICAgIHVwZGF0ZSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpXG5cbiAgICAjIGZpcnN0IGRyYXdpbmdcbiAgICBkbyBkcmF3ID0gLT5cbiAgICAgICAgIyBkcmF3IGFuZCBhdHRhY2ggaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLmRyYXcgaGFuZGxlcnNcbiAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgIyBmaXJzdCBldmVudFxuICAgIGxhdGVyIC0+IGRpc3BhdGNoICdpbml0J1xuXG4gICAgIyByZXR1cm4gdGhlIGZhY2FkZSB0byBpbnRlcmFjdFxuICAgIHJldHVybiBmYcOnYWRlXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBtYWtpbmcgdHJpZ2dlcnMuXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJzonLCB0eXBlcyk7XG4jICAgdmFyIHRyaWcxID0gdHRib3gudHJpZygnQCcsIHtwcmVmaXg6IHRydWV9LCB0eXBlcyk7XG50dGJveC50cmlnID0gKHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAyXG4gICAgICAgIHR5cGVzID0gb3B0c1xuICAgICAgICBvcHRzID0ge31cbiAgICBuZXcgVHJpZ2dlciBzeW1ib2wsIG9wdHMsIHR5cGVzXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBkaXZpZGVycyBpbiB0eXBlIGxpc3RzXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0eXBlcyA9IFtcbiMgICAgIHR0Ym94LmRpdmlkZXIoJ0xpbWl0IHNlYXJjaCBvbicpLFxuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3guZGl2aWRlciA9IChuYW1lLCBvcHRzKSAtPiBuZXcgVHlwZSBuYW1lLCBtZXJnZSB7XG4gICAgZGl2aWRlcjp0cnVlXG4gICAgaHRtbDogLT4gXCI8ZGl2Pjxocj48c3Bhbj4je0BuYW1lfTwvc3Bhbj48L2Rpdj5cIlxufSwgb3B0c1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHR5cGVzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC50eXBlKCdwcm9kdWN0Jywge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgICAgdHRib3gudHlwZSgncGVyc29uJywgIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICBdXG50dGJveC50eXBlID0gKG5hbWUsIG9wdHMsIHR5cGVzKSAtPiBuZXcgVHlwZSBuYW1lLCBvcHRzXG5cblxuIyBIZWxwZXIgbWV0aG9kIHRvIG1ha2UgaHRtbCBmb3IgYSBzdWdnZXN0LlxuIyBcIjxkaXY+PGRmbj48Yj53b3JkPC9iPmlzcGFydG9mPC9kZm4+OiBzb21lIGRlc2NyaXB0aW9uPC9kaXY+XCJcbnN1Z2dlc3RIdG1sID0gKHdvcmQsIHByZWZpeCwgbmFtZSwgc3VmZml4LCBkZXNjID0gJycpIC0+XG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2PicgdW5sZXNzIG5hbWVcbiAgICBbaGlnaCwgdW5oaWdoXSA9IGlmIG5hbWUuaW5kZXhPZih3b3JkKSA9PSAwIHRoZW4gW3dvcmQsIG5hbWVbd29yZC5sZW5ndGguLl1dIGVsc2UgW1wiXCIsIG5hbWVdXG4gICAgXCI8ZGl2PjxkZm4+I3twcmVmaXh9PGI+I3toaWdofTwvYj4je3VuaGlnaH0je3N1ZmZpeH08L2Rmbj4gPHNwYW4+I3tkZXNjfTwvc3Bhbj48L2Rpdj5cIlxuVHlwZTo6aHRtbCA9ICh3b3JkKSAtPlxuICAgIGlmIEB0cmlnLnByZWZpeFxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBAdHJpZy5zeW1ib2wsIEBuYW1lLCBcIlwiLCBAZGVzY1xuICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgQG5hbWUsIEB0cmlnLnN5bWJvbCwgQGRlc2NcblxuXG4jIGdvZXMgdGhyb3VnaCBhbiBlbGVtZW50IHBhcnNpbmcgcGlsbHMgYW5kXG4jIHRleHQgaW50byBhIGRhdGFzdHJ1Y3R1cmVcbiMgaGVscGVyIHRvIHR1cm4gYSBzdWdnZXN0IGl0ZW0gaW50byBodG1sXG50b0h0bWwgPSAod29yZCkgLT4gKGl0ZW0pIC0+XG4gICAgaWYgdHlwZW9mIGl0ZW0/Lmh0bWwgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICBpdGVtLmh0bWwod29yZClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLnZhbHVlLCBcIlwiLCBpdGVtLmRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIGl0ZW0sIFwiXCJcblxuXG4jIGhlbHBlciB0byB0dXJuIGFuIGl0ZW0gaW50byB0ZXh0XG50b1RleHQgPSAoaXRlbSA9ICcnKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy52YWx1ZSA9PSAnc3RyaW5nJ1xuICAgICAgICBpdGVtLnZhbHVlXG4gICAgZWxzZVxuICAgICAgICBTdHJpbmcoaXRlbSlcblxuIyBqcXVlcnkgZHJhd2luZyBob29rXG5kZWYgdHRib3gsIGpxdWVyeTogLT5cblxuICAgICQgICAgPSBudWxsICMgc2V0IG9uIGluaXRcbiAgICAkZWwgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGJveCA9IC0+ICRlbC5maW5kKCcudHRib3gnKVxuICAgICMgaHRtbCBmb3IgYm94XG4gICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwidHRib3hcIj48ZGl2IGNsYXNzPVwidHRib3gtb3ZlcmZsb3dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0dGJveC1pbnB1dFwiIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIj48L2Rpdj48L2Rpdj48L2Rpdj4nXG4gICAgc3VnZ2VzdCA9ICc8ZGl2IGNsYXNzPVwidHRib3gtc3VnLW92ZXJmbG93XCI+PGRpdiBjbGFzcz1cInR0Ym94LXN1Z2dlc3RcIj48L2Rpdj48L2Rpdj4nXG4gICAgIyBjYWNoZSBvZiBwaWxsIDxwaWxsaWQsIHBpbGw+IHN0cnVjdHVyZXNcbiAgICBwaWxscyA9IHt9XG4gICAgIyBoZWxwZXIgdG8gdGlkeSBjYWNoZVxuICAgIHRpZHlwaWxscyA9IGhvbGQgNTAwMCwgLT5cbiAgICAgICAgcHJlc2VudCA9ICRlbC5maW5kKCcudHRib3gtcGlsbCcpLm1hcCgtPiAkKEApLmF0dHIgJ2lkJykudG9BcnJheSgpXG4gICAgICAgIGRlbGV0ZSBwaWxsc1tpZF0gZm9yIGlkIGluIE9iamVjdC5rZXlzKHBpbGxzKSB3aGVuIHByZXNlbnQuaW5kZXhPZihpZCkgPCAwXG4gICAgICAgIG51bGxcbiAgICAjIHJldHVybiB0aGUgcGlsbCBzdHJ1Y3R1cmUgZm9yIGFuIGVsZW1lbnRcbiAgICBwaWxsZm9yID0gKGVsKSAtPiBwaWxsc1skKGVsKS5jbG9zZXN0KCcudHRib3gtcGlsbCcpLmF0dHIoJ2lkJyldXG4gICAgIyBnbyB0aHJvdWdoIGNhY2hlIGFuZCBlbnN1cmUgYWxsIHBpbGxzIGhhdmUgdGhlIGl0ZW0gdmFsdWUgb2YgdGhlXG4gICAgIyBlbGVtZW50IHZhbHVlLlxuICAgIGVuc3VyZUl0ZW1zID0gLT5cbiAgICAgICAgcGlsbC5lbnN1cmVJdGVtKCkgZm9yIGssIHBpbGwgb2YgcGlsbHNcbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0aWFsaXNlIGJveFxuICAgIGluaXQ6IChlbCkgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkbid0IGZpbmQgalF1ZXJ5XCIpIHVubGVzcyAkID0galF1ZXJ5XG4gICAgICAgICRlbCA9ICQoZWwpXG4gICAgICAgICRlbFswXVxuXG4gICAgIyBkcmF3IHN0dWZmIGFuZCBob29rIHVwIGV2ZW50IGhhbmRsZXJzXG4gICAgZHJhdzogKGhhbmRsZXJzKSAtPlxuICAgICAgICAkZWwuaHRtbCBodG1sXG4gICAgICAgICRlbC5vbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LCBoYW5kbGVyIG9mIGhhbmRsZXJzXG5cbiAgICAjIHJldHVybiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBib3hcbiAgICB2YWx1ZXM6IC0+XG4gICAgICAgIGVuc3VyZUl0ZW1zKClcbiAgICAgICAgQXJyYXk6OnNsaWNlLmNhbGwoJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpWzBdLmNoaWxkTm9kZXMpLm1hcCAobikgLT5cbiAgICAgICAgICAgIGlmIG4ubm9kZVR5cGUgPT0gMSBhbmQgbj8uY2xhc3NOYW1lPy5pbmRleE9mKCd0dGJveC1waWxsJykgPj0gMFxuICAgICAgICAgICAgICAgIHBpbGxmb3IgblxuICAgICAgICAgICAgZWxzZSBpZiBuLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICAgICBmaWx0ZXIgbi5ub2RlVmFsdWVcbiAgICAgICAgLmZpbHRlciBJXG5cbiAgICAjIHJlbW92ZSBzdWdnZ2VzdFxuICAgIHVuc3VnZ2VzdDogdW5zdWdnZXN0ID0gLT5cbiAgICAgICAgJCgnLnR0Ym94LXN1Zy1vdmVyZmxvdycpLnJlbW92ZSgpXG4gICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc2hvd2luZy1zdWdnZXN0J1xuXG4gICAgIyBzdGFydCBzdWdnZXN0XG4gICAgc3VnZ2VzdDogKGZuLCByYW5nZSwgaWR4LCBtb3ZlY2IsIHNlbGVjdGNiKSAtPlxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHJhbmdlKVxuICAgICAgICAjIGZpbmQvY3JlYXRlIHN1Z2dlc3QtYm94XG4gICAgICAgICRzdWcgPSAkKCcudHRib3gtc3VnZ2VzdCcpXG4gICAgICAgIHVubGVzcyAkc3VnLmxlbmd0aFxuICAgICAgICAgICAgJG92ZXJmbHcgPSAkKHN1Z2dlc3QpXG4gICAgICAgICAgICAkc3VnID0gJG92ZXJmbHcuZmluZCAnLnR0Ym94LXN1Z2dlc3QnXG4gICAgICAgICAgICAjIGxvY2sgd2lkdGggdG8gcGFyZW50XG4gICAgICAgICAgICAkb3ZlcmZsdy53aWR0aCAkYm94KCkub3V0ZXJXaWR0aCgpXG4gICAgICAgICAgICAjIGFkanVzdCBmb3IgYm9yZGVyIG9mIHBhcmVudFxuICAgICAgICAgICAgYm9yZCA9IHBhcnNlSW50ICRlbC5maW5kKCcudHRib3gtb3ZlcmZsb3cnKS5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKVxuICAgICAgICAgICAgJG92ZXJmbHcuY3NzIHRvcDokZWwub3V0ZXJIZWlnaHQoKSAtIGJvcmRcbiAgICAgICAgICAgICMgYXBwZW5kIHRvIGJveFxuICAgICAgICAgICAgJGJveCgpLmFwcGVuZCAkb3ZlcmZsd1xuICAgICAgICAgICAgIyBpbmRpY2F0ZSB3ZSBhcmUgc2hvd2luZ1xuICAgICAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zaG93aW5nLXN1Z2dlc3QnKVxuICAgICAgICAjIGVtcHR5IHN1Z2dlc3QgYm94IHRvIHN0YXJ0IGZyZXNoXG4gICAgICAgICRzdWcuaHRtbCgnJyk7ICRzdWcub2ZmKClcbiAgICAgICAgIyBjbGFzcyB0byBob29rIHN0eWxpbmcgd2hlbiBzdWdnZXN0aW5nXG4gICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc3VnZ2VzdC1yZXF1ZXN0JylcbiAgICAgICAgIyByZXF1ZXN0IHRvIGdldCBzdWdnZXN0IGVsZW1lbnRzXG4gICAgICAgIGZuIHdvcmQsIChsaXN0KSAtPlxuICAgICAgICAgICAgIyBub3QgcmVxdWVzdGluZyBhbnltb3JlXG4gICAgICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCdcbiAgICAgICAgICAgICMgbG9jYWwgdG9IdG1sIHdpdGggd29yZFxuICAgICAgICAgICAgbG9jVG9IdG1sID0gdG9IdG1sKHdvcmQpXG4gICAgICAgICAgICAjIHR1cm4gbGlzdCBpbnRvIGh0bWxcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCAobCkgLT5cbiAgICAgICAgICAgICAgICAkaCA9ICQobG9jVG9IdG1sKGwpKVxuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGlmIGwuZGl2aWRlclxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1kaXZpZGVyJ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtaXRlbSdcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBsLmNsYXNzTmFtZSBpZiBsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICRzdWcuYXBwZW5kICRoXG4gICAgICAgICAgICAjIGxpc3Qgd2l0aG91dCBkaXZpZGVyc1xuICAgICAgICAgICAgbm9kaXZpZCA9IGxpc3QuZmlsdGVyIChsKSAtPiAhbC5kaXZpZGVyXG4gICAgICAgICAgICBwcmV2aWR4ID0gbnVsbFxuICAgICAgICAgICAgZG8gc2VsZWN0SWR4ID0gKGRvc3RhcnQgPSBmYWxzZSkgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgaWR4IDwgMCBhbmQgIWRvc3RhcnRcbiAgICAgICAgICAgICAgICBpZHggPSAwIGlmIGlkeCA8IDBcbiAgICAgICAgICAgICAgICBpZHggPSBub2RpdmlkLmxlbmd0aCAtIDEgaWYgaWR4ID49IG5vZGl2aWQubGVuZ3RoXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHByZXZpZHggPT0gaWR4XG4gICAgICAgICAgICAgICAgcHJldmlkeCA9IGlkeFxuICAgICAgICAgICAgICAgICRzdWcuZmluZCgnLnR0Ym94LXNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmVxKGlkeClcbiAgICAgICAgICAgICAgICAkc2VsLmFkZENsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgJHNlbFswXT8uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaWR4XVxuICAgICAgICAgICAgIyBoYW5kbGUgY2xpY2sgb24gYSBzdWdnZXN0IGl0ZW0sIG1vdXNlZG93biBzaW5jZSBjbGlja1xuICAgICAgICAgICAgIyB3aWxsIGZpZ2h0IHdpdGggZm9jdXNvdXQgb24gdGhlIHBpbGxcbiAgICAgICAgICAgICRzdWcub24gJ21vdXNlZG93bicsIChldikgLT5cbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICRpdCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KCcudHRib3gtc3VnZ2VzdC1pdGVtJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzICRpdC5sZW5ndGhcbiAgICAgICAgICAgICAgICBpID0gJHN1Zy5jaGlsZHJlbignLnR0Ym94LXN1Z2dlc3QtaXRlbScpLmluZGV4ICRpdFxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgaSA+PSAwXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpXSwgdHJ1ZVxuICAgICAgICAgICAgIyBjYWxsYmFjayBwYXNzZWQgdG8gcGFyZW50IGZvciBrZXkgbmF2aWdhdGlvblxuICAgICAgICAgICAgbW92ZWNiIChvZmZzKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3Mgb2Zmc1xuICAgICAgICAgICAgICAgIGlkeCA9IGlkeCArIG9mZnNcbiAgICAgICAgICAgICAgICBzZWxlY3RJZHggdHJ1ZVxuXG4gICAgIyBpbnNlcnQgYSBwaWxsIGZvciB0eXBlL2l0ZW0gYXQgZ2l2ZW4gcmFuZ2VcbiAgICBwaWxsaWZ5OiAocmFuZ2UsIHR5cGUsIGl0ZW0sIGRpc3BhdGNoKSAtPlxuICAgICAgICAjIHRoZSB0cmlnIGlzIHJlYWQgZnJvbSB0aGUgdHlwZVxuICAgICAgICB0cmlnID0gdHlwZS50cmlnXG4gICAgICAgICMgY3JlYXRlIHBpbGwgaHRtbFxuICAgICAgICBkZm4gPSBpZiB0cmlnXG4gICAgICAgICAgICBpZiB0cmlnLnByZWZpeCB0aGVuIHRyaWcuc3ltYm9sIGVsc2UgdHlwZS5uYW1lICsgdHJpZy5zeW1ib2xcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdHlwZS5uYW1lXG4gICAgICAgICRwaWxsID0gJChcIjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGxcXFwiPjxkaXYgY2xhc3M9XFxcInR0Ym94LXBpbGwtY2xvc2VcXFwiPsOXPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCI8ZGZuPiN7ZGZufTwvZGZuPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIilcbiAgICAgICAgJHBpbGwuZmluZCgnKicpLmFuZFNlbGYoKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAnZmFsc2UnXG4gICAgICAgICgkc3BhbiA9ICRwaWxsLmZpbmQoJ3NwYW4nKSkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ3RydWUnXG4gICAgICAgICMgaWYgcHJlZml4IHN0eWxlIHBpbGxcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgJ3R0Ym94LXBpbGwtcHJlZml4JyBpZiB0eXBlLnRyaWcucHJlZml4XG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUudHJpZy5jbGFzc05hbWUgaWYgdHlwZS50cmlnLmNsYXNzTmFtZVxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLmNsYXNzTmFtZSBpZiB0eXBlLmNsYXNzTmFtZVxuICAgICAgICAjIGdlbmVyYXRlIGlkIHRvIGFzc29jaWF0ZSB3aXRoIG1lbSBzdHJ1Y3R1cmVcbiAgICAgICAgaWQgPSBcInR0Ym94cGlsbCN7RGF0ZS5ub3coKX1cIlxuICAgICAgICAkcGlsbC5hdHRyICdpZCcsIGlkXG4gICAgICAgICMgcmVwbGFjZSBjb250ZW50cyB3aXRoIHBpbGxcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlICRwaWxsWzBdXG4gICAgICAgICMgcmVtb3ZlIHBpbGwgZnJvbSBET00sIHdoaWNoIGluIHR1cm4gcmVtb3ZlcyBpdCBjb21wbGV0ZWx5XG4gICAgICAgIHJlbW92ZSA9IC0+XG4gICAgICAgICAgICAkcGlsbC5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxyZW1vdmUnLCB7cGlsbH1cbiAgICAgICAgIyB3aXJlIHVwIGNsb3NlIGJ1dHRvblxuICAgICAgICAkcGlsbC5maW5kKCcudHRib3gtcGlsbC1jbG9zZScpLm9uICdjbGljaycsIHJlbW92ZVxuICAgICAgICAjIGZvcm1hdCB0aGUgdGV4dCB1c2luZyB0aGUgdHlwZSBmb3JtYXR0ZXJcbiAgICAgICAgZm9ybWF0ID0gLT4gJHNwYW4udGV4dCB0eXBlLmZvcm1hdCAkc3Bhbi50ZXh0KClcbiAgICAgICAgIyBtYXliZSBydW4gZm9ybWF0IG9uIGZvY3Vzb3V0XG4gICAgICAgICRwaWxsLm9uICdmb2N1c291dCcsIC0+XG4gICAgICAgICAgICAjIGRpc3BhdGNoIGxhdGVyIHRvIGFsbG93IGZvciBjbGljayBvbiBzdWdnZXN0XG4gICAgICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKVxuICAgICAgICAgICAgZm9ybWF0KCkgaWYgcGlsbC5pdGVtPy5fdGV4dFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3BpbGxmb2N1c291dCcsIHtwaWxsfVxuICAgICAgICAjIGhlbHBlciBmdW5jdGlvbiB0byBzY29sbCBwaWxsIGludG8gdmlld1xuICAgICAgICBzY3JvbGxJbiA9IC0+XG4gICAgICAgICAgICAkcGlsbC5hZnRlciAkdCA9ICQoJzxzcGFuIHN0eWxlPVwid2lkdGg6MXB4XCI+JylcbiAgICAgICAgICAgICR0WzBdLnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgICAgICR0LnJlbW92ZSgpXG4gICAgICAgICMgc3RvcCByZXNpemUgaGFuZGxlcyBpbiBJRVxuICAgICAgICBpZiBpc0lFXG4gICAgICAgICAgICAkcGlsbC5vbiAnbW91c2Vkb3duJywgKGUpIC0+XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICMgdGhlIHBpbGwgZmFjYWRlXG4gICAgICAgIHBpbGwgPSBwaWxsc1tpZF0gPSB7XG4gICAgICAgICAgICBpZCwgdHJpZywgdHlwZSwgcmVtb3ZlLFxuICAgICAgICAgICAgIyBzZXQgdGhlIGl0ZW0gdmFsdWUgZm9yIHRoaXMgcGlsbFxuICAgICAgICAgICAgc2V0SXRlbTogKEBpdGVtKSAtPiAkc3Bhbi50ZXh0IHRvVGV4dCBAaXRlbVxuICAgICAgICAgICAgIyBwb3NpdGlvbiBpbiB0aGUgcGlsbCB2YWx1ZVxuICAgICAgICAgICAgc2V0Q3Vyc29ySW46IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsICRzcGFuWzBdXG4gICAgICAgICAgICAjIHBvc2l0aW9uIHRoZSBjdXJzb3IgYWZ0ZXIgdGhlIHBpbGxcbiAgICAgICAgICAgIHNldEN1cnNvckFmdGVyOiAtPlxuICAgICAgICAgICAgICAgIHNjcm9sbEluKClcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCAkcGlsbFswXT8ubmV4dFNpYmxpbmdcbiAgICAgICAgfVxuICAgICAgICBkZWYgcGlsbCxcbiAgICAgICAgICAgICMgZW5zdXJlIHRoZSB0ZXh0IG9mIHRoZSBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiBAaXRlbVxuICAgICAgICAgICAgZW5zdXJlSXRlbTogLT5cbiAgICAgICAgICAgICAgICBzdHh0ID0gJHNwYW4udGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgICAgIHB0eHQgPSB0b1RleHQgcGlsbD8uaXRlbVxuICAgICAgICAgICAgICAgIHBpbGwuc2V0SXRlbSB7dmFsdWU6c3R4dCwgX3RleHQ6dHJ1ZX0gaWYgc3R4dCAhPSBwdHh0XG4gICAgICAgIGlmIGl0ZW1cbiAgICAgICAgICAgICMgc2V0IHRoZSB2YWx1ZVxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBwb3NpdGlvbiBjdXJzb3IgaW4gcGlsbC4gZG8gaXQgbGF0ZXIsIGJlY2F1c2Ugd2VcbiAgICAgICAgICAgICMgbWF5IGhhdmUgY3JlYXRlZCBhIHBpbGwgYXMgYSByZXN1bHQgb2YgYSBtb3VzZWRvd24gY2xpY2tcbiAgICAgICAgICAgICMgb24gYSBzdWdnZXN0XG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgJHBpbGxbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICBAdGlkeSgpXG4gICAgICAgIGRpc3BhdGNoICdwaWxsYWRkJywge3BpbGx9XG4gICAgICAgIHJldHVybiBwaWxsXG5cbiAgICAjIHJldHVybiB0aGUgcGlsbCBmb3IgZWxlbWVudFxuICAgIHBpbGxmb3I6IHBpbGxmb3JcblxuICAgICMga2VlcCBpbnB1dCBib3ggdGlkeSB3aXRoIHZhcmlvdXMgY29udGVudGVkaXRhYmxlIGJ1ZyBjb3JyZWN0aW9uc1xuICAgIHRpZHk6IC0+XG4gICAgICAgICRpbnAgPSAkZWwuZmluZCgnLnR0Ym94LWlucHV0JylcbiAgICAgICAgaW5wID0gJGlucFswXVxuICAgICAgICAjIG1lcmdlIHN0dWZmIHRvZ2V0aGVyIGFuZCByZW1vdmUgZW1wdHkgdGV4dG5vZGVzLlxuICAgICAgICBpbnAubm9ybWFsaXplKClcbiAgICAgICAgIyBmaXJzdCBlbnN1cmUgdGhlcmUncyBhIDxicj4gYXQgdGhlIGVuZCAob3IgPGk+IGZvciBJRSlcbiAgICAgICAgdGFnID0gaWYgaXNJRSB0aGVuICdpJyBlbHNlICdicidcbiAgICAgICAgdW5sZXNzICRpbnAuY2hpbGRyZW4oKS5sYXN0KCkuaXMgdGFnXG4gICAgICAgICAgICAkaW5wLmZpbmQoXCI+ICN7dGFnfVwiKS5yZW1vdmUoKVxuICAgICAgICAgICAgJGlucC5hcHBlbmQgXCI8I3t0YWd9PlwiXG4gICAgICAgIGNoaWxkcyA9IGlucC5jaGlsZE5vZGVzXG4gICAgICAgIGZpcnN0ID0gY2hpbGRzWzBdXG4gICAgICAgICMgZW5zdXJlIHRoZSB3aG9sZSB0aGluZ3Mgc3RhcnRzIHdpdGggYSB6d25qXG4gICAgICAgIGlmIGZpcnN0Py5ub2RlVHlwZSAhPSAzIG9yIGZpcnN0Py5ub2RlVmFsdWU/WzBdICE9IHp3bmpcbiAgICAgICAgICAgICRpbnBbMF0uaW5zZXJ0QmVmb3JlIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKSwgZmlyc3RcbiAgICAgICAgIyBlbnN1cmUgdGhlcmUncyBhbHdheXMgYSB6d25qIGFmdGVyIGV2ZXJ5IGVsZW1lbnQgbm9kZVxuICAgICAgICBmb3IgbiBpbiBjaGlsZHMgd2hlbiBuPy5ub2RlVHlwZSA9PSAxIGFuZCBuPy5uZXh0U2libGluZz8ubm9kZVR5cGUgPT0gMVxuICAgICAgICAgICAgYXBwZW5kQWZ0ZXIgbiwgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopXG4gICAgICAgICMgbW92ZSBjdXJzb3IgdG8gbm90IGJlIG9uIGJhZCBlbGVtZW50IHBvc2l0aW9uc1xuICAgICAgICBpZiByID0gY3Vyc29yKCRlbFswXSlcbiAgICAgICAgICAgIGlmIChyLnN0YXJ0Q29udGFpbmVyID09IGlucCBvciByLmVuZENvbnRhaW5lciA9PSBpbnApIGFuZCBpc0Nocm9tZVxuICAgICAgICAgICAgICAgIGNzID0gQXJyYXk6OnNsaWNlLmNhbGwgY2hpbGRzXG4gICAgICAgICAgICAgICAgIyBjdXJyZW50IHRleHQgbm9kZSwgdGhlbiByaWdodCwgdGhlIGxlZnQuXG4gICAgICAgICAgICAgICAgaXNUZXh0ID0gKG4pIC0+IGlmIG4/Lm5vZGVUeXBlID09IDMgdGhlbiBuIGVsc2UgbnVsbFxuICAgICAgICAgICAgICAgIGkgPSByLnN0YXJ0T2Zmc2V0XG4gICAgICAgICAgICAgICAgbiA9IGlzVGV4dChjc1tpXSkgPyBpc1RleHQoY3NbaSArIDFdKSA/IGlzVGV4dChjc1tpIC0gMV0pXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zIHIgaWYgblxuICAgICAgICAgICAgIyBmaXJlZm94IG1hbmFnZXMgdG8gZm9jdXMgYW55dGhpbmcgYnV0IHRoZSBvbmx5XG4gICAgICAgICAgICAjIGNvbnRlbnRlZGl0YWJsZT10cnVlIG9mIHRoZSBwaWxsXG4gICAgICAgICAgICBwYXJlbiA9IHIuc3RhcnRDb250YWluZXIucGFyZW50Tm9kZVxuICAgICAgICAgICAgaWYgcGFyZW4/Lm5vZGVOYW1lICE9ICdTUEFOJyBhbmQgcGlsbCA9IHBpbGxmb3IgcGFyZW5cbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgIyByZW1vdmUgYW55IG5lc3RlZCBzcGFuIGluIHBpbGxzXG4gICAgICAgICRlbC5maW5kKCcudHRib3gtcGlsbCBzcGFuIHNwYW4nKS5yZW1vdmUoKVxuICAgICAgICAjIGtlZXAgY2FjaGUgY2xlYW5cbiAgICAgICAgdGlkeXBpbGxzKClcbiAgICAgICAgbnVsbFxuXG4jIHVzZSBqcXVlcnkgcmVuZGVyIGRlZmF1bHRcbmRlZiB0dGJveCwgcmVuZGVyOiB0dGJveC5qcXVlcnlcblxuIyBFeHBvcnQgdGhlIG1vZHVsZSBpbiB2YXJpb3VzIGRpZmZlcmVudCB3YXlzXG5pZiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0dGJveFxuZWxzZSBpZiB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgYW5kIGRlZmluZS5hbWRcbiAgICBkZWZpbmUgLT4gdHRib3hcbmVsc2VcbiAgICB0aGlzLnR0Ym94ID0gdHRib3hcbiJdfQ==