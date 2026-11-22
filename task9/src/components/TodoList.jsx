import { memo } from 'react';
import TodoItem from './TodoItem';

/**
 * VIEW: список задач.
 *
 * @param {Object} props
 * @param {import('../model').Todo[]} props.todos
 * @param {(id: string) => void} props.onToggle
 * @param {(id: string) => void} props.onDelete
 * @param {(id: string, text: string) => void} props.onEdit
 */
function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return <p className="empty">Задач нет</p>;
  }
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default memo(TodoList);
