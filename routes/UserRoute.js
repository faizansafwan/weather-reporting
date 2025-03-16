const express = require('express');
const { createUser, getUsers, getUserById, UpdateUserLocation, LoginUser } = require('../controllers/UserController.js');
const { protect } = require('../middlewares/auth.js');


const router = express.Router();

router.post('/', createUser);
router.post('/login/', LoginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/location/:id', protect, UpdateUserLocation);

module.exports = router;