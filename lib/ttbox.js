(function() {
  var I, Trigger, Type, appendAfter, appendBefore, cursor, def, doc, entireTextAtCursor, filter, filterA0, filterZwnj, find, findInRange, firstIsWhite, glob, hexdump, hold, isChrome, isIE, last, lastIsWhite, later, merge, rangeStr, setCursorEl, setCursorPos, skipZwnj, suggestHtml, toHtml, toText, ttbox, wordRangeAtCursor, zwnj,
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

  skipZwnj = function(d, end) {
    var c, i, n, r;
    if (!(r = cursor())) {
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

  cursor = function() {
    var s;
    s = doc.getSelection();
    if (s.rangeCount) {
      return s.getRangeAt(0);
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

  wordRangeAtCursor = function() {
    var len, r, ref, ref1, ref2, t;
    if (!(r = cursor())) {
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

  entireTextAtCursor = function() {
    var r, t;
    r = cursor();
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
        return render.pillify(cursor(), type, item, dispatch);
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
      r = wordRangeAtCursor();
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
      if (!(r = entireTextAtCursor())) {
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
      if (!(r = cursor())) {
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
          if (r = cursor()) {
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

//# sourceMappingURL=data:application/json;base64,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QjtJQUNJLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BRHJCO0dBQUEsTUFFSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixVQUFqQixJQUFnQyxNQUFNLENBQUMsR0FBMUM7SUFDRCxNQUFBLENBQU8sU0FBQTthQUFHO0lBQUgsQ0FBUCxFQURDO0dBQUEsTUFBQTtJQUdELElBQUksQ0FBQyxLQUFMLEdBQWEsTUFIWjs7QUF6d0JMIiwiZmlsZSI6InR0Ym94LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZ2xvYiA9IGdsb2JhbCA/IHdpbmRvd1xuXG5kb2MgICA9IGdsb2IuZG9jdW1lbnRcbkkgICAgID0gKGEpIC0+IGFcbm1lcmdlID0gKHQsIG9zLi4uKSAtPiB0W2tdID0gdiBmb3Igayx2IG9mIG8gd2hlbiB2ICE9IHVuZGVmaW5lZCBmb3IgbyBpbiBvczsgdFxubGF0ZXIgPSAoZm4pIC0+IHNldFRpbWVvdXQgZm4sIDFcbmhvbGQgID0gKG1zLCBmKSAtPiBsYXN0ID0gMDsgdGltID0gbnVsbDsgKGFzLi4uKSAtPlxuICAgIGNsZWFyVGltZW91dCB0aW0gaWYgdGltXG4gICAgdGltID0gc2V0VGltZW91dCAoLT5mIGFzLi4uKSwgbXNcbmxhc3QgID0gKGFzKSAtPiBhcz9bYXMubGVuZ3RoIC0gMV1cbmZpbmQgID0gKGFzLCBmbikgLT4gcmV0dXJuIGEgZm9yIGEgaW4gYXMgd2hlbiBmbihhKVxuXG5pc0lFICAgICAgPSBnbG9iLm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRScpID4gMFxuaXNDaHJvbWUgID0gZ2xvYi5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gMFxuXG4jIGRlZmluZSBhbiBpbnZpc2libGUgcHJvcGVydHlcbmRlZiA9IChvYmosIHByb3BzKSAtPiBmb3IgbmFtZSwgdmFsdWUgb2YgcHJvcHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqLCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIG51bGxcblxuenduaiAgICAgICAgID0gXCLigItcIiAjICZ6d25qO1xuZmlsdGVyQTAgICAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MDBhMC9nLCAnICcgIyBuYnNwXG5maWx0ZXJad25qICAgPSAocykgLT4gcy5yZXBsYWNlIC9cXHUyMDBiL2csICcnXG5maWx0ZXIgICAgICAgPSAocykgLT4gZmlsdGVyQTAgZmlsdGVyWnduaiBzXG5hcHBlbmRBZnRlciAgPSAoZWwsIG5vZGUpIC0+IGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIGVsLm5leHRTaWJsaW5nKVxuYXBwZW5kQmVmb3JlID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbClcbmhleGR1bXAgICAgICA9IChzKSAtPiAoYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSBmb3IgYyBpbiBzKS5qb2luKCcgJylcblxuIyBpbmplY3QgY3NzXG5kbyAtPlxuICAgIHN0eWxlcyA9IFwiXG4udHRib3ggKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB3aWR0aDogYXV0bztcbn1cblxuLnR0Ym94IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLnR0Ym94LW92ZXJmbG93IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYmJiO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcbn1cbi50dGJveC1vdmVyZmxvdzo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG4udHRib3gtc2hvd2luZy1zdWdnZXN0IC50dGJveC1vdmVyZmxvdyB7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbn1cblxuLnR0Ym94LWlucHV0IHtcbiAgICBwYWRkaW5nLWxlZnQ6IDRweDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG4udHRib3gtaW5wdXQgKiB7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cblxuLnR0Ym94LWlucHV0ICoge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuLnR0Ym94LWlucHV0IGJyIHtcbiAgICBkaXNwbGF5OiBpbmxpbmU7XG59XG5cbi50dGJveC1zdWctb3ZlcmZsb3cge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2JiYjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDJweCByZ2JhKDAsMCwwLDAuMyk7XG4gICAgbWF4LWhlaWdodDogMzAwcHg7XG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG59XG4udHRib3gtc3VnZ2VzdCB7XG4gICAgbWluLWhlaWdodDogNXB4O1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGxpbmUtaGVpZ2h0OiAzOHB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmZpcnN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QgPiAudHRib3gtc3VnZ2VzdC1pdGVtOmxhc3QtY2hpbGQge1xuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZzogMCAxMHB4IDAgMjVweDtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gZGZuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWluLXdpZHRoOiA3MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi50dGJveC1zdWdnZXN0LWl0ZW0gc3BhbiB7XG4gICAgY29sb3I6ICNjY2M7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG59XG4udHRib3gtc3VnZ2VzdC1kaXZpZGVyIHNwYW4ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGNvbG9yOiAjOTI5MjkyO1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBociB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG1hcmdpbi10b3A6IDEuMTVlbTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG59XG4udHRib3gtc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi50dGJveC1waWxsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDEuODtcbiAgICBtYXJnaW46IDAgNHB4O1xuICAgIGJhY2tncm91bmQ6ICM1Y2I4NWM7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzU4YjY1ODtcbiAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgIHBhZGRpbmc6IDAgMTJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWluLXdpZHRoOiAzMHB4O1xufVxuLnR0Ym94LXBpbGwgZGZuIHtcbiAgICBwYWRkaW5nOiAwIDNweCAwIDE0cHg7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XG59XG4udHRib3gtcGlsbC1wcmVmaXggZGZuIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xufVxuLnR0Ym94LXBpbGwtY2xvc2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwLjFlbTtcbiAgICBsZWZ0OiA3cHg7XG4gICAgcGFkZGluZzogM3B4O1xuICAgIGxpbmUtaGVpZ2h0OiAxNXB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXBpbGwgc3BhbiB7XG4gICAgbWluLXdpZHRoOiA1cHg7XG59XG5cIlxuICAgIGNzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY3NzLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgY3NzLmlubmVySFRNTCA9IHN0eWxlc1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkIGNzc1xuXG5jbGFzcyBUeXBlIHRoZW4gY29uc3RydWN0b3I6IChAbmFtZSwgb3B0cykgLT4gbWVyZ2UgQCwge2Zvcm1hdDpJfSwgb3B0c1xuY2xhc3MgVHJpZ2dlciB0aGVuIGNvbnN0cnVjdG9yOiAoQHN5bWJvbCwgb3B0cywgdHlwZXMpIC0+XG4gICAgbWVyZ2UgQCwgb3B0c1xuICAgIEB0eXBlcyA9IGlmIEFycmF5LmlzQXJyYXkgdHlwZXMgdGhlbiB0eXBlcyBlbHNlIFt0eXBlc11cbiAgICAjIHNldCBiYWNrIHJlZmVyZW5jZVxuICAgIHQudHJpZyA9IHRoaXMgZm9yIHQgaW4gQHR5cGVzXG4gICAgaWYgQHByZWZpeFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW50IGhhdmUgbXVsdGlwbGUgdHlwZXMgd2l0aCBwcmVmaXggdHJpZ2dlclwiKSBpZiBAdHlwZXMubGVuZ3RoID4gMVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKClcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG4gICAgZWxzZVxuICAgICAgICBAcmUgPSBSZWdFeHAgXCJeKFxcXFx3KilcXFxcI3tAc3ltYm9sfShcXFxcdyopJFwiXG5cbiMgU2tpcCB6d25qIGNoYXJzIHdoZW4gbW92aW5nIGxlZnQvcmlnaHRcbnNraXBad25qID0gKGQsIGVuZCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIHIgPSBjdXJzb3IoKVxuICAgIG4gPSBpZiBlbmQgdGhlbiByLmVuZENvbnRhaW5lciBlbHNlIHIuc3RhcnRDb250YWluZXJcbiAgICBpID0gaWYgZW5kIHRoZW4gci5lbmRPZmZzZXQgZWxzZSByLnN0YXJ0T2Zmc2V0XG4gICAgcmV0dXJuIHVubGVzcyBuLm5vZGVUeXBlID09IDNcbiAgICBjID0gbi5ub2RlVmFsdWUuY2hhckNvZGVBdCAoaWYgZCA8IDAgdGhlbiBpICsgZCBlbHNlIGkpXG4gICAgaWYgYyA9PSA4MjAzXG4gICAgICAgICMgbW92ZVxuICAgICAgICBzZXRDdXJzb3JQb3MgciwgaSArIGRcbiAgICAgICAgc2tpcFp3bmogZCwgZW5kICMgYW5kIG1heWJlIGNvbnRpbnVlIG1vdmluZz9cblxuIyBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuY3Vyc29yID0gLT4gcyA9IGRvYy5nZXRTZWxlY3Rpb24oKTsgaWYgcy5yYW5nZUNvdW50IHRoZW4gcy5nZXRSYW5nZUF0KDApIGVsc2UgbnVsbFxuXG4jIGZpbHRlciB0aGUgcmFuZ2UgdG8gZ2V0IHJpZCBvZiB1bndhbnRlZCBjaGFyc1xucmFuZ2VTdHIgPSAocikgLT4gZmlsdGVyIHIudG9TdHJpbmcoKVxuXG5maXJzdElzV2hpdGUgPSAocykgLT4gL15cXHMuKi8udGVzdChzID8gJycpXG5sYXN0SXNXaGl0ZSAgPSAocykgLT4gLy4qXFxzJC8udGVzdChzID8gJycpXG5cbndvcmRSYW5nZUF0Q3Vyc29yID0gLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgciA9IGN1cnNvcigpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgIyBleHBhbmQgYmVnaW5uaW5nXG4gICAgd2hpbGUgdC5zdGFydE9mZnNldCA+IDAgYW5kIG5vdCBmaXJzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgLSAxXG4gICAgIyBvbmUgZm9yd2FyZCBhZ2FpblxuICAgIHQuc2V0U3RhcnQgdC5zdGFydENvbnRhaW5lciwgdC5zdGFydE9mZnNldCArIDEgaWYgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAjIGV4cGFuZCBlbmRcbiAgICBsZW4gPSB0LmVuZENvbnRhaW5lcj8ubm9kZVZhbHVlPy5sZW5ndGggPyAwXG4gICAgd2hpbGUgdC5lbmRPZmZzZXQgPCBsZW4gYW5kIG5vdCBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCArIDFcbiAgICAjIG9uZSBiYWNrIGFnYWluXG4gICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIHQuZW5kT2Zmc2V0IC0gMSBpZiBsYXN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgcmV0dXJuIHRcblxuZW50aXJlVGV4dEF0Q3Vyc29yID0gLT5cbiAgICByID0gY3Vyc29yKClcbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICB0LnNlbGVjdE5vZGVDb250ZW50cyB0LnN0YXJ0Q29udGFpbmVyXG4gICAgcmV0dXJuIHRcblxuZmluZEluUmFuZ2UgPSAociwgY2hhcikgLT5cbiAgICB0ID0gci5jbG9uZVJhbmdlKClcbiAgICBtYXggPSAodC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMCkgLSAxXG4gICAgZm9yIGkgaW4gW3Quc3RhcnRPZmZzZXQuLm1heF0gYnkgMVxuICAgICAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIGlcbiAgICAgICAgdC5zZXRFbmQgdC5lbmRDb250YWluZXIsIGkgKyAxXG4gICAgICAgIHJldHVybiBpIGlmIHQudG9TdHJpbmcoKSA9PSBjaGFyXG4gICAgcmV0dXJuIC0xXG5cbnNldEN1cnNvclBvcyA9IChyLCBwb3MpIC0+XG4gICAgdCA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgdC5zZXRTdGFydCByLnN0YXJ0Q29udGFpbmVyLCBwb3NcbiAgICB0LnNldEVuZCByLmVuZENvbnRhaW5lciwgcG9zXG4gICAgc2VsID0gZG9jLmdldFNlbGVjdGlvbigpXG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgc2VsLmFkZFJhbmdlIHRcblxuc2V0Q3Vyc29yRWwgPSAoZWwpIC0+XG4gICAgciA9IGRvYy5jcmVhdGVSYW5nZSgpXG4gICAgci5zZWxlY3ROb2RlQ29udGVudHMgZWxcbiAgICBzZXRDdXJzb3JQb3MgciwgMFxuXG4jIEZ1bmN0aW9uIHRvIG1ha2UgdHRib3ggb3V0IG9mIGFuIGVsZW1lbnQgd2l0aCB0cmlnZ2Vyc1xuI1xudHRib3ggPSAoZWwsIHRyaWdzLi4uKSAtPlxuXG4gICAgIyBsb2NhbCByZWZlcmVuY2UgdG8gcmVuZGVyIHBsdWdcbiAgICByZW5kZXIgPSB0dGJveC5yZW5kZXIoKVxuXG4gICAgIyBsZXQgcmVuZGVyIGRlY2lkZSB3ZSBoYXZlIGEgZ29vZCBlbFxuICAgIGVsID0gcmVuZGVyLmluaXQoZWwpXG5cbiAgICAjIGFuZCBjaGVjayB3ZSBnb3QgYSBnb29kIHRoaW5nIGJhY2tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSBESVYnKSB1bmxlc3MgZWwudGFnTmFtZSA9PSAnRElWJ1xuXG4gICAgIyBleHBvc2VkIG9wZXJhdGlvbnNcbiAgICBmYcOnYWRlID0ge1xuICAgICAgICB2YWx1ZXM6IHJlbmRlci52YWx1ZXNcbiAgICAgICAgYWRkcGlsbDogKHR5cGUsIGl0ZW0pIC0+IHJlbmRlci5waWxsaWZ5IGN1cnNvcigpLCB0eXBlLCBpdGVtLCBkaXNwYXRjaFxuICAgIH1cblxuICAgICMgZGlzcGF0Y2ggZXZlbnRzIG9uIGluY29taW5nIGRpdlxuICAgIGRpc3BhdGNoID0gKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQgJ0V2ZW50J1xuICAgICAgICBtZXJnZSBlLCBvcHRzLCB7dHRib3g6ZmHDp2FkZX1cbiAgICAgICAgZS5pbml0RXZlbnQgXCJ0dGJveDoje25hbWV9XCIsIHRydWUsIGZhbHNlXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQgZVxuXG4gICAgdXBkYXRlID0gaG9sZCAzLCAoY2hhcikgLT5cbiAgICAgICAgIyBhIHBpbGwgZWRpdCB0cnVtZnMgYWxsXG4gICAgICAgIHJldHVybiBpZiBoYW5kbGVwaWxsKClcbiAgICAgICAgIyBjdXJzb3IgcmFuZ2UgZm9yIHdvcmRcbiAgICAgICAgciA9IHdvcmRSYW5nZUF0Q3Vyc29yKClcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgYSB0cmlnZ2VyIGluIHRoZSB3b3JkP1xuICAgICAgICB0cmlnID0gZmluZCB0cmlncywgKHQpIC0+IHQucmUudGVzdCB3b3JkXG4gICAgICAgICMgbm8gdHJpZ2dlciBmb3VuZCBpbiBjdXJyZW50IHdvcmQsIGFib3J0XG4gICAgICAgIHVubGVzcyB0cmlnXG4gICAgICAgICAgICBzdG9wc3VnPygpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIyBleGVjIHRyaWdnZXIgdG8gZ2V0IHBhcnRzXG4gICAgICAgIFtfLCB0eXBlbmFtZSwgdmFsdWVdID0gdHJpZy5yZS5leGVjIHdvcmRcbiAgICAgICAgIyBmaW5kIHBvc3NpYmxlIHR5cGVzXG4gICAgICAgIHR5cGVzID0gdHJpZy50eXBlcy5maWx0ZXIgKHQpIC0+IHRyaWcucHJlZml4IG9yIHQubmFtZT8uaW5kZXhPZih0eXBlbmFtZSkgPT0gMFxuICAgICAgICAjIGhhbmQgb2ZmIHRvIGRlYWwgd2l0aCBmb3VuZCBpbnB1dFxuICAgICAgICBoYW5kbGV0eXBlcyByLCB0cmlnLCB0eXBlcywgY2hhclxuXG4gICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgIHNldFN1Z21vdmVyID0gKF9zdWdtb3ZlcikgLT4gc3VnbW92ZXIgPSBfc3VnbW92ZXJcbiAgICBzdG9wc3VnID0gLT5cbiAgICAgICAgc3Vnc2VsZWN0ID0gc3VnbW92ZXIgPSBzdWd3b3JkID0gbnVsbFxuICAgICAgICByZW5kZXIudW5zdWdnZXN0KClcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RzdG9wJ1xuXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbHMgbGVhdmVcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyICd0dGJveDpwaWxscmVtb3ZlJywgc3RvcHN1Z1xuICAgICMgY2xvc2Ugc3VnZ2VzdCB3aGVuIHBpbGwgbG9zZSBmb2N1c1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxmb2N1c291dCcsIHN0b3BzdWdcblxuICAgIGhhbmRsZXR5cGVzID0gKHJhbmdlLCB0cmlnLCB0eXBlcywgY2hhcikgLT5cbiAgICAgICAgIyB0aGUgdHJpZ2dlciBwb3NpdGlvbiBpbiB0aGUgd29yZCByYW5nZVxuICAgICAgICB0cG9zID0gZmluZEluUmFuZ2UgcmFuZ2UsIHRyaWcuc3ltYm9sXG4gICAgICAgICMgbm8gdHBvcz8hXG4gICAgICAgIHJldHVybiBpZiB0cG9zIDwgMFxuICAgICAgICAjIHJhbmdlIGZvciB0eXBlIG5hbWUgKHdoaWNoIG1heSBub3QgYmUgdGhlIGVudGlyZSBuYW1lKVxuICAgICAgICB0cmFuZ2UgPSByYW5nZS5jbG9uZVJhbmdlKClcbiAgICAgICAgdHJhbmdlLnNldEVuZCB0cmFuZ2UuZW5kQ29udGFpbmVyLCB0cG9zXG4gICAgICAgICMgd2hldGhlciB0aGUgbGFzdCBpbnB1dCB3YXMgdGhlIHRyaWdnZXJcbiAgICAgICAgd2FzdHJpZyA9IGNoYXIgPT0gdHJpZy5zeW1ib2xcbiAgICAgICAgIyBoZWxwZXIgd2hlbiBmaW5pc2hlZCBzZWxlY3RpbmcgYSB0eXBlXG4gICAgICAgIHNlbGVjdFR5cGUgPSAodHlwZSkgLT5cbiAgICAgICAgICAgIHJlbmRlci5waWxsaWZ5IHJhbmdlLCB0eXBlLCBudWxsLCBkaXNwYXRjaFxuICAgICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZXNlbGVjdCcsIHt0cmlnLCB0eXBlfVxuICAgICAgICBpZiB0eXBlcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIGVsc2UgaWYgdHlwZXMubGVuZ3RoID09IDEgYW5kIG5vdCBzdWdtb3ZlclxuICAgICAgICAgICAgIyBvbmUgcG9zc2libGUgc29sdXRpb25cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIGZvciB0cmlnZ2VyIGNoYXIsIHdlIHNlbGVjdCB0aGUgZmlyc3QgdHlwZSBzdHJhaWdodCBhd2F5XG4gICAgICAgICAgICAgICAgc2VsZWN0VHlwZSBmaW5kIHR5cGVzLCAodCkgLT4gIXQuZGl2aWRlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHdoZW4gdGhlIGtleSBpbnB1dCB3YXMgdGhlIHRyaWdnZXIgYW5kIHRoZXJlIGFyZVxuICAgICAgICAgICAgIyBtdWx0aXBsZSBwb3NzaWJsZSB2YWx1ZXMsIHBvc2l0aW9uLiBtb3ZlIHRvIGp1c3QgYmVmb3JlXG4gICAgICAgICAgICAjIHRoZSB0cmlnZ2VyIGNoYXIuXG4gICAgICAgICAgICBpZiB3YXN0cmlnXG4gICAgICAgICAgICAgICAgIyBtb3ZlIHRoZSBjdXJzb3IgdG8gYWxsb3cgZm9yIHN1Z2dlc3QgaW5wdXRcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3MgcmFuZ2UsIHRwb3NcbiAgICAgICAgICAgICMgc3RhcnQgYSBzdWdnZXN0IGZvciBjdXJyZW50IHBvc3NpYmxlIHR5cGVzXG4gICAgICAgICAgICB0eXBlc3VnZ2VzdCB0cmFuZ2UsIHRwb3MsIHRyaWcsIHNlbGVjdFR5cGUsIHR5cGVzXG5cblxuICAgICMgc3VnZ2VzdCBmb3IgZ2l2ZW4gdHlwZXNcbiAgICB0eXBlc3VnZ2VzdCA9IChyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXMpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgaGVscGVyIHRvIGNyZWF0ZSBzdWdzZWxlY3QgZnVuY3Rpb25zXG4gICAgICAgIHN1Z3NlbGVjdGZvciA9IChpdGVtKSAtPiAtPlxuICAgICAgICAgICAgIyBzdG9wIHN1Z2dlc3RpbmdcbiAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgIyB0aGUgdHlwZSBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgc2VsZWN0VHlwZSBpdGVtXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgIyBmdW5jdGlvbiB0aGF0IHN1Z2dlc3QgdHlwZXNcbiAgICAgICAgZm50eXBlcyA9IChfLCBjYikgLT4gY2IgdHlwZXNcbiAgICAgICAgIyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgc2V0IGl0IGFzIHBvc3NpYmxlIGZvciByZXR1cm4ga2V5XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlc1swXSBpZiB0eXBlcy5sZW5ndGggPT0gMVxuICAgICAgICAjIHJlbmRlciBzdWdnZXN0aW9uc1xuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnR5cGVzLCByYW5nZSwgLTEsIHNldFN1Z21vdmVyLCAodHlwZSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSBzdWdzZWxlY3Rmb3IgdHlwZVxuICAgICAgICAgICAgc3Vnc2VsZWN0KCkgaWYgZG9zZXRcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZScsIHt0cmlnLCB0eXBlfVxuICAgICAgICAjIHRlbGwgdGhlIHdvcmxkXG4gICAgICAgIGRpc3BhdGNoICdzdWdnZXN0dHlwZXMnLCB7dHJpZywgdHlwZXN9XG5cbiAgICBoYW5kbGVwaWxsID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gZW50aXJlVGV4dEF0Q3Vyc29yKClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgcmV0dXJuIHVubGVzcyB0eXBlb2YgcGlsbC50eXBlPy5zdWdnZXN0ID09ICdmdW5jdGlvbicgIyBkZWZpbml0ZWx5IGEgc3VnZ2VzdFxuICAgICAgICAjIHRoZSBjdXJyZW50IHdvcmRcbiAgICAgICAgd29yZCA9IHJhbmdlU3RyKHIpXG4gICAgICAgICMgZG9udCBzdWdnZXN0IGZvciBzYW1lIHdvcmRcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgc3Vnd29yZCA9PSB3b3JkXG4gICAgICAgIHN1Z3dvcmQgPSB3b3JkXG4gICAgICAgICMgc3VnZ2VzdCBmdW5jdGlvbiBhcyBmbiB0byByZW5kZXIuc3VnZ2VzdFxuICAgICAgICBmbnZhbHMgPSAod29yZCwgY2IpIC0+IHBpbGwudHlwZS5zdWdnZXN0IHdvcmQsIGNiLCBwaWxsLnR5cGUsIHBpbGwudHJpZ1xuICAgICAgICAjIGhlbHBlciB3aGVuIHdlIGRlY2lkZSBvbiBhbiBpdGVtXG4gICAgICAgIHNlbGVjdEl0ZW0gPSAoaXRlbSkgLT5cbiAgICAgICAgICAgIHBpbGwuc2V0SXRlbSBpdGVtXG4gICAgICAgICAgICAjIGxhdGVyIHNpbmNlIGl0IG1heSBiZSBzZWxlY3QgZnJvbSBjbGljaywgd2hpY2ggaXMgbW91c2Vkb3duXG4gICAgICAgICAgICBsYXRlciAtPiBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdzdWdnZXN0aXRlbXNlbGVjdCcsIHtwaWxsLCBpdGVtfVxuICAgICAgICByZW5kZXIuc3VnZ2VzdCBmbnZhbHMsIHIsIC0xLCBzZXRTdWdtb3ZlciwgKGl0ZW0sIGRvc2V0KSAtPlxuICAgICAgICAgICAgc3Vnc2VsZWN0ID0gLT5cbiAgICAgICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgICAgIHN0b3BzdWcoKVxuICAgICAgICAgICAgICAgICMgc2VsZWN0IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbSBpdGVtXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWUgIyBpbmRpY2F0ZSBoYW5kbGVkXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtJywge3BpbGwsIGl0ZW19XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGQgYWJvdXQgaXRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtcycsIHtwaWxsfVxuICAgICAgICByZXR1cm4gdHJ1ZSAjIHNpZ25hbCB3ZSBkZWFsdCB3aXRoIGl0XG5cbiAgICAjIG1vdmUgdGhlIGlucHV0IG91dCBvZiBhIHBpbGwgKGlmIHdlJ3JlIGluIGEgcGlsbClcbiAgICBwaWxsanVtcCA9IC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgciA9IGN1cnNvcigpXG4gICAgICAgIHJldHVybiB1bmxlc3MgcGlsbCA9IHJlbmRlci5waWxsZm9yKHIuc3RhcnRDb250YWluZXI/LnBhcmVudE5vZGUpXG4gICAgICAgIHN0b3BzdWcoKVxuICAgICAgICBwaWxsLnNldEN1cnNvckFmdGVyKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgaGFuZGxlcnMgPVxuICAgICAgICBrZXlkb3duOiAgKGUpIC0+XG5cbiAgICAgICAgICAgICMgdGhpcyBkb2VzIGFuIGltcG9ydGFudCBlbC5ub3JtYWxpemUoKSB0aGF0IGVuc3VyZXMgd2UgaGF2ZVxuICAgICAgICAgICAgIyBjb250aWd1b3VzIHRleHQgbm9kZXMsIGNydWNpYWwgZm9yIHRoZSByYW5nZSBsb2dpYy5cbiAgICAgICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlID09IDEzXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICMgZG9udCB3YW50IERPTSBjaGFuZ2VcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgc3Vnc2VsZWN0PygpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHBpbGxqdW1wKClcblxuICAgICAgICAgICAgaWYgc3VnbW92ZXJcbiAgICAgICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMzggICAgICAjIHVwXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoLTEpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgPT0gNDAgIyBkb3duXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAgIyBubyBjdXJzb3IgbW92ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VnbW92ZXIoKzEpXG5cbiAgICAgICAgICAgIGlmIGUua2V5Q29kZSBpbiBbMzcsIDhdXG4gICAgICAgICAgICAgICAgc2tpcFp3bmogLTEsIGUuc2hpZnRLZXkgIyBza2lwIHp3bmogYmFja3dhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuICAgICAgICAgICAgZWxzZSBpZiBlLmtleUNvZGUgaW4gWzM5LCA0Nl1cbiAgICAgICAgICAgICAgICBza2lwWnduaiArMSwgZS5zaGlmdEtleSAjIHNraXAgenduaiBmb3J3YXJkcyB0byBmaXJzdCBub24tenduaiBwb3NcblxuICAgICAgICAgICAgdXBkYXRlKCkgIyBkbyBhbiB1cGRhdGUsIGJ1dCBtYXkgY2FuY2VsIHdpdGgga2V5cHJlc3MgdG8gZ2V0IGNoYXJcblxuICAgICAgICAgICAgIyBhbmQga2VlcCBtYWtlIHN1cmUgaXQncyB0aWR5XG4gICAgICAgICAgICBsYXRlciAtPiByZW5kZXIudGlkeSgpXG5cbiAgICAgICAga2V5cHJlc3M6IChlKSAtPlxuICAgICAgICAgICAgIyBjYW5jZWwgcHJldmlvdXMgdXBkYXRlIHNpbmNlIHdlIGhhdmUgYSBjaGFyY29kZVxuICAgICAgICAgICAgdXBkYXRlIFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaClcblxuICAgICMgZmlyc3QgZHJhd2luZ1xuICAgIGRvIGRyYXcgPSAtPlxuICAgICAgICAjIGRyYXcgYW5kIGF0dGFjaCBoYW5kbGVyc1xuICAgICAgICByZW5kZXIuZHJhdyBoYW5kbGVyc1xuICAgICAgICByZW5kZXIudGlkeSgpXG5cbiAgICAjIGZpcnN0IGV2ZW50XG4gICAgbGF0ZXIgLT4gZGlzcGF0Y2ggJ2luaXQnXG5cbiAgICAjIHJldHVybiB0aGUgZmFjYWRlIHRvIGludGVyYWN0XG4gICAgcmV0dXJuIGZhw6dhZGVcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0cmlnZ2Vycy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHRyaWcxID0gdHRib3gudHJpZygnOicsIHR5cGVzKTtcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCdAJywge3ByZWZpeDogdHJ1ZX0sIHR5cGVzKTtcbnR0Ym94LnRyaWcgPSAoc3ltYm9sLCBvcHRzLCB0eXBlcykgLT5cbiAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDJcbiAgICAgICAgdHlwZXMgPSBvcHRzXG4gICAgICAgIG9wdHMgPSB7fVxuICAgIG5ldyBUcmlnZ2VyIHN5bWJvbCwgb3B0cywgdHlwZXNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIGRpdmlkZXJzIGluIHR5cGUgbGlzdHNcbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3guZGl2aWRlcignTGltaXQgc2VhcmNoIG9uJyksXG4jICAgICB0dGJveC50eXBlKCdwcm9kdWN0Jywge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgICAgdHRib3gudHlwZSgncGVyc29uJywgIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICBdXG50dGJveC5kaXZpZGVyID0gKG5hbWUsIG9wdHMpIC0+IG5ldyBUeXBlIG5hbWUsIG1lcmdlIHtcbiAgICBkaXZpZGVyOnRydWVcbiAgICBodG1sOiAtPiBcIjxkaXY+PGhyPjxzcGFuPiN7QG5hbWV9PC9zcGFuPjwvZGl2PlwiXG59LCBvcHRzXG5cblxuIyBGYWN0b3J5IGZ1bmN0aW9uIGZvciBtYWtpbmcgdHlwZXMuXG4jXG4jIFVzYWdlOlxuIyAgIHZhciB0eXBlcyA9IFtcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LnR5cGUgPSAobmFtZSwgb3B0cywgdHlwZXMpIC0+IG5ldyBUeXBlIG5hbWUsIG9wdHNcblxuXG4jIEhlbHBlciBtZXRob2QgdG8gbWFrZSBodG1sIGZvciBhIHN1Z2dlc3QuXG4jIFwiPGRpdj48ZGZuPjxiPndvcmQ8L2I+aXNwYXJ0b2Y8L2Rmbj46IHNvbWUgZGVzY3JpcHRpb248L2Rpdj5cIlxuc3VnZ2VzdEh0bWwgPSAod29yZCwgcHJlZml4LCBuYW1lLCBzdWZmaXgsIGRlc2MgPSAnJykgLT5cbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JyB1bmxlc3MgbmFtZVxuICAgIFtoaWdoLCB1bmhpZ2hdID0gaWYgbmFtZS5pbmRleE9mKHdvcmQpID09IDAgdGhlbiBbd29yZCwgbmFtZVt3b3JkLmxlbmd0aC4uXV0gZWxzZSBbXCJcIiwgbmFtZV1cbiAgICBcIjxkaXY+PGRmbj4je3ByZWZpeH08Yj4je2hpZ2h9PC9iPiN7dW5oaWdofSN7c3VmZml4fTwvZGZuPiA8c3Bhbj4je2Rlc2N9PC9zcGFuPjwvZGl2PlwiXG5UeXBlOjpodG1sID0gKHdvcmQpIC0+XG4gICAgaWYgQHRyaWcucHJlZml4XG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIEB0cmlnLnN5bWJvbCwgQG5hbWUsIFwiXCIsIEBkZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBAbmFtZSwgQHRyaWcuc3ltYm9sLCBAZGVzY1xuXG5cbiMgZ29lcyB0aHJvdWdoIGFuIGVsZW1lbnQgcGFyc2luZyBwaWxscyBhbmRcbiMgdGV4dCBpbnRvIGEgZGF0YXN0cnVjdHVyZVxuIyBoZWxwZXIgdG8gdHVybiBhIHN1Z2dlc3QgaXRlbSBpbnRvIGh0bWxcbnRvSHRtbCA9ICh3b3JkKSAtPiAoaXRlbSkgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8uaHRtbCA9PSAnZnVuY3Rpb24nXG4gICAgICAgIGl0ZW0uaHRtbCh3b3JkKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0/LnZhbHVlID09ICdzdHJpbmcnXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIGl0ZW0udmFsdWUsIFwiXCIsIGl0ZW0uZGVzY1xuICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbSwgXCJcIlxuXG5cbiMgaGVscGVyIHRvIHR1cm4gYW4gaXRlbSBpbnRvIHRleHRcbnRvVGV4dCA9IChpdGVtID0gJycpIC0+XG4gICAgaWYgdHlwZW9mIGl0ZW0/LnZhbHVlID09ICdzdHJpbmcnXG4gICAgICAgIGl0ZW0udmFsdWVcbiAgICBlbHNlXG4gICAgICAgIFN0cmluZyhpdGVtKVxuXG4jIGpxdWVyeSBkcmF3aW5nIGhvb2tcbmRlZiB0dGJveCwganF1ZXJ5OiAtPlxuXG4gICAgJCAgICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRlbCAgPSBudWxsICMgc2V0IG9uIGluaXRcbiAgICAkYm94ID0gLT4gJGVsLmZpbmQoJy50dGJveCcpXG4gICAgIyBodG1sIGZvciBib3hcbiAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJ0dGJveFwiPjxkaXYgY2xhc3M9XCJ0dGJveC1vdmVyZmxvd1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInR0Ym94LWlucHV0XCIgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiPjwvZGl2PjwvZGl2PjwvZGl2PidcbiAgICBzdWdnZXN0ID0gJzxkaXYgY2xhc3M9XCJ0dGJveC1zdWctb3ZlcmZsb3dcIj48ZGl2IGNsYXNzPVwidHRib3gtc3VnZ2VzdFwiPjwvZGl2PjwvZGl2PidcbiAgICAjIGNhY2hlIG9mIHBpbGwgPHBpbGxpZCwgcGlsbD4gc3RydWN0dXJlc1xuICAgIHBpbGxzID0ge31cbiAgICAjIGhlbHBlciB0byB0aWR5IGNhY2hlXG4gICAgdGlkeXBpbGxzID0gaG9sZCA1MDAwLCAtPlxuICAgICAgICBwcmVzZW50ID0gJGVsLmZpbmQoJy50dGJveC1waWxsJykubWFwKC0+ICQoQCkuYXR0ciAnaWQnKS50b0FycmF5KClcbiAgICAgICAgZGVsZXRlIHBpbGxzW2lkXSBmb3IgaWQgaW4gT2JqZWN0LmtleXMocGlsbHMpIHdoZW4gcHJlc2VudC5pbmRleE9mKGlkKSA8IDBcbiAgICAgICAgbnVsbFxuICAgICMgcmV0dXJuIHRoZSBwaWxsIHN0cnVjdHVyZSBmb3IgYW4gZWxlbWVudFxuICAgIHBpbGxmb3IgPSAoZWwpIC0+IHBpbGxzWyQoZWwpLmNsb3Nlc3QoJy50dGJveC1waWxsJykuYXR0cignaWQnKV1cbiAgICAjIGdvIHRocm91Z2ggY2FjaGUgYW5kIGVuc3VyZSBhbGwgcGlsbHMgaGF2ZSB0aGUgaXRlbSB2YWx1ZSBvZiB0aGVcbiAgICAjIGVsZW1lbnQgdmFsdWUuXG4gICAgZW5zdXJlSXRlbXMgPSAtPlxuICAgICAgICBwaWxsLmVuc3VyZUl0ZW0oKSBmb3IgaywgcGlsbCBvZiBwaWxsc1xuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRpYWxpc2UgYm94XG4gICAgaW5pdDogKGVsKSAtPlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWRuJ3QgZmluZCBqUXVlcnlcIikgdW5sZXNzICQgPSBqUXVlcnlcbiAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgJGVsWzBdXG5cbiAgICAjIGRyYXcgc3R1ZmYgYW5kIGhvb2sgdXAgZXZlbnQgaGFuZGxlcnNcbiAgICBkcmF3OiAoaGFuZGxlcnMpIC0+XG4gICAgICAgICRlbC5odG1sIGh0bWxcbiAgICAgICAgJGVsLm9uKGV2ZW50LCBoYW5kbGVyKSBmb3IgZXZlbnQsIGhhbmRsZXIgb2YgaGFuZGxlcnNcblxuICAgICMgcmV0dXJuIGFuIGFycmF5IG9mIHZhbHVlcyBmb3IgdGhlIGJveFxuICAgIHZhbHVlczogLT5cbiAgICAgICAgZW5zdXJlSXRlbXMoKVxuICAgICAgICBBcnJheTo6c2xpY2UuY2FsbCgkZWwuZmluZCgnLnR0Ym94LWlucHV0JylbMF0uY2hpbGROb2RlcykubWFwIChuKSAtPlxuICAgICAgICAgICAgaWYgbi5ub2RlVHlwZSA9PSAxIGFuZCBuPy5jbGFzc05hbWU/LmluZGV4T2YoJ3R0Ym94LXBpbGwnKSA+PSAwXG4gICAgICAgICAgICAgICAgcGlsbGZvciBuXG4gICAgICAgICAgICBlbHNlIGlmIG4ubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgICAgIGZpbHRlciBuLm5vZGVWYWx1ZVxuICAgICAgICAuZmlsdGVyIElcblxuICAgICMgcmVtb3ZlIHN1Z2dnZXN0XG4gICAgdW5zdWdnZXN0OiB1bnN1Z2dlc3QgPSAtPlxuICAgICAgICAkKCcudHRib3gtc3VnLW92ZXJmbG93JykucmVtb3ZlKClcbiAgICAgICAgJGJveCgpLnJlbW92ZUNsYXNzICd0dGJveC1zaG93aW5nLXN1Z2dlc3QnXG5cbiAgICAjIHN0YXJ0IHN1Z2dlc3RcbiAgICBzdWdnZXN0OiAoZm4sIHJhbmdlLCBpZHgsIG1vdmVjYiwgc2VsZWN0Y2IpIC0+XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocmFuZ2UpXG4gICAgICAgICMgZmluZC9jcmVhdGUgc3VnZ2VzdC1ib3hcbiAgICAgICAgJHN1ZyA9ICQoJy50dGJveC1zdWdnZXN0JylcbiAgICAgICAgdW5sZXNzICRzdWcubGVuZ3RoXG4gICAgICAgICAgICAkb3ZlcmZsdyA9ICQoc3VnZ2VzdClcbiAgICAgICAgICAgICRzdWcgPSAkb3ZlcmZsdy5maW5kICcudHRib3gtc3VnZ2VzdCdcbiAgICAgICAgICAgICMgbG9jayB3aWR0aCB0byBwYXJlbnRcbiAgICAgICAgICAgICRvdmVyZmx3LndpZHRoICRib3goKS5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICMgYWRqdXN0IGZvciBib3JkZXIgb2YgcGFyZW50XG4gICAgICAgICAgICBib3JkID0gcGFyc2VJbnQgJGVsLmZpbmQoJy50dGJveC1vdmVyZmxvdycpLmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpXG4gICAgICAgICAgICAkb3ZlcmZsdy5jc3MgdG9wOiRlbC5vdXRlckhlaWdodCgpIC0gYm9yZFxuICAgICAgICAgICAgIyBhcHBlbmQgdG8gYm94XG4gICAgICAgICAgICAkYm94KCkuYXBwZW5kICRvdmVyZmx3XG4gICAgICAgICAgICAjIGluZGljYXRlIHdlIGFyZSBzaG93aW5nXG4gICAgICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCcpXG4gICAgICAgICMgZW1wdHkgc3VnZ2VzdCBib3ggdG8gc3RhcnQgZnJlc2hcbiAgICAgICAgJHN1Zy5odG1sKCcnKTsgJHN1Zy5vZmYoKVxuICAgICAgICAjIGNsYXNzIHRvIGhvb2sgc3R5bGluZyB3aGVuIHN1Z2dlc3RpbmdcbiAgICAgICAgJGJveCgpLmFkZENsYXNzKCd0dGJveC1zdWdnZXN0LXJlcXVlc3QnKVxuICAgICAgICAjIHJlcXVlc3QgdG8gZ2V0IHN1Z2dlc3QgZWxlbWVudHNcbiAgICAgICAgZm4gd29yZCwgKGxpc3QpIC0+XG4gICAgICAgICAgICAjIG5vdCByZXF1ZXN0aW5nIGFueW1vcmVcbiAgICAgICAgICAgICRib3goKS5yZW1vdmVDbGFzcyAndHRib3gtc3VnZ2VzdC1yZXF1ZXN0J1xuICAgICAgICAgICAgIyBsb2NhbCB0b0h0bWwgd2l0aCB3b3JkXG4gICAgICAgICAgICBsb2NUb0h0bWwgPSB0b0h0bWwod29yZClcbiAgICAgICAgICAgICMgdHVybiBsaXN0IGludG8gaHRtbFxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoIChsKSAtPlxuICAgICAgICAgICAgICAgICRoID0gJChsb2NUb0h0bWwobCkpXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgaWYgbC5kaXZpZGVyXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWRpdmlkZXInXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAndHRib3gtc3VnZ2VzdC1pdGVtJ1xuICAgICAgICAgICAgICAgICRoLmFkZENsYXNzIGwuY2xhc3NOYW1lIGlmIGwuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgJHN1Zy5hcHBlbmQgJGhcbiAgICAgICAgICAgICMgbGlzdCB3aXRob3V0IGRpdmlkZXJzXG4gICAgICAgICAgICBub2RpdmlkID0gbGlzdC5maWx0ZXIgKGwpIC0+ICFsLmRpdmlkZXJcbiAgICAgICAgICAgIHByZXZpZHggPSBudWxsXG4gICAgICAgICAgICBkbyBzZWxlY3RJZHggPSAoZG9zdGFydCA9IGZhbHNlKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBpZHggPCAwIGFuZCAhZG9zdGFydFxuICAgICAgICAgICAgICAgIGlkeCA9IDAgaWYgaWR4IDwgMFxuICAgICAgICAgICAgICAgIGlkeCA9IG5vZGl2aWQubGVuZ3RoIC0gMSBpZiBpZHggPj0gbm9kaXZpZC5sZW5ndGhcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcHJldmlkeCA9PSBpZHhcbiAgICAgICAgICAgICAgICBwcmV2aWR4ID0gaWR4XG4gICAgICAgICAgICAgICAgJHN1Zy5maW5kKCcudHRib3gtc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWwgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuZXEoaWR4KVxuICAgICAgICAgICAgICAgICRzZWwuYWRkQ2xhc3MoJ3R0Ym94LXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAkc2VsWzBdPy5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAgICAgc2VsZWN0Y2Igbm9kaXZpZFtpZHhdXG4gICAgICAgICAgICAjIGhhbmRsZSBjbGljayBvbiBhIHN1Z2dlc3QgaXRlbSwgbW91c2Vkb3duIHNpbmNlIGNsaWNrXG4gICAgICAgICAgICAjIHdpbGwgZmlnaHQgd2l0aCBmb2N1c291dCBvbiB0aGUgcGlsbFxuICAgICAgICAgICAgJHN1Zy5vbiAnbW91c2Vkb3duJywgKGV2KSAtPlxuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgJGl0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoJy50dGJveC1zdWdnZXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgJGl0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGkgPSAkc3VnLmNoaWxkcmVuKCcudHRib3gtc3VnZ2VzdC1pdGVtJykuaW5kZXggJGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpID49IDBcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2ldLCB0cnVlXG4gICAgICAgICAgICAjIGNhbGxiYWNrIHBhc3NlZCB0byBwYXJlbnQgZm9yIGtleSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICBtb3ZlY2IgKG9mZnMpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBvZmZzXG4gICAgICAgICAgICAgICAgaWR4ID0gaWR4ICsgb2Zmc1xuICAgICAgICAgICAgICAgIHNlbGVjdElkeCB0cnVlXG5cbiAgICAjIGluc2VydCBhIHBpbGwgZm9yIHR5cGUvaXRlbSBhdCBnaXZlbiByYW5nZVxuICAgIHBpbGxpZnk6IChyYW5nZSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2gpIC0+XG4gICAgICAgICMgdGhlIHRyaWcgaXMgcmVhZCBmcm9tIHRoZSB0eXBlXG4gICAgICAgIHRyaWcgPSB0eXBlLnRyaWdcbiAgICAgICAgIyBjcmVhdGUgcGlsbCBodG1sXG4gICAgICAgIGRmbiA9IGlmIHRyaWdcbiAgICAgICAgICAgIGlmIHRyaWcucHJlZml4IHRoZW4gdHJpZy5zeW1ib2wgZWxzZSB0eXBlLm5hbWUgKyB0cmlnLnN5bWJvbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0eXBlLm5hbWVcbiAgICAgICAgJHBpbGwgPSAkKFwiPGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbFxcXCI+PGRpdiBjbGFzcz1cXFwidHRib3gtcGlsbC1jbG9zZVxcXCI+w5c8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIjxkZm4+I3tkZm59PC9kZm4+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKVxuICAgICAgICAkcGlsbC5maW5kKCcqJykuYW5kU2VsZigpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZSdcbiAgICAgICAgKCRzcGFuID0gJHBpbGwuZmluZCgnc3BhbicpKS5wcm9wICdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZSdcbiAgICAgICAgIyBpZiBwcmVmaXggc3R5bGUgcGlsbFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyAndHRib3gtcGlsbC1wcmVmaXgnIGlmIHR5cGUudHJpZy5wcmVmaXhcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS50cmlnLmNsYXNzTmFtZSBpZiB0eXBlLnRyaWcuY2xhc3NOYW1lXG4gICAgICAgICRwaWxsLmFkZENsYXNzIHR5cGUuY2xhc3NOYW1lIGlmIHR5cGUuY2xhc3NOYW1lXG4gICAgICAgICMgZ2VuZXJhdGUgaWQgdG8gYXNzb2NpYXRlIHdpdGggbWVtIHN0cnVjdHVyZVxuICAgICAgICBpZCA9IFwidHRib3hwaWxsI3tEYXRlLm5vdygpfVwiXG4gICAgICAgICRwaWxsLmF0dHIgJ2lkJywgaWRcbiAgICAgICAgIyByZXBsYWNlIGNvbnRlbnRzIHdpdGggcGlsbFxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUgJHBpbGxbMF1cbiAgICAgICAgIyByZW1vdmUgcGlsbCBmcm9tIERPTSwgd2hpY2ggaW4gdHVybiByZW1vdmVzIGl0IGNvbXBsZXRlbHlcbiAgICAgICAgcmVtb3ZlID0gLT5cbiAgICAgICAgICAgICRwaWxsLnJlbW92ZSgpXG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbHJlbW92ZScsIHtwaWxsfVxuICAgICAgICAjIHdpcmUgdXAgY2xvc2UgYnV0dG9uXG4gICAgICAgICRwaWxsLmZpbmQoJy50dGJveC1waWxsLWNsb3NlJykub24gJ2NsaWNrJywgcmVtb3ZlXG4gICAgICAgICMgZm9ybWF0IHRoZSB0ZXh0IHVzaW5nIHRoZSB0eXBlIGZvcm1hdHRlclxuICAgICAgICBmb3JtYXQgPSAtPiAkc3Bhbi50ZXh0IHR5cGUuZm9ybWF0ICRzcGFuLnRleHQoKVxuICAgICAgICAjIG1heWJlIHJ1biBmb3JtYXQgb24gZm9jdXNvdXRcbiAgICAgICAgJHBpbGwub24gJ2ZvY3Vzb3V0JywgLT5cbiAgICAgICAgICAgICMgZGlzcGF0Y2ggbGF0ZXIgdG8gYWxsb3cgZm9yIGNsaWNrIG9uIHN1Z2dlc3RcbiAgICAgICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpXG4gICAgICAgICAgICBmb3JtYXQoKSBpZiBwaWxsLml0ZW0/Ll90ZXh0XG4gICAgICAgICAgICBkaXNwYXRjaCAncGlsbGZvY3Vzb3V0Jywge3BpbGx9XG4gICAgICAgICMgaGVscGVyIGZ1bmN0aW9uIHRvIHNjb2xsIHBpbGwgaW50byB2aWV3XG4gICAgICAgIHNjcm9sbEluID0gLT5cbiAgICAgICAgICAgICRwaWxsLmFmdGVyICR0ID0gJCgnPHNwYW4gc3R5bGU9XCJ3aWR0aDoxcHhcIj4nKVxuICAgICAgICAgICAgJHRbMF0uc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgICAgJHQucmVtb3ZlKClcbiAgICAgICAgIyBzdG9wIHJlc2l6ZSBoYW5kbGVzIGluIElFXG4gICAgICAgIGlmIGlzSUVcbiAgICAgICAgICAgICRwaWxsLm9uICdtb3VzZWRvd24nLCAoZSkgLT5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBwaWxsLnNldEN1cnNvckluKClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIyB0aGUgcGlsbCBmYWNhZGVcbiAgICAgICAgcGlsbCA9IHBpbGxzW2lkXSA9IHtcbiAgICAgICAgICAgIGlkLCB0cmlnLCB0eXBlLCByZW1vdmUsXG4gICAgICAgICAgICAjIHNldCB0aGUgaXRlbSB2YWx1ZSBmb3IgdGhpcyBwaWxsXG4gICAgICAgICAgICBzZXRJdGVtOiAoQGl0ZW0pIC0+ICRzcGFuLnRleHQgdG9UZXh0IEBpdGVtXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGluIHRoZSBwaWxsIHZhbHVlXG4gICAgICAgICAgICBzZXRDdXJzb3JJbjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHNwYW5bMF1cbiAgICAgICAgICAgICMgcG9zaXRpb24gdGhlIGN1cnNvciBhZnRlciB0aGUgcGlsbFxuICAgICAgICAgICAgc2V0Q3Vyc29yQWZ0ZXI6IC0+XG4gICAgICAgICAgICAgICAgc2Nyb2xsSW4oKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvckVsICRwaWxsWzBdPy5uZXh0U2libGluZ1xuICAgICAgICB9XG4gICAgICAgIGRlZiBwaWxsLFxuICAgICAgICAgICAgIyBlbnN1cmUgdGhlIHRleHQgb2YgdGhlIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIEBpdGVtXG4gICAgICAgICAgICBlbnN1cmVJdGVtOiAtPlxuICAgICAgICAgICAgICAgIHN0eHQgPSAkc3Bhbi50ZXh0KCkudHJpbSgpXG4gICAgICAgICAgICAgICAgcHR4dCA9IHRvVGV4dCBwaWxsPy5pdGVtXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRJdGVtIHt2YWx1ZTpzdHh0LCBfdGV4dDp0cnVlfSBpZiBzdHh0ICE9IHB0eHRcbiAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgIyBzZXQgdGhlIHZhbHVlXG4gICAgICAgICAgICBwaWxsLnNldEl0ZW0gaXRlbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHBvc2l0aW9uIGN1cnNvciBpbiBwaWxsLiBkbyBpdCBsYXRlciwgYmVjYXVzZSB3ZVxuICAgICAgICAgICAgIyBtYXkgaGF2ZSBjcmVhdGVkIGEgcGlsbCBhcyBhIHJlc3VsdCBvZiBhIG1vdXNlZG93biBjbGlja1xuICAgICAgICAgICAgIyBvbiBhIHN1Z2dlc3RcbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAkcGlsbFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgIEB0aWR5KClcbiAgICAgICAgZGlzcGF0Y2ggJ3BpbGxhZGQnLCB7cGlsbH1cbiAgICAgICAgcmV0dXJuIHBpbGxcblxuICAgICMgcmV0dXJuIHRoZSBwaWxsIGZvciBlbGVtZW50XG4gICAgcGlsbGZvcjogcGlsbGZvclxuXG4gICAgIyBrZWVwIGlucHV0IGJveCB0aWR5IHdpdGggdmFyaW91cyBjb250ZW50ZWRpdGFibGUgYnVnIGNvcnJlY3Rpb25zXG4gICAgdGlkeTogLT5cbiAgICAgICAgJGlucCA9ICRlbC5maW5kKCcudHRib3gtaW5wdXQnKVxuICAgICAgICBpbnAgPSAkaW5wWzBdXG4gICAgICAgICMgbWVyZ2Ugc3R1ZmYgdG9nZXRoZXIgYW5kIHJlbW92ZSBlbXB0eSB0ZXh0bm9kZXMuXG4gICAgICAgIGlucC5ub3JtYWxpemUoKVxuICAgICAgICAjIGZpcnN0IGVuc3VyZSB0aGVyZSdzIGEgPGJyPiBhdCB0aGUgZW5kIChvciA8aT4gZm9yIElFKVxuICAgICAgICB0YWcgPSBpZiBpc0lFIHRoZW4gJ2knIGVsc2UgJ2JyJ1xuICAgICAgICB1bmxlc3MgJGlucC5jaGlsZHJlbigpLmxhc3QoKS5pcyB0YWdcbiAgICAgICAgICAgICRpbnAuZmluZChcIj4gI3t0YWd9XCIpLnJlbW92ZSgpXG4gICAgICAgICAgICAkaW5wLmFwcGVuZCBcIjwje3RhZ30+XCJcbiAgICAgICAgY2hpbGRzID0gaW5wLmNoaWxkTm9kZXNcbiAgICAgICAgZmlyc3QgPSBjaGlsZHNbMF1cbiAgICAgICAgIyBlbnN1cmUgdGhlIHdob2xlIHRoaW5ncyBzdGFydHMgd2l0aCBhIHp3bmpcbiAgICAgICAgaWYgZmlyc3Q/Lm5vZGVUeXBlICE9IDMgb3IgZmlyc3Q/Lm5vZGVWYWx1ZT9bMF0gIT0gendualxuICAgICAgICAgICAgJGlucFswXS5pbnNlcnRCZWZvcmUgZG9jLmNyZWF0ZVRleHROb2RlKHp3bmopLCBmaXJzdFxuICAgICAgICAjIGVuc3VyZSB0aGVyZSdzIGFsd2F5cyBhIHp3bmogYWZ0ZXIgZXZlcnkgZWxlbWVudCBub2RlXG4gICAgICAgIGZvciBuIGluIGNoaWxkcyB3aGVuIG4/Lm5vZGVUeXBlID09IDEgYW5kIG4/Lm5leHRTaWJsaW5nPy5ub2RlVHlwZSA9PSAxXG4gICAgICAgICAgICBhcHBlbmRBZnRlciBuLCBkb2MuY3JlYXRlVGV4dE5vZGUoenduailcbiAgICAgICAgIyBtb3ZlIGN1cnNvciB0byBub3QgYmUgb24gYmFkIGVsZW1lbnQgcG9zaXRpb25zXG4gICAgICAgIGlmIHIgPSBjdXJzb3IoKVxuICAgICAgICAgICAgaWYgKHIuc3RhcnRDb250YWluZXIgPT0gaW5wIG9yIHIuZW5kQ29udGFpbmVyID09IGlucCkgYW5kIGlzQ2hyb21lXG4gICAgICAgICAgICAgICAgY3MgPSBBcnJheTo6c2xpY2UuY2FsbCBjaGlsZHNcbiAgICAgICAgICAgICAgICAjIGN1cnJlbnQgdGV4dCBub2RlLCB0aGVuIHJpZ2h0LCB0aGUgbGVmdC5cbiAgICAgICAgICAgICAgICBpc1RleHQgPSAobikgLT4gaWYgbj8ubm9kZVR5cGUgPT0gMyB0aGVuIG4gZWxzZSBudWxsXG4gICAgICAgICAgICAgICAgaSA9IHIuc3RhcnRPZmZzZXRcbiAgICAgICAgICAgICAgICBuID0gaXNUZXh0KGNzW2ldKSA/IGlzVGV4dChjc1tpICsgMV0pID8gaXNUZXh0KGNzW2kgLSAxXSlcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3MgciBpZiBuXG4gICAgICAgICAgICAjIGZpcmVmb3ggbWFuYWdlcyB0byBmb2N1cyBhbnl0aGluZyBidXQgdGhlIG9ubHlcbiAgICAgICAgICAgICMgY29udGVudGVkaXRhYmxlPXRydWUgb2YgdGhlIHBpbGxcbiAgICAgICAgICAgIHBhcmVuID0gci5zdGFydENvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgICAgICAgICBpZiBwYXJlbj8ubm9kZU5hbWUgIT0gJ1NQQU4nIGFuZCBwaWxsID0gcGlsbGZvciBwYXJlblxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAjIHJlbW92ZSBhbnkgbmVzdGVkIHNwYW4gaW4gcGlsbHNcbiAgICAgICAgJGVsLmZpbmQoJy50dGJveC1waWxsIHNwYW4gc3BhbicpLnJlbW92ZSgpXG4gICAgICAgICMga2VlcCBjYWNoZSBjbGVhblxuICAgICAgICB0aWR5cGlsbHMoKVxuICAgICAgICBudWxsXG5cbiMgdXNlIGpxdWVyeSByZW5kZXIgZGVmYXVsdFxuZGVmIHR0Ym94LCByZW5kZXI6IHR0Ym94LmpxdWVyeVxuXG4jIEV4cG9ydCB0aGUgbW9kdWxlIGluIHZhcmlvdXMgZGlmZmVyZW50IHdheXNcbmlmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCdcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHR0Ym94XG5lbHNlIGlmIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyBhbmQgZGVmaW5lLmFtZFxuICAgIGRlZmluZSAtPiB0dGJveFxuZWxzZVxuICAgIHRoaXMudHRib3ggPSB0dGJveFxuIl19