/** MODEL: сохранение/загрузка задач в localStorage. */

const STORAGE_KEY = 'todo-react:todos';

/** @returns {import('./todoModel').Todo[]} */
export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** @param {import('./todoModel').Todo[]} todos */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // переполнено хранилище / приватный режим — молча игнорируем
  }
}
