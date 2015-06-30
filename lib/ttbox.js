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
      return render.unsuggest();
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

//# sourceMappingURL=data:application/json;base64,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UCxHQUFpQixNQURyQjtHQUFBLE1BRUssSUFBRyxPQUFPLE1BQVAsS0FBaUIsVUFBakIsSUFBZ0MsTUFBTSxDQUFDLEdBQTFDO0lBQ0QsTUFBQSxDQUFPLFNBQUE7YUFBRztJQUFILENBQVAsRUFEQztHQUFBLE1BQUE7SUFHRCxJQUFJLENBQUMsS0FBTCxHQUFhLE1BSFo7O0FBeHdCTCIsImZpbGUiOiJ0dGJveC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImdsb2IgPSBnbG9iYWwgPyB3aW5kb3dcblxuZG9jICAgPSBnbG9iLmRvY3VtZW50XG5JICAgICA9IChhKSAtPiBhXG5tZXJnZSA9ICh0LCBvcy4uLikgLT4gdFtrXSA9IHYgZm9yIGssdiBvZiBvIHdoZW4gdiAhPSB1bmRlZmluZWQgZm9yIG8gaW4gb3M7IHRcbmxhdGVyID0gKGZuKSAtPiBzZXRUaW1lb3V0IGZuLCAxXG5ob2xkICA9IChtcywgZikgLT4gbGFzdCA9IDA7IHRpbSA9IG51bGw7IChhcy4uLikgLT5cbiAgICBjbGVhclRpbWVvdXQgdGltIGlmIHRpbVxuICAgIHRpbSA9IHNldFRpbWVvdXQgKC0+ZiBhcy4uLiksIG1zXG5sYXN0ICA9IChhcykgLT4gYXM/W2FzLmxlbmd0aCAtIDFdXG5maW5kICA9IChhcywgZm4pIC0+IHJldHVybiBhIGZvciBhIGluIGFzIHdoZW4gZm4oYSlcblxuaXNJRSAgICAgID0gZ2xvYi5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUnKSA+IDBcbmlzQ2hyb21lICA9IGdsb2IubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA+IDBcblxuIyBkZWZpbmUgYW4gaW52aXNpYmxlIHByb3BlcnR5XG5kZWYgPSAob2JqLCBwcm9wcykgLT4gZm9yIG5hbWUsIHZhbHVlIG9mIHByb3BzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iaiwgbmFtZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICBudWxsXG5cbnp3bmogICAgICAgICA9IFwi4oCLXCIgIyAmenduajtcbmZpbHRlckEwICAgICA9IChzKSAtPiBzLnJlcGxhY2UgL1xcdTAwYTAvZywgJyAnICMgbmJzcFxuZmlsdGVyWnduaiAgID0gKHMpIC0+IHMucmVwbGFjZSAvXFx1MjAwYi9nLCAnJ1xuZmlsdGVyICAgICAgID0gKHMpIC0+IGZpbHRlckEwIGZpbHRlclp3bmogc1xuYXBwZW5kQWZ0ZXIgID0gKGVsLCBub2RlKSAtPiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBlbC5uZXh0U2libGluZylcbmFwcGVuZEJlZm9yZSA9IChlbCwgbm9kZSkgLT4gZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgZWwpXG5oZXhkdW1wICAgICAgPSAocykgLT4gKGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikgZm9yIGMgaW4gcykuam9pbignICcpXG5cbiMgaW5qZWN0IGNzc1xuZG8gLT5cbiAgICBzdHlsZXMgPSBcIlxuLnR0Ym94ICoge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgd2lkdGg6IGF1dG87XG59XG5cbi50dGJveCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi50dGJveC1vdmVyZmxvdyB7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2JiYjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgb3ZlcmZsb3cteDogYXV0bztcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG4udHRib3gtb3ZlcmZsb3c6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuLnR0Ym94LXNob3dpbmctc3VnZ2VzdCAudHRib3gtb3ZlcmZsb3cge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG5cbi50dGJveC1pbnB1dCB7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuLnR0Ym94LWlucHV0ICoge1xuICAgIG91dGxpbmU6IG5vbmU7XG59XG5cbi50dGJveC1pbnB1dCAqIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi50dGJveC1pbnB1dCBiciB7XG4gICAgZGlzcGxheTogaW5saW5lO1xufVxuXG4udHRib3gtc3VnLW92ZXJmbG93IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICBib3JkZXItdG9wOiBub25lO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLXRvcDogbm9uZTtcbiAgICBib3gtc2hhZG93OiAwIDJweCAycHggcmdiYSgwLDAsMCwwLjMpO1xuICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLnR0Ym94LXN1Z2dlc3Qge1xuICAgIG1pbi1oZWlnaHQ6IDVweDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBsaW5lLWhlaWdodDogMzhweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpmaXJzdC1jaGlsZCB7XG4gICAgcGFkZGluZy10b3A6IDVweDtcbn1cbi50dGJveC1zdWdnZXN0ID4gLnR0Ym94LXN1Z2dlc3QtaXRlbTpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNXB4O1xufVxuLnR0Ym94LXN1Z2dlc3QtaXRlbSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDAgMTBweCAwIDI1cHg7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIGRmbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1pbi13aWR0aDogNzBweDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4udHRib3gtc3VnZ2VzdC1pdGVtIHNwYW4ge1xuICAgIGNvbG9yOiAjY2NjO1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1vLXVzZXItc2VsZWN0OiBub25lO1xufVxuLnR0Ym94LXN1Z2dlc3QtZGl2aWRlciBzcGFuIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgei1pbmRleDogMTtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBjb2xvcjogIzkyOTI5MjtcbiAgICBwYWRkaW5nLXJpZ2h0OiAyMHB4O1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbn1cbi50dGJveC1zdWdnZXN0LWRpdmlkZXIgaHIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBtYXJnaW4tdG9wOiAxLjE1ZW07XG4gICAgbGVmdDogMjBweDtcbiAgICByaWdodDogMTBweDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2RkZDtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xufVxuLnR0Ym94LXNlbGVjdGVkIHtcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xufVxuXG4udHRib3gtcGlsbCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjg7XG4gICAgbWFyZ2luOiAwIDRweDtcbiAgICBiYWNrZ3JvdW5kOiAjNWNiODVjO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICM1OGI2NTg7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIG1pbi13aWR0aDogMzBweDtcbn1cbi50dGJveC1waWxsIGRmbiB7XG4gICAgcGFkZGluZzogMCAzcHggMCAxNHB4O1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLnR0Ym94LXBpbGwtcHJlZml4IGRmbiB7XG4gICAgcGFkZGluZy1yaWdodDogMDtcbn1cbi50dGJveC1waWxsLWNsb3NlIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMC4xZW07XG4gICAgbGVmdDogN3B4O1xuICAgIHBhZGRpbmc6IDNweDtcbiAgICBsaW5lLWhlaWdodDogMTVweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcbn1cbi50dGJveC1waWxsIHNwYW4ge1xuICAgIG1pbi13aWR0aDogNXB4O1xufVxuXCJcbiAgICBjc3MgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIGNzcy50eXBlID0gJ3RleHQvY3NzJ1xuICAgIGNzcy5pbm5lckhUTUwgPSBzdHlsZXNcbiAgICBkb2MuaGVhZC5hcHBlbmRDaGlsZCBjc3NcblxuY2xhc3MgVHlwZSB0aGVuIGNvbnN0cnVjdG9yOiAoQG5hbWUsIG9wdHMpIC0+IG1lcmdlIEAsIHtmb3JtYXQ6SX0sIG9wdHNcbmNsYXNzIFRyaWdnZXIgdGhlbiBjb25zdHJ1Y3RvcjogKEBzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIG1lcmdlIEAsIG9wdHNcbiAgICBAdHlwZXMgPSBpZiBBcnJheS5pc0FycmF5IHR5cGVzIHRoZW4gdHlwZXMgZWxzZSBbdHlwZXNdXG4gICAgIyBzZXQgYmFjayByZWZlcmVuY2VcbiAgICB0LnRyaWcgPSB0aGlzIGZvciB0IGluIEB0eXBlc1xuICAgIGlmIEBwcmVmaXhcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudCBoYXZlIG11bHRpcGxlIHR5cGVzIHdpdGggcHJlZml4IHRyaWdnZXJcIikgaWYgQHR5cGVzLmxlbmd0aCA+IDFcbiAgICAgICAgQHJlID0gUmVnRXhwIFwiXigpXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuICAgIGVsc2VcbiAgICAgICAgQHJlID0gUmVnRXhwIFwiXihcXFxcdyopXFxcXCN7QHN5bWJvbH0oXFxcXHcqKSRcIlxuXG4jIFNraXAgenduaiBjaGFycyB3aGVuIG1vdmluZyBsZWZ0L3JpZ2h0XG5za2lwWnduaiA9IChkLCBlbmQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKClcbiAgICBuID0gaWYgZW5kIHRoZW4gci5lbmRDb250YWluZXIgZWxzZSByLnN0YXJ0Q29udGFpbmVyXG4gICAgaSA9IGlmIGVuZCB0aGVuIHIuZW5kT2Zmc2V0IGVsc2Ugci5zdGFydE9mZnNldFxuICAgIHJldHVybiB1bmxlc3Mgbi5ub2RlVHlwZSA9PSAzXG4gICAgYyA9IG4ubm9kZVZhbHVlLmNoYXJDb2RlQXQgKGlmIGQgPCAwIHRoZW4gaSArIGQgZWxzZSBpKVxuICAgIGlmIGMgPT0gODIwM1xuICAgICAgICAjIG1vdmVcbiAgICAgICAgc2V0Q3Vyc29yUG9zIHIsIGkgKyBkXG4gICAgICAgIHNraXBad25qIGQsIGVuZCAjIGFuZCBtYXliZSBjb250aW51ZSBtb3Zpbmc/XG5cbiMgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbmN1cnNvciA9IC0+IHMgPSBkb2MuZ2V0U2VsZWN0aW9uKCk7IGlmIHMucmFuZ2VDb3VudCB0aGVuIHMuZ2V0UmFuZ2VBdCgwKSBlbHNlIG51bGxcblxuIyBmaWx0ZXIgdGhlIHJhbmdlIHRvIGdldCByaWQgb2YgdW53YW50ZWQgY2hhcnNcbnJhbmdlU3RyID0gKHIpIC0+IGZpbHRlciByLnRvU3RyaW5nKClcblxuZmlyc3RJc1doaXRlID0gKHMpIC0+IC9eXFxzLiovLnRlc3QocyA/ICcnKVxubGFzdElzV2hpdGUgID0gKHMpIC0+IC8uKlxccyQvLnRlc3QocyA/ICcnKVxuXG53b3JkUmFuZ2VBdEN1cnNvciA9IC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHIgPSBjdXJzb3IoKVxuICAgIHQgPSByLmNsb25lUmFuZ2UoKVxuICAgICMgZXhwYW5kIGJlZ2lubmluZ1xuICAgIHdoaWxlIHQuc3RhcnRPZmZzZXQgPiAwIGFuZCBub3QgZmlyc3RJc1doaXRlIHJhbmdlU3RyIHRcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCB0LnN0YXJ0T2Zmc2V0IC0gMVxuICAgICMgb25lIGZvcndhcmQgYWdhaW5cbiAgICB0LnNldFN0YXJ0IHQuc3RhcnRDb250YWluZXIsIHQuc3RhcnRPZmZzZXQgKyAxIGlmIGZpcnN0SXNXaGl0ZSByYW5nZVN0ciB0XG4gICAgIyBleHBhbmQgZW5kXG4gICAgbGVuID0gdC5lbmRDb250YWluZXI/Lm5vZGVWYWx1ZT8ubGVuZ3RoID8gMFxuICAgIHdoaWxlIHQuZW5kT2Zmc2V0IDwgbGVuIGFuZCBub3QgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgICAgICB0LnNldEVuZCB0LmVuZENvbnRhaW5lciwgdC5lbmRPZmZzZXQgKyAxXG4gICAgIyBvbmUgYmFjayBhZ2FpblxuICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCB0LmVuZE9mZnNldCAtIDEgaWYgbGFzdElzV2hpdGUgcmFuZ2VTdHIgdFxuICAgIHJldHVybiB0XG5cbmVudGlyZVRleHRBdEN1cnNvciA9IC0+XG4gICAgciA9IGN1cnNvcigpXG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgdC5zZWxlY3ROb2RlQ29udGVudHMgdC5zdGFydENvbnRhaW5lclxuICAgIHJldHVybiB0XG5cbmZpbmRJblJhbmdlID0gKHIsIGNoYXIpIC0+XG4gICAgdCA9IHIuY2xvbmVSYW5nZSgpXG4gICAgbWF4ID0gKHQuZW5kQ29udGFpbmVyPy5ub2RlVmFsdWU/Lmxlbmd0aCA/IDApIC0gMVxuICAgIGZvciBpIGluIFt0LnN0YXJ0T2Zmc2V0Li5tYXhdIGJ5IDFcbiAgICAgICAgdC5zZXRTdGFydCB0LnN0YXJ0Q29udGFpbmVyLCBpXG4gICAgICAgIHQuc2V0RW5kIHQuZW5kQ29udGFpbmVyLCBpICsgMVxuICAgICAgICByZXR1cm4gaSBpZiB0LnRvU3RyaW5nKCkgPT0gY2hhclxuICAgIHJldHVybiAtMVxuXG5zZXRDdXJzb3JQb3MgPSAociwgcG9zKSAtPlxuICAgIHQgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHQuc2V0U3RhcnQgci5zdGFydENvbnRhaW5lciwgcG9zXG4gICAgdC5zZXRFbmQgci5lbmRDb250YWluZXIsIHBvc1xuICAgIHNlbCA9IGRvYy5nZXRTZWxlY3Rpb24oKVxuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgIHNlbC5hZGRSYW5nZSB0XG5cbnNldEN1cnNvckVsID0gKGVsKSAtPlxuICAgIHIgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuICAgIHIuc2VsZWN0Tm9kZUNvbnRlbnRzIGVsXG4gICAgc2V0Q3Vyc29yUG9zIHIsIDBcblxuIyBGdW5jdGlvbiB0byBtYWtlIHR0Ym94IG91dCBvZiBhbiBlbGVtZW50IHdpdGggdHJpZ2dlcnNcbiNcbnR0Ym94ID0gKGVsLCB0cmlncy4uLikgLT5cblxuICAgICMgbG9jYWwgcmVmZXJlbmNlIHRvIHJlbmRlciBwbHVnXG4gICAgcmVuZGVyID0gdHRib3gucmVuZGVyKClcblxuICAgICMgbGV0IHJlbmRlciBkZWNpZGUgd2UgaGF2ZSBhIGdvb2QgZWxcbiAgICBlbCA9IHJlbmRlci5pbml0KGVsKVxuXG4gICAgIyBhbmQgY2hlY2sgd2UgZ290IGEgZ29vZCB0aGluZyBiYWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgRElWJykgdW5sZXNzIGVsLnRhZ05hbWUgPT0gJ0RJVidcblxuICAgICMgZXhwb3NlZCBvcGVyYXRpb25zXG4gICAgZmHDp2FkZSA9IHtcbiAgICAgICAgdmFsdWVzOiByZW5kZXIudmFsdWVzXG4gICAgICAgIGFkZHBpbGw6ICh0eXBlLCBpdGVtKSAtPiByZW5kZXIucGlsbGlmeSBjdXJzb3IoKSwgdHlwZSwgaXRlbSwgZGlzcGF0Y2hcbiAgICB9XG5cbiAgICAjIGRpc3BhdGNoIGV2ZW50cyBvbiBpbmNvbWluZyBkaXZcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50ICdFdmVudCdcbiAgICAgICAgbWVyZ2UgZSwgb3B0cywge3R0Ym94OmZhw6dhZGV9XG4gICAgICAgIGUuaW5pdEV2ZW50IFwidHRib3g6I3tuYW1lfVwiLCB0cnVlLCBmYWxzZVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50IGVcblxuICAgIHVwZGF0ZSA9IGhvbGQgMywgKGNoYXIpIC0+XG4gICAgICAgICMgYSBwaWxsIGVkaXQgdHJ1bWZzIGFsbFxuICAgICAgICByZXR1cm4gaWYgaGFuZGxlcGlsbCgpXG4gICAgICAgICMgY3Vyc29yIHJhbmdlIGZvciB3b3JkXG4gICAgICAgIHIgPSB3b3JkUmFuZ2VBdEN1cnNvcigpXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyKVxuICAgICAgICAjIGEgdHJpZ2dlciBpbiB0aGUgd29yZD9cbiAgICAgICAgdHJpZyA9IGZpbmQgdHJpZ3MsICh0KSAtPiB0LnJlLnRlc3Qgd29yZFxuICAgICAgICAjIG5vIHRyaWdnZXIgZm91bmQgaW4gY3VycmVudCB3b3JkLCBhYm9ydFxuICAgICAgICB1bmxlc3MgdHJpZ1xuICAgICAgICAgICAgc3RvcHN1Zz8oKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICMgZXhlYyB0cmlnZ2VyIHRvIGdldCBwYXJ0c1xuICAgICAgICBbXywgdHlwZW5hbWUsIHZhbHVlXSA9IHRyaWcucmUuZXhlYyB3b3JkXG4gICAgICAgICMgZmluZCBwb3NzaWJsZSB0eXBlc1xuICAgICAgICB0eXBlcyA9IHRyaWcudHlwZXMuZmlsdGVyICh0KSAtPiB0cmlnLnByZWZpeCBvciB0Lm5hbWU/LmluZGV4T2YodHlwZW5hbWUpID09IDBcbiAgICAgICAgIyBoYW5kIG9mZiB0byBkZWFsIHdpdGggZm91bmQgaW5wdXRcbiAgICAgICAgaGFuZGxldHlwZXMgciwgdHJpZywgdHlwZXMsIGNoYXJcblxuICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICBzZXRTdWdtb3ZlciA9IChfc3VnbW92ZXIpIC0+IHN1Z21vdmVyID0gX3N1Z21vdmVyXG4gICAgc3RvcHN1ZyA9IC0+XG4gICAgICAgIHN1Z3NlbGVjdCA9IHN1Z21vdmVyID0gc3Vnd29yZCA9IG51bGxcbiAgICAgICAgcmVuZGVyLnVuc3VnZ2VzdCgpXG5cbiAgICAjIGNsb3NlIHN1Z2dlc3Qgd2hlbiBwaWxscyBsZWF2ZVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3R0Ym94OnBpbGxyZW1vdmUnLCBzdG9wc3VnXG4gICAgIyBjbG9zZSBzdWdnZXN0IHdoZW4gcGlsbCBsb3NlIGZvY3VzXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAndHRib3g6cGlsbGZvY3Vzb3V0Jywgc3RvcHN1Z1xuXG4gICAgaGFuZGxldHlwZXMgPSAocmFuZ2UsIHRyaWcsIHR5cGVzLCBjaGFyKSAtPlxuICAgICAgICAjIHRoZSB0cmlnZ2VyIHBvc2l0aW9uIGluIHRoZSB3b3JkIHJhbmdlXG4gICAgICAgIHRwb3MgPSBmaW5kSW5SYW5nZSByYW5nZSwgdHJpZy5zeW1ib2xcbiAgICAgICAgIyBubyB0cG9zPyFcbiAgICAgICAgcmV0dXJuIGlmIHRwb3MgPCAwXG4gICAgICAgICMgcmFuZ2UgZm9yIHR5cGUgbmFtZSAod2hpY2ggbWF5IG5vdCBiZSB0aGUgZW50aXJlIG5hbWUpXG4gICAgICAgIHRyYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKVxuICAgICAgICB0cmFuZ2Uuc2V0RW5kIHRyYW5nZS5lbmRDb250YWluZXIsIHRwb3NcbiAgICAgICAgIyB3aGV0aGVyIHRoZSBsYXN0IGlucHV0IHdhcyB0aGUgdHJpZ2dlclxuICAgICAgICB3YXN0cmlnID0gY2hhciA9PSB0cmlnLnN5bWJvbFxuICAgICAgICAjIGhlbHBlciB3aGVuIGZpbmlzaGVkIHNlbGVjdGluZyBhIHR5cGVcbiAgICAgICAgc2VsZWN0VHlwZSA9ICh0eXBlKSAtPlxuICAgICAgICAgICAgcmVuZGVyLnBpbGxpZnkgcmFuZ2UsIHR5cGUsIG51bGwsIGRpc3BhdGNoXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlc2VsZWN0Jywge3RyaWcsIHR5cGV9XG4gICAgICAgIGlmIHR5cGVzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBzdG9wc3VnKClcbiAgICAgICAgZWxzZSBpZiB0eXBlcy5sZW5ndGggPT0gMSBhbmQgbm90IHN1Z21vdmVyXG4gICAgICAgICAgICAjIG9uZSBwb3NzaWJsZSBzb2x1dGlvblxuICAgICAgICAgICAgaWYgd2FzdHJpZ1xuICAgICAgICAgICAgICAgICMgZm9yIHRyaWdnZXIgY2hhciwgd2Ugc2VsZWN0IHRoZSBmaXJzdCB0eXBlIHN0cmFpZ2h0IGF3YXlcbiAgICAgICAgICAgICAgICBzZWxlY3RUeXBlIGZpbmQgdHlwZXMsICh0KSAtPiAhdC5kaXZpZGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgd2hlbiB0aGUga2V5IGlucHV0IHdhcyB0aGUgdHJpZ2dlciBhbmQgdGhlcmUgYXJlXG4gICAgICAgICAgICAjIG11bHRpcGxlIHBvc3NpYmxlIHZhbHVlcywgcG9zaXRpb24uIG1vdmUgdG8ganVzdCBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIHRyaWdnZXIgY2hhci5cbiAgICAgICAgICAgIGlmIHdhc3RyaWdcbiAgICAgICAgICAgICAgICAjIG1vdmUgdGhlIGN1cnNvciB0byBhbGxvdyBmb3Igc3VnZ2VzdCBpbnB1dFxuICAgICAgICAgICAgICAgIHNldEN1cnNvclBvcyByYW5nZSwgdHBvc1xuICAgICAgICAgICAgIyBzdGFydCBhIHN1Z2dlc3QgZm9yIGN1cnJlbnQgcG9zc2libGUgdHlwZXNcbiAgICAgICAgICAgIHR5cGVzdWdnZXN0IHRyYW5nZSwgdHBvcywgdHJpZywgc2VsZWN0VHlwZSwgdHlwZXNcblxuXG4gICAgIyBzdWdnZXN0IGZvciBnaXZlbiB0eXBlc1xuICAgIHR5cGVzdWdnZXN0ID0gKHJhbmdlLCB0cG9zLCB0cmlnLCBzZWxlY3RUeXBlLCB0eXBlcykgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBoZWxwZXIgdG8gY3JlYXRlIHN1Z3NlbGVjdCBmdW5jdGlvbnNcbiAgICAgICAgc3Vnc2VsZWN0Zm9yID0gKGl0ZW0pIC0+IC0+XG4gICAgICAgICAgICAjIHN0b3Agc3VnZ2VzdGluZ1xuICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAjIHRoZSB0eXBlIGlzIHNlbGVjdGVkXG4gICAgICAgICAgICBzZWxlY3RUeXBlIGl0ZW1cbiAgICAgICAgICAgIHJldHVybiB0cnVlICMgaW5kaWNhdGUgaGFuZGxlZFxuICAgICAgICAjIGZ1bmN0aW9uIHRoYXQgc3VnZ2VzdCB0eXBlc1xuICAgICAgICBmbnR5cGVzID0gKF8sIGNiKSAtPiBjYiB0eXBlc1xuICAgICAgICAjIGlmIHRoZXJlIGlzIG9ubHkgb25lLCBzZXQgaXQgYXMgcG9zc2libGUgZm9yIHJldHVybiBrZXlcbiAgICAgICAgc3Vnc2VsZWN0ID0gc3Vnc2VsZWN0Zm9yIHR5cGVzWzBdIGlmIHR5cGVzLmxlbmd0aCA9PSAxXG4gICAgICAgICMgcmVuZGVyIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudHlwZXMsIHJhbmdlLCAtMSwgc2V0U3VnbW92ZXIsICh0eXBlLCBkb3NldCkgLT5cbiAgICAgICAgICAgIHN1Z3NlbGVjdCA9IHN1Z3NlbGVjdGZvciB0eXBlXG4gICAgICAgICAgICBzdWdzZWxlY3QoKSBpZiBkb3NldFxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlJywge3RyaWcsIHR5cGV9XG4gICAgICAgICMgdGVsbCB0aGUgd29ybGRcbiAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3R0eXBlcycsIHt0cmlnLCB0eXBlc31cblxuICAgIGhhbmRsZXBpbGwgPSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIHIgPSBlbnRpcmVUZXh0QXRDdXJzb3IoKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHBpbGwgPSByZW5kZXIucGlsbGZvcihyLnN0YXJ0Q29udGFpbmVyPy5wYXJlbnROb2RlKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHR5cGVvZiBwaWxsLnR5cGU/LnN1Z2dlc3QgPT0gJ2Z1bmN0aW9uJyAjIGRlZmluaXRlbHkgYSBzdWdnZXN0XG4gICAgICAgICMgdGhlIGN1cnJlbnQgd29yZFxuICAgICAgICB3b3JkID0gcmFuZ2VTdHIocilcbiAgICAgICAgIyBkb250IHN1Z2dlc3QgZm9yIHNhbWUgd29yZFxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBzdWd3b3JkID09IHdvcmRcbiAgICAgICAgc3Vnd29yZCA9IHdvcmRcbiAgICAgICAgIyBzdWdnZXN0IGZ1bmN0aW9uIGFzIGZuIHRvIHJlbmRlci5zdWdnZXN0XG4gICAgICAgIGZudmFscyA9ICh3b3JkLCBjYikgLT4gcGlsbC50eXBlLnN1Z2dlc3Qgd29yZCwgY2IsIHBpbGwudHlwZSwgcGlsbC50cmlnXG4gICAgICAgICMgaGVscGVyIHdoZW4gd2UgZGVjaWRlIG9uIGFuIGl0ZW1cbiAgICAgICAgc2VsZWN0SXRlbSA9IChpdGVtKSAtPlxuICAgICAgICAgICAgcGlsbC5zZXRJdGVtIGl0ZW1cbiAgICAgICAgICAgICMgbGF0ZXIgc2luY2UgaXQgbWF5IGJlIHNlbGVjdCBmcm9tIGNsaWNrLCB3aGljaCBpcyBtb3VzZWRvd25cbiAgICAgICAgICAgIGxhdGVyIC0+IHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICAgICAgZGlzcGF0Y2ggJ3N1Z2dlc3RpdGVtc2VsZWN0Jywge3BpbGwsIGl0ZW19XG4gICAgICAgIHJlbmRlci5zdWdnZXN0IGZudmFscywgciwgLTEsIHNldFN1Z21vdmVyLCAoaXRlbSwgZG9zZXQpIC0+XG4gICAgICAgICAgICBzdWdzZWxlY3QgPSAtPlxuICAgICAgICAgICAgICAgICMgc3RvcCBzdWdnZXN0aW5nXG4gICAgICAgICAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgICAgICAgICAgIyBzZWxlY3QgdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtIGl0ZW1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZSAjIGluZGljYXRlIGhhbmRsZWRcbiAgICAgICAgICAgIHN1Z3NlbGVjdCgpIGlmIGRvc2V0XG4gICAgICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW0nLCB7cGlsbCwgaXRlbX1cbiAgICAgICAgIyB0ZWxsIHRoZSB3b3JsZCBhYm91dCBpdFxuICAgICAgICBkaXNwYXRjaCAnc3VnZ2VzdGl0ZW1zJywge3BpbGx9XG4gICAgICAgIHJldHVybiB0cnVlICMgc2lnbmFsIHdlIGRlYWx0IHdpdGggaXRcblxuICAgICMgbW92ZSB0aGUgaW5wdXQgb3V0IG9mIGEgcGlsbCAoaWYgd2UncmUgaW4gYSBwaWxsKVxuICAgIHBpbGxqdW1wID0gLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyByID0gY3Vyc29yKClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwaWxsID0gcmVuZGVyLnBpbGxmb3Ioci5zdGFydENvbnRhaW5lcj8ucGFyZW50Tm9kZSlcbiAgICAgICAgc3RvcHN1ZygpXG4gICAgICAgIHBpbGwuc2V0Q3Vyc29yQWZ0ZXIoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICBoYW5kbGVycyA9XG4gICAgICAgIGtleWRvd246ICAoZSkgLT5cblxuICAgICAgICAgICAgIyB0aGlzIGRvZXMgYW4gaW1wb3J0YW50IGVsLm5vcm1hbGl6ZSgpIHRoYXQgZW5zdXJlcyB3ZSBoYXZlXG4gICAgICAgICAgICAjIGNvbnRpZ3VvdXMgdGV4dCBub2RlcywgY3J1Y2lhbCBmb3IgdGhlIHJhbmdlIGxvZ2ljLlxuICAgICAgICAgICAgcmVuZGVyLnRpZHkoKVxuXG4gICAgICAgICAgICBpZiBlLmtleUNvZGUgPT0gMTNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBkb250IHdhbnQgRE9NIGNoYW5nZVxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBzdWdzZWxlY3Q/KClcbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgcGlsbGp1bXAoKVxuXG4gICAgICAgICAgICBpZiBzdWdtb3ZlclxuICAgICAgICAgICAgICAgIGlmIGUua2V5Q29kZSA9PSAzOCAgICAgICMgdXBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigtMSlcbiAgICAgICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSA9PSA0MCAjIGRvd25cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpICAjIG5vIGN1cnNvciBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWdtb3ZlcigrMSlcblxuICAgICAgICAgICAgaWYgZS5rZXlDb2RlIGluIFszNywgOF1cbiAgICAgICAgICAgICAgICBza2lwWnduaiAtMSwgZS5zaGlmdEtleSAjIHNraXAgenduaiBiYWNrd2FyZHMgdG8gZmlyc3Qgbm9uLXp3bmogcG9zXG4gICAgICAgICAgICBlbHNlIGlmIGUua2V5Q29kZSBpbiBbMzksIDQ2XVxuICAgICAgICAgICAgICAgIHNraXBad25qICsxLCBlLnNoaWZ0S2V5ICMgc2tpcCB6d25qIGZvcndhcmRzIHRvIGZpcnN0IG5vbi16d25qIHBvc1xuXG4gICAgICAgICAgICB1cGRhdGUoKSAjIGRvIGFuIHVwZGF0ZSwgYnV0IG1heSBjYW5jZWwgd2l0aCBrZXlwcmVzcyB0byBnZXQgY2hhclxuXG4gICAgICAgICAgICAjIGFuZCBrZWVwIG1ha2Ugc3VyZSBpdCdzIHRpZHlcbiAgICAgICAgICAgIGxhdGVyIC0+IHJlbmRlci50aWR5KClcblxuICAgICAgICBrZXlwcmVzczogKGUpIC0+XG4gICAgICAgICAgICAjIGNhbmNlbCBwcmV2aW91cyB1cGRhdGUgc2luY2Ugd2UgaGF2ZSBhIGNoYXJjb2RlXG4gICAgICAgICAgICB1cGRhdGUgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKVxuXG4gICAgIyBmaXJzdCBkcmF3aW5nXG4gICAgZG8gZHJhdyA9IC0+XG4gICAgICAgICMgZHJhdyBhbmQgYXR0YWNoIGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci5kcmF3IGhhbmRsZXJzXG4gICAgICAgIHJlbmRlci50aWR5KClcblxuICAgICMgZmlyc3QgZXZlbnRcbiAgICBsYXRlciAtPiBkaXNwYXRjaCAnaW5pdCdcblxuICAgICMgcmV0dXJuIHRoZSBmYWNhZGUgdG8gaW50ZXJhY3RcbiAgICByZXR1cm4gZmHDp2FkZVxuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgbWFraW5nIHRyaWdnZXJzLlxuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHJpZzEgPSB0dGJveC50cmlnKCc6JywgdHlwZXMpO1xuIyAgIHZhciB0cmlnMSA9IHR0Ym94LnRyaWcoJ0AnLCB7cHJlZml4OiB0cnVlfSwgdHlwZXMpO1xudHRib3gudHJpZyA9IChzeW1ib2wsIG9wdHMsIHR5cGVzKSAtPlxuICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMlxuICAgICAgICB0eXBlcyA9IG9wdHNcbiAgICAgICAgb3B0cyA9IHt9XG4gICAgbmV3IFRyaWdnZXIgc3ltYm9sLCBvcHRzLCB0eXBlc1xuXG5cbiMgRmFjdG9yeSBmdW5jdGlvbiBmb3IgZGl2aWRlcnMgaW4gdHlwZSBsaXN0c1xuI1xuIyBVc2FnZTpcbiMgICB2YXIgdHlwZXMgPSBbXG4jICAgICB0dGJveC5kaXZpZGVyKCdMaW1pdCBzZWFyY2ggb24nKSxcbiMgICAgIHR0Ym94LnR5cGUoJ3Byb2R1Y3QnLCB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgICB0dGJveC50eXBlKCdwZXJzb24nLCAge3N1Z2dlc3Q6IGZ1bmN0aW9uICh0eHQsIGNhbGxiYWNrLCBvcHRzKSB7IC4uLiB9IH0pLFxuIyAgIF1cbnR0Ym94LmRpdmlkZXIgPSAobmFtZSwgb3B0cykgLT4gbmV3IFR5cGUgbmFtZSwgbWVyZ2Uge1xuICAgIGRpdmlkZXI6dHJ1ZVxuICAgIGh0bWw6IC0+IFwiPGRpdj48aHI+PHNwYW4+I3tAbmFtZX08L3NwYW4+PC9kaXY+XCJcbn0sIG9wdHNcblxuXG4jIEZhY3RvcnkgZnVuY3Rpb24gZm9yIG1ha2luZyB0eXBlcy5cbiNcbiMgVXNhZ2U6XG4jICAgdmFyIHR5cGVzID0gW1xuIyAgICAgdHRib3gudHlwZSgncHJvZHVjdCcsIHtzdWdnZXN0OiBmdW5jdGlvbiAodHh0LCBjYWxsYmFjaywgb3B0cykgeyAuLi4gfSB9KSxcbiMgICAgIHR0Ym94LnR5cGUoJ3BlcnNvbicsICB7c3VnZ2VzdDogZnVuY3Rpb24gKHR4dCwgY2FsbGJhY2ssIG9wdHMpIHsgLi4uIH0gfSksXG4jICAgXVxudHRib3gudHlwZSA9IChuYW1lLCBvcHRzLCB0eXBlcykgLT4gbmV3IFR5cGUgbmFtZSwgb3B0c1xuXG5cbiMgSGVscGVyIG1ldGhvZCB0byBtYWtlIGh0bWwgZm9yIGEgc3VnZ2VzdC5cbiMgXCI8ZGl2PjxkZm4+PGI+d29yZDwvYj5pc3BhcnRvZjwvZGZuPjogc29tZSBkZXNjcmlwdGlvbjwvZGl2PlwiXG5zdWdnZXN0SHRtbCA9ICh3b3JkLCBwcmVmaXgsIG5hbWUsIHN1ZmZpeCwgZGVzYyA9ICcnKSAtPlxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nIHVubGVzcyBuYW1lXG4gICAgW2hpZ2gsIHVuaGlnaF0gPSBpZiBuYW1lLmluZGV4T2Yod29yZCkgPT0gMCB0aGVuIFt3b3JkLCBuYW1lW3dvcmQubGVuZ3RoLi5dXSBlbHNlIFtcIlwiLCBuYW1lXVxuICAgIFwiPGRpdj48ZGZuPiN7cHJlZml4fTxiPiN7aGlnaH08L2I+I3t1bmhpZ2h9I3tzdWZmaXh9PC9kZm4+IDxzcGFuPiN7ZGVzY308L3NwYW4+PC9kaXY+XCJcblR5cGU6Omh0bWwgPSAod29yZCkgLT5cbiAgICBpZiBAdHJpZy5wcmVmaXhcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgQHRyaWcuc3ltYm9sLCBAbmFtZSwgXCJcIiwgQGRlc2NcbiAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3RIdG1sIHdvcmQsIFwiXCIsIEBuYW1lLCBAdHJpZy5zeW1ib2wsIEBkZXNjXG5cblxuIyBnb2VzIHRocm91Z2ggYW4gZWxlbWVudCBwYXJzaW5nIHBpbGxzIGFuZFxuIyB0ZXh0IGludG8gYSBkYXRhc3RydWN0dXJlXG4jIGhlbHBlciB0byB0dXJuIGEgc3VnZ2VzdCBpdGVtIGludG8gaHRtbFxudG9IdG1sID0gKHdvcmQpIC0+IChpdGVtKSAtPlxuICAgIGlmIHR5cGVvZiBpdGVtPy5odG1sID09ICdmdW5jdGlvbidcbiAgICAgICAgaXRlbS5odG1sKHdvcmQpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgc3VnZ2VzdEh0bWwgd29yZCwgXCJcIiwgaXRlbS52YWx1ZSwgXCJcIiwgaXRlbS5kZXNjXG4gICAgZWxzZVxuICAgICAgICBzdWdnZXN0SHRtbCB3b3JkLCBcIlwiLCBpdGVtLCBcIlwiXG5cblxuIyBoZWxwZXIgdG8gdHVybiBhbiBpdGVtIGludG8gdGV4dFxudG9UZXh0ID0gKGl0ZW0gPSAnJykgLT5cbiAgICBpZiB0eXBlb2YgaXRlbT8udmFsdWUgPT0gJ3N0cmluZydcbiAgICAgICAgaXRlbS52YWx1ZVxuICAgIGVsc2VcbiAgICAgICAgU3RyaW5nKGl0ZW0pXG5cbiMganF1ZXJ5IGRyYXdpbmcgaG9va1xuZGVmIHR0Ym94LCBqcXVlcnk6IC0+XG5cbiAgICAkICAgID0gbnVsbCAjIHNldCBvbiBpbml0XG4gICAgJGVsICA9IG51bGwgIyBzZXQgb24gaW5pdFxuICAgICRib3ggPSAtPiAkZWwuZmluZCgnLnR0Ym94JylcbiAgICAjIGh0bWwgZm9yIGJveFxuICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cInR0Ym94XCI+PGRpdiBjbGFzcz1cInR0Ym94LW92ZXJmbG93XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHRib3gtaW5wdXRcIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+PC9kaXY+J1xuICAgIHN1Z2dlc3QgPSAnPGRpdiBjbGFzcz1cInR0Ym94LXN1Zy1vdmVyZmxvd1wiPjxkaXYgY2xhc3M9XCJ0dGJveC1zdWdnZXN0XCI+PC9kaXY+PC9kaXY+J1xuICAgICMgY2FjaGUgb2YgcGlsbCA8cGlsbGlkLCBwaWxsPiBzdHJ1Y3R1cmVzXG4gICAgcGlsbHMgPSB7fVxuICAgICMgaGVscGVyIHRvIHRpZHkgY2FjaGVcbiAgICB0aWR5cGlsbHMgPSBob2xkIDUwMDAsIC0+XG4gICAgICAgIHByZXNlbnQgPSAkZWwuZmluZCgnLnR0Ym94LXBpbGwnKS5tYXAoLT4gJChAKS5hdHRyICdpZCcpLnRvQXJyYXkoKVxuICAgICAgICBkZWxldGUgcGlsbHNbaWRdIGZvciBpZCBpbiBPYmplY3Qua2V5cyhwaWxscykgd2hlbiBwcmVzZW50LmluZGV4T2YoaWQpIDwgMFxuICAgICAgICBudWxsXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgc3RydWN0dXJlIGZvciBhbiBlbGVtZW50XG4gICAgcGlsbGZvciA9IChlbCkgLT4gcGlsbHNbJChlbCkuY2xvc2VzdCgnLnR0Ym94LXBpbGwnKS5hdHRyKCdpZCcpXVxuICAgICMgZ28gdGhyb3VnaCBjYWNoZSBhbmQgZW5zdXJlIGFsbCBwaWxscyBoYXZlIHRoZSBpdGVtIHZhbHVlIG9mIHRoZVxuICAgICMgZWxlbWVudCB2YWx1ZS5cbiAgICBlbnN1cmVJdGVtcyA9IC0+XG4gICAgICAgIHBpbGwuZW5zdXJlSXRlbSgpIGZvciBrLCBwaWxsIG9mIHBpbGxzXG4gICAgICAgIG51bGxcblxuICAgICMgaW5pdGlhbGlzZSBib3hcbiAgICBpbml0OiAoZWwpIC0+XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpZG4ndCBmaW5kIGpRdWVyeVwiKSB1bmxlc3MgJCA9IGpRdWVyeVxuICAgICAgICAkZWwgPSAkKGVsKVxuICAgICAgICAkZWxbMF1cblxuICAgICMgZHJhdyBzdHVmZiBhbmQgaG9vayB1cCBldmVudCBoYW5kbGVyc1xuICAgIGRyYXc6IChoYW5kbGVycykgLT5cbiAgICAgICAgJGVsLmh0bWwgaHRtbFxuICAgICAgICAkZWwub24oZXZlbnQsIGhhbmRsZXIpIGZvciBldmVudCwgaGFuZGxlciBvZiBoYW5kbGVyc1xuXG4gICAgIyByZXR1cm4gYW4gYXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgYm94XG4gICAgdmFsdWVzOiAtPlxuICAgICAgICBlbnN1cmVJdGVtcygpXG4gICAgICAgIEFycmF5OjpzbGljZS5jYWxsKCRlbC5maW5kKCcudHRib3gtaW5wdXQnKVswXS5jaGlsZE5vZGVzKS5tYXAgKG4pIC0+XG4gICAgICAgICAgICBpZiBuLm5vZGVUeXBlID09IDEgYW5kIG4/LmNsYXNzTmFtZT8uaW5kZXhPZigndHRib3gtcGlsbCcpID49IDBcbiAgICAgICAgICAgICAgICBwaWxsZm9yIG5cbiAgICAgICAgICAgIGVsc2UgaWYgbi5ub2RlVHlwZSA9PSAzXG4gICAgICAgICAgICAgICAgZmlsdGVyIG4ubm9kZVZhbHVlXG4gICAgICAgIC5maWx0ZXIgSVxuXG4gICAgIyByZW1vdmUgc3VnZ2dlc3RcbiAgICB1bnN1Z2dlc3Q6IHVuc3VnZ2VzdCA9IC0+XG4gICAgICAgICQoJy50dGJveC1zdWctb3ZlcmZsb3cnKS5yZW1vdmUoKVxuICAgICAgICAkYm94KCkucmVtb3ZlQ2xhc3MgJ3R0Ym94LXNob3dpbmctc3VnZ2VzdCdcblxuICAgICMgc3RhcnQgc3VnZ2VzdFxuICAgIHN1Z2dlc3Q6IChmbiwgcmFuZ2UsIGlkeCwgbW92ZWNiLCBzZWxlY3RjYikgLT5cbiAgICAgICAgIyB0aGUgY3VycmVudCB3b3JkXG4gICAgICAgIHdvcmQgPSByYW5nZVN0cihyYW5nZSlcbiAgICAgICAgIyBmaW5kL2NyZWF0ZSBzdWdnZXN0LWJveFxuICAgICAgICAkc3VnID0gJCgnLnR0Ym94LXN1Z2dlc3QnKVxuICAgICAgICB1bmxlc3MgJHN1Zy5sZW5ndGhcbiAgICAgICAgICAgICRvdmVyZmx3ID0gJChzdWdnZXN0KVxuICAgICAgICAgICAgJHN1ZyA9ICRvdmVyZmx3LmZpbmQgJy50dGJveC1zdWdnZXN0J1xuICAgICAgICAgICAgIyBsb2NrIHdpZHRoIHRvIHBhcmVudFxuICAgICAgICAgICAgJG92ZXJmbHcud2lkdGggJGJveCgpLm91dGVyV2lkdGgoKVxuICAgICAgICAgICAgIyBhZGp1c3QgZm9yIGJvcmRlciBvZiBwYXJlbnRcbiAgICAgICAgICAgIGJvcmQgPSBwYXJzZUludCAkZWwuZmluZCgnLnR0Ym94LW92ZXJmbG93JykuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJylcbiAgICAgICAgICAgICRvdmVyZmx3LmNzcyB0b3A6JGVsLm91dGVySGVpZ2h0KCkgLSBib3JkXG4gICAgICAgICAgICAjIGFwcGVuZCB0byBib3hcbiAgICAgICAgICAgICRib3goKS5hcHBlbmQgJG92ZXJmbHdcbiAgICAgICAgICAgICMgaW5kaWNhdGUgd2UgYXJlIHNob3dpbmdcbiAgICAgICAgICAgICRib3goKS5hZGRDbGFzcygndHRib3gtc2hvd2luZy1zdWdnZXN0JylcbiAgICAgICAgIyBlbXB0eSBzdWdnZXN0IGJveCB0byBzdGFydCBmcmVzaFxuICAgICAgICAkc3VnLmh0bWwoJycpOyAkc3VnLm9mZigpXG4gICAgICAgICMgY2xhc3MgdG8gaG9vayBzdHlsaW5nIHdoZW4gc3VnZ2VzdGluZ1xuICAgICAgICAkYm94KCkuYWRkQ2xhc3MoJ3R0Ym94LXN1Z2dlc3QtcmVxdWVzdCcpXG4gICAgICAgICMgcmVxdWVzdCB0byBnZXQgc3VnZ2VzdCBlbGVtZW50c1xuICAgICAgICBmbiB3b3JkLCAobGlzdCkgLT5cbiAgICAgICAgICAgICMgbm90IHJlcXVlc3RpbmcgYW55bW9yZVxuICAgICAgICAgICAgJGJveCgpLnJlbW92ZUNsYXNzICd0dGJveC1zdWdnZXN0LXJlcXVlc3QnXG4gICAgICAgICAgICAjIGxvY2FsIHRvSHRtbCB3aXRoIHdvcmRcbiAgICAgICAgICAgIGxvY1RvSHRtbCA9IHRvSHRtbCh3b3JkKVxuICAgICAgICAgICAgIyB0dXJuIGxpc3QgaW50byBodG1sXG4gICAgICAgICAgICBsaXN0LmZvckVhY2ggKGwpIC0+XG4gICAgICAgICAgICAgICAgJGggPSAkKGxvY1RvSHRtbChsKSlcbiAgICAgICAgICAgICAgICAkaC5hZGRDbGFzcyBpZiBsLmRpdmlkZXJcbiAgICAgICAgICAgICAgICAgICAgJ3R0Ym94LXN1Z2dlc3QtZGl2aWRlcidcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICd0dGJveC1zdWdnZXN0LWl0ZW0nXG4gICAgICAgICAgICAgICAgJGguYWRkQ2xhc3MgbC5jbGFzc05hbWUgaWYgbC5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAkc3VnLmFwcGVuZCAkaFxuICAgICAgICAgICAgIyBsaXN0IHdpdGhvdXQgZGl2aWRlcnNcbiAgICAgICAgICAgIG5vZGl2aWQgPSBsaXN0LmZpbHRlciAobCkgLT4gIWwuZGl2aWRlclxuICAgICAgICAgICAgcHJldmlkeCA9IG51bGxcbiAgICAgICAgICAgIGRvIHNlbGVjdElkeCA9IChkb3N0YXJ0ID0gZmFsc2UpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIGlkeCA8IDAgYW5kICFkb3N0YXJ0XG4gICAgICAgICAgICAgICAgaWR4ID0gMCBpZiBpZHggPCAwXG4gICAgICAgICAgICAgICAgaWR4ID0gbm9kaXZpZC5sZW5ndGggLSAxIGlmIGlkeCA+PSBub2RpdmlkLmxlbmd0aFxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBwcmV2aWR4ID09IGlkeFxuICAgICAgICAgICAgICAgIHByZXZpZHggPSBpZHhcbiAgICAgICAgICAgICAgICAkc3VnLmZpbmQoJy50dGJveC1zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCd0dGJveC1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgJHNlbCA9ICRzdWcuY2hpbGRyZW4oJy50dGJveC1zdWdnZXN0LWl0ZW0nKS5lcShpZHgpXG4gICAgICAgICAgICAgICAgJHNlbC5hZGRDbGFzcygndHRib3gtc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICRzZWxbMF0/LnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgICAgICAgICBzZWxlY3RjYiBub2RpdmlkW2lkeF1cbiAgICAgICAgICAgICMgaGFuZGxlIGNsaWNrIG9uIGEgc3VnZ2VzdCBpdGVtLCBtb3VzZWRvd24gc2luY2UgY2xpY2tcbiAgICAgICAgICAgICMgd2lsbCBmaWdodCB3aXRoIGZvY3Vzb3V0IG9uIHRoZSBwaWxsXG4gICAgICAgICAgICAkc3VnLm9uICdtb3VzZWRvd24nLCAoZXYpIC0+XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAkaXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdCgnLnR0Ym94LXN1Z2dlc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyAkaXQubGVuZ3RoXG4gICAgICAgICAgICAgICAgaSA9ICRzdWcuY2hpbGRyZW4oJy50dGJveC1zdWdnZXN0LWl0ZW0nKS5pbmRleCAkaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIGkgPj0gMFxuICAgICAgICAgICAgICAgIHNlbGVjdGNiIG5vZGl2aWRbaV0sIHRydWVcbiAgICAgICAgICAgICMgY2FsbGJhY2sgcGFzc2VkIHRvIHBhcmVudCBmb3Iga2V5IG5hdmlnYXRpb25cbiAgICAgICAgICAgIG1vdmVjYiAob2ZmcykgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIG9mZnNcbiAgICAgICAgICAgICAgICBpZHggPSBpZHggKyBvZmZzXG4gICAgICAgICAgICAgICAgc2VsZWN0SWR4IHRydWVcblxuICAgICMgaW5zZXJ0IGEgcGlsbCBmb3IgdHlwZS9pdGVtIGF0IGdpdmVuIHJhbmdlXG4gICAgcGlsbGlmeTogKHJhbmdlLCB0eXBlLCBpdGVtLCBkaXNwYXRjaCkgLT5cbiAgICAgICAgIyB0aGUgdHJpZyBpcyByZWFkIGZyb20gdGhlIHR5cGVcbiAgICAgICAgdHJpZyA9IHR5cGUudHJpZ1xuICAgICAgICAjIGNyZWF0ZSBwaWxsIGh0bWxcbiAgICAgICAgZGZuID0gaWYgdHJpZ1xuICAgICAgICAgICAgaWYgdHJpZy5wcmVmaXggdGhlbiB0cmlnLnN5bWJvbCBlbHNlIHR5cGUubmFtZSArIHRyaWcuc3ltYm9sXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHR5cGUubmFtZVxuICAgICAgICAkcGlsbCA9ICQoXCI8ZGl2IGNsYXNzPVxcXCJ0dGJveC1waWxsXFxcIj48ZGl2IGNsYXNzPVxcXCJ0dGJveC1waWxsLWNsb3NlXFxcIj7DlzwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPGRmbj4je2Rmbn08L2Rmbj48c3Bhbj48L3NwYW4+PC9kaXY+XCIpXG4gICAgICAgICRwaWxsLmZpbmQoJyonKS5hbmRTZWxmKCkucHJvcCAnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJ1xuICAgICAgICAoJHNwYW4gPSAkcGlsbC5maW5kKCdzcGFuJykpLnByb3AgJ2NvbnRlbnRlZGl0YWJsZScsICd0cnVlJ1xuICAgICAgICAjIGlmIHByZWZpeCBzdHlsZSBwaWxsXG4gICAgICAgICRwaWxsLmFkZENsYXNzICd0dGJveC1waWxsLXByZWZpeCcgaWYgdHlwZS50cmlnLnByZWZpeFxuICAgICAgICAkcGlsbC5hZGRDbGFzcyB0eXBlLnRyaWcuY2xhc3NOYW1lIGlmIHR5cGUudHJpZy5jbGFzc05hbWVcbiAgICAgICAgJHBpbGwuYWRkQ2xhc3MgdHlwZS5jbGFzc05hbWUgaWYgdHlwZS5jbGFzc05hbWVcbiAgICAgICAgIyBnZW5lcmF0ZSBpZCB0byBhc3NvY2lhdGUgd2l0aCBtZW0gc3RydWN0dXJlXG4gICAgICAgIGlkID0gXCJ0dGJveHBpbGwje0RhdGUubm93KCl9XCJcbiAgICAgICAgJHBpbGwuYXR0ciAnaWQnLCBpZFxuICAgICAgICAjIHJlcGxhY2UgY29udGVudHMgd2l0aCBwaWxsXG4gICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKClcbiAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSAkcGlsbFswXVxuICAgICAgICAjIHJlbW92ZSBwaWxsIGZyb20gRE9NLCB3aGljaCBpbiB0dXJuIHJlbW92ZXMgaXQgY29tcGxldGVseVxuICAgICAgICByZW1vdmUgPSAtPlxuICAgICAgICAgICAgJHBpbGwucmVtb3ZlKClcbiAgICAgICAgICAgIGRpc3BhdGNoICdwaWxscmVtb3ZlJywge3BpbGx9XG4gICAgICAgICMgd2lyZSB1cCBjbG9zZSBidXR0b25cbiAgICAgICAgJHBpbGwuZmluZCgnLnR0Ym94LXBpbGwtY2xvc2UnKS5vbiAnY2xpY2snLCByZW1vdmVcbiAgICAgICAgIyBmb3JtYXQgdGhlIHRleHQgdXNpbmcgdGhlIHR5cGUgZm9ybWF0dGVyXG4gICAgICAgIGZvcm1hdCA9IC0+ICRzcGFuLnRleHQgdHlwZS5mb3JtYXQgJHNwYW4udGV4dCgpXG4gICAgICAgICMgbWF5YmUgcnVuIGZvcm1hdCBvbiBmb2N1c291dFxuICAgICAgICAkcGlsbC5vbiAnZm9jdXNvdXQnLCAtPlxuICAgICAgICAgICAgIyBkaXNwYXRjaCBsYXRlciB0byBhbGxvdyBmb3IgY2xpY2sgb24gc3VnZ2VzdFxuICAgICAgICAgICAgcGlsbC5lbnN1cmVJdGVtKClcbiAgICAgICAgICAgIGZvcm1hdCgpIGlmIHBpbGwuaXRlbT8uX3RleHRcbiAgICAgICAgICAgIGRpc3BhdGNoICdwaWxsZm9jdXNvdXQnLCB7cGlsbH1cbiAgICAgICAgIyBoZWxwZXIgZnVuY3Rpb24gdG8gc2NvbGwgcGlsbCBpbnRvIHZpZXdcbiAgICAgICAgc2Nyb2xsSW4gPSAtPlxuICAgICAgICAgICAgJHBpbGwuYWZ0ZXIgJHQgPSAkKCc8c3BhbiBzdHlsZT1cIndpZHRoOjFweFwiPicpXG4gICAgICAgICAgICAkdFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgICAkdC5yZW1vdmUoKVxuICAgICAgICAjIHN0b3AgcmVzaXplIGhhbmRsZXMgaW4gSUVcbiAgICAgICAgaWYgaXNJRVxuICAgICAgICAgICAgJHBpbGwub24gJ21vdXNlZG93bicsIChlKSAtPlxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIHBpbGwuc2V0Q3Vyc29ySW4oKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAjIHRoZSBwaWxsIGZhY2FkZVxuICAgICAgICBwaWxsID0gcGlsbHNbaWRdID0ge1xuICAgICAgICAgICAgaWQsIHRyaWcsIHR5cGUsIHJlbW92ZSxcbiAgICAgICAgICAgICMgc2V0IHRoZSBpdGVtIHZhbHVlIGZvciB0aGlzIHBpbGxcbiAgICAgICAgICAgIHNldEl0ZW06IChAaXRlbSkgLT4gJHNwYW4udGV4dCB0b1RleHQgQGl0ZW1cbiAgICAgICAgICAgICMgcG9zaXRpb24gaW4gdGhlIHBpbGwgdmFsdWVcbiAgICAgICAgICAgIHNldEN1cnNvckluOiAtPlxuICAgICAgICAgICAgICAgIHNjcm9sbEluKClcbiAgICAgICAgICAgICAgICBzZXRDdXJzb3JFbCAkc3BhblswXVxuICAgICAgICAgICAgIyBwb3NpdGlvbiB0aGUgY3Vyc29yIGFmdGVyIHRoZSBwaWxsXG4gICAgICAgICAgICBzZXRDdXJzb3JBZnRlcjogLT5cbiAgICAgICAgICAgICAgICBzY3JvbGxJbigpXG4gICAgICAgICAgICAgICAgc2V0Q3Vyc29yRWwgJHBpbGxbMF0/Lm5leHRTaWJsaW5nXG4gICAgICAgIH1cbiAgICAgICAgZGVmIHBpbGwsXG4gICAgICAgICAgICAjIGVuc3VyZSB0aGUgdGV4dCBvZiB0aGUgaXRlbSBjb3JyZXNwb25kcyB0byB0aGUgdmFsdWUgb2YgQGl0ZW1cbiAgICAgICAgICAgIGVuc3VyZUl0ZW06IC0+XG4gICAgICAgICAgICAgICAgc3R4dCA9ICRzcGFuLnRleHQoKS50cmltKClcbiAgICAgICAgICAgICAgICBwdHh0ID0gdG9UZXh0IHBpbGw/Lml0ZW1cbiAgICAgICAgICAgICAgICBwaWxsLnNldEl0ZW0ge3ZhbHVlOnN0eHQsIF90ZXh0OnRydWV9IGlmIHN0eHQgIT0gcHR4dFxuICAgICAgICBpZiBpdGVtXG4gICAgICAgICAgICAjIHNldCB0aGUgdmFsdWVcbiAgICAgICAgICAgIHBpbGwuc2V0SXRlbSBpdGVtXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgcG9zaXRpb24gY3Vyc29yIGluIHBpbGwuIGRvIGl0IGxhdGVyLCBiZWNhdXNlIHdlXG4gICAgICAgICAgICAjIG1heSBoYXZlIGNyZWF0ZWQgYSBwaWxsIGFzIGEgcmVzdWx0IG9mIGEgbW91c2Vkb3duIGNsaWNrXG4gICAgICAgICAgICAjIG9uIGEgc3VnZ2VzdFxuICAgICAgICAgICAgbGF0ZXIgLT4gcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICRwaWxsWzBdLnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgQHRpZHkoKVxuICAgICAgICBkaXNwYXRjaCAncGlsbGFkZCcsIHtwaWxsfVxuICAgICAgICByZXR1cm4gcGlsbFxuXG4gICAgIyByZXR1cm4gdGhlIHBpbGwgZm9yIGVsZW1lbnRcbiAgICBwaWxsZm9yOiBwaWxsZm9yXG5cbiAgICAjIGtlZXAgaW5wdXQgYm94IHRpZHkgd2l0aCB2YXJpb3VzIGNvbnRlbnRlZGl0YWJsZSBidWcgY29ycmVjdGlvbnNcbiAgICB0aWR5OiAtPlxuICAgICAgICAkaW5wID0gJGVsLmZpbmQoJy50dGJveC1pbnB1dCcpXG4gICAgICAgIGlucCA9ICRpbnBbMF1cbiAgICAgICAgIyBtZXJnZSBzdHVmZiB0b2dldGhlciBhbmQgcmVtb3ZlIGVtcHR5IHRleHRub2Rlcy5cbiAgICAgICAgaW5wLm5vcm1hbGl6ZSgpXG4gICAgICAgICMgZmlyc3QgZW5zdXJlIHRoZXJlJ3MgYSA8YnI+IGF0IHRoZSBlbmQgKG9yIDxpPiBmb3IgSUUpXG4gICAgICAgIHRhZyA9IGlmIGlzSUUgdGhlbiAnaScgZWxzZSAnYnInXG4gICAgICAgIHVubGVzcyAkaW5wLmNoaWxkcmVuKCkubGFzdCgpLmlzIHRhZ1xuICAgICAgICAgICAgJGlucC5maW5kKFwiPiAje3RhZ31cIikucmVtb3ZlKClcbiAgICAgICAgICAgICRpbnAuYXBwZW5kIFwiPCN7dGFnfT5cIlxuICAgICAgICBjaGlsZHMgPSBpbnAuY2hpbGROb2Rlc1xuICAgICAgICBmaXJzdCA9IGNoaWxkc1swXVxuICAgICAgICAjIGVuc3VyZSB0aGUgd2hvbGUgdGhpbmdzIHN0YXJ0cyB3aXRoIGEgendualxuICAgICAgICBpZiBmaXJzdD8ubm9kZVR5cGUgIT0gMyBvciBmaXJzdD8ubm9kZVZhbHVlP1swXSAhPSB6d25qXG4gICAgICAgICAgICAkaW5wWzBdLmluc2VydEJlZm9yZSBkb2MuY3JlYXRlVGV4dE5vZGUoenduaiksIGZpcnN0XG4gICAgICAgICMgZW5zdXJlIHRoZXJlJ3MgYWx3YXlzIGEgenduaiBhZnRlciBldmVyeSBlbGVtZW50IG5vZGVcbiAgICAgICAgZm9yIG4gaW4gY2hpbGRzIHdoZW4gbj8ubm9kZVR5cGUgPT0gMSBhbmQgbj8ubmV4dFNpYmxpbmc/Lm5vZGVUeXBlID09IDFcbiAgICAgICAgICAgIGFwcGVuZEFmdGVyIG4sIGRvYy5jcmVhdGVUZXh0Tm9kZSh6d25qKVxuICAgICAgICAjIG1vdmUgY3Vyc29yIHRvIG5vdCBiZSBvbiBiYWQgZWxlbWVudCBwb3NpdGlvbnNcbiAgICAgICAgaWYgciA9IGN1cnNvcigpXG4gICAgICAgICAgICBpZiAoci5zdGFydENvbnRhaW5lciA9PSBpbnAgb3Igci5lbmRDb250YWluZXIgPT0gaW5wKSBhbmQgaXNDaHJvbWVcbiAgICAgICAgICAgICAgICBjcyA9IEFycmF5OjpzbGljZS5jYWxsIGNoaWxkc1xuICAgICAgICAgICAgICAgICMgY3VycmVudCB0ZXh0IG5vZGUsIHRoZW4gcmlnaHQsIHRoZSBsZWZ0LlxuICAgICAgICAgICAgICAgIGlzVGV4dCA9IChuKSAtPiBpZiBuPy5ub2RlVHlwZSA9PSAzIHRoZW4gbiBlbHNlIG51bGxcbiAgICAgICAgICAgICAgICBpID0gci5zdGFydE9mZnNldFxuICAgICAgICAgICAgICAgIG4gPSBpc1RleHQoY3NbaV0pID8gaXNUZXh0KGNzW2kgKyAxXSkgPyBpc1RleHQoY3NbaSAtIDFdKVxuICAgICAgICAgICAgICAgIHNldEN1cnNvclBvcyByIGlmIG5cbiAgICAgICAgICAgICMgZmlyZWZveCBtYW5hZ2VzIHRvIGZvY3VzIGFueXRoaW5nIGJ1dCB0aGUgb25seVxuICAgICAgICAgICAgIyBjb250ZW50ZWRpdGFibGU9dHJ1ZSBvZiB0aGUgcGlsbFxuICAgICAgICAgICAgcGFyZW4gPSByLnN0YXJ0Q29udGFpbmVyLnBhcmVudE5vZGVcbiAgICAgICAgICAgIGlmIHBhcmVuPy5ub2RlTmFtZSAhPSAnU1BBTicgYW5kIHBpbGwgPSBwaWxsZm9yIHBhcmVuXG4gICAgICAgICAgICAgICAgcGlsbC5zZXRDdXJzb3JJbigpXG4gICAgICAgICMgcmVtb3ZlIGFueSBuZXN0ZWQgc3BhbiBpbiBwaWxsc1xuICAgICAgICAkZWwuZmluZCgnLnR0Ym94LXBpbGwgc3BhbiBzcGFuJykucmVtb3ZlKClcbiAgICAgICAgIyBrZWVwIGNhY2hlIGNsZWFuXG4gICAgICAgIHRpZHlwaWxscygpXG4gICAgICAgIG51bGxcblxuIyB1c2UganF1ZXJ5IHJlbmRlciBkZWZhdWx0XG5kZWYgdHRib3gsIHJlbmRlcjogdHRib3guanF1ZXJ5XG5cbiMgRXhwb3J0IHRoZSBtb2R1bGUgaW4gdmFyaW91cyBkaWZmZXJlbnQgd2F5c1xuaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0J1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHRib3hcbmVsc2UgaWYgdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nIGFuZCBkZWZpbmUuYW1kXG4gICAgZGVmaW5lIC0+IHR0Ym94XG5lbHNlXG4gICAgdGhpcy50dGJveCA9IHR0Ym94XG4iXX0=