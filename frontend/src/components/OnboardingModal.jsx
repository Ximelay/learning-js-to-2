export default function OnboardingModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" onClick={onClose}>
      <div className="modal onboarding-modal" onClick={e => e.stopPropagation()}>
        <h2 id="onboarding-title" className="panel-title">👋 Добро пожаловать в JS-Квест!</h2>
        <p className="onboarding-lead">
          Короткая инструкция, чтобы вы быстро разобрались, что нужно делать.
        </p>

        <ol className="onboarding-list">
          <li>
            <strong>Карта островов.</strong> На главной — список из 9 островов. Каждый остров —
            это тема JavaScript.
          </li>
          <li>
            <strong>Открытие по порядку.</strong> Сначала доступен только первый остров. Чтобы
            открыть следующий, пройдите все задачи текущего.
          </li>
          <li>
            <strong>Внутри острова — теория и задачи.</strong> Прочитайте теорию и переходите к
            практике. Задачи тоже открываются последовательно.
          </li>
          <li>
            <strong>Редактор кода.</strong> Решение пишете прямо в браузере. Кнопка{' '}
            <em>«Запустить тесты»</em> проверит ваш код и покажет результат.
          </li>
          <li>
            <strong>Баллы и значки.</strong> За каждую решённую задачу — баллы. За достижения —
            значки в личном кабинете.
          </li>
          <li>
            <strong>Финальный босс.</strong> Последний остров — большое комплексное задание на
            всё, что вы изучили.
          </li>
        </ol>

        <div className="onboarding-tip">
          💡 Эту подсказку можно открыть снова в любой момент — кнопка{' '}
          <strong>«Как играть?»</strong> в верхнем меню.
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Понятно, поехали!
          </button>
        </div>
      </div>
    </div>
  );
}