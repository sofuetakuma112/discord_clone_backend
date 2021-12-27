import boom from 'boom';

import { channelModel } from '../models/Channel';

// 単一のカテゴリーにおける全てのチャンネルの取得
export const getChannelsCategory = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const channels = await channelModel.find({ category_id: id });
    return channels;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const getSingleChannel = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const channels = await channelModel.findById(id);
    return channels;
  } catch (error) {
    throw boom.boomify(error);
  }
};

// requestにcategory_idも含める
export const createNewChannel = async (req) => {
  try {
    const request = req.body === undefined ? req : req.body;
    const channel = new channelModel({
      ...request,
      connectingUserIds: [],
    });
    const newChannel = await channel.save();
    return newChannel;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const updateChannel = async (req) => {
  try {
    const request = req.body === undefined ? req : req.body;
    if (request.type === '2') {
      // ボイスチャンネルにユーザーが接続しようとしている
      const result = await channelModel.updateOne(
        { _id: request.channel_id },
        {
          $addToSet: {
            connectingUserIds: request.user_id,
          },
        }
      );
      const updatedChannel = await channelModel.findById(request.channel_id);
      return updatedChannel;
    }
    return;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const deleteUserFromVoiceChannel = async (req) => {
  try {
    const request = req.body === undefined ? req : req.body;
    const result = await channelModel.updateOne(
      { _id: request.channel_id },
      {
        $pull: {
          connectingUserIds: request.user_id,
        },
      }
    );
    return result;
  } catch (error) {
    throw boom.boomify(error);
  }
};
