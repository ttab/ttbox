
lc = (s) -> s?.toLowerCase()

type_prod = ttbox.type 'produkt',
  className: 'produkttype'
  desc: 'en produktkod'
  suggest: (word, cb, type) -> cb [
      {value:'FOTO',   desc:'Alla foton'}
      {value:'FOBHUS', desc:'Bildhuset'}
      {value:'FODN',   desc:'DN'}
      {value:'FOEKO',  desc:'Ekonomi'}
  ].filter (i) -> lc(i.value).indexOf(lc word) == 0
  format: (t) -> t.toUpperCase()

type_pris = ttbox.type 'pris',
    desc: 'ett pris'
    limitOne: true
    suggest: (word, cb, type) -> cb [
        '500kr'
        '1000kr'
        '1500kr'
    ].filter (i) -> lc(i).indexOf(lc word) == 0

type_fotograf = ttbox.type 'fotograf',
    desc: 'fotografens namn'
    suggest: (word, cb, type) -> cb [
        'Martin Algesten'
        'Peter Johansson'
        'Björn Allan Åhlberg'
    ].filter (i) -> lc(i).indexOf(lc word) == 0

type_annat = ttbox.type 'annat',
    desc: 'andra grejer'
    format: (t) -> t.toUpperCase()

type_person = ttbox.type 'person',
    desc: 'Person'
    suggest: (word, cb, type) -> cb [
        'bag'
        'jej'
        'mag'
        'pjn'
    ].filter (i) -> lc(i).indexOf(lc word) == 0

this.b = ttbox $('#myinput'), ttbox.trig(':', [
    ttbox.divider 'Sökbegränsningar'
    type_prod
    type_pris
    type_fotograf
    ttbox.divider 'Övrigt'
    type_annat
    ]), ttbox.trig('@', prefix:true, className:'persontrig',
    type_person
    )

this.b.placeholder 'Testa : eller @'

this.b.setvalues [{type:type_fotograf, item:'Björn Allan Åhlberg'}]
