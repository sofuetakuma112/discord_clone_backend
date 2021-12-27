import boom from 'boom';

import { dmModel } from '../models/Dm';

export const createDm = async (req) => {
  const request = req.body === undefined ? req : req.body;
  const result = await dmModel.find({
    userIds: { $size: request.userIds.length, $all: request.userIds },
  });
  if (result.length !== 0) return result[0];
  const dm = new dmModel({
    ...request,
    created: new Date(),
  });
  const newDm = await dm.save();
  return newDm;
};

export const getAllDm = async () => {
  const dms = await dmModel.find();
  return dms;
};
