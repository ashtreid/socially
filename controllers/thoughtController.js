const { User, Thought } = require('../models');

const countThoughts = async () => {
    const numberThoughtCount = await Thought
        .aggregate()
        .count('thoughtCount');
    return numberThoughtCount;
}

module.exports = {
    // GET all thoughts
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find();

            const thoughtObj = {
                thoughts,
                countThoughts: await countThoughts(),
            };

            res.json({ thoughtObj, message: 'Retrieved all thoughts successfully' });
        } catch (err) {
            console.log('ERROR! getAllThoughts:', err);
            return res.status(500).json(err);
        }
    },

    // GET a single thought by its _id and populated thought and friend data
    async getSingleThought(req, res) {
        try {
            const thoughtId = req.params.thoughtId;

            const thought = await Thought.findById(thoughtId)
                .select('-__v')
                .populate('reactions');
            if (!thought) {
                return res.status(404).json({ message: 'Cannot find a thought with that id' })
            }

            res.json({thought, message: 'Retrieved a thought plus any associated reactions successfully'});
        } catch (err) {
            console.log('ERROR! getSingleThought:', err);
            return res.status(500).json(err);
        }
    },

    // POST to create a new thought and pushes the created thought's _id to the associated user's thoughts array field
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Cannot find user to associate with the thought' });
            }

            res.json({
                thought,
                message: 'Thought created successfully'
            });


        } catch (err) {
            console.log('ERROR! createThought:', err);
            return res.status(500).json(err);
        }
    },

    // PUT to update a thought by its _id
    async editThought(req, res) {
        try {
            const thoughtId = req.params.thoughtId;

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                req.body,
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'Could not find a thought with that id when trying to edit' })
            }

            res.json({
                thought,
                message: 'Thought updated successfully'
            });
        } catch (err) {
            console.log('ERROR! editThought:', err);
            return res.status(500).json(err);
        }
    },

    // DELETE to remove a thought by its _id
    async deleteThought(req, res) {
        try {
            const thoughtId = req.params.thoughtId;

            const thought = await Thought.findByIdAndDelete(thoughtId);

            if (!thought) {
                return res.status(404).json({ message: `Cannot find thought to delete` });
            }

            res.json({
                thought,
                message: 'Thought deleted successfully'
            });
        } catch (err) {
            console.log('ERROR! deleteThought:', err);
            res.status(500).json(err);
        }
    },

    // POST to create a reaction stored in a single thought's reactions array field
    async createReaction(req, res) {
        try {
            const { thoughtId } = req.params;
            const { reactionBody, username } = req.body;

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: { reactionBody, username } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'Cannot find thought with that id' });
            }

            res.json({
                thought,
                message: 'Reaction created successfully'
            });
        } catch (err) {
            console.log('ERROR! createReaction:', err);
            res.status(500).json(err);
        }
    },

    // DELETE to pull and remove a reaction by the reaction's reactionId value
    async removeReaction(req, res) {
        try {
            const { thoughtId, reactionId } = req.params;

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: reactionId } } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'Cannot find thought with that id' });
            }

            res.json({
                thought,
                message: 'Reaction removed successfully'
            });
        } catch (err) {
            console.log('ERROR! removeReaction:', err);
            res.status(500).json(err);
        }
    },
};