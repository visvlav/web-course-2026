/**
 * MODEL: реестр сортировок.
 * Новая сортировка = один объект в массиве (select в UI строится автоматически).
 *
 * @typedef {Object} SorterDef
 * @property {string} id
 * @property {string} label
 * @property {(a: import('./todoModel').Todo, b: import('./todoModel').Todo) => number} compare
 */

/** @type {SorterDef[]} */
export const SORTERS = [
  { id: 'date-desc', label: 'Сначала новые', compare: (a, b) => b.createdAt - a.createdAt },
  { id: 'date-asc', label: 'Сначала старые', compare: (a, b) => a.createdAt - b.createdAt },
  { id: 'alpha-asc', label: 'По алфавиту (А→Я)', compare: (a, b) => a.text.localeCompare(b.text, 'ru') },
  { id: 'alpha-desc', label: 'По алфавиту (Я→А)', compare: (a, b) => b.text.localeCompare(a.text, 'ru') },
];

export const DEFAULT_SORTER_ID = 'date-desc';

export const getSorter = (id) =>
  SORTERS.find((s) => s.id === id) ?? SORTERS[0];
