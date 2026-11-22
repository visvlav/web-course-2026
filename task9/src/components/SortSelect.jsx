import { memo } from 'react';

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
