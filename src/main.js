let savedToDoList = [];

// Prevent the tasks from erasing when i refresh the page
window.addEventListener("DOMContentLoaded", () => {
  getJsonBinData()
    .then((response) => response.json())
    .then((data) => {
      savedToDoList = data.record["my-todo"];
      if (savedToDoList === null) return;
      addingTasksWhenContentLoaded(savedToDoList);
    });
});

// main events
document.getElementById("add-button").addEventListener("click", addingToDoTask);
document
  .getElementById("sort-button")
  .addEventListener("click", sortTheTasksByPriority);
let spanCounter = document.getElementById("counter");

// Function that create to do task item and appending it to the html.
function addingToDoTask() {
  const inputValue = document.getElementById("text-input");
  const inputPriority = document.getElementById("priority-selector");
  let timeCreation = new Date();
  timeCreation =
    timeCreation.toISOString().split("T")[0] +
    " " +
    timeCreation.toTimeString().split(" ")[0];

  // Appending the object to the html.
  const toDoListUL = document.getElementById("to-do-list");
  const listItem = document.createElement("li");
  const containerDiv = document.createElement("div");
  containerDiv.setAttribute("class", "todo-container");

  // Calling function that create div and appending the div to the containerDiv.
  appendProperty(containerDiv, "todo-priority", inputPriority.value);
  appendProperty(containerDiv, "todo-created-at", timeCreation);
  appendProperty(containerDiv, "todo-text", inputValue.value);

  // Creating the delete button
  const deleteButton = document.createElement("i");
  deleteButton.setAttribute("class", "fas fa-trash-alt");

  listItem.appendChild(deleteButton);
  listItem.appendChild(containerDiv);
  toDoListUL.appendChild(listItem);

  // Calling a function to store the text, priority and time in the localStorage and in the JSONBIN.io.
  toDoTaskObjectCreationAndStorage(inputValue, inputPriority, timeCreation);

  // Cleaning the text input.
  inputValue.value = "";
}

// Function that create to do task object and store it in the localStorage and in the JSONBIN.io.
function toDoTaskObjectCreationAndStorage(text, priority, time) {
  // Creation of task object
  const taskObject = {
    priority: priority.value,
    date: time,
    text: text.value,
  };

  // Store the object in the localStorage
  let toDoListLocalStorage = JSON.parse(localStorage.getItem("my-todo"));
  if (toDoListLocalStorage === null) toDoListLocalStorage = [];
  toDoListLocalStorage.push(taskObject);
  localStorage.setItem("my-todo", JSON.stringify(toDoListLocalStorage));

  // Store the object in the JSONBIN.io
  savedToDoList.push(taskObject);
  updateJsonBin(savedToDoList);

  // Changing the counter
  spanCounter.innerText = savedToDoList.length;
}

// !only when refreshing! Function that create to do task item and appending it to the html from the array located in JS file. !only when refreshing!
function addingTasksWhenContentLoaded(arr) {
  const toDoListUL = document.getElementById("to-do-list");
  for (const item of arr) {
    const listItem = document.createElement("li");
    const containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "todo-container");

    appendProperty(containerDiv, "todo-priority", item.priority);
    appendProperty(containerDiv, "todo-created-at", item.date);
    appendProperty(containerDiv, "todo-text", item.text);

    listItem.appendChild(containerDiv);
    toDoListUL.appendChild(listItem);
  }

  // Changing the number of tasks in the html.
  spanCounter.innerText = arr.length;
}

// Function that create div and appending the div to his parent.
function appendProperty(divElement, className, innerText) {
  const propertyDiv = document.createElement("div");
  propertyDiv.setAttribute("class", className);
  propertyDiv.innerText = innerText;
  divElement.appendChild(propertyDiv);
}

// Function that sort array of object
function sortTheTasksByPriority() {
  let sortedToDoList = savedToDoList;
  sortedToDoList.sort(function (a, b) {
    return b.priority - a.priority;
  });
  const toDoListUL = document.getElementById("to-do-list");
  let newLi;
  const liArr = Array.from(document.querySelectorAll("li"));
  const priorityArr = Array.from(document.querySelectorAll(".todo-priority"));
  toDoListUL.innerHTML = "";
  let j;
  for (const item of sortedToDoList) {
    for (let i = 0; i < priorityArr.length; i++) {
      if (item.priority === priorityArr[i].innerText) {
        newLi = liArr[i];
        j = i;
        break;
      }
    }
    toDoListUL.appendChild(newLi);
    liArr.splice(j, 1);
    priorityArr.splice(j, 1);
  }
}

// Function that updating the JSONBIN.io.
function updateJsonBin(toDoListArr) {
  fetch("https://api.jsonbin.io/v3/b/6012ca546bdb326ce4bc6c88", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "my-todo": toDoListArr }),
  });
}

// Function that returning the data from the server
function getJsonBinData() {
  return fetch("https://api.jsonbin.io/v3/b/6012ca546bdb326ce4bc6c88/latest");
}
