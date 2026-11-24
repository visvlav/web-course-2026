import { useState } from 'react';
import { createTodo, filterTodos, getStats } from './todoModel';
import { createTodo } from './todoModel';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Filters from './components/Filters';
import Stats from './components/Stats';

export default function App() {
  const [todos, setTodos] = useState([
    createTodo('Выучить React'),
    createTodo('Сделать лабу', true),
  ]);
    const [filter, setFilter] = useState('all');
  const addTodo = (text, completed) =>
    setTodos((prev) => [createTodo(text, completed), ...prev]);
  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const editTodo = (id, text) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)));
  const visibleTodos = filterTodos(todos, filter);
  const stats = getStats(todos);
  return (
    <>
<h1>Todo-list</h1>
      <TodoForm onAdd={addTodo} />
      <Filters current={filter} onChange={setFilter} /> 
      <Stats stats={stats} />
      <TodoList
        todos={visibleTodos} 
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo} />
    </>
  );
}