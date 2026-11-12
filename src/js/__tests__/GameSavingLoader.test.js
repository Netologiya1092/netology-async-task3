import GameSavingLoader from '../GameSavingLoader';
import read from '../reader';

jest.mock('../reader');

beforeEach(() => {
  jest.resetAllMocks();
});

test('GameSavingLoader should resolve with GameSaving object', async () => {
  const mockData = '{"id":9,"created":1546300800,"userInfo":{"id":1,"name":"Hitman","level":10,"points":2000}}';
  const buffer = new ArrayBuffer(mockData.length * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < mockData.length; i += 1) {
    bufferView[i] = mockData.charCodeAt(i);
  }

  read.mockResolvedValue(buffer);

  const expected = {
    id: 9,
    created: 1546300800,
    userInfo: {
      id: 1,
      name: 'Hitman',
      level: 10,
      points: 2000,
    },
  };

  const saving = await GameSavingLoader.load();
  expect(saving).toEqual(expected);
});

test('GameSavingLoader should reject with error when read fails', async () => {
  read.mockRejectedValue(new Error('File read error'));

  await expect(GameSavingLoader.load()).rejects.toThrow('File read error');
});
