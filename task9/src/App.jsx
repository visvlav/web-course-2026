import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FILTERS,
  SORTERS,
  addTodo,
  createTodo,
  editTodo,
  fetchTodos,
  getStats,
  loadTodos,
  removeTodo,
  saveTodos,
  selectVisible,
  toggleTodo,
} from './model';
import TodoForm from './components/TodoForm';
import Stats from './components/Stats';
import Filters from './components/Filters';
import SortSelect from './components/SortSelect';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filterId, setFilterId] = useState(FILTERS[0].id);
  const [sorterId, setSorterId] = useState(SORTERS[0].id);
  const [importState, setImportState] = useState({ loading: false, error: null });

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const onAdd = useCallback((text, done) => {
    if (!text.trim()) return;
    setTodos((prev) => addTodo(prev, createTodo(text, done)));
  }, []);

  const onToggle = useCallback((id) => setTodos((prev) => toggleTodo(prev, id)), []);
  const onDelete = useCallback((id) => setTodos((prev) => removeTodo(prev, id)), []);
  const onEdit = useCallback((id, text) => {
    if (!text.trim()) return;
    setTodos((prev) => editTodo(prev, id, text));
  }, []);

  const onImport = useCallback(async () => {
    setImportState({ loading: true, error: null });
    try {
      const imported = await fetchTodos();
      setTodos((prev) => [...prev, ...imported]);
      setImportState({ loading: false, error: null });
    } catch (err) {
      setImportState({ loading: false, error: err.message });
    }
  }, []);

  const visibleTodos = useMemo(
    () => selectVisible(todos, filterId, sorterId),
    [todos, filterId, sorterId]
  );
  const stats = useMemo(() => getStats(todos), [todos]);

  return (
    <div className="app">
      <h1>Todo List</h1>

      <TodoForm onAdd={onAdd} onImport={onImport} importState={importState} />
      <Stats stats={stats} />

      <div className="toolbar">
        <Filters options={FILTERS} value={filterId} onChange={setFilterId} />
        <SortSelect options={SORTERS} value={sorterId} onChange={setSorterId} />
      </div>

      <TodoList
        todos={visibleTodos}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}
