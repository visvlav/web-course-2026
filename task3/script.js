
let tasks = [];
let nextId = 1; 
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const warning = document.getElementById('warning');
const counter = document.getElementById('counter');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

function updateCounter() {
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  counter.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;
}

function render() {
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  taskList.innerHTML = '';
  filteredTasks.map(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
  }).forEach(li => taskList.appendChild(li));

  updateCounter();
}
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    warning.textContent = 'Введите текст задачи!';
    return;
  }
  warning.textContent = '';

  const newTask = {
    id: nextId++,
    text: text,
    completed: false
  };
  tasks.push(newTask);
  taskInput.value = '';
  render();
}
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  render();
}
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}
function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter);
  });
});

render();