import vm from 'node:vm';
import { translateError } from './errorMap.js';

const TIMEOUT_MS = 2000;

// Преамбула выполняется перед пользовательским кодом в изолированном контексте.
// Объявляет __stringify, __logs и console, перехватывающий вывод в буфер.
const HARNESS_PREAMBLE = `
var __logs = [];
function __stringify(v) {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'function') return '[Function]';
  try {
    var s = JSON.stringify(v);
    return s === undefined ? String(v) : s;
  } catch (_) { return String(v); }
}
var console = {
  log:  function(){ __logs.push([].map.call(arguments, __stringify).join(' ')); },
  info: function(){ __logs.push([].map.call(arguments, __stringify).join(' ')); },
  warn: function(){ __logs.push([].map.call(arguments, __stringify).join(' ')); },
  error:function(){ __logs.push([].map.call(arguments, __stringify).join(' ')); },
};
var __result;
`;

function buildProgram(userCode, callCode) {
  return `${HARNESS_PREAMBLE}
${userCode}
;__result = (${callCode});
JSON.stringify({ result: __stringify(__result), logs: __logs });`;
}

/**
 * runOne — запуск одного тест-кейса в изолированном V8-контексте через vm.
 * Контекст создаётся пустым — у пользовательского кода нет доступа
 * ни к process, ни к require, ни к файловой системе; только стандартные JS-глобали.
 * Таймаут V8 прерывает бесконечные циклы.
 */
export async function runOne(userCode, testCase) {
  try {
    const context = vm.createContext(Object.create(null));
    const program = buildProgram(userCode, testCase.call_code);
    const script = new vm.Script(program, { filename: 'solution.js' });
    const raw = script.runInContext(context, { timeout: TIMEOUT_MS });
    const parsed = JSON.parse(String(raw));
    const actual = String(parsed.result);
    const expected = String(testCase.expected_output);
    return { passed: actual === expected, actual, expected, logs: parsed.logs };
  } catch (e) {
    return {
      passed: false,
      expected: String(testCase.expected_output),
      error: translateError(e),
    };
  }
}

/**
 * runAll — запуск набора тест-кейсов. Останавливается на первом падении.
 */
export async function runAll(userCode, testCases) {
  const results = [];
  for (const tc of testCases) {
    const r = await runOne(userCode, tc);
    results.push({ ...r, test_id: tc.id, description: tc.description, is_hidden: !!tc.is_hidden });
    if (!r.passed) break;
  }
  const allPassed = results.length === testCases.length && results.every(r => r.passed);
  return { allPassed, results };
}