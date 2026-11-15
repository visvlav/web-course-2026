import { memo } from 'react';

/**
 * VIEW: счётчики.
 *
 * @param {Object} props
 * @param {{total: number, active: number, done: number}} props.stats
 */
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
