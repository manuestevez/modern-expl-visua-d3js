// CHART START
// 1. aquí hay que poner el código que genera la gráfica

let years;
let winners;
let originalData;

// data:
d3.csv("data.csv").then(data => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica
    // update:
    update(winners)
    slider()
})


// update:
function update(data) {
    // 3. función que actualiza el gráfico
}

// treat data:
function filterDataByYear(year) { 
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)
}


// CHART END

// slider:
function slider() {    
    // esta función genera un slider:
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(580)  // ancho de nuestro slider en px
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:
            console.log("La función aún no está conectada con la gráfica")
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
        });

        // contenedor del slider
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);  // invocamos el slider en el contenedor

        d3.select('p#value-time').text(sliderTime.value());  // actualiza el año que se representa
}