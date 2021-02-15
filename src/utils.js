const DB_NAME = "my-todo";

// Function that returning the data from the server
function getJsonBinData() {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa/latest"
  );
  xhr.responseType = "json";
  xhr.send();
  xhr.onload = function () {
    if (xhr.status !== 200) {
      const toDoListUL = document.getElementById("to-do-list");
      const listItem = document.createElement("li");
      toDoListUL.appendChild(listItem);
      listItem.innerHTML = "There is a problem in our servers, hang tight";
      hideLoading();
      return;
    }
    savedToDoList = xhr.response.record["my-todo"];
    if (savedToDoList === null) return;
    addingTasksWhenContentLoaded(savedToDoList);
    hideLoading();
  };
}

// Function that updating the JSONBIN.io.
function updateJsonBin(toDoListArr) {
  displayLoading();
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa");
  xhr.setRequestHeader("Content-Type", "application/json");
  body = JSON.stringify({ "my-todo": toDoListArr });
  xhr.send(body);
  xhr.onload = () => {
    if (xhr.status !== 200)
      alert("There is a problem in our servers, your changes didn't save");
    hideLoading();
  };
}
