import { memo, useState } from 'react';

/**
 * VIEW: форма добавления задачи.
 * Текст ввода — локальное состояние формы, поэтому набор текста
 * перерисовывает только TodoForm, а не весь список.
 *
 * @param {Object} props
 * @param {(text: string, done: boolean) => void} props.onAdd
 */
function TodoForm({ onAdd }) {
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
  );
}

export default memo(TodoForm);
