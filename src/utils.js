// Function that returning the data from the server
function getJsonBinData() {
  fetch("https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa/latest")
    .then((response) => response.json())
    .then((data) => {
      savedToDoList = data.record["my-todo"];
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
  fetch("https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa", {
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
