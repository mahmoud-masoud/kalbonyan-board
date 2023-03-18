const lists = document.querySelectorAll("ul");
const btns = document.querySelectorAll("button");
const msg = document.querySelector(".warning__msg");

let localStorageTasks = [];

function createTask() {
  // create task container
  const task = document.createElement("div");
  task.classList.add("task");
  task.dataset.id = Math.floor(Math.random() * 100000);

  // task content
  const taskText = document.createElement("li");
  taskText.classList.add("task__content");
  taskText.setAttribute("contenteditable", true);
  task.append(taskText);
  taskText.setAttribute("placeholder", "Type something");

  // task edit button
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  task.append(editBtn);

  // task delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
  task.append(deleteBtn);

  task.draggable = "true";
  // append the task to list that
  // this refers to add button and previous element is the list
  this.previousElementSibling.append(task);

  // calling drag and drop function
  dragAndDrop();

  // calling the edit function to edit the task
  editTask(editBtn, taskText);

  // save the created task to localStorage
  saveTask();
}

const deleteTask = (e) => {
  // get the task
  const task = e.target.parentElement;
  if (e.target.classList[0] == "delete") {
    // passing the deleted task to delete function for local Storage
    deleteTasksLS(task);
    task.remove();
  }
};

const editTask = (editBtn, taskText) => {
  // focus on the element after creating & when edit btn clicked
  taskText.focus();
  taskText.addEventListener("input", () => {
    saveTask();
    taskText.parentElement.innerText.trim() === ""
      ? (msg.style.visibility = "visible")
      : (msg.style.visibility = "hidden");
  });

  editBtn.addEventListener("click", () => {
    taskText.focus();
  });

  // prevent the default behavior new line break when pressing the enter key
  taskText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      taskText.blur();
    }
  });
};

const dragAndDrop = (localStorageTasks = 0) => {
  // grab all tasks are currently in the dom
  let tasks = document.querySelectorAll(".task");
  // check if there local storage elements to make drag & drop functionality
  if (localStorageTasks.length > 0) {
    tasks = localStorageTasks;
  }

  // add is dragging class to the task that currently dragging
  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      task.classList.add("is__dragging");
      e.dataTransfer.setData("text/plain", e.target);
    });

    // remove the class
    task.addEventListener("dragend", () => {
      task.classList.remove("is__dragging");
    });
  });

  // insert task function has two arguments current list and the mouse y position
  // it will find the closest task and insert the dragging element above the closest el
  // if the list is empty it will append the task to the list
  const insertAboveTask = (list, mouseY) => {
    const elements = list.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    elements.forEach((el) => {
      const { top } = el.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = el;
      }
    });

    return closestTask;
  };

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bottomTask = insertAboveTask(list, e.clientY);
      const currTask = document.querySelector(".is__dragging");

      if (!bottomTask) {
        list.append(currTask);
        saveTask();
      } else {
        list.insertBefore(currTask, bottomTask);
        saveTask();
      }
    });
  });
};

const saveTask = () => {
  let tasks = [];

  // looping on lists and grab all the elements are currently in dom
  [...lists].forEach((list) => {
    // save all tasks in tasksList variable
    const tasksList = list.querySelectorAll(".task");
    // make an empty array to push the task data and on every loop the taskData will push in tasks array to update the local storage
    const tasksData = [];

    tasksList.forEach((task) => {
      // if task has no content will be ignored by local storage and removed from dom
      if (task.innerText.trim() === "") return;
      tasksData.push({ id: task.dataset.id, text: task.innerText });
    });
    tasks.push(tasksData);
  });

  // save tasks array to local storage with 3 arrays every array it's a list in order
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // checking if no tasks key in local storage if true will be null else will get back the data
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
};

const getTasks = () => {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // looping over the tasks lists, creating tasks from local storage and append every task into his own list
  tasks[0].forEach((taskData) => {
    lists[0].append(createElementForLS(taskData.id, taskData.text));
  });

  tasks[1].forEach((taskData) => {
    lists[1].append(createElementForLS(taskData.id, taskData.text));
  });

  tasks[2].forEach((taskData) => {
    lists[2].append(createElementForLS(taskData.id, taskData.text));
  });
};

const deleteTasksLS = (task) => {
  // checking on tasks array in local storage
  let tasks = [];
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // looping over tasks and remove the task based on his ID and return new array
  const updatedTasks = tasks.map((tasksList) => {
    return tasksList.filter((taskData) => {
      return taskData.id !== task.dataset.id;
    });
  });

  // update local storage with updated tasks after removing the task
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
};

function createElementForLS(id, taskValue) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.dataset.id = id;

  const taskText = document.createElement("li");
  taskText.innerText = taskValue;
  taskText.classList.add("task__content");
  taskText.setAttribute("contenteditable", true);
  task.append(taskText);
  taskText.setAttribute("placeholder", "Type something");

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  task.append(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
  task.append(deleteBtn);

  task.draggable = "true";

  localStorageTasks.push(task);

  // calling drag and drop function
  dragAndDrop(localStorageTasks);

  // calling the edit function to edit the task
  editTask(editBtn, taskText);
  return task;
}

btns.forEach((btn) => {
  btn.addEventListener("click", createTask);
});

lists.forEach((list) => {
  list.addEventListener("click", deleteTask);
});

// calling the get tasks function to get back all the task from local storage and render them in dom
document.addEventListener("DOMContentLoaded", getTasks);
