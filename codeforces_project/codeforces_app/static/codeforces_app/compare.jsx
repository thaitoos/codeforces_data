function List() {
    const [list,setList] = React.useState([]);
    const [input,setInput] = React.useState("");
    const [idctr,setIdctr] = React.useState(0);
    const max_contestant_count = 5;
    const divError = document.querySelector("#error");
    const clearError = function(){
        divError.innerHTML = "";
    };
    const throwError = function(message){
        divError.innerHTML = message;
    }
    const fetchData = async(contestant) => {
        console.log("fetchn");
        try{
            const [respTodoOne, respTodoTwo, respTodoThree] = await Promise.all([
                fetch(`https://codeforces.com/api/user.info?handles=${contestant}`),
                fetch(`https://codeforces.com/api/user.rating?handle=${contestant}`),
                fetch(`https://codeforces.com/api/user.status?handle=${contestant}&from=1&count=50000`)
            ]);
            const todoOne = await respTodoOne.json();
            const todoTwo = await respTodoTwo.json();
            const todoThree = await respTodoThree.json();
            if((todoOne["status"]!="OK") || (todoTwo["status"]!="OK") || (todoThree["status"]!="OK")){
                throwError("incorrect contestant");
                return;
            }
            console.log("DONE");
            const rating = todoOne["result"][0]["rating"];
            console.log({"rating" : rating});
            const newContestant = {
                id: idctr,
                contestant: contestant,
                rating: rating,
                todoOne: todoOne,
                todoTwo: todoTwo,
                todoThree: todoThree
            }
            setList([...list, newContestant]);
            setInput("");
            //console.log(todoOne, 'todoOne');
            //console.log(todoTwo, 'todoTwo');
            //console.log(todoThree, 'todoThree');
        }
        catch(err){
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
        console.log({"fm":"fm"});
        // CHECK IF USERNAME IS OK
        /*fetch(`https://codeforces.com/api/user.info?handles=${contestant}`)
        .then(response =>response.json())
        .then(result => {
            console.log({"status": result["status"] });
            if(result["status"]!=="OK"){//inputContestant already in List
                divError.innerHTML = `Incorrect contestant`;
                return;
            }
            let rating = result['result'][0]['rating'];
            console.log({"rating" : rating});
            const newContestant = {
                id: idctr,
                contestant: contestant,
                rating: rating
            }
            setList([...list, newContestant]);
            setInput("");
        })*/
        fetchData(contestant);
    };
    const deleteContestant = (id) => {
        clearError();
        const newList = list.filter((contestant)=>contestant.id !== id);
        setList(newList);
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
                <button type="submit">Add</button>
            </form>
            <ul>
                {list.map((contestant) => (
                    <li>
                        {`${contestant.contestant} ${contestant.rating}`}
                        <button onClick={()=>deleteContestant(contestant.id)}>&times;</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
var div1 = document.querySelector("#div1");
ReactDOM.render(<List />, div1);