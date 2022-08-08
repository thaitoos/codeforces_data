function List() {
    const [list,setList] = React.useState([]);
    const [input,setInput] = React.useState("");
    const [idctr,setIdctr] = React.useState(0);
    
    const addContestant = (contestant) => {
        // CHECK IF THERE ARENT ALREADY 5 CONTESTANTS
        setIdctr(idctr + 1);
        // CHECK IF USERNAME IS OK
        fetch(`https://codeforces.com/api/user.info?handles=${contestant}`)
        .then(response =>response.json())
        .then(result => {
            let rating = result['result'][0]['rating'];
            console.log({"rating" : rating});
            const newContestant = {
                id: idctr,
                contestant: contestant,
                rating: rating
            }
            setList([...list, newContestant]);
            setInput("");
        })
    };
    const deleteContestant = (id) => {
        const newList = list.filter((contestant)=>contestant.id !== id);
        setList(newList);
    }
    return(
        <div>
            <h1>Compare 2-5 contestants</h1>
            <input
                type = "text"
                value = {input}
                onChange = {(event) => setInput(event.target.value)}
            />
            <button onClick={()=>addContestant(input)}>Add</button>
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