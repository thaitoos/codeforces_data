var body = document.querySelector('body')
var get_stats = document.querySelector('#get_stats')
document.addEventListener('click', event =>{
    var data = 'jd';
    fetch('https://codeforces.com/api/user.ratedList?activeOnly=true&includeRetired=false')
    .then(response => response.json())
    .then(result => {
        console.log(result['result'][0]['rating']);
        console.log('success');
        data=result['result'];
        console.log(data);
    })
    .then( () =>{
            fetch('/codeforces_app/get_stats?' + new URLSearchParams({
                'data': data
            }))
            .then(response => response.json())
            .then(result => {
                result.forEach(element => {
                    const new_div = document.createElement('div');
                    new_div.innerHTML = element;
                    body.append(new_div);
                });
            })
        }
    )
    .then( () => {
        color_rated = document.querySelectorAll('.rating_color')
        console.log(color_rated)    
    })
})