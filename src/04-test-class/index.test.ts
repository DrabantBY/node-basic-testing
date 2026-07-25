import { random } from 'lodash';
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  const mockRandomFn = jest.mocked(random);

  const INITIAL_BALANCE = 100;
  const AMOUNT = 50;

  let account: BankAccount;
  let target: BankAccount;

  beforeEach(() => {
    account = getBankAccount(INITIAL_BALANCE);
    target = getBankAccount(0);
    mockRandomFn.mockReset();
  });

  test('should create account with initial balance', () => {
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw error when withdrawing more than balance', () => {
    expect(() => account.withdraw(INITIAL_BALANCE + AMOUNT)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(INITIAL_BALANCE + AMOUNT, target)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(AMOUNT, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    expect(account.deposit(AMOUNT)).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE + AMOUNT);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(AMOUNT)).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - AMOUNT);
  });

  test('should transfer money', () => {
    expect(account.transfer(AMOUNT, target)).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - AMOUNT);
    expect(target.getBalance()).toBe(AMOUNT);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    mockRandomFn.mockReturnValueOnce(AMOUNT).mockReturnValueOnce(1);
    await expect(account.fetchBalance()).resolves.toBe(AMOUNT);
  });

  test('fetchBalance should return null when request failed', async () => {
    mockRandomFn.mockReturnValueOnce(AMOUNT).mockReturnValueOnce(0);
    await expect(account.fetchBalance()).resolves.toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    mockRandomFn.mockReturnValueOnce(AMOUNT).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(AMOUNT);
  });

  test('should throw error if fetchBalance returned null', async () => {
    mockRandomFn.mockReturnValueOnce(AMOUNT).mockReturnValueOnce(0);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
