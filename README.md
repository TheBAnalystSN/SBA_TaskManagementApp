# Task Management App

**Author:** Dustin Robertson

## Overview
This Task Management App allows users to add tasks with a name, category, deadline, and status. Users can update each task's status, filter tasks by category or status, and the app will automatically mark tasks as "Overdue" when a deadline passes. Tasks are persisted using browser `local storage once the feature is added in the next iteration.

## Files
- `index.html` - Main page and UI
- `style.css` - Basic styling
- `app.js` - JavaScript logic (add/update/filter/persist tasks)
- `README.md` - This file + reflection

## How to run
1. Clone the repository or download the files.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
3. Add tasks with the form, update statuses in the list, and use the filters.

## Features implemented
- Add tasks (name, category, deadline, initial status)
- Change task status via dropdown (In Progress / Completed / Overdue)
- Auto-detect Overdue tasks
- Filter by category and status
- Delete individual tasks and clear all tasks