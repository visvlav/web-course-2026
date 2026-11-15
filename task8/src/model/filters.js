/**
 * MODEL: реестр фильтров.
 * Чтобы добавить новый фильтр — достаточно добавить ОДИН объект в массив.
 * Ни контроллер, ни компоненты менять не нужно: кнопки строятся из этого списка.
 *
 * @typedef {Object} FilterDef
 * @property {string} id
 * @property {string} label
 * @property {(todo: import('./todoModel').Todo) => boolean} predicate
 */

/** @type {FilterDef[]} */
export const FILTERS = [
  { id: 'all', label: 'Все', predicate: () => true },
  { id: 'active', label: 'Невыполненные', predicate: (t) => !t.done },
  { id: 'done', label: 'Выполненные', predicate: (t) => t.done },
  // Пример нового фильтра "по просьбе заказчика":
  // { id: 'long', label: 'Длинные (>20 символов)', predicate: (t) => t.text.length > 20 },
];

export const DEFAULT_FILTER_ID = 'all';

export const getFilter = (id) =>
  FILTERS.find((f) => f.id === id) ?? FILTERS[0];
