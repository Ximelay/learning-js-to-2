// Контент курса: теория + 45 задач + тест-кейсы.
// Формат expected_output: строка, к которой приводится результат через __stringify.
// Для примитивов это строковое представление, для объектов/массивов — JSON.stringify.

export const LEVELS = [
  // ========================================================================
  // Остров 1 — Переменные и типы данных
  // ========================================================================
  {
    position: 1, is_boss: false,
    title: 'Переменные и типы данных',
    subtitle: 'Остров первых шагов',
    description: 'Знакомство с переменными, примитивными типами и основами работы с данными в JavaScript.',
    theory_md: `
# Переменные и типы данных

**Переменная** — именованный ящик для хранения значения. В JavaScript три ключевых слова:

- \`let\` — объявляет изменяемую переменную
- \`const\` — объявляет константу (нельзя переприсвоить)
- \`var\` — устаревший способ, используйте только в исключительных случаях

\`\`\`js
let age = 25;           // число
const name = 'Аня';     // строка (константа)
let isAdmin = false;    // булево значение
\`\`\`

## Основные типы

| Тип       | Пример              |
|-----------|---------------------|
| number    | \`42\`, \`3.14\`, \`-1\`  |
| string    | \`'привет'\`, \`"hi"\` |
| boolean   | \`true\`, \`false\`     |
| undefined | \`undefined\`         |
| null      | \`null\`              |

## Оператор \`typeof\`

Возвращает строку с названием типа:
\`\`\`js
typeof 42;        // 'number'
typeof 'привет';  // 'string'
typeof true;      // 'boolean'
\`\`\`

## Шаблонные литералы
Внутри \`backtick\`-строк можно подставлять значения через \`\${}\`:
\`\`\`js
const name = 'Мир';
const greet = \`Привет, \${name}!\`;  // 'Привет, Мир!'
\`\`\`
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Первая переменная',
        description_md: 'Напишите функцию `greet()`, которая возвращает строку `"Привет, мир!"`.',
        starter_code: 'function greet() {\n  // ваш код\n}',
        solution_code: 'function greet() { return "Привет, мир!"; }',
        test_cases: [
          { call_code: 'greet()', expected_output: 'Привет, мир!', description: 'Возвращает приветствие' },
          { call_code: 'typeof greet()', expected_output: 'string', description: 'Тип возвращаемого значения — строка', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Сумма двух чисел',
        description_md: 'Напишите функцию `sum(a, b)`, возвращающую сумму двух чисел.',
        starter_code: 'function sum(a, b) {\n  // ваш код\n}',
        solution_code: 'function sum(a, b) { return a + b; }',
        test_cases: [
          { call_code: 'sum(2, 3)', expected_output: '5', description: 'Малые числа' },
          { call_code: 'sum(-5, 10)', expected_output: '5', description: 'С отрицательным числом' },
          { call_code: 'sum(0, 0)', expected_output: '0', description: 'Нули', is_hidden: true },
          { call_code: 'sum(100, 250)', expected_output: '350', description: 'Большие числа', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Определи тип',
        description_md: 'Напишите функцию `typeName(value)`, возвращающую строку — название типа значения (используйте `typeof`).',
        starter_code: 'function typeName(value) {\n  // ваш код\n}',
        solution_code: 'function typeName(value) { return typeof value; }',
        test_cases: [
          { call_code: 'typeName(42)', expected_output: 'number', description: 'Число' },
          { call_code: 'typeName("привет")', expected_output: 'string', description: 'Строка' },
          { call_code: 'typeName(true)', expected_output: 'boolean', description: 'Булево' },
          { call_code: 'typeName(undefined)', expected_output: 'undefined', description: 'undefined', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Приветствие по имени',
        description_md: 'Напишите функцию `makeGreeting(name)`, возвращающую строку вида `"Привет, <name>!"`. Используйте шаблонные литералы.',
        starter_code: 'function makeGreeting(name) {\n  // ваш код\n}',
        solution_code: 'function makeGreeting(name) { return `Привет, ${name}!`; }',
        test_cases: [
          { call_code: 'makeGreeting("Аня")', expected_output: 'Привет, Аня!', description: 'Имя Аня' },
          { call_code: 'makeGreeting("Олег")', expected_output: 'Привет, Олег!', description: 'Имя Олег' },
          { call_code: 'makeGreeting("")', expected_output: 'Привет, !', description: 'Пустое имя', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Площадь прямоугольника',
        description_md: 'Напишите функцию `area(width, height)`, возвращающую площадь прямоугольника. Объявите промежуточную переменную через `const`.',
        starter_code: 'function area(width, height) {\n  // ваш код\n}',
        solution_code: 'function area(w,h) { const s = w*h; return s; }',
        test_cases: [
          { call_code: 'area(4, 5)', expected_output: '20', description: 'Обычный случай' },
          { call_code: 'area(1, 1)', expected_output: '1', description: 'Единичный' },
          { call_code: 'area(0, 10)', expected_output: '0', description: 'Одна сторона = 0', is_hidden: true },
          { call_code: 'area(7, 3)', expected_output: '21', description: 'Произвольный', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 2 — Условные конструкции
  // ========================================================================
  {
    position: 2, is_boss: false,
    title: 'Условные конструкции',
    subtitle: 'Остров выбора пути',
    description: 'Программа учится принимать решения: if/else, тернарный оператор, switch.',
    theory_md: `
# Условные конструкции

## if / else
\`\`\`js
if (age >= 18) {
  console.log('Взрослый');
} else {
  console.log('Ребёнок');
}
\`\`\`

## Сравнения
- \`===\` строго равно (рекомендуется)
- \`!==\` строго не равно
- \`<\`, \`>\`, \`<=\`, \`>=\`

## Логические операторы
- \`&&\` И (оба условия)
- \`||\` ИЛИ (хотя бы одно)
- \`!\` НЕ (отрицание)

## Тернарный оператор
Сокращённая форма if/else — возвращает значение:
\`\`\`js
const type = age >= 18 ? 'взрослый' : 'ребёнок';
\`\`\`

## switch
Для множественного выбора по одному значению:
\`\`\`js
switch (day) {
  case 1: result = 'Пн'; break;
  case 2: result = 'Вт'; break;
  default: result = '?';
}
\`\`\`
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Чётное или нечётное',
        description_md: 'Напишите функцию `parity(n)`: вернуть `"чётное"` если число делится на 2, иначе `"нечётное"`.',
        starter_code: 'function parity(n) {\n  // ваш код\n}',
        solution_code: 'function parity(n){ return n%2===0?"чётное":"нечётное"; }',
        test_cases: [
          { call_code: 'parity(4)', expected_output: 'чётное', description: '4 — чётное' },
          { call_code: 'parity(7)', expected_output: 'нечётное', description: '7 — нечётное' },
          { call_code: 'parity(0)', expected_output: 'чётное', description: 'Ноль — чётный', is_hidden: true },
          { call_code: 'parity(-3)', expected_output: 'нечётное', description: 'Отрицательное', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Максимум из двух',
        description_md: 'Напишите функцию `max2(a, b)`, возвращающую большее из двух чисел.',
        starter_code: 'function max2(a, b) {\n  // ваш код\n}',
        solution_code: 'function max2(a,b){ return a>b?a:b; }',
        test_cases: [
          { call_code: 'max2(3, 7)', expected_output: '7', description: 'b больше' },
          { call_code: 'max2(10, 2)', expected_output: '10', description: 'a больше' },
          { call_code: 'max2(5, 5)', expected_output: '5', description: 'Равны', is_hidden: true },
          { call_code: 'max2(-1, -5)', expected_output: '-1', description: 'Оба отрицательные', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Доступ по возрасту',
        description_md: 'Напишите `canVote(age)`: `true` если `age >= 18`, иначе `false`. Используйте тернарный оператор или прямое сравнение.',
        starter_code: 'function canVote(age) {\n  // ваш код\n}',
        solution_code: 'function canVote(age){ return age>=18; }',
        test_cases: [
          { call_code: 'canVote(17)', expected_output: 'false', description: 'Ребёнок' },
          { call_code: 'canVote(18)', expected_output: 'true', description: 'Ровно 18' },
          { call_code: 'canVote(25)', expected_output: 'true', description: 'Взрослый', is_hidden: true },
          { call_code: 'canVote(0)', expected_output: 'false', description: 'Ноль', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'День недели',
        description_md: 'Напишите `dayName(n)`: вернуть `"Пн"`, `"Вт"`, `"Ср"`, `"Чт"`, `"Пт"`, `"Сб"`, `"Вс"` для чисел 1..7. Для остальных — `"?"`. Используйте `switch`.',
        starter_code: 'function dayName(n) {\n  // ваш код\n}',
        solution_code: 'function dayName(n){ switch(n){case 1:return"Пн";case 2:return"Вт";case 3:return"Ср";case 4:return"Чт";case 5:return"Пт";case 6:return"Сб";case 7:return"Вс";default:return"?";} }',
        test_cases: [
          { call_code: 'dayName(1)', expected_output: 'Пн', description: 'Понедельник' },
          { call_code: 'dayName(5)', expected_output: 'Пт', description: 'Пятница' },
          { call_code: 'dayName(7)', expected_output: 'Вс', description: 'Воскресенье', is_hidden: true },
          { call_code: 'dayName(0)', expected_output: '?', description: 'Неверный', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'В рабочем диапазоне',
        description_md: 'Напишите `inRange(value, min, max)`: `true` если `value` в диапазоне `[min, max]` включительно, иначе `false`. Используйте `&&`.',
        starter_code: 'function inRange(value, min, max) {\n  // ваш код\n}',
        solution_code: 'function inRange(v,a,b){ return v>=a && v<=b; }',
        test_cases: [
          { call_code: 'inRange(5, 1, 10)', expected_output: 'true', description: 'В середине' },
          { call_code: 'inRange(1, 1, 10)', expected_output: 'true', description: 'Левая граница' },
          { call_code: 'inRange(10, 1, 10)', expected_output: 'true', description: 'Правая граница', is_hidden: true },
          { call_code: 'inRange(0, 1, 10)', expected_output: 'false', description: 'Ниже', is_hidden: true },
          { call_code: 'inRange(11, 1, 10)', expected_output: 'false', description: 'Выше', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 3 — Циклы
  // ========================================================================
  {
    position: 3, is_boss: false,
    title: 'Циклы',
    subtitle: 'Остров повторения',
    description: 'for, while, do..while, for..of. Итерация — основа алгоритмов.',
    theory_md: `
# Циклы

## for
\`\`\`js
for (let i = 0; i < 5; i++) {
  console.log(i); // 0,1,2,3,4
}
\`\`\`

## while
Пока условие истинно — повторять:
\`\`\`js
let n = 10;
while (n > 0) { n--; }
\`\`\`

## for..of
Итерация по элементам массива/строки:
\`\`\`js
for (const x of [1, 2, 3]) {
  console.log(x);
}
\`\`\`

## break и continue
- \`break\` — прервать цикл
- \`continue\` — перейти к следующей итерации
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Сумма от 1 до N',
        description_md: 'Напишите `sumTo(n)`: сумма `1 + 2 + ... + n`. Если `n <= 0` — вернуть `0`.',
        starter_code: 'function sumTo(n) {\n  // ваш код\n}',
        solution_code: 'function sumTo(n){ let s=0; for(let i=1;i<=n;i++) s+=i; return s; }',
        test_cases: [
          { call_code: 'sumTo(5)', expected_output: '15', description: '1+2+3+4+5' },
          { call_code: 'sumTo(10)', expected_output: '55', description: 'До десяти' },
          { call_code: 'sumTo(1)', expected_output: '1', description: 'Один', is_hidden: true },
          { call_code: 'sumTo(0)', expected_output: '0', description: 'Ноль', is_hidden: true },
          { call_code: 'sumTo(100)', expected_output: '5050', description: 'Большое', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Обратный отсчёт',
        description_md: 'Напишите `countdown(n)`: вернуть массив `[n, n-1, ..., 1]`. Для `n <= 0` — пустой массив.',
        starter_code: 'function countdown(n) {\n  // ваш код\n}',
        solution_code: 'function countdown(n){ const a=[]; let i=n; while(i>=1){a.push(i); i--;} return a; }',
        test_cases: [
          { call_code: 'JSON.stringify(countdown(3))', expected_output: '[3,2,1]', description: 'От 3' },
          { call_code: 'JSON.stringify(countdown(1))', expected_output: '[1]', description: 'От 1' },
          { call_code: 'JSON.stringify(countdown(0))', expected_output: '[]', description: 'Пустой', is_hidden: true },
          { call_code: 'JSON.stringify(countdown(5))', expected_output: '[5,4,3,2,1]', description: 'От 5', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Сумма элементов массива',
        description_md: 'Напишите `sumArray(arr)`: сумма чисел в массиве. Используйте `for..of`.',
        starter_code: 'function sumArray(arr) {\n  // ваш код\n}',
        solution_code: 'function sumArray(a){ let s=0; for(const x of a) s+=x; return s; }',
        test_cases: [
          { call_code: 'sumArray([1,2,3,4])', expected_output: '10', description: 'Четыре числа' },
          { call_code: 'sumArray([])', expected_output: '0', description: 'Пустой' },
          { call_code: 'sumArray([-1,-2,5])', expected_output: '2', description: 'Смесь', is_hidden: true },
          { call_code: 'sumArray([100])', expected_output: '100', description: 'Одно число', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Посчитать гласные',
        description_md: 'Напишите `countVowels(str)`: количество русских гласных в строке (`а е ё и о у ы э ю я`, в любом регистре).',
        starter_code: 'function countVowels(str) {\n  // ваш код\n}',
        solution_code: 'function countVowels(s){ const v="аеёиоуыэюя"; let c=0; for(const ch of s.toLowerCase()) if(v.includes(ch)) c++; return c; }',
        test_cases: [
          { call_code: 'countVowels("Привет")', expected_output: '2', description: 'Два гласных' },
          { call_code: 'countVowels("ПРО")', expected_output: '1', description: 'Верхний регистр' },
          { call_code: 'countVowels("")', expected_output: '0', description: 'Пустая', is_hidden: true },
          { call_code: 'countVowels("бркк")', expected_output: '0', description: 'Нет гласных', is_hidden: true },
          { call_code: 'countVowels("яёю")', expected_output: '3', description: 'Только гласные', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Первое кратное',
        description_md: 'Напишите `firstMultipleOf(arr, k)`: вернуть первый элемент массива, кратный `k`. Если нет — вернуть `-1`. Используйте `break`.',
        starter_code: 'function firstMultipleOf(arr, k) {\n  // ваш код\n}',
        solution_code: 'function firstMultipleOf(a,k){ for(const x of a){ if(x%k===0) return x; } return -1; }',
        test_cases: [
          { call_code: 'firstMultipleOf([1,3,5,6,9], 3)', expected_output: '3', description: 'Кратно 3' },
          { call_code: 'firstMultipleOf([2,4,8], 5)', expected_output: '-1', description: 'Нет кратных' },
          { call_code: 'firstMultipleOf([10,20,30], 10)', expected_output: '10', description: 'Первое подходит', is_hidden: true },
          { call_code: 'firstMultipleOf([], 2)', expected_output: '-1', description: 'Пустой', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 4 — Функции
  // ========================================================================
  {
    position: 4, is_boss: false,
    title: 'Функции',
    subtitle: 'Остров магических заклинаний',
    description: 'Объявления, стрелочные функции, параметры по умолчанию, замыкания.',
    theory_md: `
# Функции

## Объявление функции (Function Declaration)
\`\`\`js
function add(a, b) { return a + b; }
\`\`\`

## Функциональное выражение
\`\`\`js
const add = function(a, b) { return a + b; };
\`\`\`

## Стрелочная функция
\`\`\`js
const add = (a, b) => a + b;
const square = x => x * x;
\`\`\`

## Параметры по умолчанию
\`\`\`js
function greet(name = 'друг') { return \`Привет, \${name}\`; }
\`\`\`

## Rest-параметры
Собрать оставшиеся аргументы в массив:
\`\`\`js
function sum(...nums) { return nums.reduce((a,b)=>a+b, 0); }
\`\`\`

## Замыкания
Функция «запоминает» переменные из области, где она была создана:
\`\`\`js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
\`\`\`
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Стрелочная функция',
        description_md: 'Определите `const double = ...` — стрелочную функцию, удваивающую число.',
        starter_code: '// Определите const double\n',
        solution_code: 'const double = x => x * 2;',
        test_cases: [
          { call_code: 'double(3)', expected_output: '6', description: 'Удвоить 3' },
          { call_code: 'double(0)', expected_output: '0', description: 'Ноль' },
          { call_code: 'double(-5)', expected_output: '-10', description: 'Отрицательное', is_hidden: true },
          { call_code: 'typeof double', expected_output: 'function', description: 'Это функция', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Приветствие по умолчанию',
        description_md: 'Напишите `greet(name)` с параметром по умолчанию `"гость"`: возвращает `"Здравствуйте, <name>!"`.',
        starter_code: 'function greet(name) {\n  // ваш код\n}',
        solution_code: 'function greet(name = "гость"){ return `Здравствуйте, ${name}!`; }',
        test_cases: [
          { call_code: 'greet("Аня")', expected_output: 'Здравствуйте, Аня!', description: 'Имя указано' },
          { call_code: 'greet()', expected_output: 'Здравствуйте, гость!', description: 'Без имени' },
          { call_code: 'greet(undefined)', expected_output: 'Здравствуйте, гость!', description: 'undefined срабатывает как по умолчанию', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Среднее арифметическое',
        description_md: 'Напишите `average(...nums)` — принимает любое количество чисел и возвращает их среднее. Для пустого вызова — `0`.',
        starter_code: 'function average(...nums) {\n  // ваш код\n}',
        solution_code: 'function average(...n){ if(!n.length) return 0; let s=0; for(const x of n) s+=x; return s/n.length; }',
        test_cases: [
          { call_code: 'average(2, 4, 6)', expected_output: '4', description: 'Три числа' },
          { call_code: 'average(10)', expected_output: '10', description: 'Одно число' },
          { call_code: 'average()', expected_output: '0', description: 'Пусто', is_hidden: true },
          { call_code: 'average(1, 2, 3, 4)', expected_output: '2.5', description: 'Дробный результат', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Счётчик (замыкание)',
        description_md: 'Напишите `makeCounter()`: возвращает функцию, которая при каждом вызове возвращает следующее число, начиная с 1.',
        starter_code: 'function makeCounter() {\n  // ваш код\n}',
        solution_code: 'function makeCounter(){ let c=0; return () => ++c; }',
        test_cases: [
          { call_code: '(function(){const c=makeCounter(); return c();})()', expected_output: '1', description: 'Первый вызов = 1' },
          { call_code: '(function(){const c=makeCounter(); c(); c(); return c();})()', expected_output: '3', description: 'Третий вызов = 3' },
          { call_code: '(function(){const a=makeCounter(); const b=makeCounter(); a(); a(); return b();})()', expected_output: '1', description: 'Счётчики независимы', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Композиция функций',
        description_md: 'Напишите `compose(f, g)`, возвращающую функцию, которая применяет сначала `g`, потом `f`: `compose(f, g)(x) === f(g(x))`.',
        starter_code: 'function compose(f, g) {\n  // ваш код\n}',
        solution_code: 'function compose(f,g){ return x => f(g(x)); }',
        test_cases: [
          { call_code: 'compose(x => x + 1, x => x * 2)(3)', expected_output: '7', description: '3*2+1 = 7' },
          { call_code: 'compose(x => x.toUpperCase(), x => x.trim())("  hi  ")', expected_output: 'HI', description: 'Строки' },
          { call_code: 'compose(x => x * x, x => x + 1)(4)', expected_output: '25', description: '(4+1)² = 25', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 5 — Массивы
  // ========================================================================
  {
    position: 5, is_boss: false,
    title: 'Массивы',
    subtitle: 'Остров коллекций',
    description: 'Индексирование, методы массивов: map, filter, reduce, find, includes.',
    theory_md: `
# Массивы

## Создание и индексация
\`\`\`js
const arr = [10, 20, 30];
arr[0];       // 10
arr.length;   // 3
\`\`\`

## Добавление/удаление
- \`push(x)\` — в конец
- \`pop()\` — с конца
- \`unshift(x)\` — в начало
- \`shift()\` — с начала

## Методы высшего порядка
\`\`\`js
[1,2,3].map(x => x * 2);       // [2,4,6]
[1,2,3].filter(x => x > 1);    // [2,3]
[1,2,3].reduce((s,x) => s+x, 0); // 6
[1,2,3].find(x => x > 1);      // 2
[1,2,3].includes(2);           // true
\`\`\`
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Длина массива',
        description_md: 'Напишите `size(arr)`: вернуть количество элементов.',
        starter_code: 'function size(arr) {\n  // ваш код\n}',
        solution_code: 'function size(a){ return a.length; }',
        test_cases: [
          { call_code: 'size([1,2,3])', expected_output: '3', description: 'Три элемента' },
          { call_code: 'size([])', expected_output: '0', description: 'Пустой' },
          { call_code: 'size(["a"])', expected_output: '1', description: 'Один', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Удвоить все (map)',
        description_md: 'Напишите `doubleAll(arr)`: массив, где каждое число удвоено. Используйте `map`.',
        starter_code: 'function doubleAll(arr) {\n  // ваш код\n}',
        solution_code: 'function doubleAll(a){ return a.map(x => x*2); }',
        test_cases: [
          { call_code: 'JSON.stringify(doubleAll([1,2,3]))', expected_output: '[2,4,6]', description: 'Три числа' },
          { call_code: 'JSON.stringify(doubleAll([]))', expected_output: '[]', description: 'Пустой' },
          { call_code: 'JSON.stringify(doubleAll([-1,0,5]))', expected_output: '[-2,0,10]', description: 'Разные знаки', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Только чётные (filter)',
        description_md: 'Напишите `onlyEven(arr)`: только чётные числа из массива.',
        starter_code: 'function onlyEven(arr) {\n  // ваш код\n}',
        solution_code: 'function onlyEven(a){ return a.filter(x => x%2===0); }',
        test_cases: [
          { call_code: 'JSON.stringify(onlyEven([1,2,3,4,5,6]))', expected_output: '[2,4,6]', description: 'Смешанный' },
          { call_code: 'JSON.stringify(onlyEven([1,3,5]))', expected_output: '[]', description: 'Все нечётные' },
          { call_code: 'JSON.stringify(onlyEven([0,2,4]))', expected_output: '[0,2,4]', description: 'Все чётные', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Максимум в массиве (reduce)',
        description_md: 'Напишите `maxOf(arr)`: максимальный элемент. Для пустого массива — `null`. Используйте `reduce` (или `Math.max`).',
        starter_code: 'function maxOf(arr) {\n  // ваш код\n}',
        solution_code: 'function maxOf(a){ if(!a.length) return null; return a.reduce((m,x)=> x>m?x:m, a[0]); }',
        test_cases: [
          { call_code: 'maxOf([3,1,4,1,5,9,2,6])', expected_output: '9', description: 'Несколько чисел' },
          { call_code: 'maxOf([-5,-10,-1])', expected_output: '-1', description: 'Отрицательные' },
          { call_code: 'maxOf([])', expected_output: 'null', description: 'Пустой', is_hidden: true },
          { call_code: 'maxOf([42])', expected_output: '42', description: 'Один элемент', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Уникальные значения',
        description_md: 'Напишите `unique(arr)`: массив без дубликатов, сохраняя порядок первого появления.',
        starter_code: 'function unique(arr) {\n  // ваш код\n}',
        solution_code: 'function unique(a){ return a.filter((x,i)=> a.indexOf(x)===i); }',
        test_cases: [
          { call_code: 'JSON.stringify(unique([1,2,2,3,1,4]))', expected_output: '[1,2,3,4]', description: 'С дубликатами' },
          { call_code: 'JSON.stringify(unique([]))', expected_output: '[]', description: 'Пустой' },
          { call_code: 'JSON.stringify(unique(["a","b","a"]))', expected_output: '["a","b"]', description: 'Строки', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 6 — Объекты
  // ========================================================================
  {
    position: 6, is_boss: false,
    title: 'Объекты',
    subtitle: 'Остров ключей и значений',
    description: 'Создание, чтение и изменение объектов. Деструктуризация, spread.',
    theory_md: `
# Объекты

\`\`\`js
const user = { name: 'Аня', age: 25 };
user.name;         // 'Аня'
user['age'];       // 25
user.city = 'Мск'; // добавление свойства
\`\`\`

## Методы объекта
\`\`\`js
Object.keys(user);    // ['name', 'age', 'city']
Object.values(user);  // ['Аня', 25, 'Мск']
Object.entries(user); // [['name','Аня'], ...]
\`\`\`

## Деструктуризация
\`\`\`js
const { name, age } = user;
\`\`\`

## Spread (объединение)
\`\`\`js
const extended = { ...user, role: 'admin' };
\`\`\`
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Создать пользователя',
        description_md: 'Напишите `makeUser(name, age)`: вернуть объект `{ name, age }`.',
        starter_code: 'function makeUser(name, age) {\n  // ваш код\n}',
        solution_code: 'function makeUser(name, age){ return {name, age}; }',
        test_cases: [
          { call_code: 'JSON.stringify(makeUser("Аня", 25))', expected_output: '{"name":"Аня","age":25}', description: 'Аня 25' },
          { call_code: 'JSON.stringify(makeUser("Олег", 30))', expected_output: '{"name":"Олег","age":30}', description: 'Олег 30' },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Прочитать свойство',
        description_md: 'Напишите `getProp(obj, key)`: вернуть значение свойства `key`. Если нет — вернуть `null`.',
        starter_code: 'function getProp(obj, key) {\n  // ваш код\n}',
        solution_code: 'function getProp(o,k){ return (k in o) ? o[k] : null; }',
        test_cases: [
          { call_code: 'getProp({a:1,b:2}, "a")', expected_output: '1', description: 'Ключ есть' },
          { call_code: 'getProp({a:1}, "z")', expected_output: 'null', description: 'Ключа нет' },
          { call_code: 'getProp({x:0}, "x")', expected_output: '0', description: 'Нулевое значение', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Список ключей',
        description_md: 'Напишите `keysOf(obj)`: массив ключей объекта.',
        starter_code: 'function keysOf(obj) {\n  // ваш код\n}',
        solution_code: 'function keysOf(o){ return Object.keys(o); }',
        test_cases: [
          { call_code: 'JSON.stringify(keysOf({a:1,b:2,c:3}))', expected_output: '["a","b","c"]', description: 'Три ключа' },
          { call_code: 'JSON.stringify(keysOf({}))', expected_output: '[]', description: 'Пустой', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Объединить объекты',
        description_md: 'Напишите `merge(a, b)`: новый объект с полями обоих. При конфликте выигрывает `b`. Используйте spread.',
        starter_code: 'function merge(a, b) {\n  // ваш код\n}',
        solution_code: 'function merge(a,b){ return {...a,...b}; }',
        test_cases: [
          { call_code: 'JSON.stringify(merge({a:1,b:2},{c:3}))', expected_output: '{"a":1,"b":2,"c":3}', description: 'Без конфликта' },
          { call_code: 'JSON.stringify(merge({a:1,b:2},{b:99}))', expected_output: '{"a":1,"b":99}', description: 'b выигрывает', is_hidden: true },
          { call_code: 'JSON.stringify(merge({},{x:5}))', expected_output: '{"x":5}', description: 'Пустой первый', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Сумма значений',
        description_md: 'Напишите `sumValues(obj)`: сумма всех числовых значений объекта. Нечисловые значения — пропустить.',
        starter_code: 'function sumValues(obj) {\n  // ваш код\n}',
        solution_code: 'function sumValues(o){ let s=0; for(const v of Object.values(o)) if(typeof v==="number") s+=v; return s; }',
        test_cases: [
          { call_code: 'sumValues({a:1,b:2,c:3})', expected_output: '6', description: 'Все числа' },
          { call_code: 'sumValues({a:10,b:"x",c:5})', expected_output: '15', description: 'Со строкой' },
          { call_code: 'sumValues({})', expected_output: '0', description: 'Пусто', is_hidden: true },
          { call_code: 'sumValues({a:true,b:null})', expected_output: '0', description: 'Без чисел', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 7 — DOM (работа с мок-структурами)
  // ========================================================================
  {
    position: 7, is_boss: false,
    title: 'DOM',
    subtitle: 'Остров дерева элементов',
    description: 'Структура DOM представлена объектами вида { tag, text, attrs, children }. Учимся создавать и модифицировать такие структуры.',
    theory_md: `
# DOM — дерево элементов

В настоящем браузере элементы страницы — это объекты вида
\`document.createElement('div')\`. Здесь мы моделируем DOM-элемент как обычный JS-объект:

\`\`\`js
const el = {
  tag: 'div',
  text: 'Привет',
  attrs: { id: 'main' },
  children: []
};
\`\`\`

## Типичные операции
- создать элемент: вернуть объект такого вида
- изменить свойство: присвоить новое значение в \`attrs\` или \`text\`
- добавить ребёнка: \`el.children.push(child)\`

## В браузере (для понимания)
\`\`\`js
const btn = document.createElement('button');
btn.textContent = 'Нажми';
btn.id = 'go';
document.body.appendChild(btn);
\`\`\`
Логика та же — мы просто работаем с упрощённой моделью.
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Создать элемент',
        description_md: 'Напишите `createEl(tag, text)`: вернуть `{ tag, text, attrs: {}, children: [] }`.',
        starter_code: 'function createEl(tag, text) {\n  // ваш код\n}',
        solution_code: 'function createEl(t,x){ return {tag:t,text:x,attrs:{},children:[]}; }',
        test_cases: [
          { call_code: 'JSON.stringify(createEl("div","Привет"))', expected_output: '{"tag":"div","text":"Привет","attrs":{},"children":[]}', description: 'div с текстом' },
          { call_code: 'JSON.stringify(createEl("p",""))', expected_output: '{"tag":"p","text":"","attrs":{},"children":[]}', description: 'Пустой текст', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Установить атрибут',
        description_md: 'Напишите `setAttr(el, key, value)`: положить `value` в `el.attrs[key]` и вернуть сам `el`.',
        starter_code: 'function setAttr(el, key, value) {\n  // ваш код\n}',
        solution_code: 'function setAttr(el,k,v){ el.attrs[k]=v; return el; }',
        test_cases: [
          { call_code: 'JSON.stringify(setAttr({tag:"a",text:"",attrs:{},children:[]}, "href", "/home"))',
            expected_output: '{"tag":"a","text":"","attrs":{"href":"/home"},"children":[]}', description: 'ссылка' },
          { call_code: 'JSON.stringify(setAttr({tag:"img",text:"",attrs:{src:"old"},children:[]}, "src", "new"))',
            expected_output: '{"tag":"img","text":"","attrs":{"src":"new"},"children":[]}', description: 'перезапись', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Добавить ребёнка',
        description_md: 'Напишите `appendChild(parent, child)`: добавить `child` в `parent.children` и вернуть `parent`.',
        starter_code: 'function appendChild(parent, child) {\n  // ваш код\n}',
        solution_code: 'function appendChild(p,c){ p.children.push(c); return p; }',
        test_cases: [
          { call_code: 'JSON.stringify(appendChild({tag:"ul",text:"",attrs:{},children:[]}, {tag:"li",text:"Раз",attrs:{},children:[]}))',
            expected_output: '{"tag":"ul","text":"","attrs":{},"children":[{"tag":"li","text":"Раз","attrs":{},"children":[]}]}', description: 'ul + li' },
          { call_code: '(function(){ const u = {tag:"ul",text:"",attrs:{},children:[]}; appendChild(u,{tag:"li",text:"a",attrs:{},children:[]}); appendChild(u,{tag:"li",text:"b",attrs:{},children:[]}); return u.children.length; })()',
            expected_output: '2', description: 'Два добавления', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Список из массива',
        description_md: 'Напишите `makeList(items)`: вернуть объект `ul` со списком `li` внутри, где у каждого `li` текст из массива.',
        starter_code: 'function makeList(items) {\n  // ваш код\n}',
        solution_code: 'function makeList(items){ return {tag:"ul",text:"",attrs:{},children: items.map(t => ({tag:"li",text:t,attrs:{},children:[]}))}; }',
        test_cases: [
          { call_code: 'JSON.stringify(makeList(["A","B"]))',
            expected_output: '{"tag":"ul","text":"","attrs":{},"children":[{"tag":"li","text":"A","attrs":{},"children":[]},{"tag":"li","text":"B","attrs":{},"children":[]}]}',
            description: 'Два пункта' },
          { call_code: 'makeList([]).children.length', expected_output: '0', description: 'Пустой список', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Собрать текст из дерева',
        description_md: 'Напишите `innerText(el)`: рекурсивно собрать все `text` из элемента и его потомков в одну строку через пробел (пустые строки пропускать).',
        starter_code: 'function innerText(el) {\n  // ваш код\n}',
        solution_code: 'function innerText(el){ const parts=[]; if(el.text) parts.push(el.text); for(const c of (el.children||[])) { const t = innerText(c); if(t) parts.push(t); } return parts.join(" "); }',
        test_cases: [
          { call_code: 'innerText({tag:"div",text:"Привет",attrs:{},children:[{tag:"span",text:"мир",attrs:{},children:[]}]})',
            expected_output: 'Привет мир', description: 'div + span' },
          { call_code: 'innerText({tag:"p",text:"",attrs:{},children:[{tag:"b",text:"жирно",attrs:{},children:[]}]})',
            expected_output: 'жирно', description: 'Только у потомка', is_hidden: true },
          { call_code: 'innerText({tag:"div",text:"",attrs:{},children:[]})',
            expected_output: '', description: 'Ничего нет', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 8 — События
  // ========================================================================
  {
    position: 8, is_boss: false,
    title: 'События',
    subtitle: 'Остров реакций',
    description: 'Обработчики событий, event.target, состояние через замыкания.',
    theory_md: `
# События

В браузере события — это объекты со свойствами:
\`\`\`js
{ type: 'click', target: { value: '...', id: '...' } }
\`\`\`

Обработчик — обычная функция:
\`\`\`js
function onClick(event) {
  console.log(event.target.id);
}
\`\`\`

## В реальном DOM
\`\`\`js
button.addEventListener('click', onClick);
\`\`\`

Здесь мы пишем чистые функции-обработчики и храним состояние через замыкания.
`.trim(),
    tasks: [
      {
        position: 1, points: 10,
        title: 'Извлечь id цели',
        description_md: 'Напишите `getTargetId(event)`: вернуть `event.target.id`, либо `""` если нет.',
        starter_code: 'function getTargetId(event) {\n  // ваш код\n}',
        solution_code: 'function getTargetId(e){ return e?.target?.id ?? ""; }',
        test_cases: [
          { call_code: 'getTargetId({type:"click", target:{id:"btn1"}})', expected_output: 'btn1', description: 'Есть id' },
          { call_code: 'getTargetId({type:"click", target:{}})', expected_output: '', description: 'Нет id' },
          { call_code: 'getTargetId({})', expected_output: '', description: 'Нет target', is_hidden: true },
        ],
      },
      {
        position: 2, points: 10,
        title: 'Счётчик кликов',
        description_md: 'Напишите `makeClickCounter()`: вернуть функцию-обработчик, которая при каждом вызове увеличивает внутренний счётчик и возвращает текущее значение.',
        starter_code: 'function makeClickCounter() {\n  // ваш код\n}',
        solution_code: 'function makeClickCounter(){ let n=0; return function(){ return ++n; }; }',
        test_cases: [
          { call_code: '(function(){ const h=makeClickCounter(); h(); h(); return h(); })()', expected_output: '3', description: 'Три клика' },
          { call_code: '(function(){ const h=makeClickCounter(); return h(); })()', expected_output: '1', description: 'Первый клик' },
          { call_code: '(function(){ const a=makeClickCounter(); const b=makeClickCounter(); a(); return b(); })()', expected_output: '1', description: 'Независимы', is_hidden: true },
        ],
      },
      {
        position: 3, points: 10,
        title: 'Длина ввода',
        description_md: 'Напишите `onInput(event)`: вернуть длину строки `event.target.value`. Для отсутствующего значения — `0`.',
        starter_code: 'function onInput(event) {\n  // ваш код\n}',
        solution_code: 'function onInput(e){ return (e?.target?.value ?? "").length; }',
        test_cases: [
          { call_code: 'onInput({target:{value:"hello"}})', expected_output: '5', description: 'Пять букв' },
          { call_code: 'onInput({target:{value:""}})', expected_output: '0', description: 'Пусто' },
          { call_code: 'onInput({target:{}})', expected_output: '0', description: 'Нет value', is_hidden: true },
        ],
      },
      {
        position: 4, points: 10,
        title: 'Фильтр по типу',
        description_md: 'Напишите `byType(events, type)`: вернуть массив событий, у которых `event.type === type`.',
        starter_code: 'function byType(events, type) {\n  // ваш код\n}',
        solution_code: 'function byType(e,t){ return e.filter(x => x.type===t); }',
        test_cases: [
          { call_code: 'JSON.stringify(byType([{type:"click"},{type:"keyup"},{type:"click"}], "click"))',
            expected_output: '[{"type":"click"},{"type":"click"}]', description: 'Два клика' },
          { call_code: 'JSON.stringify(byType([{type:"click"}], "blur"))',
            expected_output: '[]', description: 'Нет совпадений', is_hidden: true },
        ],
      },
      {
        position: 5, points: 10,
        title: 'Делегирование событий',
        description_md: 'Напишите `delegate(handlers)(event)`: `handlers` — объект вида `{ click: fn, input: fn, ... }`. Функция-результат принимает событие и вызывает соответствующий обработчик, передавая ему событие. Возвращает результат обработчика, либо `null` если тип не зарегистрирован.',
        starter_code: 'function delegate(handlers) {\n  // ваш код\n}',
        solution_code: 'function delegate(h){ return function(e){ const f = h[e.type]; return f ? f(e) : null; }; }',
        test_cases: [
          { call_code: 'delegate({ click: e => e.target.id, input: e => e.target.value })({type:"click", target:{id:"x"}})',
            expected_output: 'x', description: 'click обработчик' },
          { call_code: 'delegate({ click: e => "c", input: e => "i" })({type:"input", target:{}})',
            expected_output: 'i', description: 'input обработчик' },
          { call_code: 'delegate({ click: () => 1 })({type:"blur", target:{}})',
            expected_output: 'null', description: 'Неизвестный тип', is_hidden: true },
        ],
      },
    ],
  },

  // ========================================================================
  // Остров 9 — Финальный интеграционный босс
  // ========================================================================
  {
    position: 9, is_boss: true,
    title: 'Финальный босс',
    subtitle: 'Остров интеграции',
    description: 'Комплексные задачи, требующие комбинации навыков всех предыдущих островов.',
    theory_md: `
# Финальный босс

Здесь вас ждут задачи, которые объединяют всё, чему вы научились:
переменные, условия, циклы, функции, массивы, объекты и обработчики событий.

**Совет:** декомпозируйте задачу — разбейте её на маленькие шаги.
Каждый шаг — это либо фильтрация, либо преобразование, либо сбор результата.

Удачи, герой! 🗡
`.trim(),
    tasks: [
      {
        position: 1, points: 20,
        title: 'Статистика строки',
        description_md: 'Напишите `statsOf(str)`: вернуть объект `{ length, words, vowels }`, где `length` — длина, `words` — количество слов (разделитель — пробел, пустые не считать), `vowels` — количество русских гласных.',
        starter_code: 'function statsOf(str) {\n  // ваш код\n}',
        solution_code: 'function statsOf(s){ const v="аеёиоуыэюя"; const words = s.split(" ").filter(Boolean).length; let vowels=0; for(const ch of s.toLowerCase()) if(v.includes(ch)) vowels++; return {length:s.length, words, vowels}; }',
        test_cases: [
          { call_code: 'JSON.stringify(statsOf("Привет мир"))', expected_output: '{"length":10,"words":2,"vowels":3}', description: 'Привет мир' },
          { call_code: 'JSON.stringify(statsOf(""))', expected_output: '{"length":0,"words":0,"vowels":0}', description: 'Пусто' },
          { call_code: 'JSON.stringify(statsOf("Я  иду"))', expected_output: '{"length":6,"words":2,"vowels":3}', description: 'Двойной пробел', is_hidden: true },
          { call_code: 'JSON.stringify(statsOf("ёж"))', expected_output: '{"length":2,"words":1,"vowels":1}', description: 'С буквой ё', is_hidden: true },
        ],
      },
      {
        position: 2, points: 20,
        title: 'Группировка по ключу',
        description_md: 'Напишите `groupBy(arr, key)`: сгруппировать массив объектов по значению свойства `key`. Вернуть объект `{ значение: [элементы, ...] }`.',
        starter_code: 'function groupBy(arr, key) {\n  // ваш код\n}',
        solution_code: 'function groupBy(a,k){ const r={}; for(const x of a){ const v=x[k]; (r[v] ||= []).push(x); } return r; }',
        test_cases: [
          { call_code: 'JSON.stringify(groupBy([{t:"a",n:1},{t:"b",n:2},{t:"a",n:3}], "t"))',
            expected_output: '{"a":[{"t":"a","n":1},{"t":"a","n":3}],"b":[{"t":"b","n":2}]}', description: 'По t' },
          { call_code: 'JSON.stringify(groupBy([], "x"))', expected_output: '{}', description: 'Пустой', is_hidden: true },
        ],
      },
      {
        position: 3, points: 20,
        title: 'Корзина покупок',
        description_md: 'Напишите `cartTotal(items, discount)`: `items` — массив `{ name, price, qty }`. Вернуть сумму `price*qty` по всем позициям, помноженную на `(1 - discount)`. `discount` в диапазоне 0..1. Результат округлите до 2 знаков.',
        starter_code: 'function cartTotal(items, discount) {\n  // ваш код\n}',
        solution_code: 'function cartTotal(a,d){ const s = a.reduce((acc,x)=> acc + x.price*x.qty, 0); return Math.round(s*(1-d)*100)/100; }',
        test_cases: [
          { call_code: 'cartTotal([{name:"a",price:100,qty:2},{name:"b",price:50,qty:1}], 0)', expected_output: '250', description: 'Без скидки' },
          { call_code: 'cartTotal([{name:"a",price:100,qty:1}], 0.1)', expected_output: '90', description: '10% скидка' },
          { call_code: 'cartTotal([], 0.5)', expected_output: '0', description: 'Пустая корзина', is_hidden: true },
          { call_code: 'cartTotal([{name:"x",price:33,qty:3}], 0.1)', expected_output: '89.1', description: 'Округление', is_hidden: true },
        ],
      },
      {
        position: 4, points: 20,
        title: 'TODO-менеджер',
        description_md: 'Напишите `makeTodoList()`: вернуть объект с методами:\n- `add(title)` — добавить задачу, вернуть её id (автоинкремент с 1)\n- `toggle(id)` — переключить флаг done\n- `remaining()` — количество невыполненных\n- `list()` — массив всех задач в виде `[{id,title,done}, ...]`',
        starter_code: 'function makeTodoList() {\n  // ваш код\n}',
        solution_code: `function makeTodoList(){
  const items = []; let nextId = 1;
  return {
    add(t){ const id = nextId++; items.push({id,title:t,done:false}); return id; },
    toggle(id){ const x = items.find(i=>i.id===id); if(x) x.done = !x.done; },
    remaining(){ return items.filter(i=>!i.done).length; },
    list(){ return items.map(i=>({...i})); },
  };
}`,
        test_cases: [
          { call_code: '(function(){ const l=makeTodoList(); l.add("a"); l.add("b"); return l.remaining(); })()', expected_output: '2', description: 'Добавили две' },
          { call_code: '(function(){ const l=makeTodoList(); const id=l.add("x"); l.toggle(id); return l.remaining(); })()', expected_output: '0', description: 'Одна выполнена' },
          { call_code: '(function(){ const l=makeTodoList(); l.add("a"); l.add("b"); return JSON.stringify(l.list()); })()', expected_output: '[{"id":1,"title":"a","done":false},{"id":2,"title":"b","done":false}]', description: 'Список', is_hidden: true },
          { call_code: '(function(){ const l=makeTodoList(); l.add("a"); l.toggle(1); l.toggle(1); return l.remaining(); })()', expected_output: '1', description: 'Два раза toggle', is_hidden: true },
        ],
      },
      {
        position: 5, points: 20,
        title: 'Валидация формы',
        description_md: 'Напишите `validate(form)`: `form` — объект `{ email, password, age }`. Вернуть массив ошибок (строк) в следующем порядке проверок:\n1. `email` должен содержать `@` — ошибка: `"Некорректный email"`\n2. `password` длиной не менее 8 символов — ошибка: `"Пароль слишком короткий"`\n3. `age` должен быть числом >= 18 — ошибка: `"Возраст должен быть не менее 18"`\n\nЕсли всё ок — пустой массив.',
        starter_code: 'function validate(form) {\n  // ваш код\n}',
        solution_code: `function validate(f){
  const errors = [];
  if (typeof f.email !== 'string' || !f.email.includes('@')) errors.push('Некорректный email');
  if (typeof f.password !== 'string' || f.password.length < 8) errors.push('Пароль слишком короткий');
  if (typeof f.age !== 'number' || f.age < 18) errors.push('Возраст должен быть не менее 18');
  return errors;
}`,
        test_cases: [
          { call_code: 'JSON.stringify(validate({email:"a@b.c", password:"12345678", age:25}))', expected_output: '[]', description: 'Всё ок' },
          { call_code: 'JSON.stringify(validate({email:"abc", password:"12345678", age:25}))', expected_output: '["Некорректный email"]', description: 'Email без @' },
          { call_code: 'JSON.stringify(validate({email:"a@b", password:"123", age:17}))', expected_output: '["Пароль слишком короткий","Возраст должен быть не менее 18"]', description: 'Две ошибки', is_hidden: true },
          { call_code: 'JSON.stringify(validate({email:"x", password:"x", age:1}))', expected_output: '["Некорректный email","Пароль слишком короткий","Возраст должен быть не менее 18"]', description: 'Все три', is_hidden: true },
        ],
      },
    ],
  },
];