# Todo-list на React (лаб. 8–9)

Запуск:

```bash
npm install
npm run dev
```

## Структура (MVC)

```
src/
  model.js            MODEL      — вся логика: операции над задачами, фильтры, сортировки,
                                   localStorage, fetch. Без React.
  App.jsx             CONTROLLER — состояние (useState), useEffect, useCallback, useMemo;
                                   вызывает функции модели и раздаёт данные во view через props.
  components/         VIEW       — только отрисовка, всё приходит через props
    TodoForm.jsx  Stats.jsx  Filters.jsx  SortSelect.jsx  TodoList.jsx  TodoItem.jsx
  main.jsx            точка входа
  index.css           стили
```

## Как добавить фильтр / сортировку

В `src/model.js` добавить один объект в массив `FILTERS` (`{ id, label, predicate }`)
или `SORTERS` (`{ id, label, compare }`). Остальное менять не нужно.

## Оптимизация рендеров

- все компоненты в `components/` обёрнуты в `React.memo`
- обработчики в `App` — `useCallback` + функциональный `setState`
- `visibleTodos` и `stats` — `useMemo`
- текст нового задания — локальный стейт `TodoForm`, поэтому ввод не перерисовывает список
