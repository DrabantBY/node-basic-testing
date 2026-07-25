import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  const url = '/posts';
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const data = [{ id: 1, post: 'post' }];
  let spyOnGet: jest.SpiedFunction<typeof axios.Axios.prototype.get>;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.runAllTimers();
    spyOnGet = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValue({ data });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const spyOnCreate = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(url);
    expect(spyOnCreate).toHaveBeenCalledWith({
      baseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(url);
    expect(spyOnGet).toHaveBeenCalledWith(url);
  });

  test('should return response data', async () => {
    await expect(throttledGetDataFromApi(url)).resolves.toBe(data);
  });
});
