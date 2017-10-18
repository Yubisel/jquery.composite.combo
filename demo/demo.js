var elements = [
    {
        id: 1,
        desc: 'Opcion 1',
        subElement: [
            {
                id: 2,
                desc: 'subOption2'
            },
            {
                id: 3,
                desc: 'subOption3'
            },
            {
                id: 4,
                desc: 'subOption4'
            },
            {
                id: 5,
                desc: 'subOption5'
            },
            {
                id: 6,
                desc: 'subOption6'
            },
            {
                id: 7,
                desc: 'subOption7'
            },
            {
                id: 8,
                desc: 'subOption8'
            }
        ]
    },
    {
        id: 2,
        desc: 'Opcion 2',
        subElement: [
            {
                id: 9,
                desc: 'subOption9'
            },
            {
                id: 10,
                desc: 'subOption10'
            },
            {
                id: 11,
                desc: 'subOption11'
            },
            {
                id: 12,
                desc: 'subOption12'
            },
            {
                id: 13,
                desc: 'subOption13'
            },
            {
                id: 14,
                desc: 'subOption14'
            },
            {
                id: 15,
                desc: 'subOption15'
            }
        ]
    },
    {
        id: 3,
        desc: 'Opcion 3',
        subElement: [
            {
                id: 16,
                desc: 'subOption16'
            },
            {
                id: 17,
                desc: 'subOption17'
            },
            {
                id: 18,
                desc: 'subOption18'
            },
            {
                id: 19,
                desc: 'subOption19'
            },
            {
                id: 20,
                desc: 'subOption20'
            },
            {
                id: 21,
                desc: 'subOption21'
            },
            {
                id: 22,
                desc: 'subOption22'
            }
        ]
    }
];

$(function () {
   $('#composite').compositeCombo({
       topSearchDesc: '¿Qué deseas buscar?',
       textLevel1: 'Todo',
       textLevel2: 'Seleccione un subnivel',
       height: 260,
       width: 400,
       placement: 'right', //posible values {left, middle, right}
       showMarker: true,
       markerPlacement: 'default',
       elements: elements
   });
});