import { useTodoController } from './controller/useTodoController';
import TodoForm from './view/TodoForm';
import Filters from './view/Filters';
import Sorting from './view/Sorting';
import Stats from './view/Stats';
import TodoList from './view/TodoList';
import ImportButton from './view/ImportButton';

/**
 * App — корень приложения: подключает Controller и раздаёт данные во View через props.
 * Бизнес-логики здесь нет.
 */
export default function App() {
  const c = useTodoController();

  return (
    <div className="app">
      <h1>Todo List</h1>

      <TodoForm onAdd={c.onAdd} />
      <Stats stats={c.stats} />

      <div className="toolbar">
        <Filters options={c.filterOptions} value={c.filterId} onChange={c.onFilterChange} />
        <Sorting options={c.sorterOptions} value={c.sorterId} onChange={c.onSorterChange} />
      </div>

      <TodoList
        todos={c.visibleTodos}
        onToggle={c.onToggle}
        onDelete={c.onDelete}
        onEdit={c.onEdit}
      />

      <ImportButton onImport={c.onImport} state={c.importState} />
    </div>
  );
}
