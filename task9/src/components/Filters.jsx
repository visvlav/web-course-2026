import { memo } from 'react';

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
