var addButton=document.getElementById('addTask');
var inputTask=document.getElementById('newTask');
var unfinishedTasks=document.getElementById('unfinishedTasks');
var finishedTasks=document.getElementById('finishedTasks');
var deletedTasks=document.getElementById('deletedTasks');
var finishAllButton=document.getElementById('finishAll');
var clearFinishedTasksButton = document.getElementById('clearFinishedTasks');
var trueDeleteButton=document.getElementById('trueDelete');
      

function save() {
    var unfinishedTasksArr=[];  
    var finishedTasksArr=[];  

    for(var i=1; i<unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
        
    }

    for(var i=1; i<finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }
    
    
    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({unfinishedTasks: unfinishedTasksArr, finishedTasks: finishedTasksArr}));
}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

{
    var data=load();
    if (unfinishedTasks) {
        for (var i=0; i<data.unfinishedTasks.length; i++){
            var listItem = createNewElement(data.unfinishedTasks[i]);
            unfinishedTasks.appendChild(listItem);
        }
    }

    if (finishedTasks) {
        for (var j=0; j<data.finishedTasks.length; j++) {
            var listItem = createNewElement(data.finishedTasks[j]);
            finishedTasks.appendChild(listItem);
        }
    }
}


addButton.onclick=addTask;
function addTask() {
    if(inputTask.value) {
        var listItem=createNewElement(inputTask.value);
        unfinishedTasks.appendChild(listItem);
        inputTask.value="";
        save();
    }
}

function createNewElement(task) {
    var listItem=document.createElement('li');

    var finishButton=document.createElement('button');
    finishButton.className='anotherButton';
    finishButton.textContent="Выполнено"; 
    finishButton.onclick=finishTask;

    var label=document.createElement('label');    
    label.innerText=task; 

    var changeButton=document.createElement('button');
    changeButton.className='anotherButton';
    changeButton.textContent="Изменить";
    changeButton.onclick=editTask;

    var deleteButton=document.createElement('button');
    deleteButton.className='anotherButton';
    deleteButton.textContent="Удалить";
    deleteButton.onclick=deleteTask;

    listItem.appendChild(label);
    listItem.appendChild(finishButton);
    listItem.appendChild(changeButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

function deleteTask() {
    var listItem=this.parentNode;
    this.textContent="Восстановить";
    this.onclick=recoverTask;    
    deletedTasks.appendChild(listItem);
    save();
}

function editTask() {
    var listItem=this.parentNode;
    var label = listItem.querySelector('label');
    var textTask = label.textContent;
    var input = document.createElement('input');
    input.placeholder = textTask;
    label = listItem.replaceChild(input, label);
    console.log(textTask);
    this.textContent="Сохранить";
    this.onclick=saveTask; 
}

function saveTask() {
    var listItem=this.parentNode;
    var input = listItem.querySelector('input');
    var textTask = input.value;
    var label = document.createElement('label');
    label.innerText = textTask;
    input = listItem.replaceChild(label, input);
    console.log(textTask);
    this.textContent="Изменить";
    this.onclick=editTask;
    save();
}

function finishTask() {
    var listItem=this.parentNode;
    this.textContent="Вернуть";
    this.onclick=unfinishTask;    
    finishedTasks.appendChild(listItem);
    save();
}

function unfinishTask() {
    var listItem=this.parentNode;
    this.textContent="Выполнено";
    this.onclick=finishTask;    
    unfinishedTasks.appendChild(listItem);
    save();
}

function recoverTask() {
    var listItem=this.parentNode;
    this.textContent="Удалить";
    this.onclick=deleteTask;    
    unfinishedTasks.appendChild(listItem);
    save();
}

finishAllButton.onclick=finishAll;
function finishAll() {
    var list=this.parentNode;    
    while( list.firstChild ){
        finishedTasks.appendChild(list.firstChild);
      }    
    list.appendChild(finishAllButton);
    finishAllButton.onclick=finishAll;
    save();
}

clearFinishedTasksButton.onclick=clearFinishedTasks;
function clearFinishedTasks() {
    var list=this.parentNode;    
    while( list.firstChild ){
        deletedTasks.appendChild(list.firstChild);
      }    
    list.appendChild(clearFinishedTasksButton);
    clearFinishedTasksButton.onclick=clearFinishedTasks; 
    save();   
}

trueDeleteButton.onclick=trueDelete;
function trueDelete() {    
    var list=this.parentNode;    
    while( list.firstChild ){
        list.removeChild( list.firstChild );
      }    
    list.appendChild(trueDeleteButton);
    trueDeleteButton.onclick=trueDelete;    
}

