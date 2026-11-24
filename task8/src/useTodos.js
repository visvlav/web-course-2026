import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const addTodo = useCallback(
    (text, completed) => setTodos((prev) => [createTodo(text, completed), ...prev]),
    [],
  );
  const toggleTodo = useCallback(
    (id) =>
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [],
  );
  const deleteTodo = useCallback(
    (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [],
  );
  const editTodo = useCallback(
    (id, text) =>
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t))),
    [],
  );

  const visibleTodos = useMemo(
    () => sortTodos(filterTodos(todos, filter), sort),
    [todos, filter, sort],
  );
  const stats = useMemo(() => getStats(todos), [todos]);

  return {
    visibleTodos,
    stats,
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