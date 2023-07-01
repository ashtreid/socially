const router = require('express').Router();

const {
    getAllThoughts,
    getSingleThought,
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
    .get(getSingleThought)
    .put(editThought)
    .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
    .post(createReaction)

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);


module.exports = router;