const toDoForm = document.querySelector(".toDoForm"),
    toDoInput = toDoForm.querySelector(".input-toDo"),
    toDoList = document.querySelector(".todo-list");

const TODO_LS = "toDos";
let toDos =[];

function deleteToDo(event) {
    const deleteNode = event.target.parentNode;
    toDoList.removeChild(deleteNode);

    const newToDos = toDos.filter(function (toDo){
        return toDo.ID !== parseInt(deleteNode.getAttribute('id'));
    });
    toDos = newToDos;
    saveToDos();
    location.reload();
}

function completeToDo(event) {
    const completeNode = event.target.parentNode;
    const updateToDos = toDos.findIndex((toDo) => toDo.ID === parseInt(completeNode.getAttribute('id')));
    if(toDos[updateToDos].complete === 0){
        completeNode.querySelector(".content").style = "text-decoration:line-through; font-style:italic; color: grey";
        toDos[updateToDos].complete = 1;
    } else {
        completeNode.querySelector(".content").style = "text-decoration:none; font-style:default; color: black";
        toDos[updateToDos].complete = 0;
    }
    saveToDos();
}

//toDos배열 localStorage에 저장 (string형태)
function saveToDos(){
    currentStorageValue = JSON.stringify(toDos); 
    localStorage.setItem(TODO_LS, currentStorageValue);
}

function paintToDo(text, complete) {
    // 할일 블록 생성
    const newId = toDos.length + 1;
    const div = document.createElement("div");

    const content = document.createElement("div");
    content.className = "content";
    content.innerText = text;

    const completeBtn = document.createElement("button");
    completeBtn.innerText = "V";
    completeBtn.style.color = "green";
    completeBtn.addEventListener("click", completeToDo);
    
    const delBtn = document.createElement("button");
    delBtn.innerText = "X"
    delBtn.style.color = "red";
    delBtn.addEventListener("click", deleteToDo);

    const number = document.createElement("div");
    number.className = "num";
    number.innerText = newId;

    div.appendChild(number);
    div.appendChild(content);
    div.appendChild(completeBtn);
    div.appendChild(delBtn);
    div.id = newId;
    div.className = "to-do"

    // 완료된 목록은 따로 처리
    if(complete === 1){
        div.querySelector(".content").style = "text-decoration:line-through; font-style:italic; color: grey";
    }
    
    // 할일 블록 화면에 출력
    toDoList.appendChild(div);

    // localStorage에 저장
    const toDoObj = {
        text: text,
        ID: newId,
        complete: complete
    };
    toDos.push(toDoObj);
    saveToDos();

}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue, 0);
    toDoInput.value = "";
}

function loadToDos(){
    const loadedToDos = localStorage.getItem(TODO_LS);
    if (loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(each){
            paintToDo(each.text, each.complete);
        });
    }
}

function init(){
    loadToDos();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();