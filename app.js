/* --- App --- */
const STORAGE_KEY = "sba_tasks_v1";
let tasks = []; // array of task objects

/* --- DOM Elements --- */
const taskForm = document.getElementById("taskForm");
const taskListContainer = document.getElementById("taskListContainer");
const noTasksMessage = document.getElementById("noTaskMessage");
const filterCategory = document.getElementByID("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const clearAllBtn = document.getElementByID("clearAllBtn");

/* --- utility Functions --- */

function generated() {
    return "t_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// Date string //
function paresDateEndofDay(dateStr) {
    const d = new Date(dateStr + "T23:59:59");
    return new Date(d.getTime());
}

// Format date //
function displayDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "Invalid date";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

/* --- Local Storate ---*/
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON, Stringify(tasks));
    } catch (err) { 
        console.error("Failed to save tasks:",err);
    }
}

function loadTasksFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        // Make sure array and objectgs have expected props //
        if (Array.isArray(parsed)) return parsed; return [];
    } catch (err) {
        console.error("Failed to load tasks:", err);
        return [];
    }
}

// Deadlines and Overdue tasks section //
function updateOverdueStatuses() {
  const today = new Date();
  tasks.forEach(task => {
    // Only mark Overdue if not Completed
    if (task.status !== "Completed") {
      const deadline = parseDateEndOfDay(task.deadline);
      if (deadline < today) {
        task.status = "Overdue";
      } else {
        // If previously overdue but now before deadline, set to In Progress (or keep given status)
        if (task.status === "Overdue") task.status = "In Progress";
      }
    }
  });
}

// Add new task array //
function addTask({ name, category, deadline, status }) {
  // Basic validation
  if (!name || !category || !deadline) {
    alert("Please provide a name, category, and deadline.");
    return;
  }

  // Build object
  const newTask = {
    id: generateId(),
    name: String(name).trim(),
    category: String(category).trim(),
    deadline: String(deadline),
    status: status || "In Progress",
  };

  tasks.push(newTask);
  updateOverdueStatuses();
  saveTasksToStorage();
  renderTasks();
  populateCategoryFilter();
}

// Update Status for single task //
function updateTaskStatus(taskId, newStatus) {
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;
  tasks[idx].status = newStatus;
  updateOverdueStatuses();
  saveTasksToStorage();
  renderTasks();
}

// Remove task by id //
function removeTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasksToStorage();
  renderTasks();
  populateCategoryFilter();
}

//* --- Filtering & Rendering --- *//

function getFilteredTasks() {
  const category = filterCategory.value;
  const status = filterStatus.value;

  return tasks.filter(task => {
    const matchCategory = (category === "All" || task.category === category);
    const matchStatus = (status === "All" || (status === "Overdue" ? task.status === "Overdue" : task.status === status));
    return matchCategory && matchStatus;
  });
}

function renderTasks() {
  // Update overdue statuses first
  updateOverdueStatuses();

  // Choose tasks to display based on filters
  const toDisplay = getFilteredTasks();

  // Clear container
  taskListContainer.innerHTML = "";

  if (!toDisplay.length) {
    noTasksMessage.style.display = "block";
    return;
  } else {
    noTasksMessage.style.display = "none";
  }

  toDisplay.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.className = "task-item";

    // Title / name
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.name;

    // Category
    const category = document.createElement("div");
    category.className = "task-category";
    category.textContent = task.category;

    // Deadline
    const deadline = document.createElement("div");
    deadline.className = "task-deadline";
    deadline.textContent = displayDate(task.deadline);

    // Status (visual pill + dropdown to change)
    const statusWrap = document.createElement("div");
    statusWrap.className = "task-status";
    const statusPill = document.createElement("span");
    statusPill.className = "status-pill";
    statusPill.textContent = task.status;
    if (task.status === "In Progress") statusPill.classList.add("status-inprogress");
    else if (task.status === "Completed") statusPill.classList.add("status-completed");
    else if (task.status === "Overdue") statusPill.classList.add("status-overdue");

    // status selector
    const select = document.createElement("select");
    select.className = "small-select";
    ["In Progress", "Completed", "Overdue"].forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      if (s === task.status) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      updateTaskStatus(task.id, e.target.value);
    });

    statusWrap.appendChild(statusPill);
    statusWrap.appendChild(select);

    // Controls (delete)
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "8px";
    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "small-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      if (confirm(`Delete "${task.name}"?`)) removeTask(task.id);
    });

    controls.appendChild(delBtn);

    // Compose grid
    taskEl.appendChild(title);
    taskEl.appendChild(category);
    taskEl.appendChild(deadline);
    taskEl.appendChild(statusWrap);
    taskEl.appendChild(controls);

    taskListContainer.appendChild(taskEl);
  });
}

/* Populate category dropdown.
function populateCategoryFilter() {
  const categories = Array.from(new Set(tasks.map(t => t.category))).sort();
  // Clear existing but keep "All"
  filterCategory.innerHTML = "";
  const all = document.createElement("option");
  all.value = "All";
  all.textContent = "All";
  filterCategory.appendChild(all);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filterCategory.appendChild(opt);
  });
}

/* ---------- Event Listeners ---------- */

// Submit form to add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("taskName").value.trim();
  const category = document.getElementById("taskCategory").value.trim();
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  addTask({ name, category, deadline, status });

  // reset form
  taskForm.reset();
});

// Apply filter
applyFilterBtn.addEventListener("click", () => {
  renderTasks();
});

// Reset filters
resetFilterBtn.addEventListener("click", () => {
  filterCategory.value = "All";
  filterStatus.value = "All";
  renderTasks();
});

// Clear All tasks
clearAllBtn.addEventListener("click", () => {
  if (!tasks.length) return alert("No tasks to clear.");
  if (confirm("Clear ALL tasks? This cannot be undone.")) {
    tasks = [];
    saveTasksToStorage();
    renderTasks();
    populateCategoryFilter();
  }
});

/* ---------- App Initialization ---------- */

function initApp() {
  tasks = loadTasksFromStorage();
  updateOverdueStatuses();
  populateCategoryFilter();
  renderTasks();
}

// Run
initApp();