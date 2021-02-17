// Function that returning the data from the server
function getJsonBinData() {
  fetch("http://localhost:3000/b/tasks")
    .then((response) => response.json())
    .then((data) => {
      savedToDoList = data["my-todo"];
      if (savedToDoList === null) return;
      addingTasksWhenContentLoaded(savedToDoList);
      hideLoading();
    })
    .catch(() => {
      const toDoListUL = document.getElementById("to-do-list");
      const listItem = document.createElement("li");
      toDoListUL.appendChild(listItem);
      listItem.innerHTML = `There is a problem in our servers, hang tight.</br> Please refresh the page.`;
      hideLoading();
    });
}

// Function that updating the JSONBIN.io.
function updateJsonBin(toDoListArr) {
  displayLoading();
  fetch("http://localhost:3000/b/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "my-todo": toDoListArr }),
  }).then((res) => {
    if (!res.ok) {
      console.log(res);
      hideLoading();
      const errorDiv = document.createElement("div");
      errorDiv.innerHTML = `There is a problem in our servers, your changes didn't save. (Error code ${res.status})</br>Please refresh the page.`;
      errorDiv.setAttribute("class", "error");
      document.querySelector("body").appendChild(errorDiv);
    } else hideLoading();
  });
}
