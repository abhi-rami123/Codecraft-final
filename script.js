// Load categories from backend and populate sidebar and dropdown
async function loadCategories() {
  const res = await fetch('/categories');
  const categories = await res.json();

  const list = document.getElementById('category-list');
  const select = document.getElementById('category-select');

  list.innerHTML = '';
  select.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat.name;
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// Load tasks from backend and render to list
async function loadTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();

  const list = document.getElementById('task-list');
  const count = document.getElementById('task-count');
  const completed = document.getElementById('completed-count');

  list.innerHTML = '';
  count.textContent = tasks.length;
  completed.textContent = tasks.filter(t => t.completed).length;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}/>
      <span class="task-desc">${task.description}</span>
      <span class="task-category">[${task.categoryId}]</span>
      <span class="due-date">${task.dueDate.split("T")[0]}</span>
      <span class="priority ${task.priority}">⬤</span>
      <div class="task-actions">
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Add delete handler
    li.querySelector('.delete-btn').addEventListener('click', async () => {
      await fetch('/tasks/' + task.id, { method: 'DELETE' });
      loadTasks();
    });

    list.appendChild(li);
  });
}

// Handle task form submission
document.getElementById('task-form').addEventListener('submit', async e => {
  e.preventDefault();

  const description = document.getElementById('task-input').value;
  const categoryId = document.getElementById('category-select').value;

  const task = {
    description,
    categoryId,
    dueDate: new Date().toISOString(),
    priority: 'medium',
    completed: false
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });

  if (response.ok) {
    document.getElementById('task-form').reset();
    loadTasks();
  } else {
    alert("Failed to add task.");
  }
});

// Handle new category form submission
document.getElementById('add-category-form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('new-category').value;

  const response = await fetch('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  if (response.ok) {
    document.getElementById('add-category-form').reset();
    loadCategories();
  } else {
    alert("Failed to add category.");
  }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadTasks();
});
