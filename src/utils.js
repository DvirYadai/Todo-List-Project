const DB_NAME = "my-todo";

// Function that returning the data from the server
async function getJsonBinData() {
  try {
    let response = await fetch(
      "https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa/latest"
    );
    response = await response.json();
    savedToDoList = response.record["my-todo"];
    if (savedToDoList === null) {
      hideLoading();
      return;
    }
    await addingTasksWhenContentLoaded(savedToDoList);
    hideLoading();
  } catch (error) {
    const toDoListUL = document.getElementById("to-do-list");
    const listItem = document.createElement("li");
    toDoListUL.appendChild(listItem);
    listItem.innerHTML = "There is a problem in our servers, hang tight";
    hideLoading();
  }
}

// Function that updating the JSONBIN.io.
async function updateJsonBin(toDoListArr) {
  displayLoading();
  // try {
  await fetch("https://api.jsonbin.io/v3/b/6015baed13b20d48e8bf32fa", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "my-todo": toDoListArr }),
  });
  // } catch (error) {
  //   console.log(error);
  // }
  hideLoading();

  // .then((res) => {
  //   if (!res.ok) {
  //   } else hideLoading();
  // });
}
