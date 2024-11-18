const authController = require('../controllers/authController');
const User = require('../models/User');
jest.mock('../models/User');

describe('Auth Controller - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Forgot Password - Success', async () => {
        const req = { body: { email: 'john.doe@example.com' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockUser = { save: jest.fn() };
        User.findOne.mockResolvedValue(mockUser);

        await authController.forgotPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Password reset token sent' }));
    });

    test('Forgot Password - User Not Found', async () => {
        const req = { body: { email: 'nonexistent@example.com' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await authController.forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
});
