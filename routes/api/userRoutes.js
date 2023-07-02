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

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:userId')
    .get(getSingleUser)
    .put(editUser)
    .delete(deleteUser);

router.route('/:userId/friends/:friendId')
    .post(addToFriendList)
    .delete(removeFromFriendList);

module.exports = router;