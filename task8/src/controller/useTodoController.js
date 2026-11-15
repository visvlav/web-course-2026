import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addTodo,
  createTodo,
  editTodo,
  getStats,
  removeTodo,
  toggleTodo,
} from '../model/todoModel';
import { DEFAULT_FILTER_ID, FILTERS } from '../model/filters';
import { DEFAULT_SORTER_ID, SORTERS } from '../model/sorters';
import { selectVisibleTodos } from '../model/selectors';
import { loadTodos, saveTodos } from '../model/storage';
import { fetchTodosFromApi } from '../model/api';

/**
 * CONTROLLER: единственное место, где состояние связывается с моделью.
 * View ничего не знает о модели — он получает данные и обработчики через props.
 * Model ничего не знает о React.
 *
 * Состояние живёт в App (хук вызывается в App) и раздаётся вниз через props.
 * Все обработчики обёрнуты в useCallback и используют функциональный setState,
 * поэтому их ссылки стабильны и React.memo в компонентах работает.
 */
export function useTodoController() {
  // ленивая инициализация: восстановление из localStorage при загрузке — один раз
  const [todos, setTodos] = useState(loadTodos);
  const [filterId, setFilterId] = useState(DEFAULT_FILTER_ID);
  const [sorterId, setSorterId] = useState(DEFAULT_SORTER_ID);
  const [importState, setImportState] = useState({ loading: false, error: null });

  // useEffect по назначению: синхронизация с внешней системой (localStorage)
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const onAdd = useCallback((text, done) => {
    if (!text.trim()) return;
    setTodos((prev) => addTodo(prev, createTodo(text, done)));
  }, []);

  const onToggle = useCallback((id) => {
    setTodos((prev) => toggleTodo(prev, id));
  }, []);

  const onDelete = useCallback((id) => {
    setTodos((prev) => removeTodo(prev, id));
  }, []);

  const onEdit = useCallback((id, text) => {
    if (!text.trim()) return;
    setTodos((prev) => editTodo(prev, id, text));
  }, []);

  // загрузка по клику — это обработчик события, а не useEffect
  const onImport = useCallback(async () => {
    setImportState({ loading: true, error: null });
    try {
      const imported = await fetchTodosFromApi();
      setTodos((prev) => [...prev, ...imported]);
      setImportState({ loading: false, error: null });
    } catch (err) {
      setImportState({ loading: false, error: err.message });
    }
  }, []);

  // useMemo: пересчёт только при изменении списка / фильтра / сортировки,
  // а не при каждом рендере App
  const visibleTodos = useMemo(
    () => selectVisibleTodos(todos, filterId, sorterId),
    [todos, filterId, sorterId]
  );
  const stats = useMemo(() => getStats(todos), [todos]);

  // опции для UI (строятся из реестров модели — новый фильтр/сортировка появятся сами)
  const filterOptions = useMemo(() => FILTERS.map(({ id, label }) => ({ id, label })), []);
  const sorterOptions = useMemo(() => SORTERS.map(({ id, label }) => ({ id, label })), []);

  return {
    visibleTodos,
    stats,
    filterId,
    sorterId,
    filterOptions,
    sorterOptions,
    importState,
    onAdd,
    onToggle,
    onDelete,
    onEdit,
    onImport,
    onFilterChange: setFilterId,
    onSorterChange: setSorterId,
  };
}
