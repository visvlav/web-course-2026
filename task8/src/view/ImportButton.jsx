import { memo } from 'react';

/**
 * VIEW: кнопка загрузки задач с jsonplaceholder.
 *
 * @param {Object} props
 * @param {() => void} props.onImport
 * @param {{loading: boolean, error: string|null}} props.state
 */
function ImportButton({ onImport, state }) {
  return (
    <div className="import">
      <button onClick={onImport} disabled={state.loading}>
        {state.loading ? 'Загрузка...' : 'Загрузить с jsonplaceholder'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </div>
  );
}

export default memo(ImportButton);
