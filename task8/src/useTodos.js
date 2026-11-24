import { useState, useEffect } from 'react';
import { createTodo, filterTodos, sortTodos, getStats } from './todoModel';

const STORAGE_KEY = 'todos';
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
  }
  return [createTodo('Выучить React'), createTodo('Сделать лабу', true)];
}
export default function useTodos() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, completed) =>
    setTodos((prev) => [createTodo(text, completed), ...prev]);
  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const editTodo = (id, text) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)));

  return {
    visibleTodos: sortTodos(filterTodos(todos, filter), sort),
    stats: getStats(todos),
    filter,
    setFilter,
    sort,
    setSort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  };
}