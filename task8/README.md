# Todo React (лабораторная №8–9)

Запуск:

```bash
npm install
npm run dev
```

## Структура (MVC)

```
src/
  model/               MODEL — чистая логика, без React
    todoModel.js       создание/переключение/удаление/редактирование, счётчики
    filters.js         реестр фильтров (новый фильтр = одна строка)
    sorters.js         реестр сортировок (новая сортировка = одна строка)
    selectors.js       фильтр + сортировка без мутации ([...items].sort)
    storage.js         localStorage
    api.js             fetch с jsonplaceholder
  controller/
    useTodoController.js   CONTROLLER — состояние (useState), useEffect, useCallback, useMemo
  view/                VIEW — только отрисовка, всё приходит через props
    TodoForm.jsx  Filters.jsx  Sorting.jsx  Stats.jsx
    TodoList.jsx  TodoItem.jsx  ImportButton.jsx
  App.jsx              композиция: вызывает контроллер и раздаёт данные во view
```

Поток данных: View → вызывает `onToggle/onDelete/...` → Controller обновляет состояние
через функции Model → App перерисовывает View новыми props.

## Оптимизация рендеров

- все view-компоненты обёрнуты в `React.memo`
- обработчики в контроллере — `useCallback` + функциональный `setState` (ссылки стабильны)
- `visibleTodos` и `stats` — `useMemo`
- текст нового задания — локальный стейт `TodoForm`: ввод не перерисовывает список
- при изменении одной задачи перерисовывается только её `TodoItem` (остальные объекты не менялись)

## Как добавить фильтр / сортировку

`src/model/filters.js` — добавить объект `{ id, label, predicate }`.
`src/model/sorters.js` — добавить объект `{ id, label, compare }`.
Больше ничего менять не нужно.
