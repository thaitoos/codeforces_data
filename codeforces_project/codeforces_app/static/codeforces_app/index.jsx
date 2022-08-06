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
    })
    .then(()=>{
        console.log('yhhhhh')
        //return (
        //    <div>
        //        yuh
        //    </div>
        //);
        function Load(){
            return(
                <div>
                    yuh
                </div>
            )
        };
        var main = document.querySelector("#extra1")
        if(typeof(main) != 'undefined' && main != null)ReactDOM.render(<Load />, main);
    }
    )
}
//var main = document.querySelector("#extra1")
//if(typeof(main) != 'undefined' && main != null)ReactDOM.render(<App />, main);
App();