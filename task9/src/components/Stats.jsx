import { memo } from 'react';

function Stats({ stats }) {
  const { total, active, done } = stats;
  return (
    <div className="stats">
      <span>Всего: {total}</span>
      <span>Осталось: {active}</span>
      <span>Выполнено: {done}</span>
    </div>
  );
}

export default memo(Stats);
