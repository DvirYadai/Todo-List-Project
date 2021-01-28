let savedToDoList = [];
// Prevent the tasks from erasing when i refresh the page
window.addEventListener("DOMContentLoaded", () => {
  const savedToDoList = JSON.parse(localStorage.getItem("my-todo"));
  const savedCount = JSON.parse(localStorage.getItem("NumberOfTasks"));
  if (savedToDoList === null) return;
  addingTasksWhenContentLoaded(savedToDoList, savedCount);
});

// main event
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

  listItem.appendChild(containerDiv);
  toDoListUL.appendChild(listItem);

  // Calling a function to store the text, priority and time in the localStorage and in the JSONBIN.io.
  toDoTaskObjectCreationAndStorage(inputValue, inputPriority, timeCreation);

  // Cleaning the text input.
  inputValue.value = "";
}

// Function that create to do task object and store it in the localStorage.
function toDoTaskObjectCreationAndStorage(text, priority, time) {
  // Creation of task object
  const taskObject = {
    priority: priority.value,
    date: time,
    text: text.value,
  };

  // Store the object in the localStorage
  let toDoList = JSON.parse(localStorage.getItem("my-todo"));
  if (toDoList === null) toDoList = [];
  toDoList.push(taskObject);
  localStorage.setItem("my-todo", JSON.stringify(toDoList));

  // Calling a function to count how much tasks i have and changing the number of tasks in the html accordingly.
  tasksCount(toDoList);
}

// Function that count how much tasks i have added to my to do list, adding the count to the localStorage and changing the number of tasks in the html.
function tasksCount(arr) {
  // Counting how much tasks i have added.
  let count = JSON.parse(localStorage.getItem("NumberOfTasks"));
  count = 0;
  for (let i = 0; i < arr.length; i++) count++;

  // Adding the count to the localStorage.
  localStorage.setItem("NumberOfTasks", JSON.stringify(count));

  // Changing the number of tasks in the html.
  spanCounter.innerText = count;
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
  let sortedToDoList = JSON.parse(localStorage.getItem("my-todo"));
  sortedToDoList.sort(function (a, b) {
    return b.priority - a.priority;
  });
  const toDoListUL = document.getElementById("to-do-list");
  let newLi;
  const liArr = Array.from(document.querySelectorAll("li"));
  const priorityArr = Array.from(document.querySelectorAll(".todo-priority"));
  toDoListUL.innerHTML = "";
  let j;
  console.log(sortedToDoList[0].priority);
  console.log(liArr);
  console.log(priorityArr);
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

// Updating the JSONBIN.io.
function updateJsonBin(toDoListArr) {
  fetch("https://api.jsonbin.io/v3/b/6012ca546bdb326ce4bc6c88", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "my-todo": toDoListArr }),
  });
}

function getJsonBinData() {
  return fetch("https://api.jsonbin.io/v3/b/6012ca546bdb326ce4bc6c88/latest");
}
