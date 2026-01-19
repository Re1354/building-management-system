const router = require('express').Router();

const { register, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

router.get('/me', authMiddleware, me);

module.exports = router;
