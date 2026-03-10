const apiURL = 'http://localhost:3000/todos';

const todoList = document.getElementById('todo-list');

const newTodoForm = document.getElementById('new-todo-form');

const newTodoInput = document.getElementById('new-todo-input');

async function fetchTodos() {

const response = await fetch(apiURL);

const todos = await response.json();

todoList.innerHTML = '';

todos.forEach(todo => addTodoToDOM(todo));

}

function addTodoToDOM(todo) {

const li = document.createElement('li');

li.innerHTML = `
<span class="${todo.completed ? 'completed' : ''}">${todo.task}</span>
<button onclick="deleteTodo(${todo.id})">Delete</button>
`;

todoList.appendChild(li);

}

newTodoForm.addEventListener('submit', async (e) => {

e.preventDefault();

const newTask = newTodoInput.value;

const newTodo = { task: newTask, completed: false };

await fetch(apiURL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(newTodo)
});

newTodoInput.value = '';

fetchTodos();

});

async function deleteTodo(id) {

await fetch(`${apiURL}/${id}`, {
method: 'DELETE'
});

fetchTodos();

}

fetchTodos();