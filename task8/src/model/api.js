import { createTodo } from './todoModel';

/** MODEL: загрузка задач с jsonplaceholder. */
const URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

/** @returns {Promise<import('./todoModel').Todo[]>} */
export async function fetchTodosFromApi() {
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }
  const data = await response.json();
  const now = Date.now();
  // +index, чтобы у импортированных задач был различный и стабильный порядок по дате
  return data.map((item, index) => createTodo(item.title, item.completed, now + index));
}
