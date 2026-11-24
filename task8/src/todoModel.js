export function createTodo(text, completed = false) {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed,
    createdAt: Date.now(),
  };
}

export const FILTERS = {
  all: { label: 'Все', predicate: () => true },
  active: { label: 'Невыполненные', predicate: (t) => !t.completed },
  done: { label: 'Выполненные', predicate: (t) => t.completed },
};

export function filterTodos(todos, filterKey) {
  return todos.filter(FILTERS[filterKey].predicate);
}

export function getStats(todos) {
  const done = todos.filter((t) => t.completed).length;
  return { total: todos.length, done, active: todos.length - done };
}
export const SORTS = {
  newest: { label: 'Сначала новые', compare: (a, b) => b.createdAt - a.createdAt },
  oldest: { label: 'Сначала старые', compare: (a, b) => a.createdAt - b.createdAt },
  az: { label: 'По алфавиту (А→Я)', compare: (a, b) => a.text.localeCompare(b.text, 'ru') },
  za: { label: 'По алфавиту (Я→А)', compare: (a, b) => b.text.localeCompare(a.text, 'ru') },
};
export function sortTodos(todos, sortKey) {
  return [...todos].sort(SORTS[sortKey].compare);
}