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

router.route('/')
    .get(getAllThoughts)
    .post(createThought);

router.route('/:thoughtId')
    .get(getSingleThought)
    .put(editThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(createReaction)

router.route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;