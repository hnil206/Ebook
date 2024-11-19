import { Schema, model, Document } from 'mongoose';

interface IAuthor extends Document {
  name: string;
  description: string;
}

const authorSchema = new Schema<IAuthor>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },  
});

const Author = model<IAuthor>('Author', authorSchema);

export default Author;