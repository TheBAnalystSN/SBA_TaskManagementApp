document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded -> loading tasks from localStorage");

  // Select elements
  const taskForm = document.getElementById("taskForm");
  const taskName = document.getElementById("taskName");
  const taskCategory = document.getElementById("taskCategory");
  const taskDeadline = document.getElementById("taskDeadline");
  const taskStatus = document.getElementById("taskStatus");
  const taskListContainer = document.getElementById("taskListContainer");
  const noTasksMessage = document.getElementById("noTasksMessage");
  const clearAllBtn = document.getElementById("clearAllBtn");

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Add new task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      name: taskName.value.trim(),
      category: taskCategory.value.trim(),
      deadline: taskDeadline.value,
      status: taskStatus.value,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskForm.reset();
  });

  // Clear all tasks
  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  // Save to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Render all tasks
  function renderTasks() {
    taskListContainer.innerHTML = "";

    if (tasks.length === 0) {
      noTasksMessage.style.display = "block";
      return;
    }

    noTasksMessage.style.display = "none";

    tasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = "task-card";

      taskCard.innerHTML = `
        <h3>${task.name}</h3>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Deadline:</strong> ${task.deadline}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      `;

      taskListContainer.appendChild(taskCard);
    });

    // Handle deletes
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        renderTasks();
      });
    });
  }
});
