let savedToDoList = [];

// Prevent the tasks from erasing when i refresh the page
window.addEventListener("DOMContentLoaded", () => {
  displayLoading();
  getJsonBinData();
});

// main events
document.getElementById("add-button").addEventListener("click", addingToDoTask);
document
  .getElementById("sort-button")
  .addEventListener("click", sortTheTasksByPriority);
document.getElementById("undo-button").addEventListener("click", undo);
document.getElementById("search-button").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const searched = document.getElementById("search-button").value.trim();
    if (searched !== "") {
      let text = Array.from(document.querySelectorAll(".todo-text"));
      const re = new RegExp(searched, "g");
      for (let i = 0; i < text.length; i++) {
        text[i].innerHTML = text[i].innerHTML.replace(
          re,
          `<mark>${searched}</mark>`
        );
      }
    }
  }
  if (document.getElementById("search-button").value === "") {
    let text = Array.from(document.querySelectorAll(".todo-text"));
    for (let i = 0; i < text.length; i++) {
      text[i].innerHTML = text[i].innerHTML.replace(
        /(<mark[^>]*>|<\/mark>)/g,
        ""
      );
    }
  }
});
let spanCounter = document.getElementById("counter");

// Function that create to do task item and appending it to the html.
function addingToDoTask() {
  const inputValue = document.getElementById("text-input");
  const inputPriority = document.getElementById("priority-selector");
  if (inputValue.value === "" || inputPriority.value === "") {
    alert("Please enter your task and priority");
    return;
  }
  let timeCreation = new Date();
  timeCreation =
    timeCreation.toISOString().split("T")[0] +
    " " +
    timeCreation.toTimeString().split(" ")[0];

  LiCreationAndAppendingToHTML(
    inputValue.value,
    inputPriority.value,
    timeCreation
  );

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
    isDone: false,
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

    appendProperty(containerDiv, "todo-text", item.text);
    appendProperty(containerDiv, "todo-priority", item.priority);
    appendProperty(containerDiv, "todo-created-at", item.date);

    listItem.appendChild(containerDiv);
    toDoListUL.appendChild(listItem);

    // Creating the delete button
    deleteButtonCreation(containerDiv);

    // Creating the edit button
    editButtonCreation(containerDiv);

    // Creating the checkbox
    checkBoxCreation(containerDiv);

    // Checking if the task is already finished
    if (item.isDone === true) {
      listItem.setAttribute("class", "done");
      const checkbox = listItem.querySelector("#checkbox");
      checkbox.checked = true;
    }
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

// Function that creat li and appending it to the html
function LiCreationAndAppendingToHTML(inputValue, inputPriority, timeCreation) {
  const toDoListUL = document.getElementById("to-do-list");
  const listItem = document.createElement("li");
  const containerDiv = document.createElement("div");
  containerDiv.setAttribute("class", "todo-container");

  // Calling function that create div and appending the div to the containerDiv.
  appendProperty(containerDiv, "todo-text", inputValue);
  appendProperty(containerDiv, "todo-priority", inputPriority);
  appendProperty(containerDiv, "todo-created-at", timeCreation);

  listItem.appendChild(containerDiv);
  toDoListUL.appendChild(listItem);

  // Creating the delete button
  deleteButtonCreation(containerDiv);

  // Creating the edit button
  editButtonCreation(containerDiv);

  // Creating the checkbox
  checkBoxCreation(containerDiv);
}

// Function that create the delete button, adding click event and updating the localStorage and the JSONBIN.io
function deleteButtonCreation(divParent) {
  const deleteButton = document.createElement("i");
  deleteButton.setAttribute("class", "fas fa-trash-alt");
  divParent.appendChild(deleteButton);

  // Add click event to the button
  deleteButton.addEventListener("click", () => {
    const textDiv = divParent.querySelector("div.todo-text");
    let index = 0;
    for (let i = 0; i < savedToDoList.length; i++) {
      if (savedToDoList[i].text === textDiv.innerText) index = i;
    }

    // Adding the data that was delete to the changeDataArr for the undo function.
    let changeDataArr = JSON.parse(localStorage.getItem("changeDataArr"));
    if (changeDataArr === null) changeDataArr = [];
    changeDataArr.push(savedToDoList[index]);
    localStorage.setItem("changeDataArr", JSON.stringify(changeDataArr));

    savedToDoList.splice(index, 1);
    deleteButton.parentElement.parentElement.remove();

    // Updating the number of tasks in the html.
    spanCounter.innerText = savedToDoList.length;

    // Updating the localStorage
    localStorage.setItem("my-todo", JSON.stringify(savedToDoList));

    // Updating the JSONBIN.io
    updateJsonBin(savedToDoList);
  });
}

// Function that create the edit button, adding click events and updating the localStorage and the JSONBIN.io
function editButtonCreation(divParent) {
  const editButton = document.createElement("i");
  editButton.setAttribute("class", "fas fa-edit");
  divParent.appendChild(editButton);

  const checkButton = document.createElement("i");
  checkButton.setAttribute("class", "far fa-check-circle check-default");
  divParent.appendChild(checkButton);

  // Add click event to the button
  editButton.addEventListener("click", () => {
    const textDiv = divParent.querySelector("div.todo-text");
    const priorityDiv = divParent.querySelector("div.todo-priority");
    editButton.classList.add("edit-clicked");
    checkButton.classList.replace("check-default", "check-when-edit-clicked");

    textDiv.contentEditable = true;
    textDiv.classList.add("edit");
    textDiv.focus();
    priorityDiv.contentEditable = true;
    priorityDiv.classList.add("edit");
    let index = 0;
    for (let i = 0; i < savedToDoList.length; i++) {
      if (savedToDoList[i].text === textDiv.innerText) index = i;
    }

    // Adding the data that was edit to the changeDataArr for the undo function.
    let changeDataArr = JSON.parse(localStorage.getItem("changeDataArr"));
    if (changeDataArr === null) changeDataArr = [];
    changeDataArr.push({
      text: textDiv.innerText,
      priority: priorityDiv.innerText,
    });

    // Add click event to close the edit option.
    checkButton.addEventListener("click", () => {
      if (
        priorityDiv.innerText < 1 ||
        priorityDiv.innerText > 5 ||
        priorityDiv.innerText.match(/[a-z]/i)
      ) {
        alert("Priotity must be a number from 1 to 5");
        return;
      }
      textDiv.contentEditable = false;
      textDiv.classList.remove("edit");
      priorityDiv.contentEditable = false;
      priorityDiv.classList.remove("edit");
      editButton.classList.remove("edit-clicked");
      checkButton.classList.replace("check-when-edit-clicked", "check-default");

      // Adding more data to the changeDataArr for the undo function.
      changeDataArr[changeDataArr.length - 1].newText = textDiv.innerText;
      localStorage.setItem("changeDataArr", JSON.stringify(changeDataArr));

      // Update the innerText of the div in the localStorage and JSONBIN.io
      savedToDoList[index].text = textDiv.innerText;
      savedToDoList[index].priority = priorityDiv.innerText;
      localStorage.setItem("my-todo", JSON.stringify(savedToDoList));
      updateJsonBin(savedToDoList);
    });
  });
}

// Function that add checkbox to the task
function checkBoxCreation(divParent) {
  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("id", "checkbox");
  divParent.appendChild(checkBox);

  checkBox.addEventListener("click", () => {
    if (checkBox.checked === true) {
      divParent.parentElement.setAttribute("class", "done");
      let text = divParent.querySelector(".todo-text");
      for (let i = 0; i < savedToDoList.length; i++) {
        if (text.innerText === savedToDoList[i].text) {
          savedToDoList[i].isDone = true;
        }
      }
    } else {
      divParent.parentElement.removeAttribute("class", "done");
      let text = divParent.querySelector(".todo-text");
      for (let i = 0; i < savedToDoList.length; i++) {
        if (text.innerText === savedToDoList[i].text) {
          savedToDoList[i].isDone = false;
        }
      }
    }
    updateJsonBin(savedToDoList);
  });
}

// Function that sort array of object
function sortTheTasksByPriority() {
  let liArr = Array.from(document.querySelectorAll("li"));
  liArr.sort(function (a, b) {
    return (
      b.children[0].children[1].innerText - a.children[0].children[1].innerText
    );
  });
  const toDoListUL = document.getElementById("to-do-list");
  toDoListUL.innerHTML = "";
  liArr.forEach((node) => toDoListUL.appendChild(node));
}

// Function that undo the last change
function undo() {
  // Getting the array with the saved changes.
  let changeDataArr = JSON.parse(localStorage.getItem("changeDataArr"));
  // Checking if the last change was delete or edit.
  if (changeDataArr[changeDataArr.length - 1].date) {
    // Creating new li, appending it with the deleted data and appending the li to the html.
    LiCreationAndAppendingToHTML(
      changeDataArr[changeDataArr.length - 1].text,
      changeDataArr[changeDataArr.length - 1].priority,
      changeDataArr[changeDataArr.length - 1].date
    );
    savedToDoList.push(changeDataArr[changeDataArr.length - 1]);
    spanCounter.innerText = savedToDoList.length;
  } else {
    // Checking in which li was the editing and revers the edit outcome.
    let index = 0;
    for (let i = 0; i < savedToDoList.length; i++) {
      if (
        savedToDoList[i].text ===
        changeDataArr[changeDataArr.length - 1].newText
      )
        index = i;
    }
    savedToDoList[index].text = changeDataArr[changeDataArr.length - 1].text;
    savedToDoList[index].priority =
      changeDataArr[changeDataArr.length - 1].priority;
    const textDiv = document.querySelector(
      `#to-do-list > li:nth-child(${index + 1}) > div > div.todo-text`
    );
    const priorityDiv = document.querySelector(
      `#to-do-list > li:nth-child(${index + 1}) > div > div.todo-priority`
    );
    textDiv.innerText = changeDataArr[changeDataArr.length - 1].text;
    priorityDiv.innerText = changeDataArr[changeDataArr.length - 1].priority;
  }
  // Updating the localStorage and JSONBIN.io with the undo changes and deleting the last change from the changeDataArr.
  localStorage.setItem("my-todo", JSON.stringify(savedToDoList));
  updateJsonBin(savedToDoList);
  changeDataArr.splice(changeDataArr.length - 1, 1);
  localStorage.setItem("changeDataArr", JSON.stringify(changeDataArr));
}

// showing loading
function displayLoading() {
  const loader = document.querySelector("#loading");
  loader.classList.add("display");
}

// hiding loading
function hideLoading() {
  const loader = document.querySelector("#loading");
  loader.classList.remove("display");
}
