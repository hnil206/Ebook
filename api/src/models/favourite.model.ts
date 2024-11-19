import mongoose, { Schema } from 'mongoose';

const favouriteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
    },
    { timestamps: true },
);

const Favourite = mongoose.model('Favourite', favouriteSchema);
export default Favourite;