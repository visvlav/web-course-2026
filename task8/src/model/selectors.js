import { getFilter } from './filters';
import { getSorter } from './sorters';

/**
 * MODEL: из полного списка получить то, что нужно показать.
 * Исходный массив НЕ мутируется: filter создаёт новый массив,
 * а sort вызывается на копии — [...items].sort(...).
 *
 * @param {import('./todoModel').Todo[]} todos
 * @param {string} filterId
 * @param {string} sorterId
 */
export function selectVisibleTodos(todos, filterId, sorterId) {
  const { predicate } = getFilter(filterId);
  const { compare } = getSorter(sorterId);
  return [...todos.filter(predicate)].sort(compare);
}
