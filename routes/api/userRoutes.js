const router = require('express').Router();

const {
    getAllUsers,
    getSingleUser,
    createUser,
    editUser,
} = require('../../controllers/userController');

// /api/users
router.route('/')
    .get(getAllUsers)
    .post(createUser);

// /api/users/:userId
router.route('/:userId')
    .get(getSingleUser)
    .put(editUser);


module.exports = router;