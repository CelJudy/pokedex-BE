process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const { validationResult } = require('express-validator');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

jest.mock('../../services/emailService', () => ({
  sendEmail: jest.fn(),
}));

const db = require('../../config/database');
const { sendEmail } = require('../../services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const { login, register, confirmEmail } = require('../../controllers/authController');

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should log in user and return token and favorites', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'secret' },
      };
      const res = buildRes();
      const next = jest.fn();

      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      db.query
        .mockResolvedValueOnce({
          rowCount: 1,
          rows: [{ id: 1, mail: 'test@example.com', pass: 'hashed' }],
        })
        .mockResolvedValueOnce({
          rows: [{ pokemon: ['pikachu'] }],
        });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt');

      await login(req, res, next);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, email: undefined },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: 'fake-jwt',
            pokemon: ['pikachu'],
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register user, send email and respond with token', async () => {
      const req = {
        body: { email: 'new@example.com', password: 'secret' },
      };
      const res = buildRes();
      const next = jest.fn();

      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      db.query
        .mockResolvedValueOnce({ rowCount: 0 }) // user exists check
        .mockResolvedValueOnce({
          rows: [{ id: 2, mail: 'new@example.com' }],
        });

      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pass');
      jwt.sign.mockReturnValue('register-jwt');
      sendEmail.mockResolvedValue();

      await register(req, res, next);

      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(/INSERT INTO users/),
        ['new@example.com', 'hashed-pass']
      );
      expect(sendEmail).toHaveBeenCalledWith(
        'new@example.com',
        expect.any(String),
        expect.any(String)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: 'register-jwt',
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email when token is valid', async () => {
      const req = { body: { token: 'valid-token' } };
      const res = buildRes();
      const next = jest.fn();

      jwt.verify.mockReturnValue({ userId: 3 });

      db.query
        .mockResolvedValueOnce({
          rowCount: 1,
          rows: [{ id: 3, mail: 'user@example.com', active: false }],
        })
        .mockResolvedValueOnce({
          rows: [{ mail: 'user@example.com', active: true }],
        });

      await confirmEmail(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(/UPDATE users SET active = true/),
        [3]
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: { email: 'user@example.com', active: true },
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});

