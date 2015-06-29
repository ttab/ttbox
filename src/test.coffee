
ttbox $('#myinput'), ttbox.trig(':', [
        ttbox.type 'produkt',
            suggest: (txt, cb, type) -> console.log 'sug1', txt
        ttbox.type 'pris',
            suggest: (txt, cb, type) -> console.log 'sug2', txt
        ttbox.type 'fotograf',
            suggest: (txt, cb, type) -> console.log 'sug3', txt
    ]), ttbox.trig('@', prefix:true,
        ttbox.type 'person',
            suggest: (txt, cb, type) -> console.log 'sug4', txt
    )
