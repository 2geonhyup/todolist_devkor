const table = document.querySelector("table"),
    tableToDoList = document.querySelector(".todo-list");

let clickedCell = {
    first: 0,
    last: 0,
    text: 0
};
const TIMEPLAN_LS = "timePlans";
let timePlans = [];
let colorsIndex = 0;
var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function saveTimePlans(){
    currentStorageValue = JSON.stringify(timePlans); 
    localStorage.setItem(TIMEPLAN_LS, currentStorageValue);
}

// 이미 존재하는 계획의 시간대를 클릭하면 1, 아니면 0을 봔환한다.
function checkPlans(number){
    for(let n in timePlans){
        if(number<=parseInt(timePlans[n].last) && number>=parseInt(timePlans[n].first)){
            return 1;
        }
    }
    return 0;
}

function deletePlan(number){
    let start=0, end=0;
    for (let n in timePlans){
        console.log(n, number, timePlans[n])
        if(number<=parseInt(timePlans[n].last) && number>=parseInt(timePlans[n].first)){
            start = parseInt(timePlans[n].first);
            end = parseInt(timePlans[n].last);
            timePlans.splice(n, 1);
            break;
        }
    }
    saveTimePlans();
    console.log(start, end);
    for (let i=start; i<=end; i++){
        let tmp = ".t" + String(i);
        document.querySelector(tmp).style = "border-right:1px solid rgba(219, 219, 219, 0.6);";
    }
}

function newPlan(event){
    console.log(clickedCell);
    clickedCell.text = event.target.innerText;


    for (let i=parseInt(clickedCell.first); i<=parseInt(clickedCell.last); i++){
        let tmp = ".t" + String(i);
        //document.querySelector(tmp).style = "border-right:hidden" ;
        document.querySelector(tmp).style = `background-color:${colors[colorsIndex%50]}`;
        document.querySelector(tmp).title = clickedCell.text;
    }
    colorsIndex++;
    timePlans.push(clickedCell);
    clickedCell = {
        first: 0,
        last: 0,
        text: 0
    };
    saveTimePlans();
    document.querySelector("h1").innerText="TO DO LIST"
}

function handleNewTable(){
    let cnt=0;
    timePlans.forEach(function(each){
        if(parseInt(clickedCell.first) < parseInt(each.first) &&parseInt(clickedCell.last) > parseInt(each.last)){
            console.log("error");
            alert("시간선택이 잘못되었습니다");
            clickedCell = {
                first: 0,
                last: 0,
                text: 0
            };
            cnt++;
            return;
        }
    });
    if(cnt==0){
        document.querySelector("h1").innerText="select todo!!!"
        tableToDoList.addEventListener("click", newPlan);
    }
    
}


function handleTable(){
    console.log(clickedCell);

    for (let i=parseInt(clickedCell.first); i<=parseInt(clickedCell.last); i++){
        let tmp = ".t" + String(i);
        //document.querySelector(tmp).style = "border-right:hidden" ;
        document.querySelector(tmp).style = `background-color:${colors[colorsIndex%50]}`;
        document.querySelector(tmp).title = clickedCell.text;
    }
    colorsIndex++;
    timePlans.push(clickedCell);
    clickedCell = {
        first: 0,
        last: 0,
        text: 0
    };
    saveTimePlans();
}

function handledblClick(event){
    console.log("1");
    event.preventDefault();
    const deletedNode = event.target;
    const targetNumber = parseInt(deletedNode.getAttribute('class').replace('t',''));
    console.log(targetNumber);
    if (deletedNode.getAttribute('class')!==null&&checkPlans(targetNumber)===1){
        deletePlan(targetNumber);
    }
}

function handleClick(event){
    event.preventDefault();
    const clickedNode = event.target;
    const targetNumber = parseInt(clickedNode.getAttribute('class').replace('t',''));
    if (clickedNode.getAttribute('class')!==null&&checkPlans(targetNumber)===0){
        console.log("here!");
        //clickedNode.style.backgroundColor = "grey";
        if(parseInt(clickedCell.first)===0){
            clickedCell.first = (clickedNode.getAttribute('class').substring(1));
        }
        else{
            clickedCell.last = (clickedNode.getAttribute('class').substring(1));
            handleNewTable();
        }
    }
}

function loadTables(){
    const loadedTables = localStorage.getItem(TIMEPLAN_LS);
    if (loadedTables !== null){
        const parsedTimePlans = JSON.parse(loadedTables);
        parsedTimePlans.forEach(function(each){
            clickedCell = each;
            handleTable();
        });
    }
}


function init(){
    loadTables();
    table.addEventListener("click", handleClick);
    table.addEventListener("contextmenu", handledblClick);
}

init();