import { Schema, model, Document } from 'mongoose';

// Define an interface for the Category model
interface ICategory extends Document {
  name: string;
}

// Define the Category schema
const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create the Category model
const Category = model<ICategory>('Category', categorySchema);
export default Category;