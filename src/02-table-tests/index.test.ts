import { Action, simpleCalculator } from './index';

const a = 4;
const b = 2;

const commonTestCases = [
  {
    a,
    b,
    message: 'should add two numbers',
    action: Action.Add,
    expected: 6,
  },
  {
    a,
    b,
    message: 'should subtract two numbers',
    action: Action.Subtract,
    expected: 2,
  },
  {
    a,
    b,
    message: 'should multiply two numbers',
    action: Action.Multiply,
    expected: 8,
  },
  {
    a,
    b,
    message: 'should divide two numbers',
    action: Action.Divide,
    expected: 2,
  },
  {
    a,
    b,
    message: 'should exponentiate two numbers',
    action: Action.Exponentiate,
    expected: 16,
  },
];

const invalidTestCases = [
  { a, b, message: 'should return null for invalid action', action: '%' },
  {
    a: '4',
    b: '2',
    message: 'should return null for invalid arguments',
    action: Action.Add,
  },
];

describe('simpleCalculator tests', () => {
  test.each(commonTestCases)('$message', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });

  test.each(invalidTestCases)('$message', ({ a, b, action }) => {
    expect(simpleCalculator({ a, b, action })).toBeNull();
  });
});
