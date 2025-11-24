const db = require('../../config/database');

jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

const { saveFavorite, deleteFavorite } = require('../../controllers/pokemonController');

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('pokemonController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFavorite', () => {
    it('inserts favorite and returns 201', async () => {
      const req = { body: { id: 1, pokemon: 'pikachu' } };
      const res = buildRes();
      const next = jest.fn();

      db.query.mockResolvedValue({ rows: [{ pokemon: 'pikachu', user_id: 1 }] });

      await saveFavorite(req, res, next);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO favorite/),
        ['pikachu', 1]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Pokemon añadido a favoritos.',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('deleteFavorite', () => {
    it('deletes favorite and returns 201', async () => {
      const req = { body: { id: 1, pokemon: 'pikachu' } };
      const res = buildRes();
      const next = jest.fn();

      db.query.mockResolvedValue({ rowCount: 1 });

      await deleteFavorite(req, res, next);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/delete from favorite/i),
        ['pikachu', 1]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Pokemon eliminado de favoritos.',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

