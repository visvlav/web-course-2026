import { memo } from 'react';

/**
 * @param {()=>void} 
 * @param {boolean} 
 * @param {string|null}
 */
function ImportButton({ onImport, loading, error }) {
  return (
    <div>
      <button onClick={onImport} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить задачи с сервера'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  );
}

export default memo(ImportButton);