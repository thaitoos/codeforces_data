console.log('yuh')
function App() {
    let username = JSON.parse(document.getElementById('username').textContent)
    fetch(`https://codeforces.com/api/user.rating?handle=${username}`)
    .then(response => response.json())
    .then(data => {
        if(data['status']!='OK'){
            return;
        }
        var s1=JSON.stringify(data['result']);
        console.log('frst');
        console.log('yhhhhh')
        function Load(){
            return(
                <div>
                    {s1}
                </div>
            )
        };
        var main = document.querySelector("#extra1")
        if(typeof(main) != 'undefined' && main != null)ReactDOM.render(<Load />, main);
    })
}
const fetchData = async () => {
    let username = JSON.parse(document.getElementById('username').textContent);
    try{
        const [respTodoOne, respTodoTwo] = await Promise.all([
            fetch(`https://codeforces.com/api/user.rating?handle=${username}`),
            fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`)
        ]);
        const todoOne = await respTodoOne.json();
        const todoTwo = await respTodoTwo.json();
        console.log(todoOne, 'todoOne');
        console.log(todoTwo, 'todoTwo');
    } catch (err){
        throw err;
    }
}
//var main = document.querySelector("#extra1")
//if(typeof(main) != 'undefined' && main != null)ReactDOM.render(<App />, main);
//App();
fetchData();