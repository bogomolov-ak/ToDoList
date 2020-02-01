let myNewTaskInput = document.getElementById("myNewTaskInput");
let addNewTaskButton = document.getElementById("addNewTaskButton");
let unfinishedTasks = document.getElementById("unfinishedTasks");
let finishedTasks = document.getElementById("finishedTasks");
let deletedTasks = document.getElementById("deletedTasks");

const finishedTasksListHeader = document.createElement("h3");
    finishedTasksListHeader.textContent="Finished Tasks";
    finishedTasksListHeader.id="finishedTasksListHeader";


const deletedTasksListHeader = document.createElement("h3");
    deletedTasksListHeader.textContent="Deleted Tasks";
    deletedTasksListHeader.id="deletedTasksListHeader";

const finishAllTaskButton = document.createElement("button");
    finishAllTaskButton.textContent="finishAll";
    finishAllTaskButton.id = "finishAllTaskButton";
    finishAllTaskButton.onclick = finishAllUnfinishedTasks;

const deleteAllFinishedTasksButton = document.createElement("button");
    deleteAllFinishedTasksButton.textContent="deleteAll";
    deleteAllFinishedTasksButton.id = "deleteAllFinishedTasksButton";
    deleteAllFinishedTasksButton.onclick = deleteAllFinishedTasks;

myNewTaskInput.addEventListener("keypress", (enterPressed));

function enterPressed(key) {
    if (key.keyCode == 13) {
        addNewTask();
    }
}

addNewTaskButton.onclick = addNewTask;

function addNewTask() {   
    if (myNewTaskInput.value) {
        if (unfinishedTasks.childElementCount == 0) {
            unfinishedTasks.appendChild(finishAllTaskButton);
        }
    unfinishedTasks.appendChild(createNewUnfinishedTask(myNewTaskInput.value));
    myNewTaskInput.value="";
    save();
    }
}

function createNewUnfinishedTask(textValue) {
    let listItem = document.createElement("li"); 

    let taskTextLabel = document.createElement("label");
    taskTextLabel.textContent=textValue;

    let switchFUButton = document.createElement("button"); 
    switchFUButton.className = "switchFUButton";   
    switchFUButton.onclick=switchFinishedUnfinished;

    let switchESButton = document.createElement("button");    
    switchESButton.textContent="edit";
    switchESButton.onclick=switchEditSaveTask;

    let switchDUButton = document.createElement("button");    
    switchDUButton.textContent="delete";
    switchDUButton.onclick=switchDeletedUndeleted;

    listItem.appendChild(switchFUButton);
    listItem.appendChild(taskTextLabel);
    listItem.appendChild(switchESButton);
    listItem.appendChild(switchDUButton);    
    listItem.className = "unfinishedTask";

    return listItem; 
}

function switchFinishedUnfinished() {
    let parentNode = this.parentNode;
    if (parentNode.className == "unfinishedTask") {
        checkFinishedTasksHeader();
        checkNeedDeleteAllFinishedTasksButton();
        parentNode.className="finishedTask"; 
        finishedTasks.appendChild(parentNode);
        checkNeedFinishAllTasksButton();        
    } else if (parentNode.className == "finishedTask") {
        checkNeedFinishAllTasksButton();
        parentNode.className="unfinishedTask";       
        unfinishedTasks.appendChild(parentNode); 
        checkNeedDeleteAllFinishedTasksButton();
        checkFinishedTasksHeader();       
    }
    save();
}

function switchDeletedUndeleted() {
    let parentNode = this.parentNode;

    switch (parentNode.className) {
        case "unfinishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromUnfinishedTasks";
            checkDeletedTasksHeader();
            deletedTasks.appendChild(parentNode);
            checkNeedFinishAllTasksButton();             
            break;
        }
        case "finishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromFinishedTasks";
            checkDeletedTasksHeader();
            deletedTasks.appendChild(parentNode); 
            checkNeedDeleteAllFinishedTasksButton();
            checkFinishedTasksHeader();          
            break;
        }
        case "deletedFromUnfinishedTasks" : {
            this.textContent="delete";
            checkNeedFinishAllTasksButton();
            parentNode.className="unfinishedTask";
            unfinishedTasks.appendChild(parentNode);
            checkDeletedTasksHeader();            
            break;
        }
        case "deletedFromFinishedTasks" : {
            this.textContent="delete";
            parentNode.className="finishedTask";
            checkFinishedTasksHeader();
            checkNeedDeleteAllFinishedTasksButton();
            finishedTasks.appendChild(parentNode);  
            checkDeletedTasksHeader();          
            break;
        }
    }
    save();
}

function checkFinishedTasksHeader() {
    if (finishedTasks.childElementCount == 0) {        
        finishedTasks.appendChild(finishedTasksListHeader);
    } else if (finishedTasks.childElementCount == 1) {
        finishedTasks.removeChild(document.getElementById("finishedTasksListHeader"));
    }
    save();
}

function checkDeletedTasksHeader() {
    if (deletedTasks.childElementCount == 0) {        
        deletedTasks.appendChild(deletedTasksListHeader); 
    } else if (deletedTasks.childElementCount == 1) {
        deletedTasks.removeChild(document.getElementById("deletedTasksListHeader"));
    } 
    save();     
}

function switchEditSaveTask() {
    let parentNode = this.parentNode;
    if (parentNode.querySelector("label")) { 
        this.textContent="save";
        let label = parentNode.querySelector("label");
        let textContent = label.textContent;
        let input = document.createElement("input");
        input.value = textContent;
        label = parentNode.replaceChild(input, label);
    } else {        
        this.textContent="edit";
        let input = parentNode.querySelector("input");
        let textContent = input.value;
        let label = document.createElement("label");
        label.textContent = textContent;
        input = parentNode.replaceChild(label, input);   
        save();     
    }     
}

function finishAllUnfinishedTasks() {
    while (unfinishedTasks.childElementCount > 1) {        
        unfinishedTasks.children[1].firstChild.onclick();      
    }        
}

function checkNeedFinishAllTasksButton() {
    if (unfinishedTasks.childElementCount == 1) {
        unfinishedTasks.removeChild(document.getElementById("finishAllTaskButton"));
    } else if (unfinishedTasks.childElementCount == 0) {
        unfinishedTasks.appendChild(finishAllTaskButton);
    }
    save();
}

function deleteAllFinishedTasks() {
    while (finishedTasks.childElementCount > 2) {        
        finishedTasks.children[2].children[3].onclick();       
    }    
    checkNeedDeleteAllFinishedTasksButton();
    save();
}

function checkNeedDeleteAllFinishedTasksButton() {
    if (finishedTasks.childElementCount == 2) {
        finishedTasks.removeChild(document.getElementById("deleteAllFinishedTasksButton"));
    } else if (finishedTasks.childElementCount == 1) {
        finishedTasks.appendChild(deleteAllFinishedTasksButton);
    }
    save();
}

function save() {
    try {
        while (unfinishedTasks.querySelector("input")) {
            unfinishedTasks.querySelector("input").parentNode.getElementsByClassName("saveButton")[0].onclick();
        }

        let unfinishedTasksArr = [];  
        let finishedTasksArr = []; 

        for (let i = 1; i < unfinishedTasks.childElementCount; i++) {               
            unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName("label")[0].innerText);     
        }  
        
        for (let i = 2; i < finishedTasks.childElementCount; i++) {
            finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName("label")[0].innerText);
        }

        localStorage.removeItem("ToDoList");
        localStorage.setItem(
            "ToDoList", JSON.stringify({unfinishedTasks: unfinishedTasksArr, finishedTasks: finishedTasksArr}));
    } catch (e) {
        //Для попытки изменения состояние задачи в процессе редактирования элемента
    }
}

function load() {
    return JSON.parse(localStorage.getItem("ToDoList"));
}


let tempData = load();

if (tempData) {
    if (unfinishedTasks.childElementCount == 0 && tempData.unfinishedTasks.length > 0) {
        unfinishedTasks.appendChild(finishAllTaskButton);    
        for (let i = 0; i < tempData.unfinishedTasks.length; i++) {       
            unfinishedTasks.appendChild(createNewUnfinishedTask(tempData.unfinishedTasks[i]));
        }
    }
    if (finishedTasks.childElementCount == 0 && tempData.finishedTasks.length > 0) {      
        for (let i = 0; i < tempData.finishedTasks.length; i++) {
            let tempUnfinishedTask = createNewUnfinishedTask(tempData.finishedTasks[i]);
            if (unfinishedTasks.childElementCount == 0) {
                unfinishedTasks.appendChild(finishAllTaskButton);
            }
            unfinishedTasks.appendChild(tempUnfinishedTask);
            tempUnfinishedTask.firstChild.onclick();
        }    
    }
}