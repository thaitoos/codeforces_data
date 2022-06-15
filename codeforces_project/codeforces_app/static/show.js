document.addEventListener('DOMContentLoaded', function(){
    const body = document.querySelector('body')
    let json_percentiles = JSON.parse(document.getElementById('json_percentiles').textContent)
    console.log(document.getElementById('json_percentiles').textContent)
    for(let key = 1; key<=99; key++){
        const div = document.createElement('div')
        div.innerHTML = json_percentiles[key]
        body.append(div)
    }

})