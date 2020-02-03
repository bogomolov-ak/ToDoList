//Обращение к элементам - поле ввода и кнопка "Add"
const myNewTaskInput = document.getElementById("myNewTaskInput");
const addNewTaskButton = document.getElementById("addNewTaskButton");
let unfinishedTasks = document.getElementById("unfinishedTasks");
let finishedTasks = document.getElementById("finishedTasks");
let deletedTasks = document.getElementById("deletedTasks");

//Определение элементов, которые будут динамически добавлятся  на страницу
    const finishedTasksListHeader = document.createElement("h3");
    finishedTasksListHeader.textContent="Finished Tasks";
    finishedTasksListHeader.id="finishedTasksListHeader";


    const deletedTasksListHeader = document.createElement("h3");
    deletedTasksListHeader.textContent="Deleted Tasks";
    deletedTasksListHeader.id="deletedTasksListHeader";

    const finishAllTaskButton = document.createElement("button");
    finishAllTaskButton.textContent="finishAll";
    finishAllTaskButton.id = "finishAllTaskButton";
    finishAllTaskButton.addEventListener("click", finishAllUnfinishedTasks);

    const deleteAllFinishedTasksButton = document.createElement("button");
    deleteAllFinishedTasksButton.textContent="deleteAll";
    deleteAllFinishedTasksButton.id = "deleteAllFinishedTasksButton";
    deleteAllFinishedTasksButton.addEventListener("click", deleteAllFinishedTasks);

    const clearDeletedTasksButton = document.createElement("button");
    clearDeletedTasksButton.textContent="clear";
    clearDeletedTasksButton.id = "clearDeletedTasksButton";
    clearDeletedTasksButton.addEventListener("click", clearAllDeletedTasks);

//Добавление обработчиков событий для нажатия Enter, либо клика по кнопке "Add"
    myNewTaskInput.addEventListener("keypress", enterPressed);

    function enterPressed(key) {
        if (key.keyCode == 13) {
            addNewTask();
        }
    }

    addNewTaskButton.addEventListener("click", addNewTask);

//Функция добавления новой задачи
//Если поле ввода не пустое, проверка пеобходимости добавить кнопку "finishAll"
//Добавить в unfinished новую задачу
function addNewTask() {   
    if (myNewTaskInput.value) {
        checkNeedFinishAllTasksButton();
        unfinishedTasks.appendChild(createNewUnfinishedTask(myNewTaskInput.value));
        myNewTaskInput.value="";
        save();
    }
}

//Функция создания нового элемента списка незавершенных задач
//Элементу устанавливается свойство draggable, 
//id элемента соответствует тексту задачи 
//(возможно возникновение ошибки в случае эквивалентных названий)
//С целью предотвращения ошибки добавлен счетчик tasksCounter
let tasksCounter = 0;
function createNewUnfinishedTask(textValue) { 
    let listItem = document.createElement("li");     

    let taskTextLabel = document.createElement("label");
    taskTextLabel.className = "label";
    taskTextLabel.textContent=textValue;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";       
    checkbox.addEventListener("click", switchFinishedUnfinishedSingle);

    let switchEditSaveButton = document.createElement("button");  
    switchEditSaveButton.className = "switchEditSaveButton";  
    switchEditSaveButton.textContent="edit";
    switchEditSaveButton.addEventListener("click", switchEditSaveTask);

    let switchDeleteRecoverButton = document.createElement("button");
    switchDeleteRecoverButton.className = "switchDeleteRecoverButton";    
    switchDeleteRecoverButton.textContent="delete";
    switchDeleteRecoverButton.addEventListener("click", switchDeletedUndeletedSingle);

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextLabel);
    listItem.appendChild(switchEditSaveButton);
    listItem.appendChild(switchDeleteRecoverButton);    
    listItem.className = "unfinishedTask";
    listItem.draggable=true;    
    listItem.addEventListener("dragstart", onDragStart);
    listItem.id = textValue + tasksCounter++;

    return listItem; 
}

//Функция для переноса задачи в список завершенных - в список незавершенных
//(назначена на обработчик клика checkbox)
function switchFinishedUnfinishedSingle() {
    let parentNode = this.parentNode;

    if (parentNode.className == "unfinishedTask") {
        checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton();        
        parentNode.className="finishedTask"; 
        finishedTasks.appendChild(parentNode);
        checkNeedFinishAllTasksButton();        
    } else if (parentNode.className == "finishedTask") {
        checkNeedFinishAllTasksButton();
        parentNode.className="unfinishedTask";       
        unfinishedTasks.appendChild(parentNode);        
        checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton();      
    }
    save();
}

//Перегрузка метода для кнопки "finishAll" и восстановления при загрузке
function switchFinishedUnfinished(thisTask) {
    if (thisTask.className == "unfinishedTask") {
        checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton();        
        thisTask.className="finishedTask"; 
        finishedTasks.appendChild(thisTask);
        checkNeedFinishAllTasksButton();        
    } else if (thisTask.className == "finishedTask") {
        checkNeedFinishAllTasksButton();
        thisTask.className="unfinishedTask";       
        unfinishedTasks.appendChild(thisTask);         
        checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton();      
    }
    save();
}

//Функция для переноса задачи в список удаленных - восстановления из удаленных
function switchDeletedUndeletedSingle() {
    let parentNode = this.parentNode;

    switch (parentNode.className) {
        case "unfinishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromUnfinishedTasks";
            checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton();            
            deletedTasks.appendChild(parentNode);
            checkNeedFinishAllTasksButton();             
            break;
        }
        case "finishedTask" : {
            this.textContent="recover";
            parentNode.className="deletedFromFinishedTasks";
            checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton();   
            deletedTasks.appendChild(parentNode); 
            checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton();          
            break;
        }
        case "deletedFromUnfinishedTasks" : {
            this.textContent="delete";
            checkNeedFinishAllTasksButton();
            parentNode.className="unfinishedTask";
            unfinishedTasks.appendChild(parentNode);
            checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton();               
            break;
        }
        case "deletedFromFinishedTasks" : {
            this.textContent="delete";
            parentNode.className="finishedTask";
            checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton(); 
            finishedTasks.appendChild(parentNode);             
            checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton();         
            break;
        }
    }
    save();
}

//перегрузка метода для кнопки "deleteAll"
function switchDeletedUndeleted(thisTask) {  
    thisTask.getElementsByClassName("switchDeleteRecoverButton")[0].textContent="recover";         
    thisTask.className="deletedFromFinishedTasks";
    checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton();   
    deletedTasks.appendChild(thisTask); 
    checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton(); 
    save();
}

//Функция обработки редактирования существующей задачи
//Если текущее состояние - не редактирование - меняет состояние на редакриторание, и наоборот
function switchEditSaveTask() {
    let parentNode = this.parentNode;

    if (parentNode.querySelector("label")) { 
        this.textContent="save";
        let label = parentNode.querySelector("label");
        let textContent = label.textContent;
        let input = document.createElement("input");
        input.className = "taskEditor";
        input.value = textContent;
        label = parentNode.replaceChild(input, label);
    } else {        
        this.textContent="edit";
        let input = parentNode.getElementsByClassName("taskEditor")[0];
        let textContent = input.value;
        let label = document.createElement("label");
        label.className = "label";
        label.textContent = textContent;
        input = parentNode.replaceChild(label, input); 
        save();//Функция save() вызывает закрытие редактируемых элементов     
    }       
}

//Функция завершения всех незавершенных задач
function finishAllUnfinishedTasks() {
    while (unfinishedTasks.getElementsByClassName("unfinishedTask").length > 0) {
        switchFinishedUnfinished(unfinishedTasks.getElementsByClassName("unfinishedTask")[0]);
    }     
}

//Функция для удаления всех завершенных задач.
function deleteAllFinishedTasks() {
    while (finishedTasks.getElementsByClassName("finishedTask").length > 0) {
        switchDeletedUndeleted(finishedTasks.getElementsByClassName("finishedTask")[0]);
    }
}

//Функция очистки списка удаленных задач.
function clearAllDeletedTasks() {
    parentNode = this.parentNode;
    while (deletedTasks.childElementCount > 0) {
        parentNode.removeChild(parentNode.firstChild);
    }    
}

//Функция для проверки необходимости кнопки завершения всех незавершенных задач.
//Если нужна - добавляет, иначе - удаляет.
function checkNeedFinishAllTasksButton() {
    if (unfinishedTasks.childElementCount == 0) {
        unfinishedTasks.appendChild(finishAllTaskButton);        
    } else if (unfinishedTasks.childElementCount == 1) {
        unfinishedTasks.removeChild(document.getElementById("finishAllTaskButton"));
    }   
}

//Функция для проверки необходимости заголовка списка завершенных задач и кнопки удаления всех завершенных задач
//Если нужны - добавляет заголовок и кнопку удаления всех завершенных задач. Не нужны (список завершенных задач пуст) - удаляет их
function checkNeedFinishedTasksHeaderAndDeleteAllFinishedTasksButton() {
    if (finishedTasks.childElementCount == 0) {        
        finishedTasks.appendChild(finishedTasksListHeader);
        finishedTasks.appendChild(deleteAllFinishedTasksButton);
    } else if (finishedTasks.childElementCount == 2) {
        finishedTasks.removeChild(document.getElementById("deleteAllFinishedTasksButton"));
        finishedTasks.removeChild(document.getElementById("finishedTasksListHeader"));
    }   
}

//Функция для проверки необходимости заголовка списка удаленных задач и кнопки очистки списка удаленных задач.
//Если нужны - добавляет, иначе - удаляет.
function checkNeedDeletedTasksHeaderAndClearAllDeletedTasksButton() {
    if (deletedTasks.childElementCount == 0) {
        deletedTasks.appendChild(deletedTasksListHeader); 
        deletedTasks.appendChild(clearDeletedTasksButton);       
    } else if (deletedTasks.childElementCount == 2) {
        deletedTasks.removeChild(document.getElementById("clearDeletedTasksButton"));
        deletedTasks.removeChild(document.getElementById("deletedTasksListHeader"));        
    }
}

//Функция сохранения состояния списков незавершеннеых и завершенных задач. Список удаленных задач не сохраняется (ни к чему)
function save() {
    try {
        //Если какая-то задача в процессе редактирования - принудительно закрывается редактирование кликом по save (очень кривой момент в коде...)
            for (let i = 0; i < unfinishedTasks.getElementsByClassName("taskEditor").length; i++) {
                unfinishedTasks.getElementsByClassName("taskEditor")[i].parentNode.getElementsByClassName("switchEditSaveButton")[0].click();
            }

            for (let i = 0; i < finishedTasks.getElementsByClassName("taskEditor").length; i++) {
                finishedTasks.getElementsByClassName("taskEditor")[i].parentNode.getElementsByClassName("switchEditSaveButton")[0].click();
            }

        let unfinishedTasksArr = [];  
        let finishedTasksArr = []; 
        
        let unfinishedTasksCount = unfinishedTasks.getElementsByClassName("unfinishedTask").length;
        for (let i = 0; i < unfinishedTasksCount; i++) {               
            unfinishedTasksArr.push(unfinishedTasks.getElementsByClassName("unfinishedTask")[i].getElementsByClassName("label")[0].textContent);              
        }  
        
        let finishedTasksCount = finishedTasks.getElementsByClassName("finishedTask").length;
        for (let i = 0; i < finishedTasksCount; i++) {
            finishedTasksArr.push(finishedTasks.getElementsByClassName("finishedTask")[i].getElementsByClassName("label")[0].textContent);           
        }

        localStorage.removeItem("ToDoList");
        localStorage.setItem(
            "ToDoList", JSON.stringify({unfinishedTasks: unfinishedTasksArr, finishedTasks: finishedTasksArr}));
    } catch (e) {   
        console.log("Ошибка сохранения");     
    }
}

//Функция загрузки предыдущего состояния списков незавершеннеых и завершенных задач.
function load() {
    return JSON.parse(localStorage.getItem("ToDoList"));
}

//Загрузка предыдущего состояния.
let tempData = load();
if (tempData) {
    if (tempData.unfinishedTasks.length > 0) {
        unfinishedTasks.appendChild(finishAllTaskButton);    
        for (let i = 0; i < tempData.unfinishedTasks.length; i++) {       
            unfinishedTasks.appendChild(createNewUnfinishedTask(tempData.unfinishedTasks[i]));
        }
    }
    if (tempData.finishedTasks.length > 0) {
        finishedTasks.appendChild(finishedTasksListHeader);
        finishedTasks.appendChild(deleteAllFinishedTasksButton);                        
        for (let i = 0; i < tempData.finishedTasks.length; i++) {
            let tempFinishedTask = createNewUnfinishedTask(tempData.finishedTasks[i]);
            tempFinishedTask.getElementsByClassName("checkbox")[0].checked = true;
            tempFinishedTask.className = "finishedTask";
            finishedTasks.appendChild(tempFinishedTask);            
        }    
    }
}

//Немного перетаскивания (пока только зля завершенных - незавершенных)
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
        switchFinishedUnfinished(document.getElementById(id));
        document.getElementById(id).getElementsByClassName("checkbox")[0].checked = false;    
    }  else if (document.getElementById(id).className == "unfinishedTask" && 
    (event.target.id == "finishedTasks" || event.target.parentNode.id == "finishedTasks" || event.target.parentNode.parentNode.id)) {
        switchFinishedUnfinished(document.getElementById(id));  
        document.getElementById(id).getElementsByClassName("checkbox")[0].checked = true;   
    }  

    event
        .dataTransfer
        .clearData();
}