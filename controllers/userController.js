// const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
const mongoose = require('mongoose');


const countUsers = async () => {
    const numberUserCount = await User
        .aggregate()
        .count('userCount');
    return numberUserCount;
}

module.exports = {
    // GET all users
    async getAllUsers(req, res) {
        try {
            const users = await User.find();

            const userObj = {
                users,
                countUsers: await countUsers(),
            };

            res.json({
                userObj,
                message: 'Retrieved all users successfully'
            });
        } catch (err) {
            console.log('ERROR! getAllUsers:', err);
            return res.status(500).json(err);
        }
    },

    // GET a single user by its _id and populated thought and friend data
    async getSingleUser(req, res) {
        try {
            const userId = req.params.userId;
            console.log("USER ID", userId);

            // const user = await User.findById(userId)
            const user = await User.findOne({ _id: userId })
                .select('-__v')
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'Cannot find a user with that id' })
            }

            res.json({
                user,
                message: 'Retrieved a user plus any associated thoughts and friends successfully'
            });
        } catch (err) {
            console.log('ERROR! getSingleUser:', err);
            return res.status(500).json(err);
        }
    },

    // POST a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json({
                user,
                message: 'User created successfully'
            });
        } catch (err) {
            console.log('ERROR! createUser:', err);
            return res.status(500).json(err);
        }
    },

    // PUT to update a user by its _id
    async editUser(req, res) {
        console.log('Editing a user');
        console.log('USER REQ BODY:', req.body);

        try {
            const userId = req.params.userId;

            const user = await User.findByIdAndUpdate(
                userId,
                req.body,
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Could not find a user with that id when trying to edit' })
            }

            res.json({
                user,
                message: 'User updated successfully'
            });
        } catch (err) {
            console.log('ERROR! editUser:', err);
            return res.status(500).json(err);
        }
    },

    // DELETE to remove a user by its _id
    async deleteUser(req, res) {
        try {
            const userId = req.params.userId;
            const user = await User.findOneAndDelete({ _id: userId });

            if (!user) {
                return res.status(404).json({ message: `Cannot find user to delete` });
            }

            const thoughts = await Thought.deleteMany({ _id: {$in: user.thoughts} });
            
            if (thoughts.deletedCount === 0) {
                return res.json({ message: 'User deleted, but no thoughts associated with the user to delete' })
            }

            res.json({
                user,
                thoughts,
                message: 'User and associated thoughts deleted successfully'
            });
        } catch (err) {
            console.log('ERROR! deleteUser:', err);
            res.status(500).json(err);
        }
    },

    // POST to add a new friend to a user's friend list
    async addToFriendList(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!friendId) {
                return res.status(400).json({ message: 'Cannot add friend - Missing friendId' });
            }

            const friend = await User.findById(friendId);

            if (!friend) {
                return res.status(404).json({ message: 'Cannot add friend - Cannot find friend with that id' });
            }

            const checkUser = await User.findById(userId);

            if (checkUser.friends.includes(friendId)) {
                return res.status(400).json({ message: 'Friend already exists in the user\'s friend list' });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { friends: friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Cannot find user with that id' })
            }

            res.json({
                user,
                message: 'Friend added successfully'
            });
        } catch (err) {
            console.log('ERROR! addToFriendList:', err);
            res.status(500).json(err);
        }
    },

    // DELETE to remove a friend from a user's friend list
    async removeFromFriendList(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!friendId) {
                return res.status(400).json({ message: 'Cannot remove - Missing friendId' });
            }

            const friend = await User.findById(friendId);

            if (!friend) {
                return res.status(404).json({ message: 'Cannot remove - Cannot find friend with that id' });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { friends: friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Cannot find user with that id' })
            }

            res.json({
                user,
                message: 'Friend deleted successfully'
            });
        } catch (err) {
            console.log('ERROR! removeFromFriendList:', err);
            res.status(500).json(err);
        }
    },
};

