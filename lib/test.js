(function() {
  var lc;

  lc = function(s) {
    return s != null ? s.toLowerCase() : void 0;
  };

  this.b = ttbox($('#myinput'), ttbox.trig(':', [
    ttbox.divider('Sökbegränsningar'), ttbox.type('produkt', {
      className: 'produkttype',
      desc: 'en produktkod',
      suggest: function(word, cb, type) {
        return cb([
          {
            value: 'FOTO',
            desc: 'Alla foton'
          }, {
            value: 'FOBHUS',
            desc: 'Bildhuset'
          }, {
            value: 'FODN',
            desc: 'DN'
          }, {
            value: 'FOEKO',
            desc: 'Ekonomi'
          }
        ].filter(function(i) {
          return lc(i.value).indexOf(lc(word)) === 0;
        }));
      },
      format: function(t) {
        return t.toUpperCase();
      }
    }), ttbox.type('pris', {
      desc: 'ett pris',
      suggest: function(word, cb, type) {
        return cb(['500kr', '1000kr', '1500kr'].filter(function(i) {
          return lc(i).indexOf(lc(word)) === 0;
        }));
      }
    }), ttbox.type('fotograf', {
      desc: 'fotografens namn',
      suggest: function(word, cb, type) {
        return cb(['Martin Algesten', 'Peter Johansson', 'Björn Allan Åhlberg'].filter(function(i) {
          return lc(i).indexOf(lc(word)) === 0;
        }));
      }
    }), ttbox.divider('Övrigt'), ttbox.type('annat', {
      desc: 'andra grejer',
      format: function(t) {
        return t.toUpperCase();
      }
    })
  ]), ttbox.trig('@', {
    prefix: true,
    className: 'persontrig'
  }, ttbox.type('person', {
    desc: 'Person',
    suggest: function(word, cb, type) {
      return cb(['bag', 'jej', 'mag', 'pjn'].filter(function(i) {
        return lc(i).indexOf(lc(word)) === 0;
      }));
    }
  })));

}).call(this);

//# sourceMappingURL=data:application/json;base64,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QW9CLEVBQUEsQ0FBRyxDQUM1QixLQUQ0QixFQUU1QixLQUY0QixFQUc1QixLQUg0QixFQUk1QixLQUo0QixDQUsvQixDQUFDLE1BTDhCLENBS3ZCLFNBQUMsQ0FBRDtlQUFPLEVBQUEsQ0FBRyxDQUFILENBQUssQ0FBQyxPQUFOLENBQWMsRUFBQSxDQUFHLElBQUgsQ0FBZCxDQUFBLEtBQTBCO01BQWpDLENBTHVCLENBQUg7SUFBcEIsQ0FEVDtHQURKLENBREEsQ0E5QkM7QUFGVCIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiXG5sYyA9IChzKSAtPiBzPy50b0xvd2VyQ2FzZSgpXG5cbnRoaXMuYiA9IHR0Ym94ICQoJyNteWlucHV0JyksIHR0Ym94LnRyaWcoJzonLCBbXG4gICAgdHRib3guZGl2aWRlciAnU8O2a2JlZ3LDpG5zbmluZ2FyJ1xuICAgIHR0Ym94LnR5cGUgJ3Byb2R1a3QnLFxuICAgICAgICBjbGFzc05hbWU6ICdwcm9kdWt0dHlwZSdcbiAgICAgICAgZGVzYzogJ2VuIHByb2R1a3Rrb2QnXG4gICAgICAgIHN1Z2dlc3Q6ICh3b3JkLCBjYiwgdHlwZSkgLT4gY2IgW1xuICAgICAgICAgICAge3ZhbHVlOidGT1RPJywgICBkZXNjOidBbGxhIGZvdG9uJ31cbiAgICAgICAgICAgIHt2YWx1ZTonRk9CSFVTJywgZGVzYzonQmlsZGh1c2V0J31cbiAgICAgICAgICAgIHt2YWx1ZTonRk9ETicsICAgZGVzYzonRE4nfVxuICAgICAgICAgICAge3ZhbHVlOidGT0VLTycsICBkZXNjOidFa29ub21pJ31cbiAgICAgICAgXS5maWx0ZXIgKGkpIC0+IGxjKGkudmFsdWUpLmluZGV4T2YobGMgd29yZCkgPT0gMFxuICAgICAgICBmb3JtYXQ6ICh0KSAtPiB0LnRvVXBwZXJDYXNlKClcbiAgICB0dGJveC50eXBlICdwcmlzJyxcbiAgICAgICAgZGVzYzogJ2V0dCBwcmlzJ1xuICAgICAgICBzdWdnZXN0OiAod29yZCwgY2IsIHR5cGUpIC0+IGNiIFtcbiAgICAgICAgICAgICc1MDBrcidcbiAgICAgICAgICAgICcxMDAwa3InXG4gICAgICAgICAgICAnMTUwMGtyJ1xuICAgICAgICBdLmZpbHRlciAoaSkgLT4gbGMoaSkuaW5kZXhPZihsYyB3b3JkKSA9PSAwXG4gICAgdHRib3gudHlwZSAnZm90b2dyYWYnLFxuICAgICAgICBkZXNjOiAnZm90b2dyYWZlbnMgbmFtbidcbiAgICAgICAgc3VnZ2VzdDogKHdvcmQsIGNiLCB0eXBlKSAtPiBjYiBbXG4gICAgICAgICAgICAnTWFydGluIEFsZ2VzdGVuJ1xuICAgICAgICAgICAgJ1BldGVyIEpvaGFuc3NvbidcbiAgICAgICAgICAgICdCasO2cm4gQWxsYW4gw4VobGJlcmcnXG4gICAgICAgIF0uZmlsdGVyIChpKSAtPiBsYyhpKS5pbmRleE9mKGxjIHdvcmQpID09IDBcbiAgICB0dGJveC5kaXZpZGVyICfDlnZyaWd0J1xuICAgIHR0Ym94LnR5cGUgJ2FubmF0JyxcbiAgICAgICAgZGVzYzogJ2FuZHJhIGdyZWplcidcbiAgICAgICAgZm9ybWF0OiAodCkgLT4gdC50b1VwcGVyQ2FzZSgpXG4gICAgXSksIHR0Ym94LnRyaWcoJ0AnLCBwcmVmaXg6dHJ1ZSwgY2xhc3NOYW1lOidwZXJzb250cmlnJyxcbiAgICAgICAgdHRib3gudHlwZSAncGVyc29uJyxcbiAgICAgICAgICAgIGRlc2M6ICdQZXJzb24nXG4gICAgICAgICAgICBzdWdnZXN0OiAod29yZCwgY2IsIHR5cGUpIC0+IGNiIFtcbiAgICAgICAgICAgICAgICAnYmFnJ1xuICAgICAgICAgICAgICAgICdqZWonXG4gICAgICAgICAgICAgICAgJ21hZydcbiAgICAgICAgICAgICAgICAncGpuJ1xuICAgICAgICAgICAgXS5maWx0ZXIgKGkpIC0+IGxjKGkpLmluZGV4T2YobGMgd29yZCkgPT0gMFxuICAgIClcbiJdfQ==