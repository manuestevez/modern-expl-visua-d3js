// CHART START
// 1. aquí hay que poner el código que genera la gráfica
const width = 800
const height = 600
const margin = {
    top: 50, 
    right: 10,
    left: 40, 
    bottom:40
}

// svg
const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)

// grupos
const elementGroup = svg.append("g").attr("class", "elementGroup").attr("transform", `translate (${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup").attr("transform", `translate (${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup").attr("transform", `translate (${margin.left}, ${margin.top})`)

// escalas
const x = d3.scaleBand().range([0, width - margin.left - margin.right])
const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

// ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)


let years;
let winners;
let originalData;

// data:
d3.csv("WorldCup.csv").then(data => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica
    data.map(d => {
        //Convertir el tipo cadena del año para que lo entienda como numérico, y luego lo añadimos a la variable years ya creada por parte del profesor
        d.Year = +d.Year
    })

    // Cargar valores iniciales a las variables ya definidas por el profesor para luego utilizarlas en las funciones de filtro y slider
    // Datos para el filtro
    originalData=data

    // Datos para el slider
    years = data.map(d => d.Year)
    
    x.domain(data.map(d => d.Winner))
    y.domain([0,d3.max(data.map(d => d.Winner), d => data.map(d => d.Winner).filter(item => item === d).length)]) 
    yAxis.ticks(d3.max(data.map(d => d.Winner), d => data.map(d => d.Winner).filter(item => item === d).length))
    
    // llamada a la función update(data) con los datos que hemos cargado de la fuente
    update(data)

    /* llamada a la función slider() para poder cargar el slider y poder trabajar con los años (years)  
    que hemos cargado anteriormente de la fuente y asi tener un slider acotado con dichos años*/
    slider()
})


// update:
function update(data) {
    // 3. función que actualiza el gráfico
    /* Cargar en un objeto los datos que nos llegan a la llamada de la función update, 
    para utilizarlo en la grafica, nos llega el data del año seleccionado en el slider */

    winners = data.map(d => d.Winner)


    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    const elements = elementGroup.selectAll("rect").data(winners)

    elements.enter()
        .append("rect")
        .attr("class", d => `${d} bar`)
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter(element => element === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(winners.filter(element => element === d).length))
    
    elements
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter(element => element === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(winners.filter(element => element === d).length))

    elements.exit()
        .remove()
    
    // Se añade el log para ver los datos cargados con la funcion
    console.log(data)
}

// treat data:
function filterDataByYear(yearSelected) { 
    // 4. función que filtra los datos dependiendo del año que le pasemos (yearSelected)
    dataYearSelected = originalData.filter(d => d.Year <= yearSelected)
    winnerYearSelected = originalData.filter(d => d.Winner <= yearSelected)
    //llamamos a la función udpdate con los datos que obtenemos del filtrado del año, para asi mostrar la gráfica con los datos que queremos de dicho año elegido
    update (dataYearSelected)
    d3.select('p#value-time').text("El ganador del mundial del año " + yearSelected + ", ha sido: " + winnerYearSelected);  // actualiza con el año que seleccionado
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
        .on('onchange', yearSelected => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
            filterDataByYear(yearSelected)
            //console.log("La función aún no está conectada con la gráfica")
            console.log("filtramos con la función filterDataByYear, mediante el año elegido por el usuario con el slider");
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

    d3.select('p#value-time').text("Selecciona un año para conocer el ganador del mundial");  // actualiza el año que se representa
}