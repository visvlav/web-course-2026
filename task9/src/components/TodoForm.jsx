import { memo, useState } from 'react';

function TodoForm({ onAdd, onImport, importState }) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, done);
    setText('');
    setDone(false);
  };

  return (
    <>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          placeholder="Новая задача..."
          onChange={(e) => setText(e.target.value)}
        />
        <select value={done ? 'done' : 'active'} onChange={(e) => setDone(e.target.value === 'done')}>
          <option value="active">Невыполненная</option>
          <option value="done">Выполненная</option>
        </select>
        <button type="submit">Добавить</button>
      </form>

      <div className="import">
        <button type="button" onClick={onImport} disabled={importState.loading}>
          {importState.loading ? 'Загрузка...' : 'Загрузить с jsonplaceholder'}
        </button>
        {importState.error && <span className="error"> {importState.error}</span>}
      </div>
    </>
  );
}

export default memo(TodoForm);
