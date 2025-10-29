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
