
lc = (s) -> s?.toLowerCase()

this.b = ttbox $('#myinput'), ttbox.trig(':', [
        ttbox.type 'produkt',
            suggest: (word, cb, type) -> cb [
                {value:'FOTO',   desc:'Alla foton'}
                {value:'FOBHUS', desc:'Foto bildhuset'}
                {value:'FODN',   desc:'Foto DN'}
                {value:'FOEKO',  desc:'Foto Ekonomi'}
            ].filter (i) -> lc(i.value).indexOf(lc word) == 0
        ttbox.type 'pris',
            suggest: (word, cb, type) -> cb [
                '500kr'
                '1000kr'
                '1500kr'
            ].filter (i) -> lc(i).indexOf(lc word) == 0
        ttbox.type 'fotograf',
            suggest: (word, cb, type) -> cb [
                'Martin Algesten'
                'Peter Johansson'
                'Björn Allan Åhlberg'
            ].filter (i) -> lc(i).indexOf(lc word) == 0
    ]), ttbox.trig('@', prefix:true,
        ttbox.type 'person',
            suggest: (word, cb, type) -> cb [
                'bag'
                'jej'
                'mag'
                'pjn'
            ].filter (i) -> lc(i).indexOf(lc word) == 0
    )
