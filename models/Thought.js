const { Schema, Types, model } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            max_length: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 280
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],

    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
);

thoughtSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleString();
});

reactionSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleString();
});

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;