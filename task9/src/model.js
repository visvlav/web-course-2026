/**
 * MODEL — вся логика и данные в одном файле. Никакого React и DOM.
 * Функции не мутируют входные данные, а возвращают новые.
 *
 * @typedef {Object} Todo
 * @property {string} id          уникальный id (используется как key)
 * @property {string} text        текст задачи
 * @property {boolean} done       выполнена ли
 * @property {number} createdAt   время добавления (ms)
 */

// ---------- операции над задачами ----------

/** @returns {Todo} */
export function createTodo(text, done = false, createdAt = Date.now()) {
  return { id: crypto.randomUUID(), text: text.trim(), done, createdAt };
}

export const addTodo = (todos, todo) => [...todos, todo];

export const toggleTodo = (todos, id) =>
  todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));

export const removeTodo = (todos, id) => todos.filter((t) => t.id !== id);

export const editTodo = (todos, id, text) =>
  todos.map((t) => (t.id === id ? { ...t, text: text.trim() } : t));

export function getStats(todos) {
  const done = todos.filter((t) => t.done).length;
  return { total: todos.length, done, active: todos.length - done };
}

// ---------- фильтры ----------
// Новый фильтр = одна строка в массиве. Кнопки в UI строятся из него сами.

export const FILTERS = [
  { id: 'all', label: 'Все', predicate: () => true },
  { id: 'active', label: 'Невыполненные', predicate: (t) => !t.done },
  { id: 'done', label: 'Выполненные', predicate: (t) => t.done },
  // пример: { id: 'long', label: 'Длинные', predicate: (t) => t.text.length > 20 },
];

// ---------- сортировки ----------
// Новая сортировка = одна строка в массиве. Выпадающий список строится сам.

export const SORTERS = [
  { id: 'date-desc', label: 'Сначала новые', compare: (a, b) => b.createdAt - a.createdAt },
  { id: 'date-asc', label: 'Сначала старые', compare: (a, b) => a.createdAt - b.createdAt },
  { id: 'alpha-asc', label: 'По алфавиту (А→Я)', compare: (a, b) => a.text.localeCompare(b.text, 'ru') },
  { id: 'alpha-desc', label: 'По алфавиту (Я→А)', compare: (a, b) => b.text.localeCompare(a.text, 'ru') },
];

/** Фильтр + сортировка. Сортируем КОПИЮ, исходный массив не мутируем. */
export function selectVisible(todos, filterId, sorterId) {
  const { predicate } = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const { compare } = SORTERS.find((s) => s.id === sorterId) ?? SORTERS[0];
  return [...todos.filter(predicate)].sort(compare);
}

// ---------- localStorage ----------

const STORAGE_KEY = 'todo-react:todos';

export function loadTodos() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // хранилище недоступно — игнорируем
  }
}

// ---------- jsonplaceholder (опционально) ----------

export async function fetchTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  const data = await response.json();
  const now = Date.now();
  return data.map((item, i) => createTodo(item.title, item.completed, now + i));
}
