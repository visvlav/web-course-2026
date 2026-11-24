import { SORTS } from '../todoModel';

/**
 * @param {string} current 
 * @param {(key:string)=>void} onChange 
 */
export default function SortSelect({ current, onChange }) {
  return (
    <label>
      Сортировка:{' '}
      <select value={current} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(SORTS).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}