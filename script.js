// STATE 
let tasks         = JSON.parse(localStorage.getItem("studentTasks")) || []; 
let currentFilter = "all"; 
let editingId = null; 
// PERSISTENCE 
function saveTasks() { 
  localStorage.setItem("studentTasks", JSON.stringify(tasks)); 
} 
// ADD TASK 
function addTask() { 
  const title    = document.getElementById("taskTitle").value.trim(); 
  const due      = document.getElementById("taskDue").value; 
  const priority = document.getElementById("taskPriority").value; 
  if (!title) { alert("Please enter a task title!"); return; } 
  const task = { id: Date.now(), title, due, priority, completed: false, 
                 createdAt: new Date().toISOString() }; 
  tasks.unshift(task); 
  saveTasks(); 
  document.getElementById("taskTitle").value = ""; 
  document.getElementById("taskDue").value   = ""; 
  renderTasks(); 
} 
// DELETE TASK 
function deleteTask(id) { 
  if (confirm("Delete this task?")) { 
    tasks = tasks.filter(t => t.id !== id); 
    saveTasks(); renderTasks(); 
  } 
} 
// TOGGLE COMPLETE 
function toggleComplete(id) { 
  const task = tasks.find(t => t.id === id); 
  if (task) task.completed = !task.completed; 
  saveTasks(); renderTasks(); 
} 
// EDIT MODAL 
function openEditModal(id) { 
  const task = tasks.find(t => t.id === id); 
  if (!task) return; 
  editingId = id; 
  document.getElementById("editTitle").value    = task.title; 
  document.getElementById("editDue").value      = task.due; 
  document.getElementById("editPriority").value = task.priority; 
  document.getElementById("editModal").classList.add("open"); 
} 
function closeModal() { 
  document.getElementById("editModal").classList.remove("open"); 
  editingId = null; 
} 
function saveEdit() { 
  const task = tasks.find(t => t.id === editingId); 
  if (!task) return; 
  task.title    = document.getElementById("editTitle").value.trim(); 
  task.due      = document.getElementById("editDue").value; 
  task.priority = document.getElementById("editPriority").value; 
  saveTasks(); closeModal(); renderTasks(); 
} 
// FILTER 
function setFilter(filter, btn) { 
  currentFilter = filter; 
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active")); 
  btn.classList.add("active"); renderTasks(); 
} 
// HELPERS 
function isOverdue(due) { 
  if (!due) return false; 
  return new Date(due) < new Date(new Date().toDateString()); 
} 
function formatDate(due) { 
  if (!due) return "No due date"; 
  return new Date(due + "T00:00:00").toLocaleDateString("en-IN", 
    { day: "2-digit", month: "short", year: "numeric" }); 
} 
// RENDER 
function renderTasks() { 
  const search = document.getElementById("searchInput").value.toLowerCase(); 
  let filtered = tasks.filter(t => t.title.toLowerCase().includes(search)); 
  if (currentFilter === "completed") filtered = filtered.filter(t => t.completed); 
  if (currentFilter === "pending")   filtered = filtered.filter(t => !t.completed); 
  const list = document.getElementById("taskList"); 
  if (filtered.length === 0) { 
    list.innerHTML = `<div class="no-tasks">No tasks found!</div>`; 
  } else { 
    list.innerHTML = filtered.map(task => { 
      const overdue = !task.completed && isOverdue(task.due); 
      return `<div class="task-item ${task.completed?"completed":""} $
{overdue?"overdue":""}"> 
        <input type="checkbox" class="task-check" ${task.completed?"checked":""} 
               onchange="toggleComplete(${task.id})" /> 
        <div class="task-info"> 
          <div class="task-title">${task.title}</div> 
          <div class="task-meta"> 
            <span class="task-due ${overdue?"overdue":""}"> 
              ${formatDate(task.due)} ${overdue?"Overdue":""} 
            </span> 
            <span class="priority-badge priority-${task.priority}"> 
              ${task.priority.toUpperCase()}</span> 
          </div></div> 
        <div class="task-actions"> 
          <button class="btn btn-warning" onclick="openEditModal(${task.id})">Edit</button> 
          <button class="btn btn-danger"  onclick="deleteTask(${task.id})">Delete</button> 
        </div></div>`; 
    }).join(""); 
  } 
  document.getElementById("totalCount").textContent     = tasks.length; 
  document.getElementById("pendingCount").textContent   = tasks.filter(t=>!
t.completed).length; 
  document.getElementById("completedCount").textContent = 
tasks.filter(t=>t.completed).length; 
  document.getElementById("overdueCount").textContent   = tasks.filter(t=>!
t.completed&&isOverdue(t.due)).length; 
} 
// EVENT LISTENERS 
document.getElementById("editModal").addEventListener("click", function(e) { 
  if (e.target === this) closeModal(); 
}); 
document.getElementById("taskTitle").addEventListener("keypress", function(e) { 
  if (e.key === "Enter") addTask(); 
}); 
// INIT 
renderTasks();
