document.addEventListener('DOMContentLoaded', function(){
    const body = document.querySelector('body')
    let json_percentiles = JSON.parse(document.getElementById('json_percentiles').textContent)
    let average = JSON.parse(document.getElementById('average').textContent)
    console.log(average)
    //console.log(document.getElementById('json_percentiles').textContent)
    labels = [];
    values = [];
    colors = [];
    for(let key = 1; key<=99; key+=2){
        //const div = document.createElement('div')
        //div.innerHTML = json_percentiles[key]
        //body.append(div)
        labels.push(key)
        values.push(json_percentiles[key])
        colors.push('#dd0453');
    }
    var options = {
        chart: {
            type: 'line'
        },
        series: [{
            name: 'rating',
            data: values
        }],
        xaxis: {
            categories: labels
        }
    }
    // use colored bars?
    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
    
})