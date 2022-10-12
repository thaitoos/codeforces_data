function rating_to_color(rating){
  if(rating<1200){
      return '#B5AFAF'
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
const ratingColorElements = document.getElementsByClassName("rating_color");
for (let i = 0; i < ratingColorElements.length; i++) {
  const rating = ratingColorElements[i].innerText;
  ratingColorElements[i].style.color = rating_to_color(rating);
}
const graph1 = function(username, rating, avgRating){
    const targetDiv = document.querySelector("#jsx1");
    var options = {
        series: [{
        name: "rating",
        data: [rating, avgRating]
      }],
        chart: {
        height: 350,
        width: 1200,
        type: 'bar',
      },
      responsive: [{
        breakpoint: 600,
        options: {
          chart: {
            width: 600
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
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
        align: 'center',
      }
      };
      targetDiv.style.display = "flex";
      targetDiv.style.justifyContent = "center";
      var chart = new ApexCharts(targetDiv, options);
      chart.render();
}
const graph2 = function(correctContestSubmissions, incorrectContestSubmissions, correctPracticeSubmissions, incorrectPracticeSubmissions){
    const targetDiv = document.querySelector("#jsx2");
    var options = {
      series: [correctContestSubmissions, incorrectContestSubmissions, correctPracticeSubmissions, incorrectPracticeSubmissions],
      chart: {
      width: 600,
      type: 'pie',
    },
    labels: ['Correct Contest Submissions', 'Incorrect Contest Submissions', 'Correct Practice Submissions', 'Incorrect Practice Submissions'],
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          width: 600
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    title: {
      text: `types of submissions`,
      align: 'center',
    }
    };
    targetDiv.style.display = "flex";
    targetDiv.style.justifyContent = "center";
    //set padding to 5px
    targetDiv.style.padding = "50px";
    var chart = new ApexCharts(targetDiv, options);
    chart.render();
}
const graph3 = function(verdicts){
  for (var key in verdicts) {
    var newKey = key.toLowerCase().replace(/_/g, ' ');
    if (key !== newKey) {
      verdicts[newKey] = verdicts[key];
      delete verdicts[key];
    }
  }
  console.log(verdicts);
  delete verdicts["ok"];
  const verdictTypeAndCount = [];
  for (var key in verdicts) {
    verdictTypeAndCount.push([key, verdicts[key]]);
  }
  verdictTypeAndCount.sort(function(a, b) {
    return b[1] - a[1];
  });
  const verdictTypes = [];
  const verdictCounts = [];
  for (var i = 0; i < verdictTypeAndCount.length; i++) {
    verdictTypes.push(verdictTypeAndCount[i][0]);
    verdictCounts.push(verdictTypeAndCount[i][1]);
  }
  const targetDiv = document.querySelector("#jsx3");
  var options = {
    series: [{
    name: "error type",
    data: verdictCounts
  }],
    chart: {
    height: 350,
    width: 1200,
    type: 'bar',
  },
  labels: verdictTypes,
  responsive: [{
    breakpoint: 1200,
    options: {
      chart: {
        width: 500
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
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
    text: `categories of incorrect submissions`,
    align: 'center',
  }
  };
  targetDiv.style.display = "flex";
  targetDiv.style.justifyContent = "center";
  var chart = new ApexCharts(targetDiv, options);
  chart.render();
}   
const fetchAndRender = async () => {
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
        let jsx0 = document.querySelector("#jsx0");
        jsx0.innerHTML = `<h1 style="padding:5px">${username} </h1> <h1 style="padding:5px" class="rating_color"> ${CallOne["result"][0]["rating"]}</h1>`;
        const ratingColorElements = document.getElementsByClassName("rating_color");
        for (let i = 0; i < ratingColorElements.length; i++) {
          const rating = ratingColorElements[i].innerText;
          ratingColorElements[i].style.color = rating_to_color(rating);
        }
        let average = JSON.parse(document.getElementById('average').textContent)
        console.log(average);
        average = Math.round(average * 100) / 100;
        graph1(username, CallOne["result"][0]["rating"], average);
        console.log(CallTwo, CallThree);
        let correctContestSubmissions = 0;
        let incorrectContestSubmissions = 0;
        let correctPracticeSubmissions = 0;
        let incorrectPracticeSubmissions = 0;
        CallThree["result"].forEach((submission) => {
          if(submission["author"]["participantType"] == "CONTESTANT"){
            if(submission["verdict"] == "OK"){
              correctContestSubmissions++;
            }
            else{
              incorrectContestSubmissions++;
            }
          }
          else{
            if(submission["verdict"] == "OK"){
              correctPracticeSubmissions++;
            }
            else{
              incorrectPracticeSubmissions++;
            }
          }
        });
        graph2(correctContestSubmissions, incorrectContestSubmissions, correctPracticeSubmissions, incorrectPracticeSubmissions);
        let verdicts = {};
        CallThree["result"].forEach((submission) => {
          if(submission["verdict"] in verdicts){
            verdicts[submission["verdict"]]++;
          }
          else{
            verdicts[submission["verdict"]] = 1;
          }
        });
        graph3(verdicts);

    } catch (err){
        throw err;
    }
}

fetchAndRender();