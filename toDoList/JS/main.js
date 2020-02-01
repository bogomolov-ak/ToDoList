const myNewTaskInput = document.getElementById("myNewTaskInput");
const addNewTaskButton = document.getElementById("addNewTaskButton");

//Определение элементов, которые будут динамически добавлятся  на страницу

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

    const clearDeletedTasksButton = document.createElement("button");
        clearDeletedTasksButton.textContent="clear";
        clearDeletedTasksButton.id = "clearDeletedTasksButton";
        clearDeletedTasksButton.onclick = clearAllDeletedTasks;


//Добавление обработчика события для нажатия Enter
    myNewTaskInput.addEventListener("keypress", (enterPressed));

    function enterPressed(key) {
        if (key.keyCode == 13) {
            addNewTask();
        }
    }

//Обработчик события для клика по кнопке "Add"
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

//Создаёт новый элемент списка
function createNewUnfinishedTask(textValue) {    
    let listItem = document.createElement("li"); 

    let taskTextLabel = document.createElement("label");
    taskTextLabel.textContent=textValue;

    let switchFUButton = document.createElement("button"); 
    switchFUButton.className = "switchFUButton";   
    switchFUButton.onclick=switchFinishedUnfinished;

    let switchESButton = document.createElement("button");  
    switchESButton.className = "editSaveButton";  
    switchESButton.textContent="edit";
    switchESButton.onclick=switchEditSaveTask;

    let switchDUButton = document.createElement("button");
    switchDUButton.className = "deleteButton";    
    switchDUButton.textContent="delete";
    switchDUButton.onclick=switchDeletedUndeleted;

    listItem.appendChild(switchFUButton);
    listItem.appendChild(taskTextLabel);
    listItem.appendChild(switchESButton);
    listItem.appendChild(switchDUButton);    
    listItem.className = "unfinishedTask";
    listItem.draggable=true;    
    listItem.addEventListener("dragstart", onDragStart);
    listItem.id = taskTextLabel.textContent;

    return listItem; 
}

//Функция для переноса задачи в список завершенных - в список незавершенных
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

//Функция для переноса задачив список удаленных - восстановления из удаленных
function switchDeletedUndeleted() {
    let parentNode = this.parentNode;

    switch (parentNode.className) {
        case "unfinishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromUnfinishedTasks";
            checkDeletedTasksHeader();
            checkNeedClearAllDeletedTasksButton();
            deletedTasks.appendChild(parentNode);
            checkNeedFinishAllTasksButton();             
            break;
        }
        case "finishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromFinishedTasks";
            checkDeletedTasksHeader();
            checkNeedClearAllDeletedTasksButton()
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
            checkNeedClearAllDeletedTasksButton()
            checkDeletedTasksHeader();            
            break;
        }
        case "deletedFromFinishedTasks" : {
            this.textContent="delete";
            parentNode.className="finishedTask";
            checkFinishedTasksHeader();
            checkNeedDeleteAllFinishedTasksButton();
            finishedTasks.appendChild(parentNode);  
            checkNeedClearAllDeletedTasksButton()
            checkDeletedTasksHeader();          
            break;
        }
    }

    save();
}

//Обработка функционала редактирования задачи.
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
        save();//Функция save() вызывает закрытие редактируемых элементов     
    }       
}

//Завершение всех незавершенных задач.
function finishAllUnfinishedTasks() {
    while (unfinishedTasks.childElementCount > 1) {        
        unfinishedTasks.children[1].firstChild.onclick();      
    }        
}

//Функция для удаления всех завершенных задач.
function deleteAllFinishedTasks() {
    while (finishedTasks.childElementCount > 2) {        
        finishedTasks.children[2].children[3].onclick();       
    }    
    checkNeedDeleteAllFinishedTasksButton();   
}

//Функция очистки списка удаленных задач.
function clearAllDeletedTasks() {
    parentNode = this.parentNode;
    while (deletedTasks.childElementCount > 0) {
        parentNode.removeChild(parentNode.firstChild);
    }    
}

//Функция для проверки необходимости заголовка списка завершенных задач.
//Если нужен - добавляет его. Не нужен (список завершенных задач пуст) - удаляет
function checkFinishedTasksHeader() {
    if (finishedTasks.childElementCount == 0) {        
        finishedTasks.appendChild(finishedTasksListHeader);
    } else if (finishedTasks.childElementCount == 1) {
        finishedTasks.removeChild(document.getElementById("finishedTasksListHeader"));
    }   
}

//Функция для проверки необходимости заголовка списка удаленных задач.
//Если нужен - добавляет его. Не нужен (список завершенных задач пуст) - удаляет
function checkDeletedTasksHeader() {
    if (deletedTasks.childElementCount == 0) {        
        deletedTasks.appendChild(deletedTasksListHeader); 
    } else if (deletedTasks.childElementCount == 1) {
        deletedTasks.removeChild(document.getElementById("deletedTasksListHeader"));
    }    
}

//Функция для проверки необходимости кнопки завершения всех незавершенных задач.
//Если нужна - добавляет, иначе - удаляет.
function checkNeedFinishAllTasksButton() {
    if (unfinishedTasks.childElementCount == 1) {
        unfinishedTasks.removeChild(document.getElementById("finishAllTaskButton"));
    } else if (unfinishedTasks.childElementCount == 0) {
        unfinishedTasks.appendChild(finishAllTaskButton);
    }   
}

//Функция для проверки необходимости кнопки удаления всех завершенных задач.
//Если нужна - добавляет, иначе - удаляет.
function checkNeedDeleteAllFinishedTasksButton() {
    if (finishedTasks.childElementCount == 2) {
        finishedTasks.removeChild(document.getElementById("deleteAllFinishedTasksButton"));
    } else if (finishedTasks.childElementCount == 1) {
        finishedTasks.appendChild(deleteAllFinishedTasksButton);
    }    
}

//Функция для проверки необходимости кнопки очистки списка удаленных задач.
//Если нужна - добавляет, иначе - удаляет.
function checkNeedClearAllDeletedTasksButton() {
    if (deletedTasks.childElementCount == 2) {
        deletedTasks.removeChild(document.getElementById("clearDeletedTasksButton"));
    } else if (deletedTasks.childElementCount == 1) {
        deletedTasks.appendChild(clearDeletedTasksButton);
    }
}

//Функция сохранения состояния списков незавершеннеых и завершенных задач.
function save() {
    try {
        while (unfinishedTasks.querySelector("input")) {
            unfinishedTasks.querySelector("input").parentNode.getElementsByClassName("editSaveButton")[0].onclick();
        }

        let unfinishedTasksArr = [];  
        let finishedTasksArr = []; 

        for (let i = 1; i < unfinishedTasks.childElementCount; i++) {               
            unfinishedTasksArr.push(unfinishedTasks.children[i].children[1].textContent);              
        }  
        
        for (let i = 2; i < finishedTasks.childElementCount; i++) {
            finishedTasksArr.push(finishedTasks.children[i].children[1].textContent);           
        }

        localStorage.removeItem("ToDoList");
        localStorage.setItem(
            "ToDoList", JSON.stringify({unfinishedTasks: unfinishedTasksArr, finishedTasks: finishedTasksArr}));
    } catch (e) {        
    }
}

//Функция загрузки предыдущего состояния списков незавершеннеых и завершенных задач.
function load() {
    return JSON.parse(localStorage.getItem("ToDoList"));
}


let tempData = load();

//Загрузка предыдущего состояния.
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


//Немного перетаскивания.
function onDragStart(event) {
    event
      .dataTransfer
      .setData("text", event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event
        .dataTransfer
        .getData("text");

    if (document.getElementById(id).className == "finishedTask" && (
        event.target.id == "myNewTaskInput" || event.target.id == "unfinishedTasks" || event.target.parentNode.id == "unfinishedTasks" || event.target.parentNode.parentNode.id == "unfinishedTasks")) {
        document.getElementById(id).firstChild.onclick();    
    }  else if (document.getElementById(id).className == "unfinishedTask" && 
    (event.target.id == "finishedTasks" || event.target.parentNode.id == "finishedTasks" || event.target.parentNode.parentNode.id)) {
        document.getElementById(id).firstChild.onclick();    
    }  

    event
        .dataTransfer
        .clearData();
}