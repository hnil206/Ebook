import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
    title: {type: String},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {type: Date, default: Date.now},
    image: {type: String},
    content: {type: String},
    // comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    isActivate: {type: Boolean, default: false},
    // tags: [PostTagSchema]
}, {
    timestamps: true
},);

postSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
postSchema.set('toObject', {virtuals: true});
postSchema.set('toJSON', {virtuals: true});
const Post = mongoose.model('Post', postSchema);
export default Post;
