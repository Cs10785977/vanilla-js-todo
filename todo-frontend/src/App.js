import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  const API_URL = 'http://localhost:5001/todos';

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = () => {
    if (!task.trim()) return;

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task: task,
        completed: false
      })
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTask('');
      });
  };

  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditedTask(todo.task);
  };

  const saveEdit = (id) => {
    if (!editedTask.trim()) return;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task: editedTask
      })
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
        setEditingId(null);
        setEditedTask('');
      });
  };

  return (
  <div className="container mt-3">
    <h1>To-Do List</h1>

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Enter a task"
      value={task}
      onChange={(e) => setTask(e.target.value)}
    />

    <button className="btn btn-primary mb-3" onClick={addTodo}>
      Add
    </button>

    <ul className="list-group">
      {todos.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
              />
              <button
                className="btn btn-success btn-sm"
                onClick={() => saveEdit(todo.id)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              {todo.task}
              <div className="mt-2">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => startEditing(todo)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;
