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
function List() {
    const [list,setList] = React.useState([]);
    const [input,setInput] = React.useState("");
    const [idctr,setIdctr] = React.useState(0);
    const [loadButtonDisabled, setLoadButtonDisabled] = React.useState(true);
    const max_contestant_count = 5;
    const divError = document.querySelector("#error");
    const clearError = function(){
        divError.innerHTML = "";
    };
    const throwError = function(message){
        divError.innerHTML = message;
    }
    const fetchData = async(contestant) => {
        //console.log("fetchn");
        try{
            const addButton = document.querySelector("#addButton");
            addButton.disabled = true;
            const [respCallOne, respCallTwo, respCallThree] = await Promise.all([
                fetch(`https://codeforces.com/api/user.info?handles=${contestant}`),
                fetch(`https://codeforces.com/api/user.rating?handle=${contestant}`),
                fetch(`https://codeforces.com/api/user.status?handle=${contestant}&from=1&count=50000`)
            ]);
            const CallOne = await respCallOne.json();
            const CallTwo = await respCallTwo.json();
            const CallThree = await respCallThree.json();
            console.log({1:CallOne});
            console.log({2:CallTwo});
            console.log({3:CallThree});
            if((CallOne["status"]!="OK") || (CallTwo["status"]!="OK") || (CallThree["status"]!="OK")){
                addButton.disabled = false;
                throwError("incorrect contestant");
                return;
            }
            console.log("DONE");
            const rating = CallOne["result"][0]["rating"];
            const maxRating = CallOne["result"][0]["maxRating"]
            console.log({"rating" : rating});
            const newContestant = {
                id: idctr,
                contestant: contestant,
                rating: rating,
                maxRating: maxRating,
                CallOne: CallOne,
                CallTwo: CallTwo,
                CallThree: CallThree
            }
            addButton.disabled = false;
            if(list.length+1>=2){
                //document.querySelector("#loadButton").disabled = false;
                setLoadButtonDisabled(false);
            }
            setList([...list, newContestant]);
            setInput("");
        }
        catch(err){
            addButton.disabled = false;
            console.log(err);
            return err;
        }
    }
    const handleSubmit = e =>{
        e.preventDefault();
        clearError();
        const inputContestant = input;
        if(inputContestant === ""){
            throwError("Contestant's name cannot be blank");
            return;
        }
        //CHECK IF THERE ARENT ALREADY 5 CONTESTANTS
        console.log({"num of contestants before adding" : list.length})
        if(list.length >= max_contestant_count){
            throwError(`You can compare a maximum of ${max_contestant_count} contestants`);
            return;
        }
        //CHECK FOR CONTESTANT DUPLICATES
        const dublicateList = list.filter((contestant) => contestant.contestant === inputContestant);
        if(dublicateList.length > 0){//inputContestant already in List
            throwError(`You've already added this contestant`);
            setInput("");
            return;
        }
        console.log({"adding":inputContestant});
        addContestant(inputContestant);
    };
    const addContestant = (contestant) => {
        setIdctr(idctr + 1);
        fetchData(contestant);
    };
    const deleteContestant = (id) => {
        console.log(id);
        clearError();
        if(!(list.length-1>=2)){
            //document.querySelector("#loadButton").disabled = true;
            setLoadButtonDisabled(true);
        }
        const newList = list.filter((contestant)=>contestant.id !== id);
        setList(newList);
    }


    function RenderResult() {
        const ratingList = list.map(function(contestant){
            return [contestant.rating, contestant.maxRating, contestant.contestant];
        })
        ratingList.sort();
        ratingList.reverse();

        return(
            <div>
                <h1>rating</h1>
                {/*<Ratings/>*/}
                <div style={{display:'flex', flexFlow:'row wrap'}}>
                    {
                        ratingList.map((item,index)=>(
                            <div className='card'>
                                {/*`${index+1}. ${item[2]} ${item[0]} (Max. ${item[1]})`*/}
                                <h5>{`${index+1}.`}</h5>
                                <h1>{`${item[2]}`}</h1>
                                <h2 className="colored">{`${item[0]}`}</h2>
                                <h2 className="colored">{`(Max. ${item[1]})`}</h2>
                            </div>
                        ))
                    }   
                </div>
            </div>
        )
    }
    function RenderResult2() {
        const contestNumList = list.map(function(contestant){
            return [contestant.CallTwo["result"].length, contestant.contestant];
        })
        contestNumList.sort();
        contestNumList.reverse();
        const allSubmissionList = list.map(function(contestant){
            return [contestant.CallThree["result"].length, contestant.contestant];
        })
        allSubmissionList.sort();
        allSubmissionList.reverse();
        const submissionRatioList = list.map(function(contestant){
            var allSubmissons = contestant.CallThree["result"].length;
            var acceptedSubmissions = contestant.CallThree["result"].filter(contest => contest["verdict"] == "OK").length;
            var percentage = acceptedSubmissions * 100.0 / allSubmissons;
            return [percentage.toFixed(1),acceptedSubmissions,allSubmissons,contestant.contestant]; 
        })
        submissionRatioList.sort();
        submissionRatioList.reverse();
        return(
            <div>
                <h1>Experience</h1>
                <h2> number of contests participations</h2>
                <div style={{display:'flex', flexFlow:'row wrap'}}>
                    {
                        contestNumList.map((item,index)=>(
                            <div className='card'>
                                <h5>{`${index+1}.`}</h5>
                                <h1>{`${item[1]}`}</h1>
                                <h2>{`${item[0]}`}</h2>
                            </div>
                        ))
                    }
                </div>
                <h2> number of all submissions</h2>
                <div style={{display:'flex', flexFlow:'row wrap'}}>
                    {
                        allSubmissionList.map((item,index)=>(
                            <div className='card'>
                                <h5>{`${index+1}.`}</h5>
                                <h1>{`${item[1]}`}</h1>
                                <h2>{`${item[0]}`}</h2>
                            </div>
                        ))
                    }
                </div>
                <h1>Correctness</h1>
                <h3>percentage of accepted submissions</h3>
                <div style={{display:'flex', flexFlow:'row wrap'}}>
                    {
                        submissionRatioList.map((item,index)=>(
                            <div className='card'>
                                <h5>{`${index+1}.`}</h5>
                                <h1>{`${item[3]}`}</h1>
                                <h2>{`${item[0]}%`}</h2>
                                <div>
                                    {
                                        `${item[1]} out of ${item[2]} submissions are correct`
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    function RenderResult1(){
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Oct'];
        var d = new Date();
        var month = d.getMonth();
        var year = d.getFullYear();
        var yearandmonths = [];
        var numofmonths = 24;
        for(var i=0;i<numofmonths;i++){
            yearandmonths.push([month, year]);
            month--;
            if(month<0){
                month=11;
                year--;
            }
        }
        yearandmonths.reverse();
        const contestantPoints = [];
        list.forEach((contestant) => {
            const res = [];
            for(var i=0;i<=numofmonths;i++){
                res.push(0);
            }
            contestant["CallTwo"]["result"].forEach((contest) => {
                var date = new Date(contest["ratingUpdateTimeSeconds"] * 1000);
                var contestMonth = date.getMonth();
                var contestYear = date.getFullYear();
                var used = false;
                for(var i=0;i<yearandmonths.length;i++){
                    if(yearandmonths[i][0]==contestMonth && yearandmonths[i][1]==contestYear){
                        console.log("LETS GO");
                        res[i+1]=Math.max(res[i+1],contest["newRating"]);
                        used = true;
                        break;
                    }
                }
                if(!used){
                    res[0]=Math.max(res[0],contest["newRating"]);
                }
            })
            for(var i=1;i<res.length;i++){
                if(res[i]==0){
                    res[i]=res[i-1];
                }    
            }
            contestantPoints.push(res);
        })
        var categories = [];
        categories.push("...");
        yearandmonths.forEach((object) => {
            categories.push(`${months[object[0]]} ${object[1].toString().slice(2)}`);
        })
        var series = [];
        for(var i=0;i<list.length;i++){
            series.push({"name" : list[i].contestant, "data" : contestantPoints[i]});
        }
        console.log(series);
        var options = {
            series: series,
            chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: categories,
          },
          yaxis: {
            title: {
              text: 'rating'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              }
            }
          }
          };
        var divreturn = document.querySelector('#div3');
        console.log(divreturn);
        var chart = new ApexCharts(divreturn, options);
        chart.render();
        return divreturn;
    }
    const handleLoadResult = () => {
        clearError();
        if(!(list.length >=2)){
            throwError("add at least 2 contestants to compare");
            return;
        }
        var targetDiv = document.querySelector("#div2");
        var targetDiv2 = document.querySelector("#div4");
        console.log("ONE");
        ReactDOM.render(<RenderResult />, targetDiv);
        RenderResult1();
        ReactDOM.render(<RenderResult2 />, targetDiv2);
        const ratingColorElements = document.getElementsByClassName("colored");
        for (let i = 0; i < ratingColorElements.length; i++) {
          let rating = ratingColorElements[i].innerText;
          if(rating[0]=='('){
            rating = rating.slice(6);
            rating = rating.slice(0, -1);
          }
          ratingColorElements[i].style.color = rating_to_color(rating);
        }
        const cardElements = document.getElementsByClassName("card");
        for (let i = 0; i < cardElements.length; i++) {
            cardElements[i].style.backgroundColor = "#f5f5f5";
            cardElements[i].style.padding = "10px";
            cardElements[i].style.margin = "10px";
            cardElements[i].style.borderRadius = "10px";
            cardElements[i].style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.5)";
        }

    }
    //VALIDATION
    return(
        <div>
            <h1>Compare 2-5 contestants</h1>
            <form onSubmit = {handleSubmit}> 
                <input
                    type = "text"
                    value = {input}
                    onChange = {(event) => setInput(event.target.value)}
                />
                <button id = {"addButton"} type="submit">Add</button>
            </form>
            <ul>
                {list.map((contestant) => (
                    //<li style = {{color: rating_to_color(contestant.rating)}}>
                    <li>
                        {`${contestant.contestant}`}
                        <button onClick={()=>deleteContestant(contestant.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <button id = {"loadButton"} onClick = {()=>handleLoadResult()} disabled = {loadButtonDisabled}>compare</button>
        </div>
        
    );
}
var div1 = document.querySelector("#div1");
ReactDOM.render(<List />, div1);