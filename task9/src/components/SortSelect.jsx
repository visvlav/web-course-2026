import { memo } from 'react';

/**
 * VIEW: выпадающий список сортировок.
 *
 * @param {Object} props
 * @param {{id: string, label: string}[]} props.options
 * @param {string} props.value
 * @param {(id: string) => void} props.onChange
 */
function SortSelect({ options, value, onChange }) {
  return (
    <label>
      Сортировка:{' '}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default memo(SortSelect);
