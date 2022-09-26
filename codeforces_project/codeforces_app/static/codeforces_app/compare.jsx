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
        console.log("TWO");
        //charts in a separate div?
        const ratingList = list.map(function(contestant){
            return [contestant.rating, contestant.maxRating, contestant.contestant];
        })
        ratingList.sort();
        ratingList.reverse();
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
            //var acceptedSubmissions = 1000;
            var percentage = acceptedSubmissions * 100.0 / allSubmissons;
            return [percentage.toFixed(1),acceptedSubmissions,allSubmissons,contestant.contestant]; 
        })
        submissionRatioList.sort();
        submissionRatioList.reverse();
        const series = [
        {
            name: "Temperature in Fahrenheit", //will be displayed on the y-axis
            data: [43, 53, 50, 57]
        }
        ];
        const options = {
        chart: {
            id: "simple-bar"
        },
        xaxis: {
            categories: [1, 2, 3, 4] //will be displayed on the x-asis
        }
        };
        function Graph(){
            var divreturn = React.createElement('div');
            var chart = new ApexCharts(divreturn, options);
            chart.render();
            return divreturn;
        }
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
                                <h2>{`${item[0]}`}</h2>
                                <h2>{`(Max. ${item[1]})`}</h2>
                            </div>
                        ))
                    }   
                </div>
                {/*rating over time HERE*/}
                <h1>Experience</h1>
                <h2> number of contests participations</h2>
                <div style={{display:'flex', flexFlow:'row wrap'}}>
                    {
                        contestNumList.map((item,index)=>(
                            <div className='card'>
                                {/*`${index+1}. ${item[2]} ${item[0]} (Max. ${item[1]})`*/}
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
                                {/*`${index+1}. ${item[2]} ${item[0]} (Max. ${item[1]})`*/}
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
                                {/*`${index+1}. ${item[2]} ${item[0]} (Max. ${item[1]})`*/}
                                <h5>{`${index+1}.`}</h5>
                                <h1>{`${item[3]}`}</h1>
                                <h2>{`${item[0]}%`}</h2>
                                {/*<div style={{display:'inline'}}>
                                    <h4>accepted submissions:</h4>
                                    <h2>{`${item[1]}`}</h2>
                                </div>
                                <div style={{display:'inline'}}>
                                    <h4>all submissions:</h4>
                                    <h2>{`${item[2]}`}</h2>
                                 </div>*/}
                                <div>
                                    {
                                        `${item[1]} out of ${item[2]} submissions are correct`
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <Graph/>
            </div>
        )
    }
    const handleLoadResult = () => {
        console.log("loading");
        clearError();
        if(!(list.length >=2)){
            throwError("add at least 2 contestants to compare");
            return;
        }
        var targetDiv = document.querySelector("#div2");
        console.log("ONE");
        ReactDOM.render(<RenderResult />, targetDiv);
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
                    <li style = {{color: rating_to_color(contestant.rating)}}>
                        {`${contestant.contestant} ${contestant.rating}`}
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