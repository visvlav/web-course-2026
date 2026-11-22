import { memo } from 'react';

/**
 * VIEW: кнопки фильтров. Строятся из options — при новом фильтре код менять не нужно.
 *
 * @param {Object} props
 * @param {{id: string, label: string}[]} props.options
 * @param {string} props.value            id активного фильтра
 * @param {(id: string) => void} props.onChange
 */
function Filters({ options, value, onChange }) {
  return (
    <div className="filters">
      {options.map(({ id, label }) => (
        <button
          key={id}
          className={id === value ? 'active' : ''}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default memo(Filters);
