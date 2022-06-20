document.addEventListener('DOMContentLoaded', () => {
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
    colored = document.querySelectorAll('.rating_color')
    if(colored.length >0){
        console.log(colored)
        let rating = JSON.parse(document.getElementById('rating').textContent)
        colored.forEach(element => {
            //element.style.color = rating_to_color(color_to_rating({{rating}}));
            //element.style.color = 'red'
            element.style.color = rating_to_color(rating);//convert hex to color
            //element.style.display = 'flex';
            //element.style.justifyContent = 'center';
        });   
    }
    resp = document.querySelectorAll('.response')
    console.log({"xd": resp})
    resp.forEach(element => {
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.fontSize= 'larger';
    })
})  