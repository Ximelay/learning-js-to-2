// Маппинг типовых JS-ошибок в русские сообщения, понятные ученику.
// Принимает объект ошибки или строку — возвращает {type, message}.

const MESSAGE_RULES = [
  { re: /is not defined$/i,              ru: (m) => `Переменная или функция не определена: ${m[0].replace(/ is not defined$/i,'').trim()}` },
  { re: /Unexpected token/i,             ru: () => 'Синтаксическая ошибка: неожиданный символ. Проверьте скобки, кавычки и знаки препинания.' },
  { re: /Unexpected identifier/i,        ru: () => 'Синтаксическая ошибка: неожиданный идентификатор. Возможно, пропущена запятая или точка с запятой.' },
  { re: /Unexpected end of input/i,      ru: () => 'Синтаксическая ошибка: неожиданное завершение кода. Возможно, не закрыта скобка или кавычка.' },
  { re: /is not a function/i,            ru: (m) => `Вы пытаетесь вызвать как функцию то, что функцией не является: ${m.input}` },
  { re: /Cannot read propert(y|ies) of undefined/i, ru: () => 'Обращение к свойству значения undefined. Проверьте, что объект или массив существует.' },
  { re: /Cannot read propert(y|ies) of null/i,      ru: () => 'Обращение к свойству значения null. Проверьте, что объект или массив существует.' },
  { re: /Cannot set propert(y|ies) of undefined/i,  ru: () => 'Присваивание свойству undefined. Проверьте, что объект создан.' },
  { re: /Assignment to constant variable/i,         ru: () => 'Нельзя переприсвоить значение константе (const). Используйте let, если значение меняется.' },
  { re: /Identifier .* has already been declared/i, ru: () => 'Переменная с таким именем уже объявлена выше.' },
  { re: /Invalid or unexpected token/i,  ru: () => 'Синтаксическая ошибка: недопустимый символ.' },
  { re: /Maximum call stack size exceeded/i,        ru: () => 'Превышена глубина рекурсии. Проверьте условие выхода из функции.' },
  { re: /Script execution timed out/i,   ru: () => 'Превышено время выполнения (2 секунды). Возможно, бесконечный цикл.' },
  { re: /out of memory/i,                ru: () => 'Превышен лимит памяти. Возможно, создан слишком большой массив или цикл.' },
];

const NAME_MAP = {
  SyntaxError: 'Синтаксическая ошибка',
  ReferenceError: 'Ошибка ссылки',
  TypeError: 'Ошибка типа',
  RangeError: 'Ошибка диапазона',
  Error: 'Ошибка',
};

export function translateError(err) {
  const raw = err?.message ?? String(err ?? '');
  const name = err?.name || 'Error';

  for (const rule of MESSAGE_RULES) {
    const m = raw.match(rule.re);
    if (m) return { type: name, message: rule.ru(m) };
  }
  return { type: name, message: `${NAME_MAP[name] || name}: ${raw}` };
}