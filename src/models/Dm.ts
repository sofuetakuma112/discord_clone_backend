import mongoose from 'mongoose';

export const dmSchema = new mongoose.Schema({
  userIds: Array,
  created: Date,
  lastUpdated: Date,
});

export const dmModel = mongoose.model('Dm', dmSchema);
