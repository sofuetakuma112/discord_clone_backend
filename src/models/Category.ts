// External Dependancies
import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
  name: String,
});

// modelの第一引数がコレクション名(複数形の名前で作成される)
export const categoryModel = mongoose.model('Category', categorySchema);
