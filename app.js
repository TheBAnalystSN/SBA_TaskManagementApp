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