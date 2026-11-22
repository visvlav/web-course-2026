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

export const FILTERS = [
  { id: 'all', label: 'Все', predicate: () => true },
  { id: 'active', label: 'Невыполненные', predicate: (t) => !t.done },
  { id: 'done', label: 'Выполненные', predicate: (t) => t.done },
];

export const SORTERS = [
  { id: 'date-desc', label: 'Сначала новые', compare: (a, b) => b.createdAt - a.createdAt },
  { id: 'date-asc', label: 'Сначала старые', compare: (a, b) => a.createdAt - b.createdAt },
  { id: 'alpha-asc', label: 'По алфавиту (А→Я)', compare: (a, b) => a.text.localeCompare(b.text, 'ru') },
  { id: 'alpha-desc', label: 'По алфавиту (Я→А)', compare: (a, b) => b.text.localeCompare(a.text, 'ru') },
];

export function selectVisible(todos, filterId, sorterId) {
  const { predicate } = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const { compare } = SORTERS.find((s) => s.id === sorterId) ?? SORTERS[0];
  return [...todos.filter(predicate)].sort(compare);
}

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
  } catch {}
}

export async function fetchTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  const data = await response.json();
  const now = Date.now();
  return data.map((item, i) => createTodo(item.title, item.completed, now + i));
}
