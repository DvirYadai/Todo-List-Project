const addButton = document.getElementById('add-button');
addButton.addEventListener('click', creatingToDoTask);


// Function that create to do task item and appending it to the html.
function creatingToDoTask(){
    const inputValue = document.getElementById('text-input');
    const inputPriority = document.getElementById('priority-selector');
    let timeCreation = new Date();
    timeCreation = timeCreation.toISOString().split('T')[0]+' '+timeCreation.toTimeString().split(' ')[0];

    // Appending the object to the html.
    const toDoList = document.getElementById('to-do-list');
    const listItem = document.createElement('li');
    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('class', 'todo-container');
    const priorityDiv = document.createElement('div');
    priorityDiv.setAttribute('class', 'todo-priority');
    priorityDiv.innerText = inputPriority.value;
    const dateDiv = document.createElement('div');
    dateDiv.setAttribute('class', 'todo-created-at');
    dateDiv.innerText = timeCreation;
    const textDiv = document.createElement('div');
    textDiv.setAttribute('class', 'todo-text');
    textDiv.innerText = inputValue.value;
    containerDiv.appendChild(priorityDiv);
    containerDiv.appendChild(dateDiv);
    containerDiv.appendChild(textDiv);
    listItem.appendChild(containerDiv);
    toDoList.appendChild(listItem);

    // Cleaning the text input.
    inputValue.value = "";

    // Calling a function to store the text, priority and time in the localStorage
}






