const graph1 = function(username, rating, avgRating){
    const targetDiv = document.querySelector("#jsx1");
    var options = {
        series: [{
        name: "rating",
        data: [rating, avgRating]
      }],
        chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: [username, "Average user's rating"],
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val;
          }
        }
      },
      title: {
        text: `${username}'s rating vs average rating`,
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
      };
      var chart = new ApexCharts(targetDiv, options);
      chart.render();
}   
const fetchAndRender = async () => {
    console.log(document.getElementById('username'));
    if(document.getElementById('username')==null){
        return;
    }
    let username = JSON.parse(document.getElementById('username').textContent);
    try{
        const [respCallOne, respCallTwo, respCallThree] = await Promise.all([
            fetch(`https://codeforces.com/api/user.info?handles=${username}`),
            fetch(`https://codeforces.com/api/user.rating?handle=${username}`),
            fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=50000`)
        ]);
        const CallOne = await respCallOne.json();
        const CallTwo = await respCallTwo.json();
        const CallThree = await respCallThree.json();
        let average = JSON.parse(document.getElementById('average').textContent);
        //console.log({1: JSON.parse(document.getElementById('average').textContent)});
        //console.log(username, CallOne["result"][0]["rating"], JSON.parse(document.getElementById('average').textContent));
        console.log(average);
        graph1(username, CallOne["result"][0]["rating"], average);
    } catch (err){
        throw err;
    }
}
//var main = document.querySelector("#extra1")
//if(typeof(main) != 'undefined' && main != null)ReactDOM.render(<App />, main);
//App();
fetchAndRender();