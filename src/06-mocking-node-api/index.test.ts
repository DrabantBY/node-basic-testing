import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

const callback = jest.fn();
const timeout = 1000;
const interval = 3;

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

describe('doStuffByTimeout', () => {
  let spyOnTimeout: jest.SpyInstance;

  beforeEach(() => {
    spyOnTimeout = jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(callback, timeout);
    expect(spyOnTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let spyOnInterval: jest.SpyInstance;

  beforeEach(() => {
    spyOnInterval = jest.spyOn(global, 'setInterval');
  });

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(callback, timeout);
    expect(spyOnInterval).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval * timeout);
    expect(callback).toHaveBeenCalledTimes(interval);
  });
});

describe('readFileAsynchronously', () => {
  const fileName = 'file.txt';
  const fileText = 'file text';

  const mockExistsSync = jest.mocked(existsSync);
  const mockReadFile = jest.mocked(readFile);

  test('should call join with pathToFile', async () => {
    const spyOnJoin = jest.spyOn(path, 'join');
    await readFileAsynchronously(fileName);
    expect(spyOnJoin).toHaveBeenCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    mockExistsSync.mockReturnValueOnce(false);
    await expect(readFileAsynchronously(fileName)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockExistsSync.mockReturnValueOnce(true);
    mockReadFile.mockResolvedValueOnce(Buffer.from(fileText));
    await expect(readFileAsynchronously(fileName)).resolves.toBe(fileText);
  });
});
