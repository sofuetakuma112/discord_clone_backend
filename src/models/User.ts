// External Dependancies
import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  socket_id: String,
  is_anonymous: Boolean,
  name: String,
  email: String,
  password: String,
  rememberToken: String,
  imageConvertedToBase64: String,
});

// modelの第一引数がコレクション名(複数形の名前で作成される)
export const userModel = mongoose.model('User', userSchema);
