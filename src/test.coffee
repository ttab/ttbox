
lc = (s) -> s?.toLowerCase()

this.b = ttbox $('#myinput'), ttbox.trig(':', [
    ttbox.divider 'Sökbegränsningar'
    ttbox.type 'produkt',
        className: 'produkttype'
        desc: 'en produktkod'
        suggest: (word, cb, type) -> cb [
            {value:'FOTO',   desc:'Alla foton'}
            {value:'FOBHUS', desc:'Bildhuset'}
            {value:'FODN',   desc:'DN'}
            {value:'FOEKO',  desc:'Ekonomi'}
        ].filter (i) -> lc(i.value).indexOf(lc word) == 0
        format: (t) -> t.toUpperCase()
    ttbox.type 'pris',
        desc: 'ett pris'
        suggest: (word, cb, type) -> cb [
            '500kr'
            '1000kr'
            '1500kr'
        ].filter (i) -> lc(i).indexOf(lc word) == 0
    ttbox.type 'fotograf',
        desc: 'fotografens namn'
        suggest: (word, cb, type) -> cb [
            'Martin Algesten'
            'Peter Johansson'
            'Björn Allan Åhlberg'
        ].filter (i) -> lc(i).indexOf(lc word) == 0
    ttbox.divider 'Övrigt'
    ttbox.type 'annat',
        desc: 'andra grejer'
        format: (t) -> t.toUpperCase()
    ]), ttbox.trig('@', prefix:true, className:'persontrig',
        ttbox.type 'person',
            desc: 'Person'
            suggest: (word, cb, type) -> cb [
                'bag'
                'jej'
                'mag'
                'pjn'
            ].filter (i) -> lc(i).indexOf(lc word) == 0
    )

this.b.placeholder 'Testa : eller @'
