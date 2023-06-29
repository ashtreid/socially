const router = require('express').Router();

const {
    getAllUsers,
    getSingleUser,
    createUser,
    editUser,
    deleteUser,
    addToFriendList,
    removeFromFriendList
} = require('../../controllers/userController');

// /api/users
router.route('/')
    .get(getAllUsers)
    .post(createUser);

// /api/users/:userId
router.route('/:userId')
    .get(getSingleUser)
    .put(editUser)
    .delete(deleteUser);

// /api/users/:userId/friends/:friendId = POST addToFriendList + DELETE friend from user
// NOTE: to avoid idempotency (duplicating friends), use POST, not PUT 
router.route('/:userId/friends/:friendId')
    .post(addToFriendList)
    .delete(removeFromFriendList);

module.exports = router;