const router = require('express').Router();

const {
    getAllThoughts,
    createThought,
    editThought,
    deleteThought,
    createReaction,
    removeReaction
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(getAllThoughts)
    .post(createThought);

router.route('/:thoughtId')
    .get(editThought)
    .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
    .post(createReaction)
    .delete(removeReaction);

module.exports = router;