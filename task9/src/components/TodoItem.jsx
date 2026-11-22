import { memo, useState } from 'react';

/**
 * VIEW: одна задача.
 * Локально хранит только режим редактирования и черновик текста,
 * всё остальное приходит через props.
 *
 * @param {Object} props
 * @param {import('../model').Todo} props.todo
 * @param {(id: string) => void} props.onToggle
 * @param {(id: string) => void} props.onDelete
 * @param {(id: string, text: string) => void} props.onEdit
 */
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const { id, text, done } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const startEdit = () => {
    setDraft(text);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (draft.trim()) onEdit(id, draft);
    setIsEditing(false);
  };

  return (
    <li className={done ? 'todo done' : 'todo'}>
      <input type="checkbox" checked={done} onChange={() => onToggle(id)} />

      {isEditing ? (
        <>
          <input
            className="edit-input"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <button onClick={saveEdit}>Сохранить</button>
        </>
      ) : (
        <>
          <span className="text" onDoubleClick={startEdit}>{text}</span>
          <button onClick={startEdit}>Изменить</button>
        </>
      )}

      <button className="danger" onClick={() => onDelete(id)}>Удалить</button>
    </li>
  );
}

export default memo(TodoItem);
