/**
 * MODEL: чистые функции над данными. Никакого React, никакого DOM.
 * Все функции НЕ мутируют входные данные, а возвращают новые.
 */

/**
 * @typedef {Object} Todo
 * @property {string} id          уникальный идентификатор (используется как key)
 * @property {string} text        текст задачи
 * @property {boolean} done       выполнена ли задача
 * @property {number} createdAt   время добавления (ms)
 */

/** Создать новую задачу. @returns {Todo} */
export function createTodo(text, done = false, createdAt = Date.now()) {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    done,
    createdAt,
  };
}

/** @param {Todo[]} todos @param {Todo} todo */
export const addTodo = (todos, todo) => [...todos, todo];

/** @param {Todo[]} todos @param {string} id */
export const toggleTodo = (todos, id) =>
  todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));

/** @param {Todo[]} todos @param {string} id */
export const removeTodo = (todos, id) => todos.filter((t) => t.id !== id);

/** @param {Todo[]} todos @param {string} id @param {string} text */
export const editTodo = (todos, id, text) =>
  todos.map((t) => (t.id === id ? { ...t, text: text.trim() } : t));

/** Счётчики для компонента Stats. @param {Todo[]} todos */
export function getStats(todos) {
  const done = todos.filter((t) => t.done).length;
  return { total: todos.length, done, active: todos.length - done };
}
