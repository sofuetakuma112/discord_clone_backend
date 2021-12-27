import mongoose from 'mongoose';

export const channelSchema = new mongoose.Schema({
  category_id: mongoose.Schema.Types.ObjectId,
  name: String,
  type: String,
  connectingUserIds: Array,
});

export const channelModel = mongoose.model('Channel', channelSchema);
