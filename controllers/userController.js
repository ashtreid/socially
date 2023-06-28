const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const countUsers = async () => {
    const numberUserCount = await User.aggregate()
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

            res.json(userObj);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // GET a single user by its _id and populated thought and friend data
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');
            if (!user) {
                return res.status(404).json({ message: 'Cannot find a user with that id when trying to create' })
            }

            res.json({
                user,
                // TODO: thoughts and friends are in the userSchema -- do I have to do anything else for it?
                //thought
                // friends,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // POST a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // PUT to update a user by its _id
    async editUser(req, res) {
        console.log('Editing a user');
        console.log('USER REQ BODY:', req.body);

        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                req.body,
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                .status(404)
                .json({ message: 'Could not find a user with that id when trying to edit' })
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
};

