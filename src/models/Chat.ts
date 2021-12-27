import mongoose from 'mongoose';

export const chatSchema = new mongoose.Schema({
  parent_id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  message: String,
  created: Date,
  imageData: String,
  imageTitle: String,
});

export const chatModel = mongoose.model('Chat', chatSchema);
