function rating_to_color(rating){
    if(rating<1200){
        return '#B5AFAF'
        //return '#66FF66'
    }
    if(rating<1400){
        return '#66FF66'
    }
    if(rating<1600){
        return '#66FFFF'
    }
    if(rating<1900){
        return '#0000FF'
    }
    if(rating<2100){
        return '#FF33FF'
    }
    if(rating<2400){
        return '#FFFF33'
    }
    return '#FF3333'
};
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
        labels.push(key)
        values.push(json_percentiles[key])
        colors.push(rating_to_color(json_percentiles[key].toString()));
    }
    var options = {
        chart: {
            type: 'bar'
        },
        series: [{
            name: 'rating',
            data: values
        }],
        xaxis: {
            categories: labels
        },
        colors: [function({ value, seriesIndex, w }) {
            if(value<1200){
                return '#B5AFAF'
            }
            if(value<1400){
                return '#66FF66'
            }
            if(value<1600){
                return '#66FFFF'
            }
            if(value<1900){
                return '#0000FF'
            }
            if(value<2100){
                return '#FF33FF'
            }
            if(value<2400){
                return '#FFFF33'
            }
            return '#FF3333'
        }]
    }
    // use colored bars?
    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
    
})