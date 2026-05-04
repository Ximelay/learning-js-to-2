import { Link } from 'react-router-dom';

const ISLAND_PREVIEW = [
  { num: 1, title: 'Остров переменных', sub: 'let, const, типы данных' },
  { num: 2, title: 'Остров условий', sub: 'if/else, тернарный оператор' },
  { num: 3, title: 'Остров циклов', sub: 'for, while, итерации' },
  { num: 4, title: 'Остров функций', sub: 'параметры, return, scope' },
  { num: 5, title: 'Остров массивов', sub: 'map, filter, reduce' },
  { num: 6, title: 'Остров объектов', sub: 'свойства, методы, this' },
];

const FEATURES = [
  {
    icon: '🗺️',
    title: '9 островов',
    text: 'Каждый остров — отдельная тема JavaScript. Проходите по порядку и открывайте новые.',
  },
  {
    icon: '⚡',
    title: '45 практических задач',
    text: 'Пишете код прямо в браузере. Автоматическая проверка решений и подсказки.',
  },
  {
    icon: '🏆',
    title: 'Баллы и достижения',
    text: 'Получайте очки за решённые задачи и собирайте значки за достижения.',
  },
  {
    icon: '👑',
    title: 'Финальный босс',
    text: 'В конце пути вас ждёт сложное комплексное задание на всё, что вы изучили.',
  },
];

export default function WelcomePage() {
  return (
    <div className="welcome-wrap">
      <section className="welcome-hero">
        <div className="welcome-hero-text">
          <h1 className="welcome-title">JS-Квест: учим JavaScript как игру</h1>
          <p className="welcome-lead">
            Образовательная платформа, на которой вы шаг за шагом проходите острова с теорией и
            задачами. Пишете код в встроенном редакторе, получаете моментальную проверку и баллы
            за решения.
          </p>
          <div className="welcome-cta">
            <Link to="/login" className="btn btn-primary btn-lg">Войти и начать</Link>
            <a href="#how-it-works" className="btn btn-ghost btn-lg">Как это работает</a>
          </div>
          <p className="welcome-hint">
            Учётные записи создаёт администратор. Если у вас ещё нет логина — обратитесь к преподавателю.
          </p>
        </div>
        <div className="welcome-hero-art" aria-hidden="true">
          <div className="welcome-island-preview">
            <div className="island-num">Остров 1</div>
            <div className="island-title">Переменные</div>
            <div className="island-sub">Старт путешествия</div>
            <div className="island-progress"><div className="island-progress-fill" style={{ width: '60%' }} /></div>
            <div className="island-meta"><span>3 / 5 задач</span><span>Доступно</span></div>
          </div>
          <div className="welcome-island-preview offset">
            <div className="island-num">Остров 2</div>
            <div className="island-title">Условия</div>
            <div className="island-sub">if / else / switch</div>
            <div className="island-progress"><div className="island-progress-fill" style={{ width: '20%' }} /></div>
            <div className="island-meta"><span>1 / 5 задач</span><span>Доступно</span></div>
          </div>
        </div>
      </section>

      <section className="welcome-section" id="how-it-works">
        <h2 className="welcome-section-title">Что внутри</h2>
        <div className="welcome-features">
          {FEATURES.map(f => (
            <div className="welcome-feature" key={f.title}>
              <div className="welcome-feature-icon">{f.icon}</div>
              <div className="welcome-feature-title">{f.title}</div>
              <div className="welcome-feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome-section">
        <h2 className="welcome-section-title">Карта островов (предпросмотр)</h2>
        <p className="welcome-section-sub">
          Это пример того, как выглядит карта прохождения. После входа здесь появятся ваши уровни
          с прогрессом.
        </p>
        <div className="welcome-grid">
          {ISLAND_PREVIEW.map(i => (
            <div key={i.num} className="island welcome-preview-card">
              <div className="island-num">Остров {i.num}</div>
              <div className="island-title">{i.title}</div>
              <div className="island-sub">{i.sub}</div>
              <div className="island-progress"><div className="island-progress-fill" style={{ width: '0%' }} /></div>
              <div className="island-meta"><span>0 / 5 задач</span><span>🔒 Войдите</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome-section welcome-steps">
        <h2 className="welcome-section-title">С чего начать</h2>
        <ol className="welcome-steps-list">
          <li><strong>Получите логин</strong> у преподавателя — регистрация на платформе закрытая.</li>
          <li><strong>Войдите</strong> по выданным email и паролю на странице входа.</li>
          <li><strong>Откройте первый остров</strong> и прочитайте теорию.</li>
          <li><strong>Решайте задачи</strong> прямо в редакторе — проверка происходит автоматически.</li>
          <li><strong>Открывайте новые острова</strong>, набирайте баллы и значки.</li>
        </ol>
        <div className="welcome-cta">
          <Link to="/login" className="btn btn-primary btn-lg">Войти</Link>
        </div>
      </section>
    </div>
  );
}