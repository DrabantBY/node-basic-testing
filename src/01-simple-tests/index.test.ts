import { Action, simpleCalculator } from './index';

const a = 4;
const b = 2;

const EXPECTED = {
  [Action.Add]: 6,
  [Action.Subtract]: 2,
  [Action.Divide]: 2,
  [Action.Multiply]: 8,
  [Action.Exponentiate]: 16,
};

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a, b, action: Action.Add })).toBe(
      EXPECTED[Action.Add],
    );
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a, b, action: Action.Subtract })).toBe(
      EXPECTED[Action.Subtract],
    );
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a, b, action: Action.Multiply })).toBe(
      EXPECTED[Action.Multiply],
    );
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a, b, action: Action.Divide })).toBe(
      EXPECTED[Action.Divide],
    );
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a, b, action: Action.Exponentiate })).toBe(
      EXPECTED[Action.Exponentiate],
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a, b, action: '%' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({ a: '4', b: '2', action: Action.Add })).toBeNull();
  });
});
